const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'light-blue': colors.lightBlue,
        green: colors.green,
        emerald: colors.emerald,
        "cool-gray": colors.coolGray,
        "blue-gray": colors.blueGray,
        "brand-1": "#1A74E2",
        "brand-2": "#3FA0EF",
        "brand-3" : "#6BD0FF",
        "brand-4": "#1F2123",
        "brand-5": "#101010"
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

