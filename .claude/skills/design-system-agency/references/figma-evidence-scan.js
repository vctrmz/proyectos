// Escaneo de evidencia de Figma: SOLO LECTURA.
// Se pega tal cual en `use_figma` cambiando ROOT_ID. No crea, mueve ni modifica nada.
// Devuelve las frecuencias reales de una pantalla: colores, pares texto/fondo, tipografías,
// espaciados, radios, bordes, sombras, componentes, variables, estilos y capas ocultas.
//
// Límite de use_figma: 20 KB de respuesta → un frame por llamada y filas compactas.
// Formato de fila: "valor · ×apariciones · ejemplo (id)".
// `totals` dice cuántos valores distintos hay por categoría. Si es mayor que las filas
// devueltas (`truncated`), repite con ONLY = ['categoría'] para verlas todas.

const ROOT_ID = '1:2'; // ← id del frame a escanear (formato "1:2")
const ONLY = null;     // ← null = todas; o p. ej. ['colors', 'typography'] para ver una categoría entera
const TOP = ONLY ? 250 : 25;

const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const r2 = (v) => Math.round(v * 100) / 100; // 13.4585 → 13.46: los decimales delatan capas escaladas
const isVisible = (n, root) => { for (let p = n; p && p !== root.parent; p = p.parent) if (p.visible === false) return false; return true; };
const bump = (map, key, example, nodeId) => {
  const e = map.get(key) || { count: 0, example: null };
  e.count++;
  if (!e.example && example) e.example = `${example} (${nodeId})`;
  map.set(key, e);
};
const label = (n) => `"${n.name}"`.slice(0, 32);
const solid = (paints) => (Array.isArray(paints) ? paints.find((p) => p.type === 'SOLID' && p.visible !== false) : null);
const varNames = new Map();
const varName = async (id) => {
  if (!varNames.has(id)) { const v = await figma.variables.getVariableByIdAsync(id); varNames.set(id, v ? v.name : null); }
  return varNames.get(id);
};
const styleName = async (id) => {
  if (!id || typeof id !== 'string') return null;
  const s = await figma.getStyleByIdAsync(id);
  return s ? s.name : null;
};
// Fondo real de un texto: el primer antepasado visible con relleno sólido opaco.
const backgroundOf = (n, root) => {
  for (let p = n.parent; p && p !== root.parent; p = p.parent) {
    const f = 'fills' in p ? solid(p.fills) : null;
    if (f && (f.opacity ?? 1) === 1) return hex(f.color);
  }
  return '#FFFFFF?'; // sin fondo propio: se asume blanco y se marca con «?»
};

const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root) return { error: `nodo ${ROOT_ID} no encontrado` };
const maps = {};
for (const k of ['colors', 'contrast_pairs', 'typography', 'spacing', 'radius', 'borders', 'shadows', 'components', 'variables', 'styles', 'hidden']) maps[k] = new Map();
const nodes = 'findAll' in root ? root.findAll(() => true) : [];
nodes.unshift(root);
let scanned = 0;
for (const n of nodes) {
  if (!isVisible(n, root)) {
    // Solo la capa oculta de más arriba: suele ser un estado guardado (check, error, progreso…).
    if (n.visible === false && isVisible(n.parent, root)) bump(maps.hidden, n.name.slice(0, 40), `en "${n.parent.name}"`.slice(0, 40), n.id);
    continue;
  }
  scanned++;
  if (n.isMask) continue; // una máscara recorta, no pinta
  // Colores (texto, icono o superficie)
  if ('fills' in n && Array.isArray(n.fills)) {
    for (const f of n.fills) {
      if (f.type !== 'SOLID' || f.visible === false) continue;
      const a = r2(f.opacity ?? 1);
      const role = n.type === 'TEXT' ? 'text' : ['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON'].includes(n.type) ? 'icon' : 'fill';
      bump(maps.colors, `${role} ${hex(f.color)}${a < 1 ? ` α${a}` : ''}`, label(n), n.id);
    }
  }
  // Bordes: grosor uniforme o por lados, y discontinuos
  if ('strokes' in n && solid(n.strokes)) {
    const s = solid(n.strokes);
    const mixed = n.strokeWeight === figma.mixed;
    const sides = mixed
      ? [['top', n.strokeTopWeight], ['right', n.strokeRightWeight], ['bottom', n.strokeBottomWeight], ['left', n.strokeLeftWeight]].filter(([, w]) => w > 0)
      : [];
    const width = mixed ? (sides[0] ? sides[0][1] : 0) : n.strokeWeight;
    if (width > 0) {
      const dashed = Array.isArray(n.dashPattern) && n.dashPattern.length ? ' dashed' : '';
      const where = mixed ? ` sides:${sides.map(([k]) => k).join(',')}` : '';
      bump(maps.borders, `${r2(width)}px ${hex(s.color)}${(s.opacity ?? 1) < 1 ? ` α${r2(s.opacity)}` : ''} ${String(n.strokeAlign).toLowerCase()}${where}${dashed}`, label(n), n.id);
    }
  }
  // Tipografía y pares texto/fondo (para contraste)
  if (n.type === 'TEXT') {
    const segs = n.getStyledTextSegments(['fontName', 'fontSize', 'lineHeight', 'letterSpacing', 'textStyleId', 'textCase', 'fills']);
    for (const s of segs) {
      const lh = s.lineHeight.unit === 'AUTO' ? 'auto' : s.lineHeight.unit === 'PIXELS' ? `${r2(s.lineHeight.value)}px` : `${Math.round(s.lineHeight.value)}%`;
      const ls = s.letterSpacing.unit === 'PIXELS' ? `${r2(s.letterSpacing.value)}px` : `${r2(s.letterSpacing.value)}%`;
      const style = await styleName(s.textStyleId);
      const tcase = s.textCase && s.textCase !== 'ORIGINAL' ? ` ${s.textCase.toLowerCase()}` : '';
      bump(maps.typography, `${s.fontName.family} ${s.fontName.style} ${r2(s.fontSize)}/${lh} ls ${ls}${tcase}${style ? ` [${style}]` : ''}`, JSON.stringify(s.characters.trim().slice(0, 24)), n.id);
      const fg = solid(s.fills);
      if (fg && s.characters.trim()) {
        const a = r2((fg.opacity ?? 1) * (n.opacity ?? 1));
        bump(maps.contrast_pairs, `${hex(fg.color)}${a < 1 ? ` α${a}` : ''} on ${backgroundOf(n, root)} · ${r2(s.fontSize)}px ${s.fontName.style}`, JSON.stringify(s.characters.trim().slice(0, 20)), n.id);
      }
    }
  }
  // Radios
  if ('cornerRadius' in n && n.type !== 'TEXT') {
    const r = n.cornerRadius === figma.mixed
      ? [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius].map(r2).join(' ')
      : r2(n.cornerRadius);
    if (r && r !== 0 && r !== '0 0 0 0') bump(maps.radius, String(r), label(n), n.id);
  }
  // Auto layout: padding y gaps
  if ('layoutMode' in n && n.layoutMode && n.layoutMode !== 'NONE') {
    for (const [k, v] of [['padding-top', n.paddingTop], ['padding-right', n.paddingRight], ['padding-bottom', n.paddingBottom], ['padding-left', n.paddingLeft]]) {
      if (v > 0) bump(maps.spacing, `padding ${r2(v)}`, `${label(n)} ${k}`, n.id);
    }
    if (n.itemSpacing > 0 && n.primaryAxisAlignItems !== 'SPACE_BETWEEN') bump(maps.spacing, `gap ${r2(n.itemSpacing)}`, label(n), n.id);
    if (n.layoutWrap === 'WRAP' && n.counterAxisSpacing > 0) bump(maps.spacing, `gap ${r2(n.counterAxisSpacing)}`, label(n), n.id);
  }
  // Sombras
  if ('effects' in n && Array.isArray(n.effects)) {
    for (const e of n.effects) {
      if (!e.visible || (e.type !== 'DROP_SHADOW' && e.type !== 'INNER_SHADOW')) continue;
      const c = e.color;
      bump(maps.shadows, `${e.type === 'INNER_SHADOW' ? 'inset ' : ''}${e.offset.x}px ${e.offset.y}px ${e.radius}px ${e.spread || 0}px rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${r2(c.a)})`, label(n), n.id);
    }
  }
  // Componentes usados
  if (n.type === 'INSTANCE') {
    const main = await n.getMainComponentAsync();
    if (main) {
      const set = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent.name : null;
      bump(maps.components, `${set ? `${set} → ${main.name}` : main.name} [${main.remote ? 'librería' : 'local'}]`, label(n), n.id);
    }
  }
  // Variables y estilos ligados
  if (n.boundVariables) {
    for (const [prop, b] of Object.entries(n.boundVariables)) {
      for (const item of Array.isArray(b) ? b : [b]) if (item && item.id) { const nm = await varName(item.id); if (nm) bump(maps.variables, `${nm} → ${prop}`, label(n), n.id); }
    }
  }
  for (const prop of ['fillStyleId', 'strokeStyleId', 'effectStyleId']) {
    if (prop in n) { const nm = await styleName(n[prop]); if (nm) bump(maps.styles, `${nm} → ${prop.replace('StyleId', '')}`, label(n), n.id); }
  }
}

const out = { root: `${root.name} (${root.id}) ${Math.round(root.width)}×${Math.round(root.height)}`, nodes_scanned: scanned, totals: {}, truncated: [] };
for (const [k, map] of Object.entries(maps)) {
  out.totals[k] = map.size;
  if (ONLY && !ONLY.includes(k)) continue;
  out[k] = [...map.entries()].sort((a, b) => b[1].count - a[1].count).slice(0, TOP).map(([key, v]) => `${key} · ×${v.count} · ${v.example || ''}`);
  if (map.size > TOP) out.truncated.push(k);
}
return out;
