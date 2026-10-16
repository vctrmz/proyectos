import type { StoryDrawId } from '@/lib/content/cases/types';

/* Fotogramas dibujados del storyboard, en un viewBox de 320 × 180.

   Léxico: `data-k` es un trazo de tinta, `data-a` un trazo de acento y
   `data-f` un relleno de acento. El acento solo marca lo que se decide o se
   elige; mientras el caso plantea el problema, los dibujos van en tinta.
   El orden del marcado es el orden en que los dibujaría una mano —estructura,
   detalle, rellenos—, y DrawFrame lo respeta al trazarlos. */

const X = (i: number) => 14 + i * 60; // cinco ventanas de 52 de ancho

/* Las cinco ventanas del primer plano: cada producto resuelve cabecera,
   contenido y botón a su manera. */
function FiveLanguages() {
  const R = [0, 3, 9, 1.5, 13];
  return (
    <>
      {R.map((r, i) => <rect key={`w${i}`} data-k x={X(i)} y={46} width={52} height={88} rx={r} />)}
      {/* cabeceras: cinco maneras de decir «esto es una cabecera» */}
      <path data-k d={`M${X(0)} 60 H${X(0) + 52} M${X(0) + 6} 53 H${X(0) + 26}`} />
      <path data-k d={`M${X(1)} 60 H${X(1) + 52}`} />
      {[7, 12, 17].map((dx) => <circle key={dx} data-k cx={X(1) + dx} cy={53} r={1.6} />)}
      <path data-k className="thick" d={`M${X(2) + 7} 56 H${X(2) + 34}`} />
      <rect data-k x={X(3) + 5} y={51} width={14} height={8} /><rect data-k x={X(3) + 21} y={51} width={14} height={8} />
      <path data-k d={`M${X(4) + 16} 55 H${X(4) + 36} M${X(4)} 62 H${X(4) + 52}`} />
      {/* contenido */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={`c${i}`} data-k className="thin" d={`M${X(i) + 6} 72 H${X(i) + 42 - i * 3} M${X(i) + 6} 79 H${X(i) + 34 + i * 2} M${X(i) + 6} 86 H${X(i) + 28}`} />
      ))}
      {/* botones: cuadrado, píldora, a la derecha, enlace subrayado, ancho */}
      <rect data-k x={X(0) + 6} y={116} width={20} height={9} />
      <rect data-k x={X(1) + 6} y={116} width={24} height={9} rx={4.5} />
      <rect data-k x={X(2) + 26} y={116} width={20} height={9} />
      <path data-k d={`M${X(3) + 6} 119 H${X(3) + 24} M${X(3) + 6} 123 H${X(3) + 24}`} />
      <rect data-k x={X(4) + 6} y={113} width={40} height={12} rx={6} />
    </>
  );
}

/* El último plano rima con el primero: las mismas cinco ventanas, ahora con la
   misma cabecera, el mismo contenido y el mismo botón de acento. */
function OneLanguage() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => <rect key={`w${i}`} data-k x={X(i)} y={46} width={52} height={88} rx={6} />)}
      {[0, 1, 2, 3, 4].map((i) => <path key={`h${i}`} data-k d={`M${X(i)} 60 H${X(i) + 52} M${X(i) + 6} 53 H${X(i) + 26}`} />)}
      {[0, 1, 2, 3, 4].map((i) => <path key={`c${i}`} data-k className="thin" d={`M${X(i) + 6} 72 H${X(i) + 40} M${X(i) + 6} 79 H${X(i) + 34} M${X(i) + 6} 86 H${X(i) + 28}`} />)}
      {[0, 1, 2, 3, 4].map((i) => <rect key={`b${i}`} data-a x={X(i) + 6} y={115} width={24} height={10} rx={5} />)}
      {[0, 1, 2, 3, 4].map((i) => <rect key={`f${i}`} data-f x={X(i) + 6} y={115} width={24} height={10} rx={5} />)}
    </>
  );
}

/* Cuatro selectores casi iguales: misma pieza, cuatro implementaciones. */
function Copies() {
  const xs = [12, 94, 176, 258];
  const ne = (cx: number) => `M${cx - 5} 87 H${cx + 5} M${cx - 5} 93 H${cx + 5} M${cx + 4} 83 L${cx - 4} 97`;
  return (
    <>
      <rect data-k x={xs[0]} y={81} width={56} height={18} rx={2} />
      <rect data-k x={xs[1]} y={79} width={56} height={22} rx={11} />
      <rect data-k x={xs[2]} y={82} width={56} height={16} />
      <rect data-k x={xs[3]} y={80} width={56} height={20} rx={6} />
      {/* etiquetas: cada una con su tamaño y su peso */}
      <path data-k d={`M${xs[0]} 72 H${xs[0] + 24}`} />
      <path data-k className="thick" d={`M${xs[1] + 4} 70 H${xs[1] + 22}`} />
      <path data-k className="thin" d={`M${xs[2]} 74 H${xs[2] + 30}`} />
      <path data-k d={`M${xs[3]} 108 H${xs[3] + 26}`} />
      {/* valores */}
      {xs.map((x) => <path key={`v${x}`} data-k className="thin" d={`M${x + 8} 90 H${x + 30}`} />)}
      {/* cuatro chevrons distintos */}
      <path data-k d={`M${xs[0] + 44} 88 L${xs[0] + 48} 92 L${xs[0] + 52} 88`} />
      <path data-k d={`M${xs[1] + 42} 88 H${xs[1] + 50} L${xs[1] + 46} 93 Z`} />
      <path data-k d={`M${xs[2] + 40} 82 V98 M${xs[2] + 45} 89 L${xs[2] + 48} 92 L${xs[2] + 51} 89`} />
      <path data-k d={`M${xs[3] + 44} 87 L${xs[3] + 47} 84 L${xs[3] + 50} 87 M${xs[3] + 44} 93 L${xs[3] + 47} 96 L${xs[3] + 50} 93`} />
      {[81, 163, 245].map((cx) => <path key={`n${cx}`} data-k d={ne(cx)} />)}
    </>
  );
}

/* Un sistema pesado cae igual sobre cinco productos. Los dos ligeros no lo
   necesitan: el círculo trazado marca dónde está el problema. */
function OneSize() {
  const big = [18, 74, 130];
  const small = [210, 256];
  return (
    <>
      <rect data-k x={110} y={16} width={100} height={48} rx={4} />
      {[24, 31, 38, 45, 52].map((y) => <path key={y} data-k className="thin" d={`M118 ${y + 2} H202`} />)}
      {big.map((x) => <rect key={`b${x}`} data-k x={x} y={112} width={44} height={50} rx={4} />)}
      {small.map((x) => <rect key={`s${x}`} data-k x={x} y={128} width={28} height={30} rx={3} />)}
      {[...big.map((x) => [x + 22, 112]), ...small.map((x) => [x + 14, 128])].map(([x, y]) => (
        <path key={`ar${x}`} data-k className="thin" d={`M160 64 L${x} ${y - 6} M${x - 3} ${y - 10} L${x} ${y - 6} L${x + 3} ${y - 10}`} />
      ))}
      {big.map((x) => <path key={`l${x}`} data-k className="thin" d={`M${x + 6} 124 H${x + 34} M${x + 6} 131 H${x + 28}`} />)}
      <path data-a className="thick" d="M247 117 C 284 115, 300 132, 294 146 C 288 162, 222 166, 206 152 C 192 140, 205 120, 238 116 C 262 113, 285 122, 289 134" />
    </>
  );
}

/* Los tokens salen como datos —una sola hoja con sus muestras— y un tronco
   los reparte a cuatro front; cada pantalla los adopta con un check. Las
   conexiones van en ángulo recto, como un esquema, y ninguna cruza otra
   pantalla. */
function FourFronts() {
  const screens: [number, number][] = [[178, 30], [246, 30], [178, 106], [246, 106]];
  const rows = [46, 60, 74, 88, 102, 116, 130];
  return (
    <>
      <rect data-k x={26} y={30} width={84} height={120} rx={8} />
      <path data-k className="thin" d="M26 40 H110" />
      {rows.map((y, i) => <path key={y} data-k className="thin" d={`M50 ${y + 6} H${98 - (i % 3) * 10}`} />)}
      {screens.map(([x, y]) => <rect key={`s${x}${y}`} data-k x={x} y={y} width={58} height={44} rx={5} />)}
      {screens.map(([x, y]) => <path key={`h${x}${y}`} data-k className="thin" d={`M${x} ${y + 10} H${x + 58} M${x + 6} ${y + 18} H${x + 32}`} />)}
      <path data-k className="thin" d="M110 90 H140 M140 52 V128 M140 52 H178 M140 128 H178 M140 90 H275 V74 M275 90 V106" />
      {rows.map((y) => <rect key={`sw${y}`} data-f x={36} y={y + 2} width={8} height={8} rx={2} />)}
      {screens.map(([x, y]) => <path key={`c${x}${y}`} data-a className="thick" d={`M${x + 22} ${y + 30} L${x + 28} ${y + 36} L${x + 40} ${y + 24}`} />)}
    </>
  );
}

export const DRAWINGS: Record<StoryDrawId, () => React.ReactElement> = {
  'five-languages': FiveLanguages,
  'one-language': OneLanguage,
  copies: Copies,
  'one-size': OneSize,
  'four-fronts': FourFronts,
};
