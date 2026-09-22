import Image from 'next/image';
import s from './about.module.css';
export default function Polaroid({ src, alt, caption, width = 400, height = 400 }: { src: string; alt: string; caption: string; width?: number; height?: number }) {
  return (
    <figure className={s.polaroid}>
      <Image src={src} alt={alt} width={width} height={height} sizes="320px" priority />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
