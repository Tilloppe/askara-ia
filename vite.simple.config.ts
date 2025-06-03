import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration minimale pour Vite
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    cors: true,
    fs: {
      strict: false,
      allow: ['..', '../..', '../../..'],
    },
    hmr: {
      overlay: false,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
