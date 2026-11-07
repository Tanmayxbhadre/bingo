export const GAME_CONFIG = {
  GRID_SIZE: 5,
  TOTAL_CELLS: 25,
  MIN_NUMBER: 1,
  MAX_NUMBER: 75,
  WINNING_LINE_COUNT: 5,
  TOTAL_POSSIBLE_LINES: 12, // 5 rows + 5 cols + 2 diagonals
  DEFAULT_TURN_TIME_SEC: 45, // Time to call a number on your turn
  DEFAULT_MAX_PLAYERS: 12,
  RECONNECT_GRACE_PERIOD_MS: 45000,
  CHAT_RATE_LIMIT_MS: 600,
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
  CALL_NUMBER: 'call_number', // Active turn player calls a number
  MARK_NUMBER: 'mark_number', // Opponents click to mark a called number on their card
  NUMBER_CALLED: 'number_called', // Broadcast when a number is called
  CELL_MARKED: 'cell_marked',     // Broadcast when a player marks a number
  TURN_CHANGED: 'turn_changed',   // Broadcast whose turn it is now

  // Chat
  CHAT_MESSAGE: 'chat_message',

  // System
  ERROR: 'error_message',
};

// skribbl.io style colorful avatars and customizable colors
export const SKRIBBL_COLORS = [
  '#55b338', // Green
  '#0084ff', // Blue
  '#ff4500', // Orange-Red
  '#ffb703', // Yellow
  '#9b5de5', // Purple
  '#f15bb5', // Pink
  '#00bbcb', // Teal
  '#8338ec', // Violet
];

export const AVATARS = [
  { id: 'happy', emoji: '😃', label: 'Happy', color: '#ffb703' },
  { id: 'cool', emoji: '😎', label: 'Cool', color: '#0084ff' },
  { id: 'wink', emoji: '😉', label: 'Wink', color: '#55b338' },
  { id: 'dizzy', emoji: '😵', label: 'Dizzy', color: '#9b5de5' },
  { id: 'nerd', emoji: '🤓', label: 'Nerd', color: '#ff4500' },
  { id: 'star', emoji: '🤩', label: 'Starry', color: '#ffb703' },
  { id: 'surprised', emoji: '😮', label: 'Surprised', color: '#00bbcb' },
  { id: 'love', emoji: '😍', label: 'Love', color: '#f15bb5' },
  { id: 'smug', emoji: '😏', label: 'Smug', color: '#55b338' },
  { id: 'party', emoji: '🥳', label: 'Party', color: '#ff8c00' },
  { id: 'sleepy', emoji: '😴', label: 'Sleepy', color: '#8338ec' },
  { id: 'clown', emoji: '🤡', label: 'Joker', color: '#ff4500' },
];
