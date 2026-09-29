import type { Locale } from '@/lib/i18n/config';
import { CASES, getCase, type CaseStudy } from '@/lib/content/cases';
import { PROJECTS, SECTOR_LABEL, type Project, type Sector } from '@/lib/content/projects';
import { SECTORS, type SectorItem } from '@/lib/content/sectors';
import { ABOUT } from '@/lib/content/about';
import { EN_PROJECTS, EN_FILTERS, EN_SECTOR_LABEL, EN_TYPE_LABEL, EN_TAGS } from './projects';
import { EN_SECTORS } from './sectors';
import { ABOUT_EN } from './about';
import { hermesEn } from './cases/hermes';
import { STACK, type StackContent } from '@/lib/content/stack';
import { EN_STACK } from './stack';

/* Puente entre los dos idiomas. El español es la fuente: el inglés
   sobreescribe solo los textos, así que capturas, colores, sectores y orden
   viven en un único sitio.

   EN_CASE_SLUGS es la lista de casos que existen en inglés. El catálogo, el
   interruptor de idioma y el sitemap la consultan para no enlazar a páginas
   que todavía no están traducidas. */
const EN_CASES: CaseStudy[] = [hermesEn];
export const EN_CASE_SLUGS = EN_CASES.map((c) => c.slug);

export function getCaseIn(locale: Locale, slug: string): CaseStudy | undefined {
  if (locale === 'en') return EN_CASES.find((c) => c.slug === slug);
  return getCase(slug);
}
export const casesIn = (locale: Locale): CaseStudy[] => (locale === 'en' ? EN_CASES : CASES);

/* Proyectos con su título y resumen en el idioma pedido. */
export function projectsIn(locale: Locale): Project[] {
  if (locale === 'es') return PROJECTS;
  return PROJECTS.map((p) => {
    const t = EN_PROJECTS[p.slug];
    return t ? { ...p, title: t.title, company: t.company ?? p.company, summary: t.summary } : p;
  });
}
export const sectorLabelIn = (locale: Locale, sector: Exclude<Sector, null>): string =>
  locale === 'en' ? EN_SECTOR_LABEL[sector] ?? SECTOR_LABEL[sector] : SECTOR_LABEL[sector];
export const typeLabelIn = (locale: Locale, type: string, fallback: string): string =>
  locale === 'en' ? EN_TYPE_LABEL[type] ?? fallback : fallback;
export const filterLabelIn = (locale: Locale, id: string, fallback: string): string =>
  locale === 'en' ? EN_FILTERS[id] ?? fallback : fallback;
export const tagIn = (locale: Locale, tag: string): string => (locale === 'en' ? EN_TAGS[tag] ?? tag : tag);

/* Sectores: mismo recorrido, textos por idioma. */
export function sectorsIn(locale: Locale): SectorItem[] {
  if (locale === 'es') return SECTORS;
  return SECTORS.map((x) => {
    const t = EN_SECTORS[x.n];
    return t ? { ...x, name: t.name, company: t.company, body: t.body, cta: t.cta, href: t.href ?? x.href } : x;
  });
}

/* «Sobre mí» en el idioma pedido. */
export const aboutIn = (locale: Locale): typeof ABOUT => (locale === 'en' ? ABOUT_EN : ABOUT);

/* Stack: mismas herramientas, nombres de grupo por idioma. */
export const stackIn = (locale: Locale): StackContent => (locale === 'en' ? EN_STACK : STACK);
