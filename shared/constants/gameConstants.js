export const GAME_CONFIG = {
  GRID_SIZE: 5,
  TOTAL_CELLS: 25,
  MIN_NUMBER: 1,
  MAX_NUMBER: 75,
  WINNING_LINE_COUNT: 5,
  TOTAL_POSSIBLE_LINES: 12, // 5 rows + 5 cols + 2 diagonals
  DEFAULT_CALL_INTERVAL_SEC: 4,
  MIN_CALL_INTERVAL_SEC: 2,
  MAX_CALL_INTERVAL_SEC: 10,
  DEFAULT_MAX_PLAYERS: 12,
  RECONNECT_GRACE_PERIOD_MS: 45000, // 45 seconds to reconnect
  CHAT_RATE_LIMIT_MS: 800,
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
  PUBLIC_ROOMS_LIST: 'public_rooms_list',

  // Game flow
  START_GAME: 'game_start',
  PAUSE_GAME: 'game_pause',
  RESUME_GAME: 'game_resume',
  NUMBER_CALLED: 'number_called',
  GAME_OVER: 'game_over',
  PLAY_AGAIN: 'play_again',

  // Player state
  CARD_UPDATE: 'card_update',
  PLAYER_WON: 'player_won',

  // Chat
  CHAT_MESSAGE: 'chat_message',

  // System / Error
  ERROR: 'error_message',
  PING: 'ping_check',
  PONG: 'pong_check',
};

export const AVATARS = [
  { id: 'fox', emoji: '🦊', label: 'Speedy Fox', bg: 'bg-orange-100 border-orange-400' },
  { id: 'panda', emoji: '🐼', label: 'Chill Panda', bg: 'bg-emerald-100 border-emerald-400' },
  { id: 'lion', emoji: '🦁', label: 'Brave Lion', bg: 'bg-amber-100 border-amber-400' },
  { id: 'bunny', emoji: '🐰', label: 'Lucky Bunny', bg: 'bg-pink-100 border-pink-400' },
  { id: 'cat', emoji: '🐱', label: 'Curious Cat', bg: 'bg-purple-100 border-purple-400' },
  { id: 'dog', emoji: '🐶', label: 'Happy Pup', bg: 'bg-blue-100 border-blue-400' },
  { id: 'bear', emoji: '🐻', label: 'Cozy Bear', bg: 'bg-amber-200 border-amber-500' },
  { id: 'koala', emoji: '🐨', label: 'Sleepy Koala', bg: 'bg-teal-100 border-teal-400' },
  { id: 'frog', emoji: '🐸', label: 'Jumpy Frog', bg: 'bg-green-100 border-green-400' },
  { id: 'unicorn', emoji: '🦄', label: 'Magic Horn', bg: 'bg-fuchsia-100 border-fuchsia-400' },
  { id: 'dragon', emoji: '🐲', label: 'Fire Drake', bg: 'bg-rose-100 border-rose-400' },
  { id: 'penguin', emoji: '🐧', label: 'Cool Penguin', bg: 'bg-sky-100 border-sky-400' },
];
