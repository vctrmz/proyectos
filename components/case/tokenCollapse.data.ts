/* Datos del colapso 267 → 24 del caso del design system.

   Los totales son los de la auditoría (267 valores de color en uso, 24 tokens
   con rol). El reparto por token y los valores sueltos son ilustrativos: se
   generan como variaciones casi idénticas de cada token, que es justo lo que
   encontró la auditoría —el mismo gris escrito de veinte maneras—. Con semilla
   fija, para que el servidor y el cliente pinten el mismo orden. */
export type Token = { name: string; hex: string; count: number };

export const TOKENS: Token[] = [
  { name: 'bg', hex: '#ffffff', count: 9 },
  { name: 'surface', hex: '#f6f7fb', count: 21 },
  { name: 'surface-2', hex: '#eceef5', count: 14 },
  { name: 'line', hex: '#e3e6ef', count: 25 },
  { name: 'line-strong', hex: '#c9cedb', count: 12 },
  { name: 'ink', hex: '#121317', count: 16 },
  { name: 'ink-muted', hex: '#6a6a71', count: 23 },
  { name: 'ink-subtle', hex: '#9a9ca5', count: 15 },
  { name: 'action', hex: '#2f5bea', count: 17 },
  { name: 'action-hover', hex: '#2448c4', count: 9 },
  { name: 'action-pressed', hex: '#1b379a', count: 6 },
  { name: 'action-subtle', hex: '#e6ecfd', count: 8 },
  { name: 'success', hex: '#1f9d55', count: 8 },
  { name: 'success-subtle', hex: '#e3f4ea', count: 6 },
  { name: 'warning', hex: '#d97706', count: 7 },
  { name: 'warning-subtle', hex: '#fdf0dc', count: 5 },
  { name: 'danger', hex: '#c0392b', count: 9 },
  { name: 'danger-subtle', hex: '#f9e3e0', count: 6 },
  { name: 'info', hex: '#0e7490', count: 5 },
  { name: 'info-subtle', hex: '#dff1f5', count: 4 },
  { name: 'focus', hex: '#4a44f2', count: 6 },
  { name: 'brand', hex: '#0f766e', count: 11 },
  { name: 'overlay', hex: '#3b3d45', count: 7 },
  { name: 'disabled', hex: '#b8bbc4', count: 18 },
];

export type Swatch = { id: number; token: number; hex: string };

function rng(seed: number) {
  let a = seed;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const hexOf = (r: number, g: number, b: number) => `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')}`;

/* Una variación «casi igual»: el desvío que deja un color copiado a ojo. */
function nudge(hex: string, rand: () => number) {
  const n = parseInt(hex.slice(1), 16);
  const d = () => (rand() - 0.5) * 18;
  const shift = d();
  return hexOf(((n >> 16) & 255) + shift + d() * 0.4, ((n >> 8) & 255) + shift + d() * 0.4, (n & 255) + shift + d() * 0.4);
}

export function buildSwatches(seed = 24): Swatch[] {
  const rand = rng(seed);
  const out: Swatch[] = [];
  TOKENS.forEach((t, ti) => {
    for (let k = 0; k < t.count; k++) out.push({ id: out.length, token: ti, hex: k === 0 ? t.hex : nudge(t.hex, rand) });
  });
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}

export const TOTAL = TOKENS.reduce((n, t) => n + t.count, 0);
