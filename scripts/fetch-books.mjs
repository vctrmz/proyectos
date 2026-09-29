import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

/* Portadas de los libros de «Sobre mí», desde Open Library (datos abiertos).
   Se ejecuta a mano cuando cambia la lista: node scripts/fetch-books.mjs
   Salida: WebP de 240 px de ancho en public/assets/books/<slug>.webp.
   UX Strategy no está aquí: Open Library solo tiene una portadilla sin
   diseño, así que la web pinta una portada tipográfica. */
const SOURCES = {
  'design-of-everyday-things': 'isbn/9780465050659',
  'dont-make-me-think': 'isbn/9780321965516',
  'laws-of-ux': 'isbn/9781492055310',
  '100-things': 'isbn/9780321767530',
  'lean-agile-design-thinking': 'id/10220335',
  sprint: 'isbn/9781501121746',
  hooked: 'isbn/9781591847786',
  'investigacion-ux': 'id/13680063',
  'atomic-habits': 'isbn/9780735211292',
  'camino-del-artista': 'id/15242036',
};
const OUT = 'public/assets/books';
await mkdir(OUT, { recursive: true });
for (const [slug, path] of Object.entries(SOURCES)) {
  const res = await fetch(`https://covers.openlibrary.org/b/${path}-L.jpg?default=false`, { headers: { 'User-Agent': 'victormaza-portfolio (vctrmz47@gmail.com)' } });
  if (!res.ok) { console.log('(sin portada)', slug, res.status); continue; }
  const info = await sharp(Buffer.from(await res.arrayBuffer())).resize({ width: 240 }).webp({ quality: 82 }).toFile(`${OUT}/${slug}.webp`);
  console.log(slug, `${info.width}x${info.height}`, Math.round(info.size / 1024) + 'KB');
}
