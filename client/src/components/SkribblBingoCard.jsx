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
  const { roomState, callNumber, markNumber } = useGame();
  const calledSet = new Set(calledNumbers);
  const winningSet = new Set(winningCells);
  const isGameOver = roomState?.status === 'game_over' || Boolean(roomState?.winner);

  const handleCellClick = (cell) => {
    if (isGameOver || cell.marked) return;

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
      <div className="flex items-center justify-center h-96 bg-white rounded-[32px] border-4 border-[#0b2c4d] text-slate-500 font-bold shadow-[0_10px_0_#072847]">
        Drawing your Bingo card...
      </div>
    );
  }

  // Letters B-I-N-G-O for the 5 lines with candy skribbl colors
  const bingoLetters = [
    { letter: 'B', color: '#00a8ff', shadow: '#005b8a' },
    { letter: 'I', color: '#ff4757', shadow: '#b31b27' },
    { letter: 'N', color: '#ffa502', shadow: '#b37400' },
    { letter: 'G', color: '#2ed573', shadow: '#1b8a47' },
    { letter: 'O', color: '#ff7f50', shadow: '#b34720' },
  ];

  const hasCurrentCalledToMark = !isGameOver && currentCalledNumber && !card.find((c) => c.number === currentCalledNumber)?.marked;

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto select-none">
      {/* 5x5 Drawing Canvas Card */}
      <div className="relative w-full bg-gradient-to-b from-white via-white to-sky-50/50 rounded-3xl sm:rounded-[32px] border-4 border-[#0b2c4d] shadow-[0_8px_0_#072847,0_16px_30px_rgba(7,43,77,0.25)] p-2.5 sm:p-4">
        {/* Bold, Clean Red Strikethrough Guide Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 p-2.5 sm:p-4">
          {completedLines.map((lineId) => {
            if (lineId.startsWith('row-')) {
              const r = parseInt(lineId.split('-')[1], 10);
              const y = `${10 + r * 20}%`;
              return (
                <line
                  key={lineId}
                  x1="5%"
                  y1={y}
                  x2="95%"
                  y2={y}
                  stroke="#dc2626"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeOpacity="0.85"
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
                  y1="5%"
                  x2={x}
                  y2="95%"
                  stroke="#dc2626"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeOpacity="0.85"
                />
              );
            }
            if (lineId === 'diag-main') {
              return (
                <line
                  key={lineId}
                  x1="7%"
                  y1="7%"
                  x2="93%"
                  y2="93%"
                  stroke="#dc2626"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeOpacity="0.85"
                />
              );
            }
            if (lineId === 'diag-anti') {
              return (
                <line
                  key={lineId}
                  x1="93%"
                  y1="7%"
                  x2="7%"
                  y2="93%"
                  stroke="#dc2626"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeOpacity="0.85"
                />
              );
            }
            return null;
          })}
        </svg>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
          {card.map((cell) => {
            const isMarked = cell.marked;
            const isWinningCell = winningSet.has(cell.index);
            const isLatestCalled = !isGameOver && !isMarked && cell.number === currentCalledNumber;
            const isMissedCalled = !isGameOver && !isMarked && !isLatestCalled && calledSet.has(cell.number);
            const canCallThis = !isGameOver && isMyTurn && !isMarked && !calledSet.has(cell.number);
            const isClickable = !isGameOver && !isMarked && (isLatestCalled || isMissedCalled || canCallThis);

            let cellClass = 'bg-white text-[#072847] border-3 border-[#0b2c4d] shadow-[0_2.5px_0_#072847]';

            if (isWinningCell) {
              // Glowing celebratory golden winning cell (clean & distinct)
              cellClass = 'bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#eab308] text-amber-950 font-black border-3 sm:border-4 border-[#854d0e] shadow-[0_3px_0_#713f12] ring-2 ring-yellow-300 scale-[1.02] z-2';
            } else if (isMarked) {
              // Marked cell (clear readable number with stamp)
              cellClass = 'bg-slate-100 text-slate-700 border-2 border-slate-300 shadow-[0_2px_0_#cbd5e1]';
            } else if (isLatestCalled) {
              // Number was just called! Vibrant alert to click and mark
              cellClass = 'bg-gradient-to-b from-amber-100 to-rose-100 text-[#072847] font-black border-3 sm:border-4 border-rose-500 shadow-[0_4px_0_#9f1239] ring-3 ring-rose-400/70 animate-bounce cursor-pointer scale-105 z-10';
            } else if (isMissedCalled) {
              // Previously called number (quiet, clickable to mark)
              cellClass = 'bg-amber-50 text-amber-950 font-black border-2 border-amber-300 shadow-[0_2px_0_#d97706] hover:bg-amber-100 cursor-pointer';
            } else if (canCallThis) {
              // It's your turn to call
              cellClass = 'bg-white hover:bg-emerald-50 text-[#072847] font-black border-3 border-[#0b2c4d] hover:border-emerald-600 shadow-[0_3px_0_#072847] hover:shadow-[0_3px_0_#14532d] cursor-pointer hover:-translate-y-0.5 transition-all';
            }

            return (
              <button
                key={cell.index}
                type="button"
                onClick={() => handleCellClick(cell)}
                disabled={!isClickable}
                className={`relative aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center select-none transition-all duration-150 active:translate-y-0.5 ${cellClass}`}
              >
                {/* Number (clearly visible) */}
                <span className={`text-xl sm:text-3xl md:text-4xl font-black ${isMarked && !isWinningCell ? 'text-slate-600' : ''}`}>
                  {cell.number}
                </span>

                {/* Clean, Non-messy Stamp */}
                {isMarked && !isWinningCell && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#dc2626]/85 select-none transform -rotate-12">
                      ✕
                    </span>
                  </div>
                )}

                {/* Winning Cell Star Indicator */}
                {isWinningCell && (
                  <span className="absolute top-1 right-1 text-[10px] sm:text-xs select-none">
                    ⭐
                  </span>
                )}

                {/* Pulsing "TAP!" badge for latest called number */}
                {isLatestCalled && (
                  <span className="absolute -top-1.5 -right-1 bg-rose-500 text-white font-black text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full uppercase tracking-tight shadow-md animate-bounce">
                    Tap!
                  </span>
                )}

                {/* Quiet tag for missed earlier numbers */}
                {isMissedCalled && (
                  <span className="absolute -top-1 -right-0.5 bg-amber-400 text-amber-950 font-black text-[8px] sm:text-[9px] px-1 rounded uppercase tracking-tighter">
                    Mark
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opponent Calling Helper Alert Banner */}
      {!isGameOver && !isMyTurn && currentCalledNumber && hasCurrentCalledToMark && (
        <button
          type="button"
          onClick={() => {
            sounds.playMark();
            markNumber(currentCalledNumber);
          }}
          className="mt-2.5 inline-flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-[0_3px_0_#9f1239] active:translate-y-0.5 transition-all cursor-pointer animate-pulse"
        >
          <span>👉</span>
          <span>Tap to Stamp <span className="underline font-black text-yellow-200">[{currentCalledNumber}]</span> on your card!</span>
        </button>
      )}

      {/* B-I-N-G-O 3D Toy Blocks (Clean, Compact, Playful!) */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 mt-2.5 sm:mt-3">
        {bingoLetters.map((item, idx) => {
          const isComplete = completedCount > idx;
          return (
            <div
              key={item.letter}
              className={`relative w-10 h-10 sm:w-13 sm:h-13 rounded-2xl border-3 border-[#0b2c4d] flex items-center justify-center text-xl sm:text-2xl font-black transition-all transform ${
                isComplete
                  ? 'text-white shadow-[0_4px_0_#072847] scale-105 -translate-y-1 animate-pop'
                  : 'bg-white/90 shadow-[0_2px_0_#cbd5e1] opacity-75'
              }`}
              style={{
                backgroundColor: isComplete ? item.color : '#ffffff',
                color: isComplete ? '#ffffff' : item.color,
              }}
            >
              <span className="drop-shadow-sm">{item.letter}</span>
              {isComplete && (
                <span className="absolute -top-2 -right-1 text-xs select-none animate-bounce">
                  ⭐
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Lines Completed Tracker Banner */}
      <div className="text-[11px] sm:text-xs font-black text-[#072847] mt-2 tracking-wide uppercase flex items-center justify-center space-x-1.5 bg-white/95 px-4 py-1.5 rounded-full border-2 border-[#0b2c4d] shadow-[0_2px_0_#072847]">
        <span>🏆</span>
        <span>{completedCount} of 5 Lines Completed {completedCount >= 4 ? '🔥 MATCH POINT!' : ''}</span>
        <span>🎉</span>
      </div>
    </div>
  );
}
