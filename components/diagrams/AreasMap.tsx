import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } };
const AREAS = ['Suscripción', 'Pólizas', 'Recibos', 'Facturación', 'Siniestros', 'Administración', 'Usuarios', 'Reporting'];
export default function AreasMap({ s }: { s: Record<string, string> }) {
  return (
    <>
      <rect x={40} y={30} width={720} height={340} rx={24} className={s.box} />
      <text x={70} y={64} className={s.t3}>HERMES · 8 áreas sobre el mismo núcleo</text>
      {AREAS.map((a, i) => { const col = i % 4, row = Math.floor(i / 4); return (
        <motion.g key={a} variants={V}>
          <rect x={70 + col * 172} y={90 + row * 130} width={152} height={100} rx={16} className={s.boxInk} />
          <text x={146 + col * 172} y={146 + row * 130} textAnchor="middle" className={s.tw}>{a}</text>
        </motion.g>); })}
    </>
  );
}
