import daisyui from "daisyui";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0967C2", // Dark Blue
        secondary: "#9333EA", // Purple
      
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#0967C2",
          secondary: "#9333EA",
      
          "base-100": "#FFFFFF", // Light theme background
        },
      },
      "light",       
      "dark",        
      "cupcake",     
      "bumblebee",   
      "emerald",     
      "corporate",   
      "synthwave",   
      "retro",       
      "valentine",   
      "halloween",   
      "acid"
    ],
  },
};
