import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
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
                target: 'https://throttlex-2.onrender.com',
                changeOrigin: true,
            },
            '/api': {
                target: 'https://throttlex-2.onrender.com',
                changeOrigin: true,
            },
            '/actuator': {
                target: 'https://throttlex-2.onrender.com',
                changeOrigin: true,
            },
            '/health': {
                target: 'https://throttlex-2.onrender.com',
                changeOrigin: true,
            },
            '/metrics': {
                target: 'https://throttlex-2.onrender.com',
                changeOrigin: true,
            },
            '/admin': {
                target: 'https://throttlex-2.onrender.com',
                changeOrigin: true,
            },
            '/benchmark': {
                target: 'https://throttlex-2.onrender.com',
                changeOrigin: true,
            },
        },
    },
});
