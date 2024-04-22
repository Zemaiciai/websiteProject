import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "purple-background": "url('app/public/images/purple-background.png')",
        "white-background": "url('app/public/images/white-background.png')",
      },
      colors: {
        custom: {
          900: "#1d1d41", //admin panel menu
          850: "#28274f", // admin panel menu
          800: "#3b3974",
          100: "#f8f8f8", // website background
          200: "#ffffff", //holder background
        },
        warnings: {
          100: "#142d00", // green bg
          150: "#52b601", // green border
          200: "#eca604", // yellow bg
          250: "#fbcb5b", // yellow border
          300: "#fc4f89", // red bg
          350: "#ad2552", // reg border
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;
