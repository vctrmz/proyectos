import { describe, it, expect } from 'vitest';
import { CASES } from './cases';
import { buildFilm, tc, SECTION_ORDER } from './film';

describe('film del caso', () => {
  it.each(CASES.map((c) => [c.slug, c] as const))('%s: un plano por sección, con pantallas y en orden', (_, c) => {
    const opt: Record<string, unknown> = { 'c-demo': c.demo, 'c-reto': c.challenge, 'c-audiencias': c.audiences, 'c-flujos': c.flows, 'c-hallazgos': c.findings };
    const ids = SECTION_ORDER.filter((id) => !(id in opt) || opt[id]);
    const film = buildFilm(c, ids);
    for (const id of ids) expect(film.shots.filter((s) => s.section === id)).toHaveLength(1);
    expect(film.shots[0].kind).toBe('open');
    expect(film.shots.at(-1)!.kind).toBe('end');
    film.shots.forEach((s, i) => {
      expect(s.i).toBe(i);
      if (i) expect(s.start).toBeCloseTo(film.shots[i - 1].start + film.shots[i - 1].dur);
      if (['scatter', 'split', 'focus', 'tilt', 'tour', 'open'].includes(s.kind)) expect(s.imgs.length).toBeGreaterThan(0);
    });
    expect(film.total).toBeGreaterThan(30);
  });
  it('cuenta el tiempo a 24 fotogramas por segundo', () => {
    expect(tc(0)).toBe('00:00:00');
    expect(tc(61.5)).toBe('01:01:12');
  });
});
