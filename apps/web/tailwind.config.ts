import path from "path";
import { fileURLToPath } from "url";
import type { Config } from "tailwindcss";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));

// Tokens visuales definidos en DESIGN.md — Sosa-Frotman Inversiones
export default {
  content: [
    path.join(configDirectory, "index.html"),
    path.join(configDirectory, "src/**/*.{ts,tsx}"),
    path.join(configDirectory, "../../packages/ui/src/**/*.{ts,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#2FC4A0",
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
      fontSize: {
        micro: ["12px", { lineHeight: "1.45", letterSpacing: "0" }],
        caption: ["13px", { lineHeight: "1.45", letterSpacing: "0" }],
        "body-sm": ["14px", { lineHeight: "1.55", letterSpacing: "-0.005em" }],
        body: ["16px", { lineHeight: "1.6", letterSpacing: "-0.005em" }],
        "body-lg": ["18px", { lineHeight: "1.55", letterSpacing: "-0.01em" }],
        subheading: ["22px", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
        "heading-sm": ["30px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        heading: ["42px", { lineHeight: "1.12", letterSpacing: "-0.025em" }],
        display: ["60px", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
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