#!/usr/bin/env node
// Paleta exacta de una captura PNG, sin dependencias.
// Cuenta los píxeles de cada color, agrupa los casi iguales (antialiasing) y
// muestra los dominantes con su porcentaje. También lee un píxel concreto.
//
// Uso:
//   node scripts/image-palette.js inputs/pantalla.png            → tabla de colores
//   node scripts/image-palette.js inputs/pantalla.png --top 30   → más filas
//   node scripts/image-palette.js inputs/pantalla.png --at 120,48 --at 300,90
//   node scripts/image-palette.js inputs/pantalla.png --json
//
// Solo PNG (sin pérdida). Un JPG altera los colores: pide la captura en PNG.

const fs = require('fs');
const zlib = require('zlib');

function decodePng(buf) {
  const SIG = '89504e470d0a1a0a';
  if (buf.subarray(0, 8).toString('hex') !== SIG) throw new Error('No es un PNG. Exporta la captura en PNG (los JPG cambian los colores).');
  let pos = 8, width, height, depth, colorType, interlace, palette = null, trns = null;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      depth = data[8]; colorType = data[9]; interlace = data[12];
    } else if (type === 'PLTE') palette = data;
    else if (type === 'tRNS') trns = data;
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (interlace) throw new Error('PNG entrelazado no soportado. Vuelve a exportarlo sin entrelazar.');
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`Tipo de color PNG ${colorType} no soportado.`);
  if (depth !== 8 && depth !== 16) throw new Error(`Profundidad de ${depth} bits no soportada (solo 8 o 16).`);
  const bpp = channels * (depth / 8);
  const stride = width * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[x] = v & 255;
    }
  }
  const step = depth / 8; // con 16 bits se toma el byte alto
  const pixel = (x, y) => {
    const i = y * stride + x * bpp;
    const ch = (k) => out[i + k * step];
    if (colorType === 6) return [ch(0), ch(1), ch(2), ch(3)];
    if (colorType === 2) return [ch(0), ch(1), ch(2), 255];
    if (colorType === 4) return [ch(0), ch(0), ch(0), ch(1)];
    if (colorType === 0) return [ch(0), ch(0), ch(0), 255];
    const idx = ch(0);
    return [palette[idx * 3], palette[idx * 3 + 1], palette[idx * 3 + 2], trns && idx < trns.length ? trns[idx] : 255];
  };
  return { width, height, pixel };
}

const hex = (r, g, b) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
const dist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);

function main() {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith('--') && !/^\d+,\d+$/.test(a) && !/^\d+$/.test(a));
  if (!file) {
    console.log('Uso: node scripts/image-palette.js <captura.png> [--top N] [--at x,y] [--json]');
    process.exit(2);
  }
  const top = Number(args[args.indexOf('--top') + 1]) || 24;
  const probes = args.flatMap((a, i) => (a === '--at' ? [args[i + 1]] : [])).map((s) => s.split(',').map(Number));
  const asJson = args.includes('--json');

  const { width, height, pixel } = decodePng(fs.readFileSync(file));
  const counts = new Map();
  let opaque = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixel(x, y);
      if (a < 250) continue; // los semitransparentes son mezcla, no color de diseño
      opaque++;
      const k = (r << 16) | (g << 8) | b;
      counts.set(k, (counts.get(k) || 0) + 1);
    }
  }
  // Agrupa matices casi iguales bajo el más frecuente (el antialiasing crea cientos de variantes).
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ rgb: [k >> 16, (k >> 8) & 255, k & 255], n }));
  // Los colores muy escasos (<0,05 % de los píxeles) solo se suman a un grupo existente; no abren grupo propio.
  const minPixels = Math.max(2, Math.round(opaque * 0.0005));
  const clusters = [];
  for (const c of sorted) {
    const home = clusters.find((cl) => dist(cl.rgb, c.rgb) <= 6);
    if (home) { home.total += c.n; home.variants++; } else if (c.n >= minPixels) clusters.push({ rgb: c.rgb, n: c.n, total: c.n, variants: 1 });
  }
  const rows = clusters
    .sort((a, b) => b.total - a.total)
    .slice(0, top)
    .map((c) => ({ hex: hex(...c.rgb), percent: Math.round((c.total / opaque) * 10000) / 100, pixels: c.total, near_variants: c.variants - 1 }));
  const probed = probes.map(([x, y]) => {
    if (x >= width || y >= height) return { at: `${x},${y}`, error: 'fuera de la imagen' };
    const [r, g, b, a] = pixel(x, y);
    return { at: `${x},${y}`, hex: hex(r, g, b), alpha: a };
  });

  // Pista de densidad: anchos habituales de escritorio a 2x.
  const scaleHint = width >= 2560 ? 2 : 1;
  if (asJson) {
    console.log(JSON.stringify({ file, width, height, scale_hint: scaleHint, unique_colors: counts.size, palette: rows, probes: probed }, null, 2));
    return;
  }
  console.log(`${file}: ${width}×${height} px · ${counts.size} colores únicos · escala probable ${scaleHint}x`);
  console.log('\nColor     %       píxeles   variantes cercanas');
  for (const r of rows) console.log(`${r.hex}  ${String(r.percent).padEnd(7)} ${String(r.pixels).padEnd(9)} ${r.near_variants}`);
  if (probed.length) {
    console.log('\nPíxeles consultados');
    for (const p of probed) console.log(p.error ? `${p.at}: ${p.error}` : `${p.at}: ${p.hex} (alfa ${p.alpha})`);
  }
}

try { main(); } catch (e) { console.error(`Error: ${e.message}`); process.exit(1); }
