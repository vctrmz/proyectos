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

   Los subrayados son como los de la referencia: un trazo redondo de grosor
   constante, con las puntas redondas y una ondulación suave, que pasa por
   detrás de las letras (el texto queda encima). Un solo lila para las dos
   líneas. Se dibujan con una curva que acelera y frena como una mano, y se
   vuelven a trazar al pasar el ratón por la frase y al copiar. Con menos
   movimiento, quietos. La frase
   es un botón: copia el correo al portapapeles. La dirección sigue sin
   escribirse en la página, como en CopyEmail; si el portapapeles falla, se
   enseña para copiarla a mano. Debajo, las otras vías. */
type State = 'idle' | 'done' | 'error';

/* Dos trazos casi rectos y distintos, para que no parezcan copiados. El
   grosor va en unidades del dibujo, que escala con la línea de texto. */
const STROKE_1 = 'M6 11 C 150 7.5, 300 8.5, 450 8 S 570 6.5, 594 8.5';
const STROKE_2 = 'M6 9.5 C 160 12, 320 10.5, 470 10 S 580 9, 594 10.5';

function Underline({ delay, seen, d, run, fx }: { delay: number; seen: boolean; d: string; run: number; fx: boolean }) {
  const shown = seen || !fx;
  return (
    <svg className={s.under} viewBox="0 0 600 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <motion.path key={run} d={d} className={s.stroke} strokeWidth={7}
        initial={fx ? { pathLength: 0, opacity: 0 } : false}
        animate={shown ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ pathLength: { duration: 1, delay: run ? delay * 0.4 : delay, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.01, delay: run ? delay * 0.4 : delay } }} />
    </svg>
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
            <Underline seen={seen} delay={0.15} d={STROKE_1} run={run} fx={fx} />
          </span>
          <span className={s.line}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={state} className={state === 'idle' ? s.copy : s.ok}
                initial={{ y: '40%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-40%', opacity: 0 }} transition={{ duration: 0.3 }}>
                {state === 'done' ? 'Copiado.' : state === 'error' ? SITE.email : 'Copia mi correo.'}
              </motion.span>
            </AnimatePresence>
            <Underline seen={seen} delay={0.5} d={STROKE_2} run={run} fx={fx} />
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
