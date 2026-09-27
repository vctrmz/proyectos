'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ViewTransition } from 'react';
import type { Project } from '@/lib/content/projects';
import { projectTags } from '@/lib/content/projects';
import { EN_CASE_SLUGS, tagIn, typeLabelIn, sectorLabelIn } from '@/lib/content/en';
import { useLocale, useUi } from '@/lib/i18n/LocaleContext';
import { ROUTES } from '@/lib/i18n/config';
import { shotSize } from '@/lib/content/shots';
import Frame from '@/components/ui/Frame';
import BrandTile from './BrandTile';
import s from './ProjectCard.module.css';

/* La tarjeta entera es el enlace: un solo destino por pieza, con el área de
   pulsación completa en lugar de un botón dentro de otra zona pulsable. El
   enlace va encima de todo, así que el foco dibuja el marco de la tarjeta y
   el lector de pantalla anuncia una sola acción con su destino. */
export default function ProjectCard({ project: p }: { project: Project }) {
  const locale = useLocale();
  const ui = useUi();
  /* En inglés, un caso sin traducir se enlaza a su versión en español y se
     dice en la propia tarjeta: mejor un camino claro que un enlace muerto. */
  const enOnlyEs = locale === 'en' && !EN_CASE_SLUGS.includes(p.slug);
  const external = !p.hasCase && !!p.url;
  const href = p.hasCase ? (enOnlyEs ? ROUTES.es.caseOf(p.slug) : ROUTES[locale].caseOf(p.slug)) : p.url ?? ROUTES[locale].work;
  const action = p.hasCase
    ? (enOnlyEs ? `${ui.catalog.seeCase} (in Spanish)` : ui.catalog.seeCase)
    : external ? (locale === 'es' ? 'Ver el proyecto' : 'See the project') : ui.catalog.open;
  const label = external
    ? `${action}: ${p.title} · ${p.company} ${locale === 'es' ? '(abre en pestaña nueva)' : '(opens in a new tab)'}`
    : `${action}: ${p.title} · ${p.company}`;
  const tags = locale === 'en'
    ? [typeLabelIn(locale, p.type, p.type), 'In production', ...(p.sector && p.sector !== 'multi' ? [sectorLabelIn(locale, p.sector)] : [])]
    : projectTags(p);
  const size = p.image ? shotSize(p.image.src) : null;
  const media = p.image && size
    ? <Image src={p.image.src} alt={p.image.alt} width={size.width} height={size.height} sizes="(max-width: 768px) 100vw, 580px" />
    : <BrandTile project={p} />;
  return (
    <motion.li data-reveal layout layoutId={`card-${p.slug}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className={s.card}>
      {external
        ? <a href={href} target="_blank" rel="noopener" className={s.hit} aria-label={label} />
        : <Link href={href} className={s.hit} aria-label={label} />}
      <div className={s.top}>
        <h3 className={s.title}>{p.logo && <img src={p.logo} alt="" className={s.icon} loading="lazy" decoding="async" />}{p.title} · {p.company} · {p.years}</h3>
        <p className={s.tags}>{tags.map((t) => <span key={t}>{tagIn(locale, t)}</span>)}</p>
        <p className={s.sum}>{p.summary}</p>
        <p className={s.go} aria-hidden="true">{action} <span>{external ? '↗' : '→'}</span></p>
      </div>
      <div className={s.media}>
        <ViewTransition name={`case-${p.slug}`}>
          <Frame brand={p.brand} ratio="4/3">{media}</Frame>
        </ViewTransition>
      </div>
    </motion.li>
  );
}
