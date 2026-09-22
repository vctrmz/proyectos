'use client';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ViewTransition } from 'react';
import type { Project } from '@/lib/content/projects';
import { projectTags } from '@/lib/content/projects';
import { shotSize } from '@/lib/content/shots';
import Frame from '@/components/ui/Frame';
import Button from '@/components/ui/Button';
import BrandTile from './BrandTile';
import s from './ProjectCard.module.css';

export default function ProjectCard({ project: p }: { project: Project }) {
  const size = p.image ? shotSize(p.image.src) : null;
  const media = p.image && size
    ? <Image src={p.image.src} alt={p.image.alt} width={size.width} height={size.height} sizes="(max-width: 768px) 100vw, 580px" />
    : <BrandTile project={p} />;
  return (
    <motion.li data-reveal layout layoutId={`card-${p.slug}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className={s.card}>
      <div className={s.top}>
        <h3 className={s.title}><img src={p.logo} alt="" className={s.icon} loading="lazy" decoding="async" />{p.title} · {p.company} · {p.years}</h3>
        <p className={s.tags}>{projectTags(p).map((t) => <span key={t}>{t}</span>)}</p>
        <p className={s.sum}>{p.summary}</p>
      </div>
      <div className={s.media}>
        <ViewTransition name={`case-${p.slug}`}>
          <Frame brand={p.brand} ratio="4/3">{media}</Frame>
        </ViewTransition>
        {p.hasCase && <Button href={`/casos/${p.slug}`} className={s.cta} aria-label={`Ver caso: ${p.title}`}>Ver caso</Button>}
        {!p.hasCase && p.url && <a href={p.url} target="_blank" rel="noopener" className={s.link} aria-label={`${p.title} · ${p.company} (abre en pestaña nueva)`}><span className="visually-hidden">Abrir</span></a>}
      </div>
    </motion.li>
  );
}
