import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/rate-limit': {
        //target: 'http://localhost:3000',
        target: 'https://throttlex-2.onrender.com',
        changeOrigin: true,
      },
      '/api': {
        //target: 'http://localhost:3000',
        target: 'https://throttlex-2.onrender.com',
        changeOrigin: true,
      },
      '/actuator': {
        //target: 'http://localhost:3000',
        target: 'https://throttlex-2.onrender.com',
        changeOrigin: true,
      },
      '/health': {
        // target: 'http://localhost:3000',
        target: 'https://throttlex-2.onrender.com',
        changeOrigin: true,
      },
      '/metrics': {
        //target: 'http://localhost:3000',
        target: 'https://throttlex-2.onrender.com',
        changeOrigin: true,
      },
      '/admin': {
        //target: 'http://localhost:3000',
        target: 'https://throttlex-2.onrender.com',
        changeOrigin: true,
      },
      '/benchmark': {
        //target: 'http://localhost:3000',
        target: 'https://throttlex-2.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
