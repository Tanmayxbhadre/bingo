import React, { useState } from 'react';
import { Trophy, Flame, Target, Award, Sparkles, BarChart2, X } from 'lucide-react';
import { useGame, getRankInfo } from '../context/GameContext.jsx';
import { sounds } from '../services/soundEffects.js';

export function PlayerStatsCard() {
  const { stats } = useGame();
  const [showModal, setShowModal] = useState(false);

  const rank = getRankInfo(stats.wins);
  const winRate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  const nextTarget = rank.nextAt ? rank.nextAt - stats.wins : 0;

  return (
    <>
      {/* Compact Interactive Pill in Lobby / Home */}
      <div
        onClick={() => {
          sounds.playPop();
          setShowModal(true);
        }}
        className="w-full max-w-sm mx-auto bg-white/95 backdrop-blur-md rounded-2xl border-3 border-[#0b2c4d] shadow-[0_4px_0_#072847] p-2.5 px-3.5 flex items-center justify-between cursor-pointer hover:bg-white hover:scale-[1.02] active:translate-y-0.5 transition-all select-none"
        title="Click to view full player stats & win streak!"
      >
        {/* Left: Rank Badge & Title */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-base shadow-sm">
            {rank.badge}
          </div>
          <div className="text-left">
            <div className="text-xs font-black text-[#072847] leading-tight flex items-center space-x-1">
              <span>{rank.title}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-bold">
              {stats.wins} Wins • {winRate}% Win Rate
            </div>
          </div>
        </div>

        {/* Right: Active Win Streak Flame */}
        <div className="flex items-center space-x-1.5">
          <div
            className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center space-x-1 border-2 transition-all ${
              stats.winStreak > 0
                ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-yellow-950 border-orange-600 shadow-sm animate-pulse'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${stats.winStreak > 0 ? 'fill-orange-600 text-orange-600' : 'text-slate-400'}`} />
            <span>{stats.winStreak} Streak</span>
          </div>
        </div>
      </div>

      {/* FULL STATS MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop select-none">
          <div className="bg-gradient-to-b from-white via-white to-sky-50/50 border-4 border-[#0b2c4d] rounded-[32px] p-6 max-w-sm w-full text-[#072847] shadow-[0_12px_0_#072847,0_25px_40px_rgba(0,0,0,0.35)] space-y-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-xl border-2 border-slate-300 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>

            {/* Header */}
            <div className="text-center pt-2">
              <div className="inline-block bg-sky-100 text-[#0284c7] font-black text-xs uppercase px-3 py-1 rounded-full border border-sky-300 mb-1.5">
                🏆 CAREER STATS
              </div>
              <h2 className="text-2xl font-black text-[#072847] flex items-center justify-center space-x-1.5">
                <span>{rank.badge}</span>
                <span>{rank.title}</span>
              </h2>
              {rank.nextAt && (
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                  ⭐ Win {nextTarget} more {nextTarget === 1 ? 'match' : 'matches'} to rank up!
                </p>
              )}
            </div>

            {/* Win Streak Showcase */}
            <div className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 rounded-2xl p-3 border-3 border-[#0b2c4d] shadow-[0_3px_0_#072847] text-yellow-950 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2.5">
                <div className="bg-white/80 p-2 rounded-xl border-2 border-yellow-700 shadow-sm">
                  <Flame className="w-6 h-6 fill-orange-600 text-orange-600 animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block text-amber-900/80">
                    Current Streak
                  </span>
                  <span className="text-xl font-black">{stats.winStreak} Matches 🔥</span>
                </div>
              </div>
              <div className="text-right border-l-2 border-yellow-600/40 pl-3">
                <span className="text-[9px] font-black uppercase text-amber-900/80 block">Best Streak</span>
                <span className="text-base font-black">{stats.bestStreak} 🏆</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-black">
              <div className="bg-white p-2.5 rounded-2xl border-2 border-slate-200 shadow-sm">
                <span className="text-[9px] uppercase text-slate-400 block mb-0.5">Matches Played</span>
                <span className="text-lg text-[#072847]">{stats.played}</span>
              </div>

              <div className="bg-emerald-50 p-2.5 rounded-2xl border-2 border-emerald-300 shadow-sm">
                <span className="text-[9px] uppercase text-emerald-700 block mb-0.5">Matches Won</span>
                <span className="text-lg text-emerald-800">{stats.wins} 🏆</span>
              </div>

              <div className="bg-sky-50 p-2.5 rounded-2xl border-2 border-sky-300 shadow-sm">
                <span className="text-[9px] uppercase text-sky-700 block mb-0.5">Win Rate</span>
                <span className="text-lg text-sky-800">{winRate}%</span>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-2xl border-2 border-amber-300 shadow-sm">
                <span className="text-[9px] uppercase text-amber-700 block mb-0.5">Lines Stamped</span>
                <span className="text-lg text-amber-900">{stats.totalLines} Lines</span>
              </div>
            </div>

            {/* Close action */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full skribbl-btn-blue py-2.5 rounded-2xl text-xs font-black cursor-pointer shadow-sm"
            >
              Back to Game
            </button>
          </div>
        </div>
      )}
    </>
  );
}
