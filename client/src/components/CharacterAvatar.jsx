import React from 'react';

/**
 * Maps legacy emoji characters or IDs to custom character IDs
 */
export const CHARACTER_MAP = {
  'cool': 'cool',
  '😎': 'cool',
  'happy': 'classic',
  '😃': 'classic',
  'classic': 'classic',
  'star': 'star',
  '🤩': 'star',
  'cowboy': 'cowboy',
  '🤠': 'cowboy',
  'nerd': 'nerd',
  '🤓': 'nerd',
  'cat': 'cat',
  '🐱': 'cat',
  'robot': 'robot',
  '🤖': 'robot',
  'party': 'party',
  '🥳': 'party',
  'ninja': 'ninja',
  '🥷': 'ninja',
  'panda': 'panda',
  '🐼': 'panda',
  'king': 'king',
  '👑': 'king',
  'alien': 'alien',
  '👽': 'alien',
  'gamer': 'gamer',
  '🎧': 'gamer',
  'pirate': 'pirate',
  '🏴‍☠️': 'pirate',
  'devil': 'devil',
  '😈': 'devil',
  'wink': 'devil',
  '😉': 'devil',
  'frog': 'frog',
  '🐸': 'frog',
  'ghost': 'ghost',
  '👻': 'ghost',
  'fire': 'devil',
  '🔥': 'devil',
  'dog': 'cat',
  '🐶': 'cat',
  'fox': 'cat',
  '🦊': 'cat',
  'lion': 'king',
  '🦁': 'king',
  'monkey': 'classic',
  '🐵': 'classic',
  'unicorn': 'star',
  '🦄': 'star',
};

export function getCharacterId(avatar) {
  if (!avatar) return 'cool';
  return CHARACTER_MAP[avatar] || avatar || 'cool';
}

/**
 * Custom-designed vector cartoon characters for Bingo.io!
 * Scales to any size (32px to 140px) and applies the player's chosen color.
 */
export function CharacterAvatar({
  id = 'cool',
  color = '#55b338',
  size = 48,
  className = '',
}) {
  const charId = getCharacterId(id);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none flex-shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-sm"
      >
        {/* ================= BACKGROUND HEAD BLOB ================= */}
        {/* Ghost has a wavy base, others have a rounded jelly blob */}
        {charId === 'ghost' ? (
          <path
            d="M 20 50 C 20 28, 32 16, 50 16 C 68 16, 80 28, 80 50 L 80 82 C 80 84, 75 80, 70 84 C 65 88, 60 84, 55 84 C 50 84, 45 88, 40 84 C 35 80, 30 84, 25 84 C 20 84, 20 82, 20 82 Z"
            fill={color}
            stroke="#0b2c4d"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        ) : (
          <rect
            x="12"
            y="12"
            width="76"
            height="76"
            rx="28"
            fill={color}
            stroke="#0b2c4d"
            strokeWidth="5"
          />
        )}

        {/* 3D Gloss Highlight on Head */}
        <ellipse
          cx="28"
          cy="24"
          rx="10"
          ry="5"
          fill="white"
          opacity="0.35"
          transform="rotate(-25 28 24)"
        />

        {/* ================= CHARACTER-SPECIFIC ACCESSORIES / FACES ================= */}

        {/* 1. COOL SHADES */}
        {charId === 'cool' && (
          <g>
            {/* Sunglasses Frame */}
            <path
              d="M 20 38 L 47 38 L 45 55 L 23 55 Z"
              fill="#111827"
              stroke="#0b2c4d"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M 53 38 L 80 38 L 77 55 L 55 55 Z"
              fill="#111827"
              stroke="#0b2c4d"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Bridge */}
            <line x1="46" y1="41" x2="54" y2="41" stroke="#111827" strokeWidth="4" />
            {/* White Glare on Glasses */}
            <polygon points="25,41 33,41 29,52 23,52" fill="white" opacity="0.6" />
            <polygon points="57,41 65,41 61,52 55,52" fill="white" opacity="0.6" />
            {/* Smirk Smile */}
            <path
              d="M 46 68 Q 58 74 68 64"
              stroke="#0b2c4d"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 2. CLASSIC DOODLER */}
        {charId === 'classic' && (
          <g>
            {/* Left Eye */}
            <circle cx="34" cy="42" r="7" fill="#0b2c4d" />
            <circle cx="32" cy="40" r="2.5" fill="white" />
            {/* Right Eye */}
            <circle cx="66" cy="42" r="7" fill="#0b2c4d" />
            <circle cx="64" cy="40" r="2.5" fill="white" />
            {/* Rosy Blush */}
            <circle cx="23" cy="52" r="4.5" fill="#f43f5e" opacity="0.4" />
            <circle cx="77" cy="52" r="4.5" fill="#f43f5e" opacity="0.4" />
            {/* Big Open Grin with Tongue */}
            <path
              d="M 36 60 Q 50 78 64 60 Z"
              fill="#be123c"
              stroke="#0b2c4d"
              strokeWidth="3.5"
            />
            <path
              d="M 43 69 Q 50 63 57 69 Q 50 78 43 69 Z"
              fill="#fb7185"
            />
          </g>
        )}

        {/* 3. STARRY ANIME */}
        {charId === 'star' && (
          <g>
            {/* Left Star Eye */}
            <path
              d="M 34 32 L 36 41 L 44 43 L 36 45 L 34 54 L 32 45 L 24 43 L 32 41 Z"
              fill="#fbbf24"
              stroke="#0b2c4d"
              strokeWidth="2.5"
            />
            {/* Right Star Eye */}
            <path
              d="M 66 32 L 68 41 L 76 43 L 68 45 L 66 54 L 64 45 L 56 43 L 64 41 Z"
              fill="#fbbf24"
              stroke="#0b2c4d"
              strokeWidth="2.5"
            />
            {/* Cheerful Mouth */}
            <path
              d="M 38 63 Q 50 76 62 63"
              stroke="#0b2c4d"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 4. COWBOY */}
        {charId === 'cowboy' && (
          <g>
            {/* Cowboy Hat Brim */}
            <ellipse cx="50" cy="20" rx="42" ry="9" fill="#854d0e" stroke="#0b2c4d" strokeWidth="4" />
            {/* Hat Crown */}
            <path
              d="M 28 20 Q 30 4 50 4 Q 70 4 72 20 Z"
              fill="#a16207"
              stroke="#0b2c4d"
              strokeWidth="4"
            />
            {/* Hat Band */}
            <path d="M 28 17 Q 50 14 72 17 L 72 20 Q 50 17 28 20 Z" fill="#dc2626" />
            {/* Squinting Eyes */}
            <path d="M 30 45 Q 36 38 42 45" stroke="#0b2c4d" strokeWidth="4" strokeLinecap="round" />
            <path d="M 58 45 Q 64 38 70 45" stroke="#0b2c4d" strokeWidth="4" strokeLinecap="round" />
            {/* Friendly Grin with Straw */}
            <path d="M 40 65 Q 50 72 60 65" stroke="#0b2c4d" strokeWidth="4" strokeLinecap="round" />
            <line x1="58" y1="67" x2="74" y2="60" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* 5. BRAINIAC NERD */}
        {charId === 'nerd' && (
          <g>
            {/* Big Round Glasses */}
            <circle cx="34" cy="45" r="13" fill="white" stroke="#0b2c4d" strokeWidth="4" />
            <circle cx="66" cy="45" r="13" fill="white" stroke="#0b2c4d" strokeWidth="4" />
            {/* Tape on Bridge */}
            <rect x="44" y="42" width="12" height="6" fill="#fef08a" stroke="#0b2c4d" strokeWidth="2" />
            {/* Pupils looking up */}
            <circle cx="34" cy="45" r="5" fill="#0b2c4d" />
            <circle cx="66" cy="45" r="5" fill="#0b2c4d" />
            {/* Buck Teeth Grin */}
            <path d="M 42 66 Q 50 72 58 66" stroke="#0b2c4d" strokeWidth="3" strokeLinecap="round" />
            <rect x="47" y="67" width="6" height="5" fill="white" stroke="#0b2c4d" strokeWidth="2" rx="1" />
          </g>
        )}

        {/* 6. KITTY NEKO */}
        {charId === 'cat' && (
          <g>
            {/* Cat Ears */}
            <polygon points="18,18 28,0 42,16" fill={color} stroke="#0b2c4d" strokeWidth="4" strokeLinejoin="round" />
            <polygon points="24,15 29,5 36,15" fill="#f43f5e" />
            <polygon points="82,18 72,0 58,16" fill={color} stroke="#0b2c4d" strokeWidth="4" strokeLinejoin="round" />
            <polygon points="76,15 71,5 64,15" fill="#f43f5e" />
            {/* Cute Cat Eyes */}
            <ellipse cx="34" cy="44" rx="5" ry="7" fill="#0b2c4d" />
            <circle cx="32" cy="41" r="2" fill="white" />
            <ellipse cx="66" cy="44" rx="5" ry="7" fill="#0b2c4d" />
            <circle cx="64" cy="41" r="2" fill="white" />
            {/* Little Triangle Nose */}
            <polygon points="50,54 47,51 53,51" fill="#f43f5e" />
            {/* Cat '3' Mouth */}
            <path d="M 44 58 Q 47 62 50 58 Q 53 62 56 58" stroke="#0b2c4d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="16" y1="48" x2="26" y2="50" stroke="#0b2c4d" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="56" x2="26" y2="55" stroke="#0b2c4d" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="84" y1="48" x2="74" y2="50" stroke="#0b2c4d" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="84" y1="56" x2="74" y2="55" stroke="#0b2c4d" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* 7. CYBER ROBOT */}
        {charId === 'robot' && (
          <g>
            {/* Antenna with Glowing Bulb */}
            <line x1="50" y1="12" x2="50" y2="3" stroke="#0b2c4d" strokeWidth="4" />
            <circle cx="50" cy="3" r="5" fill="#eab308" stroke="#0b2c4d" strokeWidth="3" />
            {/* Ear Bolts */}
            <rect x="6" y="44" width="7" height="12" rx="2" fill="#94a3b8" stroke="#0b2c4d" strokeWidth="3" />
            <rect x="87" y="44" width="7" height="12" rx="2" fill="#94a3b8" stroke="#0b2c4d" strokeWidth="3" />
            {/* Visor Area */}
            <rect x="22" y="34" width="56" height="20" rx="6" fill="#0f172a" stroke="#0b2c4d" strokeWidth="3" />
            {/* Cyan Digital Eyes */}
            <rect x="30" y="40" width="12" height="8" rx="2" fill="#06b6d4" />
            <rect x="58" y="40" width="12" height="8" rx="2" fill="#06b6d4" />
            {/* Digital Grid Mouth */}
            <rect x="36" y="64" width="28" height="8" rx="3" fill="#1e293b" stroke="#0b2c4d" strokeWidth="2" />
            <line x1="43" y1="64" x2="43" y2="72" stroke="#06b6d4" strokeWidth="2" />
            <line x1="50" y1="64" x2="50" y2="72" stroke="#06b6d4" strokeWidth="2" />
            <line x1="57" y1="64" x2="57" y2="72" stroke="#06b6d4" strokeWidth="2" />
          </g>
        )}

        {/* 8. SHADOW NINJA */}
        {charId === 'ninja' && (
          <g>
            {/* Ninja Headband / Mask Wrap */}
            <rect x="12" y="24" width="76" height="16" fill="#1e293b" stroke="#0b2c4d" strokeWidth="3" />
            {/* Metal Forehead Plate */}
            <rect x="38" y="27" width="24" height="10" rx="3" fill="#94a3b8" stroke="#0b2c4d" strokeWidth="2" />
            <circle cx="50" cy="32" r="2" fill="#0b2c4d" />
            {/* Fierce Focused Eyes */}
            <polygon points="26,45 42,48 42,52 26,48" fill="#0b2c4d" />
            <circle cx="34" cy="48" r="2" fill="white" />
            <polygon points="74,45 58,48 58,52 74,48" fill="#0b2c4d" />
            <circle cx="66" cy="48" r="2" fill="white" />
            {/* Lower Mask Cloth covering mouth */}
            <path d="M 14 58 L 50 68 L 86 58 L 86 84 C 86 86 14 86 14 84 Z" fill="#1e293b" stroke="#0b2c4d" strokeWidth="3.5" />
          </g>
        )}

        {/* 9. CHILL PANDA */}
        {charId === 'panda' && (
          <g>
            {/* Round Black Panda Ears */}
            <circle cx="20" cy="18" r="10" fill="#0b2c4d" stroke="#0b2c4d" strokeWidth="2" />
            <circle cx="80" cy="18" r="10" fill="#0b2c4d" stroke="#0b2c4d" strokeWidth="2" />
            {/* Black Oval Eye Patches */}
            <ellipse cx="33" cy="44" rx="10" ry="13" fill="#0b2c4d" transform="rotate(-15 33 44)" />
            <circle cx="33" cy="44" r="3.5" fill="white" />
            <ellipse cx="67" cy="44" rx="10" ry="13" fill="#0b2c4d" transform="rotate(15 67 44)" />
            <circle cx="67" cy="44" r="3.5" fill="white" />
            {/* Nose & Mouth */}
            <ellipse cx="50" cy="56" rx="4" ry="3" fill="#0b2c4d" />
            <path d="M 45 62 Q 50 66 55 62" stroke="#0b2c4d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* 10. ROYAL KING */}
        {charId === 'king' && (
          <g>
            {/* 3-Point Golden Crown */}
            <polygon
              points="28,20 34,2 50,14 66,2 72,20"
              fill="#fbbf24"
              stroke="#0b2c4d"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Crown Base Band with Gems */}
            <rect x="28" y="18" width="44" height="6" fill="#f59e0b" stroke="#0b2c4d" strokeWidth="2" />
            <circle cx="34" cy="21" r="2" fill="#ef4444" />
            <circle cx="50" cy="21" r="2.5" fill="#3b82f6" />
            <circle cx="66" cy="21" r="2" fill="#ef4444" />
            {/* Eyes */}
            <circle cx="34" cy="44" r="5" fill="#0b2c4d" />
            <circle cx="66" cy="44" r="5" fill="#0b2c4d" />
            {/* Regal Mustache & Smile */}
            <path
              d="M 38 64 Q 44 60 50 64 Q 56 60 62 64 Q 50 72 38 64 Z"
              fill="#92400e"
              stroke="#0b2c4d"
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* 11. CYCLOPS ALIEN */}
        {charId === 'alien' && (
          <g>
            {/* Alien Antenna */}
            <path d="M 50 12 Q 50 2 60 0" stroke="#0b2c4d" strokeWidth="4" fill="none" strokeLinecap="round" />
            <circle cx="60" cy="0" r="5" fill="#10b981" stroke="#0b2c4d" strokeWidth="3" />
            {/* Giant Center Cyclops Eye */}
            <circle cx="50" cy="42" r="18" fill="white" stroke="#0b2c4d" strokeWidth="4" />
            <circle cx="50" cy="42" r="9" fill="#8b5cf6" />
            <circle cx="50" cy="42" r="5" fill="#0b2c4d" />
            <circle cx="47" cy="38" r="3" fill="white" />
            {/* Silly Mouth */}
            <path d="M 38 70 Q 50 78 62 70" stroke="#0b2c4d" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="26" cy="54" r="3" fill="#a7f3d0" opacity="0.6" />
            <circle cx="74" cy="54" r="3" fill="#a7f3d0" opacity="0.6" />
          </g>
        )}

        {/* 12. GAMER PRO */}
        {charId === 'gamer' && (
          <g>
            {/* Gaming Headset Band */}
            <path d="M 14 42 Q 14 10 50 10 Q 86 10 86 42" stroke="#1e293b" strokeWidth="7" fill="none" strokeLinecap="round" />
            {/* Headphone Ear Cushions */}
            <rect x="6" y="32" width="12" height="24" rx="5" fill="#ef4444" stroke="#0b2c4d" strokeWidth="3.5" />
            <rect x="82" y="32" width="12" height="24" rx="5" fill="#ef4444" stroke="#0b2c4d" strokeWidth="3.5" />
            {/* Boom Mic */}
            <path d="M 12 52 Q 18 68 36 68" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="36" cy="68" r="3.5" fill="#ef4444" />
            {/* Eyes */}
            <circle cx="34" cy="44" r="5.5" fill="#0b2c4d" />
            <circle cx="33" cy="42" r="2" fill="white" />
            <circle cx="66" cy="44" r="5.5" fill="#0b2c4d" />
            <circle cx="65" cy="42" r="2" fill="white" />
            {/* Grin */}
            <path d="M 40 60 Q 50 70 60 60" stroke="#0b2c4d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* 13. PIRATE CAPTAIN */}
        {charId === 'pirate' && (
          <g>
            {/* Red & White Striped Bandanna */}
            <path d="M 12 30 Q 50 16 88 30 L 88 18 Q 50 8 12 18 Z" fill="#dc2626" stroke="#0b2c4d" strokeWidth="3" />
            <polygon points="16,30 24,18 29,18 21,30" fill="white" />
            <polygon points="36,28 44,16 49,16 41,28" fill="white" />
            <polygon points="56,28 64,16 69,16 61,28" fill="white" />
            {/* Eye Patch */}
            <line x1="14" y1="36" x2="52" y2="52" stroke="#0b2c4d" strokeWidth="3" />
            <ellipse cx="34" cy="45" rx="9" ry="8" fill="#111827" stroke="#0b2c4d" strokeWidth="2.5" />
            {/* Real Eye */}
            <circle cx="66" cy="45" r="5" fill="#0b2c4d" />
            <circle cx="64" cy="43" r="2" fill="white" />
            {/* Pirate Smirk */}
            <path d="M 42 66 Q 52 74 64 64" stroke="#0b2c4d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* 14. MISCHIEF DEVIL */}
        {charId === 'devil' && (
          <g>
            {/* Red Devil Horns */}
            <path d="M 22 22 Q 18 2 30 6 Q 30 18 22 22 Z" fill="#dc2626" stroke="#0b2c4d" strokeWidth="3" />
            <path d="M 78 22 Q 82 2 70 6 Q 70 18 78 22 Z" fill="#dc2626" stroke="#0b2c4d" strokeWidth="3" />
            {/* Left Winking Eye */}
            <path d="M 28 46 Q 34 38 40 46" stroke="#0b2c4d" strokeWidth="4" strokeLinecap="round" />
            {/* Right Open Eye */}
            <circle cx="66" cy="44" r="6" fill="#0b2c4d" />
            <circle cx="64" cy="42" r="2.5" fill="white" />
            {/* Mischievous Grin with Fang */}
            <path d="M 38 62 Q 50 74 62 62" stroke="#0b2c4d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <polygon points="43,64 47,64 45,70" fill="white" stroke="#0b2c4d" strokeWidth="1.5" />
          </g>
        )}

        {/* 15. FROGGY */}
        {charId === 'frog' && (
          <g>
            {/* Bulging Frog Eyes on Top */}
            <circle cx="28" cy="14" r="14" fill={color} stroke="#0b2c4d" strokeWidth="4" />
            <circle cx="28" cy="14" r="8" fill="white" />
            <circle cx="28" cy="14" r="4.5" fill="#0b2c4d" />
            <circle cx="72" cy="14" r="14" fill={color} stroke="#0b2c4d" strokeWidth="4" />
            <circle cx="72" cy="14" r="8" fill="white" />
            <circle cx="72" cy="14" r="4.5" fill="#0b2c4d" />
            {/* Nostrils */}
            <circle cx="46" cy="48" r="2" fill="#0b2c4d" />
            <circle cx="54" cy="48" r="2" fill="#0b2c4d" />
            {/* Big Wide Frog Smile */}
            <path d="M 26 58 Q 50 76 74 58" stroke="#0b2c4d" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="24" cy="56" r="4" fill="#fb7185" opacity="0.6" />
            <circle cx="76" cy="56" r="4" fill="#fb7185" opacity="0.6" />
          </g>
        )}

        {/* 16. SPOOKY BOO */}
        {charId === 'ghost' && (
          <g>
            {/* Big Hollow Cute Eyes */}
            <ellipse cx="36" cy="42" rx="6" ry="9" fill="#0b2c4d" />
            <circle cx="34" cy="38" r="2.5" fill="white" />
            <ellipse cx="64" cy="42" rx="6" ry="9" fill="#0b2c4d" />
            <circle cx="62" cy="38" r="2.5" fill="white" />
            {/* Surprised Happy 'O' Mouth */}
            <ellipse cx="50" cy="58" rx="4.5" ry="6.5" fill="#0b2c4d" />
            {/* Floating Soft Blush */}
            <circle cx="25" cy="50" r="4" fill="#f43f5e" opacity="0.4" />
            <circle cx="75" cy="50" r="4" fill="#f43f5e" opacity="0.4" />
          </g>
        )}
      </svg>
    </div>
  );
}
