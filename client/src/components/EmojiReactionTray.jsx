import React from 'react';
import { useGame } from '../context/GameContext.jsx';
import { sounds } from '../services/soundEffects.js';

const REACTION_LIST = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '🎯', label: 'Bullseye' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '😱', label: 'Shocked' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '⭐', label: 'Star' },
  { emoji: '💥', label: 'Boom' },
  { emoji: '🥳', label: 'Celebrate' },
];

export function EmojiReactionTray() {
  const { sendReaction } = useGame();

  const handleReact = (emoji) => {
    sounds.playReaction();
    sendReaction(emoji);
  };

  return (
    <div className="flex items-center justify-center py-1">
      <div className="bg-white/90 backdrop-blur-sm border-3 border-[#0b2c4d] rounded-2xl p-1.5 shadow-[0_4px_0_#08233d] flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto max-w-full">
        <span className="text-[10px] font-black uppercase text-slate-400 pl-1 pr-0.5 select-none hidden sm:inline-block">
          React:
        </span>
        {REACTION_LIST.map(({ emoji, label }) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleReact(emoji)}
            title={label}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-yellow-200 active:bg-yellow-300 border-2 border-slate-300 hover:border-[#0b2c4d] flex items-center justify-center text-lg sm:text-xl transition-all transform hover:scale-120 active:scale-95 active:translate-y-0.5 cursor-pointer shadow-sm select-none"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

