import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";
import sharedConfig from "@repo/tailwind-config";

const config = withUt({
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlack: "#000101",
        customWhite: "#EEF3F5",
        customHover: "#191819",
        customBlue: "#1C9AF1",
        customSearch: "#212326",
      },
    },
  },
  // Import the shared preset so its settings (like backgroundImage) are merged in.
  presets: [sharedConfig],
}) satisfies Config;

export default config;
