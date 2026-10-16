'use client';
import { RIDERA, RIDERB, GHOSTA, GHOSTB } from './pixelSprites';
import s from './pixelrun.module.css';

/* Un chico a lomos de un T-rex persigue a cuatro fantasmas de una punta a
   otra del dock. Lo dispara pasar de caso desde el dock: hacia la derecha
   (siguiente) corren de izquierda a derecha; hacia la izquierda, al revés y
   con los sprites girados. Es decoración: no recibe clics ni lo anuncia el
   lector de pantalla, y con movimiento reducido no se monta.

   Los sprites son rejillas de píxeles pintadas como rects de SVG con bordes
   nítidos; cada fila junta los píxeles seguidos del mismo color en un solo
   rect. Dos fotogramas por sprite (patas del rex, faldón de los fantasmas)
   se alternan por CSS, y el recorrido es un transform: todo en la GPU. */
const PX = 3;
const RIDER: Record<string, string> = { g: '#8bde5f', k: '#121317', h: '#2a1f1a', s: '#f2c3a0', b: '#4a44f2' };
const GHOSTS = ['#ff5a5a', '#ffb8f0', '#3fd8f0', '#ffb44d'];
const EYES: Record<string, string> = { w: '#ffffff', k: '#1b2a8f' };

function Pixels({ rows, palette }: { rows: string[]; palette: Record<string, string> }) {
  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.' || !palette[ch]) { x++; continue; }
      let w = 1;
      while (row[x + w] === ch) w++;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} fill={palette[ch]} />);
      x += w;
    }
  });
  return <>{rects}</>;
}

function Sprite({ a, b, palette, className, px = PX }: { a: string[]; b: string[]; palette: Record<string, string>; className?: string; px?: number }) {
  const w = a[0].length, h = a.length;
  return (
    <svg className={`${s.sprite} ${className ?? ''}`} width={w * px} height={h * px} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges">
      <g className={s.frameA}><Pixels rows={a} palette={palette} /></g>
      <g className={s.frameB}><Pixels rows={b} palette={palette} /></g>
    </svg>
  );
}

export default function PixelRun({ dir, onDone }: { dir: 'left' | 'right'; onDone: () => void }) {
  return (
    <div className={s.lane} aria-hidden="true">
      <div className={`${s.run} ${dir === 'left' ? s.toLeft : s.toRight}`}>
        {/* Los sprites tienen animaciones infinitas; la única que termina es
            el recorrido del grupo. */}
        <div className={s.cast} onAnimationEnd={(e) => { if (e.target === e.currentTarget) onDone(); }}>
          {/* El jinete, un punto más grande: es quien persigue. */}
          <Sprite a={RIDERA} b={RIDERB} palette={RIDER} className={s.rider} px={4} />
          {GHOSTS.map((c, i) => (
            <Sprite key={c} a={GHOSTA} b={GHOSTB} palette={{ x: c, ...EYES }} className={`${s.ghost} ${s[`g${i}`]}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
