import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B",
        base: "#0A0A0B",
        sidebar: "#0F0F12",
        card: "#16161A",
        surface: {
          1: "#0F0F12",
          2: "#16161A",
          3: "#1C1C22",
          4: "#24242C",
        },
        border: "#1E1E24",
        hairline: "rgba(255,255,255,0.06)",
        primary: {
          DEFAULT: "#8B5CF6",
          strong: "#7C3AED",
          soft: "rgba(139,92,246,0.14)",
        },
        accent: {
          DEFAULT: "#3B82F6",
          purple: "#7C3AED",
          "purple-light": "#9F67FF",
          blue: "#3B82F6",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#F43F5E",
        info: "#0EA5E9",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "24px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.4)",
        md: "0 6px 20px -6px rgba(0,0,0,0.55)",
        lg: "0 18px 50px -12px rgba(0,0,0,0.7)",
        glow: "0 0 0 1px rgba(139,92,246,0.35), 0 10px 40px -10px rgba(139,92,246,0.45)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-in": "scale-in 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
