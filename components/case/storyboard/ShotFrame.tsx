'use client';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { Shot } from '@/lib/content/cases/types';
import s from './storyboard.module.css';

/* Una captura real en el fotograma. La cámara empuja un poco mientras el plano
   cruza la pantalla: la pantalla de producto se mira, no se decora. */
export default function ShotFrame({ shot, width, height }: { shot: Shot; width: number; height: number }) {
  const box = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, (v) => 1 + v * 0.08);
  return (
    <div ref={box} className={s.shotBox}>
      <motion.div className={s.shotCam} style={{ scale }}>
        <Image src={shot.src} alt={shot.alt} width={width} height={height} sizes="(max-width: 900px) 100vw, 720px" />
      </motion.div>
    </div>
  );
}
