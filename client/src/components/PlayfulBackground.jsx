import React from 'react';

const DOODLES = [
  { emoji: '🎲', top: '8%', left: '4%', size: 'text-3xl', delay: '0s', dur: '5s' },
  { emoji: '⭐', top: '18%', right: '6%', size: 'text-2xl', delay: '1s', dur: '6s' },
  { emoji: '✏️', top: '38%', left: '5%', size: 'text-3xl', delay: '2s', dur: '5.5s' },
  { emoji: '🎱', top: '55%', right: '4%', size: 'text-2xl', delay: '1.5s', dur: '6.5s' },
  { emoji: '🎨', top: '72%', left: '6%', size: 'text-3xl', delay: '0.5s', dur: '5.2s' },
  { emoji: '🎯', top: '85%', right: '7%', size: 'text-3xl', delay: '2.5s', dur: '5.8s' },
  { emoji: '🖍️', top: '25%', left: '12%', size: 'text-xl', delay: '3s', dur: '4.8s' },
  { emoji: '🌟', top: '65%', right: '12%', size: 'text-2xl', delay: '1.2s', dur: '6.2s' },
];

export function PlayfulBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-40">
      {DOODLES.map((d, idx) => (
        <span
          key={idx}
          className={`absolute ${d.size} animate-gentle-float filter drop-shadow-sm`}
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
