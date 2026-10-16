'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { getLenis } from '@/lib/motion/lenisStore';
import s from './designgallery.module.css';

export type GalleryShot = { src: string; alt: string; caption: string; width: number; height: number };
type Labels = { open: string; close: string; prev: string; next: string; of: string };

/* Galería bento del apartado Diseño, adaptada de «interactive bento gallery»
   (21st.dev) a CSS Modules y motion/react. Se queda con lo que ayuda a leer
   un caso: celdas de tamaños distintos, pie al pasar, visor a pantalla
   completa y el dock de miniaturas ladeadas. Fuera el arrastre para
   reordenar: cambiar el orden de las pantallas de un caso no aporta y
   compite con el clic.

   Las capturas van de tiras de 142×2134 a paneles de 1600 px, así que una
   rejilla fija recortaría de más o dejaría huecos. Se reparten en filas
   justificadas: cada fila suma relaciones de aspecto hasta ~2,4, cada celda
   ocupa de ancho lo que su proporción pide y todas comparten alto —con tope—.
   El visor nunca recorta: la captura se ve entera, a su tamaño como máximo. */
const clampA = (x: GalleryShot) => Math.min(2.4, Math.max(0.55, x.width / x.height));
function rows(items: GalleryShot[]) {
  const out: number[][] = [];
  let row: number[] = [], sum = 0;
  items.forEach((x, i) => {
    row.push(i); sum += clampA(x);
    if (sum >= 2.4 || row.length === 4) { out.push(row); row = []; sum = 0; }
  });
  if (row.length) {
    /* Una última fila con una sola captura estrecha quedaría enorme: se suma
       a la anterior. */
    if (out.length && sum < 1.2) out[out.length - 1].push(...row); else out.push(row);
  }
  return out;
}

export default function DesignGallery({ items, labels }: { items: GalleryShot[]; labels: Labels }) {
  const [open, setOpen] = useState<number | null>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const n = items.length;
  const go = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + n) % n)), [n]);
  const of = (i: number) => labels.of.replace('{i}', String(i + 1)).replace('{n}', String(n));

  return (
    <>
      <div className={s.grid}>
        {rows(items).map((r) => (
          <div key={r[0]} className={s.row} style={{ aspectRatio: r.reduce((a, i) => a + clampA(items[i]), 0) }}>
            {r.map((i) => {
              const it = items[i];
              return (
                <motion.button
                  key={it.src}
                  ref={(el) => { tiles.current[i] = el; }}
                  type="button"
                  className={s.tile}
                  style={{ '--a': clampA(it) } as React.CSSProperties}
                  onClick={() => setOpen(i)}
                  aria-label={`${labels.open}: ${it.caption}`}
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26, delay: (i % 4) * 0.06 }}
                  whileHover={{ scale: 1.015 }}
                >
                  <Image src={it.src} alt="" fill sizes="(max-width: 900px) 100vw, 640px" unoptimized={it.width <= 700} className={s.img} />
                  <span className={s.cap} aria-hidden="true"><span>{it.caption}</span></span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
      <Viewer items={items} index={open} labels={labels} of={of} go={go}
        onClose={() => { const i = open; setOpen(null); if (i !== null) tiles.current[i]?.focus(); }}
        onPick={setOpen} />
    </>
  );
}

function Viewer({ items, index, labels, of, go, onClose, onPick }: {
  items: GalleryShot[]; index: number | null; labels: Labels; of: (i: number) => string;
  go: (d: number) => void; onClose: () => void; onPick: (i: number) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isOpen = index !== null;

  /* Foco dentro mientras está abierto, Esc y flechas, y el fondo quieto
     —también el scroll suave de Lenis—, como el resto de diálogos. */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
    box.current?.querySelector<HTMLElement>('[data-close]')?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && box.current) {
        const f = [...box.current.querySelectorAll<HTMLElement>('button')];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = prev; getLenis()?.start(); };
  }, [isOpen, onClose, go]);

  if (!mounted) return null;
  const it = index !== null ? items[index] : null;
  return createPortal(
    <AnimatePresence>
      {it && index !== null && (
        <motion.div ref={box} className={s.viewer} role="dialog" aria-modal="true" aria-label={it.caption} data-lenis-prevent
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <button type="button" className={s.close} onClick={onClose} aria-label={labels.close} data-close>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" /></svg>
          </button>
          <span className={s.count} aria-live="polite">{of(index)}</span>

          <AnimatePresence mode="wait">
            <motion.figure key={it.src} className={s.stage} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
              initial={{ y: 20, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 } }}
              exit={{ y: 20, scale: 0.97, opacity: 0, transition: { duration: 0.15 } }}>
              <Image src={it.src} alt={it.alt} width={it.width} height={it.height} sizes="90vw" unoptimized={it.width <= 700} className={s.full} style={{ maxWidth: `min(100%, ${Math.min(it.width, 1400)}px)` }} />
              <figcaption className={s.fcap}>{it.caption}</figcaption>
            </motion.figure>
          </AnimatePresence>

          {items.length > 1 && <>
            <button type="button" className={`${s.arrow} ${s.prev}`} onClick={() => go(-1)} aria-label={labels.prev}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" /></svg>
            </button>
            <button type="button" className={`${s.arrow} ${s.next}`} onClick={() => go(1)} aria-label={labels.next}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" /></svg>
            </button>
            {/* Dock de miniaturas ladeadas, como el original: la activa se
                endereza y sube; al pasar, cualquiera se asoma. */}
            <div className={s.dock}>
              {items.map((x, i) => (
                <motion.button key={x.src} type="button" className={s.thumb} onClick={() => onPick(i)}
                  aria-label={`${of(i)}: ${x.caption}`} aria-current={i === index ? 'true' : undefined}
                  style={{ zIndex: i === index ? 30 : items.length - i }}
                  initial={false}
                  animate={{ scale: i === index ? 1.2 : 1, rotate: i === index ? 0 : i % 2 === 0 ? -12 : 12, y: i === index ? -8 : 0 }}
                  whileHover={{ scale: 1.3, rotate: 0, y: -10, transition: { type: 'spring', stiffness: 400, damping: 25 } }}>
                  <Image src={x.src} alt="" fill sizes="48px" className={s.img} />
                </motion.button>
              ))}
            </div>
          </>}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
