import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors:{
        customBlack: "#000101",
        customWhite: "#EEF3F5",
        customHover: "#191819",
        customBlue: "#1C9AF1",
        customSearch: "#212326",
      },

    },

  },
  plugins: [],
};
export default config;
