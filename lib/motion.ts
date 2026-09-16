import { isMobileViewport } from './loader';

/* `light` corta todo lo que cuesta caro: móvil o prefers-reduced-motion. */
export function isLight(): boolean {
  if (typeof window === 'undefined') return true;
  return isMobileViewport() || (!!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
