import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw, Home } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { sounds } from '../services/soundEffects.js';

export function WinnerModal({ winner, onClose }) {
  const { roomState, playAgain, leaveRoom, sessionToken } = useGame();

  useEffect(() => {
    sounds.playWin();

    // Trigger colorful confetti shower
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#FF4D8D', '#FFB703', '#3A86FF', '#06D6A0'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#FF4D8D', '#FFB703', '#3A86FF', '#06D6A0'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const isMe = winner?.sessionToken === sessionToken;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-pop">
      <div className="relative bg-gradient-to-b from-slate-900 to-indigo-950 border-4 border-yellow-400 p-6 sm:p-8 rounded-3xl max-w-md w-full text-center text-white shadow-2xl">
        {/* Sparkle decorative icons */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-950 p-3 rounded-full border-4 border-slate-900 shadow-xl animate-bounce-subtle">
          <Trophy className="w-10 h-10 fill-yellow-950" />
        </div>

        <div className="mt-6 mb-2">
          <span className="text-xs uppercase tracking-widest font-black text-yellow-300">
            {isMe ? 'YOU WON THE MATCH!' : 'WE HAVE A WINNER!'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
            B I N G O !
          </h2>
        </div>

        {/* Winner Card */}
        <div className="bg-white/10 rounded-2xl p-4 my-4 border border-white/20 flex flex-col items-center">
          <div className="text-5xl sm:text-6xl mb-2 drop-shadow-md">
            {winner?.avatar || '🏆'}
          </div>
          <div className="text-2xl font-black text-yellow-300">
            {winner?.name || 'A Lucky Player'}
          </div>
          <div className="text-xs text-slate-300 mt-1 font-semibold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>Completed 5 winning lines on their card!</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 my-4 text-xs font-bold">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">TOTAL CALLED</span>
            <span className="text-base text-yellow-300">{roomState?.calledNumbers?.length || 0} Numbers</span>
          </div>
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[10px]">TOTAL PLAYERS</span>
            <span className="text-base text-pink-300">{roomState?.players?.length || 1} Players</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          {roomState?.isHost ? (
            <button
              onClick={() => {
                sounds.playPop();
                playAgain();
              }}
              className="w-full sm:w-auto flex-1 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black py-3 px-5 rounded-2xl shadow-bouncy active:translate-y-1 transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          ) : (
            <div className="text-xs text-slate-300 italic mb-2">
              Waiting for host to start next round...
            </div>
          )}

          <button
            onClick={() => {
              sounds.playPop();
              leaveRoom();
            }}
            className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-5 rounded-2xl transition-all flex items-center justify-center space-x-1 text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Exit to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

