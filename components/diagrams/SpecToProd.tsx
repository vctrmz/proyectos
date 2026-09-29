import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
/* Cómo se construye esta web: cada paso deja un documento que el siguiente
   consume. La caja oscura es la que no se delega: la revisión antes del commit. */
const STEPS = [
  ['Spec', 'qué y por qué', 'por escrito'],
  ['Plan', 'tareas pequeñas', 'con su test'],
  ['Código', 'Claude Code', 'tarea a tarea'],
  ['Revisión', 'mía, línea a línea', 'antes del commit'],
  ['Tests + axe', 'antes de publicar', 'o no se publica'],
];
export default function SpecToProd({ s }: { s: Record<string, string> }) {
  return (
    <>
      {STEPS.map(([n, verb, sub], i) => (
        <motion.g key={n} variants={V}>
          <rect x={20 + i * 156} y={130} width={136} height={110} rx={18} className={i === 3 ? s.boxInk : s.box} />
          <text x={88 + i * 156} y={166} textAnchor="middle" className={i === 3 ? s.tw : s.t}>{n}</text>
          <text x={88 + i * 156} y={190} textAnchor="middle" className={i === 3 ? `${s.tw} ${s.small}` : s.t3}>{verb}</text>
          <text x={88 + i * 156} y={212} textAnchor="middle" className={i === 3 ? `${s.tw} ${s.small}` : s.t3} opacity={i === 3 ? 0.72 : 1}>{sub}</text>
          {i < 4 && <path d={`M ${156 + i * 156} 185 H ${176 + i * 156}`} className={`${s.line} ${s.acc}`} />}
        </motion.g>
      ))}
      <text x={400} y={300} textAnchor="middle" className={s.t3}>cada paso deja un documento que el siguiente consume</text>
    </>
  );
}
