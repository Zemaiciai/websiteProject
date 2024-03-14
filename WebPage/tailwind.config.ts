import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        custom: {
          900: "#1d1d41", //admin panel menu
          850: "#28274f", // admin panel menu
          800: "#3b3974",
          100: "#f8f8f8", // website background
          200: "#ffffff" //holder background
        }
      }
    }
  },
  plugins: []
} satisfies Config;
