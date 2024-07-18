/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/member/**/*.{html,js}",
    "./views/trainer/**/*.{html,js}",
    "./views/admin/**/*.{html,js}",
    "./views/maps/**/*.{html,js}",
    "./views/features/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        customGray: '#343639',
        customOrange: '#EC7E4A',
    },},
  },
  plugins: [],
}
