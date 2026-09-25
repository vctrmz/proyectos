import { describe, it, expect } from 'vitest';
import { CASES, getCase, CASE_SLUGS } from './index';
import { EN_CASE_SLUGS, getCaseIn } from '../en';
import { PROJECTS } from '../projects';

describe('casos', () => {
  it('hay un caso por cada proyecto con hasCase, en el mismo orden', () => {
    expect(CASE_SLUGS).toEqual(PROJECTS.filter((p) => p.hasCase).map((p) => p.slug));
  });
  it('cada caso tiene todas las secciones y un siguiente válido', () => {
    for (const c of CASES) {
      expect(c.problem, c.slug).toHaveLength(2);
      expect(c.decisions.length, c.slug).toBeGreaterThanOrEqual(3);
      expect(c.decisions.length, c.slug).toBeLessThanOrEqual(6);
      expect(c.design.length, c.slug).toBeGreaterThanOrEqual(1);
      expect(c.implementation.length, c.slug).toBeGreaterThanOrEqual(1);
      expect(c.result.output.length, c.slug).toBeGreaterThanOrEqual(1);
      expect(c.result.measure.length, c.slug).toBeGreaterThan(20);
      expect(c.learnings.length, c.slug).toBeGreaterThanOrEqual(2);
      expect(c.learnings.length, c.slug).toBeLessThanOrEqual(5);
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
  it('cada caso trae su propio kit del sistema', () => {
    for (const c of CASES) {
      expect(c.system.uiKit, c.slug).toBeDefined();
      expect(c.system.uiKit!.length, c.slug).toBeGreaterThanOrEqual(3);
    }
    const firmas = CASES.map((c) => c.system.uiKit!.map((p) => p.kind).join('+'));
    expect(new Set(firmas).size).toBe(firmas.length);
  });
  it('los bloques opcionales, si existen, vienen completos', () => {
    for (const c of CASES) {
      if (c.challenge) for (const t of c.challenge.items) expect(t.body.length, c.slug).toBeGreaterThan(30);
      if (c.audiences) for (const a of c.audiences.items) { expect(a.question.length, c.slug).toBeGreaterThan(10); expect(a.exit.length, c.slug).toBeGreaterThan(3); }
      if (c.flows) for (const f of c.flows.list) expect(f.steps.length, c.slug).toBeGreaterThanOrEqual(3);
      if (c.findings) for (const f of c.findings.items) expect(['crítica', 'alta', 'media', 'baja'], c.slug).toContain(f.severity);
    }
  });
  it('los casos traducidos al inglés están completos y no se enlazan a sí mismos', () => {
    for (const slug of EN_CASE_SLUGS) {
      const c = getCaseIn('en', slug)!;
      expect(c, slug).toBeDefined();
      expect(c.next, slug).not.toBe(c.slug);
      expect(c.problem, slug).toHaveLength(2);
      expect(c.decisions.length, slug).toBeGreaterThanOrEqual(3);
      expect(c.result.outcome, slug).toBe('unavailable');
      /* nada de español suelto en la versión inglesa */
      const texto = JSON.stringify({ ...c, hero: c.hero.alt, design: c.design.map((d) => d.caption) });
      for (const palabra of [' el ', ' la ', ' que ', ' para ', ' con ']) expect(texto, `${slug}: ${palabra}`).not.toContain(palabra);
    }
  });
  it('getCase devuelve undefined para slugs desconocidos', () => {
    expect(getCase('nada')).toBeUndefined();
  });
});
