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

export function localeOf(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  return seg === 'en' ? 'en' : 'es';
}

/* La misma página en el otro idioma: solo cambia el primer segmento, que es lo
   que permite que el cambio de idioma sea una transición de cliente y no una
   recarga. Devuelve null si esa página no existe en el idioma pedido. */
export function altPath(pathname: string, to: Locale, hasEnCase: (slug: string) => boolean): string | null {
  const parts = pathname.split('/').filter(Boolean);
  const rest = parts.slice(1);
  if (to === 'en' && rest[0] === 'cases' && rest[1] && !hasEnCase(rest[1])) return null;
  return `/${[to, ...rest].join('/')}`;
}

/* Rutas del sitio por idioma. Mismos segmentos en los dos: el idioma va
   delante y el resto del camino no cambia. */
const routes = (l: Locale) => ({
  home: `/${l}`,
  work: `/${l}#trabajo`,
  contact: `/${l}#contacto`,
  about: `/${l}/about`,
  privacy: `/${l}/privacy`,
  cookies: `/${l}/privacy#cookies`,
  caseOf: (s: string) => `/${l}/cases/${s}`,
});
export const ROUTES = { es: routes('es'), en: routes('en') } as const;
