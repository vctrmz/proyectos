import { describe, it, expect, vi } from 'vitest';
import { loaderSeen, needsLoader, markLoaderDone, onLoaderDone, LOADER_KEY } from './loader';

describe('loader', () => {
  it('hace falta en la primera visita de escritorio', () => {
    expect(loaderSeen()).toBe(false);
    expect(needsLoader()).toBe(true);
  });
  it('no hace falta si ya se vio en la sesión', () => {
    sessionStorage.setItem(LOADER_KEY, '1');
    expect(needsLoader()).toBe(false);
  });
  it('no hace falta en móvil', () => {
    const mm = vi.spyOn(window, 'matchMedia').mockImplementation((q) => ({ matches: q === '(max-width: 820px)', media: q } as MediaQueryList));
    expect(needsLoader()).toBe(false);
    mm.mockRestore();
  });
  it('markLoaderDone guarda la marca y avisa a los suscriptores', () => {
    const cb = vi.fn();
    const off = onLoaderDone(cb);
    markLoaderDone();
    expect(sessionStorage.getItem(LOADER_KEY)).toBe('1');
    expect(cb).toHaveBeenCalledTimes(1);
    off();
    markLoaderDone();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
