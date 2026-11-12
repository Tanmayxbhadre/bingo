import React from 'react';
import { Crown, Sparkles, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { CharacterAvatar } from './CharacterAvatar.jsx';

export function SkribblPlayerList() {
  const { roomState, sessionToken, stats } = useGame();
  const players = roomState?.players || [];

  return (
    <div className="w-full lg:w-72 bg-gradient-to-b from-white via-white to-sky-50/50 rounded-[32px] border-4 border-[#0b2c4d] shadow-[0_10px_0_#072847] p-4 flex flex-col min-h-[460px]">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200 mb-3 px-1">
        <span className="font-black text-sm text-[#072847] uppercase tracking-wide flex items-center space-x-1.5">
          <span>👥 Players</span>
          <span className="bg-sky-100 text-[#0284c7] text-xs px-2 py-0.2 rounded-full border border-sky-300">
            {players.length}
          </span>
        </span>
        <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
          5 Lines = Win 🏆
        </span>
      </div>

      {/* Players List */}
      <div className="space-y-2.5 overflow-y-auto pr-0.5 flex-1">
        {players.map((p, index) => {
          const isMe = p.sessionToken === sessionToken;
          const isGameOver = roomState?.status === 'game_over' || Boolean(roomState?.winner);
          const isWinner = roomState?.winner?.sessionToken === p.sessionToken;
          const isTurn = !isGameOver && p.sessionToken === roomState?.turnPlayerSessionToken;
          const count = p.completedCount || 0;

          return (
            <div
              key={p.sessionToken}
              className={`p-3 rounded-2xl border-3 transition-all ${
                isWinner
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-500 shadow-md ring-3 ring-yellow-400 -translate-y-0.5'
                  : isTurn
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500 shadow-md ring-3 ring-emerald-300 -translate-y-0.5'
                  : isMe
                  ? 'bg-gradient-to-r from-blue-50 to-sky-50 border-blue-400 shadow-sm'
                  : 'bg-white border-slate-300 hover:border-slate-400'
              } ${!p.isOnline ? 'opacity-40' : ''}`}
            >
              {/* Top row: Avatar, Name, Rank, Turn */}
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-black text-slate-400 w-4 text-center">
                  #{index + 1}
                </span>

                <div className="flex-shrink-0">
                  <CharacterAvatar id={p.avatar} color={p.color || '#55b338'} size={42} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="font-black text-sm text-[#072847] truncate block" title={p.name}>
                      {p.name}
                    </span>
                    {isMe && (
                      <span className="text-[9px] bg-[#0284c7] text-white font-black px-1.5 py-0.2 rounded-md flex-shrink-0">
                        YOU
                      </span>
                    )}
                    {isMe && stats?.winStreak > 0 && (
                      <span className="text-[9px] bg-gradient-to-r from-orange-400 to-amber-500 text-yellow-950 font-black px-1.5 py-0.2 rounded-md flex-shrink-0 animate-pulse border border-orange-500" title={`Current Win Streak: ${stats.winStreak}`}>
                        🔥 {stats.winStreak}
                      </span>
                    )}
                    {p.isHost && (
                      <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" title="Host" />
                    )}
                  </div>

                  {/* Active turn, winner or online status */}
                  <div className="flex items-center space-x-1 mt-0.5">
                    {isWinner ? (
                      <span className="bg-yellow-400 text-yellow-950 font-black text-[10px] px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-sm border border-yellow-600">
                        <span>🏆</span>
                        <span>WINNER</span>
                      </span>
                    ) : isTurn ? (
                      <span className="bg-emerald-500 text-white font-black text-[10px] px-2 py-0.5 rounded-md flex items-center space-x-1 animate-pulse shadow-sm">
                        <span>✏️</span>
                        <span>CALLING NOW</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">
                        {p.isOnline ? 'Waiting...' : 'Offline'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom row: Visual 5-segment Lines Meter */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {[0, 1, 2, 3, 4].map((starIdx) => (
                    <span
                      key={starIdx}
                      className={`text-sm select-none transition-transform ${
                        starIdx < count ? 'scale-110 drop-shadow-sm' : 'opacity-25 grayscale'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <span className={`text-xs font-black ${count >= 4 ? 'text-rose-600 animate-pulse' : 'text-[#072847]'}`}>
                  {count}/5 Lines
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Game Rules Infographic Box at bottom */}
      <div className="mt-3 bg-white/90 rounded-2xl p-3 border-2 border-slate-200 text-xs text-[#072847]">
        <div className="flex items-center justify-between text-[11px] font-black uppercase text-amber-700 mb-1.5 pb-1 border-b border-slate-100">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Winning Lines:</span>
          </span>
          <span className="text-slate-400">Total 12</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-black">
          <div className="bg-sky-50 rounded-lg p-1 border border-sky-200">
            <span className="block text-sky-700">Rows (5)</span>
            <span className="text-slate-400 font-semibold">━ ━ ━</span>
          </div>
          <div className="bg-sky-50 rounded-lg p-1 border border-sky-200">
            <span className="block text-sky-700">Cols (5)</span>
            <span className="text-slate-400 font-semibold">┃ ┃ ┃</span>
          </div>
          <div className="bg-sky-50 rounded-lg p-1 border border-sky-200">
            <span className="block text-sky-700">Diags (2)</span>
            <span className="text-slate-400 font-semibold">✕</span>
          </div>
        </div>
      </div>
    </div>
  );
}
