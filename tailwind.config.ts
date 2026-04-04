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
        kinex: {
          primary: "#085F63",
          "primary-deep": "#00595c",
          container: "#0d7377",
          "on-surface": "#1a1f1f",
          "on-surface-variant": "#3e4949",
          muted: "#6b7280",
          surface: "#f8f9fa",
          "surface-low": "#f3f4f5",
          "surface-alt": "#F9FAFB",
          badge: "#e0f2f3",
          outline: "#bec9c9",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ambient:
          "0 24px 48px -12px rgba(8, 95, 99, 0.08), 0 12px 24px -8px rgba(8, 95, 99, 0.06)",
        card: "0 20px 50px -20px rgba(8, 95, 99, 0.12)",
        nav: "0 8px 32px -8px rgba(8, 95, 99, 0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
