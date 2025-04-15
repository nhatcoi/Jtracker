import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            src: path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5174,
        strictPort: true,
        allowedHosts: ['.ngrok-free.app'],
    },

    build: {
        outDir: 'dist',
    },
    preview: {
        port: 4173,
        strictPort: true,
    }
});