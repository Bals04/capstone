/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/member/**/*.{html,js}",
    "./views/trainer/**/*.{html,js}",
    "./views/admin/**/*.{html,js}",
    "./views/maps/**/*.{html,js}",
    "./views/features/**/*.{html,js}",
    "./views/Landing Page/**/*.{html,js}",
    "./views/gym admin/**/*.{html,js}",
    "./scripts/map.js",

  ],
  theme: {
    extend: {
      fontFamily:{
        customFont: ['"Aldrich"', "sans-serif"],
        customFont2:['"Montserrat"', "sans-serif"]
      },
      colors: {
        50: '#EC7E4A',
        51: '#343639',
        52: '#FFFFFF',
        div_color: '#373D41',
        border_color: '#464646',
        'custom-bg': '#323538',
        'custom-border': '#EC7E4A',
        guestNavbar: '#232121',
        forGradientGray: '#232323',
        'forGradientWhite': '#898787',
        customGray: '#343639',
        customOrange: '#EC7E4A',
      },
    },
  },
  plugins: [],
}
