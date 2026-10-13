#!/usr/bin/env node
// Une la evidencia de todas las pantallas y la clasifica sin opinar.
//
// Lee:     specs/screens/*.evidence.json   (uno por pantalla, ver references/evidence-model.md)
// Escribe: specs/audits/evidence-summary.json  (para token-architect y component-analyst)
//          specs/audits/evidence-matrix.md     (para personas)
//
// Reglas de estado (las mismas de CLAUDE.md):
//   confirmed  → viene de Figma y está ligado a una variable, un estilo o un componente maestro
//   recurring  → aparece en 2+ pantallas, o 3+ veces en una misma pantalla
//   candidate  → aparece 1-2 veces en una sola pantalla
// Nunca produce `proposed` ni `pending`: eso lo deciden los agentes, no el recuento.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCREENS = path.join(ROOT, 'specs/screens');
const AUDITS = path.join(ROOT, 'specs/audits');

const files = fs.existsSync(SCREENS) ? fs.readdirSync(SCREENS).filter((f) => f.endsWith('.evidence.json')).sort() : [];
if (!files.length) {
  console.log('No hay evidencia todavía: faltan specs/screens/*.evidence.json.');
  process.exit(0);
}

const problems = [];
const screens = files.map((f) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(SCREENS, f), 'utf8'));
    if (!data.screen || !data.screen.slug) problems.push(`${f}: falta screen.slug`);
    return { file: f, ...data };
  } catch (e) {
    problems.push(`${f}: JSON inválido (${e.message})`);
    return null;
  }
}).filter(Boolean);
if (problems.length) {
  console.error('Evidencia con errores:\n- ' + problems.join('\n- '));
  process.exit(1);
}

const normHex = (v) => {
  if (typeof v !== 'string') return v;
  let s = v.trim().toUpperCase();
  if (/^#[0-9A-F]{3}$/.test(s)) s = '#' + [...s.slice(1)].map((c) => c + c).join('');
  return s;
};
// "0", "0px" y "0%" son el mismo espaciado entre letras; "normal" y "auto", el mismo interlineado.
const normSpacing = (v) => { const s = String(v ?? '0').trim(); return /^-?0+(\.0+)?(px|%|em)?$/.test(s) ? '0' : s; };
const normLine = (v) => { const s = String(v ?? 'auto').trim(); return s === 'normal' ? 'auto' : s; };
const SIDE_ORDER = ['top', 'right', 'bottom', 'left'];
const normSides = (v) => (v && v !== 'all' ? String(v).toLowerCase().split(/[\s,]+/).filter(Boolean).sort((a, b) => SIDE_ORDER.indexOf(a) - SIDE_ORDER.indexOf(b)).join(',') : 'all');
const slug = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Claves por categoría: qué cuenta como "el mismo valor".
const CATEGORIES = {
  colors: (e) => `${normHex(e.value)}${e.opacity != null && e.opacity < 1 ? ` α${e.opacity}` : ''}|${e.role || 'fill'}`,
  typography: (e) => `${e.family}|${e.weight ?? e.font_style}|${e.size}|${normLine(e.line_height)}|${normSpacing(e.letter_spacing)}${e.text_case && e.text_case !== 'none' ? `|${e.text_case}` : ''}`,
  spacing: (e) => `${e.value}|${e.kind || 'space'}`,
  radius: (e) => `${e.value}`,
  borders: (e) => `${e.width}|${normHex(e.color)}|${normSides(e.sides)}${e.dash_pattern && e.dash_pattern.length ? '|dashed' : ''}`,
  contrast_pairs: (e) => `${normHex(e.fg)}${e.opacity != null && e.opacity < 1 ? ` α${e.opacity}` : ''}|${normHex(e.bg)}|${e.size}|${e.weight ?? e.font_style ?? ''}`,
  shadows: (e) => `${e.css}`,
  components: (e) => slug(e.name),
};

const merged = {};
for (const [cat, keyOf] of Object.entries(CATEGORIES)) {
  const map = new Map();
  for (const s of screens) {
    for (const e of s[cat] || []) {
      const key = keyOf(e);
      const row = map.get(key) || {
        key, sample: e, screens: new Set(), count: 0, sources: new Set(),
        variables: new Set(), styles: new Set(), examples: [], estimated: true,
        variants_seen: new Set(), states_seen: new Set(), tiers: new Set(),
      };
      row.screens.add(s.screen.slug);
      row.count += Number(e.count) || 1;
      const src = s.screen.source || {};
      row.sources.add(src.type === 'figma' ? `figma:${src.file_key}/${src.node_id}` : `image:${src.path}`);
      if (e.variable) row.variables.add(e.variable);
      // Nombre de un estilo de Figma: figma_style (o el antiguo style; en tipografía, text_style).
      const figmaStyle = e.figma_style || (cat === 'typography' ? e.text_style : cat === 'borders' ? null : e.style);
      if (figmaStyle) row.styles.add(figmaStyle);
      if (e.example && row.examples.length < 3) row.examples.push(`${s.screen.slug}: ${e.example}`);
      // Lo medido en Figma es exacto; lo medido sobre imagen se marca como estimado.
      if (src.type === 'figma' && !e.estimated) row.estimated = false;
      if (src.type === 'image' && cat === 'colors' && e.sampled) row.estimated = false;
      for (const v of e.variants_seen || []) row.variants_seen.add(v);
      for (const v of e.states_seen || []) row.states_seen.add(v);
      if (e.tier) row.tiers.add(e.tier);
      if (cat === 'components' && src.type === 'figma' && e.figma) {
        row.figma_main = true;
        row.figma_name = row.figma_name || e.figma;
        row.instances = (row.instances || 0) + (Number(e.instances ?? e.count) || 1);
      }
      map.set(key, row);
    }
  }
  merged[cat] = [...map.values()];
}

const fromFigma = (r) => [...r.sources].some((s) => s.startsWith('figma:'));
// Un color cuenta por su valor, no por su rol: #1559EA como texto y como borde suma en ambos.
const colorTotals = new Map();
for (const r of merged.colors) {
  const v = normHex(r.sample.value);
  const t = colorTotals.get(v) || { screens: new Set(), count: 0 };
  r.screens.forEach((x) => t.screens.add(x));
  t.count += r.count;
  colorTotals.set(v, t);
}
const statusOf = (r, cat) => {
  if (fromFigma(r) && (r.variables.size || r.styles.size || (cat === 'components' && r.figma_main))) return 'confirmed';
  const t = cat === 'colors' ? colorTotals.get(normHex(r.sample.value)) : r;
  if (t.screens.size >= 2 || t.count >= 3) return 'recurring';
  return 'candidate';
};

// Señales para el criterio de los agentes: duplicados casi iguales y valores fuera de retícula.
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const colorDist = (a, b) => rgb(a).reduce((s, v, i) => s + Math.abs(v - rgb(b)[i]), 0);
const notes = (r, cat, all) => {
  const out = [];
  if (cat === 'colors') {
    const hexv = normHex(r.sample.value);
    if (/^#[0-9A-F]{6}$/.test(hexv)) {
      for (const o of all) {
        const ov = normHex(o.sample.value);
        if (o === r || !/^#[0-9A-F]{6}$/.test(ov) || ov === hexv) continue;
        const d = colorDist(hexv, ov);
        if (d <= 24 && o.count >= r.count) { out.push(`casi igual a ${ov} (distancia ${d})`); break; }
      }
    }
  }
  if ((cat === 'spacing' || cat === 'radius') && Number.isFinite(Number(r.sample.value))) {
    const v = Number(r.sample.value);
    if (v % 1 !== 0) out.push('valor con decimales: capa escalada');
    else if (cat === 'spacing' && v % 4 !== 0) out.push('fuera de la retícula de 4');
  }
  if (cat === 'typography' && r.sample.size % 1 !== 0) out.push('tamaño con decimales: texto escalado');
  if (cat === 'components' && r.figma_main && r.instances < r.count) out.push(`${r.count - r.instances} de ${r.count} apariciones no son instancias del maestro`);
  return out;
};

const summary = { generated_at: new Date().toISOString(), screens: screens.map((s) => ({ slug: s.screen.slug, name: s.screen.name, source: s.screen.source, screen_types: s.screen.screen_types || [] })) };
for (const [cat, rows] of Object.entries(merged)) {
  summary[cat] = rows
    .map((r) => ({
      ...r.sample,
      ...(cat === 'colors' ? { value: normHex(r.sample.value) } : {}),
      ...(cat === 'borders' ? { color: normHex(r.sample.color) } : {}),
      count: r.count,
      screens: [...r.screens],
      status: statusOf(r, cat),
      estimated: r.estimated,
      sources: [...r.sources],
      variables: [...r.variables],
      styles: [...r.styles],
      examples: r.examples,
      ...(cat === 'components' ? { figma: r.figma_name || r.sample.figma || null, variants_seen: [...r.variants_seen], states_seen: [...r.states_seen], tier: [...r.tiers][0] || null } : {}),
      notes: notes(r, cat, rows),
      example: undefined, variable: undefined, style: undefined, text_style: undefined,
    }))
    .sort((a, b) => b.screens.length - a.screens.length || b.count - a.count);
}
// Escala tipográfica por propiedad: el tamaño 18 puede ser recurrente aunque cada combinación sea única.
const byProp = (prop) => {
  const m = new Map();
  for (const r of summary.typography) {
    const k = String(r[prop] ?? (prop === 'weight' ? r.font_style : ''));
    const e = m.get(k) || { value: k, count: 0, screens: new Set() };
    e.count += r.count;
    r.screens.forEach((x) => e.screens.add(x));
    m.set(k, e);
  }
  return [...m.values()].map((e) => ({ value: e.value, count: e.count, screens: [...e.screens], status: e.screens.size >= 2 || e.count >= 3 ? 'recurring' : 'candidate' })).sort((a, b) => b.count - a.count);
};
summary.type_scale = { families: byProp('family'), sizes: byProp('size'), weights: byProp('weight') };
// Patrones y contenido de cada pantalla, para el analista de patrones.
const patterns = new Map();
for (const s of screens) for (const p of s.patterns || []) {
  const k = slug(p.name);
  const e = patterns.get(k) || { name: p.name, screens: [], notes: [] };
  e.screens.push(s.screen.slug);
  if (p.note) e.notes.push(`${s.screen.slug}: ${p.note}`);
  patterns.set(k, e);
}
summary.patterns = [...patterns.values()].map((p) => ({ ...p, status: p.screens.length >= 2 ? 'recurring' : 'candidate' }));
summary.content = screens.map((s) => ({ screen: s.screen.slug, ...(s.content || {}) }));

fs.mkdirSync(AUDITS, { recursive: true });
fs.writeFileSync(path.join(AUDITS, 'evidence-summary.json'), JSON.stringify(summary, null, 2) + '\n');

// Matriz legible
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
const TITLES = { colors: 'Color', contrast_pairs: 'Pares texto / fondo', typography: 'Tipografía', spacing: 'Espaciado', radius: 'Radio', borders: 'Borde', shadows: 'Sombra', components: 'Componentes' };
const describe = (cat, r) => ({
  colors: () => `\`${r.value}\`${r.opacity != null && r.opacity < 1 ? ` α${r.opacity}` : ''} · ${r.role || 'fill'}`,
  typography: () => `${r.family} ${r.weight ?? r.font_style} · ${r.size}/${normLine(r.line_height)}${normSpacing(r.letter_spacing) !== '0' ? ` · ls ${r.letter_spacing}` : ''}${r.text_case && r.text_case !== 'none' ? ` · ${r.text_case}` : ''}`,
  spacing: () => `${r.value}px · ${r.kind || 'space'}`,
  radius: () => `${r.value}px`,
  borders: () => `${r.width}px \`${r.color}\`${r.sides && r.sides !== 'all' ? ` · ${r.sides}` : ''}${r.dash_pattern && r.dash_pattern.length ? ' · discontinuo' : ''}`,
  shadows: () => `\`${r.css}\``,
  contrast_pairs: () => `\`${r.fg}\`${r.opacity != null && r.opacity < 1 ? ` α${r.opacity}` : ''} sobre \`${r.bg}\` · ${r.size}px ${r.weight ?? r.font_style ?? ''}`,
  components: () => `${r.name}${r.tier ? ` (${r.tier})` : ''}`,
}[cat]());
const lines = [
  '# Matriz de evidencia',
  '',
  '> Generado por `node scripts/merge-evidence.js` a partir de `specs/screens/*.evidence.json`. No editar a mano: corrige la evidencia de la pantalla y vuelve a generar.',
  '',
  `Pantallas analizadas: ${screens.length} · ${screens.map((s) => s.screen.slug).join(', ')}`,
  '',
];
const totals = {};
for (const [cat, rows] of Object.entries(summary)) {
  if (!Array.isArray(rows) || !TITLES[cat] || !rows.length) continue;
  lines.push(`## ${TITLES[cat]}`, '', '| Valor | Pantallas | Apariciones | Estado | Figma (variable / estilo) | Notas |', '|---|---:|---:|---|---|---|');
  for (const r of rows) {
    totals[r.status] = (totals[r.status] || 0) + 1;
    const fig = [...r.variables, ...r.styles, ...(r.figma ? [r.figma] : [])].join(', ') || (r.estimated ? 'estimado sobre imagen' : '—');
    lines.push(`| ${esc(describe(cat, r))} | ${r.screens.length} | ${r.count} | ${r.status} | ${esc(fig)} | ${esc(r.notes.join('; '))} |`);
  }
  lines.push('');
}
lines.push('## Criterio', '', '- `confirmed`: en Figma y ligado a variable, estilo o componente maestro.', '- `recurring`: en 2+ pantallas, o 3+ veces en una pantalla.', '- `candidate`: 1-2 apariciones en una sola pantalla.', '- `proposed` y `pending` no salen del recuento: los asignan los agentes en tokens y specs.', '');
fs.writeFileSync(path.join(AUDITS, 'evidence-matrix.md'), lines.join('\n'));

console.log(`Evidencia unida: ${screens.length} pantalla(s).`);
console.log(Object.entries(totals).map(([k, v]) => `  ${k}: ${v}`).join('\n'));
console.log('→ specs/audits/evidence-summary.json\n→ specs/audits/evidence-matrix.md');
