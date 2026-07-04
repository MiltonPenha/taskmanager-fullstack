import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./services/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        line: "#d8dee8",
        surface: "#f7f9fc",
        brand: {
          50: "#ecfdf6",
          100: "#d1fae6",
          500: "#10b981",
          600: "#059669",
          700: "#047857"
        }
      },
      boxShadow: {
        soft: "0 12px 40px rgba(23, 32, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

