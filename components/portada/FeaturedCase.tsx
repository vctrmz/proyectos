'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import RollingNumber from '@/components/motion/RollingNumber';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import type { PortadaCopy } from './copy';
import { Rise, Part } from './Rise';
import s from './FeaturedCase.module.css';

/* HERMES deja de ser una tarjeta más entre once: es el caso al que lleva el
   botón principal, así que ocupa la banda entera y enseña producto de verdad
   —dos pantallas reales de HERMES Admin— en vez de un diagrama.

   Las dos capturas se mueven con el scroll a ritmos distintos (la de detrás
   más lenta), lo justo para que se lean como capas de un mismo producto. Solo
   con puntero fino y sin «menos movimiento»: en el móvil quedan quietas. */
export default function FeaturedCase({ t, href }: { t: PortadaCopy['featured']; href: string }) {
  const box = useRef<HTMLElement>(null);
  const [fx, setFx] = useState(false);
  useEffect(() => { setFx(scrollEffectsAllowed()); }, []);
  const { scrollYProgress: p } = useScroll({ target: box, offset: ['start end', 'end start'] });
  const front = useTransform(p, [0, 1], [80, -60]);
  const back = useTransform(p, [0, 1], [20, -20]);
  const scale = useTransform(p, [0, 0.45], [0.94, 1]);

  return (
    <section ref={box} className={s.band} aria-labelledby="hermes-title">
      <div className={`container ${s.grid}`}>
        <Rise className={s.copy}>
          <Part as="h2" id="hermes-title" className={s.title}>{t.title}</Part>
          <Part as="p" className={s.meta}>{t.meta}</Part>
          <Part as="p" className={s.lead}>{t.lead}</Part>
          <Part as="ul" className={s.metrics}>
            {t.metrics.map((m) => (
              <li key={m.label}><RollingNumber value={m.value} className={s.num} /><span className={s.metricLabel}>{m.label}</span></li>
            ))}
          </Part>
          <Part>
            <Link href={href} className={s.cta}>
              {t.cta} <span aria-hidden="true">→</span>
            </Link>
          </Part>
        </Rise>

        <div className={s.media}>
          <motion.div className={s.back} style={fx ? { y: back } : undefined}>
            <Image src="/assets/shots/20-drawer-contrato.webp" alt="" width={1600} height={1178} sizes="(max-width: 767px) 80vw, 520px" className={s.img} />
          </motion.div>
          <motion.div className={s.front} style={fx ? { y: front, scale } : undefined}>
            <Image src="/assets/shots/08-planes-servicios.webp" alt={t.alt} width={1600} height={1166} sizes="(max-width: 767px) 92vw, 720px" className={s.img} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
