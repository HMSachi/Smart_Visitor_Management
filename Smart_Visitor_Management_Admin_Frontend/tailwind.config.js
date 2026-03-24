/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mas-black': '#0F0F10',
        'mas-dark': '#121212',
        'mas-red': '#C8102E',
        'mas-gray': '#1C1C1E',
        'mas-border': 'rgba(255, 255, 255, 0.08)',
        'mas-text-dim': '#8E8E93',
      },
      borderRadius: {
        'none': '0',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

