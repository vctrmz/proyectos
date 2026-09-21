import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

/* Fuentes: los PNG originales de assets/hermes y, para los nombres que solo
   existen como JPG, assets/h-card. Salida: WebP ≤ 1600 px + manifest. */
const SOURCES = ['public/assets/hermes', 'public/assets/h-card'];
const OUT = 'public/assets/shots';
await mkdir(OUT, { recursive: true });
const manifest = {};
for (const dir of SOURCES) {
  for (const f of (await readdir(dir)).filter((n) => /\.(png|jpe?g)$/i.test(n))) {
    const name = basename(f, extname(f));
    if (manifest[name]) continue; // el PNG (primera fuente) manda
    const info = await sharp(join(dir, f)).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(OUT, name + '.webp'));
    manifest[name] = { width: info.width, height: info.height };
    console.log(name, info.width + 'x' + info.height, Math.round(info.size / 1024) + 'KB');
  }
}
await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
