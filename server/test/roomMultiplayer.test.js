import { describe, it, expect } from 'vitest';
import { Room } from '../src/game/Room.js';
import { RoomManager } from '../src/services/RoomManager.js';
import { ROOM_STATUS } from '../../shared/constants/gameConstants.js';

describe('Multiplayer & Room State Management', () => {
  it('creates a room with host and default settings', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'host-token',
      name: 'Alice',
      avatar: '🦊',
    });

    expect(room.code).toBeDefined();
    expect(room.code.length).toBe(6);
    expect(room.status).toBe(ROOM_STATUS.LOBBY);
    expect(room.hostSessionToken).toBe('host-token');
    expect(room.players.size).toBe(1);

    const host = room.players.get('host-token');
    expect(host.name).toBe('Alice');
    expect(host.isHost).toBe(true);
    expect(host.card).toHaveLength(25);
  });

  it('allows second player to join room and enforces max player limits', () => {
    const manager = new RoomManager();
    const room = manager.createRoom(
      {
        socketId: 'sock-1',
        sessionToken: 'host-token',
        name: 'Alice',
      },
      { maxPlayers: 2 }
    );

    // Player 2 joins
    const p2 = room.addPlayer('sock-2', 'token-2', 'Bob', '🐼');
    expect(p2.name).toBe('Bob');
    expect(p2.isHost).toBe(false);
    expect(room.players.size).toBe(2);

    // Player 3 tries to join full room
    expect(() => {
      room.addPlayer('sock-3', 'token-3', 'Charlie', '🦁');
    }).toThrow('Room is full');
  });

  it('rejects joining invalid room code', () => {
    const manager = new RoomManager();
    expect(manager.getRoom('INVALID')).toBeNull();
  });

  it('starts game, calls numbers, and synchronizes automatically marked cards', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'host-token',
      name: 'Alice',
    });
    room.addPlayer('sock-2', 'token-2', 'Bob', '🐼');

    // Non-host starting the game check can be verified by hostSessionToken check
    expect(room.hostSessionToken).not.toBe('token-2');

    // Host starts game
    let calledEvents = [];
    room.startGame(
      (callResult) => calledEvents.push(callResult),
      (gameOverResult) => {}
    );

    expect(room.status).toBe(ROOM_STATUS.PLAYING);
    expect(room.callerPool.length).toBe(75);

    // Advance manually by invoking callNextNumber
    const call1 = room.callNextNumber();
    expect(call1.gameOver).toBe(false);
    expect(call1.number).toBeGreaterThanOrEqual(1);
    expect(call1.number).toBeLessThanOrEqual(75);
    expect(room.calledNumbers).toHaveLength(1);
    expect(room.calledNumbers[0]).toBe(call1.number);

    // Verify player updates are generated
    expect(call1.playerUpdates).toHaveLength(2);
    call1.playerUpdates.forEach((pu) => {
      expect(typeof pu.numberMarked).toBe('boolean');
    });

    room.destroy();
  });

  it('supports pause and resume of game', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'host-token',
      name: 'Alice',
    });

    room.startGame();
    expect(room.status).toBe(ROOM_STATUS.PLAYING);

    const paused = room.pauseGame();
    expect(paused).toBe(true);
    expect(room.status).toBe(ROOM_STATUS.PAUSED);

    const resumed = room.resumeGame();
    expect(resumed).toBe(true);
    expect(room.status).toBe(ROOM_STATUS.PLAYING);

    room.destroy();
  });

  it('handles player disconnection grace period and reconnection preserving card progress', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'host-token',
      name: 'Alice',
    });
    const bob = room.addPlayer('sock-2', 'token-2', 'Bob', '🐼');
    const bobsNumbers = bob.card.map((c) => c.number);

    // Bob disconnects
    room.handleDisconnect('token-2');
    expect(bob.isOnline).toBe(false);
    expect(bob.disconnectTimer).not.toBeNull();

    // Bob reconnects with new socket ID
    const reconnectedBob = room.addPlayer('sock-2-reconnected', 'token-2', 'Bob', '🐼');
    expect(reconnectedBob.isOnline).toBe(true);
    expect(reconnectedBob.socketId).toBe('sock-2-reconnected');
    expect(reconnectedBob.disconnectTimer).toBeNull();
    // Card must be preserved identically!
    expect(reconnectedBob.card.map((c) => c.number)).toEqual(bobsNumbers);

    room.destroy();
  });

  it('migrates host status when host disconnects or leaves', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'host-token',
      name: 'Alice',
    });
    const bob = room.addPlayer('sock-2', 'token-2', 'Bob', '🐼');

    // Host Alice leaves
    room.removePlayer('host-token');

    // Host should migrate to Bob
    expect(room.hostSessionToken).toBe('token-2');
    expect(bob.isHost).toBe(true);

    const stateForBob = room.toPublicState('token-2');
    expect(stateForBob.isHost).toBe(true);

    room.destroy();
  });

  it('rate limits chat messages and rejects rapid spam', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'host-token',
      name: 'Alice',
    });

    const msg1 = room.addChatMessage('host-token', 'First message');
    expect(msg1.text).toBe('First message');

    // Second message immediately within 800ms must throw rate limit error
    expect(() => {
      room.addChatMessage('host-token', 'Spamming quickly!');
    }).toThrow('Message sent too quickly');

    room.destroy();
  });

  it('detects a winner when 5 lines are completed and stops game', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'host-token',
      name: 'Alice',
    });
    room.startGame();

    const alice = room.players.get('host-token');
    // Pre-mark 4 lines on Alice's card (e.g. 4 rows: 20 cells)
    for (let i = 0; i < 20; i++) {
      alice.card[i].marked = true;
    }

    // Now call the number in index 20, completing a 5th line (e.g. col 0)
    const fifthNumber = alice.card[20].number;
    // Put that number at the top of caller pool
    room.callerPool = [fifthNumber];

    const result = room.callNextNumber();
    expect(result.gameOver).toBe(true);
    expect(result.winner).toBeDefined();
    expect(result.winner.name).toBe('Alice');
    expect(room.status).toBe(ROOM_STATUS.GAME_OVER);

    room.destroy();
  });

  it('lists public rooms and excludes private rooms', () => {
    const manager = new RoomManager();
    // Public room
    manager.createRoom(
      { socketId: 's1', sessionToken: 't1', name: 'PubHost' },
      { isPublic: true }
    );
    // Private room
    manager.createRoom(
      { socketId: 's2', sessionToken: 't2', name: 'PrivHost' },
      { isPublic: false }
    );

    const publicList = manager.listPublicRooms();
    expect(publicList).toHaveLength(1);
    expect(publicList[0].code).toBeDefined();
    expect(publicList[0].playerCount).toBe(1);
  });
});
