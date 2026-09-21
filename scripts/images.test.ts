import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PROJECTS } from '../lib/content/projects';
import { CASES } from '../lib/content/cases';

const root = process.cwd();
const manifestPath = join(root, 'public/assets/shots/manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const used = new Set<string>();
for (const p of PROJECTS) if (p.image) used.add(p.image.src);
for (const c of CASES) { used.add(c.hero.src); c.design.forEach((s) => used.add(s.src)); c.decisions.forEach((d) => { if (d.figure && 'shot' in d.figure) used.add(d.figure.shot.src); }); }

describe('capturas', () => {
  it('cada captura usada existe y está en el manifest con dimensiones', () => {
    expect(used.size).toBeGreaterThan(10);
    for (const src of used) {
      const name = src.replace('/assets/shots/', '').replace('.webp', '');
      expect(existsSync(join(root, 'public', src)), src).toBe(true);
      expect(manifest[name]?.width, src).toBeGreaterThan(0);
      expect(manifest[name]?.width, src).toBeLessThanOrEqual(1600);
    }
  });
});
