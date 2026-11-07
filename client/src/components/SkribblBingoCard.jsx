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
}) {
  const { callNumber, markNumber } = useGame();
  const calledSet = new Set(calledNumbers);
  const winningSet = new Set(winningCells);

  const handleCellClick = (cell) => {
    if (cell.marked) return;

    if (isMyTurn) {
      // It's MY turn: clicking any unmarked cell calls this number!
      sounds.playPop();
      callNumber(cell.number);
    } else if (calledSet.has(cell.number)) {
      // Opponent called this number: clicking it marks it!
      sounds.playMark();
      markNumber(cell.number);
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
      <div className="w-full bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_8px_0_#08233d] p-3 sm:p-4">
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
          {card.map((cell) => {
            const isMarked = cell.marked;
            const isWinningCell = winningSet.has(cell.index);
            // In 1..25 mode, EVERY player has every called number!
            const isCalledToMark = !isMarked && calledSet.has(cell.number);
            const canCallThis = isMyTurn && !isMarked && !calledSet.has(cell.number);

            let cellClass = 'bg-[#f4f7fa] text-[#0b2c4d] border-3 border-[#0b2c4d] shadow-[0_3px_0_#0b2c4d]';

            if (isWinningCell) {
              // Glowing golden completed line cell
              cellClass = 'bg-yellow-300 text-yellow-950 font-black border-3 border-yellow-600 shadow-[0_3px_0_#b38000] ring-2 ring-yellow-400';
            } else if (isMarked) {
              // Marked with skribbl crayon stamp
              cellClass = 'bg-slate-100 text-slate-400 border-2 border-slate-300 shadow-[0_2px_0_#cbd5e1]';
            } else if (isCalledToMark) {
              // Opponent called this! Vibrant yellow bounce prompt to click!
              cellClass = 'bg-yellow-300 hover:bg-yellow-400 text-yellow-950 font-black border-4 border-pink-500 shadow-[0_4px_0_#b38000] animate-bounce-subtle cursor-pointer ring-4 ring-pink-400 scale-102';
            } else if (canCallThis) {
              // It's your turn to call
              cellClass = 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-black border-3 border-[#387c23] shadow-[0_3px_0_#285a19] cursor-pointer hover:scale-105';
            }

            return (
              <button
                key={cell.index}
                type="button"
                onClick={() => handleCellClick(cell)}
                disabled={isMarked || (!isMyTurn && !isCalledToMark)}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center select-none transition-all duration-150 active:translate-y-0.5 ${cellClass}`}
              >
                {/* Number (Big & bold!) */}
                <span className={`text-2xl sm:text-3xl md:text-4xl font-black ${isMarked ? 'opacity-25 line-through' : ''}`}>
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

                {/* Flashing "CLICK!" badge when opponent calls this number */}
                {isCalledToMark && (
                  <span className="absolute -top-2.5 -right-1 bg-pink-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-md animate-pulse">
                    Click!
                  </span>
                )}

                {/* Subtle "Call" text on your turn */}
                {canCallThis && (
                  <span className="hidden sm:inline-block absolute bottom-1 text-[9px] font-black text-emerald-700 uppercase tracking-tighter">
                    Call
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opponent Calling Helper Alert Banner */}
      {!isMyTurn && currentCalledNumber && hasCurrentCalledToMark && (
        <div className="mt-2.5 inline-block bg-pink-500 text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded-2xl shadow-[0_3px_0_#9f1239] animate-bounce-subtle">
          👉 Click <span className="underline font-extrabold text-yellow-200">[{currentCalledNumber}]</span> on your card to cross it out!
        </div>
      )}

      {/* B-I-N-G-O 3D Toy Blocks (Large, Vibrant, Playful!) */}
      <div className="flex items-center justify-center space-x-2.5 sm:space-x-3.5 mt-3.5">
        {bingoLetters.map((item, idx) => {
          const isComplete = completedCount > idx;
          return (
            <div
              key={item.letter}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-4 border-[#0b2c4d] flex items-center justify-center text-2xl sm:text-3xl font-black transition-all transform ${
                isComplete
                  ? 'text-white shadow-[0_5px_0_#08233d] scale-110 -translate-y-1 animate-pop'
                  : 'bg-white/20 text-white/40 shadow-[0_2px_0_#08233d]'
              }`}
              style={{
                backgroundColor: isComplete ? item.color : undefined,
              }}
            >
              <span className="drop-shadow-sm">{item.letter}</span>
            </div>
          );
        })}
      </div>

      <div className="text-xs font-black text-white/90 mt-2 tracking-wide uppercase">
        {completedCount} of 5 Lines Completed (First to B-I-N-G-O wins!)
      </div>
    </div>
  );
}
