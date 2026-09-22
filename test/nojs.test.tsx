import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(''), usePathname: () => '/' }));
vi.mock('next/font/google', () => ({ Geist: () => ({ variable: 'geist' }) }));
import Hero from '@/components/home/Hero';
import Reveal from '@/components/motion/Reveal';
import ProjectCard from '@/components/catalog/ProjectCard';
import { PROJECTS } from '@/lib/content/projects';
import RootLayout from '@/app/layout';

/* Sin JavaScript el HTML servido debe ser legible: nada above-the-fold con
   opacity 0, y un <noscript> que neutralice los estados iniciales de motion. */
describe('sin JS', () => {
  it('el hero no se sirve oculto', () => {
    const html = renderToString(<Hero />);
    expect(html).not.toMatch(/opacity:\s*0/);
  });
  it('Reveal y las cards marcan data-reveal para el noscript', () => {
    expect(renderToString(<Reveal>x</Reveal>)).toContain('data-reveal');
    expect(renderToString(<ul><ProjectCard project={PROJECTS[0]} /></ul>)).toContain('data-reveal');
  });
  it('el layout incluye la regla noscript', () => {
    const html = renderToString(<RootLayout><p>x</p></RootLayout>);
    expect(html).toMatch(/<noscript>[^]*\[data-reveal\][^]*opacity:\s*1\s*!important/);
  });
});
