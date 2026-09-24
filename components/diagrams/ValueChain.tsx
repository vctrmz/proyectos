import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
/* La cadena del seguro delegado: quién delega, quién suscribe, quién
   distribuye y quién compra. Es la explicación que Ayax necesita antes de
   cualquier pantalla, porque la categoría no se conoce. */
const LINKS = [
  ['Aseguradoras', 'Lloyd’s y compañías', 'delega'],
  ['Ayax', 'tarifica, emite y paga', 'crea producto'],
  ['Partners', 'corredores y bancos', 'distribuye'],
  ['Cliente final', 'taxistas, empresas', ''],
];
export default function ValueChain({ s }: { s: Record<string, string> }) {
  return (
    <>
      {LINKS.map(([n, sub, edge], i) => (
        <motion.g key={n} variants={V}>
          <rect x={16 + i * 196} y={140} width={168} height={92} rx={18} className={i === 1 ? s.boxInk : s.box} />
          <text x={100 + i * 196} y={180} textAnchor="middle" className={i === 1 ? s.tw : s.t}>{n}</text>
          <text x={100 + i * 196} y={204} textAnchor="middle" className={i === 1 ? `${s.tw} ${s.small}` : s.t3}>{sub}</text>
          {edge && <>
            <path d={`M ${184 + i * 196} 186 H ${212 + i * 196}`} className={`${s.line} ${s.acc}`} />
            {/* La etiqueta del enlace va encima de las cajas: en el hueco de 28 px
                no cabe y se metía debajo de la caja siguiente. */}
            <text x={198 + i * 196} y={126} textAnchor="middle" className={s.t3}>{edge}</text>
          </>}
        </motion.g>
      ))}
      <motion.g variants={V}>
        <text x={100} y={272} textAnchor="middle" className={s.t3}>asumen el riesgo</text>
        <text x={296} y={272} textAnchor="middle" className={s.t3}>decide por delegación</text>
        <text x={492} y={272} textAnchor="middle" className={s.t3}>venden</text>
        <text x={688} y={272} textAnchor="middle" className={s.t3}>compra</text>
      </motion.g>
    </>
  );
}
