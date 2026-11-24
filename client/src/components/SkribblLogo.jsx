import React from 'react';
import { Sparkles } from 'lucide-react';

export function SkribblLogo({ size = 'large' }) {
  const isLarge = size === 'large';

  return (
    <div className="inline-flex flex-col items-center select-none cursor-pointer group">
      <div
        className={`flex items-center space-x-1 sm:space-x-1.5 font-black tracking-wider transition-transform duration-200 group-hover:scale-105 ${
          isLarge ? 'text-5xl sm:text-7xl' : 'text-2xl sm:text-3.5xl'
        }`}
        style={{
          filter: 'drop-shadow(0 8px 0 #072b4d) drop-shadow(0 14px 22px rgba(7,43,77,0.5))',
        }}
      >
        {/* B */}
        <span
          className="text-[#00a8ff] transform -rotate-6 inline-block hover:-translate-y-2 hover:rotate-0 transition-transform duration-150"
          style={{ WebkitTextStroke: isLarge ? '3px #ffffff' : '1.8px #ffffff' }}
        >
          B
        </span>
        {/* I */}
        <span
          className="text-[#ff4757] transform rotate-4 inline-block hover:-translate-y-2 hover:rotate-0 transition-transform duration-150"
          style={{ WebkitTextStroke: isLarge ? '3px #ffffff' : '1.8px #ffffff' }}
        >
          I
        </span>
        {/* N */}
        <span
          className="text-[#ffa502] transform -rotate-3 inline-block hover:-translate-y-2 hover:rotate-0 transition-transform duration-150"
          style={{ WebkitTextStroke: isLarge ? '3px #ffffff' : '1.8px #ffffff' }}
        >
          N
        </span>
        {/* G */}
        <span
          className="text-[#2ed573] transform rotate-6 inline-block hover:-translate-y-2 hover:rotate-0 transition-transform duration-150"
          style={{ WebkitTextStroke: isLarge ? '3px #ffffff' : '1.8px #ffffff' }}
        >
          G
        </span>
        {/* O */}
        <span
          className="text-[#ff7f50] transform -rotate-4 inline-block hover:-translate-y-2 hover:rotate-0 transition-transform duration-150"
          style={{ WebkitTextStroke: isLarge ? '3px #ffffff' : '1.8px #ffffff' }}
        >
          O
        </span>
        {/* .io pill badge */}
        <span
          className="bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-500 text-yellow-950 font-black px-2.5 sm:px-3 py-0.5 rounded-2xl ml-1.5 border-3 border-[#072b4d] shadow-[0_3px_0_#072b4d] transform rotate-3 inline-block group-hover:rotate-6 transition-transform"
          style={{
            fontSize: isLarge ? '0.45em' : '0.55em',
            letterSpacing: '1px',
          }}
        >
          .IO
        </span>
      </div>
    </div>
  );
}
