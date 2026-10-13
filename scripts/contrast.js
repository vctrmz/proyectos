#!/usr/bin/env node
// Ratio de contraste WCAG 2.2 entre pares de colores. Sin esta cifra no se declara cumplimiento.
//
// Uso: node scripts/contrast.js <texto> <fondo> [<texto> <fondo> …]
//      node scripts/contrast.js "#64748B" "#FFFFFF" "#0F172A80" "#F5FAFF"
// Admite #RGB, #RRGGBB, #RRGGBBAA y rgb()/rgba() (el alfa se mezcla sobre el fondo).

const parse = (h) => {
  const rgba = String(h).trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgba) return { rgb: rgba.slice(1, 4).map(Number), a: rgba[4] !== undefined ? Number(rgba[4]) : 1 };
  let s = String(h).trim().replace('#', '');
  if (s.length === 3) s = [...s].map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(s)) throw new Error(`color no válido: ${h}`);
  return { rgb: [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)), a: s.length === 8 ? parseInt(s.slice(6), 16) / 255 : 1 };
};
const lum = ([r, g, b]) => {
  const c = [r, g, b].map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

const args = process.argv.slice(2);
if (args.length < 2 || args.length % 2) {
  console.log('Uso: node scripts/contrast.js <texto> <fondo> [<texto> <fondo> …]');
  process.exit(2);
}
console.log('Texto      Fondo      Ratio   AA normal  AA grande/UI  AAA normal');
for (let i = 0; i < args.length; i += 2) {
  try {
    const fg = parse(args[i]), bg = parse(args[i + 1]);
    const mixed = fg.rgb.map((v, k) => Math.round(v * fg.a + bg.rgb[k] * (1 - fg.a)));
    const [l1, l2] = [lum(mixed), lum(bg.rgb)].sort((a, b) => b - a);
    const ratio = Math.floor(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100; // se trunca: nunca se redondea a favor
    const ok = (min) => (ratio >= min ? 'sí' : 'no');
    console.log(`${args[i].padEnd(10)} ${args[i + 1].padEnd(10)} ${String(ratio).padEnd(7)} ${ok(4.5).padEnd(10)} ${ok(3).padEnd(13)} ${ok(7)}`);
  } catch (e) {
    console.log(`${args[i]} / ${args[i + 1]}: ${e.message}`);
  }
}
