import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './', // Relative base path ensures seamless loading on GitHub Pages and local builds
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});
