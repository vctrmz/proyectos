'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { motionAllowed } from '@/lib/motion/prefs';
import GlitchText from '@/components/ui/GlitchText';
import { Icon } from './icons';
import s from './TypeHero.module.css';

/* El hero tipográfico, adaptado de tigranz.com a lo que hace Víctor.
   «PRODUCT» recorre el proceso, letra a letra y en monocromo: wireframe,
   contorno y sólido; en el contorno, la O es el cursor de Figma, el único
   acento de color. «DESIGNER» lleva el glitch de siempre (GlitchText). Sobre la palabra que señalas aparece una selección de
   Figma, con sus tiradores y sus medidas en píxeles; sin puntero descansa
   en «DESIGNER». Debajo, una banda en bucle con quién, qué y dónde.

   Con menos movimiento: la palabra queda en sólido, sin ciclo, y la banda se
   detiene. Sin JavaScript se lee igual: son dos palabras en un h2. */
const MODES = ['wire', 'outline', 'solid'] as const;
type Mode = (typeof MODES)[number];
const BAND = ['Víctor Maza', 'Senior Product Designer', 'Design systems', 'B2B SaaS', 'Insurtech', 'En remoto'];

type Box = { x: number; y: number; w: number; h: number };

export default function TypeHero() {
  const wrap = useRef<HTMLDivElement>(null);
  const words = [useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null)];
  const seen = useInView(wrap, { amount: 0.3 });
  const [mode, setMode] = useState<Mode>('solid');
  const [target, setTarget] = useState(1);
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    if (!seen || !motionAllowed()) return;
    let i = 0;
    setMode(MODES[0]);
    const t = setInterval(() => { i = (i + 1) % MODES.length; setMode(MODES[i]); }, 1500);
    return () => clearInterval(t);
  }, [seen]);

  const measure = useCallback(() => {
    const host = wrap.current, el = words[target].current;
    if (!host || !el) return;
    const a = host.getBoundingClientRect(), b = el.getBoundingClientRect();
    setBox({ x: b.left - a.left, y: b.top - a.top, w: b.width, h: b.height });
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => { measure(); }, [measure, mode]);
  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <section className={s.band} aria-labelledby="type-hero">
      <div ref={wrap} className={`container ${s.stage}`} onPointerLeave={() => setTarget(1)}>
        <h2 id="type-hero" className={s.type}>
          <span ref={words[0]} className={`${s.word} ${s[mode]}`} onPointerEnter={() => setTarget(0)}>
            {[...'PRODUCT'].map((c, i) => (
              <span key={i} className={s.slot}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={mode} className={s.ch}
                    initial={{ y: '55%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-55%', opacity: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.035, ease: [0.22, 1, 0.36, 1] }}>
                    {mode === 'outline' && c === 'O' ? <span className={s.glyph}><Icon name="cursor" /><span className={s.ghostCh}>O</span></span> : c}
                  </motion.span>
                </AnimatePresence>
              </span>
            ))}
          </span>
          <span ref={words[1]} className={`${s.word} ${s.solid}`} onPointerEnter={() => setTarget(1)}><GlitchText text="DESIGNER" /></span>
        </h2>

        {box && (
          <motion.div className={s.sel} aria-hidden="true" initial={false}
            animate={{ x: box.x - 6, y: box.y - 2, width: box.w + 12, height: box.h + 4 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
            <i className={`${s.h} ${s.tl}`} /><i className={`${s.h} ${s.tr}`} /><i className={`${s.h} ${s.bl}`} /><i className={`${s.h} ${s.br}`} />
            <span className={s.size}>{Math.round(box.w)} × {Math.round(box.h)}</span>
          </motion.div>
        )}
      </div>

      <div className={s.marquee} aria-hidden="true">
        <div className={s.track}>
          {[0, 1].map((copy) => BAND.map((t, i) => (
            <span key={`${copy}-${i}`} className={`${s.item} ${s[`v${i % 3}`]}`}>{t}<i className={s.sep} /></span>
          )))}
        </div>
      </div>
    </section>
  );
}
