'use client';
import { motion, type Variants } from 'motion/react';

/* Entrada por partes: el contenedor escalona a sus hijos (titular, texto,
   imagen) 70 ms entre sí, una sola vez al entrar en pantalla. Con
   prefers-reduced-motion, MotionConfig quita el viaje y deja el fundido; sin
   JavaScript, el estilo de <noscript> del layout pinta todo visible
   (data-reveal). */
const parent: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.07 } } };
const child: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

type Tag = 'div' | 'section' | 'header' | 'ul' | 'li' | 'p' | 'h1' | 'h2';

export function Rise({ as = 'div', children, className, immediate = false, ...rest }: { as?: Tag; children: React.ReactNode; className?: string; immediate?: boolean } & React.HTMLAttributes<HTMLElement>) {
  const M = motion[as] as typeof motion.div;
  const trigger = immediate ? { animate: 'shown' } : { whileInView: 'shown', viewport: { once: true, amount: 0.25 } };
  return <M data-reveal="" className={className} variants={parent} initial="hidden" {...trigger} {...(rest as object)}>{children}</M>;
}

export function Part({ as = 'div', children, className, ...rest }: { as?: Tag; children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>) {
  const M = motion[as] as typeof motion.div;
  return <M data-reveal="" className={className} variants={child} {...(rest as object)}>{children}</M>;
}
