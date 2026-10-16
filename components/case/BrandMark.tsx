import type { Project } from '@/lib/content/projects';
import { readableOn } from '@/lib/content/brand';
import s from './case.module.css';

/* El logo del proyecto siempre sobre su color de marca: los logos en negativo
   (HERMES, Flesip, Montsaint) desaparecen sobre el fondo claro de la página.
   La tinta se calcula, como en las miniaturas del catálogo. */
export default function BrandMark({ p, size = 'md' }: { p: Project; size?: 'md' | 'lg' }) {
  const ink = readableOn(p.brand);
  return (
    <span className={`${s.mark} ${size === 'lg' ? s.markLg : ''} ${ink === 'light' ? s.markOnDark : s.markOnLight}`} style={{ background: p.brand }} aria-hidden="true">
      {p.logo && <img src={p.logo} alt="" />}
    </span>
  );
}
