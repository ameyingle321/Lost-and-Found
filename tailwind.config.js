/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        card: "#0D0D0D",
        border: "rgba(255, 255, 255, 0.08)",
        purple: "#9D59FF",
        pink: "#FF59D8",
      },
      backgroundImage: {
        "claro-gradient": "linear-gradient(to right, #9D59FF, #FF59D8)",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
}
