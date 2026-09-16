import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import Loader, { LOADER_MS } from './Loader';
import { LOADER_KEY, LOADER_EVENT } from '@/lib/loader';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'] });
});
afterEach(() => vi.useRealTimers());

describe('Loader', () => {
  it('cuenta hasta 100 y avisa a los 1,6 s', () => {
    const done = vi.fn();
    window.addEventListener(LOADER_EVENT, done);
    const { container } = render(<Loader />);
    const root = container.querySelector('[data-loader]') as HTMLElement;
    expect(root.style.opacity).toBe('1');
    act(() => { vi.advanceTimersByTime(700); });
    const mid = parseInt(root.querySelector('[data-count]')!.textContent!, 10);
    expect(mid).toBeGreaterThan(20);
    expect(mid).toBeLessThan(90);
    act(() => { vi.advanceTimersByTime(LOADER_MS - 700 + 50); });
    expect(root.querySelector('[data-count]')).toHaveTextContent('100');
    expect(done).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(LOADER_KEY)).toBe('1');
    expect(root.style.opacity).toBe('0');
    window.removeEventListener(LOADER_EVENT, done);
  });
  it('si ya se vio en la sesión no bloquea y avisa de inmediato', () => {
    sessionStorage.setItem(LOADER_KEY, '1');
    const done = vi.fn();
    window.addEventListener(LOADER_EVENT, done);
    const { container } = render(<Loader />);
    const root = container.querySelector('[data-loader]') as HTMLElement;
    expect(root.style.opacity).toBe('0');
    expect(done).toHaveBeenCalledTimes(1);
    window.removeEventListener(LOADER_EVENT, done);
  });
  it('LOADER_MS es 1600', () => { expect(LOADER_MS).toBe(1600); });
});
