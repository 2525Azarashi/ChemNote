import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    // Inline assets smaller than 2MB (including our 1.1MB BGM), but never inline
    // webfonts. KaTeX ships woff2/woff/ttf for every math face; base64-inlining
    // them would add ~1.5MB to the render-blocking CSS even though the browser
    // only ever downloads the woff2 it needs.
    assetsInlineLimit: (filePath: string, content: Buffer) => {
      if (/\.(woff2?|ttf|otf|eot)$/i.test(filePath)) return false;
      return content.length < 2000000;
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
