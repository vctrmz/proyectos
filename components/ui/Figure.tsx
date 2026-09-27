import Image from 'next/image';
import s from './Figure.module.css';

type Props = { src: string; alt: string; caption?: string; width: number; height: number; priority?: boolean; sizes?: string; className?: string };

/* Ninguna captura se amplía por encima de su tamaño real: una pantalla de
   móvil de 318 px estirada a mil se ve pixelada, y eso desmiente el trabajo
   que enseña. Las verticales van estrechas y enmarcadas como un teléfono; las
   horizontales ocupan lo que pueden sin pasarse. */
const PHONE_MAX = 280;
const WIDE_MIN = 460;

export default function Figure({ src, alt, caption, width, height, priority, sizes, className = '' }: Props) {
  const portrait = height > width * 1.15;
  const max = portrait ? Math.min(width, PHONE_MAX) : width;
  const basis = portrait ? Math.min(width, PHONE_MAX) : Math.min(width, WIDE_MIN);
  return (
    <figure className={`${s.fig} ${portrait ? s.phone : ''} ${className}`} style={{ maxWidth: max, flexBasis: basis }}>
      {/* Las capturas pequeñas ya vienen en WebP al tamaño en que se ven: pasarlas
          otra vez por el optimizador solo añade una variante más chica y las
          ablanda, así que se sirven tal cual. */}
      <Image src={src} alt={alt} width={width} height={height} priority={priority} sizes={sizes ?? `${max}px`} unoptimized={width <= 700} className={s.img} />
      {caption && <figcaption className={s.cap}>{caption}</figcaption>}
    </figure>
  );
}
