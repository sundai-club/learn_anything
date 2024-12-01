import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "space-mono": ['"Space Mono"', "monospace"],
        "fira-code": ['"Fira Code"', "monospace"],
      },
      colors: {
        // Professional color system with richer dark mode
        background: {
          light: "#FFFFFF",
          dark: "#0F172A", // Rich navy blue
        },
        surface: {
          light: "#F8FAFC",
          dark: "#1E293B", // Deep blue-grey
        },
        primary: {
          light: "#374151", // Muted grey for light mode
          dark: "#94A3B8", // Steel blue for dark mode
        },
        secondary: {
          light: "#1F2937", // Dark grey
          dark: "#E2E8F0", // Bright grey for contrast
        },
        accent: {
          light: "#4B5563", // Medium grey
          dark: "#64748B", // Slate blue for depth
        },
      },
      animation: {
        "scroll-vertical": "scroll-vertical 15s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        "scroll-vertical": {
          "0%": { "background-position": "50% 0%" },
          "100%": { "background-position": "50% 200%" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
