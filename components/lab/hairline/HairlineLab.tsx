'use client';
import { useId, useState } from 'react';
import HairlineFigure from './HairlineFigure';
import s from './HairlineLab.module.css';

/* El banco de la figura en el laboratorio: la placa con su lectura, la
   intensidad y el recorrido automático, que es el que graba
   scripts/hairline-record.mjs para LinkedIn. */
export default function HairlineLab() {
  const [intensity, setIntensity] = useState(0.5);
  const [play, setPlay] = useState(false);
  const [read, setRead] = useState('rest');
  const id = useId();

  return (
    <div className={s.bench}>
      <div className={s.plate}>
        <span className={s.read} aria-hidden="true">{read}</span>
        <HairlineFigure name="tokens" className={s.figure} intensity={intensity} play={play} onRead={setRead}
          label="Una bandeja de 24 celdas, una por token. Los valores sueltos de la auditoría están torcidos encima; al pasar el puntero, cada pila se cuadra sobre su token." />
      </div>
      <div className={s.controls}>
        <label htmlFor={id} className={s.label}>Intensidad</label>
        <input id={id} type="range" min={0} max={1} step={0.01} value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} className={s.range} />
        <button type="button" aria-pressed={play} onClick={() => setPlay((p) => !p)} className={s.play}>Recorrido automático</button>
      </div>
      <p className={s.note}>Diagrama ilustrativo. Las 24 celdas son los 24 tokens con rol. Las pilas no reflejan cuántos valores absorbió cada token, porque ese reparto no se midió. Motor: Hairline, de Lucas Marques (MIT).</p>
    </div>
  );
}
