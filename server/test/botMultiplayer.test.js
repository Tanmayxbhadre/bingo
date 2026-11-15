import { describe, it, expect, vi } from 'vitest';
import { Room } from '../src/game/Room.js';
import { ROOM_STATUS } from '../../shared/constants/gameConstants.js';

describe('Multi-Bot Rooms and Lifecycle Cleanup', () => {
  it('supports adding multiple bots into the same room up to max players', () => {
    const room = new Room('MULTIBOT1', {
      socketId: 'sock-host',
      sessionToken: 'host-token',
      name: 'Player1',
    }, { maxPlayers: 4 });

    const bot1 = room.addBot('BotAlpha', 'robot', '#ff4757');
    const bot2 = room.addBot('BotBeta', 'robot', '#2ed573');

    expect(room.players.size).toBe(3);
    expect(bot1.isBot).toBe(true);
    expect(bot2.isBot).toBe(true);

    const publicState = room.toPublicState('host-token');
    const botsInState = publicState.players.filter((p) => p.isBot);
    expect(botsInState).toHaveLength(2);

    room.destroy();
  });

  it('rotates turn between human and bots smoothly in turn order', () => {
    const room = new Room('MULTIBOT2', {
      socketId: 'sock-host',
      sessionToken: 'host-token',
      name: 'Player1',
    });

    const bot1 = room.addBot('BotAlpha', 'robot');
    room.startGame();

    expect(room.turnOrder).toHaveLength(2);
    expect(room.turnOrder).toContain('host-token');
    expect(room.turnOrder).toContain(bot1.sessionToken);

    const firstTurnToken = room.turnPlayerSessionToken;
    room.advanceTurn();
    const secondTurnToken = room.turnPlayerSessionToken;

    expect(firstTurnToken).not.toBe(secondTurnToken);
    room.advanceTurn();
    expect(room.turnPlayerSessionToken).toBe(firstTurnToken);

    room.destroy();
  });

  it('clears all bot turn and marking timeouts cleanly on room destroy', () => {
    vi.useFakeTimers();

    const room = new Room('MULTIBOT3', {
      socketId: 'sock-host',
      sessionToken: 'host-token',
      name: 'Player1',
    });

    room.addBot('BotAlpha', 'robot');
    room.status = ROOM_STATUS.PLAYING;

    // Schedule bot turn and marking
    const onBotCall = vi.fn();
    const onBotMarked = vi.fn();
    const onGameOver = vi.fn();

    room.turnPlayerSessionToken = Array.from(room.players.values()).find((p) => p.isBot).sessionToken;
    room.checkAndTriggerBotTurn(onBotCall, onGameOver);
    room.triggerBotMarking(10, onBotMarked, onGameOver);

    expect(room.botTurnTimeout).not.toBeNull();
    expect(room.botMarkTimeouts.length).toBeGreaterThan(0);

    room.destroy();

    expect(room.botTurnTimeout).toBeNull();
    expect(room.botMarkTimeouts).toHaveLength(0);

    // Advancing timers should not fire callbacks after destroy
    vi.advanceTimersByTime(5000);
    expect(onBotCall).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});

