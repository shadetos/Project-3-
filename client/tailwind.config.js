module.exports = {
    // Tells Tailwind where to look for class names
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Add more paths if needed
    ],
    theme: {
      extend: {
        colors: {
          // Example custom colors:
          primary: "#FF9800",
          'primary-dark': "#BF6E00",
          secondary: "#03A9F4",
        },
        spacing: {
          // Example spacing tokens:
          sm: "0.5rem",
          md: "1rem",
          lg: "2rem",
        },
        fontFamily: {
          // Example custom font family:
          base: ["Roboto", "sans-serif"],
        },
      },
    },
    plugins: [],
  };