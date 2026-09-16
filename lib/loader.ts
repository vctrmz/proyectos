export const LOADER_KEY = 'vm-loader';
export const LOADER_EVENT = 'vm-loader-done';
export const MOBILE_QUERY = '(max-width: 820px)';

export function loaderSeen(): boolean {
  try { return sessionStorage.getItem(LOADER_KEY) === '1'; } catch { return false; }
}

export function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(MOBILE_QUERY).matches;
}

export function needsLoader(): boolean {
  return !loaderSeen() && !isMobileViewport();
}

export function markLoaderDone() {
  try { sessionStorage.setItem(LOADER_KEY, '1'); } catch {}
  window.dispatchEvent(new Event(LOADER_EVENT));
}

export function onLoaderDone(cb: () => void): () => void {
  window.addEventListener(LOADER_EVENT, cb);
  return () => window.removeEventListener(LOADER_EVENT, cb);
}
