module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        slideIn: "slideIn 1s ease-in-out",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(300%)" },
          "50%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
    },
  },
  plugins: [],
};
