import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
/* Pidemony son dos personas en dos superficies: quien pide lo hace en la app
   de mony y quien paga, desde el navegador con su tarjeta. Entre las dos solo
   viaja un enlace, y ese enlace tiene fecha de caducidad. */
export default function PideYPaga({ s }: { s: Record<string, string> }) {
  return (
    <>
      <motion.g variants={V}>
        <rect x={30} y={120} width={250} height={130} rx={18} className={s.box} />
        <text x={155} y={158} textAnchor="middle" className={s.t}>Quien pide · app mony</text>
        <text x={155} y={184} textAnchor="middle" className={s.t3}>a quién, cuánto y por qué</text>
        <text x={155} y={206} textAnchor="middle" className={s.t3}>confirma y acepta términos</text>
        <text x={155} y={228} textAnchor="middle" className={s.t3}>stepper de cuatro tramos</text>
      </motion.g>
      <motion.g variants={V}>
        <path d="M 280 185 H 520" className={`${s.line} ${s.acc}`} />
        <rect x={325} y={150} width={150} height={70} rx={35} className={s.boxInk} />
        <text x={400} y={180} textAnchor="middle" className={s.tw}>Enlace</text>
        <text x={400} y={202} textAnchor="middle" className={`${s.tw} ${s.small}`} opacity={0.72}>por WhatsApp · caduca</text>
      </motion.g>
      <motion.g variants={V}>
        <rect x={520} y={120} width={250} height={130} rx={18} className={s.box} />
        <text x={645} y={158} textAnchor="middle" className={s.t}>Quien paga · navegador</text>
        <text x={645} y={184} textAnchor="middle" className={s.t3}>ve quién le pide y para qué</text>
        <text x={645} y={206} textAnchor="middle" className={s.t3}>paga con Visa o Mastercard</text>
        <text x={645} y={228} textAnchor="middle" className={s.t3}>o ve que el enlace venció</text>
      </motion.g>
      <text x={400} y={300} textAnchor="middle" className={s.t3}>una guía de estilo para cada superficie, con la misma paleta y la misma tipografía</text>
    </>
  );
}
