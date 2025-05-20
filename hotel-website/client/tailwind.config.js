/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B3954",
        secondary: "#087E8B",
        accent: "#FF5A5F",
        light: "#F5F5F5",
        dark: "#333333",
      },
    },
  },
  plugins: [],
}
