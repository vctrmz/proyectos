'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ViewTransition } from 'react';
import type { Project } from '@/lib/content/projects';
import { EN_CASE_SLUGS } from '@/lib/content/en';
import { useLocale, useUi } from '@/lib/i18n/LocaleContext';
import { ROUTES } from '@/lib/i18n/config';
import Frame from '@/components/ui/Frame';
import BrandTile from './BrandTile';
import Lamina, { hasLamina } from './Lamina';
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
  /* La portada es un diagrama de la idea del caso: lámina clara, título
     grande y el resumen debajo, como un índice de guías. Quién y cuándo van
     al pie, en pequeño: orientan sin competir con el título. */
  return (
    <motion.li data-reveal layout layoutId={`card-${p.slug}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className={s.card}>
      {external
        ? <a href={href} target="_blank" rel="noopener" className={s.hit} aria-label={label} />
        : <Link href={href} className={s.hit} aria-label={label} />}
      <div className={s.media}>
        <ViewTransition name={`case-${p.slug}`}>
          {hasLamina(p.slug)
            ? <Lamina slug={p.slug} locale={locale} />
            : <Frame brand={p.brand} ratio="16/10"><BrandTile project={p} /></Frame>}
        </ViewTransition>
      </div>
      <h3 className={s.title}>{p.title}</h3>
      <p className={s.sum}>{p.summary}</p>
      <p className={s.meta}>
        <span>{p.company}</span><span>{p.years}</span>
        {enOnlyEs && <span>in Spanish</span>}
        {external && (
          <span className={s.ext}>{new URL(href).hostname.replace(/^www\./, '')}
            <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3.5 2.5h6v6M9.5 2.5l-7 7" /></svg>
          </span>
        )}
      </p>
    </motion.li>
  );
}
