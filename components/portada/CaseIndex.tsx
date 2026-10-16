'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import s from './CaseIndex.module.css';

/* El resto del trabajo como índice y no como once tarjetas iguales: una fila
   por proyecto, con empresa, años y sector, que se lee en diagonal. Con
   ratón, la captura real del proyecto sigue al cursor con un muelle; en
   pantallas táctiles la miniatura va dentro de la fila. HERMES no se repite:
   ya tiene su banda. */
export type IndexItem = { slug: string; title: string; meta: string; sector: string; href: string; external: boolean; note: string; image?: { src: string } };

export default function CaseIndex({ items }: { items: IndexItem[] }) {
  const [hover, setHover] = useState<IndexItem | null>(null);
  const [fine, setFine] = useState(false);
  useEffect(() => { setFine(scrollEffectsAllowed()); }, []);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  return (
    <div className={s.wrap} onPointerMove={(e) => { x.set(e.clientX); y.set(e.clientY); }} onPointerLeave={() => setHover(null)}>
      <ul className={s.list}>
        {items.map((p) => {
          const external = p.external;
          return (
            <li key={p.slug}>
              <Link href={p.href} className={s.row} {...(external ? { target: '_blank', rel: 'noopener' } : {})}
                onPointerEnter={() => setHover(p)} onFocus={() => setHover(null)}>
                {p.image && <Image src={p.image.src} alt="" width={96} height={72} className={s.thumb} sizes="96px" />}
                <span className={s.title}>{p.title}</span>
                <span className={s.meta}>{p.meta}{p.note}</span>
                <span className={s.sector}>{p.sector}</span>
                <span className={s.arrow} aria-hidden="true">{external ? '↗' : '→'}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {fine && (
        <motion.div className={s.preview} style={{ x: sx, y: sy }} aria-hidden="true">
          <AnimatePresence mode="popLayout">
            {hover?.image && (
              <motion.div key={hover.slug} className={s.frame}
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}>
                <Image src={hover.image.src} alt="" fill sizes="360px" className={s.img} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
