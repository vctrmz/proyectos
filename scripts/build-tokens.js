#!/usr/bin/env node
// Genera tokens.css y specs/tokens/token-reference.md desde tokens/*.json.
// Los JSON son la fuente de verdad. tokens.css y la referencia no se editan a mano.
//
// Capas (cada una solo puede apuntar a la anterior):
//   tokens/primitives.json  → Capa 1  --ds-*            valores crudos observados
//   tokens/semantic.json    → Capa 2  --color-*, --space-*…  alias por intención (lo que usan los componentes)
//   tokens/components.json  → Capa 3  --button-*…      alias de componente, solo hacia la capa 2
//   tokens/modes/<modo>.json → reescribe valores de la capa 2 bajo [data-theme="<modo>"]
//
// Formato: W3C Design Tokens (DTCG). Hoja = objeto con "$value" y "$type".
// Alias: "{color.blue.600}". Evidencia: "$extensions": { "agency": { "status", "sources" } }.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const T = (f) => path.join(ROOT, 'tokens', f);
const read = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {});

function flatten(obj, layer, prefix = [], out = new Map(), inherited = {}) {
  const groupType = obj.$type || inherited.$type;
  // JSON pone primero las claves enteras ("100") y después las demás ("025"): se reordenan por valor
  // para que las escalas salgan en orden (025, 050, 100…).
  const entries = Object.entries(obj).filter(([k]) => !k.startsWith('$'));
  if (entries.length && entries.every(([k]) => /^\d+(\.\d+)?$/.test(k))) entries.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
  for (const [k, v] of entries) {
    if (k.startsWith('$') || v === null || typeof v !== 'object') continue;
    const p = [...prefix, k];
    if ('$value' in v) out.set(p.join('.'), { path: p, layer, value: v.$value, type: v.$type || groupType, description: v.$description || '', evidence: (v.$extensions && v.$extensions.agency) || {} });
    else flatten(v, layer, p, out, { $type: groupType });
  }
  return out;
}

const layers = {
  primitives: flatten(read(T('primitives.json')), 'primitives'),
  semantic: flatten(read(T('semantic.json')), 'semantic'),
  components: flatten(read(T('components.json')), 'components'),
};
if (!layers.primitives.size && !layers.semantic.size && !layers.components.size) {
  console.log('No hay tokens todavía: tokens/*.json está vacío. No se genera tokens.css.');
  process.exit(0);
}
const cssName = (t) => (t.layer === 'primitives' ? `--ds-${t.path.join('-')}` : `--${t.path.join('-')}`);
// A qué capa puede apuntar cada capa
const TARGET = { semantic: 'primitives', components: 'semantic', modes: 'primitives' };
const ALIAS = /^\{([^}]+)\}$/;
const errors = [];

function resolve(ref, fromLayer, seen = []) {
  const target = layers[TARGET[fromLayer]];
  const t = target && target.get(ref);
  if (!t) { errors.push(`${fromLayer}: el alias {${ref}} no existe en ${TARGET[fromLayer]}`); return null; }
  return t;
}

function raw(t, seen = new Set()) {
  if (seen.has(t)) { errors.push(`alias circular en ${t.path.join('.')}`); return ''; }
  seen.add(t);
  const m = typeof t.value === 'string' && t.value.match(ALIAS);
  if (m) {
    const target = resolve(m[1], t.layer);
    return target ? raw(target, seen) : '';
  }
  return toCss(t.value, t.type);
}

function toCss(value, type) {
  if (value && typeof value === 'object' && 'value' in value && 'unit' in value) return `${value.value}${value.unit}`;
  if (type === 'fontFamily' && Array.isArray(value)) return value.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
  if (type === 'cubicBezier' && Array.isArray(value)) return `cubic-bezier(${value.join(', ')})`;
  if (type === 'shadow') {
    const one = (s) => `${s.inset ? 'inset ' : ''}${toCss(s.offsetX)} ${toCss(s.offsetY)} ${toCss(s.blur)} ${toCss(s.spread ?? '0px')} ${s.color}`;
    return Array.isArray(value) ? value.map(one).join(', ') : typeof value === 'object' ? one(value) : String(value);
  }
  return String(value);
}

// Un alias se escribe como var() con el valor final de respaldo.
function cssValue(t) {
  const m = typeof t.value === 'string' && t.value.match(ALIAS);
  if (!m) return toCss(t.value, t.type);
  const target = resolve(m[1], t.layer);
  if (!target) return 'initial';
  return `var(${cssName(target)}, ${raw(target)})`;
}

// Tipografía compuesta → una variable por propiedad
function declarations(t) {
  if (t.type === 'typography' && t.value && typeof t.value === 'object') {
    const map = { fontFamily: 'font-family', fontSize: 'font-size', fontWeight: 'font-weight', lineHeight: 'line-height', letterSpacing: 'letter-spacing' };
    const parts = Object.entries(t.value).filter(([k]) => map[k]).map(([k, v]) => {
      const m = typeof v === 'string' && v.match(ALIAS);
      const target = m && resolve(m[1], t.layer);
      return [`${cssName(t)}-${map[k]}`, target ? `var(${cssName(target)}, ${raw(target)})` : toCss(v), target ? raw(target) : toCss(v), target, k];
    });
    // Además, una variable única para el atajo `font:` → font: var(--typography-body);
    const get = (k) => parts.find((p) => p[4] === k);
    if (get('fontSize') && get('fontFamily')) {
      const ref = (k) => (get(k) ? `var(${get(k)[0]})` : '');
      const shorthand = `${ref('fontWeight')} ${ref('fontSize')}${get('lineHeight') ? `/${ref('lineHeight')}` : ''} ${ref('fontFamily')}`.trim().replace(/\s+/g, ' ');
      const rawShort = `${get('fontWeight') ? get('fontWeight')[2] + ' ' : ''}${get('fontSize')[2]}${get('lineHeight') ? '/' + get('lineHeight')[2] : ''} ${get('fontFamily')[2]}`;
      parts.unshift([cssName(t), shorthand, rawShort, null, 'font']);
    }
    return parts.map((p) => p.slice(0, 4));
  }
  const m = typeof t.value === 'string' && t.value.match(ALIAS);
  return [[cssName(t), cssValue(t), raw(t), m ? resolve(m[1], t.layer) : null]];
}

const section = (title, map) => {
  if (!map.size) return '';
  const rows = [...map.values()].flatMap(declarations).map(([n, v]) => `  ${n}: ${v};`);
  return `/* ${title} */\n:root {\n${rows.join('\n')}\n}\n`;
};

// Modos: reescriben la capa 2 apuntando a primitivas distintas
const modesDir = T('modes');
const modeBlocks = [];
if (fs.existsSync(modesDir)) {
  for (const f of fs.readdirSync(modesDir).filter((x) => x.endsWith('.json')).sort()) {
    const mode = f.replace('.json', '');
    const map = flatten(read(path.join(modesDir, f)), 'modes');
    if (!map.size) continue;
    const rows = [];
    for (const [key, t] of map) {
      const base = layers.semantic.get(key);
      if (!base) { errors.push(`modes/${f}: ${key} no existe en semantic.json (un modo solo reescribe tokens semánticos)`); continue; }
      const m = typeof t.value === 'string' && t.value.match(ALIAS);
      const target = m && resolve(m[1], 'modes');
      rows.push(`  ${cssName(base)}: ${target ? `var(${cssName(target)}, ${raw(target)})` : toCss(t.value, t.type)};`);
    }
    const selector = mode === 'light' ? ':root, [data-theme="light"]' : `[data-theme="${mode}"]`;
    if (rows.length) modeBlocks.push(`/* Modo ${mode} */\n${selector} {\n${rows.join('\n')}\n}\n`);
  }
}

const css = [
  '/* tokens.css — GENERADO por scripts/build-tokens.js desde tokens/*.json. No editar a mano. */',
  '/* Los componentes usan solo la capa 2 (o su capa 3). Nunca --ds-* ni valores crudos. */',
  '',
  section('Capa 1 · primitivas (--ds-*): valores observados', layers.primitives),
  section('Capa 2 · semánticos: el contrato de los componentes', layers.semantic),
  section('Capa 3 · componentes: solo alias de la capa 2', layers.components),
  ...modeBlocks,
].filter(Boolean).join('\n');

if (errors.length) {
  console.error('No se generó tokens.css:\n- ' + [...new Set(errors)].join('\n- '));
  process.exit(1);
}
fs.writeFileSync(path.join(ROOT, 'tokens.css'), css);

// Referencia maestra: una fila por variable de capas 2 y 3
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
const refRows = [];
for (const layer of ['semantic', 'components']) {
  for (const t of layers[layer].values()) {
    for (const [name, , value, target] of declarations(t)) {
      refRows.push(`| \`${name}\` | \`${esc(value)}\` | ${target ? `\`${cssName(target)}\`` : '—'} | ${layer === 'semantic' ? '2' : '3'} | ${t.evidence.status || 'sin estado'} | ${esc(t.description)} |`);
    }
  }
}
const totalPrim = layers.primitives.size;
const ref = [
  '# Referencia de tokens',
  '',
  '> Generado por `node scripts/build-tokens.js`. No editar a mano: cambia `tokens/*.json` y vuelve a generar.',
  '> `scripts/token-audit.js` usa esta tabla para sugerir el token correcto.',
  '',
  `Primitivas (capa 1): ${totalPrim} · Semánticos (capa 2): ${layers.semantic.size} · Componente (capa 3): ${layers.components.size}`,
  '',
  '| Token | Resuelve a | Apunta a | Capa | Estado | Uso |',
  '|---|---|---|---|---|---|',
  ...refRows,
  '',
].join('\n');
if (refRows.length) {
  fs.mkdirSync(path.join(ROOT, 'specs/tokens'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'specs/tokens/token-reference.md'), ref);
}

console.log(`tokens.css generado · capa 1: ${totalPrim} · capa 2: ${layers.semantic.size} · capa 3: ${layers.components.size}${modeBlocks.length ? ` · modos: ${modeBlocks.length}` : ''}`);
if (refRows.length) console.log('→ specs/tokens/token-reference.md');
