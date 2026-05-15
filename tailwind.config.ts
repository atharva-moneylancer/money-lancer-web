import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Manrope", "system-ui", "sans-serif"],
      },
      colors: {
        // Brand
        crayola: "#1675F4",
        yale: "#0B3B7A",
        navy: "#08234A",   // deeper Yale Blue used for hero bg
        electric: "#64E9EE",
        spring: "#40F99B",
        gold: "#FFD700",
        // Neutrals
        ink: "#0F1729",
        graphite: "#333333",
        slate1: "#555555",
        slate2: "#808080",
        mist: "#D4D4D4",
        cloud: "#FAFCFF",
        // Status
        success: "#31783E",
        warning: "#CB8400",
        critical: "#CC6666",
      },
      backgroundImage: {
        "mesh-hero":
          "radial-gradient(at 12% 18%, #1675F4 0%, transparent 38%), radial-gradient(at 88% 0%, #64E9EE 0%, transparent 32%), radial-gradient(at 75% 80%, #0B3B7A 0%, transparent 50%), linear-gradient(180deg, #08234A 0%, #0B3B7A 100%)",
        "mesh-soft":
          "radial-gradient(at 0% 0%, rgba(22,117,244,0.10) 0%, transparent 40%), radial-gradient(at 100% 0%, rgba(100,233,238,0.18) 0%, transparent 40%), linear-gradient(180deg, #FAFCFF 0%, #FFFFFF 100%)",
        "grid-soft":
          "linear-gradient(rgba(11,59,122,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(11,59,122,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        soft: "0 2px 4px rgba(0,0,0,0.04)",
        medium: "0 2px 8px rgba(0,0,0,0.04)",
        lift: "0 8px 30px rgba(11,59,122,0.10)",
        glow: "0 0 0 1px rgba(22,117,244,0.20), 0 16px 48px -12px rgba(22,117,244,0.35)",
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },
      fontSize: {
        "display": ["clamp(3rem, 7vw, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "headline": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "title-l": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "title-m": ["1.5rem", { lineHeight: "1.2" }],
        "title-s": ["1.125rem", { lineHeight: "1.35" }],
        "body-l": ["1.125rem", { lineHeight: "1.55" }],
        "body-m": ["1rem", { lineHeight: "1.55" }],
        "body-s": ["0.875rem", { lineHeight: "1.55" }],
        "label": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.04em" }],
      },
      animation: {
        "float-slow": "float 14s ease-in-out infinite",
        "float-slower": "float 22s ease-in-out infinite",
        "spin-slow": "spin 38s linear infinite",
        "pulse-soft": "pulse-soft 3.5s ease-in-out infinite",
        marquee: "marquee linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-30px) translateX(20px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [
    // Hide scrollbars while keeping scroll functionality (for horizontal pill rows)
    function ({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    },
  ],
};
export default config;
