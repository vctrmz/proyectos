'use client';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import s from './Drawer.module.css';

type Props = { open: boolean; onClose: () => void; title: string; children: React.ReactNode; returnFocusTo?: React.RefObject<HTMLElement | null> };

/* Panel lateral derecho: foco dentro al abrir, Esc y velo lo cierran, el
   scroll de fondo se bloquea y el foco vuelve al disparador. */
export default function Drawer({ open, onClose, title, children, returnFocusTo }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; returnFocusTo?.current?.focus(); };
  }, [open, onClose, returnFocusTo]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="veil" className={s.veil} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={onClose} aria-hidden="true" />
          <motion.div key="panel" ref={panel} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className={s.panel}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <div className={s.head}><p className={s.title}>{title}</p><button type="button" className={s.close} onClick={onClose} aria-label="Cerrar"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button></div>
            <div className={s.body}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
