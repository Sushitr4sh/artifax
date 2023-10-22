/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs,js}"],
  theme: {
    extend: {
      colors: {
        dark: "#05051e",
        dark2: "#080823",
        accentLight: "#21213b",
        accentLight2: "#52546e",
        accentLight3: "#b4b9cf",
      },
    },
  },
};
