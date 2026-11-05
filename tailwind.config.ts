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
        app: {
          bg: "var(--bg)",
          card: "var(--card)",
          ink: "var(--ink)",
          mut: "var(--mut)",
          line: "var(--line)",
          acc: "var(--acc)",
          grn: "var(--grn)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
