/*
 * Imprime el CV en inglés a PDF con el Chromium de Playwright.
 *
 * El CV español se imprimió a mano desde el navegador (el PDF lo delata:
 * Skia/PDF, agente de Chrome), así que corregir una línea obligaba a repetir
 * el mismo ritual a mano. Este tiene su fuente en `scripts/cv/cv-en.html` y se
 * regenera con `npm run cv`.
 *
 * `preferCSSPageSize` manda: el tamaño y los márgenes los decide la regla
 * @page del propio HTML, no este script, para que abrir el HTML en el
 * navegador se parezca a lo que sale impreso.
 */
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { statSync } from 'node:fs';

const FUENTE = resolve('scripts/cv/cv-en.html');
const SALIDA = resolve('public/victor-maza-cv-en.pdf');

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.goto(pathToFileURL(FUENTE).href, { waitUntil: 'load' });
await pagina.emulateMedia({ media: 'print' });
await pagina.pdf({ path: SALIDA, printBackground: true, preferCSSPageSize: true });
await navegador.close();

const kb = Math.round(statSync(SALIDA).size / 1024);
console.log(`${SALIDA} · ${kb} KB`);
console.log(`Recuerda: SITE.cv.en.kb debe decir ${kb}; hay un test que lo comprueba.`);
