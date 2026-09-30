import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

/* Portadas de los libros de «Sobre mí», desde Open Library (datos abiertos).
   Se ejecuta a mano cuando cambia la lista: node scripts/fetch-books.mjs
   Salida: WebP de 240x360 (2:3) en public/assets/books/<slug>.webp.
   UX Strategy no está aquí: Open Library solo tiene una portadilla sin
   diseño, así que la web pinta una portada tipográfica.

   Todas salen a 2:3 exactos porque la estantería las enseña en cajas
   iguales. Open Library devuelve escaneos con proporciones distintas —de
   0,64 a 0,83—, y las más apaisadas quedaban más bajas que el resto o, si
   se recortaban, perdían parte del título. Aquí se extiende el lienzo en
   vez de recortar: la banda que falta se rellena con el color del borde de
   la propia portada, que en la mayoría es un fondo plano y no se nota. */
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
  const origen = sharp(Buffer.from(await res.arrayBuffer())).resize({ width: 240 });
  const { height } = await origen.clone().metadata();
  /* Color del borde: la fila de píxeles de arriba y la de abajo, promediadas.
     `extend` con ese color hace invisible la banda en portadas de fondo plano
     y discreta en las demás. */
  const franja = async (top) => {
    const { data } = await origen.clone().extract({ left: 0, top, width: 240, height: 1 }).raw().toBuffer({ resolveWithObject: true });
    const n = data.length / 3;
    const suma = [0, 0, 0];
    for (let i = 0; i < data.length; i += 3) { suma[0] += data[i]; suma[1] += data[i + 1]; suma[2] += data[i + 2]; }
    return { r: Math.round(suma[0] / n), g: Math.round(suma[1] / n), b: Math.round(suma[2] / n) };
  };
  const falta = Math.max(0, 360 - height);
  const arriba = Math.floor(falta / 2);
  const pipe = origen.clone().flatten({ background: '#ffffff' });
  const lienzo = falta === 0
    ? pipe.resize({ width: 240, height: 360, fit: 'cover' })
    : pipe.extend({ top: arriba, bottom: falta - arriba, background: await franja(0) }).resize({ width: 240, height: 360, fit: 'cover' });
  const info = await lienzo.webp({ quality: 82 }).toFile(`${OUT}/${slug}.webp`);
  console.log(slug, `${info.width}x${info.height}`, Math.round(info.size / 1024) + 'KB');
}
