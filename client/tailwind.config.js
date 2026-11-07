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
        skribbl: {
          bg: '#0e3860',
          dark: '#08233d',
          panel: '#ffffff',
          border: '#0b2c4d',
          green: '#55b338',
          greenDark: '#387c23',
          blue: '#0084ff',
          blueDark: '#005bb5',
          orange: '#ff8c00',
          orangeDark: '#b86500',
          yellow: '#ffb703',
          red: '#e74c3c',
          gray: '#e4e7eb',
        },
      },
      fontFamily: {
        game: ['Fredoka', 'Comic Neue', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'skribbl': '0 6px 0 0 #08233d',
        'skribbl-btn': '0 4px 0 0 rgba(0, 0, 0, 0.25)',
        'skribbl-btn-active': '0 1px 0 0 rgba(0, 0, 0, 0.25)',
        'skribbl-green': '0 5px 0 0 #316d1f',
        'skribbl-blue': '0 5px 0 0 #004d99',
        'skribbl-orange': '0 5px 0 0 #b35900',
      },
      animation: {
        'pop': 'popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
