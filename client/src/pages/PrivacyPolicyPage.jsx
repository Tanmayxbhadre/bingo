import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { SkribblLogo } from '../components/SkribblLogo.jsx';

export function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center relative z-10">
      <div className="max-w-2xl w-full bg-white/95 rounded-[32px] border-4 border-[#0b2c4d] shadow-[0_10px_0_#072847] p-6 sm:p-8 text-[#072847] space-y-5 animate-pop">
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
          <button
            onClick={() => navigate('/')}
            className="skribbl-btn-blue px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Game</span>
          </button>
          <SkribblLogo size="small" />
        </div>

        <div className="flex items-center space-x-2 text-emerald-600">
          <ShieldCheck className="w-6 h-6" />
          <h1 className="text-2xl sm:text-3xl font-black text-[#072847]">Privacy Policy</h1>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            Welcome to <strong>Bingo.io</strong>. Your privacy is important to us. This policy outlines how we handle player information when you enjoy our game.
          </p>

          <h2 className="text-base font-black text-[#072847] pt-2">1. Information We Collect</h2>
          <p>
            Bingo.io is designed for casual multiplayer gameplay. We do not require registration, email addresses, or personal identity verification. Only your chosen in-game display name, avatar index, and temporary room session tokens are used in memory during active matches.
          </p>

          <h2 className="text-base font-black text-[#072847] pt-2">2. Local Storage</h2>
          <p>
            We use your browser's local storage solely to remember your preferred player name, avatar, and mute settings across visits.
          </p>

          <h2 className="text-base font-black text-[#072847] pt-2">3. Data Sharing & Third Parties</h2>
          <p>
            We do not sell, rent, or share personal data with third-party advertisers. All multiplayer communications occur over encrypted WebSockets directly with our game server.
          </p>

          <h2 className="text-base font-black text-[#072847] pt-2">4. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please open an issue on our GitHub repository.
          </p>

          <p className="text-[11px] text-slate-400 pt-3">
            Last updated: November 2026
          </p>
        </div>
      </div>
    </div>
  );
}

