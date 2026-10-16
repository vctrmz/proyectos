import Hero from '@/components/home/Hero';
import { projectsIn, sectorLabelIn, EN_CASE_SLUGS } from '@/lib/content/en';
import { ROUTES, type Locale } from '@/lib/i18n/config';
import TypeHero from './TypeHero';
import FeaturedCase from './FeaturedCase';
import Thesis from './Thesis';
import GlyphTitle from './GlyphTitle';
import CaseIndex, { type IndexItem } from './CaseIndex';
import AboutCv from './AboutCv';
import Areas, { type Area } from './Areas';
import ContactBig from './ContactBig';
import { portadaCopy } from './copy';
import s from './portada.module.css';

/* La portada v2 (publicada el 2026-10-16), en los dos idiomas. La v1 se
   guardó en la rama portada-v1 de GitHub.

   Arriba, el hero de siempre (es el que retiene). Después, adaptado de
   tigranz.com: un hero tipográfico que abre la banda de HERMES, la tesis, los
   títulos de sección con glitch e icono, el trabajo con barra verde al pasar,
   Sobre mí sacado del CV, algunas áreas en las que he trabajado con lo que
   resolví en cada una y un contacto a tamaño cartel. El CV descargable se
   queda en Sobre mí; el colapso 267 → 24 se guardó para el caso HERMES
   (components/case/TokenCollapse).

   Los enlaces a casos se resuelven aquí: en inglés, un caso sin traducir
   lleva a su versión en español y lo dice. */
export default function Portada({ locale }: { locale: Locale }) {
  const t = portadaCopy(locale);
  const translated = (slug: string) => locale === 'es' || EN_CASE_SLUGS.includes(slug);
  const caseHref = (slug: string) => (translated(slug) ? ROUTES[locale] : ROUTES.es).caseOf(slug);

  /* El índice va agrupado por cliente: Ayax primero, después todo lo de
     Atrinium (Flesip y los módulos de HERMES), Montsaint, Mercantil y Taksio.
     Dentro de cada cliente se respeta el orden del catálogo. */
  const CLIENTS = ['ayax', 'atrinium', 'montsaint', 'mercantil', 'taksio'];
  const clientOf = (company: string) => {
    const c = company.toLowerCase();
    if (c.includes('ayax')) return 'ayax';
    if (c.includes('atrinium') || c.includes('hermes') || c.includes('flesip')) return 'atrinium';
    if (c.includes('montsaint')) return 'montsaint';
    if (c.includes('mercantil')) return 'mercantil';
    if (c.includes('taksio')) return 'taksio';
    return '';
  };
  const rank = (company: string) => { const i = CLIENTS.indexOf(clientOf(company)); return i < 0 ? CLIENTS.length : i; };
  const ordered = projectsIn(locale).filter((p) => p.slug !== 'hermes')
    .map((p, i) => ({ p, i })).sort((x, y) => rank(x.p.company) - rank(y.p.company) || x.i - y.i).map(({ p }) => p);
  const index: IndexItem[] = ordered.map((p) => ({
    slug: p.slug, title: p.title, meta: [t.kinds[p.slug], p.company, p.years].filter(Boolean).join(' · '),
    sector: p.sector ? sectorLabelIn(locale, p.sector) : '',
    href: p.hasCase ? caseHref(p.slug) : p.url ?? '#', external: !p.hasCase,
    note: p.hasCase && !translated(p.slug) ? ` · ${t.work.inSpanish}` : '',
    image: p.image ? { src: p.image.src } : undefined,
  }));
  const areas: Area[] = t.areas.items.map((a) => ({
    id: a.id, name: a.name, icon: a.icon, years: a.years, body: a.body, users: a.users, flows: a.flows, limits: a.limits,
    href: a.slug ? caseHref(a.slug) : a.href!, external: !a.slug,
    cta: a.slug && !translated(a.slug) ? `${a.cta} (${t.work.inSpanish})` : a.cta,
  }));

  return (
    <>
      <Hero locale={locale} />

      <TypeHero band={t.band} />
      <FeaturedCase t={t.featured} href={caseHref('hermes')} />

      <Thesis text={t.thesis.text} label={t.thesis.label} />

      <section id="trabajo" className={`container ${s.section}`} aria-labelledby="work-title">
        <div className={s.head}>
          <GlyphTitle text={t.work.title} icon="sparkle" at={t.work.at} id="work-title" />
          <p className={s.headLead}>{t.work.lead}</p>
        </div>
        <CaseIndex items={index} />
      </section>

      <section id="sobre-mi" className={`container ${s.section}`} aria-labelledby="about-title">
        <div className={s.head}><GlyphTitle text={t.about.title} icon="pen" at={t.about.at} id="about-title" /></div>
        <AboutCv locale={locale} />
      </section>

      <section id="areas" className={`container ${s.section} ${s.last}`} aria-labelledby="areas-title">
        <div className={s.head}>
          <GlyphTitle text={t.areas.title} icon="cursor" at={t.areas.at} id="areas-title" />
          <p className={s.headLead}>{t.areas.lead}</p>
        </div>
        <Areas items={areas} labels={{ group: t.areas.group, users: t.areas.users, flows: t.areas.flows, limits: t.areas.limits }} />
      </section>

      <ContactBig t={t.contact} />
    </>
  );
}
