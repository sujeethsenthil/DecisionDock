import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1B2A4A",
        "dark-gray": "#333333",
        "med-gray": "#555555",
        "light-gray": "#F2F4F7",
        "border-gray": "#D0D5DD",
        blue: "#3B82F6",
        emerald: "#22C55E",
        amber: "#F59E0B",
        red: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "8px",
      },
      spacing: {
        "18": "4.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
