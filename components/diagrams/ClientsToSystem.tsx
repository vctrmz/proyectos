import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
export default function ClientsToSystem({ s }: { s: Record<string, string> }) {
  const clients = ['Cliente A', 'Cliente B', 'Cliente C'];
  return (
    <>
      {clients.map((c, i) => (
        <motion.g key={c} variants={V}>
          <rect x={40} y={40 + i * 110} width={200} height={70} rx={16} className={s.box} />
          <text x={140} y={70 + i * 110} textAnchor="middle" className={s.t}>{c}</text>
          <text x={140} y={94 + i * 110} textAnchor="middle" className={s.t3}>moneda · idioma · regulador</text>
          <path d={`M240 ${75 + i * 110} C 320 ${75 + i * 110}, 340 200, 420 200`} className={s.line} />
        </motion.g>
      ))}
      <motion.g variants={V}>
        <rect x={420} y={150} width={150} height={100} rx={16} className={s.box} />
        <text x={495} y={192} textAnchor="middle" className={s.t}>Reglas</text>
        <text x={495} y={214} textAnchor="middle" className={s.t3}>declaradas como dato</text>
        <path d="M570 200 H 620" className={`${s.line} ${s.acc}`} />
      </motion.g>
      <motion.g variants={V}>
        <rect x={620} y={120} width={150} height={160} rx={20} className={s.boxInk} />
        <text x={695} y={190} textAnchor="middle" className={s.tw}>Sistema</text>
        <text x={695} y={212} textAnchor="middle" className={s.tw}>configurable</text>
        <text x={695} y={240} textAnchor="middle" className={s.tw} opacity={0.7} fontSize={12}>un solo producto</text>
      </motion.g>
    </>
  );
}
