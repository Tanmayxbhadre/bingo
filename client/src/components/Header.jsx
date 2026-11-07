import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, LogOut, Play, Pause, RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { ROOM_STATUS } from '@shared/constants/gameConstants.js';
import { sounds } from '../services/soundEffects.js';

export function Header() {
  const { roomState, leaveRoom, isMuted, toggleSound, pauseGame, resumeGame, playAgain } = useGame();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!roomState?.roomCode) return;
    navigator.clipboard.writeText(roomState.roomCode);
    sounds.playPop();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    if (!roomState) return null;
    switch (roomState.status) {
      case ROOM_STATUS.LOBBY:
        return <span className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">Lobby</span>;
      case ROOM_STATUS.PLAYING:
        return <span className="bg-emerald-400 text-emerald-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse shadow-sm">Calling Numbers...</span>;
      case ROOM_STATUS.PAUSED:
        return <span className="bg-rose-400 text-rose-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">Game Paused</span>;
      case ROOM_STATUS.GAME_OVER:
        return <span className="bg-purple-400 text-purple-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">Game Over</span>;
      default:
        return null;
    }
  };

  return (
    <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/15 px-4 py-3 flex items-center justify-between text-white shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 bg-gradient-to-r from-pink-500 to-yellow-400 px-3 py-1.5 rounded-2xl shadow-bouncy transform hover:-rotate-1 transition-transform cursor-pointer">
          <span className="text-2xl">🎯</span>
          <span className="text-xl md:text-2xl font-black tracking-tight text-white drop-shadow-sm">
            Bingo<span className="text-amber-200">.io</span>
          </span>
        </div>

        {roomState && (
          <div className="hidden sm:flex items-center space-x-2 pl-2">
            {getStatusBadge()}
          </div>
        )}
      </div>

      {/* Room Controls & Info */}
      {roomState && (
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Room Code Pill */}
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl font-bold text-sm tracking-wider transition-all shadow-sm active:scale-95"
            title="Click to copy room code"
          >
            <span className="text-slate-300 text-xs font-medium uppercase">Room:</span>
            <span className="font-mono text-yellow-300 font-extrabold text-base">{roomState.roomCode}</span>
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Host Pause/Resume Controls */}
          {roomState.isHost && roomState.status === ROOM_STATUS.PLAYING && (
            <button
              onClick={() => {
                sounds.playPop();
                pauseGame();
              }}
              className="hidden md:flex items-center space-x-1 bg-amber-400 hover:bg-amber-300 text-amber-950 px-3 py-1.5 rounded-xl font-bold text-xs shadow-bouncy active:translate-y-0.5"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          )}

          {roomState.isHost && roomState.status === ROOM_STATUS.PAUSED && (
            <button
              onClick={() => {
                sounds.playPop();
                resumeGame();
              }}
              className="hidden md:flex items-center space-x-1 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 px-3 py-1.5 rounded-xl font-bold text-xs shadow-bouncy active:translate-y-0.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.playPop();
              toggleSound();
            }}
            className="p-2 bg-white/15 hover:bg-white/25 rounded-xl transition-colors text-white"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-300" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}
          </button>

          {/* Leave Button */}
          <button
            onClick={() => {
              sounds.playPop();
              leaveRoom();
            }}
            className="flex items-center space-x-1.5 bg-rose-500/80 hover:bg-rose-500 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95"
            title="Leave Room"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      )}
    </header>
  );
}

