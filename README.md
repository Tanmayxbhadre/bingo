# 🎯 Bingo.io — Real-Time Multiplayer Bingo Game

[![Tests](https://img.shields.io/badge/tests-28%20passed-brightgreen.svg)]()
[![Stack](https://img.shields.io/badge/stack-React%20%7C%20Node.js%20%7C%20Socket.IO-blue.svg)]()
[![Design](https://img.shields.io/badge/inspired%20by-skribbl.io-pink.svg)]()

**Bingo.io** is a full-stack, browser-based real-time multiplayer Bingo web game inspired by the cheerful, playful aesthetic of *skribbl.io*. Friends can create private or public multiplayer rooms, share invite links or 6-digit room codes, and play 5×5 classic Bingo together with real-time automatic marking and instant 5-line win detection.

---

## 🚀 Key Features

- **Authoritative Server Engine**: All number pools, random drawing, automatic marking, line calculations, and win conditions are controlled by the server to prevent cheating or client-side tampering.
- **5×5 Bingo Cards**: Every player receives an independently generated 5×5 card with 25 unique random numbers between 1 and 75 (no free center cell, no mandatory column ranges).
- **Automatic Marking**: Numbers called by the server are automatically marked on matching players' cards in real-time.
- **Winning Condition (ANY 5 Lines)**: The first player to complete any 5 lines (rows, columns, or diagonals) wins BINGO! Intersecting cells contribute to multiple lines.
- **Real-Time Multiplayer Lobby**:
  - 6-character room codes.
  - 1-click invite link copying.
  - Host migration if the host disconnects.
  - 45-second reconnection grace period preserving player card and match progress.
  - Host controls: calling speed (2s, 4s, 6s, 8s), pause/resume, and "Play Again" rematch without leaving the room.
- **Live Room Chat**: Room messaging with username, avatar, timestamps, quick emoji reactions, and rate limiting.
- **Custom Sound Effects & Celebrations**: Synthesized Web Audio API sound effects (number call chime, mark chime, win fanfare) with mute toggle, plus confetti explosion for winners.
- **Public Room Directory**: Browse active public games and join waiting lobbies with one click.
- **Playful skribbl.io Aesthetic**: Colorful candy buttons, bouncy animations, rounded cards, Fredoka typography, and animal avatars.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** (SPA with hooks and Context API)
- **Vite** (Next-generation lightning-fast build tool)
- **Tailwind CSS** (Custom playful color palette and animations)
- **React Router 6** (Seamless client-side routing)
- **Socket.IO Client** (Real-time WebSocket communication)
- **Lucide React** (Clean, playful UI iconography)
- **Canvas-Confetti** (Winner celebration effects)
- **Web Audio API** (Zero-asset audio synthesizer)

### Backend
- **Node.js** (v18+)
- **Express.js** (HTTP REST and static file serving)
- **Socket.IO** (Real-time bidirectional event pipeline)
- **CORS & Dotenv** (Configuration and security)
- **Vitest** (Comprehensive automated testing suite)

---

## 📁 Project Structure

```text
Bingo/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── AvatarPicker.jsx # 12 playful animal avatars
│   │   │   ├── BingoCard.jsx    # 5x5 card with auto-marked & winning-line glow
│   │   │   ├── Header.jsx       # Room code, pause/resume, mute, leave
│   │   │   ├── LineProgress.jsx # 5-line progress meter & star tracker
│   │   │   ├── NumberCaller.jsx # Latest called ball & history strip
│   │   │   ├── PlayerSidebar.jsx# Live player standings & chat
│   │   │   └── WinnerModal.jsx  # Confetti & victory screen
│   │   ├── context/
│   │   │   └── GameContext.jsx  # Global Socket.IO state & actions
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Landing page, profile setup, create/join/public
│   │   │   └── RoomPage.jsx     # Seamless lobby & active game view
│   │   ├── services/
│   │   │   └── soundEffects.js  # Web Audio API sound synthesizer
│   │   ├── App.jsx              # App routes
│   │   ├── index.css            # Tailwind & font styling
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Authoritative Node.js + Socket.IO backend
│   ├── src/
│   │   ├── game/
│   │   │   └── Room.js          # Room game loop, timers, players, chat
│   │   ├── services/
│   │   │   └── RoomManager.js   # In-memory room registry & code generator
│   │   ├── socket/
│   │   │   └── socketHandler.js # Socket.IO event controllers & validation
│   │   └── index.js             # Express app, health check, static server
│   └── test/
│       ├── bingoEngine.test.js  # Card generation, pool, and 12-line win tests
│       └── roomMultiplayer.test.js # Room lifecycle, reconnect, host migration tests
├── shared/                      # Isomorphic game rules & constants
│   ├── constants/
│   │   └── gameConstants.js     # Config, room statuses, avatars, event names
│   └── game-rules/
│       └── BingoEngine.js       # Pure, testable Bingo game rules engine
├── package.json                 # Monorepo workspaces & scripts
├── vercel.json                  # Frontend Vercel deployment configuration
├── render.yaml                  # Backend Render deployment configuration
└── .env.example
```

---

## 🧪 Automated Testing

Bingo.io includes 28 automated tests verifying the core game engine and multiplayer state machine:

```bash
npm test
```

### Verified Test Cases:
1. **Card Generation**:
   - Exactly 25 numbers per card.
   - All numbers between 1 and 75.
   - Zero duplicate numbers on any card.
   - Independent randomization across players.
2. **Number Calling**:
   - Pool contains 75 unique numbers.
   - No duplicates called.
   - Exhaustion handling.
3. **Automatic Marking & 12 Winning Lines**:
   - Correctly marks matching cells.
   - Any of 5 horizontal rows.
   - Any of 5 vertical columns.
   - Both diagonals (main & anti-diagonal).
   - Mixed rows, columns, and diagonals.
   - Intersecting shared cells calculated properly.
   - Exactly 4 completed lines does **NOT** win.
   - Exactly 5 completed lines triggers **WINNER**.
   - Server-authoritative card validation against officially called numbers.
4. **Multiplayer & Room State**:
   - Room creation with unique 6-character code.
   - Joining rooms and rejection of full rooms.
   - Rejection of invalid room codes.
   - Non-host blocked from starting game.
   - Game pause and resume.
   - Disconnection grace period and card preservation on reconnect.
   - Automatic host migration.
   - Chat message delivery and rate limiting.
   - Public room directory listing.

---

## 💻 Running Locally

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Servers
To run both the server and client concurrently:
```bash
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Backend server (port 4000)
npm run dev:server

# Terminal 2: Vite client (port 5173)
npm run dev:client
```

Open your browser at `http://localhost:5173` to play!

### 4. Build for Production
```bash
npm run build
npm start
```
The server will start on port 4000 and serve the compiled frontend directly from `client/dist/`.

---

## 🌐 Deployment Instructions

### Deploy Frontend to Vercel
1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the root directory to `client` or use the provided `vercel.json` at root.
4. Configure the environment variable:
   - `VITE_SERVER_URL`: URL of your deployed backend (e.g. `https://bingo-io-server.onrender.com`).
5. Deploy!

### Deploy Backend to Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Set Environment Variables:
   - `PORT`: `4000` (or leave default `$PORT`)
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: Your Vercel frontend URL
5. Health Check path: `/health`

---

## 📝 Scaling & Architecture Notes

- **Current In-Memory Management**: Rooms are maintained in memory for sub-millisecond real-time responsiveness and zero database setup.
- **Server Restart Behavior**: If the backend instance restarts, active in-memory rooms are cleared; players can immediately start fresh rooms.
- **Cross-Instance Scaling**: For horizontal scaling across multiple container instances, plug in `@socket.io/redis-adapter` with a Redis instance (e.g., Upstash or Redis Cloud) and persist match records to PostgreSQL / Supabase.

---

## 📄 License
MIT License. Built with ❤️ for fun multiplayer gaming!

# bingo
