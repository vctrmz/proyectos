import { describe, it, expect } from 'vitest';
import { SECTION_ORDER, SECTION_PHASE, PHASE_ROMAN, PHASE_WORDS } from './case-phases';

describe('Fases del caso', () => {
  it('cada sección tiene fase y el orden nunca vuelve atrás', () => {
    const phases = SECTION_ORDER.map((id) => SECTION_PHASE[id]);
    phases.forEach((p, i) => { if (i) expect(p).toBeGreaterThanOrEqual(phases[i - 1]); });
    expect(PHASE_ROMAN).toHaveLength(PHASE_WORDS.length);
  });
  it('el proceso cae en su fase: ideas al descubrir, boceto al desarrollar y entrega al entregar', () => {
    expect(PHASE_WORDS[SECTION_PHASE['c-proceso']]).toBe('Discover');
    expect(PHASE_WORDS[SECTION_PHASE['c-evolucion']]).toBe('Develop');
    expect(PHASE_WORDS[SECTION_PHASE['c-entrega']]).toBe('Deliver');
  });
});
