import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_EVENTS, AVATARS, SKRIBBL_COLORS } from '@shared/constants/gameConstants.js';
import { sounds } from '../services/soundEffects.js';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [sessionToken, setSessionToken] = useState(() => {
    let token = sessionStorage.getItem('bingo_session_token');
    if (!token) {
      token = 'user_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      sessionStorage.setItem('bingo_session_token', token);
    }
    return token;
  });

  const [name, setName] = useState(() => localStorage.getItem('bingo_name') || 'Player');
  const [avatarIndex, setAvatarIndex] = useState(() => {
    const saved = localStorage.getItem('bingo_avatar_idx');
    return saved !== null ? Number(saved) : 0;
  });
  const [avatarColor, setAvatarColor] = useState(() => localStorage.getItem('bingo_avatar_color') || SKRIBBL_COLORS[0]);

  const [roomState, setRoomState] = useState(null);
  const [publicRooms, setPublicRooms] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [turnTime, setTurnTime] = useState(45);
  const [lastMarkedNumber, setLastMarkedNumber] = useState(null);
  const [floatingReactions, setFloatingReactions] = useState([]);

  const currentAvatar = AVATARS[avatarIndex] || AVATARS[0];

  const socketRef = useRef(null);
  const currentRoomCodeRef = useRef(null);
  const nameRef = useRef(name);
  const avatarRef = useRef(currentAvatar);
  const colorRef = useRef(avatarColor);

  useEffect(() => {
    nameRef.current = name;
  }, [name]);
  useEffect(() => {
    avatarRef.current = currentAvatar;
  }, [currentAvatar]);
  useEffect(() => {
    colorRef.current = avatarColor;
  }, [avatarColor]);

  useEffect(() => {
    if (roomState?.roomCode) {
      currentRoomCodeRef.current = roomState.roomCode;
    }
  }, [roomState?.roomCode]);

  useEffect(() => {
    // In local dev on Vite port 5173, connect directly to backend on 4000
    const serverUrl =
      import.meta.env.VITE_SERVER_URL ||
      (typeof window !== 'undefined' && window.location.port === '5173'
        ? 'http://localhost:4000'
        : window.location.origin);

    const socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setError(null);

      // Rebind to active room if socket reconnected
      const code = currentRoomCodeRef.current;
      if (code && sessionToken) {
        socket.emit(
          SOCKET_EVENTS.JOIN_ROOM,
          {
            roomCode: code,
            sessionToken,
            name: nameRef.current || 'Player',
            avatar: avatarRef.current?.emoji || '😃',
            color: colorRef.current || '#55b338',
          },
          (res) => {
            if (res?.success && res.state) {
              setRoomState(res.state);
            }
          }
        );
      }
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    // When host starts game, broadcast ensures all room members re-sync immediately
    socket.on(SOCKET_EVENTS.START_GAME, () => {
      const code = currentRoomCodeRef.current;
      if (code && sessionToken) {
        socket.emit(
          SOCKET_EVENTS.JOIN_ROOM,
          {
            roomCode: code,
            sessionToken,
            name: nameRef.current || 'Player',
            avatar: avatarRef.current?.emoji || '😃',
            color: colorRef.current || '#55b338',
          },
          (res) => {
            if (res?.success && res.state) {
              setRoomState(res.state);
            }
          }
        );
      }
    });

    socket.on(SOCKET_EVENTS.ROOM_UPDATED, (updatedState) => {
      setRoomState((prevState) => {
        if (!prevState?.isMyTurn && updatedState.isMyTurn) {
          sounds.playTurnAlert();
        }
        return updatedState;
      });
      if (updatedState.turnTimeRemaining !== undefined) {
        setTurnTime(updatedState.turnTimeRemaining);
      }
    });

    socket.on('turn_tick', ({ timeRemaining }) => {
      setTurnTime(timeRemaining);
    });

    // When opponent or caller calls a number
    socket.on(SOCKET_EVENTS.NUMBER_CALLED, (data) => {
      sounds.playNumberCall();
      setLastMarkedNumber(data.number);
    });

    // When a cell is marked
    socket.on(SOCKET_EVENTS.CELL_MARKED, (data) => {
      sounds.playMark();
    });

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, () => {
      sounds.playJoin();
    });

    socket.on(SOCKET_EVENTS.GAME_OVER, (data) => {
      if (data.winner) {
        sounds.playWin();
      }
    });

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

    // Real-time floating emoji reaction
    socket.on(SOCKET_EVENTS.REACTION_EMOJI, (reaction) => {
      sounds.playReaction();
      setFloatingReactions((prev) => [...prev.slice(-15), reaction]);
      setTimeout(() => {
        setFloatingReactions((prev) => prev.filter((r) => r.id !== reaction.id));
      }, 2400);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionToken]);

  const updateProfile = (newName, newAvatarIdx, newColor) => {
    let updatedName = name;
    let updatedAvatarEmoji = currentAvatar.emoji;
    let updatedColor = avatarColor;

    if (newName !== undefined) {
      const trimmed = newName.slice(0, 16);
      setName(trimmed);
      localStorage.setItem('bingo_name', trimmed);
      updatedName = trimmed;
    }
    if (newAvatarIdx !== undefined && AVATARS[newAvatarIdx]) {
      setAvatarIndex(newAvatarIdx);
      localStorage.setItem('bingo_avatar_idx', String(newAvatarIdx));
      updatedAvatarEmoji = AVATARS[newAvatarIdx].emoji;
    }
    if (newColor !== undefined) {
      setAvatarColor(newColor);
      localStorage.setItem('bingo_avatar_color', newColor);
      updatedColor = newColor;
    }

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(SOCKET_EVENTS.UPDATE_PROFILE, {
        name: updatedName,
        avatar: updatedAvatarEmoji,
        color: updatedColor,
      });
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
          name: name.trim() || 'Player',
          avatar: currentAvatar.emoji,
          color: avatarColor,
          options,
        },
        (res) => {
          if (res?.success) {
            currentRoomCodeRef.current = res.roomCode;
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
          name: name.trim() || 'Player',
          avatar: currentAvatar.emoji,
          color: avatarColor,
        },
        (res) => {
          if (res?.success) {
            currentRoomCodeRef.current = res.roomCode;
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
    currentRoomCodeRef.current = null;
    if (socketRef.current) {
      socketRef.current.emit(SOCKET_EVENTS.LEAVE_ROOM);
    }
    setRoomState(null);
    setError(null);
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

  // Call number (when it's your turn)
  const callNumber = (number) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject();
      sounds.playPop();

      // Optimistic local update: mark caller's own cell immediately with 0ms delay!
      setRoomState((prev) => {
        if (!prev || !prev.myCard) return prev;
        const updatedCard = prev.myCard.map((c) =>
          c.number === number ? { ...c, marked: true } : c
        );
        return {
          ...prev,
          currentCalledNumber: number,
          calledNumbers: prev.calledNumbers?.includes(number)
            ? prev.calledNumbers
            : [...(prev.calledNumbers || []), number],
          myCard: updatedCard,
        };
      });

      socketRef.current.emit(SOCKET_EVENTS.CALL_NUMBER, { number }, (res) => {
        if (res?.success) {
          resolve(res);
        } else {
          setError(res?.error || 'Could not call number');
          reject(new Error(res?.error));
        }
      });
    });
  };

  // Mark number (opponent clicked called number on their card)
  const markNumber = (number) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) return reject();
      sounds.playMark();

      // Optimistic local update: mark cell immediately with 0ms delay!
      setRoomState((prev) => {
        if (!prev || !prev.myCard) return prev;
        const updatedCard = prev.myCard.map((c) =>
          c.number === number ? { ...c, marked: true } : c
        );
        return {
          ...prev,
          myCard: updatedCard,
        };
      });

      socketRef.current.emit(SOCKET_EVENTS.MARK_NUMBER, { number }, (res) => {
        if (res?.success) {
          resolve(res);
        } else {
          setError(res?.error || 'Could not mark number');
          reject(new Error(res?.error));
        }
      });
    });
  };

  const pauseGame = () => socketRef.current?.emit(SOCKET_EVENTS.PAUSE_GAME);
  const resumeGame = () => socketRef.current?.emit(SOCKET_EVENTS.RESUME_GAME);
  const playAgain = () => socketRef.current?.emit(SOCKET_EVENTS.PLAY_AGAIN);

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

  const sendReaction = (emoji) => {
    if (!socketRef.current) return;
    socketRef.current.emit(SOCKET_EVENTS.REACTION_EMOJI, { emoji });
  };

  return (
    <GameContext.Provider
      value={{
        sessionToken,
        name,
        avatarIndex,
        avatarColor,
        currentAvatar,
        updateProfile,
        roomState,
        publicRooms,
        connected,
        error,
        clearError: () => setError(null),
        isMuted,
        toggleSound,
        turnTime,
        lastMarkedNumber,
        floatingReactions,
        sendReaction,
        createRoom,
        joinRoom,
        leaveRoom,
        startGame,
        callNumber,
        markNumber,
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
