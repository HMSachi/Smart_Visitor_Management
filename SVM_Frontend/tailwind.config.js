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
          low: 'var(--color-primary-low)',
        },
        'secondary': 'var(--color-secondary)',
        'background': {
          default: 'var(--color-bg-default)',
          paper: 'var(--color-bg-paper)',
          alt: 'var(--color-bg-alt)',
          elevated: 'var(--color-bg-elevated)',
        },
        'text': {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          dim: 'var(--color-text-dim)',
        },
        'border': {
          soft: 'var(--color-border-soft)',
          medium: 'var(--color-border-medium)',
        },
        'status': {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
          info: 'var(--color-info)',
        },
        // Mapping MAS names explicitly for full opacity support
        'mas-red': {
          DEFAULT: '#C8102E',
          glow: 'rgba(200, 16, 46, 0.4)',
          hover: '#A60D26',
        },
        'mas-black': '#000000',
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
