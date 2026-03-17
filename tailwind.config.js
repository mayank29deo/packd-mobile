/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'packd-bg':      '#0A0A0A',
        'packd-card':    '#111111',
        'packd-card2':   '#181818',
        'packd-border':  '#2A2A2A',
        'packd-text':    '#E8E8E8',
        'packd-gray':    '#888888',
        'packd-orange':  '#E8451A',
        'packd-orange-light': '#FF6B3D',
        'packd-green':   '#3FB950',
        'packd-gold':    '#F0B429',
      },
    },
  },
  plugins: [],
};
