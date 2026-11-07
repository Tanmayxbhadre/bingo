import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';

export function BingoCard({ card, winningCells = [], lastMarkedIndex = null }) {
  if (!card || card.length !== 25) {
    return (
      <div className="flex items-center justify-center h-80 bg-white/10 rounded-3xl text-slate-300 font-bold">
        Loading your Bingo card...
      </div>
    );
  }

  const winningSet = new Set(winningCells);

  return (
    <div className="relative bg-white/10 backdrop-blur-md p-3 sm:p-5 rounded-3xl border-2 border-white/20 shadow-2xl max-w-lg mx-auto w-full">
      {/* 5x5 Grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
        {card.map((cell) => {
          const isMarked = cell.marked;
          const isWinningCell = winningSet.has(cell.index);
          const isRecentlyMarked = lastMarkedIndex === cell.index;

          let cellStyle = 'bg-white/80 hover:bg-white text-slate-800 shadow-sm border border-slate-200/60';
          let textColor = 'text-slate-800';

          if (isWinningCell) {
            // Winning line cell highlight (golden sparkle)
            cellStyle = 'bg-gradient-to-br from-amber-300 to-yellow-400 text-amber-950 font-black shadow-card-glow border-2 border-white animate-pulse-fast';
            textColor = 'text-amber-950 font-black';
          } else if (isMarked) {
            // Standard marked cell (vibrant skribbl pink/purple)
            cellStyle = 'bg-gradient-to-br from-pink-500 to-rose-500 text-white font-black shadow-inner border border-pink-400';
            textColor = 'text-white font-extrabold';
          }

          return (
            <div
              key={cell.index}
              className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl select-none transition-all duration-300 ${cellStyle} ${
                isRecentlyMarked ? 'animate-pop scale-105 ring-4 ring-yellow-300' : ''
              }`}
            >
              {/* Number */}
              <span className={`text-xl sm:text-2xl md:text-3xl font-black ${textColor}`}>
                {cell.number}
              </span>

              {/* Badges */}
              {isWinningCell ? (
                <div className="absolute top-1 right-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
                </div>
              ) : isMarked ? (
                <div className="absolute top-1 right-1 opacity-80">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
              ) : null}

              {/* Coordinates subtle dot on corners for visual elegance */}
              <span className="absolute bottom-1 text-[9px] font-semibold opacity-30">
                {isMarked ? '✓' : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

