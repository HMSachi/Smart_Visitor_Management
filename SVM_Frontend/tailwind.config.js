/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          glow: 'var(--color-primary-glow)',
        },
        'secondary': 'var(--color-secondary)',
        'bg': {
          DEFAULT: 'var(--color-bg-default)',
          paper: 'var(--color-bg-paper)',
        },
        'mas-red': {
          DEFAULT: '#C8102E',
          glow: 'rgba(200, 16, 46, 0.4)',
          hover: '#A60D26',
        },
        'mas-black': '#000000',
        'mas-dark': {
          900: '#0A0A0B',
          800: '#121214',
          700: '#1A1A1C',
        },
        'mas-text-dim': '#888888',
      },
      fontFamily: {
        ans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-slow': 'fadeIn 1s ease-out forwards',
        'slide-in-right': 'slideInRight 0.5s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'red-gradient': 'linear-gradient(135deg, #C8102E 0%, #000000 100%)',
      }
    },
  },
  plugins: [],
}
