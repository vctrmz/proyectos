'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { motionAllowed } from '@/lib/motion/prefs';
import s from './Thesis.module.css';

/* La tesis, una sola vez en toda la portada (antes salía tres veces: hero,
   manifiesto y cierre). Es un párrafo, no un titular: tamaño de enunciado.
   Las palabras se encienden al ritmo del scroll; con menos movimiento o sin
   JavaScript se lee entera desde el principio. */

function Word({ w, i, total, p }: { w: string; i: number; total: number; p: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(p, [start, start + 1 / total], [0.18, 1]);
  return <motion.span style={{ opacity }}>{w} </motion.span>;
}

export default function Thesis({ text: TEXT, label }: { text: string; label: string }) {
  const box = useRef<HTMLParagraphElement>(null);
  const [fx, setFx] = useState(false);
  useEffect(() => { setFx(motionAllowed()); }, []);
  const { scrollYProgress } = useScroll({ target: box, offset: ['start 0.85', 'end 0.45'] });
  const words = TEXT.split(' ');
  return (
    <section className={`container ${s.wrap}`} aria-label={label}>
      <p ref={box} className={s.text}>
        {fx ? words.map((w, i) => <Word key={i} w={w} i={i} total={words.length} p={scrollYProgress} />) : TEXT}
      </p>
    </section>
  );
}
