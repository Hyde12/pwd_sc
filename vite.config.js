import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  appType: 'mpa',

  build: {
    rollupOptions: {
      input: {
        verification: resolve(__dirname, 'pages/verification.html'),
        add_holders: resolve(__dirname, 'pages/add-holders.html'),
        see_holders: resolve(__dirname, 'pages/see-holders.html'),
      },
    },
    outDir: 'dist',
  },
  plugins: [
    tailwindcss(),
    {
      name: 'clean-urls',
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            const originalUrl = req.url;
            
            // Skip if it's a file request (has extension) or Vite internal
            if (!originalUrl || 
                originalUrl.includes('.') || 
                originalUrl.startsWith('/@') ||
                originalUrl === '/') {
              return next();
            }

            // Clean the URL (remove query parameters and hash)
            const cleanUrl = originalUrl.split('?')[0].split('#')[0];
            
            // Check if this corresponds to a page
            const pagePath = resolve(__dirname, `pages${cleanUrl}.html`);
            
            if (fs.existsSync(pagePath)) {
              req.url = `/pages${cleanUrl}.html`;
            }
            
            next();
          });
        };
      }
    }
  ],

  server: {
    open: '/verification',
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})