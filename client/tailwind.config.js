/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // custom: ["Poppins"],
        poppins: ["Poppins"],
        roboto : ["Roboto"],
        inter : ["Inter"]
      },
    },
  },
  plugins: [],
}
