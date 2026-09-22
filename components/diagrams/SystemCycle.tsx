import { motion } from 'motion/react';
const V = { hidden: { opacity: 0 }, show: { opacity: 1 } };
export default function SystemCycle({ s }: { s: Record<string, string> }) {
  return (
    <>
      <motion.g variants={V}><rect x={60} y={140} width={220} height={120} rx={20} className={s.boxInk} /><text x={170} y={195} textAnchor="middle" className={s.tw}>Design system</text><text x={170} y={218} textAnchor="middle" className={s.tw} opacity={0.7} fontSize={12}>tokens · componentes · reglas</text></motion.g>
      <motion.g variants={V}><rect x={520} y={140} width={220} height={120} rx={20} className={s.box} /><text x={630} y={195} textAnchor="middle" className={s.t}>Módulo nuevo</text><text x={630} y={218} textAnchor="middle" className={s.t3}>se arma con lo que existe</text></motion.g>
      <motion.g variants={V}>
        <path d="M 280 170 C 380 110, 420 110, 520 170" className={`${s.line} ${s.acc}`} />
        <text x={400} y={118} textAnchor="middle" className={s.t3}>alimenta</text>
        <path d="M 520 230 C 420 290, 380 290, 280 230" className={`${s.line} ${s.acc}`} />
        <text x={400} y={300} textAnchor="middle" className={s.t3}>devuelve componentes</text>
      </motion.g>
    </>
  );
}
