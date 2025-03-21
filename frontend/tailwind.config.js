/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        "arabic": ['"Amiri"', 'serif'], 
        poppins: ["Poppins", "sans-serif"],
        
    },
    colors: {
      'Blue1': '#2e51af',
    },

    darkMode: 'class', // Enable dark mode with a class
    content: ["./src/**/*.{js,jsx,ts,tsx}"],

    theme: {
      extend: {},
    },

  },
},
  plugins: [require('@tailwindcss/typography')],
}