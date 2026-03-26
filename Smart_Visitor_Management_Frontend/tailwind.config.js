/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'mas-red': '#C8102E',
        'mas-black': '#000000',
        'mas-dark': '#0F0F10',
        'mas-gray': '#1A1A1A',
        'mas-border': 'rgba(255, 255, 255, 0.05)',
        'mas-text-dim': '#888888',
        'charcoal': {
            800: '#121212',
            900: '#0F0F10',
        }
      },
      fontFamily: {
        ans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'none': '0',
        'sm': '0',
        'DEFAULT': '0',
        'md': '0',
        'lg': '0',
        'xl': '0',
        '2xl': '0',
        '3xl': '0',
        'full': '0',
      }
    },
  },
  plugins: [],
}

