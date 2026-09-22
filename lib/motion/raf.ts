/* Un solo bucle de animación para toda la página: los componentes se apuntan
   y se dan de baja, y el bucle arranca y para solo. Evita un rAF por
   instancia y sobrevive a que un suscriptor falle. */
type Frame = (now: number) => void;
const subs = new Set<Frame>();
let raf = 0;

const loop = (now: number) => {
  for (const fn of [...subs]) {
    try { fn(now); } catch { subs.delete(fn); }
  }
  raf = subs.size ? requestAnimationFrame(loop) : 0;
};

export function addFrame(fn: Frame) {
  subs.add(fn);
  if (!raf && typeof requestAnimationFrame === 'function') raf = requestAnimationFrame(loop);
}

export function removeFrame(fn: Frame) {
  subs.delete(fn);
  if (!subs.size && raf) { cancelAnimationFrame(raf); raf = 0; }
}
