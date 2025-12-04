/** @type {import('tailwindcss').Config} */
module.exports = {
  // MUY IMPORTANTE: Le dice a Tailwind dónde buscar las clases.
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], 
  theme: {
    extend: {},
  },
  // SIMPLIFICACIÓN: Se elimina require("daisyui") porque se carga desde index.css.
  plugins: [],
};