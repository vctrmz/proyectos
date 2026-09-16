'use client';

import { Children, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { needsLoader, onLoaderDone } from '@/lib/loader';

/* Ejecuta `cb` cuando la intro ha terminado: de inmediato si no hay loader,
   o al recibir el aviso del Loader. */
export function useAfterIntro(cb: () => void) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!needsLoader()) { ref.current(); return; }
    return onLoaderDone(() => ref.current());
  }, []);
}

/* Dispara al entrar en pantalla. Nada se oculta hasta que ya se puede
   revelar: el peor caso es quedarse sin animación. */
function onEnter(el: Element, fn: () => void, margin = '0px 0px -12% 0px') {
  if (!('IntersectionObserver' in window)) { fn(); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    fn();
  }, { rootMargin: margin });
  io.observe(el);
  return () => io.disconnect();
}

/* Dos copias apiladas; el :hover del enlace que lo contiene desplaza el par
   una línea hacia arriba (CSS .roll). Layout puro: sin medir alturas, la
   primera copia fija la altura del recorte y la segunda se posiciona en
   absoluto justo debajo. */
export function RollText({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll-inner">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  );
}

/* Titular palabra a palabra al llegar a pantalla. Solo se parten los nodos de
   texto: los hijos con estilo propio viajan enteros. */
export function Words({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isLight()) return;
    const ws = el.querySelectorAll('.w');
    if (!ws.length) return;
    return onEnter(el, () => {
      gsap.fromTo(ws, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.035, ease: 'power3.out', immediateRender: false });
    });
  }, []);
  const parts: ReactNode[] = [];
  let k = 0;
  Children.forEach(children, (c) => {
    if (typeof c === 'string') {
      c.split(/(\s+)/).forEach((w) => {
        if (!w) return;
        if (!w.trim()) parts.push(w);
        else parts.push(<span key={k++} className="w" style={{ display: 'inline-block' }}>{w}</span>);
      });
    } else if (c !== null && c !== undefined) {
      parts.push(<span key={k++} className="w" style={{ display: 'inline-block' }}>{c}</span>);
    }
  });
  return <h2 ref={ref} className={className} style={style}>{parts}</h2>;
}

/* Máscara por línea. El padding y el margen negativo compensan los trazos
   descendentes: sin ellos, overflow hidden decapita las jotas y las ges. */
export function Lines({ lines, className, style }: { lines: string[]; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelectorAll('[data-line-inner]');
    if (isLight()) { gsap.set(inner, { yPercent: 0 }); return; }
    gsap.from(inner, { yPercent: 112, duration: 1.1, stagger: 0.085, ease: 'power4.out', delay: 0.12 });
  }, []);
  return (
    <h1 ref={ref} className={className} style={style}>
      {lines.map((l, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
          <span data-line-inner style={{ display: 'block', willChange: 'transform' }}>{l}</span>
        </span>
      ))}
    </h1>
  );
}

/* La imagen se acerca despacio mientras el cursor está encima. */
export function ZoomBox({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const tween = (scale: number) => {
    if (isLight()) return;
    const img = ref.current?.querySelector('img');
    if (img) gsap.to(img, { scale, duration: 0.7, ease: 'power3.out', overwrite: true });
  };
  return <div ref={ref} className={className} style={style} onPointerEnter={() => tween(1.06)} onPointerLeave={() => tween(1)}>{children}</div>;
}

/* Entrada por sección: los bloques de primer nivel del contenedor interior de
   cada [data-screen-label] suben escalonados una sola vez. data-no-reveal
   excluye la sección o el bloque. */
export function useSectionReveal(ready: boolean) {
  useEffect(() => {
    if (!ready || isLight()) return;
    const offs: (() => void)[] = [];
    document.querySelectorAll('[data-screen-label]').forEach((sec) => {
      if (sec.hasAttribute('data-no-reveal')) return;
      const holder = sec.firstElementChild;
      if (!holder) return;
      const kids = Array.from(holder.children).filter((k) => !k.hasAttribute('data-no-reveal'));
      if (!kids.length) return;
      offs.push(onEnter(sec, () => {
        gsap.fromTo(kids, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out', immediateRender: false });
      }, '0px 0px -18% 0px'));
    });
    return () => offs.forEach((f) => f());
  }, [ready]);
}
