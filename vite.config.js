import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

function includeExtraHTML() {
  const entries = {};

  // Include main pages
  const pagesDir = resolve(__dirname, "pages");
  fs.readdirSync(pagesDir).forEach(file => {
    if (file.endsWith(".html")) {
      const name = file.replace(".html", "");
      entries[name] = resolve(pagesDir, file);
    }
  });

  // Include template.html at root
  const templatePath = resolve(__dirname, "template.html");
  if (fs.existsSync(templatePath)) {
    entries["template"] = templatePath;
  }

  // Include page snippets in pages/content/ if needed
  const contentDir = resolve(pagesDir, "content");
  if (fs.existsSync(contentDir)) {
    fs.readdirSync(contentDir).forEach(file => {
      if (file.endsWith(".html")) {
        const name = `content-${file.replace(".html", "")}`;
        entries[name] = resolve(contentDir, file);
      }
    });
  }

  return entries;
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  appType: 'mpa',

  build: {
    rollupOptions: {
      input: includeExtraHTML(),
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