/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bingo: {
          pink: '#FF4D8D',
          purple: '#7B2CBF',
          yellow: '#FFB703',
          blue: '#3A86FF',
          green: '#06D6A0',
          orange: '#FB5607',
          dark: '#1D2A44',
          light: '#F8FAFC',
        },
      },
      fontFamily: {
        game: ['Fredoka', 'Comic Neue', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'bouncy': '0 6px 0 0 rgba(0,0,0,0.18)',
        'bouncy-active': '0 2px 0 0 rgba(0,0,0,0.18)',
        'card-glow': '0 0 25px rgba(255, 183, 3, 0.45)',
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
        'pop': 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
