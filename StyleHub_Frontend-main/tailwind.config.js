/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'red-primary-color': '#f43f5e',
        'primary-color': '#7c3aed', // Modern Violet
        'secondary-color': '#f43f5e', // Modern Rose
      },
    },
  },
  plugins: [],
}