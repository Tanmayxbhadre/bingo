import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Dices, SmilePlus } from 'lucide-react';
import { AVATARS, SKRIBBL_COLORS } from '@shared/constants/gameConstants.js';
import { sounds } from '../services/soundEffects.js';

export function SkribblAvatarCustomizer({
  avatarIndex,
  avatarColor,
  onChangeAvatar,
  onChangeColor,
  onRandomize,
}) {
  const [showGrid, setShowGrid] = useState(false);
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
          className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 border-3 border-[#0b2c4d] shadow-[0_3px_0_#08233d] text-[#0b2c4d] flex items-center justify-center font-black transition-transform active:translate-y-0.5"
          title="Previous Face"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Character Box */}
        <div
          className="relative w-28 h-28 rounded-3xl border-4 border-[#0b2c4d] shadow-[0_6px_0_#08233d] flex flex-col items-center justify-center transition-all duration-200 cursor-pointer"
          style={{ backgroundColor: avatarColor }}
          onClick={() => setShowGrid(!showGrid)}
          title="Click to choose avatar!"
        >
          <span className="text-6xl drop-shadow-md transform hover:scale-110 transition-transform">
            {currentAvatar.emoji}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRandomize();
            }}
            className="absolute -top-2 -right-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 p-1.5 rounded-xl border-2 border-[#0b2c4d] shadow-sm transition-transform active:scale-90"
            title="Randomize Avatar"
          >
            <Dices className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 border-3 border-[#0b2c4d] shadow-[0_3px_0_#08233d] text-[#0b2c4d] flex items-center justify-center font-black transition-transform active:translate-y-0.5"
          title="Next Face"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Avatar Label & Quick Grid Toggle */}
      <div className="flex items-center space-x-2 mt-2">
        <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
          {currentAvatar.label} {currentAvatar.emoji}
        </span>
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setShowGrid(!showGrid);
          }}
          className="text-[11px] font-black text-[#0084ff] hover:underline flex items-center space-x-0.5"
        >
          <SmilePlus className="w-3.5 h-3.5" />
          <span>{showGrid ? 'Hide' : 'All'}</span>
        </button>
      </div>

      {/* All 16 Avatars Emoji Grid (Expandable) */}
      {showGrid && (
        <div className="mt-2.5 bg-[#f0f4f8] border-2 border-slate-300 rounded-2xl p-2 grid grid-cols-4 gap-1.5 animate-pop w-full shadow-inner">
          {AVATARS.map((av, idx) => {
            const isSelected = avatarIndex === idx;
            return (
              <button
                key={av.id}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onChangeAvatar(idx);
                  setShowGrid(false);
                }}
                className={`p-1.5 rounded-xl text-2xl flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-yellow-300 border-2 border-[#0b2c4d] scale-110 shadow-sm'
                    : 'bg-white hover:bg-slate-100 border border-slate-200'
                }`}
                title={av.label}
              >
                {av.emoji}
              </button>
            );
          })}
        </div>
      )}

      {/* Color Swatch Dots */}
      <div className="flex items-center justify-center flex-wrap gap-1.5 mt-2.5 max-w-[260px]">
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
                isSelected
                  ? 'scale-125 ring-2 ring-white shadow-md -translate-y-0.5'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: col }}
            />
          );
        })}
      </div>
    </div>
  );
}
