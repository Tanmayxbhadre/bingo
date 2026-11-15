# Changelog

All notable changes to **Bingo.io** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-11-13

### Added
- **Play vs AI Bot (Solo Mode)**: Single-player mode allowing instant gameplay against an intelligent AI bot (`BingoBot 🤖`) without waiting for other players.
- **AI Decision Engine**: Evaluates 12 line trajectories (5 rows, 5 columns, 2 diagonals) with human-like delays (1.2–2.2s calling, 400–1000ms marking).
- **Lobby Bot Support (`+ Add Bot 🤖`)**: Room hosts can populate empty player slots with AI bots.
- **Bot Player Badges**: Distinct visual `🤖 BOT` badges across player lists, leaderboards, and mobile sidebars.
- **Automated Bot Test Suite**: Added 4 unit tests covering bot initialization, number selection heuristics, reaction marking, and winning moves.

---

## [1.2.0] - 2026-11-10

### Added
- **Player Career Stats & Win Streaks**: Local persistence tracking total games played, wins, win streaks, career best streaks, and total lines completed.
- **Career Rank Progression**: Progressive badges from Rookie (🥉), Apprentice (🎖️), Bingo Scout (🎯), Bingo Star (⭐), Champion (🏆), to Grandmaster (👑).
- **Social Sharing & Open Graph**: 1200x630 rich preview cards, dynamic metadata tags, and 1-tap WhatsApp room sharing.
- **Legal Compliance Pages**: Integrated Privacy Policy (`/privacy`) and Terms of Service (`/terms`) routes.
- **SEO Optimization**: Added `robots.txt` and `sitemap.xml` for search crawler indexing.

---

## [1.1.0] - 2026-11-08

### Added
- **PWA & Mobile Ready**: Web App Manifest (`manifest.webmanifest`), home-screen installation icons, and theme configuration.
- **Haptic Feedback**: Vibration triggers on mobile devices when marking cells, calling numbers, or winning.
- **Web Game Portal Support**: Clean iframe/embed responsiveness for portals such as CrazyGames and itch.io.
- **Interactive Emoji Floating Reactions**: Real-time animated emoji reactions floating over the bingo board.

---

## [1.0.0] - 2026-11-07

### Added
- **Initial Release**: Real-time multiplayer 5x5 Bingo with skribbl.io inspired visual art direction.
- **Authoritative Server**: Node.js & Socket.io authoritative room engine preventing cheating and desync.
- **Private & Public Rooms**: Instant room codes with 45s turn timers and automated timeout handling.
- **Interactive Chat & Avatars**: In-room live chat and modular avatar customizer with vibrant color themes.

