import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#1F2028",
        "brand-alt-blue": "#34353c",
        "slightly-lighter-dark-blue": "#2E3039",
        "brand-orange": "#F38016",
        "body-white": "#DADADA",
      },
      fontFamily: {
        heading: ['"Libre Baskerville"', "sans-serif"],
        body: ['"Source Sans 3"', "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("autoprefixer"),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
} satisfies Config;
