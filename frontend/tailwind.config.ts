import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F3",
        beige: "#F0E4D3",
        tan: "#DCC5B2",
        blush: "#FFEAEA",
        charcoal: "#212121",
      },
    },
  },
  plugins: [],
};

export default config;
