import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };
export default function Grid12to4to1({ s }: { s: Record<string, string> }) {
  const finalists = [1, 4, 6, 9];
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <motion.g key={i} variants={V}>
          <rect x={40 + (i % 4) * 70} y={60 + Math.floor(i / 4) * 90} width={56} height={70} rx={10} className={finalists.includes(i) ? s.boxInk : s.box} />
        </motion.g>
      ))}
      <text x={175} y={360} textAnchor="middle" className={s.t3}>12 composiciones</text>
      <path d="M 340 200 H 400" className={`${s.line} ${s.acc}`} />
      {finalists.map((f, i) => <motion.g key={f} variants={V}><rect x={420 + i * 62} y={165} width={50} height={70} rx={10} className={s.boxInk} /></motion.g>)}
      <text x={540} y={360} textAnchor="middle" className={s.t3}>4 direcciones</text>
      <path d="M 680 200 H 710" className={`${s.line} ${s.acc}`} />
      <motion.g variants={V}><rect x={715} y={150} width={60} height={100} rx={12} fill="var(--focus)" /></motion.g>
      <text x={745} y={360} textAnchor="middle" className={s.t3}>1 en producción</text>
    </>
  );
}
