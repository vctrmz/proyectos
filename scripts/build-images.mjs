import sharp from 'sharp';
import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

/* Fuentes de imagen del portfolio. Las dos primeras son las exportaciones de
   Figma de HERMES; el resto son las capturas de cada caso, que viven en la
   carpeta hermana portfolio-export y entran con prefijo para no chocar de
   nombre (ayax-home, flesip-pagos…). Salida: WebP ≤ 1600 px + manifest.
   Las carpetas que no existan se saltan: el build no depende de tenerlas. */
const SOURCES = [
  { dir: 'public/assets/hermes', prefix: '' },
  { dir: 'public/assets/h-card', prefix: '' },
  { dir: '../portfolio-export/ayax/img', prefix: 'ayax-' },
  { dir: '../portfolio-export/hermes/img', prefix: 'hx-' },
  { dir: '../portfolio-export/flesip/img', prefix: 'flesip-' },
  { dir: '../portfolio-export/montsaint/img', prefix: 'ms-' },
  { dir: '../portfolio-export/mercantil/img', prefix: 'mb-' },
  { dir: '../portfolio-export/web/img', prefix: 'web-' },
];
/* Fuentes que existen en portfolio-export pero no se publican: la página
   «Sobre Ayax» lleva fotos y nombres del equipo de Ayax. */
const SKIP = new Set(['ayax-sobre']);
const OUT = 'public/assets/shots';
await mkdir(OUT, { recursive: true });

/* Se parte del manifest anterior: así una fuente que ya no está no borra del
   mapa las imágenes que siguen publicadas. */
const manifest = await readFile(join(OUT, 'manifest.json'), 'utf8').then(JSON.parse).catch(() => ({}));
for (const { dir, prefix } of SOURCES) {
  const files = await readdir(dir).catch(() => null);
  if (!files) { console.log('(salto)', dir); continue; }
  for (const f of files.filter((n) => /\.(png|jpe?g)$/i.test(n))) {
    const name = prefix + basename(f, extname(f));
    if (SKIP.has(name)) { console.log('(no se publica)', name); continue; }
    const info = await sharp(join(dir, f)).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(OUT, name + '.webp'));
    manifest[name] = { width: info.width, height: info.height };
    console.log(name, info.width + 'x' + info.height, Math.round(info.size / 1024) + 'KB');
  }
}
await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
