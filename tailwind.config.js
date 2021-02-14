const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    purge: ['./pages/**/*.js', './components/**/*.js'], 
    darkMode: false, // or 'media' or 'class'
    extend: {
      colors: {
        'primary': "#2F80ED",
        'light-blue': colors.lightBlue,
        cyan: colors.cyan,
        orange: colors.orange,
        blueGray: colors.blueGray,
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {},
  plugins: [],
}
