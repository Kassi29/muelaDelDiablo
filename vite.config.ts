import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Los bundles van a /_app para no mezclarse con las imágenes de public/assets.
  build: { assetsDir: '_app' },
  server: {
    port: 5173,
    // /api/* lo atiende la Pages Function levantada con `wrangler pages dev` (npm run dev lo hace por ti).
    proxy: { '/api': { target: 'http://127.0.0.1:8788', changeOrigin: false } },
  },
});
