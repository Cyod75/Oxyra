import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    svgr(),

    VitePWA({
      registerType: 'prompt', // Muestra "Nueva versión disponible" en vez de recargar solo
      injectRegister: 'auto',

      // Solo incluimos los iconos esenciales
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'mask-icon.svg'
      ],

      manifest: {
        name: 'Oxyra Fitness',
        short_name: 'Oxyra',
        description: 'Tu entrenador personal premium',
        
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait', // Bloquea rotación (ideal para gym)

        theme_color: '#0a0a0a',
        background_color: '#000000', // Evita pantallazo blanco al abrir

        lang: 'es-ES',
        categories: ['fitness', 'health', 'sports'],

        // Iconos (Asegúrate de tener estos dos archivos en /public)
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
        cleanupOutdatedCaches: true,
        // Eliminado navigateFallback porque borramos offline.html
        
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],

        runtimeCaching: [
          // Cachear IMÁGENES para que carguen rápido
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Días
              }
            }
          },

          // API BACKEND (NetworkFirst: Intenta internet, si falla, usa caché)
          {
            urlPattern: /\/api\//, 
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 3, // Espera 3 segs, si no, da caché
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 día
              }
            }
          },

          // Cachear FUENTES (Google Fonts, etc)
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 Año
              }
            }
          }
        ]
      },

      devOptions: {
        enabled: true // Permite probar la PWA en "npm run dev"
      }
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom']
        }
      }
    }
  },

  server: {
    port: 5173,
    open: true
  }
});