import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
/* Una marca, dos negocios: la tienda vende al cliente final y la landing de
   partners capta ópticas. Mismo catálogo y misma fotografía debajo. */
export default function TwoSided({ s }: { s: Record<string, string> }) {
  return (
    <>
      <motion.g variants={V}>
        <rect x={290} y={30} width={220} height={78} rx={18} className={s.boxInk} />
        <text x={400} y={62} textAnchor="middle" className={s.tw}>Montsaint</text>
        <text x={400} y={86} textAnchor="middle" className={`${s.tw} ${s.small}`} opacity={0.72}>colección y fotografía</text>
        <path d="M340 108 C 340 150, 190 150, 190 196" className={`${s.line} ${s.acc}`} />
        <path d="M460 108 C 460 150, 610 150, 610 196" className={`${s.line} ${s.acc}`} />
      </motion.g>
      <motion.g variants={V}>
        <rect x={60} y={196} width={260} height={120} rx={18} className={s.box} />
        <text x={190} y={232} textAnchor="middle" className={s.t}>Tienda · B2C</text>
        <text x={190} y={258} textAnchor="middle" className={s.t3}>catálogo, oferta y WhatsApp</text>
        <text x={190} y={280} textAnchor="middle" className={s.t3}>decide en una sesión</text>
        <text x={190} y={302} textAnchor="middle" className={s.t3}>cliente final</text>
      </motion.g>
      <motion.g variants={V}>
        <rect x={480} y={196} width={260} height={120} rx={18} className={s.box} />
        <text x={610} y={232} textAnchor="middle" className={s.t}>Partners · B2B</text>
        <text x={610} y={258} textAnchor="middle" className={s.t3}>prueba social y margen</text>
        <text x={610} y={280} textAnchor="middle" className={s.t3}>decide en semanas</text>
        <text x={610} y={302} textAnchor="middle" className={s.t3}>red de ópticas</text>
      </motion.g>
    </>
  );
}
