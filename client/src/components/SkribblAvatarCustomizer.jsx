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
    <div className="flex flex-col items-center select-none w-full max-w-sm mx-auto">
      {/* 3D Character Hero Stage with Chunky Tactile Arrows */}
      <div className="flex items-center justify-center space-x-3 sm:space-x-4 w-full">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-500 hover:from-yellow-200 hover:to-amber-400 text-yellow-950 border-3 sm:border-4 border-[#0b2c4d] shadow-[0_4px_0_#072847] flex items-center justify-center font-black transition-all active:translate-y-1 active:shadow-[0_1px_0_#072847] cursor-pointer hover:scale-105"
          title="Previous Character"
        >
          <ChevronLeft className="w-7 h-7 stroke-[3.5]" />
        </button>

        {/* 3D Arcade Stage Pod */}
        <div
          className="relative w-30 h-30 sm:w-34 sm:h-34 rounded-3xl bg-gradient-to-b from-white via-sky-50 to-blue-100/70 border-4 border-[#0b2c4d] shadow-[0_8px_0_#072847,0_14px_24px_rgba(7,43,77,0.25)] flex flex-col items-center justify-center transition-all duration-200 cursor-pointer overflow-visible group"
          onClick={() => setShowGrid(!showGrid)}
          title="Click to view all 16 characters!"
        >
          {/* Stage Circular Spotlight & Pedestal Shadow */}
          <div className="absolute inset-2 rounded-2xl bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,1)_0%,rgba(224,242,254,0.7)_65%,transparent_100%)] pointer-events-none" />
          <div className="absolute bottom-2.5 w-16 h-3 rounded-full bg-slate-400/35 blur-[2.5px] animate-pedestal pointer-events-none" />

          {/* Idle Bobbing Character */}
          <div className="relative z-1 animate-character-idle group-hover:scale-110 transition-transform duration-200">
            <CharacterAvatar id={currentAvatar.id} color={avatarColor} size={92} />
          </div>

          {/* Randomize Dice Action (Corner badge) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRandomize();
            }}
            className="absolute -top-2.5 -right-2.5 w-9 h-9 rounded-xl bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-yellow-300 text-yellow-950 border-3 border-[#0b2c4d] shadow-[0_3px_0_#072847] flex items-center justify-center transition-all active:translate-y-1 active:shadow-[0_1px_0_#072847] hover:rotate-12 cursor-pointer z-10"
            title="Randomize Character & Color (Dice)"
          >
            <Dices className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-500 hover:from-yellow-200 hover:to-amber-400 text-yellow-950 border-3 sm:border-4 border-[#0b2c4d] shadow-[0_4px_0_#072847] flex items-center justify-center font-black transition-all active:translate-y-1 active:shadow-[0_1px_0_#072847] cursor-pointer hover:scale-105"
          title="Next Character"
        >
          <ChevronRight className="w-7 h-7 stroke-[3.5]" />
        </button>
      </div>

      {/* Character Name Tag & Grid Toggle */}
      <div className="flex items-center space-x-2 mt-3">
        <span className="text-xs font-black text-yellow-950 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 px-4 py-1 rounded-full border-2 border-[#0b2c4d] shadow-[0_2px_0_#072847]">
          {currentAvatar.label}
        </span>
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setShowGrid(!showGrid);
          }}
          className="text-xs font-black text-[#0284c7] hover:text-white bg-white hover:bg-[#0284c7] border-2 border-[#0b2c4d] px-3 py-1 rounded-full shadow-[0_2px_0_#072847] transition-all flex items-center space-x-1 cursor-pointer active:translate-y-0.5"
        >
          <SmilePlus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{showGrid ? 'Close' : 'Browse All (16)'}</span>
        </button>
      </div>

      {/* All 16 Characters Grid Selector */}
      {showGrid && (
        <div className="mt-3 bg-white border-4 border-[#0b2c4d] rounded-3xl p-3 grid grid-cols-4 gap-2 animate-pop w-full shadow-[0_10px_0_#072847] z-20">
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
                className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-yellow-200 to-amber-300 border-3 border-[#0b2c4d] scale-110 shadow-md -translate-y-1'
                    : 'bg-slate-50 hover:bg-sky-50 border-2 border-slate-200 hover:border-[#0b2c4d]'
                }`}
                title={av.label}
              >
                <CharacterAvatar id={av.id} color={avatarColor} size={46} />
                <span className="text-[10px] font-black text-[#072847] truncate max-w-full mt-1">
                  {av.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3D Glossy Jelly Color Beads Palette */}
      <div className="mt-3.5 w-full flex items-center justify-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 p-2 bg-slate-100/90 rounded-2xl border-2 border-slate-300/80 shadow-inner max-w-xs">
          {SKRIBBL_COLORS.map((color) => {
            const isSelected = avatarColor.toLowerCase() === color.toLowerCase();
            return (
              <button
                key={color}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onChangeColor(color);
                }}
                className={`w-7 h-7 sm:w-8 sm:h-8 jelly-gem ${isSelected ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                title={`Pick ${color}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
