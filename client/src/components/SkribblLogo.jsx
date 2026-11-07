import React from 'react';

export function SkribblLogo({ size = 'large' }) {
  const isLarge = size === 'large';

  return (
    <div className="inline-flex items-center select-none cursor-pointer transform hover:scale-102 transition-transform">
      <div className={`flex items-center space-x-1 sm:space-x-1.5 font-black tracking-wider ${isLarge ? 'text-4xl sm:text-6xl' : 'text-2xl sm:text-3xl'}`}>
        {/* B */}
        <span className="text-[#0084ff] drop-shadow-[0_4px_0_#00458a] transform -rotate-3 inline-block">
          B
        </span>
        {/* I */}
        <span className="text-[#ff4500] drop-shadow-[0_4px_0_#b33000] transform rotate-2 inline-block">
          I
        </span>
        {/* N */}
        <span className="text-[#ffb703] drop-shadow-[0_4px_0_#b38000] transform -rotate-2 inline-block">
          N
        </span>
        {/* G */}
        <span className="text-[#55b338] drop-shadow-[0_4px_0_#2d661b] transform rotate-3 inline-block">
          G
        </span>
        {/* O */}
        <span className="text-[#ff8c00] drop-shadow-[0_4px_0_#b35900] transform -rotate-1 inline-block">
          O
        </span>
        {/* .io */}
        <span className="text-white drop-shadow-[0_4px_0_#08233d] font-extrabold text-2xl sm:text-4xl pl-1">
          .io
        </span>
      </div>
    </div>
  );
}

