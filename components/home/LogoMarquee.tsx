import s from './LogoMarquee.module.css';
const LOGOS = [
  ['Atrinium · HERMES', '/assets/logos/hermes.webp'], ['Flesip', '/assets/logos/flesip.webp'], ['Montsaint', '/assets/logos/montsaint.webp'],
  ['Mercantil Panamá', '/assets/logos/mercantil.webp'], ['Mony', '/assets/logos/mony.webp'], ['Wakari Solutions', '/assets/logos/wakari.webp'],
  ['Linikit', '/assets/logos/linikit.png'], ['Ayax', '/assets/logos/ayax.webp'],
] as const;
/* Discretos a propósito: monocromo, 18 px, sin color al pasar. Dos copias para el bucle. */
export default function LogoMarquee() {
  return (
    <div className={s.wrap}>
      <ul className={s.track} aria-label="Empresas con las que he trabajado">
        {[0, 1].map((copy) => LOGOS.map(([name, src]) => (
          <li key={copy + name} className={s.pill} aria-hidden={copy === 1 ? true : undefined}><img src={src} alt={copy === 0 ? name : ''} loading="lazy" decoding="async" />{name}</li>
        )))}
      </ul>
    </div>
  );
}
