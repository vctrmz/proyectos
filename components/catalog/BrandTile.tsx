import type { Project } from '@/lib/content/projects';
import { sectorLabelIn } from '@/lib/content/en';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { readableOn } from '@/lib/content/brand';
import s from './BrandTile.module.css';

/* Miniatura estándar para las piezas sin captura: el logo de la marca sobre su
   color, con el nombre y el sector debajo. Nunca una imagen falsa. La tinta
   sale de readableOn; si la marca todavía no tiene logo, va su monograma en
   lugar de un logo prestado. */
const monogram = (name: string) =>
  name.replace(/[^A-Za-zÀ-ÿ ]/g, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '·';

export default function BrandTile({ project: p }: { project: Project }) {
  const locale = useLocale();
  const ink = readableOn(p.brand);
  return (
    <div className={`${s.tile} ${ink === 'light' ? s.onDark : s.onLight}`} data-testid="brand-tile" aria-hidden="true">
      {p.logo
        ? <img src={p.logo} alt="" className={s.logo} loading="lazy" decoding="async" />
        : <span className={s.mono}>{monogram(p.company)}</span>}
      <span className={s.name}>{p.company}</span>
      {p.sector && <span className={s.sub}>{sectorLabelIn(locale, p.sector)}</span>}
    </div>
  );
}
