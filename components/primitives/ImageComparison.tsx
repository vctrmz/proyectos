'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import s from './ImageComparison.module.css';

/* Antes y después en el mismo marco: la imagen de antes se recorta encima de
   la de después y una línea con asa marca el corte. Adaptada de
   motion-primitives (LICENSE-motion-primitives.md).

   El original solo se movía con ratón o dedo. Aquí el asa es un slider de
   verdad —role="slider", flechas de cinco en cinco, Re Pág y Av Pág de veinte
   en veinte, Inicio y Fin—, así que se usa con teclado y un lector de
   pantalla dice dónde está el corte. El arrastre va con pointer events, que
   cubren ratón, dedo y lápiz con un solo camino. */
type Img = { src: string; alt: string };

export default function ImageComparison({ before, after, width, height, labels = ['Antes', 'Después'], start = 50 }:
  { before: Img; after: Img; width: number; height: number; labels?: [string, string]; start?: number }) {
  const caja = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(start);
  // La posición también en una ref: dos teclas en el mismo instante suman las
  // dos, en lugar de partir ambas del valor del último render.
  const actual = useRef(start);
  const valor = useMotionValue(start);
  // Al teclado el corte se desliza; al arrastrar, va pegado al dedo.
  const suave = useSpring(valor, { bounce: 0, duration: 0.25 });
  const recorte = useTransform(suave, (v) => `inset(0 ${100 - v}% 0 0)`);
  const izquierda = useTransform(suave, (v) => `${v}%`);
  const arrastrando = useRef(false);

  const mover = (v: number, inmediato = false) => {
    const p = Math.min(100, Math.max(0, v));
    actual.current = p;
    setPos(p);
    if (inmediato) suave.jump(p);
    valor.set(p);
  };
  const desdePuntero = (x: number) => {
    const r = caja.current!.getBoundingClientRect();
    mover(((x - r.left) / r.width) * 100, true);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const paso: Record<string, number> = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5, PageUp: 20, PageDown: -20 };
    if (e.key in paso) mover(actual.current + paso[e.key]);
    else if (e.key === 'Home') mover(0);
    else if (e.key === 'End') mover(100);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={caja} className={s.box} style={{ aspectRatio: `${width} / ${height}` }}
      onPointerDown={(e) => { arrastrando.current = true; e.currentTarget.setPointerCapture(e.pointerId); desdePuntero(e.clientX); }}
      onPointerMove={(e) => { if (arrastrando.current) desdePuntero(e.clientX); }}
      onPointerUp={() => { arrastrando.current = false; }}
      onPointerCancel={() => { arrastrando.current = false; }}>
      <Image src={after.src} alt={after.alt} fill sizes="(max-width: 900px) 100vw, 900px" className={s.img} />
      <motion.div className={s.before} style={{ clipPath: recorte }}>
        <Image src={before.src} alt={before.alt} fill sizes="(max-width: 900px) 100vw, 900px" className={s.img} />
      </motion.div>
      <span className={`${s.tag} ${s.tagL}`} aria-hidden="true">{labels[0]}</span>
      <span className={`${s.tag} ${s.tagR}`} aria-hidden="true">{labels[1]}</span>
      <motion.div className={s.handle} style={{ left: izquierda }} role="slider" tabIndex={0}
        aria-label={`Comparar ${labels[0].toLowerCase()} y ${labels[1].toLowerCase()}`}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)} % de ${labels[0].toLowerCase()}`} onKeyDown={onKey}>
        <i aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
        </i>
      </motion.div>
    </div>
  );
}
