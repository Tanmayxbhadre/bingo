import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Dices, SmilePlus } from 'lucide-react';
import { AVATARS, SKRIBBL_COLORS } from '@shared/constants/gameConstants.js';
import { CharacterAvatar } from './CharacterAvatar.jsx';
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
      {/* Avatar Face with Chunky Cartoon Arrow Buttons */}
      <div className="flex items-center justify-center space-x-3 w-full">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-12 h-12 rounded-2xl bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 hover:from-yellow-200 hover:to-yellow-400 text-[#072847] border-4 border-[#0b2c4d] shadow-[0_5px_0_#072847] flex items-center justify-center font-black transition-all active:translate-y-1 active:shadow-[0_1px_0_#072847] cursor-pointer hover:scale-105"
          title="Previous Character"
        >
          <ChevronLeft className="w-7 h-7 stroke-[3.5]" />
        </button>

        {/* Character Stage Box */}
        <div
          className="relative w-32 h-32 rounded-3xl bg-gradient-to-b from-white via-white to-sky-50 border-4 border-[#0b2c4d] shadow-[0_8px_0_#072847] flex flex-col items-center justify-center transition-all duration-200 cursor-pointer overflow-visible hover:scale-105"
          onClick={() => setShowGrid(!showGrid)}
          title="Click to browse all characters!"
        >
          {/* Subtle Stage Inner Glow */}
          <div className="absolute inset-1.5 rounded-[22px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,rgba(240,249,255,0.7)_100%)] pointer-events-none" />

          <div className="relative z-1 transform hover:scale-110 transition-transform">
            <CharacterAvatar id={currentAvatar.id} color={avatarColor} size={98} />
          </div>

          {/* Randomize Dice Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRandomize();
            }}
            className="absolute -top-3 -right-3 w-9 h-9 rounded-xl bg-gradient-to-b from-amber-300 to-yellow-400 hover:from-amber-200 hover:to-yellow-300 text-yellow-950 border-3 border-[#0b2c4d] shadow-[0_3px_0_#072847] flex items-center justify-center transition-all active:scale-90 hover:rotate-12 cursor-pointer z-10"
            title="Randomize Character & Color"
          >
            <Dices className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-12 h-12 rounded-2xl bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 hover:from-yellow-200 hover:to-yellow-400 text-[#072847] border-4 border-[#0b2c4d] shadow-[0_5px_0_#072847] flex items-center justify-center font-black transition-all active:translate-y-1 active:shadow-[0_1px_0_#072847] cursor-pointer hover:scale-105"
          title="Next Character"
        >
          <ChevronRight className="w-7 h-7 stroke-[3.5]" />
        </button>
      </div>

      {/* Character Label & Quick Grid Toggle */}
      <div className="flex items-center space-x-2 mt-2.5">
        <span className="text-xs font-black text-amber-950 bg-gradient-to-r from-amber-200 to-yellow-300 px-3.5 py-1 rounded-full border-2 border-amber-400 shadow-sm">
          {currentAvatar.label}
        </span>
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setShowGrid(!showGrid);
          }}
          className="text-xs font-black text-[#0284c7] bg-white hover:bg-sky-50 border-2 border-sky-300 px-2.5 py-0.5 rounded-full shadow-sm hover:border-[#0284c7] transition-all flex items-center space-x-1 cursor-pointer"
        >
          <SmilePlus className="w-3.5 h-3.5" />
          <span>{showGrid ? 'Close' : 'All (16)'}</span>
        </button>
      </div>

      {/* All 16 Custom Characters Grid Popup */}
      {showGrid && (
        <div className="mt-3 bg-white border-4 border-[#0b2c4d] rounded-2xl p-2.5 grid grid-cols-4 gap-2 animate-pop w-full shadow-[0_8px_0_#072847]">
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
                className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-yellow-200 to-amber-300 border-3 border-[#0b2c4d] scale-110 shadow-md -translate-y-0.5'
                    : 'bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-[#0b2c4d]'
                }`}
                title={av.label}
              >
                <CharacterAvatar id={av.id} color={avatarColor} size={42} />
                <span className="text-[9px] font-black text-[#0b2c4d] truncate max-w-[54px] mt-1 leading-none">
                  {av.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Clean 5x2 Symmetrical Color Swatch Grid */}
      <div className="grid grid-cols-5 gap-2.5 mt-3.5 max-w-[210px] mx-auto">
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
              className={`w-7 h-7 rounded-full border-3 border-[#0b2c4d] transition-all transform cursor-pointer shadow-[0_3px_0_rgba(7,40,71,0.25)] relative ${
                isSelected
                  ? 'scale-125 ring-3 ring-white shadow-[0_4px_8px_rgba(0,0,0,0.35)] -translate-y-1'
                  : 'hover:scale-115'
              }`}
              style={{ backgroundColor: col }}
            >
              {/* Inner 3D gloss reflection dot */}
              <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/60 rounded-full" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
