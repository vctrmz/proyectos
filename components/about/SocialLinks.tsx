import { SITE } from '@/lib/content/site';
import { SOCIAL_ICON, type SocialName } from '@/components/ui/socialIcons';
import s from './about.module.css';
const LINKS: [SocialName, string][] = [['LinkedIn', SITE.linkedin], ['Behance', SITE.behance]];
export default function SocialLinks() {
  return (
    <ul className={s.social} aria-label="Redes">
      {LINKS.map(([name, href]) => <li key={name}><a href={href} target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={SOCIAL_ICON[name]} /></svg>{name} ↗</a></li>)}
    </ul>
  );
}
