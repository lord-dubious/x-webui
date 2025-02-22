import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customBlue: "#1C9AF1",
      },
    },
  },
  presets:[sharedConfig],
  plugins: [],
} satisfies Config;
