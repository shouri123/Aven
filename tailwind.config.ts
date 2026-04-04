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
        primary: "#163526",
        secondary: "#446a74",
        tertiary: "#accfb8",
        background: "#fbf9f5",
        "background-soft": "#fbf9f5",
        surface: "#ffffff",
        "on-surface": "#163526",
        "on-surface-variant": "#446a74",
        "outline-variant": "#e2e8e4",
        "surface-container-highest": "#e8efe9",
        "surface-container-high": "#ecf3ed",
        "surface-container": "#f0f6f1",
        "surface-container-low": "#f4f9f5",
        "surface-container-lowest": "#ffffff",
        "accent-green": "#accfb8",
        "error-soft": "#fef2f2",
        "error-text": "#991b1b",
        error: "#ba1a1a"
      },
      borderRadius: {
        DEFAULT: "1.5rem",
        lg: "2.5rem",
        xl: "3.5rem",
        full: "9999px"
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        label: ["Inter", "sans-serif"],
        outfit: ["Outfit", "sans-serif"]
      }
    },
  },
  plugins: [],
};

export default config;
