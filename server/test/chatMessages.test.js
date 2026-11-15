import { describe, it, expect } from 'vitest';
import { Room } from '../src/game/Room.js';

describe('Room Chat System', () => {
  it('adds a sanitized chat message from a room player', () => {
    const room = new Room('CHAT1', {
      socketId: 'sock-1',
      sessionToken: 'user-alice',
      name: 'Alice',
      avatar: 'cool',
      color: '#55b338',
    });

    const msg = room.addChatMessage('user-alice', 'Hello, good luck everyone! 🎉');
    expect(msg).toBeDefined();
    expect(msg.senderName).toBe('Alice');
    expect(msg.text).toBe('Hello, good luck everyone! 🎉');
    expect(msg.isSystem).toBe(false);
    expect(room.chatMessages).toContainEqual(msg);

    room.destroy();
  });

  it('strips html tags from user messages to prevent XSS injection', () => {
    const room = new Room('CHAT2', {
      socketId: 'sock-1',
      sessionToken: 'user-bob',
      name: 'Bob',
    });

    const msg = room.addChatMessage('user-bob', '<script>alert("hacked")</script><b>Hello world</b>');
    expect(msg).toBeDefined();
    expect(msg.text).not.toContain('<script>');
    expect(msg.text).not.toContain('<b>');
    expect(msg.text).toBe('alert("hacked")Hello world');

    room.destroy();
  });

  it('truncates chat messages exceeding 150 characters', () => {
    const room = new Room('CHAT3', {
      socketId: 'sock-1',
      sessionToken: 'user-carol',
      name: 'Carol',
    });

    const longMessage = 'A'.repeat(200);
    const msg = room.addChatMessage('user-carol', longMessage);
    expect(msg).toBeDefined();
    expect(msg.text).toHaveLength(150);

    room.destroy();
  });

  it('caps total in-room chat history at 100 messages', () => {
    const room = new Room('CHAT4', {
      socketId: 'sock-1',
      sessionToken: 'user-dave',
      name: 'Dave',
    });

    for (let i = 0; i < 110; i++) {
      room.addSystemMessage(`System announcement #${i}`);
    }

    expect(room.chatMessages.length).toBeLessThanOrEqual(100);
    expect(room.chatMessages[room.chatMessages.length - 1].text).toBe('System announcement #109');

    room.destroy();
  });
});

