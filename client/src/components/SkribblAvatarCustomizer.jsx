import React from 'react';
import { ChevronLeft, ChevronRight, Dices } from 'lucide-react';
import { AVATARS, SKRIBBL_COLORS } from '@shared/constants/gameConstants.js';
import { sounds } from '../services/soundEffects.js';

export function SkribblAvatarCustomizer({
  avatarIndex,
  avatarColor,
  onChangeAvatar,
  onChangeColor,
  onRandomize,
}) {
  const currentAvatar = AVATARS[avatarIndex] || AVATARS[0];

  const handlePrev = () => {
    sounds.playPop();
    const newIdx = (avatarIndex - 1 + AVATARS.length) % AVATARS.length;
    onChangeAvatar(newIdx);
  };

  const handleNext = () => {
    sounds.playPop();
    const newIdx = (avatarIndex + 1) % AVATARS.length;
    onChangeAvatar(newIdx);
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xs mx-auto">
      {/* Avatar Face with Left/Right Arrows */}
      <div className="flex items-center justify-center space-x-3 w-full">
        <button
          type="button"
          onClick={handlePrev}
          className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 border-2 border-[#0b2c4d] text-white flex items-center justify-center font-black transition-transform active:scale-95"
          title="Previous Face"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Character Box */}
        <div
          className="relative w-28 h-28 rounded-3xl border-4 border-[#0b2c4d] shadow-[0_5px_0_#08233d] flex items-center justify-center transition-all duration-200"
          style={{ backgroundColor: avatarColor }}
        >
          <span className="text-6xl drop-shadow-md transform hover:scale-110 transition-transform">
            {currentAvatar.emoji}
          </span>
          <button
            type="button"
            onClick={onRandomize}
            className="absolute -top-2 -right-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 p-1.5 rounded-xl border-2 border-[#0b2c4d] shadow-sm transition-transform active:scale-90"
            title="Randomize Avatar"
          >
            <Dices className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 border-2 border-[#0b2c4d] text-white flex items-center justify-center font-black transition-transform active:scale-95"
          title="Next Face"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Color Swatch Dots */}
      <div className="flex items-center justify-center space-x-2 mt-3">
        {SKRIBBL_COLORS.map((col) => {
          const isSelected = avatarColor === col;
          return (
            <button
              key={col}
              type="button"
              onClick={() => {
                sounds.playPop();
                onChangeColor(col);
              }}
              className={`w-6 h-6 rounded-full border-2 border-[#0b2c4d] transition-all transform ${
                isSelected ? 'scale-125 ring-2 ring-white shadow-md -translate-y-0.5' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: col }}
            />
          );
        })}
      </div>
    </div>
  );
}
