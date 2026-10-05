'use client';
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { getLenis } from '@/lib/motion/lenisStore';
import s from './MorphingDialog.module.css';

/* Una tarjeta que se transforma en su vista ampliada sin cambiar de página:
   el mismo elemento crece hasta el centro con layoutId. Adaptada de
   motion-primitives (LICENSE-motion-primitives.md), por piezas como el
   original —disparador, contenedor, contenido, título, imagen, cerrar—.

   Lo que cambia respecto al original:
   - El título lleva el id al que apunta aria-labelledby; en el original no
     existía, y el diálogo se anunciaba sin nombre.
   - El disparador se nombra por su contenido, no «Open dialog :r1:».
   - Foco: entra al abrir, no se escapa con Tab y vuelve al disparador.
   - Esc, la X y un clic fuera cierran; el scroll de fondo se para, también
     el de Lenis.
   Con movimiento reducido, MotionConfig de la web quita el morph: abre y
   cierra sin animar. */
type Ctx = { abierto: boolean; setAbierto: (v: boolean) => void; id: string; disparador: React.RefObject<HTMLButtonElement | null>; oscuro: boolean };
const C = createContext<Ctx | null>(null);
/* Si una pieza está dentro del diálogo y no en la tarjeta: solo ahí el título
   lleva el id que nombra al diálogo, para que no haya dos iguales. */
const Dentro = createContext(false);
const usar = () => {
  const c = useContext(C);
  if (!c) throw new Error('Las piezas de MorphingDialog van dentro de <MorphingDialog>');
  return c;
};

export function MorphingDialog({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  const disparador = useRef<HTMLButtonElement>(null);
  const oscuro = tone === 'dark';
  const valor = useMemo(() => ({ abierto, setAbierto, id, disparador, oscuro }), [abierto, id, oscuro]);
  return <C.Provider value={valor}>{children}</C.Provider>;
}

export function MorphingDialogTrigger({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { abierto, setAbierto, id, disparador, oscuro } = usar();
  return (
    <motion.button ref={disparador} type="button" layoutId={`md-${id}`} className={`${s.trigger} ${oscuro ? s.dark : ''} ${className}`}
      onClick={() => setAbierto(true)} aria-haspopup="dialog" aria-expanded={abierto}>
      {children}
    </motion.button>
  );
}

export function MorphingDialogContainer({ children }: { children: React.ReactNode }) {
  const { abierto, setAbierto } = usar();
  const [montado, setMontado] = useState(false);
  useEffect(() => { setMontado(true); }, []);
  if (!montado) return null;
  return createPortal(
    <AnimatePresence initial={false}>
      {abierto && (
        <>
          <motion.div key="velo" className={s.veil} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          {/* Un clic que empieza y acaba fuera del contenido cierra. */}
          <div className={s.stage} onPointerDown={(e) => { if (e.target === e.currentTarget) setAbierto(false); }}>
            {children}
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function MorphingDialogContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { abierto, setAbierto, id, disparador, oscuro } = usar();
  const caja = useRef<HTMLDivElement>(null);
  const cerrar = useCallback(() => setAbierto(false), [setAbierto]);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
    const enfocables = () => [...(caja.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? [])];
    enfocables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
      if (e.key !== 'Tab') return;
      const f = enfocables();
      if (!f.length) return;
      const [primero, ultimo] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const boton = disparador.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previo;
      getLenis()?.start();
      boton?.focus();
    };
  }, [abierto, cerrar, disparador]);

  return (
    <motion.div ref={caja} layoutId={`md-${id}`} className={`${s.content} ${oscuro ? s.dark : ''} ${className}`} role="dialog" aria-modal="true"
      aria-labelledby={`md-t-${id}`} data-lenis-prevent>
      <Dentro.Provider value={true}>{children}</Dentro.Provider>
    </motion.div>
  );
}

/* layoutId distinto en el disparador y en el diálogo: así el título viaja de
   la tarjeta a la vista ampliada. Solo el del diálogo lleva el id que lo
   nombra. */
export function MorphingDialogTitle({ children, className = '', as: Tag = 'h3' }: { children: React.ReactNode; className?: string; as?: 'h2' | 'h3' | 'p' }) {
  const { id } = usar();
  const dentro = useContext(Dentro);
  const M = motion[Tag];
  return <M layoutId={`md-title-${id}`} className={className} id={dentro ? `md-t-${id}` : undefined}>{children}</M>;
}

export function MorphingDialogImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const { id } = usar();
  return <motion.img layoutId={`md-img-${id}`} src={src} alt={alt} className={`${s.img} ${className}`} />;
}

export function MorphingDialogDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }} exit={{ opacity: 0, y: 8 }}>
      {children}
    </motion.div>
  );
}

export function MorphingDialogClose({ label = 'Cerrar' }: { label?: string }) {
  const { setAbierto, oscuro } = usar();
  return (
    <motion.button type="button" className={`${s.close} ${oscuro ? s.dark : ''}`} onClick={() => setAbierto(false)} aria-label={label}
      initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} exit={{ opacity: 0 }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
    </motion.button>
  );
}
