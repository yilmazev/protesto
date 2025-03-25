import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      twitterChirp: ['--font-twitter-chirp', 'sans-serif']
    },
    colors: {
      primary: "#1d9bf0",
      blackPearl: "#15202b",
      spruce: "#38444d",
      haze: "#f7f9f9",
      stone: "#273340",
      fiord: "#3d5466",
      gray: "#8b98a5",
      porcelain: "#eff3f4",
      white: "#FFFFFF",
      transparent: "#0000"
    },
  },
  plugins: [],
};
export default config;
