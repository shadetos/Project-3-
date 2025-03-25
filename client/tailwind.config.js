// tailwind.config.js
module.exports = {
  content: [
    "./index.html",                
    "./src/**/*.{js,jsx,ts,tsx}"     // Include all JS/TS/JSX/TSX files in src
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FB2C2C",        // Red (Primary)
        "orange-brand": "#EA910A", // Orange
        "yellow-brand": "#FEE04A", // Yellow
        "gray-light": "#F5F5F5",
        "gray-dark": "#333333",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      spacing: {
        sm: "0.5rem",
        md: "1rem",
        lg: "2rem",
      },
    },
  },
  plugins: []
};

/* Button Samples:
   Primary Button:
   <button class="bg-primary hover:bg-red-600 text-white font-semibold py-sm px-md rounded">
     Primary Action
   </button>

   Secondary Button:
   <button class="bg-orange-brand hover:bg-orange-600 text-white font-semibold py-sm px-md rounded">
     Secondary Action
   </button>

   Tertiary (Info) Button:
   <button class="bg-yellow-brand hover:bg-yellow-400 text-gray-dark font-semibold py-sm px-md rounded">
     Info
   </button>
*/
