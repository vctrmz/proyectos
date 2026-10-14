import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    /* Host de produccion, no localhost: asi los cargadores de analitica se
       prueban en la rama en la que de verdad se ejecutan. */
    environmentOptions: { jsdom: { url: 'https://proyectos-sable.vercel.app/' } },
    setupFiles: ['./test/setup.ts'],
    /* Las demos de demos/ son proyectos aparte, con sus propias dependencias y tests. */
    exclude: [...configDefaults.exclude, 'demos/**'],
    css: false,
    /* Las páginas completas (caso y sobre mí) montan decenas de componentes y
       en paralelo pasaban de los 5 s por defecto: fallaban por tiempo, no por
       contenido. */
    testTimeout: 30000,
  },
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
});
