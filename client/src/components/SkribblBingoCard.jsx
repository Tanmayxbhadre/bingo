import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { sounds } from '../services/soundEffects.js';

export function SkribblBingoCard({
  card,
  isMyTurn,
  currentCalledNumber,
  calledNumbers = [],
  winningCells = [],
  completedCount = 0,
  completedLines = [],
}) {
  const { callNumber, markNumber } = useGame();
  const calledSet = new Set(calledNumbers);
  const winningSet = new Set(winningCells);

  const handleCellClick = (cell) => {
    if (cell.marked) return;

    // 1. If this number has already been called by anyone, clicking it MARKS it!
    if (calledSet.has(cell.number)) {
      sounds.playMark();
      markNumber(cell.number);
      return;
    }

    // 2. If it's my turn and number has not been called, clicking it CALLS it!
    if (isMyTurn) {
      sounds.playPop();
      callNumber(cell.number);
    }
  };

  if (!card || card.length !== 25) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-3xl border-4 border-[#0b2c4d] text-slate-500 font-bold">
        Drawing your Bingo card...
      </div>
    );
  }

  // Letters B-I-N-G-O for the 5 lines with skribbl colors
  const bingoLetters = [
    { letter: 'B', color: '#0084ff', shadow: '#004d99' },
    { letter: 'I', color: '#ff4500', shadow: '#b33000' },
    { letter: 'N', color: '#ffb703', shadow: '#b38000' },
    { letter: 'G', color: '#55b338', shadow: '#2d661b' },
    { letter: 'O', color: '#ff8c00', shadow: '#b35900' },
  ];

  const hasCurrentCalledToMark = currentCalledNumber && !card.find((c) => c.number === currentCalledNumber)?.marked;

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* 5x5 Drawing Canvas Card */}
      <div className="relative w-full bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_8px_0_#08233d] p-3 sm:p-4">
        {/* Animated Hand-drawn Marker Strike-through for Completed Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 p-3 sm:p-4">
          {completedLines.map((lineId) => {
            if (lineId.startsWith('row-')) {
              const r = parseInt(lineId.split('-')[1], 10);
              const y = `${10 + r * 20}%`;
              return (
                <line
                  key={lineId}
                  x1="4%"
                  y1={y}
                  x2="96%"
                  y2={y}
                  stroke="#e74c3c"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="opacity-80 drop-shadow-sm"
                />
              );
            }
            if (lineId.startsWith('col-')) {
              const c = parseInt(lineId.split('-')[1], 10);
              const x = `${10 + c * 20}%`;
              return (
                <line
                  key={lineId}
                  x1={x}
                  y1="4%"
                  x2={x}
                  y2="96%"
                  stroke="#e74c3c"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="opacity-80 drop-shadow-sm"
                />
              );
            }
            if (lineId === 'diag-main') {
              return (
                <line
                  key={lineId}
                  x1="6%"
                  y1="6%"
                  x2="94%"
                  y2="94%"
                  stroke="#e74c3c"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="opacity-80 drop-shadow-sm"
                />
              );
            }
            if (lineId === 'diag-anti') {
              return (
                <line
                  key={lineId}
                  x1="94%"
                  y1="6%"
                  x2="6%"
                  y2="94%"
                  stroke="#e74c3c"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="opacity-80 drop-shadow-sm"
                />
              );
            }
            return null;
          })}
        </svg>

        <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
          {card.map((cell) => {
            const isMarked = cell.marked;
            const isWinningCell = winningSet.has(cell.index);
            // In 1..25 mode, EVERY player has every called number!
            const isCalledToMark = !isMarked && calledSet.has(cell.number);
            const canCallThis = isMyTurn && !isMarked && !calledSet.has(cell.number);
            const isClickable = !isMarked && (isCalledToMark || canCallThis);

            let cellClass = 'bg-white text-[#0b2c4d] border-3 border-[#0b2c4d] shadow-[0_3px_0_#08233d]';

            if (isWinningCell) {
              // Glowing golden completed line cell
              cellClass = 'bg-yellow-300 text-yellow-950 font-black border-3 border-yellow-600 shadow-[0_3px_0_#b38000] ring-2 ring-yellow-400';
            } else if (isMarked) {
              // Marked with skribbl crayon stamp
              cellClass = 'bg-slate-100 text-slate-300 border-2 border-slate-300 shadow-[0_2px_0_#cbd5e1]';
            } else if (isCalledToMark) {
              // Number was called! Vibrant alert to click and mark
              cellClass = 'bg-amber-100 hover:bg-amber-200 text-[#0b2c4d] font-black border-4 border-rose-500 shadow-[0_4px_0_#be123c] ring-4 ring-rose-400/60 animate-pulse cursor-pointer';
            } else if (canCallThis) {
              // It's your turn to call
              cellClass = 'bg-white hover:bg-emerald-50 text-[#0b2c4d] font-black border-3 border-[#0b2c4d] hover:border-emerald-600 shadow-[0_4px_0_#08233d] hover:shadow-[0_4px_0_#1b4d1b] cursor-pointer hover:-translate-y-0.5';
            }

            return (
              <button
                key={cell.index}
                type="button"
                onClick={() => handleCellClick(cell)}
                disabled={!isClickable}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center select-none transition-all duration-150 active:translate-y-0.5 ${cellClass}`}
              >
                {/* Number (Big, bold, playful!) */}
                <span className={`text-2xl sm:text-3xl md:text-4xl font-black ${isMarked ? 'opacity-30' : ''}`}>
                  {cell.number}
                </span>

                {/* Hand-drawn Red Crayon Cross ✕ when marked */}
                {isMarked && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-4xl sm:text-5xl font-black text-[#e74c3c] drop-shadow-sm select-none transform -rotate-6">
                      ✕
                    </span>
                  </div>
                )}

                {/* Pulsing "TAP!" badge when called */}
                {isCalledToMark && (
                  <span className="absolute -top-2 -right-1 bg-rose-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tight shadow-md animate-bounce">
                    Tap!
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opponent Calling Helper Alert Banner */}
      {!isMyTurn && currentCalledNumber && hasCurrentCalledToMark && (
        <button
          type="button"
          onClick={() => {
            sounds.playMark();
            markNumber(currentCalledNumber);
          }}
          className="mt-2.5 inline-flex items-center space-x-1.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-[0_4px_0_#9f1239] active:translate-y-0.5 transition-all cursor-pointer"
        >
          <span>👉</span>
          <span>Tap to Mark <span className="underline font-black text-yellow-200">[{currentCalledNumber}]</span> on your card!</span>
        </button>
      )}

      {/* B-I-N-G-O 3D Toy Blocks (Bright, Playful, Cheerful!) */}
      <div className="flex items-center justify-center space-x-2.5 sm:space-x-3.5 mt-3.5">
        {bingoLetters.map((item, idx) => {
          const isComplete = completedCount > idx;
          return (
            <div
              key={item.letter}
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-3 border-[#0b2c4d] flex items-center justify-center text-2xl sm:text-3xl font-black transition-all transform ${
                isComplete
                  ? 'text-white shadow-[0_5px_0_#08233d] scale-110 -translate-y-1 animate-pop'
                  : 'bg-white shadow-[0_3px_0_#08233d]'
              }`}
              style={{
                backgroundColor: isComplete ? item.color : '#ffffff',
                color: isComplete ? '#ffffff' : item.color,
              }}
            >
              <span className="drop-shadow-sm">{item.letter}</span>
              {isComplete && (
                <span className="absolute -top-2 -right-1.5 text-xs select-none animate-bounce">
                  ⭐
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-xs font-black text-white/90 mt-2 tracking-wide uppercase flex items-center justify-center space-x-1.5 bg-black/20 px-3.5 py-1 rounded-full border border-white/10">
        <span>🏆</span>
        <span>{completedCount} of 5 Lines Completed</span>
        <span>🎉</span>
      </div>
    </div>
  );
}
