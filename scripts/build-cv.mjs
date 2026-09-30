/*
 * Imprime los dos CV a PDF con el Chromium de Playwright.
 *
 * Cada idioma tiene su fuente en `scripts/cv/cv-<idioma>.html` y comparten
 * `scripts/cv/cv.css`. Hasta el 30-09 el español se imprimía a mano desde el
 * navegador, así que corregir una línea obligaba a repetir el ritual; ahora
 * los dos se regeneran con `npm run cv`.
 *
 * `preferCSSPageSize` manda: el tamaño y los márgenes los decide la regla
 * @page de cv.css, no este script, para que abrir el HTML en el navegador se
 * parezca a lo que sale impreso.
 */
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { statSync } from 'node:fs';

const CVS = [
  { lang: 'es', fuente: 'scripts/cv/cv-es.html', salida: 'public/victor-maza-cv.pdf' },
  { lang: 'en', fuente: 'scripts/cv/cv-en.html', salida: 'public/victor-maza-cv-en.pdf' },
];

const navegador = await chromium.launch();
for (const { lang, fuente, salida } of CVS) {
  const pagina = await navegador.newPage();
  await pagina.goto(pathToFileURL(resolve(fuente)).href, { waitUntil: 'load' });
  await pagina.emulateMedia({ media: 'print' });
  await pagina.pdf({ path: resolve(salida), printBackground: true, preferCSSPageSize: true });
  await pagina.close();
  const kb = Math.round(statSync(resolve(salida)).size / 1024);
  console.log(`${salida} · ${kb} KB  →  SITE.cv.${lang}.kb debe decir ${kb}; hay un test que lo comprueba.`);
}
await navegador.close();
