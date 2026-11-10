# 🎯 Bingo.io — Real-Time Multiplayer 5x5 Bingo Game

[![Live Demo](https://img.shields.io/badge/demo-bingo--jo21.onrender.com-blue?style=for-the-badge&logo=render)](https://bingo-jo21.onrender.com)
[![Tests](https://img.shields.io/badge/tests-21%20passed-brightgreen.svg?style=for-the-badge)]()
[![PWA Ready](https://img.shields.io/badge/PWA-installable-orange.svg?style=for-the-badge&logo=pwa)]()
[![License](https://img.shields.io/badge/license-MIT-purple.svg?style=for-the-badge)]()

**Bingo.io** is a full-stack, browser and mobile-friendly real-time multiplayer Bingo game inspired by the cheerful, playful aesthetic of *skribbl.io*. Friends can create custom rooms, share invite links, and play 5×5 classic Bingo together with real-time turn synchronization, mobile haptics, live chat, and instant 5-line win detection.

---

## 🎮 Live Game
👉 **Play now:** [https://bingo-jo21.onrender.com](https://bingo-jo21.onrender.com)

---

## 🚀 Key Features

- **Authoritative Server Engine**: All cards (numbers 1–25), turn management, automatic verification, and line calculations are strictly validated by the server to prevent cheating or client-side tampering.
- **Turn-Based Multiplayer Interaction (Skribbl.io Style)**:
  - Both players share numbers 1–25 in independently scrambled 5×5 grids.
  - Players take turns picking a number from their card to call it.
  - When an opponent calls a number, the player clicks it on their card to stamp a red crayon `✕` with instant 0ms optimistic visual feedback.
- **Winning Condition (ANY 5 Lines)**: The first player to complete any 5 lines (rows, columns, or diagonals) wins BINGO! Intersecting cells contribute to multiple lines.
- **PWA (Progressive Web App)**: Installable directly on Android, iPhone, and desktop browsers without going through app stores.
- **Mobile Haptic Feedback**: Physical vibration feedback when stamping numbers, receiving turn alerts, or winning.
- **Social Sharing**: One-tap victory sharing with pre-formatted invitation cards via Web Share API and rich OpenGraph social tags for WhatsApp and Discord.
- **Vibrant & Dynamic Background**: Smoothly panning diagonal comic polka-dot patterns, radiant ambient glow orbs, and floating 3D-illustrated glossy Bingo balls drifting across the viewport.
- **Real-Time Multiplayer Lobby**:
  - 6-character room codes.
  - 1-click invite link copying.
  - Host migration if the host disconnects.
  - Reconnection grace period preserving player card and match progress.
  - Host controls: turn duration (30s, 45s, 60s), pause/resume, and "Play Again" rematch without leaving the room.
- **16 Custom Comic Avatars**: Full avatar customizer with chunky 3D buttons, comic colors, and an expressive doodler roster.
- **Live Room Chat & Floating Reactions**: Room messaging with username, avatar, timestamps, quick emoji reactions, and rate limiting.
- **Synthesized Web Audio API**: Zero-asset audio synthesizer with mute toggle, plus confetti explosion for winners.
- **Web Portal Ready**: Fully compatible with game portals like itch.io and CrazyGames.

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

### Testing
- **Vitest** (Unit and integration tests for game engine and multiplayer rooms)

---

## 🏃 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/Tanmayxbhadre/bingo.git
cd bingo

# Install all dependencies (workspaces root, client, and server)
npm install

# Start development servers (Vite on :5173 and Express on :4000)
npm run dev
```

### Running Tests
```bash
# Run all Vitest test suites
npm test

# Run match simulation test
node server/test/simulateMatch.js
```

### Production Build
```bash
# Build the client for production
npm --workspace=client run build

# Start production server
npm --workspace=server start
```

---

## 📜 License
This project is licensed under the MIT License.
