import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Lato", "Cinzel"],
      },
      colors: {
        black50: '#00000050', 
        ownerGreen: '#90bb8e',
        renterBlue:'#1f8aba',
        renterBlue50:'#1f8aba70',
        inputWhite: '#F7F7F7',
      },
    },
  },
  plugins: [],
};
export default config;
