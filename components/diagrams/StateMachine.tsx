import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
const PH = [['Cualificación', 'closer · cliente', 'contacto · perfil · comité'], ['Negociación', 'closer · legal · cliente', 'propuesta firmada'], ['Cerrado', 'finanzas · onboarding', 'pago · producto preparado']];
/* "salida:" va en su propia línea: con el criterio en la misma se salía de la
   caja. La regla del diagrama es la misma que en la UI: si no cabe, no se
   aprieta, se baja de línea. */
export default function StateMachine({ s }: { s: Record<string, string> }) {
  return (
    <>
      {PH.map(([n, who, out], i) => (
        <motion.g key={n} variants={V}>
          <rect x={40 + i * 250} y={110} width={220} height={150} rx={20} className={i === 2 ? s.boxInk : s.box} />
          <text x={150 + i * 250} y={148} textAnchor="middle" className={i === 2 ? s.tw : s.t}>{n}</text>
          <text x={150 + i * 250} y={172} textAnchor="middle" className={i === 2 ? `${s.tw} ${s.small}` : s.t3}>{who}</text>
          <text x={150 + i * 250} y={212} textAnchor="middle" className={i === 2 ? `${s.tw} ${s.small}` : s.t3} opacity={0.72}>salida:</text>
          <text x={150 + i * 250} y={232} textAnchor="middle" className={i === 2 ? `${s.tw} ${s.small}` : s.t3}>{out}</text>
          {i < 2 && <path d={`M ${260 + i * 250} 185 H ${290 + i * 250}`} className={`${s.line} ${s.acc}`} />}
        </motion.g>
      ))}
      <text x={400} y={330} textAnchor="middle" className={s.t3}>tres fases con audiencia, permisos y criterio de salida · no un wizard de veinte pasos</text>
    </>
  );
}
