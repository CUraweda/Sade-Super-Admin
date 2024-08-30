
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xl2': {'min': '1400px'}
      }
    },
  },
  plugins: [require('daisyui')],
}

