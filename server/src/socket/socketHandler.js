import { roomManager } from '../services/RoomManager.js';
import { SOCKET_EVENTS, ROOM_STATUS } from '../../../shared/constants/gameConstants.js';

export function setupSocketHandlers(io) {
  // Broadcast updated room state to each individual socket in the room
  // (ensuring each player gets their personal card while seeing shared public state)
  function broadcastRoomState(room) {
    for (const player of room.players.values()) {
      if (player.isOnline && player.socketId) {
        const personalState = room.toPublicState(player.sessionToken);
        io.to(player.socketId).emit(SOCKET_EVENTS.ROOM_UPDATED, personalState);
      }
    }
  }

  io.on('connection', (socket) => {
    // 1. Create Room
    socket.on(SOCKET_EVENTS.CREATE_ROOM, (payload, callback) => {
      try {
        const { sessionToken, name, avatar, options } = payload || {};
        if (!sessionToken) {
          return callback?.({ success: false, error: 'Session token is required' });
        }

        const room = roomManager.createRoom(
          {
            socketId: socket.id,
            sessionToken,
            name: name || 'Host',
            avatar: avatar || '🦊',
          },
          options || {}
        );

        socket.join(room.code);
        room.addSystemMessage(`${name || 'Host'} created room ${room.code}!`);

        const state = room.toPublicState(sessionToken);
        callback?.({ success: true, roomCode: room.code, state });
        broadcastRoomState(room);
      } catch (err) {
        console.error('create_room error:', err);
        callback?.({ success: false, error: err.message || 'Failed to create room' });
      }
    });

    // 2. Join Room
    socket.on(SOCKET_EVENTS.JOIN_ROOM, (payload, callback) => {
      try {
        const { roomCode, sessionToken, name, avatar } = payload || {};
        if (!roomCode || !sessionToken) {
          return callback?.({ success: false, error: 'Room code and session token are required' });
        }

        const room = roomManager.getRoom(roomCode);
        if (!room) {
          return callback?.({ success: false, error: 'Room not found' });
        }

        const isReconnect = room.players.has(sessionToken);
        const player = room.addPlayer(socket.id, sessionToken, name, avatar, false);

        roomManager.bindSocket(socket.id, room.code, sessionToken);
        socket.join(room.code);

        if (isReconnect) {
          room.addSystemMessage(`${player.name} reconnected!`);
          io.to(room.code).emit(SOCKET_EVENTS.PLAYER_RECONNECTED, {
            sessionToken: player.sessionToken,
            name: player.name,
          });
        } else {
          room.addSystemMessage(`${player.name} joined the lobby!`);
          io.to(room.code).emit(SOCKET_EVENTS.PLAYER_JOINED, {
            sessionToken: player.sessionToken,
            name: player.name,
            avatar: player.avatar,
          });
        }

        const state = room.toPublicState(sessionToken);
        callback?.({ success: true, roomCode: room.code, state });
        broadcastRoomState(room);
      } catch (err) {
        console.error('join_room error:', err);
        callback?.({ success: false, error: err.message || 'Failed to join room' });
      }
    });

    // 3. List Public Rooms
    socket.on(SOCKET_EVENTS.LIST_PUBLIC_ROOMS, (payload, callback) => {
      try {
        const publicRooms = roomManager.listPublicRooms();
        callback?.({ success: true, rooms: publicRooms });
      } catch (err) {
        callback?.({ success: false, error: err.message });
      }
    });

    // 4. Start Game (Host only)
    socket.on(SOCKET_EVENTS.START_GAME, (payload, callback) => {
      try {
        const record = roomManager.getRoomBySocket(socket.id);
        if (!record || !record.room) {
          return callback?.({ success: false, error: 'You are not in a room' });
        }

        const { room, sessionToken } = record;
        if (room.hostSessionToken !== sessionToken) {
          return callback?.({ success: false, error: 'Only the room host can start the game' });
        }

        if (room.status === ROOM_STATUS.PLAYING) {
          return callback?.({ success: false, error: 'Game is already running' });
        }

        room.addSystemMessage('The game has started! First to 5 lines wins! 🎉');

        room.startGame(
          // onNumberCalled callback
          (callResult) => {
            io.to(room.code).emit(SOCKET_EVENTS.NUMBER_CALLED, {
              number: callResult.number,
              history: callResult.history,
              playerUpdates: callResult.playerUpdates,
            });
            broadcastRoomState(room);
          },
          // onGameOver callback
          (gameResult) => {
            io.to(room.code).emit(SOCKET_EVENTS.GAME_OVER, {
              reason: gameResult.reason,
              winner: gameResult.winner,
              winners: gameResult.winners,
              history: gameResult.history,
            });
            if (gameResult.winner) {
              room.addSystemMessage(`🏆 BINGO! ${gameResult.winner.name} won with 5 completed lines!`);
            }
            broadcastRoomState(room);
          }
        );

        callback?.({ success: true });
        broadcastRoomState(room);
      } catch (err) {
        console.error('game_start error:', err);
        callback?.({ success: false, error: err.message });
      }
    });

    // 5. Pause Game (Host only)
    socket.on(SOCKET_EVENTS.PAUSE_GAME, (payload, callback) => {
      try {
        const record = roomManager.getRoomBySocket(socket.id);
        if (!record || !record.room) return;
        const { room, sessionToken } = record;
        if (room.hostSessionToken !== sessionToken) {
          return callback?.({ success: false, error: 'Only host can pause' });
        }

        const paused = room.pauseGame();
        if (paused) {
          room.addSystemMessage('The game was paused by the host.');
          callback?.({ success: true });
          broadcastRoomState(room);
        }
      } catch (err) {
        callback?.({ success: false, error: err.message });
      }
    });

    // 6. Resume Game (Host only)
    socket.on(SOCKET_EVENTS.RESUME_GAME, (payload, callback) => {
      try {
        const record = roomManager.getRoomBySocket(socket.id);
        if (!record || !record.room) return;
        const { room, sessionToken } = record;
        if (room.hostSessionToken !== sessionToken) {
          return callback?.({ success: false, error: 'Only host can resume' });
        }

        const resumed = room.resumeGame(
          (callResult) => {
            io.to(room.code).emit(SOCKET_EVENTS.NUMBER_CALLED, {
              number: callResult.number,
              history: callResult.history,
              playerUpdates: callResult.playerUpdates,
            });
            broadcastRoomState(room);
          },
          (gameResult) => {
            io.to(room.code).emit(SOCKET_EVENTS.GAME_OVER, {
              reason: gameResult.reason,
              winner: gameResult.winner,
              winners: gameResult.winners,
              history: gameResult.history,
            });
            if (gameResult.winner) {
              room.addSystemMessage(`🏆 BINGO! ${gameResult.winner.name} won!`);
            }
            broadcastRoomState(room);
          }
        );

        if (resumed) {
          room.addSystemMessage('The game resumed.');
          callback?.({ success: true });
          broadcastRoomState(room);
        }
      } catch (err) {
        callback?.({ success: false, error: err.message });
      }
    });

    // 7. Play Again (Host only)
    socket.on(SOCKET_EVENTS.PLAY_AGAIN, (payload, callback) => {
      try {
        const record = roomManager.getRoomBySocket(socket.id);
        if (!record || !record.room) return;
        const { room, sessionToken } = record;
        if (room.hostSessionToken !== sessionToken) {
          return callback?.({ success: false, error: 'Only host can reset game' });
        }

        room.resetForNewGame();
        room.addSystemMessage('New round ready! Host can start whenever everyone is set.');
        callback?.({ success: true });
        broadcastRoomState(room);
      } catch (err) {
        callback?.({ success: false, error: err.message });
      }
    });

    // 8. Live Chat Message
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (payload, callback) => {
      try {
        const record = roomManager.getRoomBySocket(socket.id);
        if (!record || !record.room) {
          return callback?.({ success: false, error: 'Not in a room' });
        }

        const { room, sessionToken } = record;
        const text = payload?.text || '';
        const msg = room.addChatMessage(sessionToken, text);

        if (msg) {
          io.to(room.code).emit(SOCKET_EVENTS.CHAT_MESSAGE, msg);
          callback?.({ success: true, message: msg });
        } else {
          callback?.({ success: false, error: 'Empty message' });
        }
      } catch (err) {
        callback?.({ success: false, error: err.message || 'Chat error' });
      }
    });

    // 9. Leave Room explicitly
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, () => {
      handleUserLeave(socket);
    });

    // 10. Disconnect
    socket.on('disconnect', () => {
      handleUserLeave(socket, true);
    });
  });

  function handleUserLeave(socket, isDisconnect = false) {
    const record = roomManager.getRoomBySocket(socket.id);
    if (!record || !record.room) return;

    const { room, sessionToken } = record;
    roomManager.unbindSocket(socket.id);
    socket.leave(room.code);

    const player = room.players.get(sessionToken);
    const playerName = player ? player.name : 'A player';

    if (isDisconnect) {
      // Allow grace period for reconnect
      room.handleDisconnect(sessionToken, (expiredSessionToken) => {
        room.addSystemMessage(`${playerName} left the game (disconnected).`);
        broadcastRoomState(room);
      });
      room.addSystemMessage(`${playerName} lost connection.`);
      broadcastRoomState(room);
    } else {
      // Explicit leave
      room.removePlayer(sessionToken);
      room.addSystemMessage(`${playerName} left the room.`);
      broadcastRoomState(room);
    }

    // If room is completely empty, clean it up
    if (room.players.size === 0) {
      roomManager.deleteRoom(room.code);
    }
  }
}
