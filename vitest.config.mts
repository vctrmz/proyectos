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
    /* Las páginas completas (caso y sobre mí) montan decenas de componentes y
       en paralelo pasaban de los 5 s por defecto: fallaban por tiempo, no por
       contenido. */
    testTimeout: 30000,
  },
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
});
