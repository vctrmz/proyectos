import { describe, it, expect } from 'vitest';
import { CASES } from '.';
import { PROCESS, WIRES } from './process';
import { shotSize } from '../shots';
import manifest from '@/public/assets/shots/manifest.json';

describe('Proceso de los casos', () => {
  it('cada caso cuenta su proceso, del brief al handoff', () => {
    for (const c of CASES) {
      const p = PROCESS[c.slug];
      expect(p, c.slug).toBeDefined();
      for (const t of [p.brief, p.bench, p.ideas, p.evolve.text, p.handoff.text]) {
        expect(t.length, c.slug).toBeGreaterThan(20);
        expect(t, `${c.slug}: sin rayas largas`).not.toMatch(/—/);
      }
    }
  });
  it('las pantallas existen y el wireframe cae dentro de ellas', () => {
    const M = manifest as Record<string, unknown>;
    for (const [slug, p] of Object.entries(PROCESS)) {
      for (const s of [p.evolve.shot, p.handoff.shot].filter(Boolean)) {
        expect(M[s!.src.replace('/assets/shots/', '').replace('.webp', '')], `${slug}: ${s!.src}`).toBeDefined();
        expect(shotSize(s!.src).width).toBeGreaterThan(0);
      }
      for (const [k, x, y, w, h] of p.evolve.wire) {
        expect(x, `${slug} ${k}`).toBeGreaterThanOrEqual(0);
        expect(y, `${slug} ${k}`).toBeGreaterThanOrEqual(0);
        expect(x + w, `${slug} ${k}`).toBeLessThanOrEqual(100.5);
        expect(y + h, `${slug} ${k}`).toBeLessThanOrEqual(100.5);
      }
    }
    expect(Object.keys(WIRES).sort()).toEqual(CASES.map((c) => c.slug).sort());
  });
});
