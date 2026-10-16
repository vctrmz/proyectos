import type { WireBox } from '@/lib/content/cases/process';

/* Dibuja una pantalla a partir de sus cajas (lib/content/cases/process.ts).
   La misma geometría sirve para el boceto y para el wireframe: lo que cambia
   es el estilo, que pone el contenedor (.sketch o .wire). Así el boceto, el
   wireframe y la captura real quedan alineados y la evolución se lee como
   una sola pantalla que madura.

   Léxico, igual que en el storyboard: `data-k` trazo de tinta, `data-a` trazo
   de acento (la acción principal), `data-f` relleno que entra al final,
   `data-solid` y `data-dark` rellenos del wireframe. */
export type Rect = { x: number; y: number; w: number; h: number };

/* Encaja una pantalla de proporción `aspect` (ancho / alto) dentro de un hueco. */
export function fit(aspect: number, box: Rect): Rect {
  const w = Math.min(box.w, box.h * aspect);
  const h = w / aspect;
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h };
}

/* Largos de línea que varían sin azar: la misma pantalla se dibuja igual en el
   servidor y en el cliente. */
const LEN = [1, 0.88, 0.74, 0.92, 0.6, 0.8];

export default function Wire({ boxes, r, mode, uid }: { boxes: WireBox[]; r: Rect; mode: 'sketch' | 'wire'; uid: string }) {
  const sk = mode === 'sketch';
  const out: React.ReactNode[] = [];
  boxes.forEach(([kind, bx, by, bw, bh, n = 1], i) => {
    const X = r.x + (bx / 100) * r.w, Y = r.y + (by / 100) * r.h, W = (bw / 100) * r.w, H = (bh / 100) * r.h;
    const k = `${i}`;
    switch (kind) {
      case 'frame':
        out.push(<rect key={k} data-k x={X} y={Y} width={W} height={H} rx={Math.min(1.2, W / 20)} />);
        break;
      case 'fill':
        out.push(<rect key={k} data-k data-dark={sk ? undefined : ''} x={X} y={Y} width={W} height={H} style={sk ? { fill: `url(#${uid}-h)` } : undefined} />);
        break;
      case 'img':
        out.push(<g key={k}><rect data-k data-solid={sk ? undefined : ''} x={X} y={Y} width={W} height={H} /><path data-k className="thin" d={`M${X} ${Y} L${X + W} ${Y + H} M${X + W} ${Y} L${X} ${Y + H}`} /></g>);
        break;
      case 'title':
        out.push(sk
          ? <path key={k} data-k d={`M${X} ${Y + H / 2} L${X + W} ${Y + H / 2}`} style={{ strokeWidth: Math.min(H * 0.55, 2.2) }} />
          : <rect key={k} data-k data-dark="" x={X} y={Y + H * 0.15} width={W} height={H * 0.7} rx={H * 0.2} />);
        break;
      case 'lines': {
        const gap = n > 1 ? H / (n - 1) : 0;
        out.push(<path key={k} data-k className="thin" d={Array.from({ length: n }, (_, j) => `M${X} ${Y + j * gap} L${X + W * LEN[(i + j) % LEN.length]} ${Y + j * gap}`).join(' ')} />);
        break;
      }
      case 'btn':
        out.push(<rect key={k} data-k x={X} y={Y} width={W} height={H} rx={H / 2} />);
        break;
      case 'cta':
        out.push(sk
          ? <rect key={k} data-a x={X} y={Y} width={W} height={H} rx={H / 2} />
          : <rect key={k} data-k data-cta="" x={X} y={Y} width={W} height={H} rx={H / 2} />);
        break;
      case 'input':
        out.push(<g key={k}><rect data-k x={X} y={Y} width={W} height={H} rx={0.6} /><path data-k className="thin" d={`M${X + Math.min(1.5, W * 0.06)} ${Y + H / 2} L${X + W * 0.4} ${Y + H / 2}`} /></g>);
        break;
      case 'table': {
        const rh = H / (n + 1);
        const rows = Array.from({ length: n + 1 }, (_, j) => `M${X} ${Y + j * rh + rh} L${X + W} ${Y + j * rh + rh}`).join(' ');
        const cells = Array.from({ length: n }, (_, j) => {
          const yy = Y + (j + 1) * rh + rh / 2;
          return `M${X + 1} ${yy} L${X + W * 0.22} ${yy} M${X + W * 0.35} ${yy} L${X + W * 0.48} ${yy} M${X + W * 0.62} ${yy} L${X + W * 0.74} ${yy}`;
        }).join(' ');
        out.push(<g key={k}><path data-k d={`M${X} ${Y + rh / 2} L${X + W * 0.6} ${Y + rh / 2}`} /><path data-k className="thin" d={rows} /><path data-k className="thin" d={cells} /></g>);
        break;
      }
      case 'cards': {
        const g = Math.min(2, W * 0.03), cw = (W - g * (n - 1)) / n;
        out.push(<g key={k}>{Array.from({ length: n }, (_, j) => {
          const cx = X + j * (cw + g);
          return <g key={j}><rect data-k x={cx} y={Y} width={cw} height={H} rx={0.8} /><path data-k className="thin" d={`M${cx + cw * 0.12} ${Y + H * 0.35} L${cx + cw * 0.5} ${Y + H * 0.35} M${cx + cw * 0.12} ${Y + H * 0.65} L${cx + cw * 0.75} ${Y + H * 0.65}`} /></g>;
        })}</g>);
        break;
      }
      case 'list': {
        const g = Math.min(1.5, H * 0.04), lh = (H - g * (n - 1)) / n;
        out.push(<g key={k}>{Array.from({ length: n }, (_, j) => {
          const ly = Y + j * (lh + g);
          return <g key={j}><rect data-k x={X} y={ly} width={W} height={lh} rx={0.8} /><path data-k className="thin" d={`M${X + W * 0.06} ${ly + lh * 0.38} L${X + W * 0.45} ${ly + lh * 0.38} M${X + W * 0.06} ${ly + lh * 0.66} L${X + W * 0.3} ${ly + lh * 0.66} M${X + W * 0.72} ${ly + lh * 0.5} L${X + W * 0.9} ${ly + lh * 0.5}`} /></g>;
        })}</g>);
        break;
      }
      case 'dot':
        out.push(<circle key={k} data-k cx={X + W / 2} cy={Y + H / 2} r={Math.min(W, H) / 2} />);
        break;
      case 'chips': {
        const g = Math.min(1.2, W * 0.03), cw = (W - g * (n - 1)) / n;
        out.push(<g key={k}>{Array.from({ length: n }, (_, j) => <rect key={j} data-k x={X + j * (cw + g)} y={Y} width={cw} height={H} rx={H / 2} />)}</g>);
        break;
      }
      case 'nav': {
        const g = W / n;
        out.push(<path key={k} data-k className="thin" d={Array.from({ length: n }, (_, j) => `M${X + j * g} ${Y + H / 2} L${X + j * g + g * 0.62} ${Y + H / 2}`).join(' ')} />);
        break;
      }
    }
  });
  return <>{out}</>;
}
