'use client';
import { useEffect, useRef } from 'react';

/* Monta una figura de Hairline (UPSTREAM.md). La figura se escribe para el
   banco de la skill hairline-create: llama a un HL y a un hairline() globales.
   Este componente hace lo que hace el banco —el svg, la lectura, la intensidad
   y el recorrido— para que el archivo de la figura sea el mismo que pasó el
   validador de la skill. Todo se carga en el cliente: en el servidor solo
   queda la caja 5:4, así que nada salta al dibujar. */

type Stop = [number, number] | null;
type Handle = { set(value: number): void; destroy(): void };
type Read = { textContent: string | null };
type Spec = {
  name: string;
  means: string;
  range: [number, number, number];
  tour: Stop[] | null;
  mount(host: { stage: HTMLElement; svg: SVGSVGElement; read: Read }, value: number): Handle;
};
type Kernel = {
  inject(root: Document): void;
  mk(tag: string, attrs: Record<string, string>, parent: Element): Element;
  tour(stage: HTMLElement, stops: Stop[]): { stop(): void };
  LAP: Stop[];
};

const FIGURES = { tokens: () => import('./tokens.js') };
export type FigureName = keyof typeof FIGURES;

/* Las figuras se cargan de una en una: cada una se declara llamando al
   hairline() global, y dos cargas a la vez se pisarían esa llamada. */
let queue: Promise<unknown> = Promise.resolve();
const loaded = new Map<FigureName, Promise<{ HL: Kernel; spec: Spec }>>();
function load(name: FigureName) {
  let p = loaded.get(name);
  if (!p) {
    p = queue.then(async () => {
      const HL = (await import('./kernel.js')).default as unknown as Kernel;
      let spec: Spec | null = null;
      Object.assign(globalThis, { HL, hairline: (s: Spec) => { spec = s; } });
      await FIGURES[name]();
      if (!spec) throw new Error(`hairline: la figura ${name} no se declaró`);
      return { HL, spec: spec as Spec };
    });
    queue = p.catch(() => {});
    loaded.set(name, p);
  }
  return p;
}

/** La intensidad (0…1) llevada al número de la figura: dos rectas que se cruzan en 0.5, como en el banco. */
const at = ([lo, mid, hi]: Spec['range'], i: number) =>
  i <= 0.5 ? lo + (i / 0.5) * (mid - lo) : mid + ((i - 0.5) / 0.5) * (hi - mid);

type Props = {
  name: FigureName;
  /** Nombre accesible: la figura es una imagen. */
  label: string;
  intensity?: number;
  /** Recorre la figura sola hasta que llega el puntero. Con movimiento reducido, reposa. */
  play?: boolean;
  /** La lectura de la figura cada vez que cambia: «rest», «tok 08»… */
  onRead?: (text: string) => void;
  className?: string;
};

export default function HairlineFigure({ name, label, intensity = 0.5, play = false, onRead, className }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const live = useRef<{ handle: Handle; spec: Spec } | null>(null);
  const latest = useRef({ intensity, onRead });
  useEffect(() => { latest.current = { intensity, onRead }; });

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let gone = false, undo = () => {};
    load(name).then(({ HL, spec }) => {
      if (gone) return;
      HL.inject(document);
      const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, el) as SVGSVGElement;
      let text: string | null = null;
      const read: Read = {
        get textContent() { return text; },
        set textContent(v) { text = v == null ? '' : String(v); latest.current.onRead?.(text); },
      };
      const handle = spec.mount({ stage: el, svg, read }, at(spec.range, latest.current.intensity));
      if (text === null) read.textContent = 'rest';
      const tour = play ? HL.tour(el, spec.tour ?? HL.LAP) : null;
      live.current = { handle, spec };
      undo = () => { tour?.stop(); handle.destroy(); svg.remove(); live.current = null; };
    });
    return () => { gone = true; undo(); };
  }, [name, play]);

  useEffect(() => {
    const f = live.current;
    if (f) f.handle.set(at(f.spec.range, Math.min(1, Math.max(0, intensity))));
  }, [intensity]);

  return <div ref={stage} data-hairline={name} role="img" aria-label={label} className={className} />;
}
