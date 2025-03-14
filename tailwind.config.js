import daisyui from "daisyui";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF", // Dark Blue
        secondary: "#9333EA", // Purple
        accent: "#FACC15", // Yellow
        neutral: "#1F2937", // Dark Gray
        info: "#3B82F6", // Light Blue
        success: "#10B981", // Green
        warning: "#F59E0B", // Orange
        error: "#EF4444", // Red
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#1E40AF",
          secondary: "#9333EA",
          accent: "#FACC15",
          neutral: "#1F2937",
          info: "#3B82F6",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
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
