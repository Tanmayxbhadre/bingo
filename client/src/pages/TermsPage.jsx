import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { SkribblLogo } from '../components/SkribblLogo.jsx';

export function TermsPage() {
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

        <div className="flex items-center space-x-2 text-sky-600">
          <BookOpen className="w-6 h-6" />
          <h1 className="text-2xl sm:text-3xl font-black text-[#072847]">Terms of Service</h1>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
          <p>
            By accessing or playing <strong>Bingo.io</strong>, you agree to these Terms of Service.
          </p>

          <h2 className="text-base font-black text-[#072847] pt-2">1. Fair Play & Community Guidelines</h2>
          <p>
            Bingo.io is a friendly, family-safe multiplayer game. Users must refrain from abusive language, harassment, hate speech, or automated bot play in public or private game chats.
          </p>

          <h2 className="text-base font-black text-[#072847] pt-2">2. Availability & Service</h2>
          <p>
            The game is provided "as is" on a best-effort basis without warranties of uninterrupted uptime. We reserve the right to perform maintenance or update game balance at any time.
          </p>

          <h2 className="text-base font-black text-[#072847] pt-2">3. Intellectual Property</h2>
          <p>
            The Bingo.io client, logos, and cartoon doodler characters are protected intellectual property. Commercial redistribution without permission is prohibited.
          </p>

          <p className="text-[11px] text-slate-400 pt-3">
            Last updated: November 2026
          </p>
        </div>
      </div>
    </div>
  );
}

