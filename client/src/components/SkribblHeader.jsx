import React, { useState } from 'react';
import { Clock, Copy, Check, Volume2, VolumeX, LogOut, Crown } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { SkribblLogo } from './SkribblLogo.jsx';
import { sounds } from '../services/soundEffects.js';
import { ROOM_STATUS } from '@shared/constants/gameConstants.js';

export function SkribblHeader() {
  const {
    roomState,
    leaveRoom,
    isMuted,
    toggleSound,
    turnTime,
  } = useGame();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!roomState?.roomCode) return;
    navigator.clipboard.writeText(roomState.roomCode);
    sounds.playPop();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPlaying = roomState?.status === ROOM_STATUS.PLAYING;
  const isMyTurn = roomState?.isMyTurn;
  const turnPlayerName = roomState?.turnPlayerName || 'Opponent';
  const currentCalled = roomState?.currentCalledNumber;

  return (
    <header className="w-full bg-[#08233d] border-b-4 border-[#0b2c4d] px-3 py-2 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Logo & Room Code */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <SkribblLogo size="small" />

          {roomState && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 bg-[#0e3860] hover:bg-[#134470] border-2 border-white/20 px-2.5 py-1 rounded-xl text-xs font-bold transition-all active:scale-95"
              title="Copy Room Code"
            >
              <span className="text-slate-300">Room:</span>
              <span className="font-mono text-yellow-300 font-black">{roomState.roomCode}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
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
              onClick={leaveRoom}
              className="p-1.5 bg-rose-500/80 rounded-xl"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: skribbl Turn Banner! */}
        {isPlaying && (
          <div className="flex items-center space-x-2 w-full md:w-auto justify-center">
            {/* Countdown Clock */}
            <div className="flex items-center space-x-1 bg-white text-[#0b2c4d] border-2 border-[#0b2c4d] px-2.5 py-1 rounded-xl font-black text-sm shadow-sm">
              <Clock className="w-4 h-4 text-[#ff4500]" />
              <span className={turnTime <= 10 ? 'text-rose-600 animate-pulse' : ''}>
                {turnTime}s
              </span>
            </div>

            {/* Turn Announcement Banner */}
            <div
              className={`px-3 py-1.5 rounded-2xl border-2 text-xs sm:text-sm font-black text-center shadow-sm flex items-center space-x-1.5 ${
                isMyTurn
                  ? 'bg-emerald-400 text-emerald-950 border-emerald-600 animate-pulse'
                  : 'bg-yellow-300 text-yellow-950 border-yellow-500'
              }`}
            >
              {isMyTurn ? (
                <>
                  <span>👉</span>
                  <span>IT'S YOUR TURN! Click any number on your card to call it!</span>
                </>
              ) : currentCalled ? (
                <>
                  <span>📢</span>
                  <span>
                    <span className="underline">{turnPlayerName}</span> called [ <span className="text-pink-600 font-extrabold">{currentCalled}</span> ]! Click it on your card!
                  </span>
                </>
              ) : (
                <>
                  <span>⏳</span>
                  <span>
                    Waiting for <span className="underline">{turnPlayerName}</span> to call a number...
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Right: Sound & Leave Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={toggleSound}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>
          <button
            onClick={leaveRoom}
            className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-xl font-bold text-xs border-2 border-rose-800 transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </div>
    </header>
  );
}

