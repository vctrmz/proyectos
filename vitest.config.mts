import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'https://proyectos-theta-hazel.vercel.app/' } },
    setupFiles: ['./test/setup.ts'],
    css: false,
  },
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
});
