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
        rose: {
          powder: "#E8C4C4",
          pastel: "#F5D0D0",
          soft: "#F8E1E1",
          deep: "#C45C5C",
          wine: "#8B3A3A",
        },
        cream: {
          DEFAULT: "#FDF8F5",
          warm: "#FAF3EE",
          soft: "#F5EDE6",
        },
        gold: {
          soft: "#D4AF37",
          light: "#E8D5A3",
          muted: "#C9A86C",
        },
        beige: {
          soft: "#F5E6D3",
          warm: "#EDE0D0",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        script: ["Dancing Script", "cursive"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(196, 92, 92, 0.08)",
        card: "0 8px 30px rgba(139, 58, 58, 0.1)",
        glow: "0 0 30px rgba(232, 196, 196, 0.4)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
