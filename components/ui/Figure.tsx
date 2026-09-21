import Image from 'next/image';
import s from './Figure.module.css';
type Props = { src: string; alt: string; caption?: string; width: number; height: number; priority?: boolean; sizes?: string; className?: string };
export default function Figure({ src, alt, caption, width, height, priority, sizes = '(max-width: 768px) 100vw, 1200px', className = '' }: Props) {
  return (
    <figure className={`${s.fig} ${className}`}>
      <Image src={src} alt={alt} width={width} height={height} priority={priority} sizes={sizes} className={s.img} />
      {caption && <figcaption className={s.cap}>{caption}</figcaption>}
    </figure>
  );
}
