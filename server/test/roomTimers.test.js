import { describe, it, expect, vi } from 'vitest';
import { Room } from '../src/game/Room.js';
import { ROOM_STATUS } from '../../shared/constants/gameConstants.js';

describe('Room Turn Timers and Pause/Resume Lifecycle', () => {
  it('automatically calls a valid number when turn duration expires', () => {
    vi.useFakeTimers();

    const room = new Room('TIMER1', {
      socketId: 'sock-1',
      sessionToken: 'user-alice',
      name: 'Alice',
    }, { turnDurationSec: 10 });

    room.addPlayer('sock-2', 'user-bob', 'Bob');

    const onTurnTick = vi.fn();
    const onAutoCall = vi.fn();
    const onGameOver = vi.fn();

    room.startGame({ onTurnTick, onAutoCall, onGameOver });

    expect(room.status).toBe(ROOM_STATUS.PLAYING);
    expect(room.calledNumbers).toHaveLength(0);

    // Advance 20 seconds so the 15s turn timer elapses
    vi.advanceTimersByTime(20000);

    expect(onAutoCall).toHaveBeenCalled();
    expect(room.calledNumbers.length).toBeGreaterThanOrEqual(1);

    vi.useRealTimers();
    room.destroy();
  });

  it('pauses and resumes game state correctly', () => {
    const room = new Room('PAUSE1', {
      socketId: 'sock-1',
      sessionToken: 'user-alice',
      name: 'Alice',
    });

    room.addPlayer('sock-2', 'user-bob', 'Bob');
    room.startGame();

    expect(room.status).toBe(ROOM_STATUS.PLAYING);

    // Pause the game
    const paused = room.pauseGame();
    expect(paused).toBe(true);
    expect(room.status).toBe(ROOM_STATUS.PAUSED);

    // Resume the game
    const resumed = room.resumeGame();
    expect(resumed).toBe(true);
    expect(room.status).toBe(ROOM_STATUS.PLAYING);

    room.destroy();
  });
});
