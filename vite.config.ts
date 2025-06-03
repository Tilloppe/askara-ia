import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Activer le Fast Refresh
      fastRefresh: true,
    }),
  ],
  server: {
    port: 5175,
    strictPort: true,
    open: true,
    hmr: {
      overlay: true,
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
