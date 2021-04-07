const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    purge: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"], 
    darkMode: false, // or 'media' or 'class'
    extend: {
      colors: {
        'primary': "#2F80ED",
        'light-blue': colors.lightBlue,
        'light-': colors.lightBlue,
        green: colors.green,
        emerald: colors.emerald,
        "cool-gray": colors.coolGray,
        "blue-gray": colors.blueGray,
      },
      // fontFamily: {
      //   sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      // },
    },
  },
  variants: {},
  plugins: [],
}
