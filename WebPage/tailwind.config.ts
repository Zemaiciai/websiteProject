import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "purple-background":
          "url('https://cdn.discordapp.com/attachments/1220465791078760540/1230259973892608020/rightSidePurple.png?ex=6632abe2&is=662036e2&hm=d928b03fe85cab33a2f1de4ed573a50aebd8070a380bda324d9ac9523011e0aa&')",
        "white-background":
          "url('https://cdn.discordapp.com/attachments/1220465791078760540/1230259974286868551/websiteBackground.png?ex=6632abe2&is=662036e2&hm=ebd5ad74c0eaf6d5469658f3b4d2f0a0e394f9d8fc49b4aea9b46600a74f6d5d&')",
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
