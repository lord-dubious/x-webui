import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config = {
  darkMode: "class",
  content: ['./pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',],
  presets: [sharedConfig],

} satisfies Config;

export default config;
