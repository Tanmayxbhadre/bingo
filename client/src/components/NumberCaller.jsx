import React from 'react';
import { Volume2, Hash } from 'lucide-react';

export function NumberCaller({ currentNumber, calledNumbers = [], callIntervalSec = 4 }) {
  // Recent numbers excluding current
  const recentNumbers = [...calledNumbers].reverse().slice(1, 15);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto space-y-3">
      {/* Latest Called Number Ball Display */}
      <div className="relative flex flex-col items-center">
        <div className="text-xs uppercase tracking-widest font-extrabold text-amber-300 drop-shadow mb-1 flex items-center space-x-1">
          <Hash className="w-3.5 h-3.5" />
          <span>Latest Called Number</span>
        </div>

        <div className="relative group">
          {/* Outer glow ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-yellow-400 to-indigo-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>

          {/* Bingo Ball */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500 border-4 border-white shadow-2xl flex flex-col items-center justify-center transform transition-transform duration-300 hover:scale-105">
            <span className="text-4xl sm:text-5xl font-black text-amber-950 drop-shadow-sm select-none">
              {currentNumber !== null && currentNumber !== undefined ? currentNumber : '—'}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900/80 -mt-1">
              BINGO
            </span>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-300 mt-1">
          Called: <span className="font-bold text-yellow-300">{calledNumbers.length}</span> / 75 numbers
        </div>
      </div>

      {/* Number History Strip */}
      <div className="w-full bg-black/25 backdrop-blur-sm p-2.5 rounded-2xl border border-white/10 flex flex-col items-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5 self-start px-2 flex justify-between w-full">
          <span>Recent Calls</span>
          <span className="text-slate-400">Auto-Marked on Card</span>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full py-1 px-1 scrollbar-thin">
          {recentNumbers.length === 0 ? (
            <div className="text-xs text-slate-400 italic py-1 px-2">
              Previous numbers will appear here...
            </div>
          ) : (
            recentNumbers.map((num, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center font-bold text-white text-sm shadow-sm hover:scale-105 transition-transform"
              >
                {num}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

