import type { FilmImg, FilmShot } from '@/lib/content/case-film';
import { PHASE_ROMAN } from '@/lib/content/case-film';
import f from './film.module.css';

/* El motor del film: pinta un plano dentro de un escenario 16:9 con la Web
   Animations API. Todo se mide en cqw, así que el mismo plano vale para el
   reproductor grande y para las miniaturas de la lista. Es DOM imperativo a
   propósito: cada plano son veinte nodos que nacen y mueren en cinco segundos,
   y React no tiene nada que decidir sobre ellos. */

const EIO = 'cubic-bezier(.65,0,.35,1)';
const BACK = 'cubic-bezier(.34,1.56,.64,1)';

function el(tag: string, cls: string, parent: HTMLElement, style?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (style) e.setAttribute('style', style);
  parent.appendChild(e);
  return e;
}
function anim(node: Element, kf: Keyframe[], opts: KeyframeAnimationOptions) {
  return node.animate(kf, { fill: 'both', easing: 'cubic-bezier(.22,1,.36,1)', ...opts });
}

/* Una pantalla dentro de un marco. Las de móvil van enteras y estrechas; las
   de escritorio y las páginas largas se recortan a una ventana apaisada y
   devuelven cuánto se pueden desplazar por dentro. */
function frame(parent: HTMLElement, im: FilmImg, x: number, y: number, w: number) {
  const phone = im.r >= 1.8 && im.r <= 2.7;
  const width = phone ? Math.min(w * 0.42, 44 / im.r) : w;
  const left = phone ? x + (w - width) / 2 : x;
  const full = width * im.r;
  const h = phone ? full : Math.min(full, width * 0.62);
  const box = el('div', `${f.frame} ${phone ? f.phone : ''}`, parent, `left:${left}cqw;top:${y}cqw;width:${width}cqw;height:${h + (phone ? 0 : 1.9)}cqw`);
  const pic = el('img', '', box) as HTMLImageElement;
  pic.src = im.src; pic.alt = ''; pic.decoding = 'async'; pic.loading = 'lazy';
  return { box, pic, scroll: Math.max(0, full - h) };
}

type Draw = (st: HTMLElement, d: number, s: FilmShot, hooks: Hooks) => void;
export interface Hooks { timers: number[]; frozen: boolean }

const R: Record<FilmShot['kind'], Draw> = {
  open(st, d, s) {
    const { box } = frame(st, s.imgs[0], 12, 7, 76);
    anim(box, [{ opacity: 0, transform: 'scale(1)' }, { opacity: 1, transform: 'scale(1.03)', offset: 0.2 }, { opacity: 1, transform: 'scale(1.08)' }], { duration: d, easing: 'linear' });
    if (s.caption) { const c = el('div', f.cap, st); c.innerHTML = '<i></i>'; c.append(s.caption); anim(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 700 }); }
  },
  title(st, d, s) {
    const n = el('div', f.numeral, st); n.textContent = `${PHASE_ROMAN[s.phase]} / V`;
    const w = el('div', f.word, st);
    s.word!.split('').forEach((ch, k) => {
      const sp = el('span', '', w); sp.textContent = ch;
      anim(sp, [{ transform: 'translateY(3cqw)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, delay: 80 + k * 40, easing: BACK });
      anim(sp, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-2cqw)' }], { duration: 250, delay: d - 320 + k * 10, fill: 'forwards' });
    });
    const u = el('u', '', w); anim(u, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 400, delay: 400 });
    anim(n, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
  },
  scatter(st, d, s) {
    const pos = [[4, 6, -9], [34, 3, 6], [62, 8, -4], [10, 28, 7], [40, 24, -11], [66, 28, 10], [22, 15, 3], [52, 13, -7]];
    s.imgs.forEach((im, k) => {
      const p = pos[k % pos.length];
      const { box } = frame(st, im, p[0], p[1], 30);
      const fx = (k % 2 ? 1 : -1) * 70, fy = -60 + k * 10;
      anim(box, [{ transform: `translate(${fx}cqw,${fy}cqw) rotate(${p[2] * 3}deg)`, opacity: 0 }, { transform: `rotate(${p[2]}deg)`, opacity: 1 }], { duration: 700, delay: k * 150, easing: BACK });
      anim(box, [{ translate: '0 0' }, { translate: `${k % 2 ? 1.5 : -1.5}cqw 1cqw` }], { duration: Math.max(1, d - 1200), delay: 1200, easing: 'linear', composite: 'add' });
    });
    anim(st, [{ transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: d, easing: 'linear' });
  },
  split(st, d, s) {
    const a = frame(st, s.imgs[0], 5, 9, 42).box, b = frame(st, s.imgs[1] ?? s.imgs[0], 53, 9, 42).box;
    const line = el('div', f.divider, st);
    anim(a, [{ transform: 'translateX(6cqw)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 1200, easing: EIO });
    anim(b, [{ transform: 'translateX(-6cqw)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 1200, easing: EIO });
    anim(line, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 600, delay: 500 });
    if (s.caption) { const c = el('div', f.cap, st); c.innerHTML = '<i></i>'; c.append(s.caption); anim(c, [{ opacity: 0, transform: 'translateY(1cqw)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: 900 }); }
    anim(st, [{ transform: 'translateX(0)' }, { transform: 'translateX(-1.5cqw)' }], { duration: d, easing: 'linear' });
  },
  focus(st, d, s) {
    const wrap = el('div', f.layer, st); wrap.style.transformOrigin = '70% 25%';
    frame(wrap, s.imgs[0], 8, 5, 84);
    anim(wrap, [{ transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: Math.min(3500, d - 800), easing: EIO });
    if (s.caption) { const c = el('div', f.cap, st); c.innerHTML = '<i></i>'; c.append(s.caption); anim(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 2600 }); }
  },
  tilt(st, d, s) {
    st.style.perspective = '120cqw';
    const { box } = frame(st, s.imgs[0], 10, 5, 80);
    anim(box, [{ transform: 'rotateY(-18deg) rotateX(8deg) scale(.92)', opacity: 0 }, { opacity: 1, offset: 0.1 }, { transform: 'none', opacity: 1 }], { duration: 2500, easing: 'cubic-bezier(.16,1,.3,1)' });
    if (s.caption) { const c = el('div', f.cap, st); c.innerHTML = '<i></i>'; c.append(s.caption); anim(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 2200 }); }
    anim(st, [{ opacity: 1 }, { opacity: 1, offset: 0.85 }, { opacity: 0.25 }], { duration: d, easing: 'linear' });
  },
  tour(st, d, s) {
    const n = s.imgs.length, seg = d / n;
    s.imgs.forEach((im, k) => {
      const holder = el('div', f.layer, st);
      const { pic, scroll } = frame(holder, im, 6, 4, 88);
      const dir = k % 2 ? -1 : 1;
      anim(holder, [{ transform: `translateX(${100 * dir}cqw) skewX(${-8 * dir}deg)` }, { transform: 'none' }], { duration: k ? 250 : 1, delay: k * seg, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      if (scroll > 0) anim(pic, [{ transform: 'translateY(0)' }, { transform: `translateY(-${Math.min(scroll, 40)}cqw)` }], { duration: seg, delay: k * seg, easing: 'linear' });
      if (k < n - 1) anim(holder, [{ transform: 'none' }, { transform: `translateX(${-100 * dir}cqw) skewX(${8 * dir}deg)` }], { duration: 250, delay: (k + 1) * seg, easing: 'cubic-bezier(.8,0,.8,.2)', fill: 'forwards' });
      holder.style.zIndex = String(k);
    });
    if (s.caption) { const c = el('div', f.cap, st, 'z-index:40'); c.innerHTML = '<i></i>'; c.append(s.caption); anim(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 400 }); }
  },
  /* Valores sueltos que se convierten en tokens con nombre: la columna de la
     izquierda es lo que había, la de la derecha lo que quedó. */
  tokens(st, d, s) {
    el('div', f.gridlines, st);
    const rows = s.rows!.slice(0, 6);
    rows.forEach((r, k) => {
      const y = 9 + k * 7.4;
      const row = el('div', f.trow, st, `top:${y}cqw`);
      const chip = el('i', '', row); if (r.swatch) chip.style.background = r.swatch;
      const before = el('span', f.before, row); before.textContent = r.before;
      const arrow = el('b', '', row); arrow.textContent = '→';
      const after = el('span', f.after, row); after.textContent = r.after;
      anim(row, [{ opacity: 0, transform: 'translateY(2cqw)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 200 + k * 120 });
      anim(arrow, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 1400 + k * 140 });
      anim(after, [{ opacity: 0, transform: 'translateX(-2cqw)' }, { opacity: 1, transform: 'none' }], { duration: 450, delay: 1500 + k * 140, easing: BACK });
      anim(before, [{ opacity: 1 }, { opacity: 0.45 }], { duration: 400, delay: 1500 + k * 140 });
    });
    anim(st, [{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }], { duration: d, easing: 'linear' });
  },
  /* La cifra principal del resultado. Si es un «antes → después», enseña el
     antes y cae en el después; si es un número, cuenta hasta él. */
  count(st, d, s, hooks) {
    const m = s.count!;
    el('div', f.gridlines, st);
    const more = el('div', f.more, st);
    m.more.forEach((t, k) => { const p = el('p', '', more); p.textContent = t; anim(p, [{ opacity: 0, transform: 'translateY(1.5cqw)' }, { opacity: 1, transform: 'none' }], { duration: 450, delay: 1800 + k * 160 }); });
    const c = el('div', f.count, st);
    const span = el('span', '', c);
    const small = el('small', '', c); small.textContent = m.label;
    const [a, b] = m.value.split('→').map((x) => x.trim());
    const num = /^\d+$/.test(m.value.trim()) ? Number(m.value.trim()) : null;
    const set = (ms: number) => {
      if (b) span.textContent = ms >= 1600 ? b : a;
      else if (num !== null) span.textContent = String(Math.round(num * (1 - Math.pow(1 - Math.min(1, ms / 1800), 3))));
      else span.textContent = m.value;
    };
    set(hooks.frozen ? d : 0);
    anim(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 200 });
    if (!hooks.frozen) {
      const t0 = performance.now();
      const tick = () => { const ms = performance.now() - t0; set(ms); if (ms < 1900 && st.isConnected) hooks.timers.push(requestAnimationFrame(tick) * -1); };
      tick();
      if (b) hooks.timers.push(window.setTimeout(() => { if (st.isConnected) anim(c, [{ transform: 'scale(1.12)' }, { transform: 'none' }], { duration: 400, easing: BACK, fill: 'none' }); }, 1600));
    }
  },
  end(st, d, s) {
    const e = s.end!;
    const bars = el('div', f.bars, st);
    [0, 1, 2].forEach((k) => { const i = el('i', '', bars); anim(i, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 500, delay: 200 + k * 120 }); });
    if (e.logo) { const lg = el('img', f.logo, st) as HTMLImageElement; lg.src = e.logo; lg.alt = ''; anim(lg, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 500 }); }
    const w = el('div', f.endTitle, st); w.textContent = e.title;
    const tg = el('div', f.endLine, st); tg.textContent = e.line;
    anim(w, [{ opacity: 0, transform: 'translateY(1cqw)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 700 });
    anim(tg, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 1200 });
  },
};

/* Pinta el plano y devuelve cómo limpiarlo. Con `still` lo deja en su último
   fotograma: es lo que ve quien pide menos movimiento. */
export function renderShot(stage: HTMLElement, s: FilmShot, still = false) {
  /* Sin Web Animations (jsdom, navegadores muy viejos) el escenario se queda
     en su color de fondo: el texto del caso sigue entero debajo. */
  if (typeof stage.animate !== 'function') return () => {};
  stage.replaceChildren();
  const root = el('div', f.root, stage);
  const hooks: Hooks = { timers: [], frozen: still };
  R[s.kind](root, s.dur * 1000, s, hooks);
  if (still) root.getAnimations({ subtree: true }).forEach((a) => { try { a.finish(); } catch { /* las animaciones sin fin no se pueden terminar */ } });
  return () => {
    hooks.timers.forEach((t) => (t < 0 ? cancelAnimationFrame(-t) : clearTimeout(t)));
    root.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    stage.replaceChildren();
  };
}
