import { describe, it, expect, vi, afterEach } from 'vitest';
import { motionAllowed, scrollEffectsAllowed } from './prefs';

const mm = (map: Record<string, boolean>) => vi.spyOn(window, 'matchMedia').mockImplementation((q: string) => ({ matches: !!map[q], media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false }) as MediaQueryList);
afterEach(() => vi.restoreAllMocks());

describe('gating de motion', () => {
  it('todo permitido en escritorio sin preferencia', () => {
    mm({});
    expect(motionAllowed()).toBe(true);
    expect(scrollEffectsAllowed()).toBe(true);
  });
  it('reduced-motion apaga todo', () => {
    mm({ '(prefers-reduced-motion: reduce)': true });
    expect(motionAllowed()).toBe(false);
    expect(scrollEffectsAllowed()).toBe(false);
  });
  it('táctil apaga solo los efectos de scroll', () => {
    mm({ '(pointer: coarse)': true });
    expect(motionAllowed()).toBe(true);
    expect(scrollEffectsAllowed()).toBe(false);
  });
});
