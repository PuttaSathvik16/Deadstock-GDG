import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#080A18",
        ink: {
          DEFAULT: "#080A18",
          deep: "#10184A",
          soft: "#11162C",
          surface: "#181D38",
          border: "rgba(255, 255, 255, 0.09)",
          hairline: "rgba(77, 116, 255, 0.2)",
        },
        cobalt: {
          DEFAULT: "#263CFF",
          electric: "#4D74FF",
          lavender: "#9097FF",
          hover: "#3B54FF",
          dim: "#1C2CB8",
        },
        yellow: {
          DEFAULT: "#F2FF55",
          fluorescent: "#F2FF55",
          hover: "#E4F23D",
          dim: "#B8C425",
        },
        lime: {
          DEFAULT: "#F2FF55", // Aliased to Fluorescent Yellow per spec
          hover: "#E4F23D",
          dim: "#C7FF3D",
        },
        bone: {
          DEFAULT: "#F7F7EE",
          paper: "#F1F0E8",
          muted: "#D5D5C8",
          dark: "#A3A398",
        },
        charcoal: "#151515",
        terracotta: {
          DEFAULT: "#E66A45",
          hover: "#D65934",
          dim: "#B04222",
        },
        mint: {
          DEFAULT: "#2EE59D",
          dim: "#1EB87C",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        scanline: {
          "0%": { top: "0%", opacity: "0.8" },
          "50%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0.2" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.15)" },
        },
        tracePulse: {
          "0%, 100%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "24" },
        },
      },
      animation: {
        scanline: "scanline 2.8s ease-in-out infinite",
        pulseGlow: "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        traceFlow: "tracePulse 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
