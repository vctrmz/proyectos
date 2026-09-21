import type { Project } from '@/lib/content/projects';
import { SECTOR_LABEL } from '@/lib/content/projects';
import s from './BrandTile.module.css';
/* Para piezas sin captura: nombre y sector sobre el color de marca. Nunca una imagen falsa. */
export default function BrandTile({ project: p }: { project: Project }) {
  const showLogo = !(p.logo.endsWith('hermes.webp') && p.company !== 'Atrinium' && !p.company.startsWith('HERMES'));
  return (
    <div className={s.tile} data-testid="brand-tile" aria-hidden="true">
      {showLogo && <img src={p.logo} alt="" className={s.logo} loading="lazy" decoding="async" />}
      <span className={s.name}>{p.company}</span>
      {p.sector && <span className={s.sub}>{SECTOR_LABEL[p.sector]}</span>}
    </div>
  );
}
