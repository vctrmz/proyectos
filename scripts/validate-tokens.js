#!/usr/bin/env node
// Valida los contratos de tokens/*.json antes de generar tokens.css.
// Errores (salida 1): formato DTCG roto, alias que no existen o saltan de capa,
// nombres mal formados, estados de evidencia desconocidos, confirmados sin fuente.
// Avisos: primitivas duplicadas, tokens sin descripción en capas 2 y 3.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STATUS = ['confirmed', 'recurring', 'candidate', 'proposed', 'pending'];
const TYPES = ['color', 'dimension', 'fontFamily', 'fontWeight', 'number', 'duration', 'cubicBezier', 'shadow', 'typography', 'border', 'transition', 'strokeStyle', 'gradient'];
const SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ALIAS = /^\{([^}]+)\}$/;
const COLOR = /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\([^)]*\)|hsla?\([^)]*\)|transparent)$/;

const errors = [], warnings = [];
const files = { primitives: 'tokens/primitives.json', semantic: 'tokens/semantic.json', components: 'tokens/components.json' };
const modesDir = path.join(ROOT, 'tokens/modes');
if (fs.existsSync(modesDir)) for (const f of fs.readdirSync(modesDir).filter((x) => x.endsWith('.json'))) files[`modes/${f}`] = `tokens/modes/${f}`;

const layers = {};
for (const [layer, rel] of Object.entries(files)) {
  const abs = path.join(ROOT, rel);
  layers[layer] = new Map();
  if (!fs.existsSync(abs)) continue;
  let json;
  try { json = JSON.parse(fs.readFileSync(abs, 'utf8')); } catch (e) { errors.push(`${rel}: JSON inválido (${e.message})`); continue; }
  (function walk(obj, prefix, groupType) {
    const type = obj.$type || groupType;
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('$')) continue;
      const p = [...prefix, k];
      const id = p.join('.');
      if (!SEGMENT.test(k)) errors.push(`${rel}: "${id}" — cada tramo en minúsculas-con-guiones (dot notation): "${k}"`);
      if (v === null || typeof v !== 'object') { errors.push(`${rel}: "${id}" no es un grupo ni un token (falta $value)`); continue; }
      if ('$value' in v) layers[layer].set(id, { rel, id, value: v.$value, type: v.$type || type, description: v.$description, ev: (v.$extensions && v.$extensions.agency) || null });
      else walk(v, p, type);
    }
  })(json, [], undefined);
}

const target = { semantic: 'primitives', components: 'semantic' };
for (const [layer, map] of Object.entries(layers)) {
  const isMode = layer.startsWith('modes/');
  for (const t of map.values()) {
    const where = `${t.rel}: ${t.id}`;
    if (!t.type) errors.push(`${where} — falta $type (en el token o en su grupo)`);
    else if (!TYPES.includes(t.type)) errors.push(`${where} — $type desconocido "${t.type}"`);

    // Evidencia
    if (!isMode) {
      if (!t.ev) errors.push(`${where} — falta $extensions.agency.status`);
      else {
        if (!STATUS.includes(t.ev.status)) errors.push(`${where} — estado "${t.ev.status}" no válido (${STATUS.join(', ')})`);
        const needsSource = ['confirmed', 'recurring', 'candidate'].includes(t.ev.status);
        if (needsSource && !(Array.isArray(t.ev.sources) && t.ev.sources.length)) errors.push(`${where} — estado ${t.ev.status} sin fuentes: añade $extensions.agency.sources`);
        if (t.ev.status === 'proposed' && !t.ev.rationale) warnings.push(`${where} — propuesta sin "rationale": explica por qué se propone`);
      }
    }

    // Alias y capas
    const m = typeof t.value === 'string' && t.value.match(ALIAS);
    if (layer === 'primitives' && m) errors.push(`${where} — una primitiva no puede ser alias: guarda el valor crudo`);
    if (m) {
      const to = isMode ? 'primitives' : target[layer];
      if (!layers[to] || !layers[to].has(m[1])) {
        const elsewhere = Object.entries(layers).find(([, mm]) => mm.has(m[1]));
        errors.push(`${where} — alias {${m[1]}} ${elsewhere ? `apunta a ${elsewhere[0]}; desde ${layer} solo se puede apuntar a ${to}` : 'no existe'}`);
      }
    } else if (layer === 'components') {
      errors.push(`${where} — un token de componente debe ser alias de un semántico, no un valor crudo`);
    } else if (layer === 'semantic' && t.type !== 'typography') {
      warnings.push(`${where} — semántico con valor crudo: crea la primitiva y apunta a ella`);
    }

    // Valores
    if (!m && t.type === 'color' && typeof t.value === 'string' && !COLOR.test(t.value.trim())) errors.push(`${where} — color no válido "${t.value}"`);
    if (!m && t.type === 'dimension' && typeof t.value === 'string' && !/^-?\d+(\.\d+)?(px|rem|em|%)$/.test(t.value)) errors.push(`${where} — dimensión no válida "${t.value}" (usa "8px" o "0.5rem")`);
    if (isMode && !layers.semantic.has(t.id)) errors.push(`${where} — un modo solo puede reescribir tokens que existen en semantic.json`);
    if (!isMode && layer !== 'primitives' && !t.description) warnings.push(`${where} — sin $description: di para qué sirve`);
  }
}

// Primitivas con el mismo valor
const byValue = new Map();
for (const t of layers.primitives.values()) {
  // 12px en font.size y en space no es un duplicado: solo se compara dentro del mismo grupo.
  const v = `${t.id.split('.')[0]}:${JSON.stringify(t.value).toLowerCase()}`;
  byValue.set(v, [...(byValue.get(v) || []), t.id]);
}
for (const [v, ids] of byValue) if (ids.length > 1) warnings.push(`primitivas con el mismo valor ${v.split(':').slice(1).join(':')}: ${ids.join(', ')}`);

const count = Object.values(layers).reduce((s, m) => s + m.size, 0);
console.log(`Validación de tokens · ${count} token(s)`);
for (const e of errors) console.log(`  x ${e}`);
for (const w of warnings) console.log(`  ! ${w}`);
console.log(`Errores: ${errors.length} · Avisos: ${warnings.length}`);
process.exit(errors.length ? 1 : 0);
