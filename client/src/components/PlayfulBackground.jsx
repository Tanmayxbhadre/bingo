import React from 'react';

// Illustrated 3D Bingo Ball component
function BingoBall({ number, color, top, left, right, bottom, size = 52, animClass = 'animate-ball-1', delay = '0s', opacity = 0.85 }) {
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
      className={`absolute select-none pointer-events-none ${animClass} filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.4)]`}
      style={style}
    >
      {/* 3D Sphere Body */}
      <div
        className="relative w-full h-full rounded-full border-2 border-white/30 flex items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${color} 0%, #0b1a2e 130%)`,
        }}
      >
        {/* Gloss highlight */}
        <div className="absolute top-1 left-2 w-1/3 h-1/4 bg-white/40 rounded-full blur-[1px] transform -rotate-25" />

        {/* White Center Badge with Number */}
        <div className="w-[52%] h-[52%] bg-white rounded-full border border-slate-300 shadow-inner flex items-center justify-center font-black text-slate-900 text-xs sm:text-sm">
          {number}
        </div>
      </div>
    </div>
  );
}

const DOODLES = [
  { emoji: '🎲', top: '12%', left: '3%', size: 'text-3xl', delay: '0s', dur: '5s' },
  { emoji: '⭐', top: '22%', right: '4%', size: 'text-2xl', delay: '1s', dur: '6s' },
  { emoji: '✏️', top: '48%', left: '4%', size: 'text-2xl', delay: '2s', dur: '5.5s' },
  { emoji: '🎯', top: '78%', right: '5%', size: 'text-3xl', delay: '2.5s', dur: '5.8s' },
  { emoji: '🖍️', top: '30%', left: '10%', size: 'text-xl', delay: '3s', dur: '4.8s' },
  { emoji: '✨', top: '68%', right: '11%', size: 'text-2xl', delay: '1.2s', dur: '6.2s' },
  { emoji: '🌟', top: '88%', left: '8%', size: 'text-2xl', delay: '1.8s', dur: '5.2s' },
  { emoji: '🎱', top: '6%', right: '12%', size: 'text-2xl', delay: '0.8s', dur: '6.5s' },
];

export function PlayfulBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Animated Diagonal Moving Comic Dot Pattern */}
      <div className="game-bg-pattern opacity-70" />

      {/* 2. Soft Colorful Radiant Light Glow Orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[450px] h-[450px] bg-yellow-400/10 rounded-full blur-[100px] animate-orb-1" />
      <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] bg-cyan-400/15 rounded-full blur-[120px] animate-orb-2" />
      <div className="absolute bottom-[-10%] left-[30%] w-[480px] h-[480px] bg-purple-500/12 rounded-full blur-[110px] animate-orb-3" />

      {/* 3. Floating 3D Bingo Balls drifting at edges */}
      <BingoBall number={7} color="#ffb703" top="10%" left="6%" size={58} animClass="animate-ball-1" delay="0s" opacity={0.8} />
      <BingoBall number={21} color="#ff4500" top="35%" right="6%" size={50} animClass="animate-ball-2" delay="1.5s" opacity={0.75} />
      <BingoBall number={3} color="#0084ff" top="65%" left="5%" size={54} animClass="animate-ball-3" delay="2.2s" opacity={0.75} />
      <BingoBall number={15} color="#55b338" top="82%" right="8%" size={48} animClass="animate-ball-1" delay="3s" opacity={0.8} />
      <BingoBall number={9} color="#ff8c00" top="18%" right="18%" size={42} animClass="animate-ball-2" delay="0.5s" opacity={0.65} />
      <BingoBall number={18} color="#9b5de5" bottom="12%" left="18%" size={46} animClass="animate-ball-3" delay="2s" opacity={0.65} />

      {/* 4. Playful Cartoon Doodles */}
      {DOODLES.map((d, idx) => (
        <span
          key={idx}
          className={`absolute ${d.size} animate-gentle-float filter drop-shadow-md opacity-60`}
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
