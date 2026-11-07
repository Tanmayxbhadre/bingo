import React from 'react';
import { AVATARS } from '@shared/constants/gameConstants.js';
import { sounds } from '../services/soundEffects.js';

export function AvatarPicker({ selectedAvatar, onSelect }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-slate-200 mb-2">
        Choose Your Avatar
      </label>
      <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
        {AVATARS.map((av) => {
          const isSelected = selectedAvatar === av.emoji;
          return (
            <button
              key={av.id}
              type="button"
              onClick={() => {
                sounds.playPop();
                onSelect(av.emoji);
              }}
              title={av.label}
              className={`flex items-center justify-center text-2xl sm:text-3xl h-11 sm:h-12 rounded-2xl transition-all duration-150 transform ${
                isSelected
                  ? 'bg-yellow-400 border-3 border-white scale-110 shadow-bouncy -translate-y-1'
                  : 'bg-white/10 hover:bg-white/20 hover:scale-105 border border-white/10'
              }`}
            >
              <span className="drop-shadow-sm select-none">{av.emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
