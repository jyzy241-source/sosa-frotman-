import type { Config } from "tailwindcss";

// Tokens tomados de DESIGN.md — Sosa-Frotman Inversiones
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#2FC4A0", // Signal Teal
          deep: "#0E7A63",
          wash: "#E8F8F3",
        },
        ink: "#0B0B0B",
        snow: "#FFFFFF",
        mist: "#F5F7F6",
        silver: "#D7DCDA",
        steel: "#8A8F8D",
        graphite: "#4A4F4D",
        alert: "#C62828",
        amber: "#E08700",
      },
      fontFamily: {
        display: ["Barlow Condensed", "Oswald", "Saira", "sans-serif"],
        body: ["Inter", "Geist", "sans-serif"],
      },
      borderRadius: {
        btn: "8px",
        card: "16px",
        input: "8px",
        tag: "6px",
      },
    },
  },
  plugins: [],
} satisfies Config;
