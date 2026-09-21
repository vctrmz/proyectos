import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');

describe('tokens', () => {
  it('define los tokens del sistema', () => {
    for (const t of ['--bg', '--ink', '--ink-2', '--ink-3', '--surface', '--line', '--inset-bg', '--inset-ink', '--accent', '--focus', '--r-media', '--r-card', '--r-pill', '--fs-100', '--fs-1100', '--sp-8', '--sp-128', '--container']) {
      expect(css, t).toContain(t + ':');
    }
  });
  it('no usa los grises retirados ni fuentes antiguas', () => {
    for (const bad of ['#6d6d6d', '#4d4d4d', '#878787', '#262626', 'bebas', 'montserrat', 'remixicon']) {
      expect(css.toLowerCase(), bad).not.toContain(bad);
    }
  });
  it('tiene focus-visible global y reduced-motion', () => {
    expect(css).toMatch(/:focus-visible\s*\{/);
    expect(css).toContain('prefers-reduced-motion: reduce');
  });
});
