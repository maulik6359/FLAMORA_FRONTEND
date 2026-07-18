/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ivory: "#FBF8F3",
        cream: "#F4EEE3",
        onyx: "#0C1210",
        noir: "#080B0A",
        emerald: {
          DEFAULT: "#04471C",
          deep: "#02291E",
          vault: "#011A12",
        },
        gold: {
          DEFAULT: "#C9A961",
          soft: "#E5C158",
          bright: "#F0D89A",
          muted: "#8A7643",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 20px 60px -20px rgba(201, 169, 97, 0.35)",
        luxury: "0 40px 80px -30px rgba(0, 0, 0, 0.55)",
      },
    },
  },
  plugins: [],
};
