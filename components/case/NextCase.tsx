import Link from 'next/link';
import StarfieldButton from '@/components/ui/StarfieldButton';
import { getCase } from '@/lib/content/cases';
import s from './case.module.css';
export default function NextCase({ slug }: { slug: string }) {
  const n = getCase(slug)!;
  return (
    <div className={s.next}>
      <Link href={`/casos/${n.slug}`} className={s.nextLink} aria-label={`Siguiente caso: ${n.title}`}><span>Siguiente caso</span><span>{n.title} →</span></Link>
      <StarfieldButton label="Contactar" href="/#contacto" />
    </div>
  );
}
