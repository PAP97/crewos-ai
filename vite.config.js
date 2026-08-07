import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/crewos-ai/', // Explicit GitHub Pages base path for repo pap97/crewos-ai
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});
