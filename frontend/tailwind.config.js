/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",  // हिरवा रंग GramPulse साठी
        secondary: "#059669",
      },
    },
  },
  plugins: [],
}