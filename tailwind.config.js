/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        ink: '#0d0d0d',
        paper: '#f5f0e8',
        cream: '#ede8de',
        accent: '#c8522a',
        'accent-light': '#e8784f',
        muted: '#8a8070',
        'muted-light': '#b5aea0',
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
