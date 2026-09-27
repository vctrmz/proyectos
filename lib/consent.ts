/*
 * Arranque condicional de la analítica. Cinco servicios, los cinco detrás del
 * mismo consentimiento: GA4, Microsoft Clarity, Hotjar, Plerdy y HubSpot.
 * Todos identifican al visitante, así que no se cargan hasta que acepta. Si
 * rechaza no se pide ni un solo recurso a googletagmanager.com, clarity.ms,
 * hotjar.com, plerdy.com ni hs-scripts.com.
 */
export const CONSENT_KEY = 'vm-consent';
export type Consent = 'granted' | 'denied' | null;

export const GA_ID = 'G-HZYDMMSVG5';
const GA_SRC = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
const GA_TAG = 'ga-gtag-loader';
const CLARITY_PROJECT = 'yd4g6685po';
const CLARITY_PKG = 'https://cdn.jsdelivr.net/npm/@microsoft/clarity@1.0.2/index.js';
const CLARITY_TAG = 'clarity-loader';
const HS_PORTAL = '148496979';
const HS_SRC = 'https://js-eu1.hs-scripts.com/' + HS_PORTAL + '.js'; // cuenta europea: js-eu1, no js
const HS_TAG = 'hs-script-loader';
const HJ_ID = 6776849;
const HJ_SV = 6;
const HJ_SRC = 'https://static.hotjar.com/c/hotjar-' + HJ_ID + '.js?sv=' + HJ_SV;
const HJ_TAG = 'hj-loader';
const PLERDY_HASH = '81690a1951e6290b7119405fec614b5d';
const PLERDY_SUID = 81035;
const PLERDY_SRC = 'https://a.plerdy.com/public/js/click/main.js';
const PLERDY_TAG = 'plerdy-loader';

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

/* Clarity, Hotjar y Plerdy no arrancan en local: cada sesión de desarrollo
   entraría en el proyecto como tráfico real. */
export function isLocalHost(h: string): boolean {
  return h === '' || h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '[::1]' ||
    /\.local$/.test(h) || /^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2[0-9]|3[01])\./.test(h);
}

function inject(id: string, src: string, extra?: (s: HTMLScriptElement) => void) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  s.src = src;
  if (extra) extra(s);
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

export function startHotjar() {
  if (isLocalHost(location.hostname)) return;
  const win = w();
  if (!win.hj) {
    const hj = function (...args: unknown[]) {
      const q = (hj as unknown as { q?: unknown[] });
      (q.q = q.q || []).push(args);
    };
    win.hj = hj;
  }
  win._hjSettings = { hjid: HJ_ID, hjsv: HJ_SV };
  inject(HJ_TAG, HJ_SRC);
}

/* Snippet oficial de Plerdy: las globales de configuración se definen siempre;
   la petición a plerdy.com, solo con permiso y fuera de local. */
export function startPlerdy() {
  const win = w();
  win._protocol = location.protocol === 'https:' ? 'https://' : 'http://';
  win._site_hash_code = PLERDY_HASH;
  win._suid = PLERDY_SUID;
  if (isLocalHost(location.hostname)) return;
  inject(PLERDY_TAG, PLERDY_SRC + '?v=' + Math.random(), (s) => { s.referrerPolicy = 'strict-origin-when-cross-origin'; });
}

export function startHubSpot() {
  inject(HS_TAG, HS_SRC, (s) => { s.defer = true; });
}

export function startAnalytics() {
  startGA();
  startClarity();
  startHotjar();
  startPlerdy();
  startHubSpot();
}

/* Retirar el consentimiento tiene que costar lo mismo que darlo. */
export function resetConsent() {
  try { localStorage.removeItem(CONSENT_KEY); } catch {}
  location.reload();
}

export function installConsentGlobals() {
  w().vmConsentReset = resetConsent;
}
