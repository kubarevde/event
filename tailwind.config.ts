import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Фирменные цвета задаются в админке и приходят CSS-переменными (см. app/layout.tsx)
        "tgu-brand": "rgb(var(--brand) / <alpha-value>)",
        "tgu-brand-dark": "rgb(var(--brand-dark) / <alpha-value>)",
        "tgu-brand-light": "rgb(var(--brand-light) / <alpha-value>)",
        "tgu-dark": "#0A1628",
        "tgu-dark-elevated": "#122033",
        "tgu-mid": "#1A2D42",
        "tgu-light": "#F8FAFC",
        "tgu-surface": "#FFFFFF",
        "tgu-text": "#F1F5F9",
        "tgu-muted": "#94A3B8",
        "tgu-dark-text": "#0F1724",
        "tgu-ink-secondary": "#475569",
        "tgu-border": "#E2E8F0",
        "tgu-warm": "#9A7B4F",
      },
      fontFamily: {
        heading: ["var(--font-ibm-plex)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 23 36 / 0.06), 0 1px 2px -1px rgb(15 23 36 / 0.06)",
        "card-hover":
          "0 4px 12px 0 rgb(15 23 36 / 0.08), 0 2px 4px -2px rgb(15 23 36 / 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
