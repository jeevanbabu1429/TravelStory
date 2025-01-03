/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"]
      },
      colors :{
        primary: "#05B6D3",
        secondary: "#EF863E",
      },
      backgroundImage: {
        'login-bg-img' : "url(./src/assets/naturebackground.jpeg)"
      }
    },
  },
  plugins: [],
}

