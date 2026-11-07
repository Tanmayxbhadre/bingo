import React from 'react';
import { Star, Trophy, Info } from 'lucide-react';
import { GAME_CONFIG } from '@shared/constants/gameConstants.js';

export function LineProgress({ completedCount = 0, completedLines = [] }) {
  const target = GAME_CONFIG.WINNING_LINE_COUNT; // 5 lines
  const percentage = Math.min(100, Math.round((completedCount / target) * 100));

  return (
    <div className="w-full max-w-lg mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-white shadow-lg">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-yellow-300" />
          <span className="text-sm font-bold">Winning Goal</span>
        </div>
        <div className="text-xs font-black bg-yellow-400 text-yellow-950 px-2.5 py-0.5 rounded-full shadow-sm">
          {completedCount} / {target} Lines Complete
        </div>
      </div>

      {/* 5-Star Indicator */}
      <div className="flex items-center justify-between space-x-1.5 my-2">
        {[1, 2, 3, 4, 5].map((step) => {
          const isDone = completedCount >= step;
          return (
            <div
              key={step}
              className={`flex-1 py-1.5 rounded-xl flex items-center justify-center space-x-1 transition-all duration-300 ${
                isDone
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-black shadow-md scale-102'
                  : 'bg-white/10 text-white/40 border border-white/5'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isDone ? 'fill-amber-950 text-amber-950' : 'text-white/30'}`} />
              <span className="text-xs font-bold">Line {step}</span>
            </div>
          );
        })}
      </div>

      {/* Helper caption */}
      <div className="text-[11px] text-slate-300/90 text-center flex items-center justify-center space-x-1 mt-1">
        <Info className="w-3 h-3 text-yellow-300" />
        <span>Any 5 rows, columns, or diagonals win BINGO!</span>
      </div>
    </div>
  );
}

