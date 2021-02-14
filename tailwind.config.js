const colors = require('tailwindcss/colors')

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
    },
  },
  variants: {},
  plugins: [],
}
