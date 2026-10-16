'use client';
import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import type { WireBox } from '@/lib/content/cases/process';
import { motionAllowed } from '@/lib/motion/prefs';
import Wire, { type Rect } from './wire';
import Sheet from './Sheet';
import s from './process.module.css';

type State = 'sketch' | 'wire' | 'real';
type Labels = { phase: string; states: Record<State, string>; rebuilt: string; real: string; alt: { sketch: string; wire: string } };

/* La misma pantalla en tres estados: boceto, wireframe y producto. Las tres
   capas comparten geometría (el wireframe se dibujó desde la captura), así
   que el paso de una a otra es un barrido que revela la siguiente sobre la
   anterior: la pantalla madura en el sitio.

   El selector son radios nativos: sin JS siguen cambiando de estado, porque
   el CSS lee el radio marcado con :has(). Con JS, la evolución se reproduce
   sola una vez al entrar en pantalla, salvo que el visitante la toque antes o
   haya pedido menos movimiento. */
export default function Evolve({ id, boxes, r, shot, labels }: { id: string; boxes: WireBox[]; r: Rect; shot: { src: string; alt: string; width: number; height: number }; labels: Labels }) {
  const name = useId();
  const box = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const [state, setState] = useState<State>('sketch');

  useEffect(() => {
    const el = box.current;
    if (!el || !motionAllowed() || typeof IntersectionObserver === 'undefined') return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      timers.push(setTimeout(() => { if (!touched.current) setState('wire'); }, 2400));
      timers.push(setTimeout(() => { if (!touched.current) setState('real'); }, 4200));
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, []);

  const pick = (v: State) => { touched.current = true; setState(v); };
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <div ref={box} className={s.evolve} data-state={state}>
      <fieldset className={s.seg}>
        <legend className="visually-hidden">{labels.phase}</legend>
        {(['sketch', 'wire', 'real'] as State[]).map((v) => (
          <label key={v} className={s.segItem}>
            <input type="radio" name={name} value={v} checked={state === v} onChange={() => pick(v)} />
            <span>{labels.states[v]}</span>
          </label>
        ))}
      </fieldset>
      <div className={s.stage}>
        <div className={`${s.layer} ${s.lSketch}`}><Sheet id={`${id}-ev`} alt={labels.alt.sketch}><Wire boxes={boxes} r={r} mode="sketch" uid={`${id}-ev`} /></Sheet></div>
        <div className={`${s.layer} ${s.lWire}`}>
          <svg viewBox="0 0 160 100" className={s.wire} role="img" aria-label={labels.alt.wire}><Wire boxes={boxes} r={r} mode="wire" uid={`${id}-wf`} /></svg>
        </div>
        <div className={`${s.layer} ${s.lReal}`}>
          <div className={s.realShot} style={{ left: pct(r.x, 160), top: pct(r.y, 100), width: pct(r.w, 160), height: pct(r.h, 100) }}>
            <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 900px) 100vw, 1100px" />
          </div>
        </div>
      </div>
      <p className={s.evoTag} aria-live="polite">
        <span className={s.chip} data-kind={state === 'real' ? 'real' : 'rebuilt'}>{state === 'real' ? labels.real : labels.rebuilt}</span>
      </p>
    </div>
  );
}
