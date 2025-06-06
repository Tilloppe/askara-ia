import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Configuration de base de React
    }),
  ],
  server: {
    port: 3002,
    strictPort: true,
    open: true,
    cors: true,
    hmr: {
      port: 3002,
      protocol: 'ws',
      overlay: false,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          chakra: ['@chakra-ui/react', '@chakra-ui/icons', '@emotion/react', '@emotion/styled', 'framer-motion'],
          utils: ['jspdf', 'html2canvas'],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@chakra-ui/react',
      '@chakra-ui/icons',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
    ],
    exclude: ['jspdf', 'html2canvas'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
