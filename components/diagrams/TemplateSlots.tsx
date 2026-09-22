import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } };
export default function TemplateSlots({ s }: { s: Record<string, string> }) {
  const line = (y: number, w: number) => <rect x={80} y={y} width={w} height={8} rx={4} fill="var(--line)" />;
  return (
    <>
      <rect x={40} y={30} width={520} height={340} rx={20} className={s.box} />
      {line(70, 420)}{line(92, 380)}
      <motion.g variants={V}><rect x={80} y={120} width={150} height={26} rx={13} className={s.boxInk} /><text x={155} y={138} textAnchor="middle" className={s.tw}>@cliente.nombre</text></motion.g>
      {line(170, 440)}{line(192, 300)}
      <motion.g variants={V}><rect x={80} y={220} width={200} height={26} rx={13} fill="var(--focus)" /><text x={180} y={238} textAnchor="middle" className={s.tw}>/tabla-de-primas</text></motion.g>
      <motion.g variants={V}><rect x={80} y={270} width={440} height={60} rx={12} fill="none" stroke="var(--ink-3)" strokeDasharray="6 6" /><text x={100} y={305} className={s.t3}>cláusula opcional · se activa como bloque</text></motion.g>
      <text x={600} y={140} className={s.t}>@ variables</text>
      <text x={600} y={240} className={s.t}>/ componentes</text>
      <text x={600} y={305} className={s.t}>bloques opcionales</text>
      <text x={600} y={330} className={s.t3}>lo bloqueado no se toca</text>
    </>
  );
}
