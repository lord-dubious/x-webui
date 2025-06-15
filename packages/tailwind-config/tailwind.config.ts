import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors:{
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
  plugins: [],
};
export default config;
