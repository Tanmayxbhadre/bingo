import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Copy, Check, Volume2, VolumeX, LogOut, Crown, Pause, Play } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { SkribblLogo } from './SkribblLogo.jsx';
import { sounds } from '../services/soundEffects.js';
import { ROOM_STATUS } from '@shared/constants/gameConstants.js';

export function SkribblHeader() {
  const navigate = useNavigate();
  const {
    roomState,
    leaveRoom,
    isMuted,
    toggleSound,
    turnTime,
    pauseGame,
    resumeGame,
  } = useGame();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!roomState?.roomCode) return;
    navigator.clipboard.writeText(roomState.roomCode);
    sounds.playPop();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    sounds.playPop();
    leaveRoom();
    navigate('/', { replace: true });
  };

  const isPlaying = roomState?.status === ROOM_STATUS.PLAYING;
  const isPaused = roomState?.status === ROOM_STATUS.PAUSED;
  const isMyTurn = roomState?.isMyTurn;
  const turnPlayerName = roomState?.turnPlayerName || 'Opponent';
  const currentCalled = roomState?.currentCalledNumber;

  return (
    <header className="w-full bg-gradient-to-r from-[#005fb8] via-[#0284c7] to-[#005fb8] border-b-4 border-[#072b4d] px-2.5 sm:px-3 py-1.5 sm:py-2 text-white shadow-[0_4px_12px_rgba(7,43,77,0.35)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Logo & Room Code */}
        <div className="flex items-center space-x-2 sm:space-x-3 w-full md:w-auto justify-between md:justify-start">
          <SkribblLogo size="small" />

          {roomState && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 border-2 border-white/40 px-2 py-0.5 sm:py-1 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
              title="Copy Room Code"
            >
              <span className="text-white/80">Room:</span>
              <span className="font-mono text-yellow-300 font-black">{roomState.roomCode}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-white/80" />}
            </button>
          )}

          {/* Sound & Exit for mobile */}
          <div className="flex items-center space-x-1 md:hidden">
            <button
              onClick={toggleSound}
              className="p-1.5 bg-white/10 rounded-xl"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
            </button>
            <button
              onClick={handleLeave}
              className="p-1.5 bg-rose-500/80 rounded-xl"
              title="Leave Room"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Clean skribbl Turn Clock & Status */}
        {isPlaying && (
          <div className="flex items-center space-x-2 w-full md:w-auto justify-center">
            {/* Countdown Clock */}
            <div className="flex items-center space-x-1.5 bg-white text-[#072847] border-2 border-[#072847] px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-xl font-black text-xs sm:text-sm shadow-[0_2px_0_#072847]">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ea580c]" />
              <span className={turnTime <= 10 ? 'text-rose-600 animate-pulse font-extrabold' : ''}>
                {turnTime}s
              </span>
            </div>

            {/* Concise Status Pill */}
            <div
              className={`px-3 py-0.5 sm:py-1 rounded-xl border-2 text-xs font-black text-center shadow-[0_2px_0_rgba(0,0,0,0.2)] flex items-center space-x-1.5 ${
                isMyTurn
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white border-emerald-700 animate-pulse'
                  : currentCalled
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white border-rose-700 animate-pulse'
                  : 'bg-white/20 text-white border-white/40'
              }`}
            >
              {isMyTurn ? (
                <>
                  <span>⚡</span>
                  <span>YOUR TURN</span>
                </>
              ) : currentCalled ? (
                <>
                  <span>📢</span>
                  <span>CALLED [{currentCalled}]</span>
                </>
              ) : (
                <>
                  <span>⏳</span>
                  <span>{turnPlayerName}'s Turn</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Right: Sound & Leave Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={toggleSound}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all border border-white/30 cursor-pointer shadow-sm active:scale-95"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>
          <button
            onClick={handleLeave}
            className="flex items-center space-x-1.5 bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-xl font-black text-xs border-2 border-rose-700 shadow-[0_2px_0_#9f1239] transition-all active:scale-95 cursor-pointer"
            title="Leave Room"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </div>
    </header>
  );
}

