import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ghana: {
          gold: "#D4AF37",
          goldHover: "#B89628",
          green: "#0B6623",
          greenDark: "#084719",
          red: "#C41E3A",
          dark: "#1A1A1A",
          surface: "#FDFBF7",
          sand: "#F4EDE2",
          border: "#E6DEC5",
        },
      },
    },
  },
  plugins: [],
};
export default config;

