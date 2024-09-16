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
        darkCharcoal: '#333333',
        davysGrey: '#555555',
        eerieBlack: '#191919',
        borderStroke: '#464646',
    },},
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
