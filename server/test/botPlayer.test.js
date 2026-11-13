import { describe, it, expect, vi } from 'vitest';
import { Room } from '../src/game/Room.js';
import { ROOM_STATUS } from '../../shared/constants/gameConstants.js';

describe('Play vs AI Bot (Single Player Mode)', () => {
  it('adds a bot player to the room with valid card and properties', () => {
    const room = new Room('BOT1', {
      socketId: 'sock-host',
      sessionToken: 'user-token',
      name: 'HumanPlayer',
      avatar: 'cool',
    });

    const bot = room.addBot('BingoBot 🤖', 'robot', '#ff4757');
    expect(bot).toBeDefined();
    expect(bot.isBot).toBe(true);
    expect(bot.name).toBe('BingoBot 🤖');
    expect(bot.avatar).toBe('robot');
    expect(bot.card).toHaveLength(25);
    expect(room.players.size).toBe(2);

    const publicState = room.toPublicState('user-token');
    const botInState = publicState.players.find((p) => p.isBot);
    expect(botInState).toBeDefined();
    expect(botInState.isBot).toBe(true);
    expect(botInState.name).toBe('BingoBot 🤖');

    room.destroy();
  });

  it('smart bot picks a valid unmarked number from its card', () => {
    const room = new Room('BOT2', {
      socketId: 'sock-host',
      sessionToken: 'user-token',
      name: 'HumanPlayer',
    });

    const bot = room.addBot('BingoBot 🤖', 'robot');
    const chosenNumber = room.pickSmartBotNumber(bot);

    expect(chosenNumber).toBeGreaterThanOrEqual(1);
    expect(chosenNumber).toBeLessThanOrEqual(25);

    const cell = bot.card.find((c) => c.number === chosenNumber);
    expect(cell).toBeDefined();
    expect(cell.marked).toBe(false);

    room.destroy();
  });

  it('triggers bot marking when a human player calls a number', () => {
    vi.useFakeTimers();

    const room = new Room('BOT3', {
      socketId: 'sock-host',
      sessionToken: 'user-token',
      name: 'HumanPlayer',
    });

    const bot = room.addBot('BingoBot 🤖', 'robot');
    room.turnPlayerSessionToken = 'user-token';
    room.status = ROOM_STATUS.PLAYING;

    const userNumber = room.players.get('user-token').card[0].number;
    const onBotMarked = vi.fn();
    const onGameOver = vi.fn();

    room.callNumber('user-token', userNumber);
    room.triggerBotMarking(userNumber, onBotMarked, onGameOver);

    // Fast forward timer for bot marking reaction
    vi.advanceTimersByTime(1500);

    const botCell = bot.card.find((c) => c.number === userNumber);
    expect(botCell.marked).toBe(true);
    expect(onBotMarked).toHaveBeenCalled();

    vi.useRealTimers();
    room.destroy();
  });

  it('AI bot intelligently prioritizes completing almost-finished lines', () => {
    const room = new Room('BOT4', {
      socketId: 'sock-host',
      sessionToken: 'user-token',
      name: 'HumanPlayer',
    });

    const bot = room.addBot('BingoBot 🤖', 'robot');

    // Manually mark the first 4 cells of row 0
    bot.card[0].marked = true;
    bot.card[1].marked = true;
    bot.card[2].marked = true;
    bot.card[3].marked = true;
    // bot.card[4] is unmarked! This completes a 5-in-a-row line
    const winningNumber = bot.card[4].number;

    const picked = room.pickSmartBotNumber(bot);
    expect(picked).toBe(winningNumber);

    room.destroy();
  });
});
