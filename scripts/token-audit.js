#!/usr/bin/env node
// Auditoría de código: busca valores visuales escritos a mano en lugar de tokens.
// Adaptado del método de Hardik Pandya y de la skill ds-specs (MIT, Eun Ji Jung).
//
// Uso: node scripts/token-audit.js [carpeta]     (por defecto: src)
// Errores (salida 1): colores, espaciados, radios, tamaños de letra, z-index crudos.
// Avisos: duraciones, sombras, line-height.
// Excepción explícita: comentario `audit-ok: motivo` en la misma línea.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET = path.resolve(process.argv[2] || 'src');
const FILES = /\.(css|scss|less|jsx|tsx|vue|svelte|html|astro)$/;
const IGNORE = /node_modules|dist|build|\.next|tokens\.css$/;

// Mapa valor → token, leído de las capas 2 y 3 de tokens.css (con el respaldo de var()).
const tokens = { color: new Map(), size: [] };
const cssFile = path.join(ROOT, 'tokens.css');
if (fs.existsSync(cssFile)) {
  for (const m of fs.readFileSync(cssFile, 'utf8').matchAll(/(--(?!ds-)[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    const name = m[1];
    const fallback = (m[2].match(/var\([^,]+,\s*(.+)\)\s*$/) || [null, m[2]])[1].trim().toLowerCase();
    if (/^#[0-9a-f]{3,8}$|^rgba?\(/.test(fallback)) { if (!tokens.color.has(fallback)) tokens.color.set(fallback, name); }
    else if (/^-?\d+(\.\d+)?(px|rem)$/.test(fallback)) tokens.size.push({ name, value: fallback });
  }
}
const sizeToken = (prefix, value) => (tokens.size.find((t) => t.name.startsWith(prefix) && t.value === value.toLowerCase()) || {}).name || null;
const rgb = (h) => { const s = h.length === 4 ? h.slice(1).split('').map((c) => c + c).join('') : h.slice(1, 7); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
const near = (hex) => {
  let best = null;
  for (const [val, name] of tokens.color) {
    if (!/^#[0-9a-f]{6}$/.test(val)) continue;
    const d = rgb(hex).reduce((s, v, i) => s + Math.abs(v - rgb(val)[i]), 0);
    if (d > 0 && d <= 12 && (!best || d < best.d)) best = { name, val, d };
  }
  return best;
};

const RULES = [
  { name: 'color', severity: 'error', re: /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g,
    hint: (v) => {
      const k = v.toLowerCase();
      if (tokens.color.has(k)) return `usa var(${tokens.color.get(k)})`;
      const n = /^#[0-9a-f]{6}$/i.test(v) && near(k);
      return n ? `casi igual a var(${n.name}) (${n.val}, distancia ${n.d}). ¿Errata o intención? No se corrige solo.` : 'sin token: añádelo a tokens/*.json si es intencionado';
    } },
  { name: 'espaciado', severity: 'error', re: /(?:padding|margin|gap|inset|top|left|right|bottom)[a-z-]*\s*:\s*([^;{}"']*\d+px[^;{}"']*)/g,
    hint: (v) => { const t = v.trim().split(/\s+/).map((x) => sizeToken('--space', x) || x); return t.some((x) => x.startsWith('--')) ? `usa ${t.map((x) => (x.startsWith('--') ? `var(${x})` : x)).join(' ')}` : 'sin token de espaciado para este valor'; } },
  { name: 'radio', severity: 'error', re: /border-radius\s*:\s*([^;{}]*\d+px[^;{}]*)/g,
    hint: (v) => { const t = sizeToken('--radius', v.trim()); return t ? `usa var(${t})` : 'sin token de radio para este valor'; } },
  { name: 'tamaño de letra', severity: 'error', re: /font-size\s*:\s*([^;{}]*\d+(?:px|rem)[^;{}]*)/g,
    hint: (v) => { const t = sizeToken('--font-size', v.trim()) || sizeToken('--text', v.trim()); return t ? `usa var(${t})` : 'sin token tipográfico para este valor'; } },
  { name: 'z-index', severity: 'error', re: /z-index\s*:\s*(-?\d+)/g, hint: () => 'usa una capa con nombre (--z-*)' },
  { name: 'duración', severity: 'warning', re: /(?:transition|animation)[a-z-]*\s*:[^;{}]*?(\d*\.?\d+m?s)\b/g, hint: () => 'usa un token --motion-*' },
  { name: 'sombra', severity: 'warning', re: /box-shadow\s*:\s*([^;{}]*\d+px[^;{}]*)/g, hint: () => 'usa un token de elevación' },
];

let errors = 0, warnings = 0, scanned = 0, dirty = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (IGNORE.test(p)) continue;
    if (e.isDirectory()) walk(p);
    else if (FILES.test(e.name)) check(p);
  }
}
function check(file) {
  scanned++;
  const hits = [];
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (line.includes('audit-ok')) return;
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line))) {
        const raw = (m[1] || m[0]).trim();
        if (raw.includes('var(')) continue;
        hits.push(`  ${rule.severity === 'error' ? 'x' : '!'} L${i + 1}: ${rule.name} "${raw}" → ${rule.hint(raw)}`);
        rule.severity === 'error' ? errors++ : warnings++;
      }
    }
  });
  if (hits.length) { dirty++; console.log(`\n${path.relative(process.cwd(), file)}`); hits.forEach((h) => console.log(h)); }
}

console.log('Auditoría de tokens en código');
if (!fs.existsSync(TARGET)) { console.log(`No existe ${path.relative(process.cwd(), TARGET) || TARGET}: no hay código que auditar.`); process.exit(0); }
if (!tokens.color.size && !tokens.size.length) console.log('Aviso: tokens.css vacío o ausente; se marcan los valores pero sin sugerencias.');
walk(TARGET);
console.log(`\n=== Resumen ===\nArchivos revisados: ${scanned}\nCon incidencias:    ${dirty}\nErrores:            ${errors}\nAvisos:             ${warnings}`);
process.exit(errors ? 1 : 0);
