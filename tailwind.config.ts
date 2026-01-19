import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFEF7",
        navy: {
          DEFAULT: "#1E3A5F",
          light: "#2C5282",
          dark: "#152A45",
        },
        money: {
          DEFAULT: "#2D8F4E",
          light: "#38A169",
          dark: "#256D3B",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E5C158",
          dark: "#B8962E",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Senior-friendly minimum sizes
        base: ["20px", "1.6"],
        lg: ["22px", "1.6"],
        xl: ["24px", "1.5"],
        "2xl": ["28px", "1.4"],
        "3xl": ["32px", "1.3"],
        "4xl": ["40px", "1.2"],
        "5xl": ["48px", "1.1"],
      },
    },
  },
  plugins: [],
};

export default config;
