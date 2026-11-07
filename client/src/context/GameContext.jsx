import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_EVENTS } from '@shared/constants/gameConstants.js';
import { sounds } from '../services/soundEffects.js';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Session Token persistence
  const [sessionToken, setSessionToken] = useState(() => {
    let token = sessionStorage.getItem('bingo_session_token');
    if (!token) {
      token = 'user_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      sessionStorage.setItem('bingo_session_token', token);
    }
    return token;
  });

  const [name, setName] = useState(() => localStorage.getItem('bingo_name') || 'LuckyPlayer');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('bingo_avatar') || '🦊');
  const [roomState, setRoomState] = useState(null);
  const [publicRooms, setPublicRooms] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [lastMarkedCell, setLastMarkedCell] = useState(null);

  const socketRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SERVER_URL || window.location.origin;
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // Room updated
    socket.on(SOCKET_EVENTS.ROOM_UPDATED, (updatedState) => {
      setRoomState(updatedState);
    });

    // Number called
    socket.on(SOCKET_EVENTS.NUMBER_CALLED, (data) => {
      sounds.playNumberCall();
      if (data.playerUpdates) {
        const myUpdate = data.playerUpdates.find((p) => p.sessionToken === sessionToken);
        if (myUpdate && myUpdate.numberMarked) {
          sounds.playMark();
          setLastMarkedCell(myUpdate.cellIndex);
          setTimeout(() => setLastMarkedCell(null), 1200);
        }
      }
    });

    // Player joined
    socket.on(SOCKET_EVENTS.PLAYER_JOINED, () => {
      sounds.playJoin();
    });

    // Game over / Winner
    socket.on(SOCKET_EVENTS.GAME_OVER, (data) => {
      if (data.winner) {
        sounds.playWin();
      }
    });

    // Chat message received
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (msg) => {
      setRoomState((prev) => {
        if (!prev) return prev;
        const exists = prev.chatMessages.some((m) => m.id === msg.id);
        if (exists) return prev;
        return {
          ...prev,
          chatMessages: [...prev.chatMessages, msg].slice(-50),
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionToken]);

  const updateProfile = (newName, newAvatar) => {
    if (newName) {
      const trimmed = newName.slice(0, 16);
      setName(trimmed);
      localStorage.setItem('bingo_name', trimmed);
    }
    if (newAvatar) {
      setAvatar(newAvatar);
      localStorage.setItem('bingo_avatar', newAvatar);
    }
  };

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  // Actions
  const createRoom = (options = {}) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject(new Error('Socket not connected'));
      setError(null);

      socketRef.current.emit(
        SOCKET_EVENTS.CREATE_ROOM,
        {
          sessionToken,
          name,
          avatar,
          options,
        },
        (res) => {
          if (res?.success) {
            setRoomState(res.state);
            resolve(res);
          } else {
            setError(res?.error || 'Failed to create room');
            reject(new Error(res?.error || 'Failed to create room'));
          }
        }
      );
    });
  };

  const joinRoom = (code) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject(new Error('Socket not connected'));
      setError(null);

      socketRef.current.emit(
        SOCKET_EVENTS.JOIN_ROOM,
        {
          roomCode: code.toUpperCase().trim(),
          sessionToken,
          name,
          avatar,
        },
        (res) => {
          if (res?.success) {
            setRoomState(res.state);
            resolve(res);
          } else {
            setError(res?.error || 'Failed to join room');
            reject(new Error(res?.error || 'Failed to join room'));
          }
        }
      );
    });
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit(SOCKET_EVENTS.LEAVE_ROOM);
    }
    setRoomState(null);
  };

  const startGame = () => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject();
      socketRef.current.emit(SOCKET_EVENTS.START_GAME, {}, (res) => {
        if (res?.success) resolve();
        else {
          setError(res?.error || 'Could not start game');
          reject(new Error(res?.error));
        }
      });
    });
  };

  const pauseGame = () => {
    socketRef.current?.emit(SOCKET_EVENTS.PAUSE_GAME);
  };

  const resumeGame = () => {
    socketRef.current?.emit(SOCKET_EVENTS.RESUME_GAME);
  };

  const playAgain = () => {
    socketRef.current?.emit(SOCKET_EVENTS.PLAY_AGAIN);
  };

  const sendChatMessage = (text) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject();
      socketRef.current.emit(SOCKET_EVENTS.CHAT_MESSAGE, { text }, (res) => {
        if (res?.success) resolve();
        else reject(new Error(res?.error || 'Chat failed'));
      });
    });
  };

  const fetchPublicRooms = () => {
    if (!socketRef.current) return;
    socketRef.current.emit(SOCKET_EVENTS.LIST_PUBLIC_ROOMS, {}, (res) => {
      if (res?.success) {
        setPublicRooms(res.rooms || []);
      }
    });
  };

  return (
    <GameContext.Provider
      value={{
        sessionToken,
        name,
        avatar,
        updateProfile,
        roomState,
        publicRooms,
        connected,
        error,
        clearError: () => setError(null),
        isMuted,
        toggleSound,
        lastMarkedCell,
        createRoom,
        joinRoom,
        leaveRoom,
        startGame,
        pauseGame,
        resumeGame,
        playAgain,
        sendChatMessage,
        fetchPublicRooms,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
