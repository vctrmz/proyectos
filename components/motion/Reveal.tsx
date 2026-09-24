'use client';
import { motion } from 'motion/react';

/* Entrada al aparecer en pantalla, una sola vez. `as` existe para no romper el
   marcado: dentro de una lista el elemento revelado tiene que ser un <li>. */
type Props = { children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'section' };

export default function Reveal({ children, delay = 0, className = '', as = 'div' }: Props) {
  const M = as === 'li' ? motion.li : as === 'section' ? motion.section : motion.div;
  return (
    <M data-reveal className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ delay }}>
      {children}
    </M>
  );
}
