// External Imports
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  darkMode: ["class"],

  prefix: "",

  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },

    screens: {
      xxs: "324px",
      xs: "356px",
      sm: "400px",
      smd: "532px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
      "2xl": "1800px",
    },

    extend: {
      colors: {},
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addVariant }) {
      addVariant("trigger", [
        "@media (min-width: 976px) { &:hover }",
        "&:active",
      ]);
      addVariant("group-trigger", [
        ":merge(.group):active &",
        "@media (min-width: 976px) { :merge(.group):hover & }",
      ]);
      addVariant("peer-trigger", [
        ":merge(.peer):active ~ &",
        "@media (min-width: 976px) { :merge(.peer):lg:hover ~ & }",
      ]);
    }),
  ],
} satisfies Config;
