'use client';
import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import ContactButton from '@/components/contact/ContactButton';
import Button from '@/components/ui/Button';
import { SITE } from '@/lib/content/site';
import GlyphTitle from './GlyphTitle';
import s from './ContactBig.module.css';

/* El contacto del final, adaptado de tigranz.com: el título con glifos y una
   frase enorme con subrayados de colores que se dibujan al llegar. La frase
   es un botón: copia el correo al portapapeles. La dirección sigue sin
   escribirse en la página, como en CopyEmail; si el portapapeles falla, se
   enseña para copiarla a mano. Debajo, las otras vías. */
type State = 'idle' | 'done' | 'error';

function Underline({ color, delay, seen, d }: { color: string; delay: number; seen: boolean; d: string }) {
  return (
    <svg className={s.under} viewBox="0 0 600 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <motion.path d={d} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={seen ? { pathLength: 1 } : undefined} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }} />
    </svg>
  );
}

export default function ContactBig() {
  const box = useRef<HTMLDivElement>(null);
  const seen = useInView(box, { once: true, amount: 0.5 });
  const [state, setState] = useState<State>('idle');

  const copy = async () => {
    try { await navigator.clipboard.writeText(SITE.email); setState('done'); setTimeout(() => setState('idle'), 2400); }
    catch { setState('error'); }
  };

  return (
    <section id="contacto" className={s.band} aria-labelledby="contact-title">
      <div ref={box} className={`container ${s.inner}`}>
        <GlyphTitle text="contacto" id="contact-title" tone="dark" />

        <button type="button" className={s.big} onClick={copy} aria-describedby="contact-hint">
          <span className={s.line}>
            <span>¿Hablamos?</span>
            <Underline seen={seen} delay={0.2} color="var(--focus-on-night)" d="M6 14 C 120 4, 260 22, 380 12 S 560 6, 594 14" />
          </span>
          <span className={s.line}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={state} className={state === 'idle' ? s.copy : s.ok}
                initial={{ y: '40%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-40%', opacity: 0 }} transition={{ duration: 0.3 }}>
                {state === 'done' ? 'Copiado.' : state === 'error' ? SITE.email : 'Copia mi correo.'}
              </motion.span>
            </AnimatePresence>
            <Underline seen={seen} delay={0.5} color="var(--accent)" d="M4 12 C 160 20, 300 4, 440 14 S 570 18, 596 10" />
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
