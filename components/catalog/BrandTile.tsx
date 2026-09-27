import type { Project } from '@/lib/content/projects';
import { sectorLabelIn } from '@/lib/content/en';
import { useLocale } from '@/lib/i18n/LocaleContext';
import s from './BrandTile.module.css';

/* Miniatura estándar para las piezas sin captura: el logo de la marca sobre su
   color, con el nombre y el sector debajo. Nunca una imagen falsa.

   El contraste no se decide a ojo: se calcula la luminancia del color de marca
   y se elige tinta blanca o negra, así que cualquier marca que se añada mañana
   entra con contraste suficiente sin tocar el CSS. Si la marca todavía no
   tiene logo, va su monograma en lugar de un logo prestado. */
function readableOn(hex: string): 'light' | 'dark' {
  const h = hex.replace('#', '');
  const to = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(to(0)) + 0.7152 * lin(to(2)) + 0.0722 * lin(to(4));
  /* Contraste con blanco frente a contraste con negro: gana el mayor. */
  return (1.05 / (L + 0.05)) >= ((L + 0.05) / 0.05) ? 'light' : 'dark';
}

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
