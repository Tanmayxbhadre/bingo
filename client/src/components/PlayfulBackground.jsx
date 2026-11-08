import React from 'react';

// Illustrated 3D Bingo Ball component
function BingoBall({ number, color, top, left, right, bottom, size = 56, animClass = 'animate-ball-1', delay = '0s', opacity = 0.9 }) {
  const style = {
    top,
    left,
    right,
    bottom,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: delay,
    opacity,
  };

  return (
    <div
      className={`absolute select-none pointer-events-none ${animClass} filter drop-shadow-[0_10px_16px_rgba(7,43,77,0.4)]`}
      style={style}
    >
      {/* 3D Sphere Body */}
      <div
        className="relative w-full h-full rounded-full border-2 border-white/70 flex items-center justify-center overflow-hidden shadow-md"
        style={{
          background: `radial-gradient(circle at 35% 28%, ${color} 0%, rgba(0,0,0,0.5) 125%)`,
        }}
      >
        {/* Gloss highlight */}
        <div className="absolute top-1 left-2 w-1/3 h-1/4 bg-white/75 rounded-full blur-[0.5px] transform -rotate-25" />

        {/* White Center Badge with Number */}
        <div className="w-[52%] h-[52%] bg-white rounded-full border-2 border-slate-200 shadow-md flex items-center justify-center font-black text-slate-900 text-xs sm:text-sm">
          {number}
        </div>
      </div>
    </div>
  );
}

const DOODLES = [
  { emoji: '🎲', top: '10%', left: '4%', size: 'text-3xl sm:text-4xl', delay: '0s', dur: '5s' },
  { emoji: '⭐', top: '18%', right: '5%', size: 'text-2xl sm:text-3xl', delay: '1s', dur: '6s' },
  { emoji: '✏️', top: '48%', left: '3%', size: 'text-2xl sm:text-3xl', delay: '2s', dur: '5.5s' },
  { emoji: '🎯', top: '75%', right: '5%', size: 'text-3xl sm:text-4xl', delay: '2.5s', dur: '5.8s' },
  { emoji: '🎨', top: '32%', left: '8%', size: 'text-2xl sm:text-3xl', delay: '3s', dur: '4.8s' },
  { emoji: '✨', top: '65%', right: '8%', size: 'text-2xl sm:text-3xl', delay: '1.2s', dur: '6.2s' },
  { emoji: '🌟', top: '86%', left: '6%', size: 'text-2xl sm:text-3xl', delay: '1.8s', dur: '5.2s' },
  { emoji: '🎱', top: '6%', right: '10%', size: 'text-2xl sm:text-3xl', delay: '0.8s', dur: '6.5s' },
  { emoji: '🏆', top: '88%', right: '14%', size: 'text-2xl sm:text-3xl', delay: '2.2s', dur: '5s' },
  { emoji: '🔥', top: '42%', right: '4%', size: 'text-2xl sm:text-3xl', delay: '1.5s', dur: '5.7s' },
];

export function PlayfulBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Animated Diagonal Moving Comic Dot Pattern */}
      <div className="game-bg-pattern opacity-85" />

      {/* 2. Soft Colorful Radiant Light Glow Orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[550px] h-[550px] bg-yellow-300/25 rounded-full blur-[100px] animate-orb-1" />
      <div className="absolute top-[28%] right-[-5%] w-[580px] h-[580px] bg-pink-400/20 rounded-full blur-[110px] animate-orb-2" />
      <div className="absolute bottom-[-10%] left-[25%] w-[550px] h-[550px] bg-cyan-300/30 rounded-full blur-[100px] animate-orb-3" />
      <div className="absolute top-[45%] left-[-8%] w-[450px] h-[450px] bg-amber-400/20 rounded-full blur-[90px] animate-orb-1" />

      {/* 3. Floating 3D Bingo Balls drifting at edges */}
      <BingoBall number={7} color="#fbbf24" top="9%" left="6%" size={62} animClass="animate-ball-1" delay="0s" opacity={0.9} />
      <BingoBall number={21} color="#f97316" top="35%" right="6%" size={54} animClass="animate-ball-2" delay="1.5s" opacity={0.85} />
      <BingoBall number={3} color="#38bdf8" top="65%" left="5%" size={58} animClass="animate-ball-3" delay="2.2s" opacity={0.85} />
      <BingoBall number={15} color="#22c55e" top="82%" right="7%" size={52} animClass="animate-ball-1" delay="3s" opacity={0.9} />
      <BingoBall number={9} color="#f59e0b" top="16%" right="18%" size={46} animClass="animate-ball-2" delay="0.5s" opacity={0.8} />
      <BingoBall number={18} color="#a855f7" bottom="12%" left="18%" size={50} animClass="animate-ball-3" delay="2s" opacity={0.8} />

      {/* 4. Playful Cartoon Doodles */}
      {DOODLES.map((d, idx) => (
        <span
          key={idx}
          className={`absolute ${d.size} animate-gentle-float filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] opacity-85`}
          style={{
            top: d.top,
            left: d.left,
            right: d.right,
            animationDelay: d.delay,
            animationDuration: d.dur,
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}
