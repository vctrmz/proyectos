/* Dos idiomas con el idioma en la URL, como en Ayax: el español vive en las
   rutas actuales y el inglés cuelga de /en. Así no se rompe ningún enlace ya
   publicado y cada versión es enlazable, compartible e indexable por separado.

   PAIRS es la tabla de equivalencias: el interruptor de idioma necesita saber
   a qué página del otro idioma va, no solo cambiar un prefijo. */
export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const LOCALE_LABEL: Record<Locale, { name: string; short: string; aria: string }> = {
  es: { name: 'Español', short: 'ES', aria: 'Ver esta página en español' },
  en: { name: 'English', short: 'EN', aria: 'View this page in English' },
};

/* Segmentos traducidos: /sobre-mi ↔ /en/about. */
const SEGMENTS: Record<string, string> = { 'sobre-mi': 'about', casos: 'cases', privacidad: 'privacy' };
const BACK = Object.fromEntries(Object.entries(SEGMENTS).map(([es, en]) => [en, es]));

export function localeOf(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

/* La misma página en el otro idioma. Devuelve null si no existe equivalente:
   el interruptor no manda a una página que no está traducida. */
export function altPath(pathname: string, to: Locale, hasEnCase: (slug: string) => boolean): string | null {
  const from = localeOf(pathname);
  if (from === to) return pathname;
  const parts = pathname.replace(/^\/(en)(?=\/|$)/, '').split('/').filter(Boolean);
  if (to === 'en') {
    if (!parts.length) return '/en';
    if (parts[0] === 'casos') return parts[1] && hasEnCase(parts[1]) ? `/en/cases/${parts[1]}` : null;
    const seg = SEGMENTS[parts[0]];
    return seg ? `/en/${seg}` : null;
  }
  if (!parts.length) return '/';
  if (parts[0] === 'cases') return parts[1] ? `/casos/${parts[1]}` : null;
  const seg = BACK[parts[0]];
  return seg ? `/${seg}` : null;
}

/* Rutas del sitio por idioma, para navegación y enlaces internos. */
export const ROUTES = {
  es: { home: '/', work: '/#trabajo', about: '/sobre-mi', privacy: '/privacidad', cookies: '/privacidad#cookies', caseOf: (s: string) => `/casos/${s}` },
  en: { home: '/en', work: '/en#work', about: '/en/about', privacy: '/en/privacy', cookies: '/en/privacy#cookies', caseOf: (s: string) => `/en/cases/${s}` },
} as const;
