import { describe, it, expect } from 'vitest';
import { CASES, getCase, CASE_SLUGS } from './index';
import { PROJECTS } from '../projects';

describe('casos', () => {
  it('hay un caso por cada proyecto con hasCase, en el mismo orden', () => {
    expect(CASE_SLUGS).toEqual(PROJECTS.filter((p) => p.hasCase).map((p) => p.slug));
  });
  it('cada caso tiene todas las secciones y un siguiente válido', () => {
    for (const c of CASES) {
      expect(c.problem, c.slug).toHaveLength(2);
      expect(c.decisions.length, c.slug).toBeGreaterThanOrEqual(3);
      expect(c.decisions.length, c.slug).toBeLessThanOrEqual(5);
      expect(c.design.length, c.slug).toBeGreaterThanOrEqual(1);
      expect(c.implementation.length, c.slug).toBeGreaterThanOrEqual(1);
      expect(c.result.output.length, c.slug).toBeGreaterThanOrEqual(1);
      expect(c.result.measure.length, c.slug).toBeGreaterThan(20);
      expect(c.learnings, c.slug).toHaveLength(2);
      expect(CASE_SLUGS, c.slug).toContain(c.next);
      expect(c.next, c.slug).not.toBe(c.slug);
      for (const m of c.result.output) expect(m.meaning.length, m.label).toBeGreaterThan(20);
    }
  });
  it('los outcomes sin dato se declaran, no se inventan', () => {
    for (const c of CASES) expect(c.result.outcome, c.slug).toBe('unavailable');
  });
  it('no publica cifras del CV pendientes de confirmar', () => {
    const all = JSON.stringify(CASES);
    for (const bad of ['347', '5 a 2 días', '−60', '-60%', 'tickets diarios', '70 %']) expect(all).not.toContain(bad);
  });
  it('getCase devuelve undefined para slugs desconocidos', () => {
    expect(getCase('nada')).toBeUndefined();
  });
});
