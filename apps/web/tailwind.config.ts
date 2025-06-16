import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
import sharedConfig from "@repo/tailwind-config";

const config = withUt({
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        customBlack: "#000000",
        customWhite: "#FFFFFF",
        customHover: "#1A1A1A",
        customPurple: "#8B5CF6",
        customPurpleDark: "#7C3AED",
        customPurpleLight: "#A78BFA",
        customSearch: "#1A1A1A",
        customAccent: "#8B5CF6",
        // Legacy support
        customBlue: "#8B5CF6",
      },
    },
  },
  // Import the shared preset so its settings (like backgroundImage) are merged in.
  presets: [sharedConfig],
}) satisfies Config;

export default config;
