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
    const adjectives = ['Super', 'Lucky', 'Speedy', 'Cool', 'Happy', 'Brave', 'Golden', 'Cozy'];
    const nouns = ['Player', 'Panda', 'Tiger', 'Artist', 'Star', 'Hero', 'Gamer', 'Doodler'];
    const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
    const randomAvatarIdx = Math.floor(Math.random() * AVATARS.length);
    const randomColor = SKRIBBL_COLORS[Math.floor(Math.random() * SKRIBBL_COLORS.length)];

    setInputName(randomName);
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
      <div className="relative bg-white border-4 border-[#0b2c4d] p-5 sm:p-6 rounded-3xl max-w-sm w-full text-center text-[#0b2c4d] shadow-[0_10px_0_#08233d] space-y-3">
        {/* Close X Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#0b2c4d] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-1">
          <div className="inline-flex items-center space-x-1 text-xs font-black text-yellow-600 uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Character Studio</span>
          </div>
          <h2 className="text-2xl font-black text-[#0b2c4d]">
            Customize Character
          </h2>
          <p className="text-slate-500 font-bold text-xs">
            Pick your favorite avatar, color & name!
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
            Your Display Name:
          </label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            maxLength={16}
            placeholder="Enter your name"
            className="w-full bg-[#f4f7fa] border-4 border-[#0b2c4d] text-[#0b2c4d] placeholder-slate-400 font-black text-center text-lg rounded-2xl py-2 focus:outline-none focus:ring-4 focus:ring-[#0084ff]/30 transition-all"
          />
        </div>

        {/* Save / Ready Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="w-full skribbl-btn-green py-3 rounded-2xl text-lg font-black flex items-center justify-center space-x-2 tracking-wide cursor-pointer shadow-md"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Save & Ready!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
