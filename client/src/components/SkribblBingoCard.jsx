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
    // If cell already marked, nothing to do
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
      <div className="flex items-center justify-center h-80 bg-white rounded-3xl border-4 border-[#0b2c4d] text-slate-500 font-bold">
        Drawing your Bingo card...
      </div>
    );
  }

  // Letters B-I-N-G-O for the 5 lines
  const bingoLetters = [
    { letter: 'B', color: '#0084ff' },
    { letter: 'I', color: '#ff4500' },
    { letter: 'N', color: '#ffb703' },
    { letter: 'G', color: '#55b338' },
    { letter: 'O', color: '#ff8c00' },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {/* 5x5 Drawing Canvas Card */}
      <div className="w-full bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_6px_0_#08233d] p-3 sm:p-5">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {card.map((cell) => {
            const isMarked = cell.marked;
            const isWinningCell = winningSet.has(cell.index);
            const isCalledByOpponent = !isMarked && calledSet.has(cell.number);
            const canCallThis = isMyTurn && !isMarked && !calledSet.has(cell.number);

            let cellClass = 'bg-[#f4f7fa] text-[#0b2c4d] border-2 sm:border-3 border-[#0b2c4d] shadow-[0_3px_0_#0b2c4d]';

            if (isWinningCell) {
              // Glowing golden completed line cell
              cellClass = 'bg-yellow-300 text-yellow-950 font-black border-3 border-yellow-600 shadow-[0_3px_0_#b38000] ring-2 ring-yellow-400';
            } else if (isMarked) {
              // Marked with skribbl crayon stamp
              cellClass = 'bg-slate-100 text-slate-400 border-2 border-slate-300 shadow-[0_2px_0_#cbd5e1]';
            } else if (isCalledByOpponent) {
              // Opponent called this! Prompt player to click to mark it!
              cellClass = 'bg-amber-300 hover:bg-amber-400 text-amber-950 font-black border-3 border-[#0b2c4d] shadow-[0_4px_0_#0b2c4d] animate-bounce-subtle cursor-pointer ring-4 ring-pink-500';
            } else if (canCallThis) {
              // It's your turn to call
              cellClass = 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-black border-3 border-[#387c23] shadow-[0_3px_0_#285a19] cursor-pointer hover:scale-105';
            }

            return (
              <button
                key={cell.index}
                type="button"
                onClick={() => handleCellClick(cell)}
                disabled={isMarked || (!isMyTurn && !isCalledByOpponent)}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center select-none transition-all duration-150 active:translate-y-0.5 ${cellClass}`}
              >
                {/* Number */}
                <span className={`text-xl sm:text-3xl font-black ${isMarked ? 'opacity-35 line-through' : ''}`}>
                  {cell.number}
                </span>

                {/* Crayon Drawn Cross / Stamp when marked */}
                {isMarked && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl sm:text-5xl font-black text-[#e74c3c] drop-shadow-sm select-none transform -rotate-12">
                      ✕
                    </span>
                  </div>
                )}

                {/* Badge when opponent called this number and you need to click it */}
                {isCalledByOpponent && (
                  <span className="absolute -top-2 -right-1 bg-pink-500 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-sm animate-pulse">
                    Click!
                  </span>
                )}

                {/* Badge when it's your turn to call */}
                {canCallThis && (
                  <span className="hidden sm:inline-block absolute bottom-1 text-[8px] font-black text-emerald-700 uppercase tracking-tighter">
                    Call
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* B-I-N-G-O Progress Blocks beneath card */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 mt-4">
        {bingoLetters.map((item, idx) => {
          const isComplete = completedCount > idx;
          return (
            <div
              key={item.letter}
              className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl border-3 border-[#0b2c4d] flex items-center justify-center text-xl sm:text-2xl font-black transition-all transform ${
                isComplete
                  ? 'text-white shadow-[0_4px_0_#08233d] scale-110 -translate-y-1'
                  : 'bg-white/20 text-white/30 shadow-[0_2px_0_#08233d]'
              }`}
              style={{
                backgroundColor: isComplete ? item.color : undefined,
              }}
            >
              <span>{item.letter}</span>
            </div>
          );
        })}
      </div>
      <div className="text-xs font-bold text-slate-300 mt-2">
        {completedCount} of 5 Lines Completed (First to B-I-N-G-O wins!)
      </div>
    </div>
  );
}
