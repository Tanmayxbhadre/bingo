import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Eye, Award, Frown, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { sounds } from '../services/soundEffects.js';

export function WinnerModal({ winner }) {
  const navigate = useNavigate();
  const { roomState, playAgain, leaveRoom, sessionToken } = useGame();
  const [minimized, setMinimized] = useState(false);

  const isMe = winner?.sessionToken === sessionToken;
  const myLines = roomState?.myCompletedCount || 0;
  const numbersCalledCount = roomState?.calledNumbers?.length || 0;

  useEffect(() => {
    if (isMe) {
      // Celebratory fanfare & confetti ONLY for the winner!
      sounds.playWin();

      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ['#0084ff', '#ff4500', '#ffb703', '#55b338', '#ff8c00'],
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ['#0084ff', '#ff4500', '#ffb703', '#55b338', '#ff8c00'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else {
      // Defeat sound for runner up (NO confetti)
      sounds.playDefeat();
    }
  }, [isMe]);

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-pop">
        <button
          onClick={() => setMinimized(false)}
          className={`px-4 py-2.5 rounded-2xl flex items-center space-x-2 text-sm shadow-xl font-black text-white border-3 border-[#0b2c4d] cursor-pointer ${
            isMe ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-700 hover:bg-slate-800'
          }`}
        >
          {isMe ? <Trophy className="w-5 h-5 text-yellow-300" /> : <Award className="w-5 h-5 text-slate-300" />}
          <span>{isMe ? 'Show Victory Screen 🏆' : `Winner: ${winner?.name}`}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-pop select-none">
      <div
        className={`relative border-4 border-[#0b2c4d] p-6 sm:p-7 rounded-3xl max-w-sm w-full text-center shadow-[0_12px_0_#08233d] transition-all ${
          isMe ? 'bg-white' : 'bg-[#fcfdfe]'
        }`}
      >
        {/* Top Floating Badge */}
        {isMe ? (
          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-950 p-3.5 rounded-full border-4 border-[#0b2c4d] shadow-lg animate-bounce">
            <Trophy className="w-8 h-8 fill-yellow-950" />
          </div>
        ) : (
          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-200 text-slate-700 p-3.5 rounded-full border-4 border-[#0b2c4d] shadow-lg">
            <Frown className="w-8 h-8 text-slate-600 stroke-[2.5]" />
          </div>
        )}

        {/* Status Ribbon & Giant Clear Announcement */}
        <div className="mt-4 mb-2">
          {isMe ? (
            <>
              <span className="inline-block bg-emerald-500 text-white font-black text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider border-2 border-emerald-700 shadow-sm">
                🎉 VICTORY!
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-emerald-600 tracking-tight mt-1 drop-shadow-[0_2px_0_#1b4d1b]">
                YOU WON!
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-1">
                ⭐ You completed 5 lines and got BINGO first! ⭐
              </p>
            </>
          ) : (
            <>
              <span className="inline-block bg-rose-500 text-white font-black text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider border-2 border-rose-700 shadow-sm">
                💔 DEFEAT
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-rose-600 tracking-tight mt-1 drop-shadow-[0_2px_0_#9f1239]">
                YOU LOST!
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-1">
                <span className="font-black text-[#0084ff]">{winner?.name}</span> completed 5 lines first!
              </p>
            </>
          )}
        </div>

        {/* Winner Spotlight Card */}
        <div
          className={`rounded-2xl p-3.5 my-3 border-3 flex flex-col items-center shadow-inner ${
            isMe ? 'bg-amber-50 border-amber-300' : 'bg-slate-100 border-slate-300'
          }`}
        >
          <div className="relative mb-1">
            <span className="text-5xl drop-shadow-sm select-none">
              {winner?.avatar || '🤠'}
            </span>
            <span className="absolute -top-3 -right-2 text-xl select-none animate-bounce">
              👑
            </span>
          </div>

          <div className="text-xl font-black text-[#0b2c4d] flex items-center space-x-1.5">
            <span>{winner?.name || 'Winner'}</span>
            {isMe && (
              <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-md">
                YOU
              </span>
            )}
          </div>

          {/* Unmistakable Score Comparison */}
          {!isMe ? (
            <div className="grid grid-cols-2 gap-2 w-full mt-2.5 pt-2 border-t border-slate-200 text-xs">
              <div className="bg-white p-1.5 rounded-xl border border-slate-200">
                <span className="text-[9px] uppercase font-black text-slate-400 block">Your Lines</span>
                <span className="font-black text-rose-600 text-sm">{myLines} / 5</span>
              </div>
              <div className="bg-emerald-50 p-1.5 rounded-xl border border-emerald-300">
                <span className="text-[9px] uppercase font-black text-emerald-600 block">Winner</span>
                <span className="font-black text-emerald-700 text-sm">5 / 5 🏆</span>
              </div>
            </div>
          ) : (
            <div className="text-xs font-black text-emerald-700 mt-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>5 Lines Completed!</span>
            </div>
          )}
        </div>

        {/* Summary Stats Strip */}
        <div className="grid grid-cols-2 gap-2 my-2 text-xs font-black">
          <div className="bg-slate-50 p-2 rounded-xl border-2 border-slate-200">
            <span className="text-slate-400 block text-[9px] uppercase">Numbers Called</span>
            <span className="text-sm text-[#0b2c4d]">{numbersCalledCount} / 25</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border-2 border-slate-200">
            <span className="text-slate-400 block text-[9px] uppercase">Result</span>
            <span className={`text-sm ${isMe ? 'text-emerald-600' : 'text-slate-600'}`}>
              {isMe ? 'Champion 🏆' : 'Runner Up 🥈'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 mt-3.5">
          {roomState?.isHost ? (
            <button
              onClick={() => {
                sounds.playPop();
                playAgain();
              }}
              className="w-full skribbl-btn-green py-3 rounded-2xl text-base font-black flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again!</span>
            </button>
          ) : (
            <div className="text-xs text-slate-500 font-bold italic py-1 bg-slate-100 rounded-xl border border-slate-200">
              ⏳ Waiting for room host to start next round...
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMinimized(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs border-2 border-slate-300 flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Board</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                leaveRoom();
                navigate('/', { replace: true });
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs border-2 border-slate-300 flex items-center justify-center space-x-1 cursor-pointer"
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
