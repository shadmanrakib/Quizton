const colors = require('tailwindcss/colors')

module.exports = {
  theme: {
    purge: {
      enabled: true,
      content: [
        "./pages/**/*.js", "./pages/**/*.jsx", "./pages/**/*.ts", "./pages/**/*.tsx",
        "./components/**/*.js", "./components/**/*.jsx", "./components/**/*.ts", "./components/**/*.tsx"
      ]
    },
    darkMode: false, // or 'media' or 'class'
    extend: {
      colors: {
        'primary': "#2F80ED",
        'light-blue': colors.lightBlue,
        green: colors.green,
        emerald: colors.emerald,
        "cool-gray": colors.coolGray,
        "blue-gray": colors.blueGray,
      },
    },
  },
  variants: {},
  plugins: [],
}
