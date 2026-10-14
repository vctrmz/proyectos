import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/* base relativa: el build se puede servir desde cualquier subruta
   (preview de Vercel, artifact o un USB el día de la presentación). */
export default defineConfig({
  base: './',
  plugins: [react()],
  /* ProseMirror + React pesan ~700 kB; para una demo de presentación no
     compensa trocear el bundle. */
  build: { chunkSizeWarningLimit: 900 },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    css: false,
  },
});
