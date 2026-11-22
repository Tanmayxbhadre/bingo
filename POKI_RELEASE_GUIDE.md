# 🚀 Poki.com Developer Publishing & Release Guide

**Bingo.io** is fully wired with the official **Poki SDK (v2)**, supporting loading events, gameplay state hooks, commercial ad transitions, and responsive fullscreen display.

---

## 📋 What Was Integrated in the Codebase

1. **Poki SDK Script**: Loaded automatically in [`client/index.html`](file:///Users/Documents/Tanmay/temp/Bingo/client/index.html).
2. **Poki Service Wrapper**: [`client/src/services/pokiService.js`](file:///Users/Documents/Tanmay/temp/Bingo/client/src/services/pokiService.js):
   - Graceful fallback: If played outside Poki (e.g. standalone or local dev), all calls safely no-op without errors.
   - `gameLoadingStart()` and `gameLoadingFinished()` on app boot.
   - `gameplayStart()` when a match begins (`ROOM_STATUS.PLAYING`).
   - `gameplayStop()` when a match ends (`ROOM_STATUS.GAME_OVER`).
   - `commercialBreak()` before rematching ("Play Again"), automatically muting audio while ads play and restoring it afterwards.

---

## 🛠️ Step-by-Step Submission to Poki

### Step 1: Create a Poki Developer Account
1. Visit **[Poki for Developers](https://developers.poki.com/)**.
2. Click **Submit Your Game** or log in to the **[Poki Developer Dashboard](https://developers.poki.com/)**.

---

### Step 2: Prepare Your Submission Details

| Field | Recommended Input for Bingo.io |
|---|---|
| **Game Title** | `Bingo.io` |
| **Category / Genre** | Board Games / Multiplayer / Casual Games / .io Games |
| **Short Description** | Play live 5x5 multiplayer Bingo with friends or solo vs smart AI bots! Stamp numbers, complete 5 lines, and call BINGO! |
| **Controls** | Mouse / Touch / Spacebar (to stamp called numbers) |
| **Game Type** | Hosted URL or HTML5 Zip |
| **Playable URL** | `https://trybingo.me` (or `https://bingo-jo21.onrender.com`) |

---

### Step 3: Game Assets for Poki Store Listing

Poki will ask for promotional graphics for their homepage shelf:
- **Square Icon**: 512×512 PNG (`client/public/icon-512.svg` can be exported).
- **Banner / Thumbnail**: 1200×630 or 1920×1080 PNG (you can use [`client/public/og-preview.png`](file:///Users/Documents/Tanmay/temp/Bingo/client/public/og-preview.png)).
- **Screenshots**: 3–5 gameplay screenshots showing:
  1. 5x5 Bingo board with red stamps and golden line completions.
  2. The Skribbl-style character customizer with fun avatars and colors.
  3. "Play vs AI Bot" instant solo play mode.
  4. Winner celebration with confetti and player stats.

---

### Step 4: Poki QA Checklist

Before approving a game, Poki's QA team checks:
- [x] **No hard crashes or console errors**: Verified with Vitest tests and Vite production build.
- [x] **PokiSDK events hooked**: `init`, `gameLoadingFinished`, `gameplayStart`, `gameplayStop`, `commercialBreak`.
- [x] **Sound muting**: All audio pauses during commercial breaks.
- [x] **Instant playable mode**: "Play vs AI Bot (Solo Mode)" guarantees players never get stuck in empty lobbies.
- [x] **Mobile and desktop responsive**: Tested on touch and keyboard.

---

### Step 5: If Submitting as a Zip Package (Optional)
If Poki asks for an uploaded `.zip` instead of a hosted URL:
1. Run `npm --workspace=client run build`.
2. Zip the contents of the `client/dist/` directory:
   ```bash
   cd client/dist && zip -r ../../bingo-poki-build.zip . && cd ../..
   ```
3. Upload `bingo-poki-build.zip` directly to the Poki Developer Dashboard.
