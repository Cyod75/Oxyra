// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'; // Soporte para importar SVG como ReactComponent
import tailwindcss from '@tailwindcss/vite'; // TailwindCSS para Vite

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),          // Importar SVG como componente React
    tailwindcss()    // TailwindCSS
  ],
});
