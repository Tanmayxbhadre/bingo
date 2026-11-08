import { BingoEngine } from '../../../shared/game-rules/BingoEngine.js';
import { GAME_CONFIG, ROOM_STATUS } from '../../../shared/constants/gameConstants.js';

export class Room {
  constructor(code, hostInfo, options = {}) {
    this.code = code;
    this.status = ROOM_STATUS.LOBBY;
    this.createdAt = Date.now();

    // Configuration
    this.turnDurationSec = Math.max(15, Math.min(options.turnDurationSec || GAME_CONFIG.DEFAULT_TURN_TIME_SEC, 90));
    this.maxPlayers = Math.min(options.maxPlayers || GAME_CONFIG.DEFAULT_MAX_PLAYERS, 24);
    this.isPublic = Boolean(options.isPublic);

    // Host
    this.hostSessionToken = hostInfo.sessionToken;

    // Players: sessionToken -> playerObject
    this.players = new Map();

    // Turn-based game runtime state
    this.turnOrder = []; // Array of sessionTokens
    this.currentTurnIndex = 0;
    this.turnPlayerSessionToken = null;
    this.turnTimeRemaining = this.turnDurationSec;
    this.turnTimer = null;
    this.turnInterval = null;

    // Numbers history
    this.calledNumbers = [];
    this.calledNumbersSet = new Set();
    this.currentCalledNumber = null;
    this.currentCallerSessionToken = null;

    this.winner = null;
    this.chatMessages = [];
    this.lastChatTimestamp = new Map();

    // Add initial host player
    this.addPlayer(
      hostInfo.socketId,
      hostInfo.sessionToken,
      hostInfo.name,
      hostInfo.avatar,
      hostInfo.color || '#55b338',
      true
    );
  }

  addPlayer(socketId, sessionToken, name, avatar, color = '#55b338', isHost = false) {
    if (this.players.size >= this.maxPlayers && !this.players.has(sessionToken)) {
      throw new Error('Room is full');
    }

    // Existing player reconnecting
    if (this.players.has(sessionToken)) {
      return this.reconnectPlayer(sessionToken, socketId);
    }

    const isSpectating = this.status !== ROOM_STATUS.LOBBY;
    const card = isSpectating ? null : BingoEngine.generateCard();

    const player = {
      sessionToken,
      socketId,
      name: (name || 'Player').slice(0, 16).trim(),
      avatar: avatar ? String(avatar).slice(0, 32) : 'cool',
      color: color || '#55b338',
      isHost,
      isSpectator: isSpectating,
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

  updatePlayerProfile(sessionToken, { name, avatar, color }) {
    const player = this.players.get(sessionToken);
    if (!player) return null;
    if (name) {
      player.name = String(name).slice(0, 16).trim() || player.name;
    }
    if (avatar) {
      player.avatar = String(avatar).slice(0, 32);
    }
    if (color) {
      player.color = String(color).slice(0, 20);
    }
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

    player.disconnectTimer = setTimeout(() => {
      this.players.delete(sessionToken);
      if (this.hostSessionToken === sessionToken) {
        this.migrateHost();
      }
      // If it was this player's turn, advance turn
      if (this.turnPlayerSessionToken === sessionToken && this.status === ROOM_STATUS.PLAYING) {
        this.advanceTurn();
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

    if (this.turnPlayerSessionToken === sessionToken && this.status === ROOM_STATUS.PLAYING) {
      this.advanceTurn();
    }
  }

  migrateHost() {
    const onlinePlayers = Array.from(this.players.values()).filter((p) => p.isOnline && !p.isSpectator);
    if (onlinePlayers.length > 0) {
      const newHost = onlinePlayers[0];
      this.hostSessionToken = newHost.sessionToken;
      newHost.isHost = true;
    } else {
      this.hostSessionToken = null;
    }
  }

  startGame(onTurnTick, onAutoCall, onGameOver) {
    if (this.status === ROOM_STATUS.PLAYING) return;

    // Reset game state
    this.calledNumbers = [];
    this.calledNumbersSet = new Set();
    this.currentCalledNumber = null;
    this.currentCallerSessionToken = null;
    this.winner = null;
    this.status = ROOM_STATUS.PLAYING;

    // Fresh cards for all non-spectator players
    this.turnOrder = [];
    for (const player of this.players.values()) {
      if (!player.isSpectator) {
        player.card = BingoEngine.generateCard();
        player.completedLines = [];
        player.completedCount = 0;
        player.winningCells = [];
        player.isWinner = false;
        this.turnOrder.push(player.sessionToken);
      }
    }

    if (this.turnOrder.length === 0) {
      throw new Error('Not enough players to start');
    }

    // Shuffle turn order for fairness
    for (let i = this.turnOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.turnOrder[i], this.turnOrder[j]] = [this.turnOrder[j], this.turnOrder[i]];
    }

    this.currentTurnIndex = 0;
    this.turnPlayerSessionToken = this.turnOrder[0];
    this.startTurnTimer(onTurnTick, onAutoCall, onGameOver);
  }

  startTurnTimer(onTurnTick, onAutoCall, onGameOver) {
    this.clearTurnTimers();
    this.turnTimeRemaining = this.turnDurationSec;

    this.turnInterval = setInterval(() => {
      this.turnTimeRemaining--;
      if (onTurnTick) onTurnTick(this.turnTimeRemaining);

      if (this.turnTimeRemaining <= 0) {
        this.clearTurnTimers();
        // Time expired! Auto-call a number on active player's behalf
        this.handleTurnTimeout(onAutoCall, onGameOver);
      }
    }, 1000);
  }

  clearTurnTimers() {
    if (this.turnInterval) {
      clearInterval(this.turnInterval);
      this.turnInterval = null;
    }
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }
  }

  handleTurnTimeout(onAutoCall, onGameOver) {
    if (this.status !== ROOM_STATUS.PLAYING) return;

    const activePlayer = this.players.get(this.turnPlayerSessionToken);
    if (!activePlayer) {
      this.advanceTurn();
      return;
    }

    // Pick an uncalled number from player's card, or random uncalled number
    let numberToCall = null;
    if (activePlayer.card) {
      const unmarkedCell = activePlayer.card.find((c) => !c.marked && !this.calledNumbersSet.has(c.number));
      if (unmarkedCell) {
        numberToCall = unmarkedCell.number;
      }
    }

    if (!numberToCall) {
      // Pick any uncalled 1..25
      const uncalled = [];
      for (let i = GAME_CONFIG.MIN_NUMBER; i <= GAME_CONFIG.MAX_NUMBER; i++) {
        if (!this.calledNumbersSet.has(i)) uncalled.push(i);
      }
      if (uncalled.length > 0) {
        numberToCall = uncalled[Math.floor(Math.random() * uncalled.length)];
      }
    }

    if (numberToCall) {
      const result = this.callNumber(this.turnPlayerSessionToken, numberToCall);
      if (onAutoCall) onAutoCall(result);
      if (result.isWinner && onGameOver) {
        onGameOver(result);
      }
    }
  }

  /**
   * Active player calls a number!
   */
  callNumber(sessionToken, number) {
    if (this.status !== ROOM_STATUS.PLAYING) {
      throw new Error('Game is not active');
    }

    if (this.turnPlayerSessionToken !== sessionToken) {
      throw new Error('It is not your turn to call a number');
    }

    const check = BingoEngine.canCallNumber(number, this.calledNumbersSet);
    if (!check.valid) {
      throw new Error(check.reason);
    }

    const caller = this.players.get(sessionToken);
    if (!caller) throw new Error('Player not found');

    // Register call
    this.calledNumbers.push(number);
    this.calledNumbersSet.add(number);
    this.currentCalledNumber = number;
    this.currentCallerSessionToken = sessionToken;

    // Automatically mark on caller's card because they called it!
    if (caller.card) {
      BingoEngine.markNumber(caller.card, number);
      const evalResult = BingoEngine.evaluateLines(caller.card);
      caller.completedLines = evalResult.completedLines;
      caller.completedCount = evalResult.completedCount;
      caller.winningCells = evalResult.winningCellIndices;

      if (evalResult.isWinner && !caller.isWinner) {
        caller.isWinner = true;
        caller.score += 1;
        this.winner = caller;
        this.status = ROOM_STATUS.GAME_OVER;
        this.clearTurnTimers();
        this.turnPlayerSessionToken = null;
        this.currentCalledNumber = null;

        return {
          success: true,
          number,
          callerSessionToken: sessionToken,
          callerName: caller.name,
          isWinner: true,
          winner: {
            sessionToken: caller.sessionToken,
            name: caller.name,
            avatar: caller.avatar,
            color: caller.color,
            completedCount: caller.completedCount,
          },
        };
      }
    }

    // Advance turn to next player
    this.advanceTurn();

    const nextPlayer = this.players.get(this.turnPlayerSessionToken);

    return {
      success: true,
      number,
      callerSessionToken: sessionToken,
      callerName: caller.name,
      callerCardMarked: true,
      nextTurnSessionToken: this.turnPlayerSessionToken,
      nextTurnName: nextPlayer ? nextPlayer.name : '',
      isWinner: false,
    };
  }

  /**
   * Opponent marks a called number on their card!
   */
  markNumber(sessionToken, number) {
    if (this.status !== ROOM_STATUS.PLAYING) {
      throw new Error('Game is not active');
    }

    if (!this.calledNumbersSet.has(number)) {
      throw new Error(`Number ${number} has not been called yet!`);
    }

    const player = this.players.get(sessionToken);
    if (!player || !player.card) {
      throw new Error('Player or card not found');
    }

    const markResult = BingoEngine.markNumber(player.card, number);
    if (!markResult.marked) {
      return { success: false, marked: false, reason: 'Number is not on your card' };
    }

    const evalResult = BingoEngine.evaluateLines(player.card);
    player.completedLines = evalResult.completedLines;
    player.completedCount = evalResult.completedCount;
    player.winningCells = evalResult.winningCellIndices;

    if (evalResult.isWinner && !player.isWinner) {
      player.isWinner = true;
      player.score += 1;
      this.winner = player;
      this.status = ROOM_STATUS.GAME_OVER;
      this.clearTurnTimers();
      this.turnPlayerSessionToken = null;
      this.currentCalledNumber = null;

      return {
        success: true,
        marked: true,
        cellIndex: markResult.cellIndex,
        completedCount: player.completedCount,
        completedLines: player.completedLines,
        isWinner: true,
        winner: {
          sessionToken: player.sessionToken,
          name: player.name,
          avatar: player.avatar,
          color: player.color,
          completedCount: player.completedCount,
        },
      };
    }

    return {
      success: true,
      marked: true,
      cellIndex: markResult.cellIndex,
      completedCount: player.completedCount,
      completedLines: player.completedLines,
      isWinner: false,
    };
  }

  advanceTurn() {
    if (this.turnOrder.length === 0) return;

    // Filter active online players
    const activeOnlineTokens = this.turnOrder.filter((tok) => {
      const p = this.players.get(tok);
      return p && p.isOnline && !p.isSpectator;
    });

    if (activeOnlineTokens.length === 0) return;

    const currentIndex = activeOnlineTokens.indexOf(this.turnPlayerSessionToken);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % activeOnlineTokens.length;
    this.currentTurnIndex = nextIndex;
    this.turnPlayerSessionToken = activeOnlineTokens[nextIndex];
    this.turnTimeRemaining = this.turnDurationSec;
  }

  pauseGame() {
    if (this.status !== ROOM_STATUS.PLAYING) return false;
    this.status = ROOM_STATUS.PAUSED;
    this.clearTurnTimers();
    return true;
  }

  resumeGame(onTurnTick, onAutoCall, onGameOver) {
    if (this.status !== ROOM_STATUS.PAUSED) return false;
    this.status = ROOM_STATUS.PLAYING;
    this.startTurnTimer(onTurnTick, onAutoCall, onGameOver);
    return true;
  }

  advanceTurn() {
    if (this.turnOrder.length === 0) return;

    // Filter active online players
    const activeOnlineTokens = this.turnOrder.filter((tok) => {
      const p = this.players.get(tok);
      return p && p.isOnline && !p.isSpectator;
    });

    if (activeOnlineTokens.length === 0) return;

    const currentIndex = activeOnlineTokens.indexOf(this.turnPlayerSessionToken);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % activeOnlineTokens.length;
    this.currentTurnIndex = nextIndex;
    this.turnPlayerSessionToken = activeOnlineTokens[nextIndex];
    this.turnTimeRemaining = this.turnDurationSec;
  }

  pauseGame() {
    if (this.status !== ROOM_STATUS.PLAYING) return false;
    this.status = ROOM_STATUS.PAUSED;
    this.clearTurnTimers();
    return true;
  }

  resumeGame(onTurnTick, onAutoCall, onGameOver) {
    if (this.status !== ROOM_STATUS.PAUSED) return false;
    this.status = ROOM_STATUS.PLAYING;
    this.startTurnTimer(onTurnTick, onAutoCall, onGameOver);
    return true;
  }

  resetForNewGame() {
    this.clearTurnTimers();
    this.status = ROOM_STATUS.LOBBY;
    this.calledNumbers = [];
    this.calledNumbersSet = new Set();
    this.currentCalledNumber = null;
    this.currentCallerSessionToken = null;
    this.winner = null;

    for (const player of this.players.values()) {
      player.isSpectator = false;
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
      senderColor: player.color || '#55b338',
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

  addSystemMessage(text, type = 'info') {
    const chatMsg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      senderName: 'skribbl Bot',
      senderAvatar: '✏️',
      text,
      type, // 'info', 'call', 'mark', 'win'
      timestamp: Date.now(),
      isSystem: true,
    };
    this.chatMessages.push(chatMsg);
    return chatMsg;
  }

  toPublicState(recipientSessionToken) {
    const isPlaying = this.status === ROOM_STATUS.PLAYING;

    const playersList = Array.from(this.players.values()).map((p, idx) => ({
      sessionToken: p.sessionToken,
      name: p.name,
      avatar: p.avatar,
      color: p.color || '#55b338',
      isHost: p.sessionToken === this.hostSessionToken,
      isSpectator: Boolean(p.isSpectator),
      isOnline: Boolean(p.isOnline),
      isTurn: isPlaying && p.sessionToken === this.turnPlayerSessionToken,
      completedCount: p.completedCount,
      completedLines: p.completedLines,
      isWinner: p.isWinner,
      score: p.score,
      rank: idx + 1,
    }));

    const selfPlayer = this.players.get(recipientSessionToken);
    const turnPlayer = isPlaying && this.turnPlayerSessionToken ? this.players.get(this.turnPlayerSessionToken) : null;

    return {
      roomCode: this.code,
      status: this.status,
      turnDurationSec: this.turnDurationSec,
      turnTimeRemaining: isPlaying ? this.turnTimeRemaining : 0,
      maxPlayers: this.maxPlayers,
      isPublic: this.isPublic,
      hostSessionToken: this.hostSessionToken,
      isHost: recipientSessionToken === this.hostSessionToken,
      isSpectator: Boolean(selfPlayer?.isSpectator),
      players: playersList,
      playerCount: playersList.length,

      // Turn Info
      turnPlayerSessionToken: isPlaying ? this.turnPlayerSessionToken : null,
      turnPlayerName: turnPlayer ? turnPlayer.name : '',
      turnPlayerAvatar: turnPlayer ? turnPlayer.avatar : '',
      isMyTurn: isPlaying && recipientSessionToken === this.turnPlayerSessionToken,

      // Called numbers
      currentCalledNumber: isPlaying ? this.currentCalledNumber : null,
      currentCallerSessionToken: isPlaying ? this.currentCallerSessionToken : null,
      calledNumbers: this.calledNumbers,

      winner: this.winner
        ? {
            sessionToken: this.winner.sessionToken,
            name: this.winner.name,
            avatar: this.winner.avatar,
            color: this.winner.color || '#55b338',
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
      turnDurationSec: this.turnDurationSec,
    };
  }

  destroy() {
    this.clearTurnTimers();
    for (const player of this.players.values()) {
      if (player.disconnectTimer) {
        clearTimeout(player.disconnectTimer);
      }
    }
  }
}
