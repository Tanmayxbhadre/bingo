import { BingoEngine } from '../../../shared/game-rules/BingoEngine.js';
import { GAME_CONFIG, ROOM_STATUS } from '../../../shared/constants/gameConstants.js';

export class Room {
  constructor(code, hostInfo, options = {}) {
    this.code = code;
    this.status = ROOM_STATUS.LOBBY;
    this.createdAt = Date.now();

    // Configuration
    this.callIntervalSec = Math.max(
      GAME_CONFIG.MIN_CALL_INTERVAL_SEC,
      Math.min(options.callIntervalSec || GAME_CONFIG.DEFAULT_CALL_INTERVAL_SEC, GAME_CONFIG.MAX_CALL_INTERVAL_SEC)
    );
    this.maxPlayers = Math.min(options.maxPlayers || GAME_CONFIG.DEFAULT_MAX_PLAYERS, 24);
    this.isPublic = Boolean(options.isPublic);

    // Host
    this.hostSessionToken = hostInfo.sessionToken;

    // Players: sessionToken -> playerObject
    this.players = new Map();

    // Game runtime state
    this.callerPool = [];
    this.calledNumbers = [];
    this.calledNumbersSet = new Set();
    this.currentNumber = null;
    this.timer = null;
    this.winner = null;
    this.chatMessages = [];
    this.lastChatTimestamp = new Map(); // sessionToken -> timestamp

    // Add initial host player
    this.addPlayer(hostInfo.socketId, hostInfo.sessionToken, hostInfo.name, hostInfo.avatar, true);
  }

  addPlayer(socketId, sessionToken, name, avatar, isHost = false) {
    if (this.players.size >= this.maxPlayers && !this.players.has(sessionToken)) {
      throw new Error('Room is full');
    }

    if (this.status !== ROOM_STATUS.LOBBY && !this.players.has(sessionToken)) {
      throw new Error('Game already in progress');
    }

    // Existing player reconnecting
    if (this.players.has(sessionToken)) {
      return this.reconnectPlayer(sessionToken, socketId);
    }

    const card = BingoEngine.generateCard();
    const player = {
      sessionToken,
      socketId,
      name: (name || 'Player').slice(0, 16).trim(),
      avatar: avatar || '🦊',
      isHost,
      isOnline: true,
      card,
      completedLines: [],
      completedCount: 0,
      winningCells: [],
      isWinner: false,
      score: 0,
      disconnectTimer: null,
      joinedAt: Date.now(),
    };

    this.players.set(sessionToken, player);
    return player;
  }

  reconnectPlayer(sessionToken, newSocketId) {
    const player = this.players.get(sessionToken);
    if (!player) return null;

    if (player.disconnectTimer) {
      clearTimeout(player.disconnectTimer);
      player.disconnectTimer = null;
    }

    player.socketId = newSocketId;
    player.isOnline = true;
    return player;
  }

  handleDisconnect(sessionToken, onExpiredCallback) {
    const player = this.players.get(sessionToken);
    if (!player) return;

    player.isOnline = false;

    // Disconnection grace period
    player.disconnectTimer = setTimeout(() => {
      this.players.delete(sessionToken);
      if (this.hostSessionToken === sessionToken) {
        this.migrateHost();
      }
      if (onExpiredCallback) {
        onExpiredCallback(sessionToken);
      }
    }, GAME_CONFIG.RECONNECT_GRACE_PERIOD_MS);
  }

  removePlayer(sessionToken) {
    const player = this.players.get(sessionToken);
    if (player && player.disconnectTimer) {
      clearTimeout(player.disconnectTimer);
    }
    this.players.delete(sessionToken);

    if (this.hostSessionToken === sessionToken) {
      this.migrateHost();
    }
  }

  migrateHost() {
    const onlinePlayers = Array.from(this.players.values()).filter((p) => p.isOnline);
    if (onlinePlayers.length > 0) {
      const newHost = onlinePlayers[0];
      this.hostSessionToken = newHost.sessionToken;
      newHost.isHost = true;
    } else {
      this.hostSessionToken = null;
    }
  }

  startGame(onNumberCalled, onGameOver) {
    if (this.status === ROOM_STATUS.PLAYING) return;

    // Reset game state
    this.callerPool = BingoEngine.createCallerPool();
    this.calledNumbers = [];
    this.calledNumbersSet = new Set();
    this.currentNumber = null;
    this.winner = null;
    this.status = ROOM_STATUS.PLAYING;

    // Generate fresh cards for all players
    for (const player of this.players.values()) {
      player.card = BingoEngine.generateCard();
      player.completedLines = [];
      player.completedCount = 0;
      player.winningCells = [];
      player.isWinner = false;
    }

    this.scheduleNextCall(onNumberCalled, onGameOver);
  }

  scheduleNextCall(onNumberCalled, onGameOver) {
    if (this.status !== ROOM_STATUS.PLAYING) return;

    this.timer = setTimeout(() => {
      if (this.status !== ROOM_STATUS.PLAYING) return;

      const callResult = this.callNextNumber();
      if (callResult.gameOver) {
        if (onGameOver) onGameOver(callResult);
      } else {
        if (onNumberCalled) onNumberCalled(callResult);
        // Continue calling
        this.scheduleNextCall(onNumberCalled, onGameOver);
      }
    }, this.callIntervalSec * 1000);
  }

  pauseGame() {
    if (this.status !== ROOM_STATUS.PLAYING) return false;
    this.status = ROOM_STATUS.PAUSED;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    return true;
  }

  resumeGame(onNumberCalled, onGameOver) {
    if (this.status !== ROOM_STATUS.PAUSED) return false;
    this.status = ROOM_STATUS.PLAYING;
    this.scheduleNextCall(onNumberCalled, onGameOver);
    return true;
  }

  callNextNumber() {
    if (this.callerPool.length === 0) {
      // Numbers pool exhausted
      this.status = ROOM_STATUS.GAME_OVER;
      return {
        gameOver: true,
        reason: 'pool_exhausted',
        number: null,
        winner: null,
        history: this.calledNumbers,
      };
    }

    const number = this.callerPool.pop();
    this.calledNumbers.push(number);
    this.calledNumbersSet.add(number);
    this.currentNumber = number;

    const playerUpdates = [];
    const winners = [];

    // Automatically mark cards and check for 5-line winners
    for (const player of this.players.values()) {
      const markResult = BingoEngine.markNumber(player.card, number);
      const evalResult = BingoEngine.evaluateLines(player.card);

      player.completedLines = evalResult.completedLines;
      player.completedCount = evalResult.completedCount;
      player.winningCells = evalResult.winningCellIndices;

      if (evalResult.isWinner && !player.isWinner) {
        player.isWinner = true;
        player.score += 1;
        winners.push(player);
      }

      playerUpdates.push({
        sessionToken: player.sessionToken,
        name: player.name,
        avatar: player.avatar,
        numberMarked: markResult.marked,
        cellIndex: markResult.cellIndex,
        completedCount: player.completedCount,
        completedLines: player.completedLines,
        isWinner: player.isWinner,
      });
    }

    // Check if we have one or more winners
    if (winners.length > 0) {
      this.status = ROOM_STATUS.GAME_OVER;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.winner = winners[0]; // first winner
      return {
        gameOver: true,
        number,
        history: this.calledNumbers,
        winner: {
          sessionToken: this.winner.sessionToken,
          name: this.winner.name,
          avatar: this.winner.avatar,
          completedCount: this.winner.completedCount,
        },
        winners: winners.map((w) => ({
          sessionToken: w.sessionToken,
          name: w.name,
          avatar: w.avatar,
        })),
        playerUpdates,
      };
    }

    return {
      gameOver: false,
      number,
      history: this.calledNumbers,
      playerUpdates,
    };
  }

  resetForNewGame() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.status = ROOM_STATUS.LOBBY;
    this.callerPool = [];
    this.calledNumbers = [];
    this.calledNumbersSet = new Set();
    this.currentNumber = null;
    this.winner = null;

    // Re-generate fresh cards for next match
    for (const player of this.players.values()) {
      player.card = BingoEngine.generateCard();
      player.completedLines = [];
      player.completedCount = 0;
      player.winningCells = [];
      player.isWinner = false;
    }
  }

  addChatMessage(sessionToken, text) {
    const player = this.players.get(sessionToken);
    if (!player) return null;

    const now = Date.now();
    const lastTime = this.lastChatTimestamp.get(sessionToken) || 0;
    if (now - lastTime < GAME_CONFIG.CHAT_RATE_LIMIT_MS) {
      throw new Error('Message sent too quickly');
    }
    this.lastChatTimestamp.set(sessionToken, now);

    // Simple sanitization & profanity filter
    const sanitizedText = text
      .trim()
      .slice(0, 150)
      .replace(/<[^>]*>?/gm, '');

    if (!sanitizedText) return null;

    const chatMsg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sessionToken,
      senderName: player.name,
      senderAvatar: player.avatar,
      text: sanitizedText,
      timestamp: now,
      isSystem: false,
    };

    this.chatMessages.push(chatMsg);
    if (this.chatMessages.length > 100) {
      this.chatMessages.shift();
    }

    return chatMsg;
  }

  addSystemMessage(text) {
    const chatMsg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      senderName: 'Bingo Bot',
      senderAvatar: '🤖',
      text,
      timestamp: Date.now(),
      isSystem: true,
    };
    this.chatMessages.push(chatMsg);
    return chatMsg;
  }

  /**
   * Sanitized payload sent to all clients in the room.
   * Note: A player receives their own authoritative card; other players see summary.
   */
  toPublicState(recipientSessionToken) {
    const playersList = Array.from(this.players.values()).map((p) => ({
      sessionToken: p.sessionToken,
      name: p.name,
      avatar: p.avatar,
      isHost: p.sessionToken === this.hostSessionToken,
      isOnline: p.isOnline,
      completedCount: p.completedCount,
      completedLines: p.completedLines,
      isWinner: p.isWinner,
      score: p.score,
    }));

    const selfPlayer = this.players.get(recipientSessionToken);

    return {
      roomCode: this.code,
      status: this.status,
      callIntervalSec: this.callIntervalSec,
      maxPlayers: this.maxPlayers,
      isPublic: this.isPublic,
      hostSessionToken: this.hostSessionToken,
      isHost: recipientSessionToken === this.hostSessionToken,
      players: playersList,
      playerCount: playersList.length,
      currentNumber: this.currentNumber,
      calledNumbers: this.calledNumbers,
      winner: this.winner
        ? {
            sessionToken: this.winner.sessionToken,
            name: this.winner.name,
            avatar: this.winner.avatar,
            completedCount: this.winner.completedCount,
          }
        : null,
      myCard: selfPlayer ? selfPlayer.card : null,
      myCompletedCount: selfPlayer ? selfPlayer.completedCount : 0,
      myCompletedLines: selfPlayer ? selfPlayer.completedLines : [],
      myWinningCells: selfPlayer ? selfPlayer.winningCells : [],
      chatMessages: this.chatMessages.slice(-50),
    };
  }

  toLobbySummary() {
    return {
      code: this.code,
      status: this.status,
      playerCount: this.players.size,
      maxPlayers: this.maxPlayers,
      callIntervalSec: this.callIntervalSec,
    };
  }

  destroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    for (const player of this.players.values()) {
      if (player.disconnectTimer) {
        clearTimeout(player.disconnectTimer);
      }
    }
  }
}
