/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    colors: {
      'Blue1': '#2e51af',
      'blue' :'#064979'
    },

    darkMode: 'class', // Enable dark mode with a class
    content: ["./src/**/*.{js,jsx,ts,tsx}"],

    theme: {
      extend: {},
    },

  },
},
  plugins: [],
}