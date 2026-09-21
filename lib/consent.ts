/*
 * Arranque condicional de la analítica. Dos servicios detrás del mismo
 * consentimiento: GA4 y Microsoft Clarity. Ambos identifican al visitante,
 * así que no se cargan hasta que acepta; si rechaza no se pide ningún
 * recurso a googletagmanager.com ni a clarity.ms.
 */
export const CONSENT_KEY = 'vm-consent';
export type Consent = 'granted' | 'denied' | null;

export const GA_ID = 'G-HZYDMMSVG5';
const GA_SRC = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
const GA_TAG = 'ga-gtag-loader';
const CLARITY_PROJECT = 'yd4g6685po';
const CLARITY_PKG = 'https://cdn.jsdelivr.net/npm/@microsoft/clarity@1.0.2/index.js';
const CLARITY_TAG = 'clarity-loader';

type W = Window & Record<string, unknown>;
const w = () => window as unknown as W;

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch { return null; }
}

export function writeConsent(v: 'granted' | 'denied') {
  try { localStorage.setItem(CONSENT_KEY, v); } catch {}
}

/* Clarity no arranca en local: cada sesión de desarrollo entraría en el
   proyecto como tráfico real. */
export function isLocalHost(h: string): boolean {
  return h === '' || h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '[::1]' ||
    /\.local$/.test(h) || /^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2[0-9]|3[01])\./.test(h);
}

function inject(id: string, src: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

export function startGA() {
  if (document.getElementById(GA_TAG)) return;
  // La cola se crea antes de cargar gtag.js: lo que se encole ahora se procesa
  // en cuanto llegue. Tiene que empujar `arguments` tal cual.
  const win = w();
  const dl = (win.dataLayer as unknown[] | undefined) || [];
  win.dataLayer = dl;
  function gtag() { dl.push(arguments); }
  win.gtag = gtag;
  (gtag as unknown as (...a: unknown[]) => void)('js', new Date());
  (gtag as unknown as (...a: unknown[]) => void)('config', GA_ID);
  inject(GA_TAG, GA_SRC);
}

export function startClarity() {
  if (isLocalHost(location.hostname) || document.getElementById(CLARITY_TAG)) return;
  // Módulo inline en vez de import() dinámico: así el bundler no intenta
  // resolver la URL del CDN en build.
  const s = document.createElement('script');
  s.id = CLARITY_TAG;
  s.type = 'module';
  s.textContent = "import('" + CLARITY_PKG + "').then(m => m.default.init('" + CLARITY_PROJECT + "')).catch(() => {});";
  document.head.appendChild(s);
}

export function startAnalytics() {
  startGA();
  startClarity();
}

/* Retirar el consentimiento tiene que costar lo mismo que darlo. */
export function resetConsent() {
  try { localStorage.removeItem(CONSENT_KEY); } catch {}
  location.reload();
}

export function installConsentGlobals() {
  w().vmConsentReset = resetConsent;
}
