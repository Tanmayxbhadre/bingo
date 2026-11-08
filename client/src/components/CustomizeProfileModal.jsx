import React, { useState } from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import { SkribblAvatarCustomizer } from './SkribblAvatarCustomizer.jsx';
import { sounds } from '../services/soundEffects.js';
import { AVATARS, SKRIBBL_COLORS } from '@shared/constants/gameConstants.js';

export function CustomizeProfileModal({ isOpen, onClose }) {
  const { name, avatarIndex, avatarColor, updateProfile } = useGame();

  const [inputName, setInputName] = useState(name);
  const [currentAvatarIdx, setCurrentAvatarIdx] = useState(avatarIndex);
  const [currentColor, setCurrentColor] = useState(avatarColor);

  if (!isOpen) return null;

  const handleRandomize = () => {
    sounds.playPop();
    const randomAvatarIdx = Math.floor(Math.random() * AVATARS.length);
    const randomColor = SKRIBBL_COLORS[Math.floor(Math.random() * SKRIBBL_COLORS.length)];

    setCurrentAvatarIdx(randomAvatarIdx);
    setCurrentColor(randomColor);
  };

  const handleSave = (e) => {
    e?.preventDefault();
    sounds.playPop();
    const finalName = inputName.trim() || 'Player';
    updateProfile(finalName, currentAvatarIdx, currentColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop select-none">
      <div className="relative bg-gradient-to-b from-white via-white to-sky-50/50 border-4 border-[#0b2c4d] p-6 rounded-[32px] max-w-sm w-full text-center text-[#0b2c4d] shadow-[0_12px_0_#072847,0_25px_40px_rgba(0,0,0,0.35)] space-y-3.5">
        {/* Close X Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#0b2c4d] transition-all cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-black text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Character Studio</span>
          </div>
          <h2 className="text-2xl font-black text-[#072847]">
            Customize Profile
          </h2>
          <p className="text-slate-500 font-bold text-xs mt-0.5">
            Pick your favorite character, color & nickname!
          </p>
        </div>

        {/* Avatar Customizer */}
        <SkribblAvatarCustomizer
          avatarIndex={currentAvatarIdx}
          avatarColor={currentColor}
          onChangeAvatar={setCurrentAvatarIdx}
          onChangeColor={setCurrentColor}
          onRandomize={handleRandomize}
        />

        {/* Name Input */}
        <div>
          <label className="block text-[11px] font-black uppercase text-slate-500 mb-1 text-center">
            Your Nickname:
          </label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            maxLength={16}
            placeholder="Enter nickname"
            className="w-full bg-white border-3 border-[#0b2c4d] text-[#0b2c4d] placeholder-slate-400 font-black text-center text-lg rounded-2xl py-2.5 shadow-inner focus:outline-none focus:ring-4 focus:ring-yellow-400/50 focus:border-[#0084ff] transition-all"
          />
        </div>

        {/* Save / Ready Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="w-full skribbl-btn-green py-3.5 rounded-2xl text-lg font-black flex items-center justify-center space-x-2 tracking-wide cursor-pointer shadow-lg"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Save & Ready!</span>
          </button>
        </div>
      </div>
    </div>
  );
}

