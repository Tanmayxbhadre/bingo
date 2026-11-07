import React from 'react';
import { Crown } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';

export function SkribblPlayerList() {
  const { roomState, sessionToken } = useGame();
  const players = roomState?.players || [];

  return (
    <div className="w-full lg:w-64 bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_8px_0_#08233d] p-3.5 flex flex-col h-auto lg:min-h-[480px]">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2.5 border-b-3 border-slate-200 mb-3 px-1">
        <span className="font-black text-sm text-[#0b2c4d] uppercase tracking-wide">
          Players ({players.length})
        </span>
        <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
          5 Lines = Win
        </span>
      </div>

      {/* Players List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
        {players.map((p, index) => {
          const isMe = p.sessionToken === sessionToken;
          const isTurn = p.sessionToken === roomState?.turnPlayerSessionToken;

          return (
            <div
              key={p.sessionToken}
              className={`flex items-center justify-between p-2.5 rounded-2xl border-3 transition-all ${
                isTurn
                  ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-300'
                  : isMe
                  ? 'bg-blue-50 border-blue-400'
                  : 'bg-[#f8fafc] border-slate-300'
              } ${!p.isOnline ? 'opacity-40' : ''}`}
            >
              {/* Rank & Avatar & Name */}
              <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                <span className="text-xs font-black text-slate-400 w-4 text-center">
                  #{index + 1}
                </span>

                <div
                  className="w-10 h-10 rounded-2xl border-2 border-[#0b2c4d] flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: p.color || '#55b338' }}
                >
                  {p.avatar}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <span className="font-black text-xs sm:text-sm text-[#0b2c4d] truncate max-w-[100px]">
                      {p.name}
                    </span>
                    {isMe && (
                      <span className="text-[8px] bg-blue-500 text-white font-black px-1.5 py-0.2 rounded-md">
                        YOU
                      </span>
                    )}
                    {p.isHost && (
                      <Crown className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0" title="Host" />
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 font-extrabold flex items-center space-x-1 mt-0.5">
                    <span>⭐</span>
                    <span>{p.completedCount || 0} / 5 Lines</span>
                  </div>
                </div>
              </div>

              {/* Turn Indicator Badge */}
              {isTurn && (
                <div className="flex items-center space-x-1 bg-emerald-500 text-white px-2 py-1 rounded-xl text-[10px] font-black animate-pulse flex-shrink-0 shadow-sm">
                  <span>✏️</span>
                  <span>TURN</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Playful Game Tips Card at bottom */}
      <div className="mt-3 bg-[#f0f4f8] rounded-2xl p-2.5 border-2 border-slate-300 text-center text-xs text-[#0b2c4d] font-bold">
        <div className="flex items-center justify-center space-x-1 text-yellow-600 font-black text-[11px] uppercase mb-0.5">
          <span>💡 Quick Rule</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          When opponent calls a number, tap it to stamp <span className="text-rose-500 font-black">✕</span>!
        </p>
      </div>
    </div>
  );
}
