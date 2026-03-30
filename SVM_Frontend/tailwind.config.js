/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
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
      borderRadius: {
        'xl': '0',
        '2xl': '0',
        '3xl': '0',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'red-gradient': 'linear-gradient(135deg, #C8102E 0%, #000000 100%)',
      }
    },
  },
  plugins: [],
}
