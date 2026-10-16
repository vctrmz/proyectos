'use client';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import s from './ReceiptPrinter.module.css';

/* Impresora de tickets, adaptada del componente ReceiptPrinter (Tailwind +
   Phosphor) a CSS Modules y motion: misma máquina, mismo papel con dientes y
   el mismo avance a tirones, línea a línea. Iconos en línea y sin texturas
   externas.

   Estados: en reposo, procesando, imprimiendo y terminado. El papel solo
   existe a partir de «imprimiendo» y no se anuncia hasta que termina. Con
   movimiento reducido el ticket aparece sin avanzar. */
export type PrinterStage = 'idle' | 'processing' | 'printing' | 'complete';

const easeOut = [0.23, 1, 0.32, 1] as const;
const easeInOut = [0.77, 0, 0.175, 1] as const;
const FEED = 2.2;

const TEETH = 40, DEPTH = 4;
const toothPoints = Array.from({ length: TEETH * 2 }, (_, i) => {
  const x = 100 - ((i + 1) * 100) / (TEETH * 2);
  const y = i % 2 === 0 ? '100%' : `calc(100% - ${DEPTH}px)`;
  return `${x}% ${y}`;
}).join(', ');
const clip = `polygon(0 0, 100% 0, 100% calc(100% - ${DEPTH}px), ${toothPoints})`;

/* El avance a tirones: sube, para, sube, para… */
const steps = ['translateY(calc(-100% + 2px))', 'translateY(-91%)', 'translateY(-91%)', 'translateY(-81%)', 'translateY(-81%)', 'translateY(-70%)', 'translateY(-70%)', 'translateY(-58%)', 'translateY(-58%)', 'translateY(-45%)', 'translateY(-45%)', 'translateY(-32%)', 'translateY(-32%)', 'translateY(-20%)', 'translateY(-20%)', 'translateY(-10%)', 'translateY(-10%)', 'translateY(-3%)', 'translateY(-3%)', 'translateY(0%)'];
const times = [0, 0.075, 0.105, 0.18, 0.21, 0.285, 0.315, 0.39, 0.42, 0.495, 0.525, 0.6, 0.63, 0.705, 0.735, 0.81, 0.84, 0.915, 0.945, 1];

const SPIN = <svg viewBox="0 0 24 24" className={s.spin} aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg>;
const CHECK = <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="#0b0c10" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const DOT = <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor" /></svg>;

export default function ReceiptPrinter({ stage, labels, brand, children }: {
  stage: PrinterStage; labels: Record<PrinterStage, string>; brand: string; children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const move = !reduce;
  const visible = stage === 'printing' || stage === 'complete';
  const stepped = stage === 'printing' && move;
  const icon = stage === 'complete' ? 'done' : stage === 'idle' ? 'idle' : 'work';

  return (
    <section className={s.root} aria-label={labels.idle} data-stage={stage}>
      <div className={s.machine}>
        <div className={s.header}>
          <span className={s.brand}>{brand}</span>
          <span className={s.led} data-on={stage === 'processing' || stage === 'printing'} aria-hidden="true" />
        </div>
        <div className={s.screen}>
          <div className={s.status}>
            <span className={s.indicator} aria-hidden="true">
              <AnimatePresence initial={false} mode="sync">
                <motion.span key={icon} className={icon === 'done' ? s.ok : s.wait}
                  initial={{ opacity: 0, scale: move ? 0.94 : 1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: move ? 0.96 : 1 }}
                  transition={{ duration: 0.16, ease: easeOut }}>
                  {icon === 'done' ? CHECK : icon === 'idle' ? DOT : SPIN}
                </motion.span>
              </AnimatePresence>
            </span>
            <div className={s.labels} role="status" aria-live="polite">
              <AnimatePresence initial={false} mode="sync">
                <motion.div key={stage} className={s.label}
                  initial={{ opacity: 0, y: move ? 4 : 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: move ? -4 : 0 }}
                  transition={{ duration: 0.18, ease: easeOut }}>
                  {labels[stage]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className={s.slot} aria-hidden="true" />
      </div>

      <div className={s.output}>
        {visible && <div className={s.lip} aria-hidden="true" />}
        <motion.div className={s.feed} aria-hidden={stage !== 'complete'} initial={false}
          animate={{
            opacity: visible ? 1 : 0,
            transform: stepped ? steps : visible || !move ? 'translateY(0%)' : 'translateY(calc(-100% + 2px))',
          }}
          transition={{
            opacity: { duration: 0.16, ease: easeOut },
            transform: { duration: move ? FEED : 0, ease: stepped ? 'linear' : easeInOut, times: stepped ? times : undefined },
          }}>
          <article className={s.paper} style={{ clipPath: clip }}>{children}</article>
        </motion.div>
      </div>
    </section>
  );
}
