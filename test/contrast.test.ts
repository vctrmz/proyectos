import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/* Contraste WCAG del texto verde del kit de UI: axe lo marcaba a 3,1:1. */
const css = readFileSync(join(process.cwd(), 'components/case/uikit.module.css'), 'utf8');
const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
/* Cuerpo de la primera regla cuyo selector es exactamente `sel`. */
const rule = (sel: string) => {
  const start = css.indexOf(sel + ' {');
  expect(start, sel).toBeGreaterThanOrEqual(0);
  return css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
};
const prop = (body: string, p: string) => {
  const decl = body.split(';').map((d) => d.trim()).find((d) => d.startsWith(p + ':'))!;
  return decl.slice(p.length + 1).trim();
};

describe('contraste del kit', () => {
  it('el chip de estado OK llega a 4,5:1 sobre su fondo', () => {
    const b = rule('.cOk');
    expect(ratio(prop(b, 'color'), prop(b, 'background'))).toBeGreaterThanOrEqual(4.5);
  });
  it('el «Incluido» de los niveles llega a 4,5:1 sobre blanco', () => {
    expect(ratio(prop(rule('.tierRow em'), 'color'), '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });
});
