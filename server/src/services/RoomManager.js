import { Room } from '../game/Room.js';
import { GAME_CONFIG, ROOM_STATUS } from '../../../shared/constants/gameConstants.js';

export class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomCode -> Room
    this.socketToRoom = new Map(); // socketId -> { roomCode, sessionToken }
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid easily confused 0, O, 1, I
    let code = '';
    let attempts = 0;

    do {
      code = '';
      for (let i = 0; i < GAME_CONFIG.ROOM_CODE_LENGTH; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      attempts++;
      if (attempts > 1000) {
        throw new Error('Could not generate unique room code');
      }
    } while (this.rooms.has(code));

    return code;
  }

  createRoom(hostInfo, options = {}) {
    const code = this.generateRoomCode();
    const room = new Room(code, hostInfo, options);
    this.rooms.set(code, room);
    this.socketToRoom.set(hostInfo.socketId, { roomCode: code, sessionToken: hostInfo.sessionToken });
    return room;
  }

  getRoom(roomCode) {
    if (!roomCode) return null;
    return this.rooms.get(roomCode.toUpperCase().trim()) || null;
  }

  getRoomBySocket(socketId) {
    const record = this.socketToRoom.get(socketId);
    if (!record) return null;
    const room = this.rooms.get(record.roomCode);
    return { room, sessionToken: record.sessionToken, roomCode: record.roomCode };
  }

  bindSocket(socketId, roomCode, sessionToken) {
    this.socketToRoom.set(socketId, { roomCode, sessionToken });
  }

  unbindSocket(socketId) {
    this.socketToRoom.delete(socketId);
  }

  listPublicRooms() {
    const publicRooms = [];
    for (const room of this.rooms.values()) {
      if (room.isPublic && room.status === ROOM_STATUS.LOBBY && room.players.size < room.maxPlayers) {
        publicRooms.push(room.toLobbySummary());
      }
    }
    return publicRooms;
  }

  deleteRoom(roomCode) {
    const room = this.rooms.get(roomCode);
    if (room) {
      room.destroy();
      this.rooms.delete(roomCode);
    }
  }

  cleanupEmptyRooms() {
    const now = Date.now();
    for (const [code, room] of this.rooms.entries()) {
      const onlineCount = Array.from(room.players.values()).filter((p) => p.isOnline).length;
      if (onlineCount === 0 && now - room.createdAt > 300000) {
        // Empty for > 5 minutes
        this.deleteRoom(code);
      }
    }
  }
}

export const roomManager = new RoomManager();

