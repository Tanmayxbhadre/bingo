import { describe, it, expect } from 'vitest';
import { Room } from '../src/game/Room.js';

describe('Player Disconnection and Reconnection Preservation', () => {
  it('preserves player card and match state when reconnecting with existing sessionToken', () => {
    const room = new Room('RECON1', {
      socketId: 'sock-host',
      sessionToken: 'token-host',
      name: 'HostPlayer',
    });

    const player = room.addPlayer('sock-guest-1', 'token-guest', 'GuestPlayer');
    room.startGame();

    const originalCard = [...player.card];
    expect(player.isOnline).toBe(true);

    // Guest disconnects
    room.handleDisconnect('token-guest');
    expect(player.isOnline).toBe(false);

    // Guest reconnects with new socket ID but same sessionToken
    const reconnectedPlayer = room.addPlayer('sock-guest-2', 'token-guest', 'GuestPlayer');
    expect(reconnectedPlayer.isOnline).toBe(true);
    expect(reconnectedPlayer.socketId).toBe('sock-guest-2');
    expect(reconnectedPlayer.card).toEqual(originalCard);

    room.destroy();
  });
});
