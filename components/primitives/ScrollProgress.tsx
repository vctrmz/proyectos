'use client';
import { motion, useScroll, useSpring } from 'motion/react';
import s from './ScrollProgress.module.css';

/* Barra fina de progreso de lectura, arriba del todo. Adaptada de
   motion-primitives (LICENSE-motion-primitives.md): misma idea —el progreso
   del scroll escala la barra con un muelle—, con el color de la web.

   Es decorativa: el índice del caso ya dice dónde estás, así que no se
   anuncia. Con movimiento reducido el muelle no rebota: MotionConfig de la
   web lo resuelve sin que este componente tenga que preguntar. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 50, restDelta: 0.001 });
  return <motion.div className={s.bar} style={{ scaleX }} aria-hidden="true" />;
}
