'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import ContactButton from '@/components/contact/ContactButton';
import Button from '@/components/ui/Button';
import { SITE } from '@/lib/content/site';
import { motionAllowed } from '@/lib/motion/prefs';
import GlyphTitle from './GlyphTitle';
import s from './ContactBig.module.css';

/* El contacto del final, adaptado de tigranz.com: el título con glifos y una
   frase enorme con subrayados de colores que se dibujan al llegar.

   Los subrayados son trazos de pincel: una forma rellena que se afila en los
   dos extremos (no una línea de grosor fijo con la punta redonda), separada
   de los descendentes de la «¿» y la «p». Se revelan de izquierda a derecha
   con un recorte que acelera y frena como una mano, y se vuelven a trazar al
   pasar el ratón por la frase y al copiar. Con menos movimiento, quietos. La frase
   es un botón: copia el correo al portapapeles. La dirección sigue sin
   escribirse en la página, como en CopyEmail; si el portapapeles falla, se
   enseña para copiarla a mano. Debajo, las otras vías. */
type State = 'idle' | 'done' | 'error';

/* Dos trazos distintos para que no parezcan copiados: el primero casi recto,
   el segundo con un remate hacia arriba al final. */
const STROKE_1 = 'M2 11 C 140 4, 300 3.5, 440 5 S 560 7, 598 6 C 565 14, 450 15, 300 15.5 S 120 17, 2 11 Z';
const STROKE_2 = 'M2 9 C 150 11, 320 8.5, 470 8 S 575 6, 598 2 C 582 12, 480 17.5, 320 17.5 S 130 17, 2 9 Z';

function Underline({ color, delay, seen, d, run, fx }: { color: string; delay: number; seen: boolean; d: string; run: number; fx: boolean }) {
  return (
    <motion.svg key={run} className={s.under} viewBox="0 0 600 20" preserveAspectRatio="none" aria-hidden="true" focusable="false"
      initial={fx ? { clipPath: 'inset(0 100% 0 0)' } : false}
      animate={seen || !fx ? { clipPath: 'inset(0 0% 0 0)' } : undefined}
      transition={{ duration: 1.1, delay: run ? delay * 0.4 : delay, ease: [0.65, 0, 0.35, 1] }}>
      <path d={d} fill={color} />
    </motion.svg>
  );
}

export default function ContactBig() {
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { once: true, amount: 0.5 });
  const [state, setState] = useState<State>('idle');
  const [fx, setFx] = useState(false);
  const [run, setRun] = useState(0);
  const last = useRef(0);
  useEffect(() => { setFx(motionAllowed()); }, []);
  /* Volver a trazar, como mucho una vez cada 1,4 s: pasar el ratón de un
     lado a otro no debe convertirlo en un parpadeo. */
  const redraw = () => {
    const now = performance.now();
    if (!fx || !seen || now - last.current < 1400) return;
    last.current = now;
    setRun((r) => r + 1);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(SITE.email); setState('done'); redraw(); setTimeout(() => setState('idle'), 2400); }
    catch { setState('error'); }
  };

  return (
    <section id="contacto" className={s.band} aria-labelledby="contact-title">
      <div ref={box} className={`container ${s.inner}`}>
        <GlyphTitle text="contacto" icon="chat" at={1} id="contact-title" tone="dark" />

        <button type="button" className={s.big} onClick={copy} onPointerEnter={redraw} aria-describedby="contact-hint">
          <span className={s.line}>
            <span>¿Hablamos?</span>
            <Underline seen={seen} delay={0.15} color="var(--focus-on-night)" d={STROKE_1} run={run} fx={fx} />
          </span>
          <span className={s.line}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={state} className={state === 'idle' ? s.copy : s.ok}
                initial={{ y: '40%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-40%', opacity: 0 }} transition={{ duration: 0.3 }}>
                {state === 'done' ? 'Copiado.' : state === 'error' ? SITE.email : 'Copia mi correo.'}
              </motion.span>
            </AnimatePresence>
            <Underline seen={seen} delay={0.5} color="var(--accent)" d={STROKE_2} run={run} fx={fx} />
          </span>
        </button>
        <p id="contact-hint" className={s.hint} aria-live="polite">
          {state === 'done' ? 'Ya lo tienes en el portapapeles.' : state === 'error' ? 'No pude copiarlo: ahí lo tienes para copiarlo a mano.' : 'Un clic y lo tienes en el portapapeles.'}
        </p>

        <div className={s.foot}>
          <p className={s.available}><span className={s.dot} aria-hidden="true" />Disponible ahora · roles Senior o Lead de Product Design · en remoto</p>
          <div className={s.ctas}>
            <ContactButton size="lg" />
            <Button href={SITE.linkedin} external variant="outline" size="lg">LinkedIn</Button>
            <Button href={SITE.behance} external variant="outline" size="lg">Behance</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
