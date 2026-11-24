import React, { useEffect } from 'react';
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

  // Keyboard shortcut: Space quickly stamps the active called number on your card
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (!isGameOver && currentCalledNumber) {
          const targetCell = card?.find((c) => c.number === currentCalledNumber && !c.marked);
          if (targetCell) {
            e.preventDefault();
            handleCellClick(targetCell);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, currentCalledNumber, isGameOver, isMyTurn]);

  if (!card || card.length !== 25) {
    return (
      <div className="flex items-center justify-center h-80 sm:h-96 bg-white rounded-[32px] border-4 border-[#0b2c4d] text-slate-500 font-black shadow-[0_10px_0_#072847] p-6 text-center animate-pulse">
        <div className="space-y-2">
          <div className="text-4xl animate-bounce">🎲</div>
          <div className="text-lg text-[#072847]">Generating your Bingo Card...</div>
        </div>
      </div>
    );
  }

  // Candy B-I-N-G-O colors
  const bingoLetters = [
    { letter: 'B', color: '#00a8ff', shadow: '#006699', bgActive: 'from-[#38bdf8] to-[#0284c7]' },
    { letter: 'I', color: '#ff4757', shadow: '#b31b27', bgActive: 'from-[#fb7185] to-[#e11d48]' },
    { letter: 'N', color: '#ffa502', shadow: '#b37400', bgActive: 'from-[#fbbf24] to-[#d97706]' },
    { letter: 'G', color: '#2ed573', shadow: '#1b8a47', bgActive: 'from-[#4ade80] to-[#16a34a]' },
    { letter: 'O', color: '#a855f7', shadow: '#7e22ce', bgActive: 'from-[#c084fc] to-[#9333ea]' },
  ];

  const hasCurrentCalledToMark = !isGameOver && currentCalledNumber && !card.find((c) => c.number === currentCalledNumber)?.marked;

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto select-none">
      {/* Screen-reader live announcement region for accessibility */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isGameOver
          ? 'Game over!'
          : isMyTurn
          ? "It's your turn to call a number from 1 to 25."
          : currentCalledNumber
          ? `Number ${currentCalledNumber} was called. Check your card to mark it.`
          : 'Waiting for round to begin.'}
      </div>

      {/* 5x5 Drawing Canvas Card */}
      <div className="relative w-full bg-gradient-to-b from-white via-white to-sky-50/70 rounded-3xl sm:rounded-[36px] border-3 sm:border-4 border-[#0b2c4d] shadow-[0_8px_0_#072847,0_16px_32px_rgba(7,43,77,0.25)] p-2 sm:p-4 touch-manipulation">
        {/* Bold, Clean Red Strikethrough Guide Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 p-2 sm:p-4">
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
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeOpacity="0.9"
                  className="filter drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)]"
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
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeOpacity="0.9"
                  className="filter drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)]"
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
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeOpacity="0.9"
                  className="filter drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)]"
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
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeOpacity="0.9"
                  className="filter drop-shadow-[0_2px_4px_rgba(239,68,68,0.5)]"
                />
              );
            }
            return null;
          })}
        </svg>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5" role="grid" aria-label="5 by 5 Bingo Board">
          {card.map((cell) => {
            const isMarked = cell.marked;
            const isWinningCell = winningSet.has(cell.index);
            const isLatestCalled = !isGameOver && !isMarked && cell.number === currentCalledNumber;
            const isMissedCalled = !isGameOver && !isMarked && !isLatestCalled && calledSet.has(cell.number);
            const canCallThis = !isGameOver && isMyTurn && !isMarked && !calledSet.has(cell.number);
            const isClickable = !isGameOver && !isMarked && (isLatestCalled || isMissedCalled || canCallThis);

            let cellClass = 'bg-gradient-to-b from-white to-slate-50 text-[#072847] border-2 sm:border-3 border-[#0b2c4d] shadow-[0_3px_0_#072847]';

            if (isWinningCell) {
              // Glowing celebratory golden winning cell
              cellClass = 'bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#eab308] text-amber-950 font-black border-3 sm:border-4 border-[#854d0e] shadow-[0_3.5px_0_#713f12] ring-2 ring-yellow-300 scale-[1.03] z-10 animate-pop';
            } else if (isMarked) {
              // Marked cell (stamped ink token effect)
              cellClass = 'bg-gradient-to-b from-slate-100 via-slate-150 to-slate-200 text-slate-400 border-2 border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.12),0_1px_0_#cbd5e1]';
            } else if (isLatestCalled) {
              // Number was just called! Vibrant alert to click and mark
              cellClass = 'bg-gradient-to-b from-rose-100 via-amber-100 to-rose-200 text-[#072847] font-black border-3 sm:border-4 border-rose-500 shadow-[0_4px_0_#9f1239] ring-4 ring-rose-400/90 cursor-pointer scale-[1.04] z-20 animate-pulse';
            } else if (isMissedCalled) {
              // Previously called number (quiet, clickable to mark)
              cellClass = 'bg-gradient-to-b from-amber-50 to-amber-100 text-amber-950 font-black border-2 sm:border-3 border-amber-400 shadow-[0_2.5px_0_#b45309] hover:bg-amber-100 cursor-pointer';
            } else if (canCallThis) {
              // It's your turn to call
              cellClass = 'bg-gradient-to-b from-white to-slate-50 hover:bg-emerald-50 text-[#072847] font-black border-2 sm:border-3 border-[#0b2c4d] hover:border-emerald-600 shadow-[0_3px_0_#072847] hover:shadow-[0_3px_0_#14532d] cursor-pointer hover:-translate-y-0.5 transition-all';
            }

            const ariaCellLabel = `Number ${cell.number}${isWinningCell ? ', winning line cell' : isMarked ? ', marked' : isLatestCalled ? ', called number, tap to mark' : canCallThis ? ', tap to call' : ''}`;

            return (
              <button
                key={cell.index}
                type="button"
                role="gridcell"
                aria-label={ariaCellLabel}
                aria-pressed={isMarked}
                aria-disabled={!isClickable}
                onClick={() => handleCellClick(cell)}
                disabled={!isClickable}
                className={`relative aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center select-none transition-all duration-150 active:translate-y-0.5 active:shadow-[0_1px_0_#072847] touch-manipulation ${cellClass}`}
              >
                {/* Number (clearly visible) */}
                <span className={`text-xl sm:text-3xl md:text-4xl font-black ${isMarked && !isWinningCell ? 'text-slate-400 line-through opacity-60' : ''}`}>
                  {cell.number}
                </span>

                {/* Stamped Ink Seal Dauber Stamp */}
                {isMarked && !isWinningCell && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border-2 border-red-500/80 bg-red-500/15 flex items-center justify-center transform -rotate-12 shadow-inner">
                      <span className="text-2xl sm:text-3xl font-black text-red-600 drop-shadow-sm select-none">
                        ✕
                      </span>
                    </div>
                  </div>
                )}

                {/* Winning Cell Star Indicator */}
                {isWinningCell && (
                  <span className="absolute top-1 right-1 text-xs sm:text-sm select-none filter drop-shadow animate-bounce">
                    ⭐
                  </span>
                )}

                {/* Pulsing "TAP!" badge for latest called number */}
                {isLatestCalled && (
                  <span className="absolute -top-2.5 -right-1 bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-tight shadow-md border border-white animate-bounce flex items-center space-x-0.5">
                    <span>👆</span>
                    <span>TAP!</span>
                  </span>
                )}

                {/* Quiet tag for missed earlier numbers */}
                {isMissedCalled && (
                  <span className="absolute -top-1.5 -right-1 bg-amber-400 text-amber-950 font-black text-[8px] sm:text-[9px] px-1 py-0.2 rounded uppercase border border-amber-600 shadow-sm">
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

      {/* B-I-N-G-O 3D Chunky Toy Blocks */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 mt-3">
        {bingoLetters.map((item, idx) => {
          const isComplete = completedCount > idx;
          return (
            <div
              key={item.letter}
              className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl border-3 border-[#0b2c4d] flex items-center justify-center text-xl sm:text-2xl font-black transition-all transform ${
                isComplete
                  ? `bg-gradient-to-b ${item.bgActive} text-white shadow-[0_4px_0_#072847] scale-105 -translate-y-1 animate-pop`
                  : 'bg-white/90 text-slate-300 shadow-[0_2px_0_#cbd5e1] opacity-75'
              }`}
              style={{
                color: isComplete ? '#ffffff' : item.color,
              }}
            >
              {/* Glossy top highlight */}
              <div className="absolute inset-x-1.5 top-1 h-2 rounded-t-xl bg-white/35 pointer-events-none" />
              
              <span className="drop-shadow-sm z-1">{item.letter}</span>
              
              {isComplete && (
                <span className="absolute -top-2.5 -right-1 text-xs select-none animate-bounce z-2">
                  ⭐
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Lines Completed Tracker Pill */}
      <div className="text-[11px] sm:text-xs font-black text-[#072847] mt-2 tracking-wide uppercase flex items-center justify-center space-x-1.5 bg-white/95 px-4 py-1.5 rounded-full border-2 border-[#0b2c4d] shadow-[0_2px_0_#072847]">
        <span>🏆</span>
        <span>
          {completedCount} of 5 Lines Completed
          {completedCount >= 4 ? ' 🔥 MATCH POINT!' : ''}
        </span>
        {completedCount === 5 ? <span>🎉 BINGO!</span> : <span>🎯</span>}
      </div>
    </div>
  );
}
