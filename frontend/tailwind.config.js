/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/member/**/*.{html,js}",
    "./views/trainer/**/*.{html,js}",
    "./views/admin/**/*.{html,js}",
    "./views/maps/**/*.{html,js}",
    "./views/features/**/*.{html,js}",
    "./views/Landing Page/**/*.{html,js}",
    "./scripts/map.js",
  ],
  theme: {
<<<<<<< HEAD

    colors: {
      50: '#EC7E4A',
      51: '#343639',
      52: '#FFFFFF',
      'custom-bg': '#323538',
      'custom-border': '#EC7E4A',
      guestNavbar: '#232121',
      forGradientGray: '#232323',
      'forGradientWhite': '#898787',
      customGray: '#343639',
      customOrange: '#EC7E4A',
    },
=======
>>>>>>> 809a4c8164e2d615669cdf33e5109d825a5f1141
    extend: {
      fontFamily:{
        customFont: ['"Aldrich"', "sans-serif"],
        customFont2:['"Montserrat"', "sans-serif"]
      },
<<<<<<< HEAD
    },
=======
      colors: {
        customGray: '#343639',
        customOrange: '#EC7E4A',
        50: '#EC7E4A',
        51: '#343639',
        52: '#FFFFFF',
        'custom-bg': '#323538',
        'custom-border': '#EC7E4A',
        'customGray': '#343639',
        customOrange: '#EC7E4A',
        guestNavbar: '#232121',
        forGradientGray: '#232323',
        'forGradientWhite': '#898787',
    },},
>>>>>>> 809a4c8164e2d615669cdf33e5109d825a5f1141
  },
  plugins: [],
}
