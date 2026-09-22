# Rediseño Antigravity — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a light, Antigravity-styled site with Felipe Cardona's structure: short hero, single filterable catalog, per-case pages, first-person "sobre mí", with fluid React transitions.

**Architecture:** Next.js 16 App Router with static routes (`/`, `/casos/[slug]`, `/sobre-mi`, `/privacidad`). Content lives in typed modules under `lib/content/`; UI primitives under `components/ui/`; motion is gated in `lib/motion/prefs.ts` and applied by three tools each with one job (View Transitions for routes, `motion` for layout/presence, GSAP ScrollTrigger + Lenis for scroll). CSS Modules + global tokens; zero inline styles except dynamic values.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, `motion` (Framer Motion), `lenis`, GSAP 3 + ScrollTrigger, `next/font` Geist, `next/image`, sharp (via next), Vitest + Testing Library, Playwright + axe-core.

**Spec:** `docs/superpowers/specs/2026-09-22-rediseno-antigravity-design.md`

## Global Constraints

- No invented metrics, clients or outcomes. Where an outcome is unknown, the literal text is `Dato no disponible`.
- CV-only figures (12 idiomas y locales, 347 permisos, ciclo 5 → 2 días, tickets) do **not** appear until Víctor confirms them.
- Colors only via tokens in `app/globals.css`; `--accent #8bde5f` only inside `.inset` blocks. No text color below `--ink-3 #6a6a71` on white.
- Type scale tokens `--fs-100…--fs-1100`; floors: 12.5 px metadata, 14.5 px reading.
- Radii: 36 (media/insets), 16 (cards), 9999 (pills). Container 1200 px, gutter `clamp(20px, 4vw, 72px)`.
- Fonts: Geist only (next/font). Remove Montserrat, Bebas Neue, Remixicon.
- No `style={{}}` except dynamic values (brand color, index vars).
- Every interactive element: real `<a>`/`<button>`, `:focus-visible` ring, ≥ 44 px target.
- Motion: only `transform`/`opacity`; off under `prefers-reduced-motion: reduce`; scroll effects also off under `pointer: coarse`. No loader, no custom cursor, no word rotator.
- Landmarks on every page: `<header>`, `<nav>`, `<main id="contenido">`, `<footer>`, skip link.
- Commit after each task on branch `redesign/antigravity`; `npm test` green at every commit.

## Review Focus

1. `/?f=<unknown>` or `/?f=` → catalog shows all 10 projects and the "Todo" chip is checked (Task 9 test `parseFilter`).
2. `prefers-reduced-motion: reduce` on desktop → no Lenis, no ScrollTrigger scrub, inset renders at full scale, marquee static, manifest fully opaque (Task 6 test `motionAllowed`, Task 10 test Manifesto SSR text).
3. Keyboard user on `/` → Tab reaches chips (arrow keys change filter), Tab reaches each card, Enter opens `/casos/hermes` (Task 9 test + Task 15 Playwright).
4. `/casos/<unknown-slug>` → 404, not a crash (Task 12 test `getCase` returns `undefined`, page calls `notFound()`).
5. Project without screenshot (mercantil, taksio, flesip, montsaint, ayax) → card still renders a 4:3 tile with the brand color and logo, never a broken `<img>` (Task 9 test `BrandTile`).

---

### Task 1: Foundations — deps, fonts, tokens, config

**Files:**
- Modify: `package.json` (add `motion`, `lenis`, `@axe-core/playwright`, `playwright` dev)
- Modify: `next.config.ts`
- Rewrite: `app/globals.css`
- Rewrite: `app/layout.tsx`
- Create: `components/layout/SkipLink.tsx`, `components/layout/SkipLink.module.css`
- Test: `test/tokens.test.ts`

**Interfaces:**
- Produces: CSS custom properties listed below, class `.container`, `.inset`, `.visually-hidden`; `RootLayout` renders `<SkipLink/>`, `{children}`, `<ConsentBanner/>`.

- [ ] **Step 1: Install dependencies**

```bash
npm i motion lenis
npm i -D playwright @axe-core/playwright
```

- [ ] **Step 2: Write the failing token test**

`test/tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

describe('tokens', () => {
  it('define los tokens del sistema', () => {
    for (const t of ['--bg', '--ink', '--ink-2', '--ink-3', '--surface', '--line', '--inset-bg', '--inset-ink', '--accent', '--focus', '--r-media', '--r-card', '--r-pill', '--fs-100', '--fs-1100', '--sp-8', '--sp-128', '--container']) {
      expect(css, t).toContain(t + ':');
    }
  });
  it('no usa los grises retirados ni fuentes antiguas', () => {
    for (const bad of ['#6d6d6d', '#4d4d4d', '#878787', '#262626', 'bebas', 'montserrat', 'remixicon']) {
      expect(css.toLowerCase(), bad).not.toContain(bad);
    }
  });
  it('tiene focus-visible global y reduced-motion', () => {
    expect(css).toMatch(/:focus-visible\s*\{/);
    expect(css).toContain('prefers-reduced-motion: reduce');
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run test/tokens.test.ts`
Expected: FAIL (tokens missing, `bebas` present).

- [ ] **Step 4: Rewrite `app/globals.css`**

```css
:root {
  --bg: #ffffff; --ink: #121317; --ink-2: #45474d; --ink-3: #6a6a71;
  --surface: #f8f9fc; --line: rgba(183,191,217,0.18);
  --inset-bg: #1b1e27; --inset-ink: #ececec; --inset-ink-2: #b4b8c4; --accent: #8bde5f;
  --glow: linear-gradient(135deg, rgba(74,68,242,0.12), rgba(139,222,95,0.12), rgba(248,249,252,0.12));
  --focus: #4a44f2;
  --fs-100: 0.78125rem; --fs-200: 0.90625rem; --fs-300: 1rem; --fs-400: 1.09375rem; --fs-500: 1.25rem;
  --fs-600: 1.5rem; --fs-700: 1.75rem; --fs-800: clamp(2rem, 4vw, 2.625rem); --fs-900: clamp(2.25rem, 5vw, 3.375rem);
  --fs-1000: clamp(2.75rem, 7vw, 5rem); --fs-1100: clamp(3.5rem, 9vw, 6.6875rem);
  --sp-4: 4px; --sp-8: 8px; --sp-12: 12px; --sp-16: 16px; --sp-24: 24px; --sp-32: 32px; --sp-48: 48px; --sp-64: 64px; --sp-96: 96px; --sp-128: 128px;
  --r-media: 36px; --r-card: 16px; --r-pill: 9999px;
  --container: 1200px; --gutter: clamp(20px, 4vw, 72px);
  --section: clamp(64px, 8vw, 128px);
  --shadow-chip: 0 2px 4px rgba(49,49,49,0.10);
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--font-geist), system-ui, sans-serif; font-size: var(--fs-300); line-height: 1.55; -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4, p { margin: 0; }
h1, h2, h3 { font-weight: 500; letter-spacing: -0.02em; line-height: 1.15; text-wrap: balance; }
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
img, svg, video { display: block; max-width: 100%; }
::selection { background: rgba(74,68,242,0.18); }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; border-radius: 4px; }
.container { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
.section { padding-block: var(--section); }
.inset { background: var(--inset-bg); color: var(--inset-ink); border-radius: var(--r-media); margin-inline: 8px; overflow: hidden; }
@media (max-width: 767px) { .inset { margin-inline: 0; border-radius: 24px; } }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.two-tone > span:last-child { color: var(--ink-2); }
.inset .two-tone > span:last-child { color: var(--inset-ink-2); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }
}
/* Privacidad (ámbito .legal), restilada con tokens */
.legal main { max-width: 820px; margin: 0 auto; padding: clamp(120px, 14vh, 170px) var(--gutter) var(--sp-96); }
.legal h1 { font-size: var(--fs-1000); letter-spacing: -0.03em; margin-bottom: var(--sp-16); }
.legal .kicker { font-size: var(--fs-100); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: var(--sp-16); }
.legal .lead { font-size: var(--fs-400); color: var(--ink-2); max-width: 62ch; margin-bottom: var(--sp-48); }
.legal .updated { font-size: var(--fs-100); color: var(--ink-3); margin-bottom: var(--sp-8); }
.legal section { border-top: 1px solid var(--line); padding-block: var(--sp-32); }
.legal h2 { font-size: var(--fs-700); margin-bottom: var(--sp-16); }
.legal h2 b { font-weight: 500; }
.legal p, .legal li { font-size: var(--fs-200); color: var(--ink-2); line-height: 1.65; }
.legal p strong, .legal li strong { color: var(--ink); font-weight: 500; }
.legal ul { margin: 0; padding-left: 20px; }
.legal li { margin: 6px 0; }
.legal code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: var(--fs-100); background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 1px 6px; }
.legal .tools { display: grid; gap: var(--sp-12); margin-top: var(--sp-16); }
.legal .tool { border: 1px solid var(--line); border-radius: var(--r-card); padding: var(--sp-16); background: var(--surface); }
.legal .tool h3 { font-size: var(--fs-300); margin-bottom: 6px; }
.legal .tool p { margin: 0; font-size: var(--fs-200); }
.legal .tool .who { display: block; font-size: var(--fs-100); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 8px; }
.legal .table-wrap { overflow-x: auto; margin-top: var(--sp-16); border: 1px solid var(--line); border-radius: var(--r-card); }
.legal table { width: 100%; border-collapse: collapse; font-size: var(--fs-200); }
.legal th, .legal td { text-align: left; padding: 11px 14px; border-bottom: 1px solid var(--line); vertical-align: top; }
.legal th { font-size: var(--fs-100); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); font-weight: 500; background: var(--surface); }
.legal td { color: var(--ink-2); }
.legal td:first-child { color: var(--ink); white-space: nowrap; }
.legal tr:last-child td { border-bottom: 0; }
.legal .cookie-box { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--sp-16); margin-top: var(--sp-16); border: 1px solid var(--line); border-radius: var(--r-card); padding: var(--sp-16) var(--sp-24); background: var(--surface); }
.legal .cookie-box p { margin: 0; }
.legal .state { color: var(--ink); font-weight: 500; }
.legal .btn { font-size: var(--fs-200); font-weight: 500; min-height: 44px; padding: 10px 20px; border-radius: var(--r-pill); border: 1px solid var(--ink); background: var(--ink); color: #fff; }
.legal .btn:hover { background: #2a2c33; }
```

- [ ] **Step 5: Rewrite `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import SkipLink from '@/components/layout/SkipLink';
import ConsentBanner from '@/components/ConsentBanner';

const geist = Geist({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-geist', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://proyectos-theta-hazel.vercel.app'),
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.variable}>
      <body>
        <SkipLink />
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
```

`components/layout/SkipLink.tsx`:
```tsx
import s from './SkipLink.module.css';
export default function SkipLink() {
  return <a href="#contenido" className={s.skip}>Saltar al contenido</a>;
}
```
`components/layout/SkipLink.module.css`:
```css
.skip { position: fixed; top: 8px; left: 8px; z-index: 200; padding: 12px 16px; background: var(--ink); color: #fff; border-radius: var(--r-pill); transform: translateY(-200%); transition: transform .2s var(--ease); }
.skip:focus-visible { transform: none; outline-color: var(--focus); }
```

- [ ] **Step 6: Update `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: { viewTransition: true },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/perfil.html', destination: '/sobre-mi', permanent: true },
      { source: '/perfil', destination: '/sobre-mi', permanent: true },
      { source: '/privacidad.html', destination: '/privacidad', permanent: true },
    ];
  },
};
export default nextConfig;
```

Note: `/perfil` still exists as a page until Task 13; a redirect on an existing route wins, so `/perfil` will 308 from now on — acceptable on the working branch.

- [ ] **Step 7: Keep the old pages compiling**

The old components reference `var(--font-montserrat)`/`--font-bebas` classes only via CSS that is now gone; they still compile. Remove the `remixicon` import from any file that still has it: only `app/layout.tsx` had it (already rewritten). Run `npx tsc --noEmit` — expected: 0 errors.

- [ ] **Step 8: Run tests**

Run: `npx vitest run`
Expected: `test/tokens.test.ts` PASS. `components/Nav.test.tsx` and friends still PASS (they don't depend on CSS).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json next.config.ts app/globals.css app/layout.tsx components/layout test/tokens.test.ts
git commit -m "feat(base): tokens del sistema claro, Geist, skip link y view transitions"
```

---

### Task 2: Content — site + projects catalog

**Files:**
- Create: `lib/content/site.ts`, `lib/content/projects.ts`
- Test: `lib/content/projects.test.ts`

**Interfaces (produces):**
```ts
// site.ts
export const SITE = { name: 'Víctor Maza', role: 'Product Designer', email: 'vctrmz47@gmail.com', city: 'Málaga', available: 'Disponible desde septiembre de 2026', linkedin: 'https://linkedin.com/in/victor-maza47', behance: 'https://behance.net/mazdesign', instagram: 'https://instagram.com/mazdesign', figma: string };
export const NAV: { href: string; label: string }[];
// projects.ts
export type ProjectType = 'case' | 'product' | 'design-system' | 'landing';
export type Sector = 'insurtech' | 'erp' | 'banca' | 'ecommerce' | 'transporte' | 'multi' | null;
export interface Project { slug: string; title: string; company: string; years: string; type: ProjectType; status: 'production'; sector: Sector; brand: string; image: { src: string; alt: string } | null; logo: string; summary: string; hasCase: boolean; url?: string }
export type FilterId = 'todo' | 'casos' | 'produccion' | 'design-system' | 'insurtech' | 'erp' | 'banca' | 'ecommerce' | 'transporte' | 'landing';
export const FILTERS: { id: FilterId; label: string }[];
export const PROJECTS: Project[];
export function parseFilter(v: string | null | undefined): FilterId;
export function matches(p: Project, f: FilterId): boolean;
export function filterProjects(f: FilterId): Project[];
export function filterCounts(): Record<FilterId, number>;
export function projectTags(p: Project): string[];
export const SECTOR_LABEL: Record<Exclude<Sector, null>, string>;
```

- [ ] **Step 1: Write the failing tests**

`lib/content/projects.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { PROJECTS, FILTERS, parseFilter, filterProjects, filterCounts, projectTags } from './projects';

describe('catálogo', () => {
  it('tiene 10 piezas con slug único y HERMES primero', () => {
    expect(PROJECTS).toHaveLength(10);
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(10);
    expect(PROJECTS[0].slug).toBe('hermes');
  });
  it('cada pieza tiene logo, resumen y o bien imagen o bien color de marca', () => {
    for (const p of PROJECTS) {
      expect(p.logo, p.slug).toMatch(/^\/assets\/logos\//);
      expect(p.summary.length, p.slug).toBeGreaterThan(30);
      expect(p.brand, p.slug).toMatch(/^#[0-9a-f]{6}$/i);
      if (p.image) expect(p.image.alt.length, p.slug).toBeGreaterThan(10);
    }
  });
  it('los cinco casos tienen hasCase y el resto enlaza o no', () => {
    expect(PROJECTS.filter((p) => p.hasCase).map((p) => p.slug)).toEqual(['hermes', 'suscripcion', 'editor-propuesta', 'vista-360', 'design-system']);
    expect(PROJECTS.find((p) => p.slug === 'ayax')?.url).toBe('https://ayax-summit-olive.vercel.app/');
    expect(PROJECTS.find((p) => p.slug === 'mercantil')?.url).toBeUndefined();
  });
});

describe('filtros', () => {
  it('parseFilter devuelve todo para valores desconocidos o vacíos', () => {
    expect(parseFilter(null)).toBe('todo');
    expect(parseFilter('')).toBe('todo');
    expect(parseFilter('nada')).toBe('todo');
    expect(parseFilter('insurtech')).toBe('insurtech');
  });
  it('cuenta lo que enseña', () => {
    const c = filterCounts();
    expect(c.todo).toBe(10);
    expect(c.casos).toBe(5);
    expect(c.produccion).toBe(10);
    expect(c.insurtech).toBe(4);
    expect(c['design-system']).toBe(1);
    expect(c.erp + c.banca + c.ecommerce + c.transporte + c.landing).toBe(5);
    for (const f of FILTERS) expect(filterProjects(f.id)).toHaveLength(c[f.id]);
  });
  it('mantiene el orden del catálogo al filtrar', () => {
    expect(filterProjects('insurtech').map((p) => p.slug)).toEqual(['hermes', 'suscripcion', 'editor-propuesta', 'vista-360']);
  });
  it('las etiquetas de la card salen del tipo, el estado y el sector', () => {
    expect(projectTags(PROJECTS[0])).toEqual(['Caso de estudio', 'En producción', 'Insurtech']);
    expect(projectTags(PROJECTS.find((p) => p.slug === 'ayax')!)).toEqual(['Landing', 'En producción']);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run lib/content/projects.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 3: Write `lib/content/site.ts`**

```ts
export const SITE = {
  name: 'Víctor Maza',
  role: 'Product Designer',
  email: 'vctrmz47@gmail.com',
  city: 'Málaga',
  available: 'Disponible desde septiembre de 2026',
  linkedin: 'https://linkedin.com/in/victor-maza47',
  behance: 'https://behance.net/mazdesign',
  instagram: 'https://instagram.com/mazdesign',
  figma: 'https://www.figma.com/design/lEPRv8iPrIDwUBKnbWKMdu/Portfolio?node-id=8-136130&t=srL7KcBmRZtEGLME-1',
  url: 'https://proyectos-theta-hazel.vercel.app',
} as const;

export const NAV = [
  { href: '/#trabajo', label: 'Trabajo' },
  { href: '/sobre-mi', label: 'Sobre mí' },
] as const;
```

- [ ] **Step 4: Write `lib/content/projects.ts`**

```ts
export type ProjectType = 'case' | 'product' | 'design-system' | 'landing';
export type Sector = 'insurtech' | 'erp' | 'banca' | 'ecommerce' | 'transporte' | 'multi' | null;
export interface Project {
  slug: string; title: string; company: string; years: string;
  type: ProjectType; status: 'production'; sector: Sector;
  brand: string; image: { src: string; alt: string } | null; logo: string;
  summary: string; hasCase: boolean; url?: string;
}

const shot = (name: string, alt: string) => ({ src: `/assets/shots/${name}.webp`, alt });

export const PROJECTS: Project[] = [
  { slug: 'hermes', title: 'HERMES, plataforma aseguradora', company: 'Atrinium', years: '2022–2026', type: 'case', status: 'production', sector: 'insurtech', brand: '#1f2a5a', logo: '/assets/logos/hermes.webp', hasCase: true,
    image: shot('08-planes-servicios', 'Configuración de planes y servicios por compañía en HERMES'),
    summary: 'SaaS asegurador vendido a compañías con lógicas de negocio incompatibles: 165 pantallas y 8 áreas sobre un único núcleo, sin bifurcar el producto por cliente.' },
  { slug: 'suscripcion', title: 'Módulo de suscripción de cliente', company: 'HERMES Admin', years: '2025', type: 'case', status: 'production', sector: 'insurtech', brand: '#24346e', logo: '/assets/logos/hermes.webp', hasCase: true,
    image: shot('01-datos-del-contacto', 'Fase de cualificación: contacto principal y perfil del cliente'),
    summary: 'Tres meses de proceso manual en Excel convertidos en un módulo en producción en cinco semanas, modelado como máquina de estados de tres fases.' },
  { slug: 'editor-propuesta', title: 'Editor de propuesta con TipTap', company: 'HERMES Admin', years: '2025', type: 'case', status: 'production', sector: 'insurtech', brand: '#2b3f85', logo: '/assets/logos/hermes.webp', hasCase: true,
    image: shot('12-editor-variables', 'Editor de propuesta con variables insertadas con @'),
    summary: 'La propuesta al cliente se preparaba fuera del producto. Plantilla con huecos, variables con @ y cláusulas opcionales como bloques, auditable mientras se escribe.' },
  { slug: 'vista-360', title: 'Vista 360 del cliente', company: 'Atrinium', years: '2026', type: 'case', status: 'production', sector: 'insurtech', brand: '#1b2a4a', logo: '/assets/logos/hermes.webp', hasCase: true,
    image: shot('11-resumen-comercial', 'Resumen comercial del cliente en una sola vista'),
    summary: 'Doce composiciones exploradas y cuatro finalistas para que cualquiera del equipo entienda a un cliente en diez segundos, con el criterio de descarte por escrito.' },
  { slug: 'design-system', title: 'Design system: 267 → 24 tokens', company: 'Atrinium', years: '2024', type: 'design-system', status: 'production', sector: 'multi', brand: '#15181f', logo: '/assets/logos/hermes.webp', hasCase: true,
    image: shot('07-seleccionar-moneda', 'Componente de selección de moneda del design system de HERMES'),
    summary: 'Auditoría del monorepo: 267 valores de color reducidos a 24 tokens con un rol cada uno, adoptados por los cuatro front. El sistema alimenta el módulo y el módulo devuelve componentes.' },
  { slug: 'flesip', title: 'Facturación electrónica', company: 'Flesip', years: '2024–2025', type: 'product', status: 'production', sector: 'erp', brand: '#0f3d3e', logo: '/assets/logos/flesip.webp', hasCase: false, image: null, url: 'https://flesip.com/',
    summary: 'Facturación electrónica para pymes con dos audiencias opuestas: el asesor que factura a diario y el cliente que entra una vez al mes. Que el camino que cumple la norma sea el más corto.' },
  { slug: 'montsaint', title: 'Catálogo y checkout', company: 'Montsaint', years: '2023–2025', type: 'product', status: 'production', sector: 'ecommerce', brand: '#2a2a2a', logo: '/assets/logos/montsaint.webp', hasCase: false, image: null, url: 'https://montsaint.es/',
    summary: 'E-commerce de marca: ficha de producto, tallas y pago sin fricción innecesaria, con brandsheet y UI kit en lugar de un sistema completo.' },
  { slug: 'mercantil', title: 'Banca digital y app Mony', company: 'Mercantil Panamá', years: '2020–2022', type: 'product', status: 'production', sector: 'banca', brand: '#0b3a6b', logo: '/assets/logos/mercantil.webp', hasCase: false, image: null,
    summary: 'Pasivos, activos y tarjeta Next Gem, más la app Mony: onboarding y autenticación reforzada en entorno regulado. Tests no moderados con Maze antes de cada pantalla.' },
  { slug: 'taksio', title: 'Plataforma de movilidad', company: 'Taksio', years: '2017–2019', type: 'product', status: 'production', sector: 'transporte', brand: '#1d3557', logo: '/assets/logos/hermes.webp', hasCase: false, image: null,
    summary: 'Plataforma multimodal desde cero: design system primero, flujos de conductor y pasajero después.' },
  { slug: 'ayax', title: 'Landing', company: 'Ayax', years: '2026', type: 'landing', status: 'production', sector: null, brand: '#0d0d0d', logo: '/assets/logos/ayax.webp', hasCase: false, image: null, url: 'https://ayax-summit-olive.vercel.app/',
    summary: 'Diseño y dirección de la implementación con IA, desplegada y en línea.' },
];

export type FilterId = 'todo' | 'casos' | 'produccion' | 'design-system' | 'insurtech' | 'erp' | 'banca' | 'ecommerce' | 'transporte' | 'landing';
export const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'todo', label: 'Todo' }, { id: 'casos', label: 'Casos de estudio' }, { id: 'produccion', label: 'En producción' },
  { id: 'design-system', label: 'Design system' }, { id: 'insurtech', label: 'Insurtech' }, { id: 'erp', label: 'ERP' },
  { id: 'banca', label: 'Banca' }, { id: 'ecommerce', label: 'E-commerce' }, { id: 'transporte', label: 'Transporte' }, { id: 'landing', label: 'Landing' },
];
export const SECTOR_LABEL: Record<Exclude<Sector, null>, string> = { insurtech: 'Insurtech', erp: 'ERP', banca: 'Banca', ecommerce: 'E-commerce', transporte: 'Transporte', multi: 'Multi-producto' };
const TYPE_LABEL: Record<ProjectType, string> = { case: 'Caso de estudio', product: 'Producto', 'design-system': 'Design system', landing: 'Landing' };

export function parseFilter(v: string | null | undefined): FilterId {
  return FILTERS.some((f) => f.id === v) ? (v as FilterId) : 'todo';
}
export function matches(p: Project, f: FilterId): boolean {
  switch (f) {
    case 'todo': return true;
    case 'casos': return p.type === 'case';
    case 'produccion': return p.status === 'production';
    case 'design-system': return p.type === 'design-system';
    case 'landing': return p.type === 'landing';
    default: return p.sector === f;
  }
}
export function filterProjects(f: FilterId): Project[] { return PROJECTS.filter((p) => matches(p, f)); }
export function filterCounts(): Record<FilterId, number> {
  return Object.fromEntries(FILTERS.map((f) => [f.id, filterProjects(f.id).length])) as Record<FilterId, number>;
}
export function projectTags(p: Project): string[] {
  const t = [TYPE_LABEL[p.type], 'En producción'];
  if (p.sector && p.sector !== 'multi') t.push(SECTOR_LABEL[p.sector]);
  return t;
}
export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
```

Note: `taksio` has no logo file; it reuses `hermes.webp` only to satisfy the type — Task 9's `BrandTile` renders the company **name** when `logo` equals the HERMES logo for a non-HERMES company. Replace with a real logo when Víctor provides one.

- [ ] **Step 5: Run tests** — `npx vitest run lib/content/projects.test.ts` → PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/content
git commit -m "feat(content): catálogo de proyectos con filtros y datos del sitio"
```

---

### Task 3: Content — case studies

**Files:**
- Create: `lib/content/cases/types.ts`, `lib/content/cases/hermes.ts`, `suscripcion.ts`, `editor-propuesta.ts`, `vista-360.ts`, `design-system.ts`, `lib/content/cases/index.ts`
- Test: `lib/content/cases/cases.test.ts`

**Interfaces (produces):**
```ts
export type DiagramId = 'clients-to-system' | 'areas-map' | 'before-after' | 'state-machine' | 'template-slots' | 'grid-12-4-1' | 'system-cycle' | 'timeline';
export interface Metric { value: string; label: string; meaning: string }
export interface Shot { src: string; alt: string; caption: string }
export interface Decision { title: string; why: string; changed: string; figure?: { shot: Shot } | { diagram: DiagramId } }
export interface CodeDemo { title: string; lang: 'json' | 'ts'; code: string }
export interface CaseStudy {
  slug: string; title: string; company: string; years: string; tagline: string; tags: string[]; brand: string;
  hero: Shot; context: string; role: string; delivery: string;
  problem: [string, string]; complexity: { diagram: DiagramId; caption: string };
  decisions: Decision[]; system: { body: string[]; code?: CodeDemo };
  design: Shot[]; implementation: string[];
  result: { output: Metric[]; outcome: Metric[] | 'unavailable'; measure: string };
  learnings: [string, string]; next: string;
}
export const shot: (name: string, alt: string, caption: string) => Shot; // `/assets/shots/${name}.webp`
export const CASES: CaseStudy[]; export function getCase(slug: string): CaseStudy | undefined; export const CASE_SLUGS: string[];
```

- [ ] **Step 1: Write the failing test**

`lib/content/cases/cases.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { CASES, getCase, CASE_SLUGS } from './index';
import { PROJECTS } from '../projects';

describe('casos', () => {
  it('hay un caso por cada proyecto con hasCase, en el mismo orden', () => {
    expect(CASE_SLUGS).toEqual(PROJECTS.filter((p) => p.hasCase).map((p) => p.slug));
  });
  it('cada caso tiene todas las secciones y un siguiente válido', () => {
    for (const c of CASES) {
      expect(c.problem, c.slug).toHaveLength(2);
      expect(c.decisions.length, c.slug).toBeGreaterThanOrEqual(3);
      expect(c.decisions.length, c.slug).toBeLessThanOrEqual(5);
      expect(c.design.length, c.slug).toBeGreaterThanOrEqual(1);
      expect(c.implementation.length, c.slug).toBeGreaterThanOrEqual(1);
      expect(c.result.output.length, c.slug).toBeGreaterThanOrEqual(1);
      expect(c.result.measure.length, c.slug).toBeGreaterThan(20);
      expect(c.learnings, c.slug).toHaveLength(2);
      expect(CASE_SLUGS, c.slug).toContain(c.next);
      expect(c.next, c.slug).not.toBe(c.slug);
      for (const m of c.result.output) expect(m.meaning.length, m.label).toBeGreaterThan(20);
    }
  });
  it('los outcomes sin dato se declaran, no se inventan', () => {
    for (const c of CASES) expect(c.result.outcome, c.slug).toBe('unavailable');
  });
  it('no publica cifras del CV pendientes de confirmar', () => {
    const all = JSON.stringify(CASES);
    for (const bad of ['347', '5 a 2 días', '−60', '-60%', 'tickets diarios', '70 %']) expect(all).not.toContain(bad);
  });
  it('getCase devuelve undefined para slugs desconocidos', () => {
    expect(getCase('nada')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run lib/content/cases` → FAIL (module not found).

- [ ] **Step 3: Write `lib/content/cases/types.ts`** — the interfaces above verbatim plus:

```ts
export const shot = (name: string, alt: string, caption: string): Shot => ({ src: `/assets/shots/${name}.webp`, alt, caption });
```

- [ ] **Step 4: Write `lib/content/cases/hermes.ts`**

Content rules: every string comes from `lib/data.ts` (`USE_CASES[0]`, `BIO`, `WORKS[0].team`) re-layered; nothing new except section labels.

```ts
import { shot, type CaseStudy } from './types';

export const hermes: CaseStudy = {
  slug: 'hermes', title: 'HERMES, plataforma aseguradora', company: 'Atrinium', years: '2022–2026',
  tagline: 'Un producto estándar para negocios que no se parecen: 165 pantallas y 8 áreas sobre un único núcleo, sin bifurcar el producto por cliente.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Multi-tenant'], brand: '#1f2a5a',
  hero: shot('08-planes-servicios', 'Configuración de planes y servicios por compañía en HERMES', 'Planes y servicios: la misma pantalla sirve a compañías con catálogos distintos'),
  context: 'SaaS asegurador de Atrinium para corredurías, agencias de suscripción y aseguradoras: suscripción, pólizas, recibos, facturación y siniestros. Producto en producción sin ventana de parada, con migración de framework y base de datos en marcha y dos generaciones de interfaz conviviendo.',
  role: 'Único diseñador del holding, en un equipo de siete personas. Discovery semanal con los Product Owners de las aseguradoras y defensa de cada propuesta antes de pasarla a desarrollo.',
  delivery: 'Aplicación web multi-tenant, design system completo y superficies de configuración por compañía.',
  problem: [
    'Cada compañía llegaba con su lógica de negocio, su moneda, su idioma y su regulador, y esperaba que el producto se comportara como el suyo.',
    'Si el producto se dobla ante cada cliente deja de ser producto; si no se dobla nada, no lo usa nadie.',
  ],
  complexity: { diagram: 'clients-to-system', caption: 'Tres compañías con reglas incompatibles sobre un sistema configurable: la diferencia vive en el dato, no en una rama del producto.' },
  decisions: [
    { title: 'Diseñé reglas en lugar de casos.', why: 'Cada ramo de seguro tiene su cuestionario; diseñar una pantalla por ramo y por cliente no escala y deja el criterio en la cabeza del diseñador.', changed: 'El cuestionario de cada ramo se declara como dato y la interfaz lo renderiza con su validación. Dar de alta una compañía nueva deja de exigir diseño a medida.', figure: { diagram: 'before-after' } },
    { title: 'El nivel de sistema que cada producto se puede permitir.', why: 'La respuesta obvia era imponer un sistema único a los cinco productos del holding. Los productos ligeros no necesitan esa gobernanza.', changed: 'Design system completo para el ERP y el administrador; brandsheet y UI kit para los productos ligeros. Cinco negocios que no se sienten como cinco empresas distintas.', figure: { shot: shot('07-seleccionar-moneda', 'Componente de selección de moneda', 'Componentes con contrato: el mismo selector en los cuatro front') } },
    { title: 'Marca e idioma como variables, no como versiones.', why: 'White-labeling por tenant con cinco idiomas base y siete locales de terminología aseguradora.', changed: 'Paleta por cliente al iniciar sesión y terminología por locale, propagadas por tokens semánticos y catálogos de idioma, sin duplicar componentes.', figure: { shot: shot('04-preparar-producto', 'Preparación de producto: módulos, plugins e idiomas por cliente', 'Módulos, plugins e idiomas del sistema configurados por cliente') } },
    { title: 'Migración módulo a módulo, consistencia completa antes que mejoras repartidas.', why: 'Con dos generaciones de interfaz conviviendo, mejorar un poco todo mantiene la inconsistencia para siempre.', changed: 'Cada módulo migrado sale entero con el sistema nuevo; el criterio queda escrito y no depende de que yo esté en la reunión.', figure: { diagram: 'areas-map' } },
  ],
  system: {
    body: [
      'Auditoría del monorepo con IA para extraer todos los valores de color en uso: 267 dispersos reducidos a 24 tokens con un rol cada uno, adoptados por los cuatro front. Los tokens se exportaron para evolucionar el design system anterior, no para tirarlo.',
      'Componentes con contrato y accesibilidad forzada por el linter: cuándo se usa cada patrón y por qué queda documentado antes de llegar a desarrollo.',
    ],
    code: { title: 'Un cuestionario de ramo declarado como dato (ejemplo ilustrativo)', lang: 'json', code: `{
  "ramo": "hogar",
  "paso": "riesgo",
  "campos": [
    { "id": "superficie", "tipo": "numero", "unidad": "m²", "requerido": true },
    { "id": "anio_construccion", "tipo": "anio", "min": 1900 },
    { "id": "alarma", "tipo": "booleano", "muestra": ["descuento_alarma"] }
  ],
  "reglas": [
    { "si": { "superficie": { ">": 300 } }, "entonces": { "requiere": ["tasacion"] } }
  ]
}` },
  },
  design: [
    shot('08-planes-servicios', 'Planes y servicios por compañía', 'Planes y servicios: catálogo de producto compuesto por negocio, sin desarrollo a medida'),
    shot('14-document-model', 'Modelo del documento', 'Modelo del documento: la restricción vive en el dato, no solo en la interfaz'),
    shot('10-logs-firmantes', 'Registro de firmantes', 'Trazabilidad por documento: firmantes, motor de firma y estado'),
    shot('16-datos-contacto', 'Datos de contacto', 'Formulario generado por esquema con validación por regla'),
  ],
  implementation: [
    'Los tokens y componentes se entregaron con criterios de uso; el equipo de desarrollo dejó de preguntar cómo se comporta un patrón porque está definido antes de llegar a ellos.',
    'Cada módulo nuevo se arma con componentes que ya existen; cuando necesita algo nuevo, lo devuelve al catálogo.',
  ],
  result: {
    output: [
      { value: '165', label: 'pantallas en producción', meaning: 'Una por flujo real, no por variante de cliente: la variación la absorbe la configuración.' },
      { value: '8', label: 'áreas de producto', meaning: 'Suscripción, pólizas, recibos, facturación, siniestros, administración, usuarios y reporting con el mismo lenguaje de diseño.' },
      { value: '60 → 14', label: 'campos visibles por paso al emitir una póliza', meaning: 'Los campos se muestran cuando una regla los pide, en lugar de aparecer todos siempre.' },
      { value: '267 → 24', label: 'tokens de color', meaning: 'Adoptados por los cuatro desarrolladores front: la base que hace que reutilizar componentes ahorre de verdad.' },
    ],
    outcome: 'unavailable',
    measure: 'Instrumenté el design system pero no el producto: sabía cuántos componentes cumplían el sistema, no cuántos minutos ahorraba emitir una póliza. Hoy pediría analítica de uso desde el primer módulo migrado: tiempo de emisión, errores por paso y tickets por módulo.',
  },
  learnings: [
    'Las discusiones pasaron de gustos a criterios porque las reglas están escritas y se pueden consultar.',
    'El sistema se mantiene solo cuando cada módulo nuevo se construye con lo que existe y devuelve lo que le falta.',
  ],
  next: 'suscripcion',
};
```

- [ ] **Step 5: Write `lib/content/cases/suscripcion.ts`**

```ts
import { shot, type CaseStudy } from './types';

export const suscripcion: CaseStudy = {
  slug: 'suscripcion', title: 'Módulo de suscripción de cliente', company: 'HERMES Admin', years: '2025',
  tagline: 'Tres meses de proceso manual en Excel, convertidos en un módulo en producción en cinco semanas.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'SaaS multi-tenant'], brand: '#24346e',
  hero: shot('01-datos-del-contacto', 'Fase 1, cualificación: contacto principal y perfil del cliente', 'Fase 1 · Cualificación: contacto principal, perfil del cliente y resumen vivo de la empresa'),
  context: 'Cualificación, negociación, presupuesto, contrato y facturación se operaban a mano entre hojas de cálculo y correos: hasta tres meses de ciclo y seis roles distintos. El encargo cabía en una frase: automatizar esto, dame ideas.',
  role: 'Único diseñador, con triple aprobación de CTO, CEO y responsable de la empresa, y la restricción de entregar sobre el catálogo de componentes que ya existía.',
  delivery: 'Módulo web en tres fases sobre el catálogo Hermes Tenant, con agenda, comité, preparación de producto, método de pago y contratos.',
  problem: [
    'No había módulo: había un proceso manual que nadie había mirado de frente, sin especificación, sin alcance y sin una sola métrica.',
    'Un proceso repartido en correos no deja rastro que medir; el encargo incluía acotar el alcance, no solo diseñarlo.',
  ],
  complexity: { diagram: 'state-machine', caption: 'Tres fases con audiencias, permisos y criterios de salida propios, en lugar de un asistente de veinte pasos.' },
  decisions: [
    { title: 'No abrir Figma hasta entender el proceso manual.', why: 'El Excel que ya usaban era la mejor especificación disponible: un proceso manual que funciona te dice qué información necesita el negocio y en qué orden.', changed: 'Tres entrevistas con el closer que lo hacía a mano y los criterios de salida de cada stakeholder antes de dibujar una pantalla.', figure: { shot: shot('02-notas-y-comite', 'Comité: acuerdo votado con quórum y deadline', 'Comité: el acuerdo se vota con quórum, deadline y conversación trazada') } },
    { title: 'Research por observación indirecta.', why: 'Sin acceso a usuarios de módulos comparables, la alternativa era diseñar de memoria.', changed: 'Benchmark en Mobbin y grabaciones de operadores reales como proxy. Los patrones no se copiaron: se filtraron contra nuestro modelo de negocio y varios se recategorizaron en otros módulos.', figure: { shot: shot('06-agenda-participantes', 'Agenda con participantes sugeridos por tipo de reunión', 'Agenda: el tipo de reunión sugiere quién debe asistir de cada lado') } },
    { title: 'Máquina de estados, no wizard.', why: 'Veinte pasos lineales obligan a todos los roles a recorrer el mismo camino.', changed: 'Tres fases (cualificación, negociación, cerrado) con audiencias, permisos y criterios de salida propios. El 100 % de la interfaz se apoya en el sistema de componentes consolidado antes de empezar.', figure: { shot: shot('03-metodo-de-pago', 'Método de pago con checklist de bloqueos', 'Método de pago: SEPA, datos fiscales y calendario, con checklist de lo que bloquea la firma') } },
    { title: 'Mover al producto lo que vivía en la experiencia del closer.', why: 'En las entrevistas apareció algo que ningún requisito recogía: el closer justificaba cada dato al cliente en directo.', changed: 'Dos bloques persistentes junto a cada formulario. Un closer nuevo opera el flujo sin haber hecho las llamadas.', figure: { shot: shot('05-contratos', 'Contratos firmados con estado por documento', 'Contratos firmados, con firmantes, motor de firma y estado por documento') } },
  ],
  system: {
    body: [
      'Partí de los componentes de Hermes Tenant en lugar de inventar patrones: el equipo ensambla en vez de construir y quien ya opera el producto no tiene curva de aprendizaje.',
      'El panel de contexto, el editor con comentarios y el agendador se diseñaron para reincorporarse al catálogo: el sistema alimenta el módulo y el módulo devuelve componentes al sistema.',
    ],
    code: { title: 'Una fase como objeto, no como pantalla (ejemplo ilustrativo)', lang: 'ts', code: `const fases = [
  { id: 'cualificacion', audiencia: ['closer', 'cliente'], salida: ['contacto', 'perfil', 'comite:aprobado'] },
  { id: 'negociacion',   audiencia: ['closer', 'legal', 'cliente'], salida: ['propuesta:firmada'] },
  { id: 'cerrado',       audiencia: ['finanzas', 'onboarding'], salida: ['pago:validado', 'producto:preparado'] },
] as const;

// la UI no decide el siguiente paso: lo decide la salida cumplida
const siguiente = (f: typeof fases[number], hechos: string[]) =>
  f.salida.every((s) => hechos.includes(s)) ? fases[fases.indexOf(f) + 1] : f;` },
  },
  design: [
    shot('01-datos-del-contacto', 'Datos del contacto', 'Fase 1 · Cualificación: contacto principal, perfil del cliente y resumen vivo de la empresa'),
    shot('04-preparar-producto', 'Preparar producto', 'Preparar producto: módulos, plugins e idiomas del sistema por cliente'),
    shot('19-reservar-agenda', 'Reservar agenda', 'Reservar agenda: disponibilidad de ambos lados en la misma vista'),
    shot('20-drawer-contrato', 'Detalle de contrato en panel lateral', 'Contrato en panel lateral: el contexto no se pierde al revisar'),
  ],
  implementation: [
    'La agenda con transcripción y resumen automáticos no estaba en el encargo. La llevé primero a front y back para validar viabilidad, herramientas y coste, y solo después al PO y al CEO: una propuesta con la viabilidad validada deja de ser una petición y pasa a ser una opción.',
    'La triple aprobación obligaba a defender la misma decisión en tres lenguajes: viabilidad técnica, impacto de negocio y operación diaria.',
  ],
  result: {
    output: [
      { value: '5', label: 'semanas del arranque al primer cliente en producción', meaning: 'Frente a un ciclo manual de hasta tres meses. Sale en cinco semanas porque la interfaz se apoya en un sistema consolidado antes de empezar.' },
      { value: '3 · 6', label: 'fases y roles', meaning: 'Cada fase con su audiencia, sus permisos y su criterio de salida: el alcance deja de negociarse dos veces.' },
      { value: '1', label: 'artefacto para ventas y producto', meaning: 'El mismo módulo sirve a ventas para cerrar y a producto para estimar.' },
    ],
    outcome: 'unavailable',
    measure: 'Tiempo de ciclo por cliente antes y después, errores por fase y cuántos closers nuevos operan el flujo sin acompañamiento. Nada de eso se instrumentó al salir.',
  },
  learnings: [
    'Definir el problema antes de resolverlo fue el encargo real; la pantalla vino después.',
    'La parte del trabajo que más me formó como lead fue defender la misma decisión ante tres audiencias.',
  ],
  next: 'editor-propuesta',
};
```

- [ ] **Step 6: Write `lib/content/cases/editor-propuesta.ts`**

```ts
import { shot, type CaseStudy } from './types';

export const editorPropuesta: CaseStudy = {
  slug: 'editor-propuesta', title: 'Editor de propuesta con TipTap', company: 'HERMES Admin', years: '2025',
  tagline: 'La fase en que se arma la propuesta con el cliente: documento, variables y comentarios en un sitio, auditable mientras se escribe.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Editor'], brand: '#2b3f85',
  hero: shot('12-editor-variables', 'Editor de propuesta con variables', 'Editor: variables con @ y componentes con /'),
  context: 'Segunda fase del módulo de suscripción: se arma la propuesta, se ajustan condiciones y se recogen los comentarios de las dos partes. Todo eso vivía en documentos sueltos.',
  role: 'Diseño del editor y del modelo del documento, en pareja estable con Legal y con backend.',
  delivery: 'Editor headless sobre TipTap con plantilla, variables, bloques opcionales e historial de comentarios.',
  problem: [
    'Cada versión de la propuesta se alejaba un poco más de la plantilla aprobada, y al firmar nadie sabía qué se había cambiado.',
    'Hacía falta rastro auditable de lo que se rellena, lo que es opcional y lo que está bloqueado.',
  ],
  complexity: { diagram: 'template-slots', caption: 'Plantilla con huecos: variables con @, componentes con /, cláusulas opcionales como bloques que se activan.' },
  decisions: [
    { title: 'Frenar el editor libre y reconducirlo a plantilla con huecos.', why: 'Menos libertad, mucho menos riesgo: el texto libre es donde se pierde la trazabilidad.', changed: 'Las cláusulas opcionales son bloques que se activan; lo bloqueado no se puede tocar.', figure: { shot: shot('14-document-model', 'Modelo del documento', 'Modelo del documento: la restricción vive en el dato') } },
    { title: 'TipTap, decidido con el front lead.', why: 'Se ajustaba a los requerimientos del cliente y a nuestro modelo de bloques sin coste de licencia, frente a levantar un editor desde cero.', changed: 'La elección salió de una conversación, no de una imposición: pesaba lo que el cliente pedía, lo que el sistema aguantaba y lo que costaba mantener.', figure: { shot: shot('13-historial-comentarios', 'Historial de comentarios', 'Historial de comentarios de las dos partes sobre el mismo documento') } },
    { title: 'Las validaciones, diseñadas con quien responde de la auditoría.', why: 'Diseñarlas después de Legal es diseñarlas dos veces.', changed: 'Trabajé el modelo del documento con Legal y backend a la vez, para que la restricción viviera en el dato y no solo en la interfaz.', figure: { shot: shot('04-detalle-documento', 'Detalle del documento', 'Detalle del documento: qué falta, qué es opcional y qué no se puede tocar') } },
  ],
  system: {
    body: [
      'Variables con @ y componentes con /: un patrón de comandos que se explica en una guía de uso y una demo en vivo antes del despliegue, porque asumir que se entiende es donde se pierden los editores.',
      'Usé IA generativa para redactar variantes de microcopy legal y descartarlas rápido con Legal delante.',
    ],
  },
  design: [
    shot('12-editor-variables', 'Editor con variables', 'Editor con variables'),
    shot('14-document-model', 'Modelo del documento', 'Modelo del documento'),
    shot('13-historial-comentarios', 'Historial de comentarios', 'Historial de comentarios'),
    shot('21-notas-alternativa', 'Alternativa descartada de notas', 'Alternativa descartada: notas sueltas sin modelo'),
  ],
  implementation: [
    'El editor se desbloqueó cuando el equipo trajo TipTap: el filtro técnico cambió el diseño.',
    'Guía de uso y presentación al cliente antes del despliegue; el cliente se adaptó sin fricción.',
  ],
  result: {
    output: [
      { value: '@ · /', label: 'dos comandos para todo el documento', meaning: 'Variables con @ y componentes con /: el usuario aprende dos gestos, no un editor.' },
      { value: '2', label: 'equipos co-diseñando', meaning: 'Legal y backend en la misma mesa desde el modelo del documento, no después.' },
    ],
    outcome: 'unavailable',
    measure: 'Versiones por propuesta, cambios fuera de plantilla detectados y tiempo hasta firma antes y después.',
  },
  learnings: [
    'Un patrón nuevo no se entiende solo: la adopción se diseña igual que la interfaz.',
    'Las decisiones técnicas acordadas con el front lead duran más que las impuestas.',
  ],
  next: 'vista-360',
};
```

- [ ] **Step 7: Write `lib/content/cases/vista-360.ts`**

```ts
import { shot, type CaseStudy } from './types';

export const vista360: CaseStudy = {
  slug: 'vista-360', title: 'Vista 360 del cliente', company: 'Atrinium', years: '2026',
  tagline: 'Doce alternativas para una decisión: que cualquiera del equipo entienda a un cliente en diez segundos.',
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Panel interno'], brand: '#1b2a4a',
  hero: shot('11-resumen-comercial', 'Resumen comercial del cliente', 'Resumen comercial: identidad persistente, riesgo y actividad antes del histórico'),
  context: 'Panel interno de Atrinium. No había vista única del cliente: para entender una cuenta había que reconstruirla saltando entre módulos antes de cada conversación.',
  role: 'Diseño y exploración, con usuarios a dos mesas de distancia y una sola pantalla como alcance.',
  delivery: 'Una pantalla en producción y un criterio reutilizable por escrito.',
  problem: [
    'El equipo perdía minutos reconstruyendo quién era un cliente antes de hablar con él.',
    'Había que elegir una composición con criterio de negocio, no de gusto, y dejar escrito por qué se descartaron las demás.',
  ],
  complexity: { diagram: 'grid-12-4-1', caption: 'Doce composiciones exploradas, cuatro direcciones finalistas, una pantalla en producción.' },
  decisions: [
    { title: 'Mirar fuera antes de dibujar.', why: 'Los paneles 360 están resueltos en CRM, banca y soporte; copiar capturas sueltas no enseña el flujo.', changed: 'Benchmark recorriendo flujos reales pantalla a pantalla con Mobbin: cabecera de identidad persistente, bloques de riesgo y actividad, resumen financiero antes del histórico. Se descartó lo que solo funciona con datos que no teníamos.' },
    { title: 'Doce exploraciones antes de decidir.', why: 'El método de las tres alternativas se queda corto cuando el coste de equivocarse es una pantalla que se usa cien veces al día.', changed: 'Doce composiciones reducidas a cuatro direcciones comparables.', figure: { diagram: 'grid-12-4-1' } },
    { title: 'Jerarquía por decisión.', why: 'Lo primero que se mira es lo que cambia una acción, no lo que hay más de.', changed: 'Riesgo y actividad arriba; histórico abajo.', figure: { shot: shot('11-resumen-comercial', 'Resumen comercial', 'Resumen comercial') } },
  ],
  system: { body: ['La pantalla se compone con los componentes del catálogo; el descarte documentado es lo que evita volver a discutir la misma decisión seis meses después.'] },
  design: [
    shot('11-resumen-comercial', 'Resumen comercial', 'Resumen comercial'),
    shot('17-agenda-reuniones', 'Agenda de reuniones', 'Agenda de reuniones del cliente'),
    shot('15-notas-comite', 'Notas de comité', 'Notas de comité vinculadas al cliente'),
  ],
  implementation: ['Una pantalla en producción y un documento de criterio: por qué se descartaron las otras once.'],
  result: {
    output: [
      { value: '12', label: 'alternativas exploradas', meaning: 'Composiciones completas, no variantes de color: cada una respondía a un criterio distinto.' },
      { value: '4', label: 'direcciones finalistas', meaning: 'Comparables entre sí y validadas con el equipo y con criterio de negocio.' },
    ],
    outcome: 'unavailable',
    measure: 'Validé con el equipo y no con usuarios. Teniéndolos a dos mesas, cinco sesiones de quince minutos habrían salido más baratas que cualquier debate interno: tiempo hasta entender una cuenta, antes y después.',
  },
  learnings: [
    'El criterio escrito vale más que la pantalla: es lo que sobrevive al siguiente debate.',
    'Con usuarios a dos mesas, no validar con ellos fue la decisión más cara del proyecto.',
  ],
  next: 'design-system',
};
```

- [ ] **Step 8: Write `lib/content/cases/design-system.ts`**

```ts
import { shot, type CaseStudy } from './types';

export const designSystem: CaseStudy = {
  slug: 'design-system', title: 'Design system: 267 → 24 tokens', company: 'Atrinium', years: '2024',
  tagline: 'El nivel de sistema que cada producto se puede permitir: tokens con rol, componentes con contrato y reglas de decisión, adoptados por los cuatro front.',
  tags: ['Design system', 'En producción', 'Multi-producto'], brand: '#15181f',
  hero: shot('07-seleccionar-moneda', 'Selector de moneda del design system', 'Un componente, cuatro front, cinco productos'),
  context: 'Al entrar, cada módulo de HERMES se había construido con criterios distintos, y el holding tenía cinco productos con cinco lenguajes.',
  role: 'Propuse el sistema, lo construí desde cero y lo defendí ante los cuatro desarrolladores front.',
  delivery: 'Tokens semánticos, componentes con contrato, jerarquía tipográfica y reglas de uso documentadas; brandsheet y UI kit para los productos ligeros.',
  problem: [
    'Sin una base compartida, reutilizar componentes entre productos no ahorra nada.',
    'La respuesta obvia era imponer un sistema único; los productos ligeros no necesitan esa gobernanza.',
  ],
  complexity: { diagram: 'system-cycle', caption: 'El sistema alimenta el módulo y el módulo devuelve componentes al sistema.' },
  decisions: [
    { title: 'Auditar el monorepo antes de dibujar un token.', why: 'Un sistema que no parte de lo que hay en código nace ya desalineado.', changed: '267 valores de color en uso, extraídos con IA, reducidos a 24 tokens con un rol asignado cada uno.' },
    { title: 'Evolucionar, no tirar.', why: 'Rehacer el sistema anterior habría roto cuatro front a la vez.', changed: 'Los tokens se exportaron para evolucionar el design system existente; los cuatro front los adoptaron.', figure: { shot: shot('07-seleccionar-moneda', 'Selector de moneda', 'Selector de moneda: el mismo componente en los cuatro front') } },
    { title: 'Reglas de decisión, no solo librería.', why: 'Una librería dice qué existe; un sistema dice cuándo usar cada patrón y por qué.', changed: 'Documentación de cuándo aplicar cada patrón y cuándo no, con accesibilidad forzada por el linter.', figure: { diagram: 'system-cycle' } },
  ],
  system: {
    body: ['Tokens semánticos con marca e idioma como variables: la paleta de cada cliente se resuelve al iniciar sesión sin duplicar componentes.'],
    code: { title: 'Un token semántico resuelto por tenant (ejemplo ilustrativo)', lang: 'ts', code: `// el componente solo conoce el rol
const Boton = () => <button className="btn" />;   // .btn { background: var(--color-action) }

// el tenant decide el valor al iniciar sesión
const temas = {
  compania_a: { '--color-action': '#1f2a5a' },
  compania_b: { '--color-action': '#0f3d3e' },
};
for (const [k, v] of Object.entries(temas[tenant])) document.documentElement.style.setProperty(k, v);` },
  },
  design: [
    shot('07-seleccionar-moneda', 'Selector de moneda', 'Selector de moneda'),
    shot('09-metodo-pago', 'Método de pago', 'Método de pago compuesto con componentes del sistema'),
    shot('18-agregar-participantes', 'Agregar participantes', 'Agregar participantes: el mismo patrón de selección en toda la plataforma'),
  ],
  implementation: ['Adoptado por los cuatro desarrolladores front. Es lo que hace que cinco negocios distintos no se sientan como cinco empresas distintas.'],
  result: {
    output: [
      { value: '267 → 24', label: 'tokens de color', meaning: 'Cada token con un rol; ninguno decorativo.' },
      { value: '4', label: 'front que lo adoptaron', meaning: 'La adopción es la métrica de un design system; sin ella es una librería más.' },
      { value: '5', label: 'productos, un lenguaje', meaning: 'Sistema completo donde hace falta; brandsheet y UI kit donde no.' },
    ],
    outcome: 'unavailable',
    measure: 'Componentes reutilizados por módulo nuevo y tiempo de diseño por iniciativa antes y después del sistema.',
  },
  learnings: [
    'El punto de partida de un sistema es el código que ya existe, no la pizarra.',
    'La gobernanza se dimensiona por producto: imponerla donde no hace falta la mata.',
  ],
  next: 'hermes',
};
```

- [ ] **Step 9: Write `lib/content/cases/index.ts`**

```ts
import { hermes } from './hermes';
import { suscripcion } from './suscripcion';
import { editorPropuesta } from './editor-propuesta';
import { vista360 } from './vista-360';
import { designSystem } from './design-system';
export type { CaseStudy, Decision, Metric, Shot, DiagramId, CodeDemo } from './types';

export const CASES = [hermes, suscripcion, editorPropuesta, vista360, designSystem];
export const CASE_SLUGS = CASES.map((c) => c.slug);
export const getCase = (slug: string) => CASES.find((c) => c.slug === slug);
```

- [ ] **Step 10: Run tests** — `npx vitest run lib/content` → PASS.

- [ ] **Step 11: Commit**

```bash
git add lib/content/cases
git commit -m "feat(content): cinco casos de estudio estratificados sin métricas inventadas"
```

---

### Task 4: Content — about

**Files:**
- Create: `lib/content/about.ts`
- Test: `lib/content/about.test.ts`

**Interfaces (produces):**
```ts
export const ABOUT: {
  intro: string[];
  cities: { name: string; country: 'ES' | 'VE'; years?: string; current?: boolean }[];
  places: { src: string; alt: string; caption: string }[]; // vacío hasta que haya fotos
  education: { degree: string; school: string; place: string; years: string }[];
  ikigai: { tech: string; design: string; business: string; center: string };
  companies: { id: string; name: string; years: string; body: string; href: string }[];
  vision: { title: string; paragraphs: string[] };
  skills: string[]; tools: string[];
};
```

- [ ] **Step 1: Write the failing test**

`lib/content/about.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { ABOUT } from './about';

describe('sobre mí', () => {
  it('ciudades: Málaga actual, Venezuela y España', () => {
    expect(ABOUT.cities.find((c) => c.current)?.name).toBe('Málaga');
    expect(ABOUT.cities.filter((c) => c.country === 'VE').map((c) => c.name)).toEqual(['Cumaná', 'Caracas', 'Zulia']);
    expect(ABOUT.cities.filter((c) => c.country === 'ES').map((c) => c.name)).toEqual(['Jaén', 'Madrid', 'Lleida', 'Barcelona', 'Málaga']);
  });
  it('no inventa años: solo Málaga y la formación tienen fecha', () => {
    expect(ABOUT.cities.filter((c) => c.years).map((c) => c.name)).toEqual(['Málaga']);
    expect(ABOUT.education[0]).toMatchObject({ school: 'Universidad de Oriente', place: 'Cumaná, Venezuela', years: '2006–2017' });
  });
  it('competencias recortadas y herramientas de producto', () => {
    expect(ABOUT.skills.length).toBeLessThanOrEqual(10);
    expect(ABOUT.tools).not.toContain('Canva');
    expect(ABOUT.tools).toContain('Figma');
  });
  it('el bloque de lugares no tiene fotos todavía', () => {
    expect(ABOUT.places).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run lib/content/about.test.ts` → FAIL.

- [ ] **Step 3: Write `lib/content/about.ts`**

```ts
export const ABOUT = {
  intro: [
    'Soy Víctor, Product Designer.',
    'Diseño producto B2B donde un error operativo cuesta dinero.',
    'Informático de formación, Product Designer de oficio. Nueve años.',
  ],
  cities: [
    { name: 'Cumaná', country: 'VE' as const },
    { name: 'Caracas', country: 'VE' as const },
    { name: 'Zulia', country: 'VE' as const },
    { name: 'Jaén', country: 'ES' as const },
    { name: 'Madrid', country: 'ES' as const },
    { name: 'Lleida', country: 'ES' as const },
    { name: 'Barcelona', country: 'ES' as const },
    { name: 'Málaga', country: 'ES' as const, years: '2022 – ahora', current: true },
  ],
  places: [] as { src: string; alt: string; caption: string }[],
  education: [
    { degree: 'Licenciatura en Informática', school: 'Universidad de Oriente', place: 'Cumaná, Venezuela', years: '2006–2017' },
  ],
  ikigai: {
    tech: 'Informático de formación: sé cómo se construye lo que diseño, y respeto cómo piensa el framework.',
    design: 'Product Designer de oficio: nueve años en producto B2B denso, de la arquitectura al handoff.',
    business: 'Reglas de negocio, discovery con Product Owners y decisiones defendidas en lenguaje de negocio.',
    center: 'Product design',
  },
  companies: [
    { id: 'atrinium', name: 'Atrinium', years: '2022–2026', href: '/casos/hermes',
      body: 'Único diseñador de un holding con cinco productos. El principal, HERMES: un ERP SaaS multi-tenant para aseguradoras, reaseguradoras, MGAs y brokers, con el administrador que gobierna todo el grupo. Alrededor, facturación electrónica, un sistema de pólizas 360, gestión de usuarios y permisos y un e-commerce. Cinco productos, un solo lenguaje de diseño.' },
    { id: 'mercantil', name: 'Mercantil Panamá', years: '2020–2022', href: '/?f=banca#trabajo',
      body: 'Banca digital en entorno regulado. El sistema ya existía y mi trabajo era aplicarlo con criterio y validar cada pantalla antes de desarrollo: tests no moderados con Maze, entrevistas propias y sesiones con Marketing para los emails transaccionales. Nada pasaba a desarrollo sin haberse probado.' },
    { id: 'taksio', name: 'Taksio', years: '2017–2019', href: '/?f=transporte#trabajo',
      body: 'Plataforma de movilidad multimodal en Caracas: design system y flujos operativos de conductor y pasajero levantados desde cero.' },
  ],
  vision: {
    title: 'Diseño sistemas, no pantallas.',
    paragraphs: [
      'Mi base en informática no está para escribir código de producción: está para pensar el producto en sistemas, en estructura y en cómo se va a construir de verdad. Modelo el dominio antes que la pantalla, defino estados, reglas y casos límite, y cierro con un handoff que el equipo puede construir sin interpretar nada.',
      'Trabajo con patrones validados y criterios de usabilidad, no con invenciones, y respetando cómo se construye realmente en React, Chakra UI o Tailwind. Esta web es un ejemplo: el diseño es mío y dirigí la implementación con IA hasta el detalle. Generar es la parte fácil; lo que aporto es saber qué hay que pedir y reconocer cuándo lo que devuelve no sirve.',
      'Me interesan los flujos completos, no las pantallas sueltas. Sistemas que hagan que el siguiente diseño y el siguiente desarrollo cuesten menos que el anterior.',
    ],
  },
  skills: [
    'Arquitectura de información y flujos críticos en dominios regulados',
    'Design systems con gobernanza y criterios de uso',
    'Producto multi-tenant y white-labeling',
    'Formularios y reglas de negocio declarados como dato',
    'Accesibilidad WCAG 2.2 como requisito de entrada',
    'Discovery y defensa de propuestas ante Product Owners',
    'Handoff acompañado y diálogo técnico con desarrollo',
    'Research por observación indirecta cuando no hay acceso a usuarios',
  ],
  tools: ['Figma', 'FigJam', 'Prototipado interactivo', 'Chakra UI', 'Tailwind', 'React', 'GitHub', 'Vercel', 'Microsoft Clarity', 'Google Analytics', 'Maze', 'Mobbin', 'Claude'],
};
```

- [ ] **Step 4: Run tests** — PASS.
- [ ] **Step 5: Commit** — `git add lib/content/about.ts lib/content/about.test.ts && git commit -m "feat(content): sobre mí con ciudades, formación e ikigai"`

---

### Task 5: UI primitives

**Files:**
- Create: `components/ui/Button.tsx` + `.module.css`, `Chip.tsx` + `.module.css`, `Kicker.tsx`, `TwoToneHeading.tsx`, `Inset.tsx`, `Frame.tsx` + `Frame.module.css`, `SectionHeader.tsx` + `.module.css`, `Metric.tsx` + `.module.css`, `FactStrip.tsx` + `.module.css`, `Figure.tsx` + `.module.css`, `Disclosure.tsx` + `.module.css`, `CodeDemo.tsx` + `.module.css`, `components/ui/text.module.css`
- Test: `components/ui/ui.test.tsx`

**Interfaces (produces):**
```tsx
Button: { variant?: 'solid' | 'outline' | 'ghost'; size?: 'md' | 'lg'; href?: string; external?: boolean; onClick?; children; className?; 'aria-label'? } // renders <a> when href, else <button type="button">
Chip: { checked: boolean; count?: number; onSelect: () => void; children } // <button role="radio" aria-checked>
Kicker: { children; className? } // <p class="kicker">
TwoToneHeading: { as?: 'h1' | 'h2'; lines: [string, string]; size?: 'display' | 'xl' | 'lg'; id?; className? } // <h1 class="two-tone"><span>..</span><br/><span>..</span></h1>
Inset: { children; className?; as?: 'div' | 'section' } // <div class="inset">
Frame: { children; brand?: string; glow?: boolean; ratio?: '4/3' | '16/10' | 'auto'; className? }
SectionHeader: { id: string; kicker: string; title: [string, string]; action?: ReactNode }
Metric: { value: string; label: string; meaning?: string; tone?: 'light' | 'dark' }
FactStrip: { facts: { value: string; label: string }[] }
Figure: { src: string; alt: string; caption?: string; width: number; height: number; priority?: boolean; sizes?: string }
Disclosure: { title: string; defaultOpen?: boolean; children }
CodeDemo: { title: string; lang: 'json' | 'ts'; code: string }
```

- [ ] **Step 1: Write the failing tests**

`components/ui/ui.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';
import Chip from './Chip';
import TwoToneHeading from './TwoToneHeading';
import Metric from './Metric';
import CodeDemo from './CodeDemo';

describe('Button', () => {
  it('es un enlace con href y un botón sin él', () => {
    render(<><Button href="/x">Ir</Button><Button onClick={() => {}}>Hacer</Button></>);
    expect(screen.getByRole('link', { name: 'Ir' })).toHaveAttribute('href', '/x');
    expect(screen.getByRole('button', { name: 'Hacer' })).toHaveAttribute('type', 'button');
  });
  it('los externos abren en pestaña nueva con noopener y marcan ↗', () => {
    render(<Button href="https://x.y" external>Ver</Button>);
    const a = screen.getByRole('link', { name: /Ver/ });
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener');
    expect(a.textContent).toContain('↗');
  });
});

describe('Chip', () => {
  it('es un radio con estado y contador', async () => {
    const onSelect = vi.fn();
    render(<Chip checked={false} count={4} onSelect={onSelect}>Insurtech</Chip>);
    const r = screen.getByRole('radio', { name: /Insurtech/ });
    expect(r).toHaveAttribute('aria-checked', 'false');
    expect(r.textContent).toContain('4');
    await userEvent.click(r);
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

describe('TwoToneHeading', () => {
  it('pinta dos líneas en el nivel pedido', () => {
    render(<TwoToneHeading as="h1" lines={['Uno', 'Dos']} />);
    const h = screen.getByRole('heading', { level: 1 });
    expect(h).toHaveClass('two-tone');
    expect(h.querySelectorAll('span')).toHaveLength(2);
  });
});

describe('Metric', () => {
  it('muestra cifra, etiqueta y significado', () => {
    render(<Metric value="165" label="pantallas" meaning="una por flujo" />);
    expect(screen.getByText('165')).toBeInTheDocument();
    expect(screen.getByText('una por flujo')).toBeInTheDocument();
  });
});

describe('CodeDemo', () => {
  it('etiqueta el código como ejemplo ilustrativo', () => {
    render(<CodeDemo title="Demo" lang="json" code={'{ "a": 1 }'} />);
    expect(screen.getByText(/ejemplo ilustrativo/i)).toBeInTheDocument();
    expect(screen.getByText('{ "a": 1 }')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run components/ui` → FAIL.

- [ ] **Step 3: Write the components**

`components/ui/text.module.css`:
```css
.kicker { font-size: var(--fs-100); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3); font-weight: 500; }
.display { font-size: var(--fs-1000); letter-spacing: -0.03em; line-height: 1.05; font-variation-settings: 'wght' 450; }
.xl { font-size: var(--fs-900); letter-spacing: -0.025em; line-height: 1.1; }
.lg { font-size: var(--fs-800); }
```

`components/ui/Kicker.tsx`:
```tsx
import t from './text.module.css';
export default function Kicker({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`${t.kicker} ${className}`}>{children}</p>;
}
```

`components/ui/TwoToneHeading.tsx`:
```tsx
import t from './text.module.css';
type Props = { as?: 'h1' | 'h2'; lines: [string, string]; size?: 'display' | 'xl' | 'lg'; id?: string; className?: string };
export default function TwoToneHeading({ as: Tag = 'h2', lines, size = 'xl', id, className = '' }: Props) {
  return (
    <Tag id={id} className={`two-tone ${t[size]} ${className}`}>
      <span>{lines[0]}</span><br /><span>{lines[1]}</span>
    </Tag>
  );
}
```

`components/ui/Button.module.css`:
```css
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 22px; border-radius: var(--r-pill); font-size: var(--fs-200); font-weight: 500; line-height: 1; border: 1px solid transparent; transition: background .2s var(--ease), border-color .2s var(--ease), color .2s var(--ease), transform .2s var(--ease); white-space: nowrap; }
.btn:active { transform: scale(.98); }
.lg { min-height: 52px; padding: 0 28px; font-size: var(--fs-300); }
.solid { background: var(--ink); color: #fff; border-color: var(--ink); }
.solid:hover { background: #2a2c33; }
.outline { background: transparent; color: var(--ink); border-color: var(--ink); }
.outline:hover { background: var(--surface); }
.ghost { background: transparent; color: var(--ink-2); padding-inline: 12px; }
.ghost:hover { color: var(--ink); background: var(--surface); }
:global(.inset) .solid { background: var(--accent); color: #12151c; border-color: var(--accent); }
:global(.inset) .outline { color: var(--inset-ink); border-color: rgba(236,236,236,.35); }
:global(.inset) .outline:hover { background: rgba(255,255,255,.06); }
```

`components/ui/Button.tsx`:
```tsx
import Link from 'next/link';
import s from './Button.module.css';
type Props = { variant?: 'solid' | 'outline' | 'ghost'; size?: 'md' | 'lg'; href?: string; external?: boolean; onClick?: () => void; children: React.ReactNode; className?: string; 'aria-label'?: string };
export default function Button({ variant = 'solid', size = 'md', href, external, onClick, children, className = '', ...rest }: Props) {
  const cls = `${s.btn} ${s[variant]} ${size === 'lg' ? s.lg : ''} ${className}`;
  if (href && external) return <a href={href} target="_blank" rel="noopener" className={cls} {...rest}>{children} <span aria-hidden="true">↗</span></a>;
  if (href) return <Link href={href} className={cls} {...rest}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls} {...rest}>{children}</button>;
}
```

`components/ui/Chip.module.css`:
```css
.chip { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 14px; border-radius: var(--r-pill); background: var(--surface); color: var(--ink-2); font-size: var(--fs-200); box-shadow: var(--shadow-chip); transition: background .2s var(--ease), color .2s var(--ease); }
.chip:hover { color: var(--ink); }
.chip[aria-checked="true"] { background: var(--ink); color: #fff; }
.count { font-size: var(--fs-100); padding: 1px 7px; border-radius: var(--r-pill); background: rgba(18,19,23,.06); }
.chip[aria-checked="true"] .count { background: rgba(255,255,255,.18); }
```

`components/ui/Chip.tsx`:
```tsx
import s from './Chip.module.css';
type Props = { checked: boolean; count?: number; onSelect: () => void; children: React.ReactNode };
export default function Chip({ checked, count, onSelect, children }: Props) {
  return (
    <button type="button" role="radio" aria-checked={checked} tabIndex={checked ? 0 : -1} onClick={onSelect} className={s.chip}>
      {children}{typeof count === 'number' && <span className={s.count}>{count}</span>}
    </button>
  );
}
```

`components/ui/Inset.tsx`:
```tsx
export default function Inset({ children, className = '', as: Tag = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'section' }) {
  return <Tag className={`inset ${className}`}>{children}</Tag>;
}
```

`components/ui/Frame.module.css`:
```css
.frame { position: relative; border-radius: var(--r-media); overflow: hidden; background: var(--surface); isolation: isolate; }
.r43 { aspect-ratio: 4 / 3; } .r1610 { aspect-ratio: 16 / 10; }
.glow::before { content: ""; position: absolute; inset: -20%; background: var(--glow); filter: blur(40px); z-index: 0; }
.inner { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 6%; z-index: 1; }
.auto .inner { position: relative; padding: 0; }
.inner > * { border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(18,19,23,.18); }
@media (max-width: 767px) { .frame { border-radius: 24px; } }
```

`components/ui/Frame.tsx`:
```tsx
import s from './Frame.module.css';
type Props = { children: React.ReactNode; brand?: string; glow?: boolean; ratio?: '4/3' | '16/10' | 'auto'; className?: string };
export default function Frame({ children, brand, glow, ratio = '4/3', className = '' }: Props) {
  const r = ratio === '4/3' ? s.r43 : ratio === '16/10' ? s.r1610 : s.auto;
  return (
    <div className={`${s.frame} ${r} ${glow ? s.glow : ''} ${className}`} style={brand ? { background: brand } : undefined}>
      <div className={s.inner}>{children}</div>
    </div>
  );
}
```

`components/ui/SectionHeader.module.css`:
```css
.head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: var(--sp-16) var(--sp-24); margin-bottom: var(--sp-48); }
```
`components/ui/SectionHeader.tsx`:
```tsx
import Kicker from './Kicker';
import TwoToneHeading from './TwoToneHeading';
import s from './SectionHeader.module.css';
export default function SectionHeader({ id, kicker, title, action }: { id: string; kicker: string; title: [string, string]; action?: React.ReactNode }) {
  return (
    <div className={s.head}>
      <div><Kicker>{kicker}</Kicker><TwoToneHeading as="h2" id={id} lines={title} /></div>
      {action}
    </div>
  );
}
```

`components/ui/Metric.module.css`:
```css
.m { display: grid; gap: 6px; padding-top: var(--sp-16); border-top: 1px solid var(--line); }
.v { font-size: var(--fs-900); letter-spacing: -0.03em; line-height: 1; font-variation-settings: 'wght' 450; font-variant-numeric: tabular-nums; }
.l { font-size: var(--fs-200); color: var(--ink); }
.mean { font-size: var(--fs-200); color: var(--ink-2); }
.dark { border-top-color: rgba(255,255,255,.14); } .dark .l { color: var(--inset-ink); } .dark .mean { color: var(--inset-ink-2); }
```
`components/ui/Metric.tsx`:
```tsx
import s from './Metric.module.css';
export default function Metric({ value, label, meaning, tone = 'light' }: { value: string; label: string; meaning?: string; tone?: 'light' | 'dark' }) {
  return (
    <div className={`${s.m} ${tone === 'dark' ? s.dark : ''}`}>
      <p className={s.v}>{value}</p><p className={s.l}>{label}</p>{meaning && <p className={s.mean}>{meaning}</p>}
    </div>
  );
}
```

`components/ui/FactStrip.module.css`:
```css
.strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--sp-24); padding-block: var(--sp-24); border-block: 1px solid var(--line); }
.v { font-size: var(--fs-700); font-variation-settings: 'wght' 450; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.l { font-size: var(--fs-200); color: var(--ink-2); }
```
`components/ui/FactStrip.tsx`:
```tsx
import s from './FactStrip.module.css';
export default function FactStrip({ facts }: { facts: { value: string; label: string }[] }) {
  return <dl className={s.strip}>{facts.map((f) => <div key={f.label}><dt className={s.v}>{f.value}</dt><dd className={s.l}>{f.label}</dd></div>)}</dl>;
}
```

`components/ui/Figure.module.css`:
```css
.fig { margin: 0; } .img { border-radius: var(--r-card); border: 1px solid var(--line); width: 100%; height: auto; }
.cap { margin-top: var(--sp-12); font-size: var(--fs-200); color: var(--ink-2); }
```
`components/ui/Figure.tsx`:
```tsx
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
```

`components/ui/Disclosure.module.css`:
```css
.d { border-top: 1px solid var(--line); }
.s { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; min-height: 56px; font-size: var(--fs-500); font-weight: 500; }
.s::-webkit-details-marker { display: none; }
.s::after { content: "+"; font-size: var(--fs-600); color: var(--ink-3); }
.d[open] .s::after { content: "–"; }
.body { padding-bottom: var(--sp-24); }
```
`components/ui/Disclosure.tsx`:
```tsx
import s from './Disclosure.module.css';
export default function Disclosure({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return <details className={s.d} open={defaultOpen}><summary className={s.s}>{title}</summary><div className={s.body}>{children}</div></details>;
}
```

`components/ui/CodeDemo.module.css`:
```css
.wrap { border: 1px solid var(--line); border-radius: var(--r-card); overflow: hidden; background: var(--surface); }
.head { display: flex; justify-content: space-between; gap: var(--sp-12); padding: 10px 16px; border-bottom: 1px solid var(--line); font-size: var(--fs-100); color: var(--ink-2); }
.tag { color: var(--ink-3); text-transform: uppercase; letter-spacing: .08em; }
.pre { margin: 0; padding: 16px; overflow-x: auto; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.55; color: var(--ink); }
```
`components/ui/CodeDemo.tsx`:
```tsx
import s from './CodeDemo.module.css';
export default function CodeDemo({ title, lang, code }: { title: string; lang: 'json' | 'ts'; code: string }) {
  return (
    <div className={s.wrap}>
      <div className={s.head}><span>{title}</span><span className={s.tag}>{lang} · ejemplo ilustrativo</span></div>
      <pre className={s.pre}><code>{code}</code></pre>
    </div>
  );
}
```

- [ ] **Step 4: Run tests** — `npx vitest run components/ui` → PASS. Also `npx tsc --noEmit` → 0 errors.

- [ ] **Step 5: Commit** — `git add components/ui && git commit -m "feat(ui): primitivas del sistema (botón, chip, titular a dos tonos, inset, frame, métricas, figure, code demo)"`

---

### Task 6: Motion infrastructure

**Files:**
- Create: `lib/motion/prefs.ts`, `components/motion/SmoothScroll.tsx`, `components/motion/ScaleIn.tsx`, `components/motion/Reveal.tsx`, `components/motion/MotionProvider.tsx`
- Modify: `app/layout.tsx` (wrap children with `MotionProvider` + `SmoothScroll`)
- Test: `lib/motion/prefs.test.ts`

**Interfaces (produces):**
```ts
prefersReducedMotion(): boolean; isCoarsePointer(): boolean;
motionAllowed(): boolean;        // !reduced
scrollEffectsAllowed(): boolean; // !reduced && !coarse
<ScaleIn from={0.5}>{children}</ScaleIn>  // scroll-scrubbed scale; static when not allowed
<Reveal delay?>{children}</Reveal>         // motion whileInView fade-up
```

- [ ] **Step 1: Write the failing test**

`lib/motion/prefs.test.ts`:
```ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { motionAllowed, scrollEffectsAllowed } from './prefs';

const mm = (map: Record<string, boolean>) => vi.spyOn(window, 'matchMedia').mockImplementation((q: string) => ({ matches: !!map[q], media: q, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false }) as MediaQueryList);
afterEach(() => vi.restoreAllMocks());

describe('gating de motion', () => {
  it('todo permitido en escritorio sin preferencia', () => {
    mm({});
    expect(motionAllowed()).toBe(true);
    expect(scrollEffectsAllowed()).toBe(true);
  });
  it('reduced-motion apaga todo', () => {
    mm({ '(prefers-reduced-motion: reduce)': true });
    expect(motionAllowed()).toBe(false);
    expect(scrollEffectsAllowed()).toBe(false);
  });
  it('táctil apaga solo los efectos de scroll', () => {
    mm({ '(pointer: coarse)': true });
    expect(motionAllowed()).toBe(true);
    expect(scrollEffectsAllowed()).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL (module not found).

- [ ] **Step 3: Write `lib/motion/prefs.ts`**

```ts
const q = (s: string) => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(s).matches;
export const prefersReducedMotion = () => q('(prefers-reduced-motion: reduce)');
export const isCoarsePointer = () => q('(pointer: coarse)');
export const motionAllowed = () => !prefersReducedMotion();
export const scrollEffectsAllowed = () => motionAllowed() && !isCoarsePointer();
```

- [ ] **Step 4: Write `components/motion/MotionProvider.tsx`**

```tsx
'use client';
import { MotionConfig } from 'motion/react';
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>{children}</MotionConfig>;
}
```

- [ ] **Step 5: Write `components/motion/SmoothScroll.tsx`**

```tsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';

export default function SmoothScroll() {
  useEffect(() => {
    if (!scrollEffectsAllowed()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return null;
}
```

- [ ] **Step 6: Write `components/motion/ScaleIn.tsx`**

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';

/* Crece desde `from` hasta 1 mientras entra en pantalla (scrub). Sin permiso
   de motion se pinta a escala 1 y no toca nada. */
export default function ScaleIn({ from = 0.5, children, className = '' }: { from?: number; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !scrollEffectsAllowed()) return;
    const tween = gsap.fromTo(el, { scale: from }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 25%', scrub: 0.6 } });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [from]);
  return <div ref={ref} className={className} style={{ transformOrigin: 'center top', willChange: 'transform' }}>{children}</div>;
}
```

Note: `gsap.fromTo` in tests is mocked as `vi.fn()` returning undefined; guard with `tween?.` in cleanup: write `return () => { tween?.scrollTrigger?.kill(); tween?.kill(); };`.

- [ ] **Step 7: Write `components/motion/Reveal.tsx`**

```tsx
'use client';
import { motion } from 'motion/react';
export default function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ delay }}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 8: Wire into `app/layout.tsx`**

```tsx
import MotionProvider from '@/components/motion/MotionProvider';
import SmoothScroll from '@/components/motion/SmoothScroll';
// inside <body>:
<SkipLink />
<MotionProvider>{children}</MotionProvider>
<SmoothScroll />
<ConsentBanner />
```

- [ ] **Step 9: Run tests + typecheck** — `npx vitest run lib/motion && npx tsc --noEmit` → PASS / 0 errors. If `lenis` types complain about `lerp`, use `new Lenis({ lerp: 0.1 })` only.

- [ ] **Step 10: Commit** — `git add lib/motion components/motion app/layout.tsx && git commit -m "feat(motion): gating por preferencia, Lenis + ScrollTrigger, ScaleIn y Reveal"`

---

### Task 7: Header, footer, consent trim

**Files:**
- Create: `components/layout/SiteHeader.tsx` + `.module.css`, `components/layout/SiteFooter.tsx` + `.module.css`, `lib/motion/useScrollDirection.ts`
- Modify: `lib/consent.ts` (remove Hotjar/Plerdy/HubSpot), `lib/consent.test.ts`, `components/ConsentBanner.tsx` (copy), `app/globals.css` (consent styles with tokens)
- Delete: `components/Nav.tsx`, `components/Nav.test.tsx`
- Test: `components/layout/SiteHeader.test.tsx`

**Interfaces (produces):** `<SiteHeader />` (client; fixed; hides on scroll down), `<SiteFooter />` (server). Pages render `<SiteHeader/><main id="contenido">…</main><SiteFooter/>`.

- [ ] **Step 1: Write the failing test**

`components/layout/SiteHeader.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
const path = { current: '/' };
vi.mock('next/navigation', () => ({ usePathname: () => path.current }));
import SiteHeader from './SiteHeader';

describe('SiteHeader', () => {
  it('tiene nav con Trabajo, Sobre mí y Contactar, y marca la activa', () => {
    path.current = '/sobre-mi';
    render(<SiteHeader />);
    const nav = screen.getByRole('navigation', { name: /principal/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Trabajo' })).toHaveAttribute('href', '/#trabajo');
    expect(screen.getByRole('link', { name: 'Sobre mí' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Contactar' })).toHaveAttribute('href', '#contacto');
    expect(screen.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL.

- [ ] **Step 3: Write `lib/motion/useScrollDirection.ts`**

```ts
'use client';
import { useEffect, useState } from 'react';
/* 'down' cuando el usuario baja más de 8 px pasado el hero; 'up' al subir. */
export function useScrollDirection(threshold = 80) {
  const [dir, setDir] = useState<'up' | 'down'>('up');
  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < threshold) setDir('up');
        else if (Math.abs(y - last) > 8) setDir(y > last ? 'down' : 'up');
        last = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [threshold]);
  return dir;
}
```

- [ ] **Step 4: Write `components/layout/SiteHeader.module.css`**

```css
.header { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: transform .35s var(--ease); background: rgba(255,255,255,.82); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); }
.hidden { transform: translateY(-100%); }
.bar { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-16); min-height: 60px; }
.brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 500; min-height: 44px; }
.mark { width: 28px; height: 28px; border-radius: 50%; background: var(--ink); color: #fff; display: inline-grid; place-items: center; font-size: 11px; letter-spacing: .04em; }
.links { display: flex; align-items: center; gap: 4px; list-style: none; margin: 0; padding: 0; }
.link { display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: var(--r-pill); color: var(--ink-2); font-size: var(--fs-200); }
.link:hover, .link[aria-current="page"] { color: var(--ink); background: var(--surface); }
@media (max-width: 480px) { .brand span:last-child { display: none; } }
```

- [ ] **Step 5: Write `components/layout/SiteHeader.tsx`**

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/lib/content/site';
import Button from '@/components/ui/Button';
import { useScrollDirection } from '@/lib/motion/useScrollDirection';
import s from './SiteHeader.module.css';

export default function SiteHeader() {
  const path = usePathname();
  const dir = useScrollDirection();
  const isActive = (href: string) => (href.startsWith('/#') ? path === '/' : path === href);
  return (
    <header className={`${s.header} ${dir === 'down' ? s.hidden : ''}`}>
      <div className={`container ${s.bar}`}>
        <Link href="/" className={s.brand} aria-label="Inicio — Víctor Maza"><span className={s.mark} aria-hidden="true">VM</span><span>Víctor Maza</span></Link>
        <nav aria-label="Principal">
          <ul className={s.links}>
            {NAV.map((n) => <li key={n.href}><Link href={n.href} className={s.link} aria-current={isActive(n.href) ? 'page' : undefined}>{n.label}</Link></li>)}
            <li><Button href="#contacto" size="md">Contactar</Button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
```

Note: `Button` with `href="#contacto"` renders `<Link>`; on `/sobre-mi` the anchor also exists (its own contact block), so it always resolves.

- [ ] **Step 6: Write `components/layout/SiteFooter.module.css` + `SiteFooter.tsx`**

```css
.foot { border-top: 1px solid var(--line); padding-block: var(--sp-32); font-size: var(--fs-200); color: var(--ink-2); }
.row { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--sp-16); }
.links { display: flex; flex-wrap: wrap; gap: var(--sp-16); list-style: none; margin: 0; padding: 0; }
.links a { display: inline-flex; align-items: center; min-height: 44px; }
.links a:hover { color: var(--ink); }
```
```tsx
import Link from 'next/link';
import { SITE } from '@/lib/content/site';
import s from './SiteFooter.module.css';
export default function SiteFooter() {
  return (
    <footer className={s.foot}>
      <div className={`container ${s.row}`}>
        <p>© 2026 {SITE.name} · {SITE.city}, España · Trabajo en remoto</p>
        <ul className={s.links}>
          <li><a href={SITE.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a></li>
          <li><a href={SITE.behance} target="_blank" rel="noopener">Behance ↗</a></li>
          <li><Link href="/privacidad">Privacidad</Link></li>
          <li><Link href="/privacidad#cookies">Cookies</Link></li>
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Trim `lib/consent.ts`**

Remove constants and functions for HubSpot, Hotjar and Plerdy (`HS_*`, `HJ_*`, `PLERDY_*`, `startHotjar`, `startPlerdy`, `startHubSpot`). `startAnalytics` becomes `startGA(); startClarity();`. Update the header comment to "Dos servicios: GA4 y Microsoft Clarity". In `lib/consent.test.ts`, delete the tests that reference `startHotjar`, `startPlerdy`, `startHubSpot`, `hj`, `_suid`, `hs-scripts` (run `npx vitest run lib/consent.test.ts` and delete each failing `it` that asserts a removed vendor; keep GA and Clarity tests).

- [ ] **Step 8: Shorten the banner copy in `components/ConsentBanner.tsx`**

Replace the `<p>` text with: `Uso Google Analytics y Microsoft Clarity para ver cómo se navega esta web. Solo se activan si lo aceptas. <Link href="/privacidad">Más información</Link>`. Update `components/ConsentBanner.test.tsx` expectations if they match the old sentence (search for "Hotjar" in that test; replace the regex with `/Google Analytics y Microsoft Clarity/`).

Append consent styles to `app/globals.css` (tokens instead of old hexes):
```css
.consent { position: fixed; left: 16px; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); z-index: 150; max-width: 620px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 14px; padding: 16px 18px; background: rgba(255,255,255,.96); border: 1px solid var(--line); border-radius: var(--r-card); box-shadow: 0 12px 40px rgba(18,19,23,.14); opacity: 0; transform: translateY(12px); transition: opacity .35s var(--ease), transform .35s var(--ease); }
.consent.is-in { opacity: 1; transform: none; }
.consent p { margin: 0; flex: 1 1 260px; font-size: var(--fs-200); color: var(--ink-2); }
.consent p a { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
.consent-actions { display: flex; gap: 8px; }
.consent-btn { min-height: 44px; padding: 0 18px; border-radius: var(--r-pill); border: 1px solid var(--ink); background: transparent; color: var(--ink); font-size: var(--fs-200); font-weight: 500; }
.consent-btn.is-primary { background: var(--ink); color: #fff; }
```

- [ ] **Step 9: Delete `components/Nav.tsx` and `components/Nav.test.tsx`.** Nothing else imports `Nav` after Task 1's layout rewrite (verify: `grep -rn "components/Nav" app components lib` → no results).

- [ ] **Step 10: Run tests + typecheck** — `npx vitest run && npx tsc --noEmit` → all PASS. (Old home/perfil components still compile; they are replaced in Tasks 10 and 13.)

- [ ] **Step 11: Commit** — `git add -A components/layout lib/consent.ts lib/consent.test.ts lib/motion/useScrollDirection.ts components/ConsentBanner.tsx components/ConsentBanner.test.tsx app/globals.css && git rm -q components/Nav.tsx components/Nav.test.tsx && git commit -m "feat(layout): header que se esconde, footer sobrio y analítica reducida a GA4 + Clarity"`

---

### Task 8: Image pipeline

**Files:**
- Create: `scripts/build-images.mjs`
- Modify: `package.json` (script `images`)
- Create (generated): `public/assets/shots/*.webp` (21 files, ≤ 1600 px wide, q 82)
- Delete: `public/assets/hero-bg.mp4`, `public/assets/hermes/` (after generation), `public/assets/h-card/`, `public/assets/h-thumb/` are deleted in Task 14 once no component references them.
- Test: `scripts/images.test.ts`

**Interfaces (produces):** `/assets/shots/<name>.webp` for every `<name>.png` in the old `assets/hermes/`; `public/assets/shots/manifest.json` = `{ "<name>": { "width": number, "height": number } }` for `next/image` dimensions. Consumer: `lib/content/shots.ts` exports `shotSize(src): { width; height }`.

- [ ] **Step 1: Write the failing test**

`scripts/images.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { PROJECTS } from '../lib/content/projects';
import { CASES } from '../lib/content/cases';

const manifest = JSON.parse(readFileSync(new URL('../public/assets/shots/manifest.json', import.meta.url), 'utf8'));
const used = new Set<string>();
for (const p of PROJECTS) if (p.image) used.add(p.image.src);
for (const c of CASES) { used.add(c.hero.src); c.design.forEach((s) => used.add(s.src)); c.decisions.forEach((d) => { if (d.figure && 'shot' in d.figure) used.add(d.figure.shot.src); }); }

describe('capturas', () => {
  it('cada captura usada existe y está en el manifest con dimensiones', () => {
    for (const src of used) {
      const name = src.replace('/assets/shots/', '').replace('.webp', '');
      expect(existsSync(new URL('../public' + src, import.meta.url)), src).toBe(true);
      expect(manifest[name]?.width, src).toBeGreaterThan(0);
      expect(manifest[name]?.width, src).toBeLessThanOrEqual(1600);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL (manifest missing).

- [ ] **Step 3: Write `scripts/build-images.mjs`**

```js
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';

const SRC = 'public/assets/hermes';
const OUT = 'public/assets/shots';
await mkdir(OUT, { recursive: true });
const manifest = {};
for (const f of (await readdir(SRC)).filter((n) => n.endsWith('.png'))) {
  const name = basename(f, '.png');
  const img = sharp(join(SRC, f)).resize({ width: 1600, withoutEnlargement: true });
  const info = await img.webp({ quality: 82 }).toFile(join(OUT, name + '.webp'));
  manifest[name] = { width: info.width, height: info.height };
  console.log(name, info.width + 'x' + info.height, Math.round(info.size / 1024) + 'KB');
}
await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
```

Add to `package.json` scripts: `"images": "node scripts/build-images.mjs"`. Run `npm run images`. Expected: 21 lines, each ≤ ~250 KB.

- [ ] **Step 4: Write `lib/content/shots.ts`**

```ts
import manifest from '@/public/assets/shots/manifest.json';
const M = manifest as Record<string, { width: number; height: number }>;
export function shotSize(src: string): { width: number; height: number } {
  const name = src.replace('/assets/shots/', '').replace('.webp', '');
  return M[name] ?? { width: 1600, height: 1000 };
}
```

- [ ] **Step 5: Run test** — `npx vitest run scripts/images.test.ts` → PASS.

- [ ] **Step 6: Remove the unused heavy assets**

```bash
git rm -q -r public/assets/hermes public/assets/hero-bg.mp4
```
(The WebP set now lives in `public/assets/shots/`; the PNG originals remain in git history.)

- [ ] **Step 7: Commit** — `git add scripts package.json public/assets/shots lib/content/shots.ts && git commit -m "feat(assets): capturas en WebP ≤1600px con manifest de dimensiones; fuera PNG y vídeo sin uso"`

---

### Task 9: Catalog with filters

**Files:**
- Create: `components/catalog/Catalog.tsx`, `components/catalog/FilterChips.tsx`, `components/catalog/ProjectCard.tsx` + `.module.css`, `components/catalog/BrandTile.tsx` + `.module.css`, `components/catalog/catalog.module.css`
- Test: `components/catalog/Catalog.test.tsx`

**Interfaces:**
- Consumes: `PROJECTS, FILTERS, parseFilter, filterProjects, filterCounts, projectTags` (Task 2); `Chip`, `Frame`, `Button` (Task 5); `shotSize` (Task 8).
- Produces: `<Catalog initialFilter={FilterId} />` (client). `app/page.tsx` renders it inside `<Suspense>` and passes `parseFilter(searchParams.f)`.

- [ ] **Step 1: Write the failing test**

`components/catalog/Catalog.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(window.location.search), usePathname: () => '/' }));
vi.mock('motion/react', async () => {
  const React = await import('react');
  const passthrough = (tag: string) => React.forwardRef((p: Record<string, unknown>, ref) => { const { layout, layoutId, initial, animate, exit, transition, whileInView, viewport, ...rest } = p; return React.createElement(tag, { ...rest, ref }); });
  return { motion: new Proxy({}, { get: (_, tag: string) => passthrough(tag) }), AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children), LayoutGroup: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children), MotionConfig: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children) };
});
import Catalog from './Catalog';

beforeEach(() => { window.history.replaceState(null, '', '/'); });

describe('Catalog', () => {
  it('muestra los 10 proyectos y Todo marcado por defecto', () => {
    render(<Catalog initialFilter="todo" />);
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
    expect(screen.getByRole('radio', { name: /^Todo/ })).toHaveAttribute('aria-checked', 'true');
  });
  it('filtra al pulsar un chip, anuncia el recuento y escribe ?f=', async () => {
    render(<Catalog initialFilter="todo" />);
    await userEvent.click(screen.getByRole('radio', { name: /Banca/ }));
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('1 proyecto');
    expect(window.location.search).toBe('?f=banca');
    await userEvent.click(screen.getByRole('radio', { name: /^Todo/ }));
    expect(window.location.search).toBe('');
  });
  it('las cards con caso enlazan a /casos/<slug>; las externas abren fuera; sin captura pintan un tile de marca', () => {
    render(<Catalog initialFilter="todo" />);
    const items = screen.getAllByRole('listitem');
    expect(within(items[0]).getByRole('link', { name: /Ver caso/ })).toHaveAttribute('href', '/casos/hermes');
    const ayax = items.find((li) => li.textContent?.includes('Ayax'))!;
    expect(within(ayax).getByRole('link')).toHaveAttribute('target', '_blank');
    const merc = items.find((li) => li.textContent?.includes('Mercantil'))!;
    expect(within(merc).queryByRole('img')).toBeNull();
    expect(within(merc).getByTestId('brand-tile')).toBeInTheDocument();
  });
  it('las flechas del teclado cambian el filtro dentro del radiogroup', async () => {
    render(<Catalog initialFilter="todo" />);
    screen.getByRole('radio', { name: /^Todo/ }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: /Casos de estudio/ })).toHaveAttribute('aria-checked', 'true');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL.

- [ ] **Step 3: Write `components/catalog/BrandTile.tsx` + `.module.css`**

```css
.tile { width: 100%; height: 100%; display: grid; place-items: center; gap: 8px; color: #fff; text-align: center; padding: 8%; }
.logo { height: 28px; width: auto; filter: brightness(0) invert(1); opacity: .9; }
.name { font-size: var(--fs-500); font-weight: 500; letter-spacing: -0.02em; }
.sub { font-size: var(--fs-100); opacity: .7; letter-spacing: .08em; text-transform: uppercase; }
```
```tsx
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
```

- [ ] **Step 4: Write `components/catalog/ProjectCard.module.css`**

```css
.card { position: relative; display: grid; gap: var(--sp-16); }
.top { display: grid; gap: 8px; }
.title { display: flex; align-items: center; gap: 10px; font-size: var(--fs-400); font-weight: 500; letter-spacing: -0.01em; }
.icon { width: 24px; height: 24px; border-radius: 6px; object-fit: contain; background: var(--surface); padding: 3px; }
.tags { font-size: var(--fs-100); color: var(--ink-3); }
.tags span + span::before { content: " · "; }
.sum { font-size: var(--fs-200); color: var(--ink-2); max-width: 56ch; }
.media { position: relative; }
.media img { width: 100%; height: auto; }
.cta { position: absolute; top: 12px; right: 12px; }
.link::after { content: ""; position: absolute; inset: 0; } /* toda la card clicable cuando no hay caso */
```

- [ ] **Step 5: Write `components/catalog/ProjectCard.tsx`**

```tsx
'use client';
import Image from 'next/image';
import { motion } from 'motion/react';
import { unstable_ViewTransition as ViewTransition } from 'react';
import type { Project } from '@/lib/content/projects';
import { projectTags } from '@/lib/content/projects';
import { shotSize } from '@/lib/content/shots';
import Frame from '@/components/ui/Frame';
import Button from '@/components/ui/Button';
import BrandTile from './BrandTile';
import s from './ProjectCard.module.css';

export default function ProjectCard({ project: p }: { project: Project }) {
  const size = p.image ? shotSize(p.image.src) : null;
  const media = p.image && size
    ? <Image src={p.image.src} alt={p.image.alt} width={size.width} height={size.height} sizes="(max-width: 768px) 100vw, 580px" />
    : <BrandTile project={p} />;
  return (
    <motion.li layout layoutId={`card-${p.slug}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className={s.card}>
      <div className={s.top}>
        <h3 className={s.title}><img src={p.logo} alt="" className={s.icon} loading="lazy" decoding="async" />{p.title} · {p.company} · {p.years}</h3>
        <p className={s.tags}>{projectTags(p).map((t) => <span key={t}>{t}</span>)}</p>
        <p className={s.sum}>{p.summary}</p>
      </div>
      <div className={s.media}>
        <ViewTransition name={`case-${p.slug}`}>
          <Frame brand={p.brand} ratio="4/3">{media}</Frame>
        </ViewTransition>
        {p.hasCase && <Button href={`/casos/${p.slug}`} className={s.cta} aria-label={`Ver caso: ${p.title}`}>Ver caso</Button>}
        {!p.hasCase && p.url && <a href={p.url} target="_blank" rel="noopener" className={s.link} aria-label={`${p.title} · ${p.company} (abre en pestaña nueva)`}><span className="visually-hidden">Abrir</span></a>}
      </div>
    </motion.li>
  );
}
```

If `unstable_ViewTransition` is not exported by the installed React, replace the import with `const ViewTransition = ({ children }: { children: React.ReactNode; name?: string }) => <>{children}</>;` and note it in the commit; the route transition then degrades to a normal navigation.

- [ ] **Step 6: Write `components/catalog/FilterChips.tsx`**

```tsx
'use client';
import { useRef } from 'react';
import { FILTERS, type FilterId } from '@/lib/content/projects';
import Chip from '@/components/ui/Chip';
import s from './catalog.module.css';

export default function FilterChips({ value, counts, onChange }: { value: FilterId; counts: Record<FilterId, number>; onChange: (f: FilterId) => void }) {
  const group = useRef<HTMLDivElement>(null);
  const onKey = (e: React.KeyboardEvent) => {
    const i = FILTERS.findIndex((f) => f.id === value);
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = FILTERS[(i + d + FILTERS.length) % FILTERS.length].id;
    onChange(next);
    (group.current?.querySelectorAll<HTMLButtonElement>('[role=radio]')[FILTERS.findIndex((f) => f.id === next)])?.focus();
  };
  return (
    <div ref={group} role="radiogroup" aria-label="Filtrar proyectos" className={s.chips} onKeyDown={onKey}>
      {FILTERS.map((f) => <Chip key={f.id} checked={f.id === value} count={counts[f.id]} onSelect={() => onChange(f.id)}>{f.label}</Chip>)}
    </div>
  );
}
```

- [ ] **Step 7: Write `components/catalog/catalog.module.css`**

```css
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: var(--sp-32); }
.grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--sp-48) var(--sp-32); }
@media (max-width: 767px) { .grid { grid-template-columns: minmax(0, 1fr); gap: var(--sp-32); } }
.status { margin-bottom: var(--sp-16); font-size: var(--fs-100); color: var(--ink-3); }
```

- [ ] **Step 8: Write `components/catalog/Catalog.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { AnimatePresence, LayoutGroup } from 'motion/react';
import { filterProjects, filterCounts, type FilterId } from '@/lib/content/projects';
import FilterChips from './FilterChips';
import ProjectCard from './ProjectCard';
import s from './catalog.module.css';

/* El filtro vive en la URL (?f=) para poder compartirlo; replaceState evita
   añadir historial por cada chip. */
export default function Catalog({ initialFilter }: { initialFilter: FilterId }) {
  const [filter, setFilter] = useState<FilterId>(initialFilter);
  const counts = filterCounts();
  const items = filterProjects(filter);
  const change = (f: FilterId) => {
    setFilter(f);
    const url = f === 'todo' ? window.location.pathname : `${window.location.pathname}?f=${f}`;
    window.history.replaceState(null, '', url + (window.location.hash || ''));
  };
  return (
    <div>
      <FilterChips value={filter} counts={counts} onChange={change} />
      <p role="status" aria-live="polite" className={s.status}>{items.length} {items.length === 1 ? 'proyecto' : 'proyectos'}</p>
      <LayoutGroup>
        <ul className={s.grid}>
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </AnimatePresence>
        </ul>
      </LayoutGroup>
    </div>
  );
}
```

- [ ] **Step 9: Run tests + typecheck** — `npx vitest run components/catalog && npx tsc --noEmit` → PASS.

- [ ] **Step 10: Commit** — `git add components/catalog && git commit -m "feat(catalog): catálogo único con filtros en la URL, reflow animado y cards accesibles"`

---

### Task 10: Home page

**Files:**
- Create: `components/home/Hero.tsx` + `.module.css`, `components/home/HeroInset.tsx` + `.module.css`, `components/home/LogoMarquee.tsx` + `.module.css`, `components/home/Manifesto.tsx` + `.module.css`, `components/home/Closing.tsx` + `.module.css`, `components/home/Starfield.tsx`
- Rewrite: `app/page.tsx`
- Delete: old `components/home/{Home,Hero,Trabajo,UsoIA,Logos,Sectores,CasoModal}.tsx`, `CasoModal.test.tsx`, `UsoIA.test.tsx`, `components/Loader.tsx`, `Loader.test.tsx`, `components/Contacto.tsx`, `Contacto.test.tsx`, `components/effects/*` (neat.tsx, neat.test.tsx, Starfield.tsx), `lib/loader.ts`, `lib/loader.test.ts`, `lib/motion.ts`, `public/effects/*`, `app/template.tsx`
- Test: `components/home/home.test.tsx`

**Interfaces:**
- Consumes: `SITE` (Task 2), `Button`, `Kicker`, `TwoToneHeading`, `Inset`, `FactStrip`, `SectionHeader` (Task 5), `ScaleIn`, `Reveal` (Task 6), `Catalog`, `parseFilter` (Task 9), `shotSize`.
- Produces: `app/page.tsx` server component: `export default async function Page({ searchParams }: { searchParams: Promise<{ f?: string }> })`.

- [ ] **Step 1: Write the failing test**

`components/home/home.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(''), usePathname: () => '/' }));
import Hero from './Hero';
import Manifesto from './Manifesto';
import LogoMarquee from './LogoMarquee';
import Closing from './Closing';

describe('portada', () => {
  it('el hero responde quién, qué y para quién con dos CTA', () => {
    render(<Hero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toMatch(/reglas de negocio/i);
    expect(h1.textContent).toMatch(/producción/i);
    expect(screen.getByRole('link', { name: /Ver el caso HERMES/ })).toHaveAttribute('href', '/casos/hermes');
    expect(screen.getByRole('link', { name: /Contactar/ })).toHaveAttribute('href', '#contacto');
    expect(screen.getByText(/Insurtech/)).toBeInTheDocument();
  });
  it('el manifiesto está completo en el HTML (sin depender de JS)', () => {
    render(<Manifesto />);
    expect(screen.getByText(/Diseñé reglas en lugar de casos/)).toBeInTheDocument();
  });
  it('los logos son monocromos, discretos y accesibles', () => {
    render(<LogoMarquee />);
    const list = screen.getByRole('list', { name: /empresas/i });
    expect(list.querySelectorAll('img').length).toBeGreaterThanOrEqual(8);
    expect(list.querySelector('img')).toHaveAttribute('alt');
  });
  it('el cierre pregunta por el producto complejo y ofrece contacto', () => {
    render(<Closing />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(/producto complejo/i);
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('target', '_blank');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL (old `Hero` has no such heading).

- [ ] **Step 3: Delete the old home, loader, modal, effects and template files listed above**

```bash
git rm -q components/home/Home.tsx components/home/Hero.tsx components/home/Trabajo.tsx components/home/UsoIA.tsx components/home/UsoIA.test.tsx components/home/Logos.tsx components/home/Sectores.tsx components/home/CasoModal.tsx components/home/CasoModal.test.tsx components/Loader.tsx components/Loader.test.tsx components/Contacto.tsx components/Contacto.test.tsx components/effects/neat.tsx components/effects/neat.test.tsx components/effects/Starfield.tsx lib/loader.ts lib/loader.test.ts lib/motion.ts app/template.tsx public/effects/starfield-button.js public/effects/cursor-ring-field.js types/custom-elements.d.ts
```
`components/perfil/*` still imports `neat` and `Contacto` — it is deleted in Task 13; until then, `app/perfil/page.tsx` must not import it: replace `app/perfil/page.tsx` content with a temporary redirect: `import { redirect } from 'next/navigation'; export default function Page() { redirect('/sobre-mi'); }` and delete `components/perfil/` + `Competencias.test.tsx` now (`git rm -q -r components/perfil`). `ConsentBanner.tsx` imports `loaderSeen/needsLoader/onLoaderDone` from `lib/loader`: simplify its effect to `show(400)` unconditionally (delete the loader branches) and update `ConsentBanner.test.tsx` accordingly (remove loader-related cases).

- [ ] **Step 4: Write `components/home/Hero.module.css` + `Hero.tsx`**

```css
.hero { padding: calc(60px + var(--sp-96)) 0 var(--sp-48); text-align: center; }
.inner { display: grid; justify-items: center; gap: var(--sp-24); max-width: 880px; margin-inline: auto; }
.sub { font-size: var(--fs-400); color: var(--ink-2); max-width: 60ch; text-wrap: pretty; }
.meta { font-size: var(--fs-200); color: var(--ink-3); }
.ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
```
```tsx
import Kicker from '@/components/ui/Kicker';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';
import { SITE } from '@/lib/content/site';
import s from './Hero.module.css';

export default function Hero() {
  return (
    <section className={`container ${s.hero}`} aria-labelledby="hero-title">
      <Reveal className={s.inner}>
        <Kicker>Product Designer · B2B SaaS · Insurtech</Kicker>
        <TwoToneHeading as="h1" id="hero-title" size="display" lines={['Convierto reglas de negocio', 'en producto que llega a producción.']} />
        <p className={s.sub}>Nueve años diseñando SaaS asegurador, ERP y banca para compañías que no se parecen entre sí. Entiendo el dominio, lo modelo como reglas y componentes, y acompaño la implementación hasta que el diseño llega entero.</p>
        <p className={s.meta}>{SITE.city} · {SITE.available}</p>
        <div className={s.ctas}>
          <Button href="/casos/hermes" size="lg">Ver el caso HERMES</Button>
          <Button href="#contacto" variant="outline" size="lg">Contactar</Button>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 5: Write `components/home/HeroInset.module.css` + `HeroInset.tsx`**

```css
.wrap { padding-block: var(--sp-16) var(--sp-64); }
.inset { padding: clamp(16px, 3vw, 40px); }
.img { border-radius: 16px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,.35); }
.img img { width: 100%; height: auto; display: block; }
.cap { margin-top: var(--sp-16); font-size: var(--fs-200); color: var(--inset-ink-2); text-align: center; }
```
```tsx
import Image from 'next/image';
import Inset from '@/components/ui/Inset';
import ScaleIn from '@/components/motion/ScaleIn';
import { getProject } from '@/lib/content/projects';
import { shotSize } from '@/lib/content/shots';
import s from './HeroInset.module.css';

export default function HeroInset() {
  const p = getProject('hermes')!;
  const size = shotSize(p.image!.src);
  return (
    <div className={s.wrap}>
      <ScaleIn from={0.5}>
        <Inset className={s.inset}>
          <div className={s.img}><Image src={p.image!.src} alt={p.image!.alt} width={size.width} height={size.height} priority sizes="100vw" /></div>
          <p className={s.cap}>HERMES · {p.years} · en producción</p>
        </Inset>
      </ScaleIn>
    </div>
  );
}
```

- [ ] **Step 6: Write `components/home/LogoMarquee.module.css` + `LogoMarquee.tsx`**

```css
.wrap { overflow: hidden; padding-block: var(--sp-32); mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.track { display: flex; gap: 12px; width: max-content; animation: slide 60s linear infinite; list-style: none; margin: 0; padding: 0; }
.wrap:hover .track { animation-play-state: paused; }
.pill { display: inline-flex; align-items: center; gap: 10px; height: 44px; padding: 0 18px; border-radius: var(--r-pill); background: var(--surface); color: var(--ink-3); font-size: var(--fs-200); white-space: nowrap; }
.pill img { height: 18px; width: auto; filter: grayscale(1) brightness(.45); opacity: .85; }
@keyframes slide { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .track { animation: none; width: auto; flex-wrap: wrap; justify-content: center; } .wrap { mask-image: none; } }
```
```tsx
import s from './LogoMarquee.module.css';
const LOGOS = [
  ['Atrinium · HERMES', '/assets/logos/hermes.webp'], ['Flesip', '/assets/logos/flesip.webp'], ['Montsaint', '/assets/logos/montsaint.webp'],
  ['Mercantil Panamá', '/assets/logos/mercantil.webp'], ['Mony', '/assets/logos/mony.webp'], ['Wakari Solutions', '/assets/logos/wakari.webp'],
  ['Linikit', '/assets/logos/linikit.png'], ['Ayax', '/assets/logos/ayax.webp'],
] as const;
/* Discretos a propósito: monocromo, 18 px, sin color al pasar. Dos copias para el bucle. */
export default function LogoMarquee() {
  return (
    <div className={s.wrap}>
      <ul className={s.track} aria-label="Empresas con las que he trabajado">
        {[0, 1].map((copy) => LOGOS.map(([name, src]) => (
          <li key={copy + name} className={s.pill} aria-hidden={copy === 1 ? true : undefined}><img src={src} alt={copy === 0 ? name : ''} loading="lazy" decoding="async" />{name}</li>
        )))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 7: Write `components/home/Manifesto.module.css` + `Manifesto.tsx`**

```css
.wrap { padding-block: var(--sp-96); }
.text { font-size: var(--fs-900); letter-spacing: -0.025em; line-height: 1.12; max-width: 22ch; font-variation-settings: 'wght' 450; }
.w { display: inline-block; }
```
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
import s from './Manifesto.module.css';

const LINES = ['Diseño producto B2B donde un error operativo cuesta dinero.', 'Diseñé reglas en lugar de casos.'];

/* El texto completo va en el HTML. Con permiso de motion, las palabras
   arrancan atenuadas y se "escriben" al ritmo del scroll (scrub). */
export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !scrollEffectsAllowed()) return;
    const words = el.querySelectorAll(`.${s.w}`);
    const tween = gsap.fromTo(words, { opacity: 0.18 }, { opacity: 1, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.4 } });
    return () => { tween?.scrollTrigger?.kill(); tween?.kill(); };
  }, []);
  return (
    <section className={`container ${s.wrap}`} aria-label="Manifiesto">
      <p ref={ref} className={s.text}>
        {LINES.map((line, li) => (
          <span key={li}>{line.split(' ').map((w, i) => <span key={i} className={s.w}>{w}&nbsp;</span>)}{li === 0 && <br />}</span>
        ))}
      </p>
    </section>
  );
}
```

- [ ] **Step 8: Write `components/home/Starfield.tsx`**

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { scrollEffectsAllowed } from '@/lib/motion/prefs';
/* 120 puntos que derivan despacio. Solo con puntero fino y sin reduced-motion. */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || !scrollEffectsAllowed()) return;
    const ctx = c.getContext('2d')!;
    let raf = 0, w = 0, h = 0;
    const pts = Array.from({ length: 120 }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.2, v: 0.02 + Math.random() * 0.05 }));
    const size = () => { const r = c.getBoundingClientRect(); w = c.width = r.width * devicePixelRatio; h = c.height = r.height * devicePixelRatio; };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) { p.y -= p.v / 1000; if (p.y < 0) p.y = 1; ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r * devicePixelRatio, 0, Math.PI * 2); ctx.fillStyle = 'rgba(139,222,95,0.55)'; ctx.fill(); }
      raf = requestAnimationFrame(draw);
    };
    size(); draw();
    const ro = new ResizeObserver(size); ro.observe(c);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}
```

- [ ] **Step 9: Write `components/home/Closing.module.css` + `Closing.tsx`**

```css
.wrap { padding-block: var(--sp-64) var(--sp-96); }
.inset { position: relative; padding: clamp(40px, 6vw, 96px) clamp(24px, 5vw, 80px); }
.content { position: relative; z-index: 1; display: grid; gap: var(--sp-48); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--sp-24); }
.k { font-size: var(--fs-100); letter-spacing: .08em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
.v { font-size: var(--fs-300); color: var(--inset-ink); }
.ctas { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.copied { font-size: var(--fs-200); color: var(--accent); min-height: 1.5em; }
.mail { font-size: var(--fs-200); color: var(--inset-ink-2); }
```
```tsx
'use client';
import { useState } from 'react';
import Inset from '@/components/ui/Inset';
import Button from '@/components/ui/Button';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Starfield from './Starfield';
import { SITE } from '@/lib/content/site';
import s from './Closing.module.css';

export default function Closing() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(SITE.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.location.href = `mailto:${SITE.email}`; }
  };
  return (
    <section id="contacto" className={`container ${s.wrap}`} aria-labelledby="closing-title">
      <Inset className={s.inset}>
        <Starfield />
        <div className={s.content}>
          <TwoToneHeading as="h2" id="closing-title" size="xl" lines={['¿Tienes un producto complejo?', 'Reglas densas, varios clientes, un equipo que necesita diseño construible.']} />
          <div className={s.grid}>
            <div><p className={s.k}>Problema</p><p className={s.v}>Complejidad B2B</p></div>
            <div><p className={s.k}>Método</p><p className={s.v}>UX + sistema + UI + implementación</p></div>
            <div><p className={s.k}>Evidencia</p><p className={s.v}>Nueve años · SaaS asegurador en producción</p></div>
            <div><p className={s.k}>Acción</p><p className={s.v}>Un correo</p></div>
          </div>
          <div className={s.ctas}>
            <Button onClick={copy} aria-label="Copiar correo">{SITE.email}</Button>
            <Button href={SITE.linkedin} external variant="outline">LinkedIn</Button>
            <span className={s.copied} role="status">{copied ? 'Correo copiado' : ''}</span>
          </div>
        </div>
      </Inset>
    </section>
  );
}
```

- [ ] **Step 10: Rewrite `app/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { pageMetadata } from '@/lib/seo';
import { parseFilter } from '@/lib/content/projects';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Hero from '@/components/home/Hero';
import HeroInset from '@/components/home/HeroInset';
import FactStrip from '@/components/ui/FactStrip';
import LogoMarquee from '@/components/home/LogoMarquee';
import Manifesto from '@/components/home/Manifesto';
import SectionHeader from '@/components/ui/SectionHeader';
import Catalog from '@/components/catalog/Catalog';
import Closing from '@/components/home/Closing';

export const metadata: Metadata = pageMetadata(
  'Víctor Maza — Product Designer B2B SaaS e Insurtech',
  'Convierto reglas de negocio en producto que llega a producción. Nueve años en SaaS asegurador, ERP y banca. Casos de estudio de HERMES y design systems.',
  '/'
);

const FACTS = [
  { value: '165', label: 'pantallas en producción' }, { value: '8', label: 'áreas de producto' },
  { value: '5', label: 'productos, un lenguaje' }, { value: '2022–2026', label: 'único diseñador del holding' },
];

export default async function Page({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const { f } = await searchParams;
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <HeroInset />
        <div className="container"><FactStrip facts={FACTS} /></div>
        <LogoMarquee />
        <Manifesto />
        <section id="trabajo" className="container section" aria-labelledby="trabajo-title">
          <SectionHeader id="trabajo-title" kicker="Trabajo" title={['Casos y productos', 'en producción.']} />
          <Suspense><Catalog initialFilter={parseFilter(f)} /></Suspense>
        </section>
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 11: Run everything** — `npx vitest run && npx tsc --noEmit && npm run build`. Expected: tests PASS, 0 type errors, build OK. Open `npm run dev` → `/` renders; scroll: inset grows, header hides, manifesto types, chips filter with reflow.

- [ ] **Step 12: Commit** — `git add -A && git commit -m "feat(home): portada con hero a dos tonos, inset que crece, logos discretos, manifiesto, catálogo y cierre"`

---

### Task 11: Diagrams

**Files:**
- Create: `components/diagrams/Diagram.tsx`, `components/diagrams/diagram.module.css`, `components/diagrams/ClientsToSystem.tsx`, `AreasMap.tsx`, `BeforeAfter.tsx`, `StateMachine.tsx`, `TemplateSlots.tsx`, `Grid12to4to1.tsx`, `SystemCycle.tsx`, `Timeline.tsx`
- Test: `components/diagrams/Diagram.test.tsx`

**Interfaces:**
- Consumes: `DiagramId` (Task 3), `motion`.
- Produces: `<Diagram id={DiagramId} caption?: string />` — `<figure>` with an inline `<svg role="img" aria-label>`; parts animate in once when visible (`motion`), static under reduced motion (via `MotionConfig reducedMotion="user"`).

Shared SVG conventions: `viewBox="0 0 800 400"`, stroke `currentColor` at 1.5, fills `var(--surface)` / `var(--ink)` / `var(--focus)` only, text 14 px Geist via CSS, no external images.

- [ ] **Step 1: Write the failing test**

`components/diagrams/Diagram.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('motion/react', async () => {
  const React = await import('react');
  const pass = (tag: string) => React.forwardRef((p: Record<string, unknown>, ref) => { const { initial, animate, whileInView, viewport, transition, variants, custom, ...rest } = p; return React.createElement(tag, { ...rest, ref }); });
  return { motion: new Proxy({}, { get: (_, tag: string) => pass(tag) }), MotionConfig: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children) };
});
import Diagram from './Diagram';

const IDS = ['clients-to-system', 'areas-map', 'before-after', 'state-machine', 'template-slots', 'grid-12-4-1', 'system-cycle', 'timeline'] as const;

describe('Diagram', () => {
  it.each(IDS)('%s es una figura con svg accesible', (id) => {
    render(<Diagram id={id} caption="cap" />);
    const img = screen.getByRole('img');
    expect(img.tagName).toBe('svg');
    expect(img.getAttribute('aria-label')!.length).toBeGreaterThan(15);
    expect(screen.getByText('cap')).toBeInTheDocument();
  });
  it('before-after enseña 60 y 14', () => {
    render(<Diagram id="before-after" />);
    expect(screen.getByRole('img').textContent).toMatch(/60/);
    expect(screen.getByRole('img').textContent).toMatch(/14/);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL.

- [ ] **Step 3: Write `components/diagrams/diagram.module.css`**

```css
.fig { margin: 0; }
.svg { width: 100%; height: auto; color: var(--ink); font-family: inherit; font-size: 14px; }
.box { fill: var(--surface); stroke: var(--line); stroke-width: 1.5; }
.boxInk { fill: var(--ink); stroke: none; }
.line { fill: none; stroke: var(--ink-3); stroke-width: 1.5; }
.acc { stroke: var(--focus); }
.t { fill: var(--ink); } .t2 { fill: var(--ink-2); } .tw { fill: #fff; } .t3 { fill: var(--ink-3); font-size: 12px; }
.big { font-size: 56px; font-weight: 500; letter-spacing: -0.03em; }
.cap { margin-top: var(--sp-12); font-size: var(--fs-200); color: var(--ink-2); }
```

- [ ] **Step 4: Write the eight SVGs.** Each exports `default function X({ s }: { s: Record<string, string> })` and returns `<>…children of svg…</>`; `Diagram.tsx` wraps them. Use `motion.g` with `variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}` on each labelled group; the `<motion.svg>` parent uses `initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ staggerChildren: 0.08 }}`.

`ClientsToSystem.tsx`:
```tsx
import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
export default function ClientsToSystem({ s }: { s: Record<string, string> }) {
  const clients = ['Cliente A', 'Cliente B', 'Cliente C'];
  return (
    <>
      {clients.map((c, i) => (
        <motion.g key={c} variants={V}>
          <rect x={40} y={40 + i * 110} width={200} height={70} rx={16} className={s.box} />
          <text x={140} y={70 + i * 110} textAnchor="middle" className={s.t}>{c}</text>
          <text x={140} y={94 + i * 110} textAnchor="middle" className={s.t3}>moneda · idioma · regulador</text>
          <path d={`M240 ${75 + i * 110} C 320 ${75 + i * 110}, 340 200, 420 200`} className={s.line} />
        </motion.g>
      ))}
      <motion.g variants={V}>
        <rect x={420} y={150} width={150} height={100} rx={16} className={s.box} />
        <text x={495} y={192} textAnchor="middle" className={s.t}>Reglas</text>
        <text x={495} y={214} textAnchor="middle" className={s.t3}>declaradas como dato</text>
        <path d="M570 200 H 620" className={`${s.line} ${s.acc}`} />
      </motion.g>
      <motion.g variants={V}>
        <rect x={620} y={120} width={150} height={160} rx={20} className={s.boxInk} />
        <text x={695} y={190} textAnchor="middle" className={s.tw}>Sistema</text>
        <text x={695} y={212} textAnchor="middle" className={s.tw}>configurable</text>
        <text x={695} y={240} textAnchor="middle" className={s.tw} style={{ opacity: .7, fontSize: 12 }}>un solo producto</text>
      </motion.g>
    </>
  );
}
```

`AreasMap.tsx`:
```tsx
import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } };
const AREAS = ['Suscripción', 'Pólizas', 'Recibos', 'Facturación', 'Siniestros', 'Administración', 'Usuarios', 'Reporting'];
export default function AreasMap({ s }: { s: Record<string, string> }) {
  return (
    <>
      <rect x={40} y={30} width={720} height={340} rx={24} className={s.box} />
      <text x={70} y={64} className={s.t3}>HERMES · 8 áreas sobre el mismo núcleo</text>
      {AREAS.map((a, i) => { const col = i % 4, row = Math.floor(i / 4); return (
        <motion.g key={a} variants={V}>
          <rect x={70 + col * 172} y={90 + row * 130} width={152} height={100} rx={16} className={s.boxInk} />
          <text x={146 + col * 172} y={146 + row * 130} textAnchor="middle" className={s.tw}>{a}</text>
        </motion.g>); })}
    </>
  );
}
```

`BeforeAfter.tsx`:
```tsx
import { motion } from 'motion/react';
const V = { hidden: { opacity: 0 }, show: { opacity: 1 } };
export default function BeforeAfter({ s }: { s: Record<string, string> }) {
  const rows = (n: number, x: number, dim: boolean) => Array.from({ length: n }, (_, i) => <rect key={i} x={x} y={110 + i * 12} width={220} height={7} rx={3} fill={dim ? 'var(--line)' : 'var(--ink)'} opacity={dim && i >= 14 ? 0.5 : 1} />);
  return (
    <>
      <motion.g variants={V}>
        <text x={150} y={80} textAnchor="middle" className={`${s.t} ${s.big}`}>60</text>
        <text x={150} y={100} textAnchor="middle" className={s.t3}>campos visibles por paso · antes</text>
        {rows(20, 40, true)}
      </motion.g>
      <path d="M 330 200 H 450" className={`${s.line} ${s.acc}`} markerEnd="url(#arr)" />
      <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--focus)" /></marker></defs>
      <motion.g variants={V}>
        <text x={620} y={80} textAnchor="middle" className={`${s.t} ${s.big}`}>14</text>
        <text x={620} y={100} textAnchor="middle" className={s.t3}>solo los que pide la regla · después</text>
        {rows(14, 510, false)}
      </motion.g>
    </>
  );
}
```

`StateMachine.tsx`:
```tsx
import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
const PH = [['Cualificación', 'closer · cliente', 'contacto · perfil · comité'], ['Negociación', 'closer · legal · cliente', 'propuesta firmada'], ['Cerrado', 'finanzas · onboarding', 'pago · producto preparado']];
export default function StateMachine({ s }: { s: Record<string, string> }) {
  return (
    <>
      {PH.map(([n, who, out], i) => (
        <motion.g key={n} variants={V}>
          <rect x={40 + i * 250} y={110} width={220} height={150} rx={20} className={i === 2 ? s.boxInk : s.box} />
          <text x={150 + i * 250} y={150} textAnchor="middle" className={i === 2 ? s.tw : s.t}>{n}</text>
          <text x={150 + i * 250} y={178} textAnchor="middle" className={i === 2 ? s.tw : s.t3}>{who}</text>
          <text x={150 + i * 250} y={230} textAnchor="middle" className={i === 2 ? s.tw : s.t3}>salida: {out}</text>
          {i < 2 && <path d={`M ${260 + i * 250} 185 H ${290 + i * 250}`} className={`${s.line} ${s.acc}`} />}
        </motion.g>
      ))}
      <text x={400} y={330} textAnchor="middle" className={s.t3}>tres fases con audiencia, permisos y criterio de salida · no un wizard de veinte pasos</text>
    </>
  );
}
```

`TemplateSlots.tsx`:
```tsx
import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } };
export default function TemplateSlots({ s }: { s: Record<string, string> }) {
  const line = (y: number, w: number) => <rect x={80} y={y} width={w} height={8} rx={4} fill="var(--line)" />;
  return (
    <>
      <rect x={40} y={30} width={520} height={340} rx={20} className={s.box} />
      {line(70, 420)}{line(92, 380)}
      <motion.g variants={V}><rect x={80} y={120} width={150} height={26} rx={13} className={s.boxInk} /><text x={155} y={138} textAnchor="middle" className={s.tw}>@cliente.nombre</text></motion.g>
      {line(170, 440)}{line(192, 300)}
      <motion.g variants={V}><rect x={80} y={220} width={200} height={26} rx={13} fill="var(--focus)" /><text x={180} y={238} textAnchor="middle" className={s.tw}>/tabla-de-primas</text></motion.g>
      <motion.g variants={V}><rect x={80} y={270} width={440} height={60} rx={12} fill="none" stroke="var(--ink-3)" strokeDasharray="6 6" /><text x={100} y={305} className={s.t3}>cláusula opcional · se activa como bloque</text></motion.g>
      <text x={600} y={140} className={s.t}>@ variables</text>
      <text x={600} y={240} className={s.t}>/ componentes</text>
      <text x={600} y={305} className={s.t}>bloques opcionales</text>
      <text x={600} y={330} className={s.t3}>lo bloqueado no se toca</text>
    </>
  );
}
```

`Grid12to4to1.tsx`:
```tsx
import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };
export default function Grid12to4to1({ s }: { s: Record<string, string> }) {
  const finalists = [1, 4, 6, 9];
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <motion.g key={i} variants={V}>
          <rect x={40 + (i % 4) * 70} y={60 + Math.floor(i / 4) * 90} width={56} height={70} rx={10} className={finalists.includes(i) ? s.boxInk : s.box} />
        </motion.g>
      ))}
      <text x={175} y={360} textAnchor="middle" className={s.t3}>12 composiciones</text>
      <path d="M 340 200 H 400" className={`${s.line} ${s.acc}`} />
      {finalists.map((f, i) => <motion.g key={f} variants={V}><rect x={420 + i * 62} y={165} width={50} height={70} rx={10} className={s.boxInk} /></motion.g>)}
      <text x={540} y={360} textAnchor="middle" className={s.t3}>4 direcciones</text>
      <path d="M 680 200 H 710" className={`${s.line} ${s.acc}`} />
      <motion.g variants={V}><rect x={715} y={150} width={60} height={100} rx={12} fill="var(--focus)" /></motion.g>
      <text x={745} y={360} textAnchor="middle" className={s.t3}>1 en producción</text>
    </>
  );
}
```

`SystemCycle.tsx`:
```tsx
import { motion } from 'motion/react';
const V = { hidden: { opacity: 0 }, show: { opacity: 1 } };
export default function SystemCycle({ s }: { s: Record<string, string> }) {
  return (
    <>
      <motion.g variants={V}><rect x={60} y={140} width={220} height={120} rx={20} className={s.boxInk} /><text x={170} y={195} textAnchor="middle" className={s.tw}>Design system</text><text x={170} y={218} textAnchor="middle" className={s.tw} style={{ opacity: .7, fontSize: 12 }}>tokens · componentes · reglas</text></motion.g>
      <motion.g variants={V}><rect x={520} y={140} width={220} height={120} rx={20} className={s.box} /><text x={630} y={195} textAnchor="middle" className={s.t}>Módulo nuevo</text><text x={630} y={218} textAnchor="middle" className={s.t3}>se arma con lo que existe</text></motion.g>
      <motion.g variants={V}>
        <path d="M 280 170 C 380 110, 420 110, 520 170" className={`${s.line} ${s.acc}`} />
        <text x={400} y={118} textAnchor="middle" className={s.t3}>alimenta</text>
        <path d="M 520 230 C 420 290, 380 290, 280 230" className={`${s.line} ${s.acc}`} />
        <text x={400} y={300} textAnchor="middle" className={s.t3}>devuelve componentes</text>
      </motion.g>
    </>
  );
}
```

`Timeline.tsx`:
```tsx
import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
const T = [['2017–2019', 'Taksio · Caracas'], ['2020–2022', 'Mercantil Panamá'], ['2022–2026', 'Atrinium · Málaga'], ['2026', 'Disponible']];
export default function Timeline({ s }: { s: Record<string, string> }) {
  return (
    <>
      <path d="M 60 200 H 740" className={s.line} />
      {T.map(([y, l], i) => (
        <motion.g key={y} variants={V}>
          <circle cx={100 + i * 210} cy={200} r={8} fill={i === 3 ? 'var(--focus)' : 'var(--ink)'} />
          <text x={100 + i * 210} y={170} textAnchor="middle" className={s.t}>{y}</text>
          <text x={100 + i * 210} y={236} textAnchor="middle" className={s.t3}>{l}</text>
        </motion.g>
      ))}
    </>
  );
}
```

- [ ] **Step 5: Write `components/diagrams/Diagram.tsx`**

```tsx
'use client';
import { motion } from 'motion/react';
import type { DiagramId } from '@/lib/content/cases/types';
import s from './diagram.module.css';
import ClientsToSystem from './ClientsToSystem';
import AreasMap from './AreasMap';
import BeforeAfter from './BeforeAfter';
import StateMachine from './StateMachine';
import TemplateSlots from './TemplateSlots';
import Grid12to4to1 from './Grid12to4to1';
import SystemCycle from './SystemCycle';
import Timeline from './Timeline';

const MAP: Record<DiagramId, { label: string; C: (p: { s: Record<string, string> }) => React.ReactElement }> = {
  'clients-to-system': { label: 'Tres clientes con reglas distintas convergen en un sistema configurable', C: ClientsToSystem },
  'areas-map': { label: 'Mapa de las ocho áreas de producto de HERMES', C: AreasMap },
  'before-after': { label: 'De 60 campos visibles por paso a 14, mostrando solo los que pide la regla', C: BeforeAfter },
  'state-machine': { label: 'Máquina de estados de tres fases con audiencias y criterios de salida', C: StateMachine },
  'template-slots': { label: 'Plantilla con variables, componentes y cláusulas opcionales', C: TemplateSlots },
  'grid-12-4-1': { label: 'Doce composiciones, cuatro finalistas, una en producción', C: Grid12to4to1 },
  'system-cycle': { label: 'El design system alimenta el módulo y el módulo devuelve componentes', C: SystemCycle },
  'timeline': { label: 'Recorrido profesional de 2017 a 2026', C: Timeline },
};

export default function Diagram({ id, caption }: { id: DiagramId; caption?: string }) {
  const { label, C } = MAP[id];
  return (
    <figure className={s.fig}>
      <motion.svg viewBox="0 0 800 400" role="img" aria-label={label} className={s.svg} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ staggerChildren: 0.08 }}>
        <C s={s} />
      </motion.svg>
      {caption && <figcaption className={s.cap}>{caption}</figcaption>}
    </figure>
  );
}
```

- [ ] **Step 6: Run tests + typecheck** — PASS.
- [ ] **Step 7: Commit** — `git add components/diagrams && git commit -m "feat(diagrams): ocho diagramas SVG animados y accesibles"`

---

### Task 12: Case page

**Files:**
- Create: `app/casos/[slug]/page.tsx`, `components/case/CasePage.tsx` + `case.module.css`, `components/case/CaseHero.tsx`, `components/case/DecisionBlock.tsx`, `components/case/ResultBlock.tsx`, `components/case/NextCase.tsx`
- Test: `components/case/CasePage.test.tsx`, `app/casos/slug.test.ts`

**Interfaces:**
- Consumes: `getCase`, `CASE_SLUGS`, `CaseStudy` (Task 3); `getProject` (Task 2); UI (Task 5); `Diagram` (Task 11); `shotSize` (Task 8); `SiteHeader/SiteFooter` (Task 7).
- Produces: `generateStaticParams`, `generateMetadata`, `<CasePage c={CaseStudy} />`.

- [ ] **Step 1: Write the failing tests**

`components/case/CasePage.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('next/navigation', () => ({ usePathname: () => '/casos/hermes', useSearchParams: () => new URLSearchParams('') }));
vi.mock('motion/react', async () => { const React = await import('react'); const pass = (tag: string) => React.forwardRef((p: Record<string, unknown>, ref) => { const { initial, animate, whileInView, viewport, transition, variants, layout, layoutId, exit, ...rest } = p; return React.createElement(tag, { ...rest, ref }); }); return { motion: new Proxy({}, { get: (_, t: string) => pass(t) }), MotionConfig: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children), AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children), LayoutGroup: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children) }; });
import CasePage from './CasePage';
import { getCase } from '@/lib/content/cases';

describe('CasePage', () => {
  it('sigue la plantilla: h1, secciones en orden, resultado honesto y siguiente caso', () => {
    render(<CasePage c={getCase('hermes')!} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('HERMES');
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual(expect.arrayContaining(['Problema', 'Complejidad', 'Decisiones', 'Sistema', 'Diseño', 'Implementación', 'Resultado', 'Aprendizajes']));
    expect(h2.indexOf('Problema')).toBeLessThan(h2.indexOf('Decisiones'));
    expect(h2.indexOf('Decisiones')).toBeLessThan(h2.indexOf('Resultado'));
    expect(screen.getByText('Dato no disponible')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Siguiente caso/ })).toHaveAttribute('href', '/casos/suscripcion');
    expect(screen.getByRole('link', { name: /Trabajo/ })).toHaveAttribute('href', '/#trabajo');
  });
  it('pinta un CodeDemo cuando el caso lo trae', () => {
    render(<CasePage c={getCase('hermes')!} />);
    expect(screen.getByText(/ejemplo ilustrativo/i)).toBeInTheDocument();
  });
});
```

`app/casos/slug.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { generateStaticParams, generateMetadata } from './[slug]/page';

describe('/casos/[slug]', () => {
  it('genera los cinco slugs', async () => {
    expect((await generateStaticParams()).map((p) => p.slug)).toEqual(['hermes', 'suscripcion', 'editor-propuesta', 'vista-360', 'design-system']);
  });
  it('metadata por caso con canonical', async () => {
    const m = await generateMetadata({ params: Promise.resolve({ slug: 'hermes' }) });
    expect(String(m.title)).toContain('HERMES');
    expect(m.alternates?.canonical).toBe('/casos/hermes');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL.

- [ ] **Step 3: Write `components/case/case.module.css`**

```css
.top { padding-top: calc(60px + var(--sp-48)); }
.back { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; color: var(--ink-2); font-size: var(--fs-200); }
.back:hover { color: var(--ink); }
.head { display: grid; gap: var(--sp-16); max-width: 900px; margin-block: var(--sp-24) var(--sp-48); }
.title { display: flex; align-items: center; gap: 14px; font-size: var(--fs-1000); letter-spacing: -0.03em; line-height: 1.05; font-variation-settings: 'wght' 450; }
.icon { width: 44px; height: 44px; border-radius: 12px; background: var(--surface); padding: 6px; object-fit: contain; flex-shrink: 0; }
.tagline { font-size: var(--fs-500); color: var(--ink-2); max-width: 60ch; text-wrap: pretty; }
.tags { font-size: var(--fs-200); color: var(--ink-3); } .tags span + span::before { content: " · "; }
.heroInset { padding: clamp(16px, 3vw, 40px); }
.heroImg { border-radius: 16px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,.35); } .heroImg img { width: 100%; height: auto; }
.cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sp-32); padding-block: var(--sp-64); border-bottom: 1px solid var(--line); }
.cols p { font-size: var(--fs-200); color: var(--ink-2); }
.sec { padding-block: var(--sp-64); border-bottom: 1px solid var(--line); }
.sec h2 { font-size: var(--fs-100); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); font-weight: 500; margin-bottom: var(--sp-24); }
.problem p { font-size: var(--fs-800); line-height: 1.25; letter-spacing: -0.02em; color: var(--ink-2); max-width: 30ch; }
.problem p:first-child { color: var(--ink); margin-bottom: var(--sp-16); }
.decision { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: var(--sp-48); align-items: center; padding-block: var(--sp-32); }
.decision + .decision { border-top: 1px solid var(--line); }
.decision h3 { font-size: var(--fs-600); margin-bottom: var(--sp-12); }
.decision p { font-size: var(--fs-200); color: var(--ink-2); margin-bottom: var(--sp-8); }
.decision p strong { color: var(--ink); font-weight: 500; }
.body p { font-size: var(--fs-300); color: var(--ink-2); max-width: 66ch; margin-bottom: var(--sp-16); }
.gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--sp-32); }
.result { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--sp-32); }
.result h3 { font-size: var(--fs-100); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); margin-bottom: var(--sp-16); }
.metrics { display: grid; gap: var(--sp-24); }
.na { font-size: var(--fs-500); color: var(--ink-2); }
.measure { font-size: var(--fs-200); color: var(--ink-2); }
.learn { display: grid; gap: var(--sp-12); max-width: 66ch; font-size: var(--fs-400); }
.next { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--sp-24); padding-block: var(--sp-64); }
.nextLink { display: grid; gap: 4px; min-height: 44px; }
.nextLink span:first-child { font-size: var(--fs-100); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); }
.nextLink span:last-child { font-size: var(--fs-500); font-weight: 500; }
@media (max-width: 900px) { .cols, .result { grid-template-columns: minmax(0, 1fr); } .decision, .gallery { grid-template-columns: minmax(0, 1fr); } }
```

- [ ] **Step 4: Write `components/case/CaseHero.tsx`**

```tsx
import Image from 'next/image';
import { unstable_ViewTransition as ViewTransition } from 'react';
import Inset from '@/components/ui/Inset';
import ScaleIn from '@/components/motion/ScaleIn';
import { shotSize } from '@/lib/content/shots';
import type { Shot } from '@/lib/content/cases';
import s from './case.module.css';
export default function CaseHero({ slug, hero }: { slug: string; hero: Shot }) {
  const size = shotSize(hero.src);
  return (
    <ScaleIn from={0.85}>
      <ViewTransition name={`case-${slug}`}>
        <Inset className={s.heroInset}><div className={s.heroImg}><Image src={hero.src} alt={hero.alt} width={size.width} height={size.height} priority sizes="100vw" /></div></Inset>
      </ViewTransition>
    </ScaleIn>
  );
}
```
(Same fallback rule as Task 9 if `unstable_ViewTransition` is missing.)

- [ ] **Step 5: Write `components/case/DecisionBlock.tsx`**

```tsx
import Image from 'next/image';
import Frame from '@/components/ui/Frame';
import Diagram from '@/components/diagrams/Diagram';
import Reveal from '@/components/motion/Reveal';
import { shotSize } from '@/lib/content/shots';
import type { Decision } from '@/lib/content/cases';
import s from './case.module.css';
export default function DecisionBlock({ d, brand }: { d: Decision; brand: string }) {
  let media: React.ReactNode = null;
  if (d.figure && 'shot' in d.figure) { const z = shotSize(d.figure.shot.src); media = <Frame brand={brand} glow ratio="4/3"><Image src={d.figure.shot.src} alt={d.figure.shot.alt} width={z.width} height={z.height} sizes="(max-width: 900px) 100vw, 640px" /></Frame>; }
  else if (d.figure && 'diagram' in d.figure) media = <Diagram id={d.figure.diagram} />;
  return (
    <Reveal className={s.decision}>
      <div><h3>{d.title}</h3><p><strong>Por qué.</strong> {d.why}</p><p><strong>Qué cambió.</strong> {d.changed}</p></div>
      {media}
    </Reveal>
  );
}
```

- [ ] **Step 6: Write `components/case/ResultBlock.tsx` and `NextCase.tsx`**

```tsx
import Metric from '@/components/ui/Metric';
import type { CaseStudy } from '@/lib/content/cases';
import s from './case.module.css';
export default function ResultBlock({ r }: { r: CaseStudy['result'] }) {
  return (
    <div className={s.result}>
      <div><h3>Output</h3><div className={s.metrics}>{r.output.map((m) => <Metric key={m.label} {...m} />)}</div></div>
      <div><h3>Outcome</h3>{r.outcome === 'unavailable' ? <p className={s.na}>Dato no disponible</p> : <div className={s.metrics}>{r.outcome.map((m) => <Metric key={m.label} {...m} />)}</div>}</div>
      <div><h3>Qué mediría hoy</h3><p className={s.measure}>{r.measure}</p></div>
    </div>
  );
}
```
```tsx
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getCase } from '@/lib/content/cases';
import s from './case.module.css';
export default function NextCase({ slug }: { slug: string }) {
  const n = getCase(slug)!;
  return (
    <div className={s.next}>
      <Link href={`/casos/${n.slug}`} className={s.nextLink} aria-label={`Siguiente caso: ${n.title}`}><span>Siguiente caso</span><span>{n.title} →</span></Link>
      <Button href="/#contacto">Contactar</Button>
    </div>
  );
}
```

- [ ] **Step 7: Write `components/case/CasePage.tsx`**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Diagram from '@/components/diagrams/Diagram';
import CodeDemo from '@/components/ui/CodeDemo';
import Disclosure from '@/components/ui/Disclosure';
import Figure from '@/components/ui/Figure';
import { getProject } from '@/lib/content/projects';
import { shotSize } from '@/lib/content/shots';
import type { CaseStudy } from '@/lib/content/cases';
import CaseHero from './CaseHero';
import DecisionBlock from './DecisionBlock';
import ResultBlock from './ResultBlock';
import NextCase from './NextCase';
import s from './case.module.css';

export default function CasePage({ c }: { c: CaseStudy }) {
  const p = getProject(c.slug)!;
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <div className={`container ${s.top}`}>
          <Link href="/#trabajo" className={s.back}>← Trabajo</Link>
          <header className={s.head}>
            <h1 className={s.title}><img src={p.logo} alt="" className={s.icon} />{c.title} · {c.company}</h1>
            <p className={s.tagline}>{c.tagline}</p>
            <p className={s.tags}>{c.tags.map((t) => <span key={t}>{t}</span>)}<span>{c.years}</span></p>
          </header>
        </div>
        <CaseHero slug={c.slug} hero={c.hero} />
        <div className="container">
          <div className={s.cols}><div><h2>Contexto</h2><p>{c.context}</p></div><div><h2>Rol</h2><p>{c.role}</p></div><div><h2>Entrega</h2><p>{c.delivery}</p></div></div>
          <section className={`${s.sec} ${s.problem}`} aria-labelledby="c-problema"><h2 id="c-problema">Problema</h2><p>{c.problem[0]}</p><p>{c.problem[1]}</p></section>
          <section className={s.sec} aria-labelledby="c-complejidad"><h2 id="c-complejidad">Complejidad</h2><Diagram id={c.complexity.diagram} caption={c.complexity.caption} /></section>
          <section className={s.sec} aria-labelledby="c-decisiones"><h2 id="c-decisiones">Decisiones</h2>{c.decisions.map((d) => <DecisionBlock key={d.title} d={d} brand={c.brand} />)}</section>
          <section className={s.sec} aria-labelledby="c-sistema"><h2 id="c-sistema">Sistema</h2>
            <Disclosure title="Tokens, componentes y reglas" defaultOpen>
              <div className={s.body}>{c.system.body.map((b) => <p key={b.slice(0, 30)}>{b}</p>)}</div>
              {c.system.code && <CodeDemo {...c.system.code} />}
            </Disclosure>
          </section>
          <section className={s.sec} aria-labelledby="c-diseno"><h2 id="c-diseno">Diseño</h2>
            <div className={s.gallery}>{c.design.map((d) => { const z = shotSize(d.src); return <Figure key={d.src + d.caption} src={d.src} alt={d.alt} caption={d.caption} width={z.width} height={z.height} sizes="(max-width: 900px) 100vw, 580px" />; })}</div>
          </section>
          <section className={s.sec} aria-labelledby="c-impl"><h2 id="c-impl">Implementación</h2>
            <Disclosure title="Cómo llegó a producción" defaultOpen><div className={s.body}>{c.implementation.map((b) => <p key={b.slice(0, 30)}>{b}</p>)}</div></Disclosure>
          </section>
          <section className={s.sec} aria-labelledby="c-resultado"><h2 id="c-resultado">Resultado</h2><ResultBlock r={c.result} /></section>
          <section className={s.sec} aria-labelledby="c-apr"><h2 id="c-apr">Aprendizajes</h2><div className={s.learn}><p>{c.learnings[0]}</p><p>{c.learnings[1]}</p></div></section>
          <NextCase slug={c.next} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
```
`Image` import is unused here — remove it (only `Figure`/`DecisionBlock` render images).

- [ ] **Step 8: Write `app/casos/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CASE_SLUGS, getCase } from '@/lib/content/cases';
import { pageMetadata } from '@/lib/seo';
import CasePage from '@/components/case/CasePage';

export const dynamicParams = false;
export async function generateStaticParams() { return CASE_SLUGS.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCase((await params).slug);
  if (!c) return {};
  return pageMetadata(`${c.title} · ${c.company} — Víctor Maza`, c.tagline, `/casos/${c.slug}`);
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCase((await params).slug);
  if (!c) notFound();
  return <CasePage c={c} />;
}
```

- [ ] **Step 9: Run tests, typecheck, build** — `npx vitest run components/case app/casos && npx tsc --noEmit && npm run build` → PASS; build lists `/casos/hermes` … five static pages.

- [ ] **Step 10: Commit** — `git add app/casos components/case && git commit -m "feat(casos): páginas de caso con plantilla única, diagramas, code demo y resultado honesto"`

---

### Task 13: Sobre mí

**Files:**
- Create: `app/sobre-mi/page.tsx`, `components/about/AboutPage.tsx` + `about.module.css`, `components/about/Polaroid.tsx`, `components/about/CityChips.tsx`, `components/about/IkigaiDiagram.tsx` + `ikigai.module.css`, `components/about/CompanyTabs.tsx`
- Delete: `app/perfil/page.tsx`
- Test: `components/about/AboutPage.test.tsx`, `components/about/IkigaiDiagram.test.tsx`

**Interfaces:**
- Consumes: `ABOUT` (Task 4), `SITE`, UI, `Diagram` (`timeline`), `SiteHeader/SiteFooter`, `motion`.
- Produces: route `/sobre-mi`.

- [ ] **Step 1: Write the failing tests**

`components/about/IkigaiDiagram.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IkigaiDiagram from './IkigaiDiagram';

describe('IkigaiDiagram', () => {
  it('tres círculos enfocables con su frase, y el centro dice Product design', async () => {
    render(<IkigaiDiagram />);
    const btns = screen.getAllByRole('button');
    expect(btns.map((b) => b.getAttribute('aria-label'))).toEqual(['design', 'tech', 'business']);
    expect(screen.getByText('Product design')).toBeInTheDocument();
    await userEvent.click(btns[1]);
    expect(screen.getByRole('status')).toHaveTextContent(/Informático de formación/);
    expect(btns[1]).toHaveAttribute('aria-pressed', 'true');
  });
});
```

`components/about/AboutPage.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
vi.mock('next/navigation', () => ({ usePathname: () => '/sobre-mi', useSearchParams: () => new URLSearchParams('') }));
vi.mock('motion/react', async () => { const React = await import('react'); const pass = (tag: string) => React.forwardRef((p: Record<string, unknown>, ref) => { const { initial, animate, whileInView, viewport, transition, variants, layout, layoutId, exit, ...rest } = p; return React.createElement(tag, { ...rest, ref }); }); return { motion: new Proxy({}, { get: (_, t: string) => pass(t) }), MotionConfig: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children), AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children), LayoutGroup: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children) }; });
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  it('sigue la estructura: personal, formación, ikigai, empresas, visión, contacto', () => {
    render(<AboutPage />);
    const h2 = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2).toEqual(expect.arrayContaining(['Personal', 'Formación', 'Ikigai', 'Empresas']));
    expect(screen.getByText(/Universidad de Oriente/)).toBeInTheDocument();
    expect(screen.getByText('Málaga')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Diseño sistemas, no pantallas/ })).toBeInTheDocument();
    expect(screen.queryByText(/Lugares/)).toBeNull(); // sin fotos, sin bloque
    expect(document.querySelector('#contacto')).not.toBeNull();
  });
  it('las pestañas de empresas son tabs accesibles', () => {
    render(<AboutPage />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tab', { name: /Atrinium/ })).toHaveAttribute('aria-selected', 'true');
  });
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL.

- [ ] **Step 3: Write `components/about/ikigai.module.css`**

```css
.wrap { display: grid; gap: var(--sp-24); }
.svg { width: 100%; max-width: 560px; height: auto; margin-inline: auto; overflow: visible; }
.circle { mix-blend-mode: multiply; cursor: pointer; transition: opacity .3s var(--ease); }
.circle:focus-visible { outline: none; }
.circle:focus-visible circle { stroke: var(--focus); stroke-width: 3; }
.dim { opacity: .35; }
.label { font-size: 16px; font-weight: 500; fill: var(--ink); pointer-events: none; }
.center { font-size: 14px; font-weight: 500; fill: var(--ink); pointer-events: none; }
.status { min-height: 3.2em; font-size: var(--fs-400); color: var(--ink-2); text-align: center; max-width: 52ch; margin-inline: auto; }
```

- [ ] **Step 4: Write `components/about/IkigaiDiagram.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { ABOUT } from '@/lib/content/about';
import s from './ikigai.module.css';

type K = 'design' | 'tech' | 'business';
const C: { k: K; cx: number; cy: number; from: string; to: string; lx: number; ly: number }[] = [
  { k: 'design', cx: 280, cy: 170, from: '#4a44f2', to: '#8bde5f', lx: 280, ly: 80 },
  { k: 'tech', cx: 200, cy: 300, from: '#8bde5f', to: '#4a44f2', lx: 110, ly: 400 },
  { k: 'business', cx: 360, cy: 300, from: '#ffb547', to: '#4a44f2', lx: 450, ly: 400 },
];

/* Tres círculos con degradado que se desplaza (SMIL) y respiran (motion).
   Clic o foco en uno: los otros se atenúan y su frase aparece en el status.
   Con reduced-motion, MotionConfig deja la respiración quieta y el SMIL
   no se monta. */
export default function IkigaiDiagram() {
  const [active, setActive] = useState<K | null>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const toggle = (k: K) => setActive((a) => (a === k ? null : k));
  return (
    <div className={s.wrap}>
      <svg viewBox="0 0 560 480" className={s.svg} role="group" aria-label="Diagrama: diseño, tecnología y negocio se cruzan en product design">
        <defs>
          {C.map((c) => (
            <linearGradient key={c.k} id={`g-${c.k}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={c.from} stopOpacity="0.55" /><stop offset="100%" stopColor={c.to} stopOpacity="0.35" />
              {!reduced && <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="18s" repeatCount="indefinite" />}
            </linearGradient>
          ))}
        </defs>
        {C.map((c, i) => (
          <motion.g key={c.k} role="button" tabIndex={0} aria-label={c.k} aria-pressed={active === c.k}
            className={`${s.circle} ${active && active !== c.k ? s.dim : ''}`}
            onClick={() => toggle(c.k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(c.k); } }}
            animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}>
            <circle cx={c.cx} cy={c.cy} r={130} fill={`url(#g-${c.k})`} stroke="rgba(18,19,23,.12)" />
          </motion.g>
        ))}
        {C.map((c) => <text key={c.k} x={c.lx} y={c.ly} textAnchor="middle" className={s.label}>{c.k}</text>)}
        <text x={280} y={262} textAnchor="middle" className={s.center}>{ABOUT.ikigai.center}</text>
      </svg>
      <p role="status" aria-live="polite" className={s.status}>{active ? ABOUT.ikigai[active] : 'Toca un círculo.'}</p>
    </div>
  );
}
```

- [ ] **Step 5: Write `components/about/Polaroid.tsx`, `CityChips.tsx`, `CompanyTabs.tsx`**

```tsx
// Polaroid.tsx
import Image from 'next/image';
import s from './about.module.css';
export default function Polaroid({ src, alt, caption, width = 400, height = 400, tilt = -2 }: { src: string; alt: string; caption: string; width?: number; height?: number; tilt?: number }) {
  return (
    <figure className={s.polaroid} style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}>
      <Image src={src} alt={alt} width={width} height={height} sizes="320px" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
```
```tsx
// CityChips.tsx
import { ABOUT } from '@/lib/content/about';
import s from './about.module.css';
export default function CityChips({ country }: { country: 'ES' | 'VE' }) {
  return <>{ABOUT.cities.filter((c) => c.country === country).map((c) => <span key={c.name} className={`${s.chip} ${c.current ? s.chipNow : ''}`}>{c.name}{c.years ? <small> {c.years}</small> : null}</span>)}</>;
}
```
```tsx
// CompanyTabs.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ABOUT } from '@/lib/content/about';
import s from './about.module.css';
export default function CompanyTabs() {
  const [i, setI] = useState(0);
  const c = ABOUT.companies[i];
  return (
    <div>
      <div role="tablist" aria-label="Empresas" className={s.tabs}>
        {ABOUT.companies.map((co, k) => <button key={co.id} role="tab" id={`tab-${co.id}`} aria-selected={i === k} aria-controls={`panel-${co.id}`} tabIndex={i === k ? 0 : -1} className={s.tab} onClick={() => setI(k)}
          onKeyDown={(e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault(); const n = (k + d + ABOUT.companies.length) % ABOUT.companies.length; setI(n); document.getElementById(`tab-${ABOUT.companies[n].id}`)?.focus(); }}>{co.name} <small>{co.years}</small></button>)}
      </div>
      <div role="tabpanel" id={`panel-${c.id}`} aria-labelledby={`tab-${c.id}`} className={s.panel}>
        <p>{c.body}</p>
        <Link href={c.href} className={s.more}>{c.href.startsWith('/casos') ? 'Ver el caso →' : 'Ver en el catálogo →'}</Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Write `components/about/about.module.css`**

```css
.top { padding-top: calc(60px + var(--sp-64)); display: grid; justify-items: center; gap: var(--sp-32); }
.polaroid { margin: 0; background: #fff; padding: 12px 12px 40px; border-radius: 6px; box-shadow: 0 12px 40px rgba(18,19,23,.14); transform: rotate(var(--tilt)); width: min(320px, 80vw); }
.polaroid img { width: 100%; height: auto; border-radius: 3px; }
.polaroid figcaption { margin-top: 10px; font-style: italic; color: var(--ink-2); font-size: var(--fs-200); }
.sec { padding-block: var(--sp-64); border-top: 1px solid var(--line); }
.sec h2 { font-size: var(--fs-100); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); font-weight: 500; margin-bottom: var(--sp-24); }
.lines { display: grid; gap: 10px; font-size: var(--fs-600); letter-spacing: -0.02em; line-height: 1.3; max-width: 34ch; }
.lines p { color: var(--ink-2); } .lines p:first-child { color: var(--ink); }
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: var(--r-pill); background: var(--surface); color: var(--ink); font-size: var(--fs-300); margin: 0 4px 4px 0; vertical-align: middle; }
.chip small { color: var(--ink-3); font-size: var(--fs-100); }
.chipNow { background: var(--ink); color: #fff; } .chipNow small { color: rgba(255,255,255,.7); }
.edu { display: grid; gap: 6px; max-width: 60ch; } .edu p { color: var(--ink-2); } .edu strong { color: var(--ink); font-weight: 500; }
.tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: var(--sp-24); }
.tab { min-height: 44px; padding: 0 16px; border-radius: var(--r-pill); background: var(--surface); color: var(--ink-2); font-size: var(--fs-200); }
.tab[aria-selected="true"] { background: var(--ink); color: #fff; } .tab small { opacity: .7; margin-left: 6px; }
.panel p { font-size: var(--fs-300); color: var(--ink-2); max-width: 66ch; margin-bottom: var(--sp-16); }
.more { display: inline-flex; align-items: center; min-height: 44px; font-weight: 500; }
.vision h2 { font-size: var(--fs-900); text-transform: none; letter-spacing: -0.025em; color: var(--ink); }
.vision p { font-size: var(--fs-300); color: var(--ink-2); max-width: 66ch; margin-bottom: var(--sp-16); }
.two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--sp-48); }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; } .list li { font-size: var(--fs-200); color: var(--ink-2); padding-left: 14px; position: relative; }
.list li::before { content: ""; position: absolute; left: 0; top: .6em; width: 6px; height: 6px; border-radius: 50%; background: var(--ink); }
.tools { display: flex; flex-wrap: wrap; gap: 8px; } .tools span { padding: 4px 12px; border-radius: var(--r-pill); background: var(--surface); font-size: var(--fs-200); color: var(--ink-2); }
.contact { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
@media (max-width: 767px) { .two { grid-template-columns: minmax(0, 1fr); } }
```

- [ ] **Step 7: Write `components/about/AboutPage.tsx`**

```tsx
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Button from '@/components/ui/Button';
import Diagram from '@/components/diagrams/Diagram';
import { ABOUT } from '@/lib/content/about';
import { SITE } from '@/lib/content/site';
import Polaroid from './Polaroid';
import CityChips from './CityChips';
import IkigaiDiagram from './IkigaiDiagram';
import CompanyTabs from './CompanyTabs';
import s from './about.module.css';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <div className={`container ${s.top}`}>
          <Polaroid src="/assets/victor.jpg" alt="Víctor Maza" caption="Víctor Maza · Málaga" />
          <h1 className="visually-hidden">Sobre mí</h1>
        </div>
        <div className="container">
          <section className={s.sec} aria-labelledby="a-personal"><h2 id="a-personal">Personal</h2>
            <div className={s.lines}>
              {ABOUT.intro.map((l) => <p key={l}>{l}</p>)}
              <p>Vivo en <CityChips country="ES" /></p>
              <p>Nací en Venezuela: <CityChips country="VE" /></p>
            </div>
          </section>
          <section className={s.sec} aria-labelledby="a-formacion"><h2 id="a-formacion">Formación</h2>
            <div className={s.edu}>{ABOUT.education.map((e) => <p key={e.degree}><strong>{e.degree}</strong> · {e.school} · {e.place} · {e.years}</p>)}<p>Informático de formación, Product Designer de oficio.</p></div>
          </section>
          <section className={s.sec} aria-labelledby="a-ikigai"><h2 id="a-ikigai">Ikigai</h2><IkigaiDiagram /></section>
          <section className={s.sec} aria-labelledby="a-empresas"><h2 id="a-empresas">Empresas</h2><CompanyTabs /><div style={{ marginTop: 'var(--sp-32)' }}><Diagram id="timeline" /></div></section>
          <section className={`${s.sec} ${s.vision}`} aria-labelledby="a-vision"><h2 id="a-vision">{ABOUT.vision.title}</h2>
            {ABOUT.vision.paragraphs.map((p) => <p key={p.slice(0, 30)}>{p}</p>)}
            <div className={s.two} style={{ marginTop: 'var(--sp-32)' }}>
              <div><ul className={s.list}>{ABOUT.skills.map((k) => <li key={k}>{k}</li>)}</ul></div>
              <div className={s.tools}>{ABOUT.tools.map((t) => <span key={t}>{t}</span>)}</div>
            </div>
          </section>
          <section id="contacto" className={s.sec} aria-labelledby="a-contacto"><h2 id="a-contacto">Contacto</h2>
            <div className={s.contact}><Button href={`mailto:${SITE.email}`}>{SITE.email}</Button><Button href={SITE.linkedin} external variant="outline">LinkedIn</Button></div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
```
Note: `Button href="mailto:…"` goes through `next/link`; that is fine for `mailto:` in Next 16. The `Personal` section wraps the "Vivo en" sentence: since `Málaga` is the `current` chip, the sentence reads "Vivo en Jaén Madrid Lleida Barcelona Málaga" — fix by rendering current first: in `CityChips` sort `current` chips first when `country === 'ES'` and prefix the rest with "antes en": `Vivo en <chip Málaga>. Antes, <chips>`. Implement as two calls: `<CityChips country="ES" only="current" />` and `<CityChips country="ES" only="past" />` (add prop `only?: 'current' | 'past'`).

- [ ] **Step 8: Write `app/sobre-mi/page.tsx`; delete `app/perfil/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import AboutPage from '@/components/about/AboutPage';
export const metadata: Metadata = pageMetadata('Sobre mí — Víctor Maza', 'Product Designer en Málaga. Informático de formación, nueve años en producto B2B: dónde he vivido, qué he estudiado y cómo trabajo.', '/sobre-mi');
export default function Page() { return <AboutPage />; }
```
`git rm -q app/perfil/page.tsx` (the redirect in `next.config.ts` covers `/perfil`).

- [ ] **Step 9: Run tests, typecheck, build** — PASS.
- [ ] **Step 10: Commit** — `git add -A app/sobre-mi components/about && git rm -q app/perfil/page.tsx && git commit -m "feat(sobre-mi): página en primera persona con ciudades, formación, ikigai interactivo y empresas"`

---

### Task 14: SEO, cleanup, privacy page

**Files:**
- Create: `app/robots.ts`, `app/sitemap.ts`, `components/seo/JsonLd.tsx`
- Modify: `app/layout.tsx` (Person JSON-LD), `components/case/CasePage.tsx` (CreativeWork JSON-LD), `app/privacidad/page.tsx` (header/footer), `README.md`
- Delete: `lib/data.ts`, `lib/data.test.ts`, `lib/text.ts`, `lib/text.test.ts`, `public/assets/h-card/`, `public/assets/h-thumb/`, `public/assets/og.png` → regenerate later (keep for now), `_og-source.html`, `_serve.js`
- Test: `app/seo.test.ts`

- [ ] **Step 1: Write the failing test**

`app/seo.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import robots from './robots';
import sitemap from './sitemap';

describe('seo', () => {
  it('robots permite todo y apunta al sitemap', () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(r.sitemap).toBe('https://proyectos-theta-hazel.vercel.app/sitemap.xml');
  });
  it('sitemap incluye portada, sobre mí, privacidad y los cinco casos', () => {
    const urls = sitemap().map((u) => u.url);
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/');
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/sobre-mi');
    expect(urls).toContain('https://proyectos-theta-hazel.vercel.app/casos/hermes');
    expect(urls).toHaveLength(8);
  });
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL.

- [ ] **Step 3: Write `app/robots.ts`, `app/sitemap.ts`, `components/seo/JsonLd.tsx`**

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content/site';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE.url}/sitemap.xml` }; }
```
```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/content/site';
import { CASE_SLUGS } from '@/lib/content/cases';
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, priority: 1 },
    { url: `${SITE.url}/sobre-mi`, lastModified: now, priority: 0.8 },
    { url: `${SITE.url}/privacidad`, lastModified: now, priority: 0.2 },
    ...CASE_SLUGS.map((s) => ({ url: `${SITE.url}/casos/${s}`, lastModified: now, priority: 0.9 })),
  ];
}
```
```tsx
// components/seo/JsonLd.tsx
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```
In `app/layout.tsx` `<body>` add: `<JsonLd data={{ '@context': 'https://schema.org', '@type': 'Person', name: SITE.name, jobTitle: 'Product Designer', url: SITE.url, email: SITE.email, address: { '@type': 'PostalAddress', addressLocality: 'Málaga', addressCountry: 'ES' }, sameAs: [SITE.linkedin, SITE.behance] }} />`.
In `CasePage.tsx` add: `<JsonLd data={{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: c.title, description: c.tagline, author: { '@type': 'Person', name: 'Víctor Maza' }, url: \`${SITE.url}/casos/${c.slug}\`, dateCreated: c.years.slice(0, 4) }} />`.

- [ ] **Step 4: Privacy page** — in `app/privacidad/page.tsx` wrap the existing `<main>` with `<SiteHeader />` before and `<SiteFooter />` after (keep `className="legal"` on the wrapper div; drop the old `page` class). Remove any `Contacto` usage if present. Also remove the paragraphs/tools that describe Hotjar, Plerdy and HubSpot in the copy (they no longer load), and update the cookies table accordingly.

- [ ] **Step 5: Delete the legacy data module and assets**

```bash
git rm -q lib/data.ts lib/data.test.ts lib/text.ts lib/text.test.ts _og-source.html _serve.js
git rm -q -r public/assets/h-card public/assets/h-thumb
```
Verify nothing imports them: `grep -rn "lib/data\|lib/text\|h-card\|h-thumb" app components lib` → no results.

- [ ] **Step 6: Update `README.md`** — replace the "Estructura" block with: rutas (`/`, `/casos/[slug]`, `/sobre-mi`, `/privacidad`), `lib/content/` (site, projects, cases, about), `components/ui`, `components/catalog`, `components/case`, `components/about`, `components/diagrams`, `components/motion`, `scripts/build-images.mjs`; analytics table reduced to GA4 + Clarity.

- [ ] **Step 7: Run tests, typecheck, build** — `npx vitest run && npx tsc --noEmit && npm run build` → PASS.
- [ ] **Step 8: Commit** — `git add -A && git commit -m "chore(seo): robots, sitemap, JSON-LD; retirar datos y assets antiguos; privacidad con el nuevo layout"`

---

### Task 15: Verification and re-audit

**Files:**
- Create: `scripts/audit.mjs`, `docs/auditoria/2026-09-22-reauditoria.md`
- Modify: `package.json` (script `audit`)

**Interfaces:** `npm run audit` (requires `npm run build && npm run start` on port 3000, or `PORT`) prints a JSON report and fails on any axe violation.

- [ ] **Step 1: Write `scripts/audit.mjs`**

```js
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.BASE || 'http://localhost:3000';
const ROUTES = ['/', '/casos/hermes', '/sobre-mi'];
const VIEWPORTS = [[1280, 800], [768, 1024], [375, 812]];
const browser = await chromium.launch();
const report = [];
let failed = false;
for (const route of ROUTES) for (const [w, h] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Rechazar' }).click().catch(() => {});
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  const m = await page.evaluate(() => {
    const small = [...document.querySelectorAll('a,button,[role=button],[role=radio],[role=tab]')].filter((el) => { const r = el.getBoundingClientRect(); return r.width && r.height && r.height < 44; }).map((el) => (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30) + ' ' + Math.round(el.getBoundingClientRect().height));
    const firstShot = document.querySelector('main img[src*="/assets/shots/"]');
    return {
      landmarks: ['main', 'nav', 'header', 'footer'].map((t) => t + ':' + document.querySelectorAll(t).length).join(' '),
      h1: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      height: document.documentElement.scrollHeight,
      firstShotY: firstShot ? Math.round(firstShot.getBoundingClientRect().top + scrollY) : null,
      small,
      transferKB: Math.round(performance.getEntriesByType('resource').reduce((s, r) => s + (r.transferSize || 0), 0) / 1024),
    };
  });
  const lcp = await page.evaluate(() => new Promise((r) => { try { new PerformanceObserver((l) => { const e = l.getEntries(); r(e.length ? Math.round(e[e.length - 1].startTime) : null); }).observe({ type: 'largest-contentful-paint', buffered: true }); setTimeout(() => r(null), 800); } catch { r(null); } }));
  if (axe.violations.length) failed = true;
  report.push({ route, viewport: `${w}x${h}`, violations: axe.violations.map((v) => v.id + ' ×' + v.nodes.length), lcp, ...m });
  await page.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (failed) { console.error('axe violations'); process.exit(1); }
```
Add `"audit": "node scripts/audit.mjs"` to `package.json` and run `npx playwright install chromium` once.

- [ ] **Step 2: Run the audit**

```bash
npm run build && (npm run start & sleep 4 && npm run audit)
```
Expected: 0 axe violations on 9 route×viewport pairs; `overflow: false` everywhere; `small: []` on 375; `firstShotY` on `/` ≤ 750 at 1280; `height` on `/` ≤ 6000 at 1280; `lcp` < 2000 at 1280.

- [ ] **Step 3: Keyboard walkthrough (manual, `npm run dev`)** — Tab from the top: skip link → brand → Trabajo → Sobre mí → Contactar → hero CTAs → chips (arrows change filter) → cards → "Ver caso" → Enter opens `/casos/hermes` with the image transitioning. Esc/Back returns with `?f` preserved. Record the result in the re-audit doc.

- [ ] **Step 4: Reduced-motion walkthrough** — Chrome DevTools → Rendering → `prefers-reduced-motion: reduce`: no Lenis inertia, inset at scale 1, marquee static, manifesto fully opaque, Ikigai static (no gradient rotation), diagrams visible without animation. Record.

- [ ] **Step 5: Write `docs/auditoria/2026-09-22-reauditoria.md`** — same 15 dimensions as the diagnosis §21 with before/after values and the audit JSON pasted; list the P0–P2 items of the diagnosis and mark each as fixed / pending, plus the items pending from Víctor (photos, city years, Figma export, CV figures, OG image regeneration).

- [ ] **Step 6: Commit** — `git add scripts/audit.mjs package.json docs/auditoria/2026-09-22-reauditoria.md && git commit -m "test(audit): auditoría automatizada con axe y re-auditoría del rediseño"`

---

## Self-review notes

- Spec coverage: §2 rutas → T1, T12, T13, T14; §3 tokens/tipografía/componentes → T1, T5; §4 portada → T10; §5 catálogo → T2, T9; §6 caso → T3, T11, T12; §7 sobre mí → T4, T13; §8 motion → T6 + gating in T9/T10/T13; §9 datos e imágenes → T2–T4, T8, T14; §10 a11y/perf/SEO → T1, T7, T14, T15; §11 verificación → tests per task + T15.
- Type consistency: `Shot {src, alt, caption}` (T3) is what `Figure` (T5) and `CaseHero` (T12) consume; `shotSize(src)` (T8) used in T9, T10, T12; `FilterId`/`parseFilter` (T2) used in T9, T10; `DiagramId` (T3) is the `Diagram` prop (T11, T12, T13).
- Known deviations from spec, recorded: mono logos use raster + CSS filter instead of SVG (no SVG sources); Insurtech count is 4 (design-system is `multi`); `hasCase` order fixed by `PROJECTS` order.
