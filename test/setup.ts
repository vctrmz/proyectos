import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
    dispatchEvent() { return false; },
  })) as unknown as typeof window.matchMedia;
}

class FakeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
Object.assign(globalThis, { IntersectionObserver: FakeObserver, ResizeObserver: FakeObserver });

const chain = () => {
  const tl: Record<string, unknown> = {};
  for (const k of ['to', 'from', 'fromTo', 'set', 'add']) tl[k] = () => tl;
  tl.kill = () => {};
  return tl;
};
const fakeGsap = {
  to: vi.fn(), from: vi.fn(), fromTo: vi.fn(), set: vi.fn(), killTweensOf: vi.fn(), registerPlugin: vi.fn(),
  timeline: () => chain(),
  quickTo: () => vi.fn(),
  utils: {
    clamp: (a: number, b: number, v: number) => Math.min(b, Math.max(a, v)),
    mapRange: (a: number, b: number, c: number, d: number, v: number) => c + ((v - a) / (b - a)) * (d - c),
  },
};
vi.mock('gsap', () => ({ gsap: fakeGsap, default: fakeGsap }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { refresh: vi.fn(), create: vi.fn(), getAll: () => [] } }));
