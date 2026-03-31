/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gold': '#C9A84C',
        'gold-light': '#E8C96A',
        'gold-dark': '#9A7B2C',
        'black-deep': '#0D0D0D',
        'black-card': '#141414',
        'ivory': '#FAF3E0',
        'burgundy': '#6B1A2A',
        'text-primary': '#FAF3E0',
        'text-muted': '#A89070',
      },
      fontFamily: {
        sans: ['Amiri', 'serif'],
        serif: ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
};
