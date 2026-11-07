import React from 'react';
import { useGame } from '../context/GameContext.jsx';

export function FloatingReactions() {
  const { floatingReactions } = useGame();

  if (!floatingReactions || floatingReactions.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {floatingReactions.map((item) => (
        <div
          key={item.id}
          className="absolute bottom-16 animate-float-up flex flex-col items-center"
          style={{
            left: `${item.xPos || 50}%`,
          }}
        >
          <span className="text-4xl sm:text-5xl filter drop-shadow-lg select-none transform hover:scale-125 transition-transform">
            {item.emoji}
          </span>
          <span
            className="mt-1 px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-md border border-white/40 tracking-wider whitespace-nowrap"
            style={{ backgroundColor: item.senderColor || '#0084ff' }}
          >
            {item.senderName}
          </span>
        </div>
      ))}
    </div>
  );
}
