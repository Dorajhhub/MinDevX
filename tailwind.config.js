/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... rest of your config
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 이 경로가 정확해야 스타일을 스캔합니다.
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        width: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "100%",
          },
        },
        "tracking-in": {
          "0%": {
            "letter-spacing": "1em",
            opacity: "0",
          },
          "40%": {
            opacity: ".6",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 1s ease-in-out forwards",
        "bounce-slow": "bounce-slow 2s infinite",
        width: "width 2s ease-in-out forwards",
        "tracking-in": "tracking-in 1s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
