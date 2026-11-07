import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw, Home, Eye } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { sounds } from '../services/soundEffects.js';

export function WinnerModal({ winner }) {
  const { roomState, playAgain, leaveRoom, sessionToken } = useGame();
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    sounds.playWin();

    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#0084ff', '#ff4500', '#ffb703', '#55b338', '#ff8c00'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#0084ff', '#ff4500', '#ffb703', '#55b338', '#ff8c00'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const isMe = winner?.sessionToken === sessionToken;

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-pop">
        <button
          onClick={() => setMinimized(false)}
          className="skribbl-btn-green px-4 py-2.5 rounded-2xl flex items-center space-x-2 text-sm shadow-xl"
        >
          <Trophy className="w-5 h-5 text-yellow-300" />
          <span>Show Winner ({winner?.name})</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="relative bg-white border-4 border-[#0b2c4d] p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center text-[#0b2c4d] shadow-[0_10px_0_#08233d]">
        {/* Trophy floating badge */}
        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-950 p-3.5 rounded-full border-4 border-[#0b2c4d] shadow-lg animate-bounce-subtle">
          <Trophy className="w-8 h-8 fill-yellow-950" />
        </div>

        <div className="mt-5 mb-2">
          <span className="text-xs uppercase tracking-widest font-black text-slate-400">
            {isMe ? 'YOU WON THE MATCH!' : 'GAME OVER'}
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[#0b2c4d] mt-0.5">
            B I N G O !
          </h2>
        </div>

        {/* Winner Card */}
        <div className="bg-[#f0f4f8] rounded-2xl p-4 my-3 border-3 border-slate-300 flex flex-col items-center shadow-inner">
          <div className="text-5xl sm:text-6xl mb-1 drop-shadow-sm">
            {winner?.avatar || '🏆'}
          </div>
          <div className="text-2xl font-black text-[#0084ff]">
            {winner?.name || 'A Lucky Player'}
          </div>
          <div className="text-xs text-slate-600 mt-1 font-bold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span>Completed 5 winning lines on their card!</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 my-3 text-xs font-black">
          <div className="bg-slate-100 p-2 rounded-xl border-2 border-slate-200">
            <span className="text-slate-400 block text-[9px] uppercase">Numbers Called</span>
            <span className="text-base text-[#0b2c4d]">{roomState?.calledNumbers?.length || 0} / 25</span>
          </div>
          <div className="bg-slate-100 p-2 rounded-xl border-2 border-slate-200">
            <span className="text-slate-400 block text-[9px] uppercase">Lines Won</span>
            <span className="text-base text-[#55b338]">5 Lines</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 mt-4">
          {roomState?.isHost ? (
            <button
              onClick={() => {
                sounds.playPop();
                playAgain();
              }}
              className="w-full skribbl-btn-green py-3 rounded-2xl text-base flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again!</span>
            </button>
          ) : (
            <div className="text-xs text-slate-500 font-bold italic py-1">
              Waiting for room host to start next round...
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMinimized(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs border-2 border-slate-300 flex items-center justify-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Board</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                leaveRoom();
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs border-2 border-slate-300 flex items-center justify-center space-x-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
