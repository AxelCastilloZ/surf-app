/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        sand: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f4dbb0',
          300: '#ecc17e',
          400: '#e3a24b',
          500: '#db882a',
          600: '#cc6f1f',
          700: '#a9561b',
          800: '#88451d',
          900: '#6f3a1b',
          950: '#3c1c0c',
        },
        coral: {
          50: '#fff1f0',
          100: '#ffe0de',
          200: '#ffc7c3',
          300: '#ff9f99',
          400: '#ff6b62',
          500: '#f83d32',
          600: '#e52014',
          700: '#c1160b',
          800: '#9f160e',
          900: '#831912',
          950: '#470804',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
}
