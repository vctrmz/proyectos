#!/usr/bin/env node
// Valida la documentación: enlaces relativos, frontmatter de cada spec y
// referencias a tokens que no existen en tokens.css.
// Errores (salida 1): enlace roto, frontmatter incompleto, estado no válido,
// confirmado/recurrente sin fuentes, variable CSS inexistente.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATUS = ['confirmed', 'recurring', 'candidate', 'proposed', 'pending'];
const TIERS = ['foundations', 'atoms', 'molecules', 'organisms', 'patterns', 'screens'];
const errors = [], warnings = [];

const walk = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : e.name.endsWith('.md') ? [p] : [];
}) : []);

// --only specs/atoms specs/patterns/form-layout.md → valida solo esas rutas (cada agente revisa lo suyo).
const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx > -1 ? process.argv.slice(onlyIdx + 1).map((p) => path.resolve(ROOT, p)) : null;
const docs = [...walk(path.join(ROOT, 'specs')), ...['CLAUDE.md', 'README.md'].map((f) => path.join(ROOT, f)).filter(fs.existsSync)]
  .filter((f) => !only || only.some((o) => f === o || f.startsWith(o + path.sep)));

const cssVars = new Set();
const cssFile = path.join(ROOT, 'tokens.css');
if (fs.existsSync(cssFile)) for (const m of fs.readFileSync(cssFile, 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/g)) cssVars.add(m[1]);

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  let key = null;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (kv) { key = kv[1]; fm[key] = kv[2].trim(); continue; }
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && key) fm[key] = [...(Array.isArray(fm[key]) ? fm[key] : []), item[1].trim()];
  }
  for (const k of Object.keys(fm)) if (fm[k] === '[]') fm[k] = [];
  return fm;
}

for (const file of docs) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, 'utf8');
  const body = text.replace(/```[\s\S]*?```/g, ''); // los ejemplos de código no cuentan

  // Enlaces relativos
  for (const m of body.matchAll(/\]\(([^)\s]+)\)/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const target = path.resolve(path.dirname(file), decodeURI(href.split('#')[0]));
    if (!fs.existsSync(target)) errors.push(`${rel}: enlace roto → ${href}`);
  }

  // Variables CSS citadas: en el texto (`--x`) y en los ejemplos de código (var(--x)).
  // Un token propuesto que aún no existe se escribe en dot notation (color.border.control), no como --variable.
  if (cssVars.size && !rel.startsWith('specs/tokens/')) {
    const cited = [...body.matchAll(/`(--[a-z0-9-]+)`/g), ...text.matchAll(/var\((--[a-z0-9-]+)/g)];
    for (const m of cited) {
      if (!cssVars.has(m[1])) errors.push(`${rel}: cita ${m[1]}, que no existe en tokens.css`);
      else if (m[1].startsWith('--ds-') && /^specs\/(atoms|molecules|organisms|patterns)\//.test(rel)) errors.push(`${rel}: un componente o patrón no puede usar ${m[1]} (capa 1); usa el semántico`);
    }
  }

  // Frontmatter de las specs
  const tier = rel.split(path.sep)[1];
  if (rel.startsWith('specs/') && TIERS.includes(tier)) {
    const fm = frontmatter(text);
    if (!fm) { errors.push(`${rel}: falta el frontmatter (title, status, category, sources)`); continue; }
    for (const k of ['title', 'status', 'category']) if (!fm[k]) errors.push(`${rel}: frontmatter sin "${k}"`);
    if (fm.status && !STATUS.includes(fm.status)) errors.push(`${rel}: estado "${fm.status}" no válido`);
    const sources = Array.isArray(fm.sources) ? fm.sources : [];
    if (['confirmed', 'recurring', 'candidate'].includes(fm.status) && !sources.length) errors.push(`${rel}: estado ${fm.status} sin "sources"`);
    if (/Pendiente\.?\s*$/m.test(body) && fm.status !== 'pending') warnings.push(`${rel}: tiene secciones "Pendiente" con estado ${fm.status}`);
  }
}

console.log(`Validación de documentación · ${docs.length} archivo(s)${cssVars.size ? ` · ${cssVars.size} variables en tokens.css` : ''}`);
for (const e of errors) console.log(`  x ${e}`);
for (const w of warnings) console.log(`  ! ${w}`);
console.log(`Errores: ${errors.length} · Avisos: ${warnings.length}`);
process.exit(errors.length ? 1 : 0);
