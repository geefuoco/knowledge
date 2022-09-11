/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        profile: "90px",
      },
    },
    screens: {
      phone: "450px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
