# WebSocket API Specification — Bingo.io

This document specifies the Socket.IO event protocol connecting the React client and the Node.js game server.

---

## 📤 Client ➔ Server Events

### Room Management

| Event | Payload | Response Callback | Description |
|---|---|---|---|
| `create_room` | `{ sessionToken, name, avatar, color, options: { turnDurationSec, maxPlayers, isPublic } }` | `{ success: boolean, roomCode, state }` | Creates a new private or public room. |
| `join_room` | `{ roomCode, sessionToken, name, avatar, color }` | `{ success: boolean, roomCode, state }` | Joins or reconnects to an existing room. |
| `create_bot_game` | `{ sessionToken, name, avatar, color }` | `{ success: boolean, roomCode, state }` | Instantly spawns a solo room vs AI Bot. |
| `add_bot` | `{}` | `{ success: boolean, bot }` | Host adds an AI bot to fill an empty lobby slot. |
| `start_game` | `{}` | `{ success: boolean }` | Host starts the match. |
| `list_public_rooms` | `{}` | `{ success: boolean, rooms: RoomSummary[] }` | Queries currently open public lobbies. |
| `leave_room` | `{}` | None | Disconnects player from the room. |

### Gameplay

| Event | Payload | Response Callback | Description |
|---|---|---|---|
| `call_number` | `{ number: 1..25 }` | `{ success: boolean, ... }` | Active player calls a number on their turn. |
| `mark_number` | `{ number: 1..25 }` | `{ success: boolean, ... }` | Player stamps an opponent's called number. |
| `pause_game` | `{}` | `{ success: boolean }` | Host pauses turn countdown. |
| `resume_game` | `{}` | `{ success: boolean }` | Host resumes paused turn countdown. |
| `play_again` | `{}` | `{ success: boolean }` | Resets card grids for a new match. |

### Social & Chat

| Event | Payload | Response Callback | Description |
|---|---|---|---|
| `chat_message` | `{ text: string }` | `{ success: boolean }` | Sends sanitized message to room chat. |
| `reaction_emoji` | `{ emoji: string }` | None | Spawns floating reaction bubble. |

---

## 📥 Server ➔ Client Broadcasts

| Event | Payload | Description |
|---|---|---|
| `room_state` | `RoomState` | Full authoritative public room state broadcast on changes. |
| `game_start` | `{ roomCode }` | Fired when cards are scrambled and round begins. |
| `turn_tick` | `{ timeRemaining: number }` | Fired every second with countdown timer. |
| `turn_timeout` | `{ callerName, number }` | Fired when player runs out of turn time and auto-calls. |
| `number_called` | `{ number, callerName, nextTurnSessionToken }` | Fired when a valid number is called. |
| `number_marked` | `{ number, playerSessionToken, completedCount }` | Fired when a player marks a called number. |
| `game_over` | `{ isWinner: true, winner: PlayerSummary }` | Fired when the first player completes 5 lines. |
| `chat_message` | `ChatMessage` | Broadcasts new chat message to all room players. |
| `reaction_emoji` | `{ emoji, senderName }` | Broadcasts floating emoji to all room clients. |
| `player_joined` | `{ sessionToken, name, avatar }` | Announcement when a new player connects. |
| `player_left` | `{ sessionToken, name }` | Announcement when a player exits. |
| `player_reconnected` | `{ sessionToken, name }` | Fired when a disconnected player restores socket. |
