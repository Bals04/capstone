/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/member/**/*.{html,js}",
    "./views/trainer/**/*.{html,js}",
    "./views/admin/**/*.{html,js}",
    "./views/maps/**/*.{html,js}",
    "./views/features/**/*.{html,js}",
    "./scripts/map.js"
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#343639',
        customOrange: '#EC7E4A',
        customBodyColor: '#1E1E1E',
        customGrayBtn: '#232121',
        customGray1: '#584D4A',
    },},
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
