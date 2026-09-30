import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
const T = [['2017–2019', 'Taksio · Caracas'], ['2021–2022', 'Mercantil Panamá'], ['2022–2026', 'Atrinium · Málaga'], ['2026', 'Disponible']];
export default function Timeline({ s }: { s: Record<string, string> }) {
  return (
    <>
      <path d="M 60 200 H 740" className={s.line} />
      {T.map(([y, l], i) => (
        <motion.g key={y} variants={V}>
          <circle cx={100 + i * 210} cy={200} r={8} fill={i === 3 ? 'var(--focus)' : 'var(--ink)'} />
          <text x={100 + i * 210} y={170} textAnchor="middle" className={s.t}>{y}</text>
          <text x={100 + i * 210} y={236} textAnchor="middle" className={s.t3}>{l}</text>
        </motion.g>
      ))}
    </>
  );
}
