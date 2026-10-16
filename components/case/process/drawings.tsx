import type { WireBox } from '@/lib/content/cases/process';
import Wire, { fit, type Rect } from './wire';

/* Los dibujos que reconstruyen los pasos sin material ordenado, en un viewBox
   de 160 × 100. Van con el mismo trazo de mano que el boceto y el acento solo
   marca lo que se eligió o se decidió. Las variaciones (qué línea se subraya,
   quién gana la votación) salen de una semilla fija por caso: cada caso tiene
   su dibujo y el servidor y el cliente pintan lo mismo. */
export const seedOf = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);

const ARROW = (x1: number, y1: number, x2: number, y2: number, bend = 10) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - bend;
  const a = Math.atan2(y2 - my, x2 - mx);
  const h = 3;
  return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2} M${x2 - h * Math.cos(a - 0.5)} ${y2 - h * Math.sin(a - 0.5)} L${x2} ${y2} L${x2 - h * Math.cos(a + 0.5)} ${y2 - h * Math.sin(a + 0.5)}`;
};
const LOOP = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx + rx * 0.2} ${cy - ry} C${cx + rx * 1.15} ${cy - ry}, ${cx + rx * 1.1} ${cy + ry}, ${cx} ${cy + ry} C${cx - rx * 1.15} ${cy + ry}, ${cx - rx * 1.05} ${cy - ry * 0.95}, ${cx + rx * 0.1} ${cy - ry * 1.02} C${cx + rx * 0.6} ${cy - ry * 1.05}, ${cx + rx * 0.9} ${cy - ry * 0.7}, ${cx + rx * 0.95} ${cy - ry * 0.45}`;

/* Un post-it: cuadrado girado con dos renglones. */
function Note({ x, y, s = 11, rot = 0, accent = false }: { x: number; y: number; s?: number; rot?: number; accent?: boolean }) {
  const st = accent ? { 'data-a': '' } : { 'data-k': '' };
  return (
    <g transform={`rotate(${rot} ${x + s / 2} ${y + s / 2})`}>
      <rect {...st} x={x} y={y} width={s} height={s} rx={0.6} />
      <path data-k className="thin" d={`M${x + s * 0.18} ${y + s * 0.38} L${x + s * 0.8} ${y + s * 0.38} M${x + s * 0.18} ${y + s * 0.62} L${x + s * 0.6} ${y + s * 0.62}`} />
    </g>
  );
}

/* Requisitos: el brief con lo importante subrayado y las dudas en notas. */
export function BriefArt({ seed }: { seed: number }) {
  const ys = Array.from({ length: 10 }, (_, i) => 28 + i * 6);
  const hi = [2 + (seed % 3), 6 + (seed % 2)];
  const len = (i: number) => 0.55 + ((seed + i * 17) % 40) / 100;
  return (
    <>
      {hi.map((i) => <rect key={`m${i}`} data-f className="marker" x={19} y={ys[i] - 2} width={48 * len(i)} height={4} rx={1} />)}
      <path data-k d="M14 8 L66 8 L76 18 L76 92 L14 92 Z M66 8 L66 18 L76 18" />
      <path data-k d="M20 17 L52 17" style={{ strokeWidth: 2 }} />
      <path data-k className="thin" d={ys.map((y, i) => `M20 ${y} L${20 + 50 * len(i)} ${y}`).join(' ')} />
      <g transform="rotate(-4 107 26)">
        <rect data-k x={90} y={12} width={34} height={28} rx={0.6} />
        <path data-k className="thin" d="M95 20 L116 20 M95 26 L110 26" />
        <path data-a d="M115 29 C115 26, 120 26, 120 29 C120 31.5, 117.5 31.5, 117.5 34 M117.5 36.6 L117.5 36.8" />
      </g>
      <g transform="rotate(3 116 67)">
        <rect data-k x={98} y={52} width={36} height={30} rx={0.6} />
        <path data-k className="thin" d="M103 60 L126 60 M103 66 L120 66 M103 72 L114 72" />
      </g>
      <path data-a d={ARROW(90, 30, 20 + 50 * len(hi[0]) + 2, ys[hi[0]], -8)} />
    </>
  );
}

/* Benchmark: referencias en la pared, votos debajo y la elegida rodeada. Las
   referencias son variaciones de la propia pantalla del caso: productos de la
   misma familia, sin nombre. */
function variant(boxes: WireBox[], seed: number): WireBox[] {
  return boxes
    .filter((_, i) => (i + seed) % 5 !== 0)
    .map(([k, x, y, w, h, n], i) => [k, x + (((i * 7 + seed) % 5) - 2) * 1.4, y + (((i * 3 + seed) % 5) - 2) * 1.4, w, h, n] as WireBox);
}
export function BenchArt({ boxes, aspect, seed, uid }: { boxes: WireBox[]; aspect: number; seed: number; uid: string }) {
  const slots: Rect[] = [{ x: 6, y: 18, w: 44, h: 38 }, { x: 58, y: 14, w: 44, h: 38 }, { x: 110, y: 20, w: 44, h: 38 }];
  const votes = [[2, 5, 1], [1, 2, 5], [5, 1, 2]][seed % 3];
  const win = votes.indexOf(5);
  return (
    <>
      <path data-k d="M8 8 L46 8" style={{ strokeWidth: 1.8 }} />
      {slots.map((slot, i) => {
        const r = fit(aspect, slot);
        return (
          <g key={i}>
            <rect data-k x={r.x} y={r.y} width={r.w} height={r.h} rx={0.8} />
            <Wire boxes={variant(boxes, seed + i * 11)} r={r} mode="sketch" uid={uid} />
            {Array.from({ length: votes[i] }, (_, v) => <circle key={v} data-f className="vote" cx={slot.x + slot.w / 2 - (votes[i] - 1) * 2.4 + v * 4.8} cy={slot.y + slot.h + 6} r={1.5} />)}
          </g>
        );
      })}
      <path data-a d={LOOP(slots[win].x + slots[win].w / 2, slots[win].y + slots[win].h / 2, slots[win].w / 2 + 3, slots[win].h / 2 + 5)} />
      <Note x={118} y={78} rot={-6} />
      <Note x={132} y={80} rot={5} />
    </>
  );
}

/* Ideas: post-its agrupados en la reunión; un grupo se rodea y de él sale la
   idea elegida. */
export function IdeasArt({ seed }: { seed: number }) {
  const groups = [[16, 22], [40, 50], [18, 70]];
  const jit = (i: number) => (((seed + i * 13) % 9) - 4);
  const chosen = seed % 3;
  const [gx, gy] = groups[chosen];
  return (
    <>
      {groups.map(([x, y], g) => (
        <g key={g}>
          {[0, 1, 2].map((i) => <Note key={i} x={x + i * 12 + jit(g * 3 + i) * 0.5} y={y + (i % 2) * 6 + jit(g + i) * 0.4} rot={jit(i + g) * 1.5} />)}
        </g>
      ))}
      <path data-a d={LOOP(gx + 18, gy + 8, 24, 13)} />
      <path data-a d={ARROW(gx + 44, gy + 4, 108, 40, 14)} />
      <Note x={110} y={26} s={34} rot={-3} accent />
      <path data-a className="thick" d="M118 50 L124 56 L136 42" />
    </>
  );
}

/* Handoff: pantallas conectadas, la rama de error y anotaciones numeradas
   para desarrollo. Las pantallas son la propia del caso, en miniatura. */
export function FlowArt({ boxes, aspect, uid }: { boxes: WireBox[]; aspect: number; uid: string }) {
  const slots: Rect[] = [{ x: 6, y: 10, w: 40, h: 36 }, { x: 60, y: 10, w: 40, h: 36 }, { x: 114, y: 10, w: 40, h: 36 }];
  const rs = slots.map((s) => fit(aspect, s));
  const err = fit(aspect, { x: 60, y: 60, w: 40, h: 32 });
  const pins = [[rs[0].x + rs[0].w, rs[0].y], [rs[1].x + rs[1].w, rs[1].y + rs[1].h * 0.6], [rs[2].x + rs[2].w, rs[2].y]];
  return (
    <>
      {rs.map((r, i) => (
        <g key={i}>
          <rect data-k x={r.x} y={r.y} width={r.w} height={r.h} rx={0.8} />
          <Wire boxes={i === 1 ? boxes : boxes.filter((_, j) => j % (i + 2) !== 0)} r={r} mode="sketch" uid={uid} />
        </g>
      ))}
      <path data-k d={ARROW(rs[0].x + rs[0].w + 1, rs[0].y + rs[0].h / 2, rs[1].x - 1, rs[1].y + rs[1].h / 2, 6)} />
      <path data-k d={ARROW(rs[1].x + rs[1].w + 1, rs[1].y + rs[1].h / 2, rs[2].x - 1, rs[2].y + rs[2].h / 2, 6)} />
      <path data-k d={ARROW(rs[1].x + rs[1].w / 2, rs[1].y + rs[1].h + 1, err.x + err.w / 2, err.y - 1, 0)} />
      <rect data-k x={err.x} y={err.y} width={err.w} height={err.h} rx={0.8} />
      <path data-a className="thick" d={`M${err.x + err.w / 2} ${err.y + err.h * 0.25} L${err.x + err.w / 2} ${err.y + err.h * 0.58} M${err.x + err.w / 2} ${err.y + err.h * 0.74} L${err.x + err.w / 2} ${err.y + err.h * 0.76}`} />
      <path data-k className="thin" d={`M${err.x + err.w * 0.2} ${err.y + err.h * 0.88} L${err.x + err.w * 0.8} ${err.y + err.h * 0.88}`} />
      {pins.map(([x, y], i) => (
        <g key={i}>
          <circle data-a cx={x} cy={y} r={3} />
          <text data-f className="pin" x={x} y={y + 1.2} textAnchor="middle">{i + 1}</text>
        </g>
      ))}
    </>
  );
}
