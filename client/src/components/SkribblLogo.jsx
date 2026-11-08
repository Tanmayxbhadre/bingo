import React from 'react';

export function SkribblLogo({ size = 'large' }) {
  const isLarge = size === 'large';

  return (
    <div className="inline-flex items-center select-none cursor-pointer transform hover:scale-105 transition-all duration-200">
      <div
        className={`flex items-center space-x-1 sm:space-x-1.5 font-black tracking-wider ${
          isLarge ? 'text-5xl sm:text-7xl' : 'text-2xl sm:text-3.5xl'
        }`}
        style={{
          filter: 'drop-shadow(0 6px 0 #072b4d) drop-shadow(0 10px 18px rgba(7,43,77,0.45))',
        }}
      >
        {/* B */}
        <span
          className="text-[#00a8ff] transform -rotate-4 inline-block hover:-translate-y-1 transition-transform"
          style={{ WebkitTextStroke: isLarge ? '2.5px #ffffff' : '1.5px #ffffff' }}
        >
          B
        </span>
        {/* I */}
        <span
          className="text-[#ff4757] transform rotate-3 inline-block hover:-translate-y-1 transition-transform"
          style={{ WebkitTextStroke: isLarge ? '2.5px #ffffff' : '1.5px #ffffff' }}
        >
          I
        </span>
        {/* N */}
        <span
          className="text-[#ffa502] transform -rotate-3 inline-block hover:-translate-y-1 transition-transform"
          style={{ WebkitTextStroke: isLarge ? '2.5px #ffffff' : '1.5px #ffffff' }}
        >
          N
        </span>
        {/* G */}
        <span
          className="text-[#2ed573] transform rotate-4 inline-block hover:-translate-y-1 transition-transform"
          style={{ WebkitTextStroke: isLarge ? '2.5px #ffffff' : '1.5px #ffffff' }}
        >
          G
        </span>
        {/* O */}
        <span
          className="text-[#ff7f50] transform -rotate-2 inline-block hover:-translate-y-1 transition-transform"
          style={{ WebkitTextStroke: isLarge ? '2.5px #ffffff' : '1.5px #ffffff' }}
        >
          O
        </span>
        {/* .io */}
        <span
          className="text-white font-extrabold pl-1.5 inline-block"
          style={{
            fontSize: isLarge ? '0.62em' : '0.7em',
            WebkitTextStroke: isLarge ? '2px #072b4d' : '1.2px #072b4d',
            textShadow: '0 3px 0 #072b4d',
          }}
        >
          .io
        </span>
      </div>
    </div>
  );
}
