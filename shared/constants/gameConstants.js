export const GAME_CONFIG = {
  GRID_SIZE: 5,
  TOTAL_CELLS: 25,
  MIN_NUMBER: 1,
  MAX_NUMBER: 25,
  WINNING_LINE_COUNT: 5,
  TOTAL_POSSIBLE_LINES: 12,
  DEFAULT_TURN_TIME_SEC: 45,
  DEFAULT_MAX_PLAYERS: 12,
  RECONNECT_GRACE_PERIOD_MS: 45000,
  CHAT_RATE_LIMIT_MS: 500,
  ROOM_CODE_LENGTH: 6,
};

export const ROOM_STATUS = {
  LOBBY: 'LOBBY',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
};

export const SOCKET_EVENTS = {
  // Connection / Room
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  ROOM_UPDATED: 'room_updated',
  PLAYER_JOINED: 'player_joined',
  PLAYER_LEFT: 'player_left',
  PLAYER_RECONNECTED: 'player_reconnected',
  LIST_PUBLIC_ROOMS: 'list_public_rooms',

  // Game flow
  START_GAME: 'game_start',
  PAUSE_GAME: 'game_pause',
  RESUME_GAME: 'game_resume',
  GAME_OVER: 'game_over',
  PLAY_AGAIN: 'play_again',

  // Turn-based number calling & marking
  CALL_NUMBER: 'call_number',
  MARK_NUMBER: 'mark_number',
  NUMBER_CALLED: 'number_called',
  CELL_MARKED: 'cell_marked',
  TURN_CHANGED: 'turn_changed',

  // Real-time floating emoji reaction
  REACTION_EMOJI: 'reaction_emoji',

  // Bot & Solo Play
  CREATE_BOT_GAME: 'create_bot_game',
  ADD_BOT: 'add_bot',

  // Profile update
  UPDATE_PROFILE: 'update_profile',

  // Chat
  CHAT_MESSAGE: 'chat_message',

  // System
  ERROR: 'error_message',
};

export const SKRIBBL_COLORS = [
  '#55b338', // Playful Green
  '#0084ff', // Vibrant Blue
  '#ff4500', // Comic Orange-Red
  '#ffb703', // Warm Yellow
  '#9b5de5', // Candy Purple
  '#f15bb5', // Hot Pink
  '#00bbcb', // Aqua Cyan
  '#8338ec', // Deep Violet
  '#fb5607', // Fire Orange
  '#3a86ff', // Sky Blue
];

export const AVATARS = [
  { id: 'cool', emoji: '😎', label: 'Cool Shades', color: '#0084ff' },
  { id: 'classic', emoji: '😃', label: 'Classic Doodler', color: '#55b338' },
  { id: 'star', emoji: '🤩', label: 'Starry Eyes', color: '#ffb703' },
  { id: 'cowboy', emoji: '🤠', label: 'Cowboy', color: '#fb5607' },
  { id: 'nerd', emoji: '🤓', label: 'Brainiac Nerd', color: '#55b338' },
  { id: 'cat', emoji: '🐱', label: 'Kitty Neko', color: '#f15bb5' },
  { id: 'robot', emoji: '🤖', label: 'Cyber Bot', color: '#00bbcb' },
  { id: 'ninja', emoji: '🥷', label: 'Shadow Ninja', color: '#8338ec' },
  { id: 'panda', emoji: '🐼', label: 'Chill Panda', color: '#55b338' },
  { id: 'king', emoji: '👑', label: 'Royal King', color: '#ffb703' },
  { id: 'alien', emoji: '👽', label: 'Space Alien', color: '#00bbcb' },
  { id: 'gamer', emoji: '🎧', label: 'Gamer Pro', color: '#3a86ff' },
  { id: 'pirate', emoji: '🏴‍☠️', label: 'Pirate Captain', color: '#ff4500' },
  { id: 'devil', emoji: '😈', label: 'Mischief Horns', color: '#fb5607' },
  { id: 'frog', emoji: '🐸', label: 'Bubbly Frog', color: '#55b338' },
  { id: 'ghost', emoji: '👻', label: 'Spooky Boo', color: '#9b5de5' },
];
