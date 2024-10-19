/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        /* Custom scrollbar styling for WebKit browsers (Chrome, Safari) */
        ".scrollbar-thin": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#131921",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#374151",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
