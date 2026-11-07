import { describe, it, expect } from 'vitest';
import { Room } from '../src/game/Room.js';
import { RoomManager } from '../src/services/RoomManager.js';
import { ROOM_STATUS } from '../../shared/constants/gameConstants.js';

describe('Turn-Based Multiplayer Bingo (skribbl.io style)', () => {
  it('creates a room with host and sets up lobby', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'alice-token',
      name: 'Alice',
      avatar: '😃',
    });

    expect(room.code).toBeDefined();
    expect(room.status).toBe(ROOM_STATUS.LOBBY);
    expect(room.hostSessionToken).toBe('alice-token');
    expect(room.players.size).toBe(1);

    const host = room.players.get('alice-token');
    expect(host.name).toBe('Alice');
    expect(host.card).toHaveLength(25);
  });

  it('allows second player to join and starts game with alternating turns', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'alice-token',
      name: 'Alice',
    });
    room.addPlayer('sock-2', 'bob-token', 'Bob', '😎');

    expect(room.players.size).toBe(2);

    room.startGame();
    expect(room.status).toBe(ROOM_STATUS.PLAYING);
    expect(room.turnOrder).toHaveLength(2);
    expect(room.turnPlayerSessionToken).toBeDefined();

    room.destroy();
  });

  it('enforces that only the active player can call a number', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'alice-token',
      name: 'Alice',
    });
    room.addPlayer('sock-2', 'bob-token', 'Bob', '😎');
    room.startGame();

    const activeToken = room.turnPlayerSessionToken;
    const inactiveToken = activeToken === 'alice-token' ? 'bob-token' : 'alice-token';

    // Inactive player tries to call
    expect(() => {
      room.callNumber(inactiveToken, 25);
    }).toThrow('It is not your turn to call a number');

    room.destroy();
  });

  it('active player calls number, marks caller card, and switches turn to opponent', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'alice-token',
      name: 'Alice',
    });
    room.addPlayer('sock-2', 'bob-token', 'Bob', '😎');
    room.startGame();

    // Ensure player 1 is active
    room.turnPlayerSessionToken = 'alice-token';
    const alice = room.players.get('alice-token');
    const aliceNumber = alice.card[0].number;

    // Alice calls her number
    const callRes = room.callNumber('alice-token', aliceNumber);
    expect(callRes.success).toBe(true);
    expect(callRes.number).toBe(aliceNumber);
    expect(room.calledNumbers).toContain(aliceNumber);
    expect(alice.card[0].marked).toBe(true);

    // Turn should now be passed to Bob!
    expect(room.turnPlayerSessionToken).toBe('bob-token');

    room.destroy();
  });

  it('opponent marks called number by clicking their card', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'alice-token',
      name: 'Alice',
    });
    const bob = room.addPlayer('sock-2', 'bob-token', 'Bob', '😎');
    room.startGame();

    room.turnPlayerSessionToken = 'alice-token';
    const bobNumber = bob.card[4].number;

    // Alice calls a number that happens to be on Bob's card
    room.callNumber('alice-token', bobNumber);

    // Bob clicks the number on his card to mark it!
    const markRes = room.markNumber('bob-token', bobNumber);
    expect(markRes.success).toBe(true);
    expect(markRes.marked).toBe(true);
    expect(bob.card[4].marked).toBe(true);

    room.destroy();
  });

  it('rejects opponent attempting to mark an uncalled number', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'alice-token',
      name: 'Alice',
    });
    const bob = room.addPlayer('sock-2', 'bob-token', 'Bob', '😎');
    room.startGame();

    // Number 75 has not been called
    expect(() => {
      room.markNumber('bob-token', 75);
    }).toThrow('Number 75 has not been called yet!');

    room.destroy();
  });

  it('alternates turns back and forth: Alice calls -> Bob marks -> Bob calls -> Alice marks', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'alice-token',
      name: 'Alice',
    });
    const bob = room.addPlayer('sock-2', 'bob-token', 'Bob', '😎');
    room.startGame();

    // 1. Alice's turn
    room.turnPlayerSessionToken = 'alice-token';
    const aliceNum = room.players.get('alice-token').card[0].number;
    room.callNumber('alice-token', aliceNum);

    // Bob marks Alice's number if on his card
    if (bob.card.some((c) => c.number === aliceNum)) {
      room.markNumber('bob-token', aliceNum);
    }

    // 2. Now Bob's turn!
    expect(room.turnPlayerSessionToken).toBe('bob-token');
    const bobNum = bob.card.find((c) => !c.marked).number;
    room.callNumber('bob-token', bobNum);

    // 3. Now Alice's turn again!
    expect(room.turnPlayerSessionToken).toBe('alice-token');

    // Alice marks Bob's number if on her card
    const alice = room.players.get('alice-token');
    if (alice.card.some((c) => c.number === bobNum)) {
      room.markNumber('alice-token', bobNum);
    }

    room.destroy();
  });

  it('detects winning condition when player completes 5 lines', () => {
    const manager = new RoomManager();
    const room = manager.createRoom({
      socketId: 'sock-1',
      sessionToken: 'alice-token',
      name: 'Alice',
    });
    room.addPlayer('sock-2', 'bob-token', 'Bob', '😎');
    room.startGame();

    const alice = room.players.get('alice-token');
    // Pre-mark 4 rows on Alice's card (20 cells)
    for (let i = 0; i < 20; i++) {
      alice.card[i].marked = true;
      room.calledNumbersSet.add(alice.card[i].number);
    }

    // Alice calls the 21st number (index 20), completing col 0 as her 5th line!
    room.turnPlayerSessionToken = 'alice-token';
    const winningNumber = alice.card[20].number;

    const res = room.callNumber('alice-token', winningNumber);
    expect(res.isWinner).toBe(true);
    expect(res.winner.name).toBe('Alice');
    expect(room.status).toBe(ROOM_STATUS.GAME_OVER);

    room.destroy();
  });
});
