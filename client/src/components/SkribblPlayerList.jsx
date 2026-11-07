import React from 'react';
import { Crown, Pencil } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';

export function SkribblPlayerList() {
  const { roomState, sessionToken } = useGame();
  const players = roomState?.players || [];

  return (
    <div className="w-full lg:w-64 bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_6px_0_#08233d] p-3 flex flex-col">
      <div className="flex items-center justify-between pb-2 border-b-2 border-slate-200 mb-2 px-1">
        <span className="font-black text-sm text-[#0b2c4d] uppercase tracking-wider">
          Players ({players.length})
        </span>
        <span className="text-xs font-bold text-slate-500">
          5 Lines = Win
        </span>
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-56 lg:max-h-[460px] pr-1">
        {players.map((p, index) => {
          const isMe = p.sessionToken === sessionToken;
          const isTurn = p.sessionToken === roomState?.turnPlayerSessionToken;

          return (
            <div
              key={p.sessionToken}
              className={`flex items-center justify-between p-2 rounded-2xl border-2 transition-all ${
                isTurn
                  ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                  : isMe
                  ? 'bg-blue-50 border-blue-400'
                  : 'bg-[#f8fafc] border-slate-200'
              } ${!p.isOnline ? 'opacity-50' : ''}`}
            >
              {/* Rank & Avatar */}
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-xs font-black text-slate-500 w-4">
                  #{index + 1}
                </span>

                <div
                  className="w-8 h-8 rounded-xl border-2 border-[#0b2c4d] flex items-center justify-center text-lg flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: p.color || '#55b338' }}
                >
                  {p.avatar}
                </div>

                <div className="min-w-0 truncate">
                  <div className="flex items-center space-x-1">
                    <span className="font-extrabold text-xs sm:text-sm text-[#0b2c4d] truncate">
                      {p.name}
                    </span>
                    {isMe && (
                      <span className="text-[9px] bg-blue-500 text-white font-black px-1 rounded">
                        YOU
                      </span>
                    )}
                    {p.isHost && (
                      <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" title="Host" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">
                    {p.completedCount || 0} / 5 Lines
                  </div>
                </div>
              </div>

              {/* Turn Indicator: Pencil icon! */}
              {isTurn && (
                <div className="flex items-center space-x-1 bg-emerald-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-black animate-pulse flex-shrink-0 shadow-sm">
                  <span>✏️</span>
                  <span className="hidden sm:inline">CALLING</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
