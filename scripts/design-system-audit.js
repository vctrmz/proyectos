#!/usr/bin/env node
// Auditoría de cobertura y madurez del sistema.
// Escribe specs/audits/coverage-matrix.md y resume en consola.
// Errores (salida 1): archivos generados desactualizados respecto a su fuente.
// Avisos: componentes observados sin spec, tipos de pantalla sin cubrir.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const P = (...p) => path.join(ROOT, ...p);
const STATUS = ['confirmed', 'recurring', 'candidate', 'proposed', 'pending'];
const TIERS = ['foundations', 'tokens', 'atoms', 'molecules', 'organisms', 'patterns', 'screens'];
// Tipos de pantalla que hacen falta para dar el sistema por consolidado (ver README).
// `navigation` no cuenta: aparece en casi todas las pantallas y no demuestra cobertura.
const SCREEN_TYPES = ['form', 'table', 'detail', 'loading', 'empty', 'error'];
const errors = [], warnings = [];

const list = (dir, ext) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(ext)) : []);
const mtime = (f) => (fs.existsSync(f) ? fs.statSync(f).mtimeMs : 0);
const statusOf = (file) => {
  const m = fs.readFileSync(file, 'utf8').match(/^---\n[\s\S]*?^status:\s*(\S+)/m);
  return m ? m[1] : 'sin estado';
};

// Specs por capa y estado
const specs = {};
for (const tier of TIERS) {
  specs[tier] = {};
  for (const f of list(P('specs', tier), '.md')) {
    const s = statusOf(P('specs', tier, f));
    specs[tier][s] = (specs[tier][s] || 0) + 1;
  }
}

// Tokens por capa y estado
const tokenStats = {};
for (const layer of ['primitives', 'semantic', 'components']) {
  const file = P('tokens', `${layer}.json`);
  tokenStats[layer] = {};
  if (!fs.existsSync(file)) continue;
  (function walk(o) {
    for (const [k, v] of Object.entries(o)) {
      if (k.startsWith('$') || !v || typeof v !== 'object') continue;
      if ('$value' in v) { const s = (v.$extensions && v.$extensions.agency && v.$extensions.agency.status) || 'sin estado'; tokenStats[layer][s] = (tokenStats[layer][s] || 0) + 1; }
      else walk(v);
    }
  })(JSON.parse(fs.readFileSync(file, 'utf8')));
}

// Archivos generados al día
const tokenSources = ['primitives', 'semantic', 'components'].map((l) => P('tokens', `${l}.json`)).concat(list(P('tokens/modes'), '.json').map((f) => P('tokens/modes', f)));
const hasTokens = Object.values(tokenStats).some((s) => Object.keys(s).length);
if (hasTokens && mtime(P('tokens.css')) < Math.max(...tokenSources.map(mtime))) errors.push('tokens.css está desactualizado: ejecuta `node scripts/build-tokens.js`');
const evidence = list(P('specs/screens'), '.evidence.json').map((f) => P('specs/screens', f));
if (evidence.length && mtime(P('specs/audits/evidence-summary.json')) < Math.max(...evidence.map(mtime))) errors.push('La matriz de evidencia está desactualizada: ejecuta `node scripts/merge-evidence.js`');

// Componentes observados sin spec
const summaryFile = P('specs/audits/evidence-summary.json');
const summary = fs.existsSync(summaryFile) ? JSON.parse(fs.readFileSync(summaryFile, 'utf8')) : null;
const documented = new Set(['atoms', 'molecules', 'organisms'].flatMap((t) => list(P('specs', t), '.md').map((f) => f.replace('.md', ''))));
const missing = [];
if (summary) {
  for (const c of summary.components || []) {
    const slug = String(c.name).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (['confirmed', 'recurring'].includes(c.status) && !documented.has(slug)) missing.push(`${c.name} (${c.status}, ${c.screens.length} pantalla/s)`);
  }
}
for (const m of missing) warnings.push(`componente observado sin spec: ${m}`);

// Tipos de pantalla cubiertos → madurez
const covered = new Set(summary ? summary.screens.flatMap((s) => s.screen_types || []) : []);
const gaps = SCREEN_TYPES.filter((t) => !covered.has(t));
if (summary) for (const g of gaps) warnings.push(`sin pantallas de tipo "${g}": sus patrones quedan como pending`);
else warnings.push('todavía no hay pantallas analizadas: lanza /design-system-agency');
// La madurez se mide sobre las specs de diseño; tokens/ y screens/ son referencia y evidencia.
const allSpecs = ['foundations', 'atoms', 'molecules', 'organisms', 'patterns'].flatMap((t) => Object.entries(specs[t]));
const total = allSpecs.reduce((n, [, v]) => n + v, 0);
const solid = allSpecs.filter(([k]) => k === 'confirmed' || k === 'recurring').reduce((n, [, v]) => n + v, 0);
const solidPct = total ? Math.round((solid / total) * 100) : 0;
const coveredCount = SCREEN_TYPES.filter((t) => covered.has(t)).length;
const maturity = coveredCount >= 5 && solidPct >= 70 ? 'consolidado' : coveredCount >= 3 && solidPct >= 40 ? 'emergente' : 'exploratorio';

// Informe
const fmt = (o) => STATUS.concat(Object.keys(o).filter((k) => !STATUS.includes(k))).filter((k) => o[k]).map((k) => `${k} ${o[k]}`).join(' · ') || '—';
const lines = [
  '# Matriz de cobertura',
  '',
  '> Generado por `node scripts/design-system-audit.js`. No editar a mano.',
  '',
  `**Madurez: ${maturity}.** ${summary ? summary.screens.length : 0} pantalla(s) · ${solidPct} % de las specs con evidencia sólida (confirmed o recurring) · tipos de pantalla cubiertos: ${coveredCount}/${SCREEN_TYPES.length}.`,
  '',
  '## Specs',
  '',
  '| Capa | Archivos | Estados |',
  '|---|---:|---|',
  ...TIERS.map((t) => `| ${t} | ${Object.values(specs[t]).reduce((a, b) => a + b, 0)} | ${fmt(specs[t])} |`),
  '',
  '## Tokens',
  '',
  '| Capa | Estados |',
  '|---|---|',
  ...Object.entries(tokenStats).map(([l, s]) => `| ${l} | ${fmt(s)} |`),
  '',
  '## Tipos de pantalla',
  '',
  '| Tipo | Cubierto |',
  '|---|---|',
  ...SCREEN_TYPES.map((t) => `| ${t} | ${covered.has(t) ? 'sí' : 'no: pide una pantalla de este tipo'} |`),
  '',
  ...(missing.length ? ['## Componentes observados sin spec', '', ...missing.map((m) => `- ${m}`), ''] : []),
  '## Criterio de madurez',
  '',
  '- `exploratorio`: menos de 3 tipos de pantalla o menos del 40 % de specs con evidencia sólida.',
  '- `emergente`: 3+ de los 6 tipos (formulario, tabla, detalle, carga, vacío, error) y 40 %+ de specs sólidas.',
  '- `consolidado`: 5+ de los 6 tipos y 70 %+ de specs sólidas.',
  '',
];
if (total || hasTokens || summary) {
  fs.mkdirSync(P('specs/audits'), { recursive: true });
  fs.writeFileSync(P('specs/audits/coverage-matrix.md'), lines.join('\n'));
}

console.log(`Auditoría del sistema · madurez: ${maturity} · specs: ${total} · sólidas: ${solidPct} %`);
for (const e of errors) console.log(`  x ${e}`);
for (const w of warnings) console.log(`  ! ${w}`);
console.log(`Errores: ${errors.length} · Avisos: ${warnings.length}`);
process.exit(errors.length ? 1 : 0);
