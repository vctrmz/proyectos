# Migración del portfolio a Next.js — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir los tres HTML estáticos exportados de Claude Design en una app Next.js con navegación sin recarga, manteniendo el diseño 1:1, y desplegarla en el mismo proyecto Vercel.

**Architecture:** App Router con tres rutas estáticas. `layout.tsx` mantiene Nav, fuentes, scripts de efectos y banner de consentimiento; cada página es un componente cliente que compone secciones. Datos y textos en `lib/data.ts`; lógica de consentimiento en `lib/consent.ts`; efectos de `neat-effects.js` portados a React; los custom elements `starfield-button` y `cursor-ring-field` se reutilizan sin cambios.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, GSAP 3 (npm), remixicon (npm), next/font/google, Vitest + jsdom + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-16-migracion-nextjs-design.md`

## Global Constraints

- Migración, no rediseño: textos, colores, tipografías y layout idénticos a `index.html`, `perfil.html`, `privacidad.html` (los originales quedan en el repo hasta la Task 13; consúltalos para copiar cualquier estilo o texto literal).
- Loader: 1,6 s en total, solo primera visita de sesión (`sessionStorage['vm-loader']`) y solo escritorio (`(max-width: 820px)` lo desactiva).
- Consentimiento: clave `localStorage['vm-consent']` con valores `granted` / `denied`; sin decisión o `denied` no se pide ningún recurso a googletagmanager.com, clarity.ms, hotjar.com, plerdy.com ni hs-scripts.com.
- IDs: GA4 `G-HZYDMMSVG5`; Clarity `yd4g6685po` (paquete `https://cdn.jsdelivr.net/npm/@microsoft/clarity@1.0.2/index.js`); Hotjar id `6776849` sv `6`; HubSpot portal `148496979` en `https://js-eu1.hs-scripts.com/148496979.js`; Plerdy `_site_hash_code` `81690a1951e6290b7119405fec614b5d`, `_suid` `81035`, script `https://a.plerdy.com/public/js/click/main.js`.
- Paleta: fondo `#1b1e27`, texto `#ececec`, acento `#8bde5f`, índigo `#4a44f2`, lila `#a9a4f8`, franja pie `#3a34e8`, bordes `#2c3140` / `#343a4a` / `#262626`, grises `#878787` / `#949494` / `#6d6d6d`, contacto `#15181f`.
- Fuentes: Montserrat 300–700 (cuerpo) y Bebas Neue 400 (titulares) vía `next/font/google`; clase `.bebas` para Bebas.
- Responsive: todo lo que hoy depende de `state.mobile` va a CSS con `@media (max-width: 820px)`. Ningún estilo de layout depende de JS.
- Los `style-hover` del runtime se convierten en clases CSS con `:hover` (un estilo inline gana a `a:hover`).
- Rutas antiguas `/index.html`, `/perfil.html`, `/privacidad.html` → redirect 301 a `/`, `/perfil`, `/privacidad`.
- Commits pequeños, en español, sin prefijos tipo `feat:` (el historial no los usa). Terminar cada mensaje con `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- Windows + Git Bash: rutas con `/`; el repo está en `C:\Proyectos khan\Carpeta Mac\proyectos-web`.

## Estructura de ficheros

```
package.json, tsconfig.json, next.config.ts, vercel.json, vitest.config.ts, .gitignore
types/custom-elements.d.ts     tipos JSX para <starfield-button> y <cursor-ring-field>
test/setup.ts                  jest-dom, mocks de matchMedia/IO/RO/gsap
app/layout.tsx                 html, fuentes, remixicon, Nav, scripts de efectos, ConsentBanner, AnalyticsPageView
app/template.tsx               transición de entrada
app/globals.css                reset, clases responsive, hover, nav, loader, consent, legal
app/page.tsx                   metadata + <Home/>
app/perfil/page.tsx            metadata + <Perfil/>
app/privacidad/page.tsx        metadata + contenido estático + <ConsentState/>
lib/text.ts                    splitBold
lib/data.ts                    WORKS, workRows, LOGOS, SECTORS, sectorRows, USE_CASES, BIO, SKILLS, COMP_DATA, TOOL_GROUPS, EMAIL, SOCIAL, card, thumb
lib/consent.ts                 readConsent, writeConsent, isLocalHost, start*, startAnalytics, resetConsent
lib/loader.ts                  needsLoader, loaderSeen, markLoaderDone, onLoaderDone, isMobileViewport
lib/motion.ts                  isLight
lib/gsap.ts                    gsap + ScrollTrigger registrado
components/Nav.tsx
components/Loader.tsx
components/ConsentBanner.tsx
components/AnalyticsPageView.tsx
components/ConsentState.tsx
components/Contacto.tsx        compartido por / y /perfil
components/effects/Starfield.tsx, neat.tsx (RollText, Words, Lines, ZoomBox, useSectionReveal, useAfterIntro)
components/home/Home.tsx, Hero.tsx, Trabajo.tsx, CasoModal.tsx, UsoIA.tsx, Logos.tsx, Sectores.tsx
components/perfil/Perfil.tsx, Cabecera.tsx, Quien.tsx, Fuerte.tsx, FormaTrabajo.tsx, Competencias.tsx
public/favicon.svg, public/assets/**, public/effects/{starfield-button,cursor-ring-field}.js
```

---

### Task 1: Scaffold de Next.js y assets

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vercel.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `types/custom-elements.d.ts`
- Modify: `.gitignore`
- Move: `assets/` → `public/assets/`, `favicon.svg` → `public/favicon.svg`, `starfield-button.js` y `cursor-ring-field.js` → `public/effects/`

**Interfaces:**
- Produces: proyecto que compila con `npm run build`; alias `@/*` → raíz; `public/assets/...` servido en `/assets/...`; tipos JSX `starfield-button` y `cursor-ring-field`.

- [ ] **Step 1: package.json**

```json
{
  "name": "proyectos",
  "private": true,
  "version": "2.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Instalar dependencias**

```bash
npm install next@16 react@19 react-dom@19 gsap remixicon
npm install -D typescript @types/node @types/react @types/react-dom vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: next.config.ts y vercel.json**

`next.config.ts`:
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/perfil.html', destination: '/perfil', permanent: true },
      { source: '/privacidad.html', destination: '/privacidad', permanent: true },
    ];
  },
};

export default nextConfig;
```

`vercel.json`:
```json
{ "framework": "nextjs", "buildCommand": "next build" }
```

- [ ] **Step 5: .gitignore**

Sustituir el contenido por:
```
_serve.js
.DS_Store
.vercel/
node_modules/
_og-source.html
.next/
out/
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 6: Mover assets y efectos**

```bash
mkdir -p public/effects
git mv assets public/assets
git mv favicon.svg public/favicon.svg
git mv starfield-button.js public/effects/starfield-button.js
git mv cursor-ring-field.js public/effects/cursor-ring-field.js
```

- [ ] **Step 7: Tipos para los custom elements**

`types/custom-elements.d.ts`:
```ts
import type { CSSProperties } from 'react';

type Attr = string | number | undefined;

interface CustomElementBase {
  style?: CSSProperties;
  className?: string;
}

interface StarfieldButtonAttrs extends CustomElementBase {
  label: string;
  href?: string;
  'new-tab'?: string;
  accent?: string;
  fill?: string;
  'text-color'?: string;
  'border-color'?: string;
  rounded?: Attr;
  padding?: string;
  'font-size'?: Attr;
  'light-size'?: Attr;
  'light-thickness'?: Attr;
  speed?: Attr;
  'pixel-size'?: Attr;
  'pixel-density'?: Attr;
  'glow-size'?: Attr;
}

interface CursorRingFieldAttrs extends CustomElementBase {
  colors?: string;
  background?: string;
  density?: Attr;
  'dot-size'?: Attr;
  speed?: Attr;
  'camera-distance'?: Attr;
  'ring-radius'?: Attr;
  'ring-width'?: Attr;
  push?: Attr;
  turbulence?: Attr;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'starfield-button': StarfieldButtonAttrs;
      'cursor-ring-field': CursorRingFieldAttrs;
    }
  }
}

export {};
```

- [ ] **Step 8: layout, page y css mínimos**

`app/globals.css` (se completa en la Task 4; ahora solo el reset):
```css
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: #1b1e27; color: #ececec; font-family: var(--font-montserrat), system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
a { color: #ececec; text-decoration: none; }
a:hover { color: #8bde5f; }
::selection { background: rgba(139,222,95,0.3); }
.bebas { font-family: var(--font-bebas), Impact, sans-serif; }
```

`app/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { Montserrat, Bebas_Neue } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-montserrat', display: 'swap' });
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://proyectos-theta-hazel.vercel.app'),
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', siteName: 'Víctor Maza', images: [{ url: '/assets/og.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${bebas.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx`:
```tsx
export default function Page() {
  return <main style={{ padding: 40 }}><h1 className="bebas">Víctor Maza</h1></main>;
}
```

- [ ] **Step 9: Build**

Run: `npm run build`
Expected: termina sin errores; en la tabla de rutas aparece `○ /` (estática).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Scaffold de Next.js: config, tipos, assets en public

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Infraestructura de tests, `lib/text.ts` y `lib/data.ts`

**Files:**
- Create: `vitest.config.ts`, `test/setup.ts`, `lib/text.ts`, `lib/text.test.ts`, `lib/data.ts`, `lib/data.test.ts`

**Interfaces:**
- Produces:
  - `splitBold(src: string): { text: string; strong: boolean }[]`
  - `card(name: string): string` → `/assets/h-card/<base>.jpg`; `thumb(name)` → `/assets/h-thumb/<base>.jpg`
  - `WORKS: Work[]`, `workRows(): WorkRow[]`, `LOGOS: Logo[]`, `SECTORS: Sector[]`, `sectorRows(): SectorRow[]`, `USE_CASES: UseCase[]`, `BIO: string[]`, `SKILLS: string[]`, `COMP_DATA: CompGroup[]`, `TOOL_GROUPS`, `EMAIL`, `SOCIAL`, `AYAX_URL`, `FIGMA_URL`
  - Tipos: `Work`, `WorkRow`, `RowAction`, `Logo`, `Sector`, `SectorRow`, `UseCase`, `UseStep`, `CompGroup`, `CompItem`, `Shot`, `StarItem`, `TeamItem`, `Fact`

- [ ] **Step 1: vitest.config.ts y test/setup.ts**

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'https://proyectos-theta-hazel.vercel.app/' } },
    setupFiles: ['./test/setup.ts'],
    css: false,
  },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
```

`test/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
    dispatchEvent() { return false; },
  })) as unknown as typeof window.matchMedia;
}

class FakeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
Object.assign(globalThis, { IntersectionObserver: FakeObserver, ResizeObserver: FakeObserver });

const chain = () => {
  const tl: Record<string, unknown> = {};
  for (const k of ['to', 'from', 'fromTo', 'set', 'add']) tl[k] = () => tl;
  tl.kill = () => {};
  return tl;
};
const fakeGsap = {
  to: vi.fn(), from: vi.fn(), fromTo: vi.fn(), set: vi.fn(), killTweensOf: vi.fn(), registerPlugin: vi.fn(),
  timeline: () => chain(),
  quickTo: () => vi.fn(),
  utils: {
    clamp: (a: number, b: number, v: number) => Math.min(b, Math.max(a, v)),
    mapRange: (a: number, b: number, c: number, d: number, v: number) => c + ((v - a) / (b - a)) * (d - c),
  },
};
vi.mock('gsap', () => ({ gsap: fakeGsap, default: fakeGsap }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { refresh: vi.fn(), create: vi.fn(), getAll: () => [] } }));
```

- [ ] **Step 2: Test de splitBold (falla)**

`lib/text.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { splitBold } from './text';

describe('splitBold', () => {
  it('alterna normal/negrita por asteriscos y descarta vacíos', () => {
    expect(splitBold('a *b* c')).toEqual([
      { text: 'a ', strong: false }, { text: 'b', strong: true }, { text: ' c', strong: false },
    ]);
    expect(splitBold('*solo*')).toEqual([{ text: 'solo', strong: true }]);
    expect(splitBold('plano')).toEqual([{ text: 'plano', strong: false }]);
  });
});
```

Run: `npx vitest run lib/text.test.ts` → Expected: FAIL (módulo no existe).

- [ ] **Step 3: lib/text.ts**

```ts
export interface TextPart { text: string; strong: boolean }

/* Los textos largos marcan la negrita con *asteriscos*, como en perfil.html. */
export function splitBold(src: string): TextPart[] {
  return src.split('*').map((text, i) => ({ text, strong: i % 2 === 1 })).filter((p) => p.text);
}
```

Run: `npx vitest run lib/text.test.ts` → Expected: PASS.

- [ ] **Step 4: Test de data (falla)**

`lib/data.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { card, thumb, WORKS, workRows, sectorRows, LOGOS, USE_CASES, BIO, SKILLS, COMP_DATA, TOOL_GROUPS } from './data';

describe('rutas de imagen', () => {
  it('convierte el nombre a jpg en h-card y h-thumb', () => {
    expect(card('01-datos-del-contacto.png')).toBe('/assets/h-card/01-datos-del-contacto.jpg');
    expect(thumb('assets/hermes/12-editor-variables.png')).toBe('/assets/h-thumb/12-editor-variables.jpg');
  });
});

describe('workRows', () => {
  it('numera los dos casos y añade Ayax y Figma como enlaces externos', () => {
    const rows = workRows();
    expect(WORKS).toHaveLength(2);
    expect(rows).toHaveLength(4);
    expect(rows.map((r) => r.n)).toEqual(['01', '02', '03', '04']);
    expect(rows[0]).toMatchObject({ title: 'Módulo de suscripción de cliente', action: { kind: 'case', index: 0 } });
    expect(rows[2].action).toEqual({ kind: 'url', url: 'https://ayax-summit-olive.vercel.app/' });
    expect(rows[3].kicker).toBe('FIGMA · Archivo de trabajo');
    expect(rows[0].img).toBe('/assets/h-card/01-datos-del-contacto.jpg');
  });
});

describe('sectorRows', () => {
  it('solo pinta la cabecera de grupo en la primera fila de cada grupo', () => {
    expect(sectorRows().map((r) => r.head)).toEqual(['Atrinium', '', '', 'Proyectos anteriores', '']);
  });
  it('el CTA depende de si hay caso o web', () => {
    const rows = sectorRows();
    expect(rows[0]).toMatchObject({ cta: 'Ver el caso ↗', href: '#trabajo', external: false });
    expect(rows[1]).toMatchObject({ cta: 'Ver el producto ↗', href: 'https://flesip.com/', external: true });
    expect(rows[3].cta).toBeNull();
  });
});

describe('contenido', () => {
  it('tiene los volúmenes del original', () => {
    expect(LOGOS).toHaveLength(8);
    expect(USE_CASES).toHaveLength(2);
    expect(USE_CASES[0].steps).toHaveLength(4);
    expect(BIO).toHaveLength(9);
    expect(SKILLS).toHaveLength(16);
    expect(COMP_DATA.map((g) => g.items.length)).toEqual([6, 6, 5, 5]);
    expect(TOOL_GROUPS).toHaveLength(5);
  });
});
```

Run: `npx vitest run lib/data.test.ts` → Expected: FAIL.

- [ ] **Step 5: lib/data.ts**

Copiar los textos **literalmente** desde `index.html` (métodos `workData()`, `sectorData()`, `useData()`; el bloque `stats` no se usa) y `perfil.html` (`bio`, `skills`, `compData`, `toolGroups`). Estructura completa:

```ts
export const EMAIL = 'vctrmz47@gmail.com';
export const SOCIAL = {
  linkedin: 'https://linkedin.com/in/victor-maza47',
  behance: 'https://behance.net/mazdesign',
  instagram: 'https://instagram.com/mazdesign',
};
export const AYAX_URL = 'https://ayax-summit-olive.vercel.app/';
export const FIGMA_URL = 'https://www.figma.com/design/lEPRv8iPrIDwUBKnbWKMdu/Portfolio?node-id=8-136130&t=srL7KcBmRZtEGLME-1';

const CARD = '/assets/h-card/';
const THUMB = '/assets/h-thumb/';
const jpg = (name: string) => name.replace(/^.*\//, '').replace(/\.png$/, '.jpg');
export const card = (name: string) => CARD + jpg(name);
export const thumb = (name: string) => THUMB + jpg(name);

export type Shot = [file: string, caption: string];
export type StarItem = [letter: string, name: string, body: string, label: string];
export type TeamItem = [icon: string, name: string, body: string];
export type Fact = [value: string, label: string];

export interface Work {
  img: string; kicker: string; title: string; lead: string;
  gallery: Shot[]; star: StarItem[]; team: TeamItem[]; skills: string[]; facts: Fact[];
}

export const WORKS: Work[] = [
  {
    img: '01-datos-del-contacto.png',
    kicker: 'HERMES ADMIN · SaaS multi-tenant',
    title: 'Módulo de suscripción de cliente',
    lead: 'Tres meses de proceso manual en Excel, convertidos en un módulo en producción en cinco semanas.',
    gallery: [ /* las 6 parejas [fichero, pie] de index.html líneas 487-494 */ ],
    star: [ /* las 4 entradas S/T/A/R con sus 4 campos, líneas 495-500 */ ],
    team: [ /* las 6 entradas [icono, nombre, cuerpo], líneas 501-508 */ ],
    skills: [ /* 11, línea 509 */ ],
    facts: [['5', 'semanas a producción'], ['267 → 24', 'tokens de color'], ['3', 'fases · 6 roles']],
  },
  {
    img: '12-editor-variables.png',
    kicker: 'HERMES ADMIN · Suscripción · Fase 2',
    title: 'Preparar la demo con el cliente',
    lead: 'La fase en que se arma la propuesta con el cliente: documento, variables y comentarios en un sitio.',
    gallery: [['12-editor-variables.png', 'Editor con variables'], ['14-document-model.png', 'Modelo del documento'], ['13-historial-comentarios.png', 'Historial de comentarios'], ['04-detalle-documento.png', 'Detalle del documento']],
    star: [ /* 4, líneas 518-523 */ ], team: [ /* 6, líneas 524-531 */ ], skills: [ /* 8, línea 532 */ ],
    facts: [['0', 'texto libre sin control'], ['2', 'áreas co-diseñando'], ['100%', 'campos trazables']],
  },
];

export type RowAction = { kind: 'case'; index: number } | { kind: 'url'; url: string };
export interface WorkRow { n: string; img: string; kicker: string; title: string; desc: string; action: RowAction }

export function workRows(): WorkRow[] {
  const rows: WorkRow[] = WORKS.map((w, i) => ({
    n: String(i + 1).padStart(2, '0'), img: card(w.img), kicker: w.kicker, title: w.title, desc: w.lead,
    action: { kind: 'case', index: i },
  }));
  rows.push({
    n: String(rows.length + 1).padStart(2, '0'), img: card('08-planes-servicios.png'),
    kicker: 'AYAX · Web en producción', title: 'Prototipo landing page',
    desc: 'Diseño y dirección de la implementación con IA, desplegado y en línea.',
    action: { kind: 'url', url: AYAX_URL },
  });
  rows.push({
    n: String(rows.length + 1).padStart(2, '0'), img: card('14-document-model.png'),
    kicker: 'FIGMA · Archivo de trabajo', title: 'Ver el proyecto en Figma',
    desc: 'Los frames, los estados y las alternativas descartadas, tal como quedaron en el archivo.',
    action: { kind: 'url', url: FIGMA_URL },
  });
  return rows;
}

/* `size: 'full'` = los que venían de image-slot (ocupan la celda entera);
   `size: 'small'` = los ficheros sueltos (max 78% / 52px). */
export interface Logo { id: string; name: string; src: string; size: 'full' | 'small'; href?: string }
export const LOGOS: Logo[] = [
  { id: 'hermes', name: 'HERMES · Atrinium', src: '/assets/logos/hermes.webp', size: 'full', href: 'https://atrinium.com/' },
  { id: 'wakari', name: 'Wakari Solutions', src: '/assets/logos/wakari.webp', size: 'small', href: 'https://wakarisolutions.com/' },
  { id: 'linikit', name: 'Linikit', src: '/assets/logos/linikit.png', size: 'small', href: 'https://linikit.com/' },
  { id: 'mercantil', name: 'Mercantil Panamá', src: '/assets/logos/mercantil.webp', size: 'full' },
  { id: 'mony', name: 'Mony', src: '/assets/logos/mony.webp', size: 'full' },
  { id: 'flesip', name: 'Flesip', src: '/assets/logos/flesip.webp', size: 'full', href: 'https://flesip.com/' },
  { id: 'montsaint', name: 'Montsaint', src: '/assets/logos/montsaint.webp', size: 'full', href: 'https://montsaint.es/' },
  { id: 'ayax', name: 'Ayax', src: '/assets/logos/ayax.webp', size: 'full', href: 'https://www.ayaxsuscripcion.com/es/home' },
];

export interface Sector { group: string; n: string; color: string; name: string; years: string; body: string; caseIdx?: number; site?: string }
export const SECTORS: Sector[] = [ /* las 5 entradas de sectorData(), índice líneas 631-637 */ ];

export interface SectorRow extends Sector { head: string; cta: string | null; href: string; external: boolean }
export function sectorRows(): SectorRow[] {
  let last: string | null = null;
  return SECTORS.map((s) => {
    const head = s.group !== last ? s.group : '';
    last = s.group;
    const hasCase = typeof s.caseIdx === 'number';
    const linked = hasCase || !!s.site;
    return {
      ...s, head,
      cta: linked ? (hasCase ? 'Ver el caso ↗' : 'Ver el producto ↗') : null,
      href: hasCase ? '#trabajo' : s.site || '',
      external: !hasCase && !!s.site,
    };
  });
}

export interface UseStep { name: string; lead: string; points: string[] }
export interface UseCase { tab: string; kicker: string; title: string; role: string; context: string; period: string; pitch: string; metrics: { v: string; k: string }[]; learning: string; steps: UseStep[] }
export const USE_CASES: UseCase[] = [ /* las 2 entradas de useData(), índice líneas 753-806 */ ];

export const BIO: string[] = [ /* los 9 párrafos con *asteriscos*, perfil líneas 335-345 */ ];
export const SKILLS: string[] = [ /* 16, perfil líneas 347-364 */ ];
export type CompItem = [lead: string, rest: string];
export interface CompGroup { name: string; items: CompItem[] }
export const COMP_DATA: CompGroup[] = [ /* 4 grupos (6, 6, 5, 5), perfil líneas 365-398, como { name, items } */ ];
export const TOOL_GROUPS: { name: string; items: string[] }[] = [ /* 5 grupos, perfil líneas 462-468 */ ];
```

Run: `npx vitest run` → Expected: PASS (text y data).

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts test lib
git commit -m "Datos y textos del portfolio en lib/data.ts, con tests

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---
### Task 3: `lib/consent.ts` — analítica detrás del consentimiento

**Files:**
- Create: `lib/consent.ts`, `lib/consent.test.ts`

**Interfaces:**
- Produces:
  - `type Consent = 'granted' | 'denied' | null`
  - `readConsent(): Consent`, `writeConsent(v: 'granted' | 'denied'): void`
  - `isLocalHost(hostname: string): boolean`
  - `startGA()`, `startClarity()`, `startHotjar()`, `startPlerdy()`, `startHubSpot()`, `startAnalytics()`
  - `resetConsent(): void` (borra la clave y recarga)
  - `installConsentGlobals(): void` (expone `window.vmConsentReset`)
  - Constantes `CONSENT_KEY`, `GA_ID`

- [ ] **Step 1: Tests (fallan)**

`lib/consent.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { isLocalHost, readConsent, writeConsent, startGA, startHubSpot, startHotjar, startClarity, startPlerdy, startAnalytics, CONSENT_KEY } from './consent';

beforeEach(() => { document.head.innerHTML = ''; });

describe('isLocalHost', () => {
  it('reconoce local y privadas', () => {
    for (const h of ['', 'localhost', '127.0.0.1', '::1', '[::1]', 'dev.local', '127.5.5.5', '10.0.0.2', '192.168.1.4', '172.16.0.1', '172.31.9.9']) {
      expect(isLocalHost(h), h).toBe(true);
    }
  });
  it('no confunde dominios públicos', () => {
    for (const h of ['proyectos-theta-hazel.vercel.app', '172.32.0.1', '11.0.0.1', 'localhost.com']) {
      expect(isLocalHost(h), h).toBe(false);
    }
  });
});

describe('lectura y escritura', () => {
  it('guarda la decisión en localStorage', () => {
    expect(readConsent()).toBeNull();
    writeConsent('granted');
    expect(localStorage.getItem(CONSENT_KEY)).toBe('granted');
    expect(readConsent()).toBe('granted');
  });
});

describe('arranque de servicios', () => {
  it('GA crea la cola antes del script y no duplica', () => {
    startGA();
    startGA();
    const w = window as unknown as { dataLayer: unknown[]; gtag: unknown };
    expect(w.dataLayer).toHaveLength(2);
    expect(typeof w.gtag).toBe('function');
    const s = document.querySelectorAll('#ga-gtag-loader');
    expect(s).toHaveLength(1);
    expect(s[0].getAttribute('src')).toBe('https://www.googletagmanager.com/gtag/js?id=G-HZYDMMSVG5');
  });
  it('HubSpot usa el loader de la región EU', () => {
    startHubSpot();
    expect(document.getElementById('hs-script-loader')?.getAttribute('src')).toBe('https://js-eu1.hs-scripts.com/148496979.js');
  });
  it('Hotjar define settings e inyecta el script (host público)', () => {
    startHotjar();
    expect((window as unknown as { _hjSettings: unknown })._hjSettings).toEqual({ hjid: 6776849, hjsv: 6 });
    expect(document.getElementById('hj-loader')?.getAttribute('src')).toBe('https://static.hotjar.com/c/hotjar-6776849.js?sv=6');
  });
  it('Clarity se importa como módulo con el id del proyecto', () => {
    startClarity();
    const s = document.getElementById('clarity-loader');
    expect(s?.getAttribute('type')).toBe('module');
    expect(s?.textContent).toContain('@microsoft/clarity@1.0.2');
    expect(s?.textContent).toContain("init('yd4g6685po')");
  });
  it('Plerdy define las globales e inyecta el script una vez', () => {
    startPlerdy();
    startPlerdy();
    const w = window as unknown as { _site_hash_code: string; _suid: number };
    expect(w._site_hash_code).toBe('81690a1951e6290b7119405fec614b5d');
    expect(w._suid).toBe(81035);
    expect(document.querySelectorAll('#plerdy-loader')).toHaveLength(1);
    expect(document.getElementById('plerdy-loader')?.getAttribute('src')).toMatch(/^https:\/\/a\.plerdy\.com\/public\/js\/click\/main\.js\?v=/);
  });
  it('startAnalytics arranca los cinco', () => {
    startAnalytics();
    for (const id of ['ga-gtag-loader', 'clarity-loader', 'hj-loader', 'plerdy-loader', 'hs-script-loader']) {
      expect(document.getElementById(id), id).not.toBeNull();
    }
  });
});
```

Run: `npx vitest run lib/consent.test.ts` → Expected: FAIL.

- [ ] **Step 2: lib/consent.ts**

```ts
/*
 * Arranque condicional de la analítica. Cinco servicios, los cinco detrás del
 * mismo consentimiento: GA4, Microsoft Clarity, Hotjar, Plerdy y HubSpot.
 * Todos identifican al visitante, así que no se cargan hasta que acepta. Si
 * rechaza no se pide ni un solo recurso a googletagmanager.com, clarity.ms,
 * hotjar.com, plerdy.com ni hs-scripts.com. Traducción de consent.js.
 */
export const CONSENT_KEY = 'vm-consent';
export type Consent = 'granted' | 'denied' | null;

export const GA_ID = 'G-HZYDMMSVG5';
const GA_SRC = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
const GA_TAG = 'ga-gtag-loader';
const CLARITY_PROJECT = 'yd4g6685po';
const CLARITY_PKG = 'https://cdn.jsdelivr.net/npm/@microsoft/clarity@1.0.2/index.js';
const CLARITY_TAG = 'clarity-loader';
const HS_PORTAL = '148496979';
const HS_SRC = 'https://js-eu1.hs-scripts.com/' + HS_PORTAL + '.js'; // cuenta europea: js-eu1, no js
const HS_TAG = 'hs-script-loader';
const HJ_ID = 6776849;
const HJ_SV = 6;
const HJ_SRC = 'https://static.hotjar.com/c/hotjar-' + HJ_ID + '.js?sv=' + HJ_SV;
const HJ_TAG = 'hj-loader';
const PLERDY_HASH = '81690a1951e6290b7119405fec614b5d';
const PLERDY_SUID = 81035;
const PLERDY_SRC = 'https://a.plerdy.com/public/js/click/main.js';
const PLERDY_TAG = 'plerdy-loader';

type W = Window & Record<string, unknown>;
const w = () => window as unknown as W;

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch { return null; }
}

export function writeConsent(v: 'granted' | 'denied') {
  try { localStorage.setItem(CONSENT_KEY, v); } catch {}
}

/* Clarity, Hotjar y Plerdy no arrancan en local: cada sesión de desarrollo
   entraría en el proyecto como tráfico real. */
export function isLocalHost(h: string): boolean {
  return h === '' || h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '[::1]' ||
    /\.local$/.test(h) || /^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2[0-9]|3[01])\./.test(h);
}

function inject(id: string, src: string, extra?: (s: HTMLScriptElement) => void) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  s.src = src;
  if (extra) extra(s);
  document.head.appendChild(s);
}

export function startGA() {
  if (document.getElementById(GA_TAG)) return;
  // La cola se crea antes de cargar gtag.js: lo que se encole ahora se procesa
  // en cuanto llegue. Tiene que empujar `arguments` tal cual.
  const win = w();
  const dl = (win.dataLayer as unknown[] | undefined) || [];
  win.dataLayer = dl;
  function gtag() { dl.push(arguments); }
  win.gtag = gtag;
  (gtag as unknown as (...a: unknown[]) => void)('js', new Date());
  (gtag as unknown as (...a: unknown[]) => void)('config', GA_ID);
  inject(GA_TAG, GA_SRC);
}

export function startClarity() {
  if (isLocalHost(location.hostname) || document.getElementById(CLARITY_TAG)) return;
  // Módulo inline en vez de import() dinámico: así el bundler no intenta
  // resolver la URL del CDN en build.
  const s = document.createElement('script');
  s.id = CLARITY_TAG;
  s.type = 'module';
  s.textContent = "import('" + CLARITY_PKG + "').then(m => m.default.init('" + CLARITY_PROJECT + "')).catch(() => {});";
  document.head.appendChild(s);
}

export function startHotjar() {
  if (isLocalHost(location.hostname)) return;
  const win = w();
  if (!win.hj) {
    const hj = function (...args: unknown[]) {
      const q = (hj as unknown as { q?: unknown[] });
      (q.q = q.q || []).push(args);
    };
    win.hj = hj;
  }
  win._hjSettings = { hjid: HJ_ID, hjsv: HJ_SV };
  inject(HJ_TAG, HJ_SRC);
}

/* Snippet oficial de Plerdy: las globales de configuración se definen siempre;
   la petición a plerdy.com, solo con permiso y fuera de local. */
export function startPlerdy() {
  const win = w();
  win._protocol = location.protocol === 'https:' ? 'https://' : 'http://';
  win._site_hash_code = PLERDY_HASH;
  win._suid = PLERDY_SUID;
  if (isLocalHost(location.hostname)) return;
  inject(PLERDY_TAG, PLERDY_SRC + '?v=' + Math.random(), (s) => { s.referrerPolicy = 'strict-origin-when-cross-origin'; });
}

export function startHubSpot() {
  inject(HS_TAG, HS_SRC, (s) => { s.defer = true; });
}

export function startAnalytics() {
  startGA();
  startClarity();
  startHotjar();
  startPlerdy();
  startHubSpot();
}

/* Retirar el consentimiento tiene que costar lo mismo que darlo. */
export function resetConsent() {
  try { localStorage.removeItem(CONSENT_KEY); } catch {}
  location.reload();
}

export function installConsentGlobals() {
  w().vmConsentReset = resetConsent;
}
```

Run: `npx vitest run lib/consent.test.ts` → Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib/consent.ts lib/consent.test.ts
git commit -m "Consentimiento y arranque de analitica en lib/consent.ts

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: `lib/loader.ts`, `lib/motion.ts`, `lib/gsap.ts`

**Files:**
- Create: `lib/loader.ts`, `lib/loader.test.ts`, `lib/motion.ts`, `lib/gsap.ts`

**Interfaces:**
- Produces:
  - `LOADER_KEY = 'vm-loader'`, `LOADER_EVENT = 'vm-loader-done'`, `MOBILE_QUERY = '(max-width: 820px)'`
  - `loaderSeen(): boolean`, `isMobileViewport(): boolean`, `needsLoader(): boolean`
  - `markLoaderDone(): void` (marca sessionStorage y emite el evento), `onLoaderDone(cb: () => void): () => void`
  - `isLight(): boolean` (móvil o prefers-reduced-motion)
  - `gsap`, `ScrollTrigger` desde `@/lib/gsap` con el plugin registrado

- [ ] **Step 1: Test (falla)**

`lib/loader.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest';
import { loaderSeen, needsLoader, markLoaderDone, onLoaderDone, LOADER_KEY } from './loader';

describe('loader', () => {
  it('hace falta en la primera visita de escritorio', () => {
    expect(loaderSeen()).toBe(false);
    expect(needsLoader()).toBe(true);
  });
  it('no hace falta si ya se vio en la sesión', () => {
    sessionStorage.setItem(LOADER_KEY, '1');
    expect(needsLoader()).toBe(false);
  });
  it('no hace falta en móvil', () => {
    const mm = vi.spyOn(window, 'matchMedia').mockImplementation((q) => ({ matches: q === '(max-width: 820px)', media: q } as MediaQueryList));
    expect(needsLoader()).toBe(false);
    mm.mockRestore();
  });
  it('markLoaderDone guarda la marca y avisa a los suscriptores', () => {
    const cb = vi.fn();
    const off = onLoaderDone(cb);
    markLoaderDone();
    expect(sessionStorage.getItem(LOADER_KEY)).toBe('1');
    expect(cb).toHaveBeenCalledTimes(1);
    off();
    markLoaderDone();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
```

Run: `npx vitest run lib/loader.test.ts` → Expected: FAIL.

- [ ] **Step 2: lib/loader.ts, lib/motion.ts, lib/gsap.ts**

`lib/loader.ts`:
```ts
export const LOADER_KEY = 'vm-loader';
export const LOADER_EVENT = 'vm-loader-done';
export const MOBILE_QUERY = '(max-width: 820px)';

export function loaderSeen(): boolean {
  try { return sessionStorage.getItem(LOADER_KEY) === '1'; } catch { return false; }
}

export function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(MOBILE_QUERY).matches;
}

export function needsLoader(): boolean {
  return !loaderSeen() && !isMobileViewport();
}

export function markLoaderDone() {
  try { sessionStorage.setItem(LOADER_KEY, '1'); } catch {}
  window.dispatchEvent(new Event(LOADER_EVENT));
}

export function onLoaderDone(cb: () => void): () => void {
  window.addEventListener(LOADER_EVENT, cb);
  return () => window.removeEventListener(LOADER_EVENT, cb);
}
```

`lib/motion.ts`:
```ts
import { isMobileViewport } from './loader';

/* `light` corta todo lo que cuesta caro: móvil o prefers-reduced-motion. */
export function isLight(): boolean {
  if (typeof window === 'undefined') return true;
  return isMobileViewport() || (!!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
```

`lib/gsap.ts`:
```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
```

Run: `npx vitest run` → Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add lib
git commit -m "Estado del loader, modo light y registro de GSAP

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---
### Task 5: CSS global, layout con Nav, transición y efectos base

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`
- Create: `app/template.tsx`, `components/Nav.tsx`, `components/Nav.test.tsx`, `components/effects/Starfield.tsx`, `components/effects/neat.tsx`, `components/effects/neat.test.tsx`
- Create temporal: `app/perfil/page.tsx` y `app/privacidad/page.tsx` con un `<h1>` (se sustituyen en Tasks 10 y 11)

**Interfaces:**
- Produces:
  - `<Starfield label href? newTab? fill? rounded? padding? fontSize? lightSize? pixelDensity? glowSize? speed? />`
  - `<RollText>texto</RollText>` (dentro de un `<a>`; el hover del enlace desplaza el texto)
  - `<Words className? style?>children</Words>` (h2; titular palabra a palabra al entrar en pantalla)
  - `<Lines lines={string[]} className? style? />` (h1 línea a línea con máscara)
  - `<ZoomBox className? style?><img/></ZoomBox>`
  - `useSectionReveal(ready: boolean)` (entrada escalonada por sección `[data-screen-label]`)
  - `useAfterIntro(cb: () => void)` (ejecuta cuando el loader termina, o de inmediato si no hace falta)
  - Clases CSS del Step 1, usadas por el resto de tareas.

- [ ] **Step 1: app/globals.css completo**

Sustituir el fichero por:

```css
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: #1b1e27; color: #ececec; font-family: var(--font-montserrat), system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
a { color: #ececec; text-decoration: none; }
a:hover { color: #8bde5f; }
::selection { background: rgba(139,222,95,0.3); }
.bebas { font-family: var(--font-bebas), Impact, sans-serif; }

/* Página: raíz y transición de entrada */
.page { position: relative; width: 100%; background: #1b1e27; overflow-x: clip; }
@keyframes pageIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.page-enter { animation: pageIn 0.35s ease-out both; }
@media (prefers-reduced-motion: reduce) { .page-enter { animation: none; } }

@keyframes scrollDown { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
@keyframes roleFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* Nav (de privacidad.html) */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; display: flex; justify-content: center; padding: clamp(12px, 2vw, 24px) 16px; pointer-events: none; }
.nav-pill { pointer-events: auto; display: inline-flex; align-items: center; gap: 2px; flex-wrap: wrap; justify-content: center; border-radius: 999px; border: 1px solid rgba(236,236,236,0.09); background: rgba(35,39,51,0.72); backdrop-filter: blur(14px); padding: 6px; box-shadow: 0 8px 30px rgba(0,0,0,0.35); }
.nav-logo { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 999px; background: linear-gradient(120deg, #8bde5f, #4a44f2); flex-shrink: 0; }
.nav-logo span { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 999px; background: #1b1e27; font-weight: 500; font-size: 12px; letter-spacing: 0.04em; line-height: 1; color: #ececec; }
.nav-sep { width: 1px; height: 20px; background: #2c3140; margin: 0 4px; }
.nav-link { border-radius: 999px; padding: 8px 15px; font-size: 13px; color: #878787; transition: color .2s ease, background .2s ease; }
.nav-link:hover, .nav-link.is-active { color: #ececec; background: rgba(44,49,64,0.6); }

/* Roll: dos copias apiladas, al pasar el cursor el par sube medio bloque */
.roll { display: inline-block; overflow: hidden; vertical-align: bottom; }
.roll-inner { display: block; will-change: transform; transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1); }
.roll-inner > span { display: block; }
a:hover .roll-inner, a:focus-visible .roll-inner { transform: translateY(-50%); }

/* Enlaces y botones con hover (antes style-hover) */
.btn-ghost { border-radius: 999px; padding: 14px 28px; font-size: 14px; font-weight: 600; color: #ececec; border: 1px solid #343a4a; background: transparent; transition: border-color .25s ease; }
.btn-ghost:hover { border-color: #8bde5f; color: #ececec; }
.social-circle { display: inline-flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: 999px; border: 1px solid #2f2f2f; color: #e2e4ea; background: rgba(35,39,51,0.62); transition: border-color .25s ease, color .25s ease; }
.social-circle:hover { border-color: #8bde5f; color: #ececec; }
.social-pill { display: flex; align-items: center; gap: 10px; border: 1px solid #2c3140; border-radius: 999px; padding: 10px 16px; font-size: 13px; color: #c9c9c9; transition: border-color .25s ease, color .25s ease; }
.social-pill:hover { border-color: #8bde5f; color: #ececec; }
.link-muted { color: #949494; transition: color .2s ease; }
.link-muted:hover { color: #8bde5f; }
.link-dim { font-size: 13px; letter-spacing: 0.04em; color: #878787; transition: color .2s ease; }
.link-dim:hover { color: #8bde5f; }
.strip-link { color: #d6e2ff; text-decoration: underline; text-underline-offset: 3px; }
.strip-link:hover { color: #ffffff; }
.cue-link { display: inline-flex; align-items: center; gap: 10px; margin-top: clamp(40px, 6vw, 72px); font-size: 10.5px; letter-spacing: 0.3em; text-transform: uppercase; color: #878787; transition: color .2s ease; }
.cue-link:hover { color: #8bde5f; }

/* Trabajo */
.work-row { display: grid; grid-template-columns: 48px minmax(0, 1fr) auto; gap: 24px; align-items: start; border-bottom: 1px solid #2c3140; padding: clamp(20px, 2.6vw, 34px) clamp(8px, 1.4vw, 20px); cursor: pointer; transition: background 0.3s ease; }
.work-row:hover { background: rgba(35,39,51,0.5); }
.work-peek { position: fixed; top: 0; left: 0; z-index: 40; width: clamp(220px, 24vw, 340px); aspect-ratio: 4 / 3; border: 1px solid #343a4a; border-radius: 24px; overflow: hidden; background: #232733; opacity: 0; pointer-events: none; will-change: transform; }
@media (max-width: 820px) {
  .work-row { grid-template-columns: 28px minmax(0, 1fr); gap: 12px; }
  .work-peek { display: none; }
}

/* Casos de uso */
.use-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: clamp(28px, 3.6vw, 56px); margin-top: clamp(32px, 4vw, 52px); }
.pill-tab { cursor: pointer; border-radius: 999px; padding: 9px 17px; font-size: 13px; white-space: nowrap; border: 1px solid #262626; color: #949494; background: transparent; transition: border-color .25s ease, color .25s ease, background .25s ease; }
.pill-tab.is-active { border-color: #8bde5f; color: #ececec; background: rgba(139,222,95,0.14); }
.step-card { cursor: pointer; border: 1px solid #2c3140; border-radius: 24px; padding: 18px 20px; background: rgba(35,39,51,0.4); transition: border-color 0.25s ease, background 0.25s ease; }
.step-card.is-open { border-color: #2f2f2f; background: rgba(35,39,51,0.72); }
.step-body { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.4s ease, opacity 0.3s ease; }
.step-card.is-open .step-body { max-height: 520px; opacity: 1; }
@media (max-width: 820px) { .use-grid { grid-template-columns: minmax(0, 1fr); } }

/* Logos */
.logo-cell { height: 96px; display: flex; align-items: center; justify-content: center; overflow: hidden; opacity: 0.42; filter: grayscale(1); transition: opacity 0.3s ease, filter 0.3s ease; }
.logo-cell:hover { opacity: 1; filter: grayscale(0); }

/* Sectores */
.sector-head { margin: 22px 0 4px; font-size: 10.5px; letter-spacing: 0.3em; text-transform: uppercase; color: #6d6d6d; }
.sector-row { display: grid; grid-template-columns: 56px minmax(0, 1fr) auto; gap: clamp(16px, 2.4vw, 32px); align-items: center; border: 1px solid #2c3140; border-radius: 40px; padding: clamp(16px, 2vw, 22px) clamp(20px, 2.4vw, 30px); background: rgba(35,39,51,0.4); }
.sector-year { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #6d6d6d; white-space: nowrap; }
.sector-cta { display: inline-flex; align-items: center; gap: 6px; margin: 14px 0 0; border: 1px solid #343a4a; border-radius: 999px; padding: 7px 15px; font-size: 12.5px; color: #c9c9c9; text-decoration: none; transition: border-color 0.25s ease, color 0.25s ease; }
.sector-cta:hover { border-color: #8bde5f; color: #ececec; }
@media (max-width: 820px) {
  .sector-head { margin: 14px 0 2px; }
  .sector-row { grid-template-columns: 44px minmax(0, 1fr); gap: 14px; align-items: start; border-radius: 24px; padding: 16px 18px; }
  .sector-year { grid-column: 2; white-space: normal; }
}

/* Contacto */
.foot-grid { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, auto) minmax(0, 0.7fr); gap: clamp(24px, 3.4vw, 56px); align-items: center; }
.foot-links { display: flex; flex-direction: column; gap: 8px; font-size: 14px; align-items: flex-end; }
@media (max-width: 820px) {
  .foot-grid { grid-template-columns: minmax(0, 1fr); }
  .foot-links { align-items: flex-start; }
}

/* Modal de caso */
.box { position: fixed; inset: 0; z-index: 90; display: flex; align-items: center; justify-content: center; padding: clamp(16px, 4vw, 48px); transition: opacity 0.3s ease; }
.box-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(22px, 3vw, 44px); padding: 20px clamp(20px, 2.6vw, 34px) clamp(24px, 3vw, 40px); align-items: start; }
.box-close { cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 999px; border: 1px solid #262626; color: #c9c9c9; flex-shrink: 0; transition: border-color .25s ease, color .25s ease; }
.box-close:hover { border-color: #8bde5f; color: #ececec; }
.box-next { display: inline-flex; flex-direction: column; gap: 4px; border: 1px solid #343a4a; border-radius: 20px; padding: 12px 20px; text-decoration: none; transition: border-color 0.25s ease; }
.box-next:hover { border-color: #8bde5f; }
.box-contact { display: inline-flex; align-items: center; border: 1px solid #8bde5f; border-radius: 999px; padding: 12px 24px; font-size: 14px; color: #ececec; text-decoration: none; background: rgba(139,222,95,0.08); transition: background 0.25s ease; }
.box-contact:hover { background: rgba(139,222,95,0.16); color: #ececec; }
@media (min-width: 821px) { .box-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); } }

/* Perfil */
.who-grid { width: 100%; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: minmax(200px, 260px) minmax(0, 1fr); gap: clamp(28px, 4vw, 64px); align-items: start; }
.skill-card { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 12px; border: 1px solid #2c3140; border-radius: 18px; padding: 20px; background: rgba(35,39,51,0.45); transition: border-color .25s ease, background .25s ease; }
.skill-card:hover { border-color: #343a4a; background: #232733; }
.comp-slot { position: relative; padding-top: 26px; }
.comp-card { position: sticky; top: calc(88px + var(--i) * 22px); border: 1px solid #262626; border-radius: 24px; padding: clamp(22px, 2.6vw, 34px); background: #121212; box-shadow: 0 -18px 40px rgba(21,24,31,0.5); transform-origin: center top; will-change: transform; }
.comp-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: clamp(14px, 1.8vw, 22px); overflow: hidden; max-height: 1400px; opacity: 1; margin-top: clamp(18px, 2.2vw, 26px); transition: max-height 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, margin-top 0.4s ease; }
.comp-list.is-shut { max-height: 0; opacity: 0; margin-top: 0; }
@media (max-width: 820px) {
  .who-grid { grid-template-columns: minmax(0, 1fr); }
  .comp-slot { padding-top: 18px; }
  .comp-card { position: relative; top: 0; }
  .comp-list { grid-template-columns: minmax(0, 1fr); }
}

/* Banner de consentimiento (de consent.js) */
.consent { position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 99999; max-width: 620px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 14px; padding: 16px 18px; background: rgba(27,30,39,0.94); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); border: 1px solid #343a4a; border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.45); opacity: 0; transform: translateY(12px); transition: opacity .35s ease, transform .35s ease; }
.consent.is-in { opacity: 1; transform: translateY(0); }
.consent p { margin: 0; flex: 1 1 260px; font-size: 13px; line-height: 1.5; color: #b4b4b4; }
.consent p a { color: #ececec; text-decoration: underline; text-underline-offset: 3px; white-space: nowrap; }
.consent-actions { display: flex; gap: 8px; flex: 0 0 auto; }
.consent-btn { font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; padding: 10px 18px; border-radius: 999px; transition: filter .2s ease, border-color .2s ease; border: 1px solid #343a4a; background: transparent; color: #ececec; }
.consent-btn:hover { border-color: #8bde5f; }
.consent-btn.is-primary { border-color: #8bde5f; background: #8bde5f; color: #12151c; }
.consent-btn.is-primary:hover { filter: brightness(1.08); }

/* Privacidad (de privacidad.html, con ámbito .legal) */
.legal main { max-width: 820px; margin: 0 auto; padding: clamp(130px, 16vh, 190px) clamp(20px, 4vw, 64px) clamp(56px, 7vw, 96px); }
.legal .kicker { display: flex; align-items: center; gap: 12px; margin: 0 0 20px; }
.legal .kicker::before { content: ""; width: 32px; height: 1px; background: #343a4a; }
.legal .kicker span { font-size: 10.5px; letter-spacing: 0.3em; text-transform: uppercase; color: #878787; }
.legal h1 { margin: 0 0 18px; font-family: var(--font-bebas), Impact, sans-serif; font-weight: 400; font-size: clamp(44px, 7vw, 84px); line-height: 0.95; letter-spacing: 0.01em; }
.legal .lead { margin: 0 0 clamp(36px, 5vw, 56px); max-width: 620px; font-size: clamp(15px, 1.3vw, 18px); line-height: 1.65; color: #c9c9c9; text-wrap: pretty; }
.legal .updated { font-size: 12px; letter-spacing: 0.1em; color: #6d6d6d; margin: 0 0 8px; }
.legal section { border-top: 1px solid #2c3140; padding: clamp(28px, 3.4vw, 40px) 0; }
.legal h2 { margin: 0 0 16px; font-size: clamp(22px, 2.6vw, 30px); font-weight: 400; letter-spacing: -0.02em; }
.legal h2 b { font-family: var(--font-bebas), Impact, sans-serif; font-weight: 400; letter-spacing: 0.01em; }
.legal p, .legal li { font-size: 14.5px; line-height: 1.7; color: #b4b4b4; text-wrap: pretty; }
.legal p strong, .legal li strong { color: #ececec; font-weight: 500; }
.legal ul { margin: 0; padding-left: 20px; }
.legal li { margin: 6px 0; }
.legal code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12.5px; color: #d6d6d6; background: rgba(139,222,95,0.07); border: 1px solid #262626; border-radius: 6px; padding: 1px 6px; }
.legal .tools { display: grid; gap: 14px; margin-top: 18px; }
.legal .tool { border: 1px solid #2c3140; border-radius: 20px; padding: 18px 20px; background: rgba(35,39,51,0.4); }
.legal .tool h3 { margin: 0 0 6px; font-size: 16px; font-weight: 500; color: #ececec; }
.legal .tool p { margin: 0; font-size: 13.5px; }
.legal .tool .who { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #6d6d6d; margin-bottom: 8px; display: block; }
.legal .table-wrap { overflow-x: auto; margin-top: 18px; border: 1px solid #2c3140; border-radius: 16px; }
.legal table { width: 100%; border-collapse: collapse; font-size: 13px; }
.legal th, .legal td { text-align: left; padding: 11px 14px; border-bottom: 1px solid #2c3140; vertical-align: top; }
.legal th { font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase; color: #878787; font-weight: 500; background: rgba(35,39,51,0.4); }
.legal td { color: #b4b4b4; }
.legal td:first-child { color: #ececec; white-space: nowrap; }
.legal tr:last-child td { border-bottom: 0; }
.legal .cookie-box { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-top: 18px; border: 1px solid #343a4a; border-radius: 20px; padding: 18px 22px; background: rgba(35,39,51,0.4); }
.legal .cookie-box p { margin: 0; }
.legal .state { color: #ececec; font-weight: 500; }
.legal .btn { font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; padding: 11px 20px; border-radius: 999px; border: 1px solid #8bde5f; background: transparent; color: #ececec; transition: background .2s ease; }
.legal .btn:hover { background: rgba(139,222,95,0.14); }
.legal footer { margin-top: clamp(36px, 4.6vw, 64px); padding: 14px clamp(20px, 6vw, 100px); background: #3a34e8; }
.legal footer div { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; font-size: 12.5px; color: #d6e2ff; }
.legal footer a { color: #d6e2ff; }
.legal footer a:hover { color: #ffffff; }
```

- [ ] **Step 2: Starfield.tsx**

`components/effects/Starfield.tsx`:
```tsx
'use client';

interface Props {
  label: string;
  href?: string;
  newTab?: boolean;
  fill?: string;
  rounded?: number;
  padding?: string;
  fontSize?: number;
  lightSize?: number;
  pixelDensity?: number;
  glowSize?: number;
  speed?: number;
}

/* Envoltorio del custom element de public/effects/starfield-button.js. Los
   atributos comunes a todos los usos del sitio van fijos. */
export default function Starfield({
  label, href, newTab, fill = 'rgba(35,39,51,0.6)', rounded, padding = '14px 28px',
  fontSize = 14, lightSize = 92, pixelDensity = 48, glowSize = 16, speed = 55,
}: Props) {
  return (
    <starfield-button
      label={label}
      href={href}
      new-tab={newTab ? '1' : undefined}
      accent="#8bde5f"
      fill={fill}
      text-color="#ececec"
      border-color="#343a4a"
      rounded={rounded}
      padding={padding}
      font-size={fontSize}
      light-size={lightSize}
      light-thickness={2}
      speed={speed}
      pixel-size={4}
      pixel-density={pixelDensity}
      glow-size={glowSize}
    />
  );
}
```

- [ ] **Step 3: Test de neat (falla)**

`components/effects/neat.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RollText, Words, Lines } from './neat';

describe('RollText', () => {
  it('apila dos copias del texto', () => {
    const { container } = render(<a href="#x"><RollText>Inicio</RollText></a>);
    const copies = container.querySelectorAll('.roll-inner > span');
    expect(copies).toHaveLength(2);
    expect(copies[0]).toHaveTextContent('Inicio');
    expect(copies[1]).toHaveTextContent('Inicio');
  });
});

describe('Words', () => {
  it('parte solo los nodos de texto y conserva los hijos con marcado', () => {
    const { container } = render(<Words>Producto <span className="bebas">en producción</span></Words>);
    const words = container.querySelectorAll('.w');
    expect(words).toHaveLength(2);
    expect(words[0]).toHaveTextContent('Producto');
    expect(words[1].querySelector('.bebas')).toHaveTextContent('en producción');
  });
});

describe('Lines', () => {
  it('pinta una máscara por línea', () => {
    render(<Lines lines={['Diseño sistemas,', 'no pantallas']} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Diseño sistemas,no pantallas');
    expect(document.querySelectorAll('[data-line-inner]')).toHaveLength(2);
  });
});
```

Run: `npx vitest run components/effects/neat.test.tsx` → Expected: FAIL.

- [ ] **Step 4: neat.tsx**

`components/effects/neat.tsx`:
```tsx
'use client';

import { Children, useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { needsLoader, onLoaderDone } from '@/lib/loader';

/* Ejecuta `cb` cuando la intro ha terminado: de inmediato si no hay loader,
   o al recibir el aviso del Loader. */
export function useAfterIntro(cb: () => void) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!needsLoader()) { ref.current(); return; }
    return onLoaderDone(() => ref.current());
  }, []);
}

/* Dispara al entrar en pantalla. Nada se oculta hasta que ya se puede
   revelar: el peor caso es quedarse sin animación. */
function onEnter(el: Element, fn: () => void, margin = '0px 0px -12% 0px') {
  if (!('IntersectionObserver' in window)) { fn(); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    fn();
  }, { rootMargin: margin });
  io.observe(el);
  return () => io.disconnect();
}

/* Dos copias apiladas en una caja de una línea de alto; el :hover del enlace
   que lo contiene desplaza el par medio bloque (CSS .roll). La altura se
   mide, no se calcula: el line-height heredado puede venir de cualquier sitio. */
export function RollText({ children }: { children: string }) {
  const clip = useRef<HTMLSpanElement>(null);
  const first = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const fit = () => { if (clip.current && first.current) clip.current.style.height = first.current.offsetHeight + 'px'; };
    fit();
    document.fonts?.ready.then(fit);
  }, [children]);
  return (
    <span className="roll" ref={clip}>
      <span className="roll-inner">
        <span ref={first}>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  );
}

/* Titular palabra a palabra al llegar a pantalla. Solo se parten los nodos de
   texto: los hijos con estilo propio viajan enteros. */
export function Words({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || isLight()) return;
    const ws = el.querySelectorAll('.w');
    if (!ws.length) return;
    return onEnter(el, () => {
      gsap.fromTo(ws, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.035, ease: 'power3.out', immediateRender: false });
    });
  }, []);
  const parts: ReactNode[] = [];
  let k = 0;
  Children.forEach(children, (c) => {
    if (typeof c === 'string') {
      c.split(/(\s+)/).forEach((w) => {
        if (!w) return;
        if (!w.trim()) parts.push(w);
        else parts.push(<span key={k++} className="w" style={{ display: 'inline-block' }}>{w}</span>);
      });
    } else if (c !== null && c !== undefined) {
      parts.push(<span key={k++} className="w" style={{ display: 'inline-block' }}>{c}</span>);
    }
  });
  return <h2 ref={ref} className={className} style={style}>{parts}</h2>;
}

/* Máscara por línea. El padding y el margen negativo compensan los trazos
   descendentes: sin ellos, overflow hidden decapita las jotas y las ges. */
export function Lines({ lines, className, style }: { lines: string[]; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelectorAll('[data-line-inner]');
    if (isLight()) { gsap.set(inner, { yPercent: 0 }); return; }
    gsap.from(inner, { yPercent: 112, duration: 1.1, stagger: 0.085, ease: 'power4.out', delay: 0.12 });
  }, []);
  return (
    <h1 ref={ref} className={className} style={style}>
      {lines.map((l, i) => (
        <span key={i} style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
          <span data-line-inner style={{ display: 'block', willChange: 'transform' }}>{l}</span>
        </span>
      ))}
    </h1>
  );
}

/* La imagen se acerca despacio mientras el cursor está encima. */
export function ZoomBox({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const tween = (scale: number) => {
    if (isLight()) return;
    const img = ref.current?.querySelector('img');
    if (img) gsap.to(img, { scale, duration: 0.7, ease: 'power3.out', overwrite: true });
  };
  return <div ref={ref} className={className} style={style} onPointerEnter={() => tween(1.06)} onPointerLeave={() => tween(1)}>{children}</div>;
}

/* Entrada por sección: los bloques de primer nivel del contenedor interior de
   cada [data-screen-label] suben escalonados una sola vez. data-no-reveal
   excluye la sección o el bloque. */
export function useSectionReveal(ready: boolean) {
  useEffect(() => {
    if (!ready || isLight()) return;
    const offs: (() => void)[] = [];
    document.querySelectorAll('[data-screen-label]').forEach((sec) => {
      if (sec.hasAttribute('data-no-reveal')) return;
      const holder = sec.firstElementChild;
      if (!holder) return;
      const kids = Array.from(holder.children).filter((k) => !k.hasAttribute('data-no-reveal'));
      if (!kids.length) return;
      offs.push(onEnter(sec, () => {
        gsap.fromTo(kids, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out', immediateRender: false });
      }, '0px 0px -18% 0px'));
    });
    return () => offs.forEach((f) => f());
  }, [ready]);
}
```

Run: `npx vitest run components/effects/neat.test.tsx` → Expected: PASS.

- [ ] **Step 5: Test de Nav (falla)**

`components/Nav.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const path = { current: '/' };
vi.mock('next/navigation', () => ({ usePathname: () => path.current }));

import Nav from './Nav';

describe('Nav', () => {
  it('enlaza a / y /perfil y marca la activa', () => {
    render(<Nav />);
    const inicio = screen.getAllByRole('link', { name: /^inicio$/i }).find((l) => l.classList.contains('nav-link'))!;
    const perfil = screen.getByRole('link', { name: /sobre mí/i });
    expect(inicio).toHaveAttribute('href', '/');
    expect(perfil).toHaveAttribute('href', '/perfil');
    expect(inicio).toHaveClass('is-active');
    expect(perfil).not.toHaveClass('is-active');
    expect(document.querySelector('starfield-button')).not.toBeNull();
  });
  it('en privacidad no pinta el botón de contacto', () => {
    path.current = '/privacidad';
    render(<Nav />);
    expect(document.querySelector('starfield-button')).toBeNull();
    path.current = '/';
  });
});
```

Run: `npx vitest run components/Nav.test.tsx` → Expected: FAIL.

- [ ] **Step 6: Nav.tsx, template.tsx, layout.tsx, páginas temporales**

`components/Nav.tsx`:
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RollText } from './effects/neat';
import Starfield from './effects/Starfield';

export default function Nav() {
  const p = usePathname();
  const legal = p === '/privacidad';
  return (
    <div className="nav">
      <div className="nav-pill">
        <Link href="/" className="nav-logo" aria-label="Inicio"><span>VM</span></Link>
        <span className="nav-sep" />
        <Link href="/" className={'nav-link' + (p === '/' ? ' is-active' : '')}><RollText>Inicio</RollText></Link>
        <Link href="/perfil" className={'nav-link' + (p === '/perfil' ? ' is-active' : '')}><RollText>Sobre mí</RollText></Link>
        {!legal && (
          <>
            <span className="nav-sep" />
            <Starfield label="Escríbeme ↗" href="#contacto" fill="rgba(35,39,51,0.55)" padding="8px 16px" fontSize={13} lightSize={58} pixelDensity={46} glowSize={14} />
          </>
        )}
      </div>
    </div>
  );
}
```

`app/template.tsx`:
```tsx
'use client';

import { useState } from 'react';

/* La clase se retira al acabar: un ancestro con transform convertiría los
   position: fixed de dentro (modal, loader, peek) en relativos a la página. */
export default function Template({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  return <div className={done ? undefined : 'page-enter'} onAnimationEnd={() => setDone(true)}>{children}</div>;
}
```

`app/layout.tsx` (sustituir):
```tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { Montserrat, Bebas_Neue } from 'next/font/google';
import 'remixicon/fonts/remixicon.css';
import './globals.css';
import Nav from '@/components/Nav';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-montserrat', display: 'swap' });
const bebas = Bebas_Neue({ subsets: ['latin'], weight: '400', variable: '--font-bebas', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://proyectos-theta-hazel.vercel.app'),
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', siteName: 'Víctor Maza', images: [{ url: '/assets/og.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${bebas.variable}`}>
      <body>
        <Nav />
        {children}
        <Script src="/effects/starfield-button.js" strategy="afterInteractive" />
        <Script src="/effects/cursor-ring-field.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
```

`app/perfil/page.tsx` y `app/privacidad/page.tsx` temporales (`Perfil` / `Privacidad`):
```tsx
export default function Page() {
  return <main style={{ padding: '160px 40px' }}><h1 className="bebas">Perfil</h1></main>;
}
```

Run: `npx vitest run` → Expected: PASS. Run: `npm run build` → Expected: OK, rutas `/`, `/perfil`, `/privacidad`.

- [ ] **Step 7: Comprobar navegación sin recarga en el navegador**

Arrancar el dev server con la herramienta de preview de la app (crear `.claude/launch.json` con `{"version":"0.0.1","configurations":[{"name":"dev","runtimeExecutable":"npm","runtimeArgs":["run","dev"],"port":3000}]}`), no con Bash. Abrir `http://localhost:3000`, ejecutar en consola:
```js
performance.getEntriesByType('navigation').length // 1
```
Clic en "Sobre mí", esperar, repetir: sigue en `1`, la URL es `/perfil`, la píldora del nav no ha parpadeado y el `starfield-button` sigue con su canvas. Comprobar `http://localhost:3000/perfil.html` → redirige a `/perfil`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Layout persistente con Nav, transicion de pagina y efectos base

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---
### Task 6: Loader (1,6 s)

**Files:**
- Create: `components/Loader.tsx`, `components/Loader.test.tsx`

**Interfaces:**
- Consumes: `needsLoader`, `markLoaderDone` de `@/lib/loader`.
- Produces: `<Loader />` (se monta solo en la portada). Al terminar llama a `markLoaderDone()`, que dispara `vm-loader-done` para `useAfterIntro` y el banner.

- [ ] **Step 1: Test (falla)**

`components/Loader.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import Loader, { LOADER_MS } from './Loader';
import { LOADER_KEY, LOADER_EVENT } from '@/lib/loader';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'] });
});
afterEach(() => vi.useRealTimers());

describe('Loader', () => {
  it('cuenta hasta 100 y avisa a los 1,6 s', () => {
    const done = vi.fn();
    window.addEventListener(LOADER_EVENT, done);
    const { container } = render(<Loader />);
    const root = container.querySelector('[data-loader]') as HTMLElement;
    expect(root.style.opacity).toBe('1');
    act(() => { vi.advanceTimersByTime(700); });
    const mid = parseInt(root.querySelector('[data-count]')!.textContent!, 10);
    expect(mid).toBeGreaterThan(30);
    expect(mid).toBeLessThan(80);
    act(() => { vi.advanceTimersByTime(LOADER_MS - 700 + 50); });
    expect(root.querySelector('[data-count]')).toHaveTextContent('100');
    expect(done).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(LOADER_KEY)).toBe('1');
    expect(root.style.opacity).toBe('0');
    window.removeEventListener(LOADER_EVENT, done);
  });
  it('si ya se vio en la sesión no bloquea y avisa de inmediato', () => {
    sessionStorage.setItem(LOADER_KEY, '1');
    const done = vi.fn();
    window.addEventListener(LOADER_EVENT, done);
    const { container } = render(<Loader />);
    const root = container.querySelector('[data-loader]') as HTMLElement;
    expect(root.style.opacity).toBe('0');
    expect(done).toHaveBeenCalledTimes(1);
    window.removeEventListener(LOADER_EVENT, done);
  });
  it('LOADER_MS es 1600', () => { expect(LOADER_MS).toBe(1600); });
});
```

Run: `npx vitest run components/Loader.test.tsx` → Expected: FAIL.

- [ ] **Step 2: Loader.tsx**

```tsx
'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { needsLoader, markLoaderDone } from '@/lib/loader';

export const LOADER_MS = 1600;
const COUNT_MS = 1300; // el contador llega a 100 y aguanta el resto
const WORDS = ['Diseñar', 'Ordenar', 'Entregar'];

/* Pantalla de carga de la portada. En el HTML estático el velo va opaco (tapa
   la página hasta que hidrata); en cuanto monta, decide: si ya se vio en la
   sesión o es móvil, se apaga sin transición; si no, cuenta 0→100 y se funde. */
export default function Loader() {
  const [active, setActive] = useState<boolean | null>(null);
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!needsLoader()) { setActive(false); markLoaderDone(); return; }
    ran.current = true;
    setActive(true);
    const wt = setInterval(() => setWord((w) => (w + 1) % WORDS.length), 550);
    const t0 = performance.now();
    let raf = 0;
    let hold: ReturnType<typeof setTimeout> | undefined;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / COUNT_MS);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(step);
      else hold = setTimeout(() => { clearInterval(wt); setActive(false); markLoaderDone(); }, LOADER_MS - COUNT_MS);
    };
    raf = requestAnimationFrame(step);
    return () => { clearInterval(wt); cancelAnimationFrame(raf); if (hold) clearTimeout(hold); };
  }, []);

  const hidden = active === false;
  const style: CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#1b1e27', opacity: hidden ? 0 : 1, pointerEvents: hidden ? 'none' : 'auto',
    transition: ran.current ? 'opacity 0.6s ease' : 'none',
  };
  return (
    <div data-loader style={style} aria-hidden={hidden}>
      {active && (
        <>
          <span style={{ position: 'absolute', top: 'clamp(20px, 3vw, 40px)', left: 'clamp(20px, 3vw, 40px)', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Portfolio</span>
          <span className="bebas" style={{ fontSize: 'clamp(38px, 7vw, 84px)', color: 'rgba(236,236,236,0.8)' }}>{WORDS[word]}</span>
          <span data-count className="bebas" style={{ position: 'absolute', right: 'clamp(20px, 3vw, 40px)', bottom: 'clamp(44px, 6vw, 76px)', fontSize: 'clamp(56px, 12vw, 140px)', fontVariantNumeric: 'tabular-nums', color: '#ececec' }}>{String(count).padStart(3, '0')}</span>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(44,49,64,0.5)' }}>
            <div style={{ height: '100%', width: count + '%', background: 'linear-gradient(90deg, #4a44f2, #4e85bf)', boxShadow: '0 0 8px rgba(74,68,242,0.35)' }} />
          </div>
        </>
      )}
    </div>
  );
}
```

Run: `npx vitest run components/Loader.test.tsx` → Expected: PASS. Si el primer test falla por el valor intermedio (los RAF falsos avanzan de 16 en 16 ms), ampliar el rango a `> 20` y `< 90`.

- [ ] **Step 3: Commit**

```bash
git add components/Loader.tsx components/Loader.test.tsx
git commit -m "Loader de portada en 1,6 s, solo primera visita de escritorio

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Banner de consentimiento y page_view por ruta

**Files:**
- Create: `components/ConsentBanner.tsx`, `components/ConsentBanner.test.tsx`, `components/AnalyticsPageView.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `readConsent`, `writeConsent`, `startAnalytics`, `installConsentGlobals` de `@/lib/consent`; `loaderSeen`, `onLoaderDone` de `@/lib/loader`.
- Produces: `<ConsentBanner />` y `<AnalyticsPageView />`, ambos en el layout.

- [ ] **Step 1: Test (falla)**

`components/ConsentBanner.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ConsentBanner from './ConsentBanner';
import { CONSENT_KEY } from '@/lib/consent';
import { LOADER_KEY } from '@/lib/loader';

vi.mock('next/link', () => ({ default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => <a href={href} {...rest}>{children}</a> }));

beforeEach(() => { vi.useFakeTimers(); document.head.innerHTML = ''; });
afterEach(() => vi.useRealTimers());

describe('ConsentBanner', () => {
  it('sin decisión y sin loader, aparece a los 2 s', () => {
    render(<ConsentBanner />);
    expect(screen.queryByRole('dialog')).toBeNull();
    act(() => { vi.advanceTimersByTime(2100); });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Más información' })).toHaveAttribute('href', '/privacidad');
  });
  it('si el loader ya se vio, aparece a los 400 ms', () => {
    sessionStorage.setItem(LOADER_KEY, '1');
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(450); });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('aceptar guarda granted y arranca la analítica', () => {
    sessionStorage.setItem(LOADER_KEY, '1');
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(450); });
    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(localStorage.getItem(CONSENT_KEY)).toBe('granted');
    expect(document.getElementById('ga-gtag-loader')).not.toBeNull();
    expect(document.getElementById('hs-script-loader')).not.toBeNull();
  });
  it('rechazar guarda denied y no pide nada', () => {
    sessionStorage.setItem(LOADER_KEY, '1');
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(450); });
    fireEvent.click(screen.getByRole('button', { name: 'Rechazar' }));
    expect(localStorage.getItem(CONSENT_KEY)).toBe('denied');
    expect(document.head.querySelectorAll('script')).toHaveLength(0);
  });
  it('con granted previo arranca sin banner', () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(2500); });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.getElementById('ga-gtag-loader')).not.toBeNull();
  });
  it('con denied previo no hay banner ni scripts', () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    render(<ConsentBanner />);
    act(() => { vi.advanceTimersByTime(2500); });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.head.querySelectorAll('script')).toHaveLength(0);
  });
});
```

Run: `npx vitest run components/ConsentBanner.test.tsx` → Expected: FAIL.

- [ ] **Step 2: ConsentBanner.tsx**

```tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readConsent, writeConsent, startAnalytics, installConsentGlobals } from '@/lib/consent';
import { loaderSeen, onLoaderDone } from '@/lib/loader';

/* Esperamos a que acabe la intro para no taparla. Si en la página no hay
   loader (perfil, privacidad) damos 2 s de margen, como consent.js. */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    installConsentGlobals();
    const decision = readConsent();
    if (decision === 'granted') { startAnalytics(); return; }
    if (decision === 'denied') return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const show = (ms: number) => { t = setTimeout(() => setOpen(true), ms); };
    let off = () => {};
    if (loaderSeen()) show(400);
    else if (document.querySelector('[data-loader]')) off = onLoaderDone(() => show(400));
    else show(2000);
    return () => { off(); if (t) clearTimeout(t); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  if (!open) return null;

  const close = () => { setShown(false); setTimeout(() => setOpen(false), 350); };
  const accept = () => { writeConsent('granted'); startAnalytics(); close(); };
  const reject = () => { writeConsent('denied'); close(); };

  return (
    <div role="dialog" aria-label="Consentimiento de analítica" className={'consent' + (shown ? ' is-in' : '')}>
      <p>
        Uso Google Analytics, Microsoft Clarity, Hotjar, Plerdy y HubSpot para ver cómo se navega esta web y para atender lo que me escribes. Usan cookies y solo se activan si lo aceptas.{' '}
        <Link href="/privacidad">Más información</Link>
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-btn" onClick={reject}>Rechazar</button>
        <button type="button" className="consent-btn is-primary" onClick={accept}>Aceptar</button>
      </div>
    </div>
  );
}
```

Run: `npx vitest run components/ConsentBanner.test.tsx` → Expected: PASS.

- [ ] **Step 3: AnalyticsPageView.tsx y layout**

`components/AnalyticsPageView.tsx`:
```tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { readConsent } from '@/lib/consent';

/* Con navegación sin recarga gtag no ve el cambio de página: se envía a mano
   a partir de la segunda ruta (la primera la manda `config`). */
export default function AnalyticsPageView() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (readConsent() !== 'granted') return;
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (gtag) gtag('event', 'page_view', { page_path: pathname, page_location: location.href, page_title: document.title });
  }, [pathname]);
  return null;
}
```

En `app/layout.tsx` importar ambos y colocarlos **después** de `{children}` (así el `[data-loader]` de la portada ya está en el DOM cuando corre el efecto del banner):
```tsx
import ConsentBanner from '@/components/ConsentBanner';
import AnalyticsPageView from '@/components/AnalyticsPageView';
...
        {children}
        <ConsentBanner />
        <AnalyticsPageView />
        <Script src="/effects/starfield-button.js" strategy="afterInteractive" />
```

Run: `npx vitest run` → PASS. `npm run build` → OK.

- [ ] **Step 4: Comprobar en el navegador**

En el preview, con `localStorage.clear()` y recarga: el banner aparece a los ~2 s en `/perfil`. Rechazar → `performance.getEntriesByType('resource').filter(r => /googletagmanager|clarity\.ms|hotjar|plerdy|hs-scripts/.test(r.name)).length` es `0`. `localStorage.clear()`, recargar, Aceptar → aparecen `gtag/js` y `js-eu1.hs-scripts.com` (Clarity/Hotjar/Plerdy no en localhost, por la guarda).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Banner de consentimiento y page_view por ruta

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---
### Task 8: Portada I — Hero, Trabajo, modal de caso y Contacto

**Files:**
- Create: `components/home/Hero.tsx`, `components/home/Trabajo.tsx`, `components/home/CasoModal.tsx`, `components/home/CasoModal.test.tsx`, `components/Contacto.tsx`, `components/Contacto.test.tsx`, `components/home/Home.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `WORKS`, `workRows`, `card`, `thumb`, `EMAIL`, `SOCIAL` de `@/lib/data`; `Starfield`; `RollText`, `useAfterIntro`, `useSectionReveal` de neat; `Loader`; `gsap`; `isLight`; `resetConsent`.
- Produces:
  - `<Hero />`
  - `<Trabajo onOpen={(i: number) => void} />`
  - `<CasoModal index={number | null} onClose={() => void} onOpen={(i: number) => void} />`
  - `<Contacto variant="home" | "perfil" />`
  - `<Home />` (cliente; contiene el estado del modal y renderiza `<Loader/>`)
- Las secciones UsoIA, Logos y Sectores se añaden en la Task 9; `Home.tsx` las importa desde el principio con componentes vacíos temporales que la Task 9 sustituye.

- [ ] **Step 1: Hero.tsx**

Copiar el marcado de `index.html` líneas 73-103 a JSX. Puntos concretos:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { isMobileViewport } from '@/lib/loader';
import { SOCIAL } from '@/lib/data';
import Starfield from '@/components/effects/Starfield';
import { RollText, useAfterIntro } from '@/components/effects/neat';

const ROLES = ['complejo', 'regulado', 'escalable', 'medible'];

export default function Hero() {
  const [role, setRole] = useState(0);
  const [density, setDensity] = useState(300);

  useEffect(() => {
    const t = setInterval(() => setRole((r) => (r + 1) % ROLES.length), 2200);
    setDensity(isMobileViewport() ? 170 : 300);
    return () => clearInterval(t);
  }, []);

  /* Intro: nombre y bloques entran cuando el loader termina. */
  useAfterIntro(() => {
    if (isLight()) {
      gsap.from('.name-reveal', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
      gsap.from('.blur-in', { opacity: 0, y: 12, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
    } else {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.name-reveal', { opacity: 0, y: 50, duration: 1.2 }, 0.1)
        .from('.blur-in', { opacity: 0, y: 20, filter: 'blur(10px)', duration: 1, stagger: 0.1 }, 0.3);
    }
  });

  return (
    <div id="inicio" data-screen-label="Hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <cursor-ring-field colors="#8bde5f,#4a44f2,#232733" background="#1b1e27" density={density} dot-size={120} speed={6} camera-distance={160} ring-radius={12} ring-width={9} push={50} turbulence={100} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 45%, rgba(27,30,39,0.35), rgba(27,30,39,0.82))', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, background: 'linear-gradient(to top, #1b1e27, transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto', padding: 'clamp(120px, 14vh, 180px) clamp(20px, 4vw, 64px) clamp(80px, 10vh, 120px)' }}>
        <p className="blur-in" style={{ margin: '0 0 28px' }}><span style={{ display: 'inline-block', padding: '5px 12px 4px', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#15181f', background: '#8bde5f' }}>Product Designer (UX/UI)</span></p>
        <h1 className="name-reveal bebas" style={{ margin: '0 0 22px', fontWeight: 400, fontSize: 'clamp(52px, 11vw, 148px)', lineHeight: 0.9, letterSpacing: '0.01em' }}>Víctor Maza</h1>
        <p className="blur-in" style={{ margin: '0 0 26px', fontSize: 'clamp(18px, 2.4vw, 30px)', color: '#c9c9c9' }}>
          Diseño producto <span key={role} className="bebas" style={{ fontSize: '1.15em', letterSpacing: '0.02em', color: '#ececec', display: 'inline-block', animation: 'roleFade 0.4s ease-out' }}>{ROLES[role]}</span> desde Málaga.
        </p>
        <p className="blur-in" style={{ margin: '0 0 40px', maxWidth: 520, fontSize: 'clamp(14px, 1.2vw, 17px)', lineHeight: 1.65, color: '#e2e4ea', textWrap: 'pretty' }}>Nueve años en SaaS B2B e Insurtech: ordeno dominios densos y construyo design systems con reglas de decisión. Diseño y escribo el front, así el diseño llega entero a producción.</p>
        <div className="blur-in" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
          <a href="#trabajo" className="btn-ghost"><RollText>Ver casos</RollText></a>
          <Starfield label="Escríbeme ↗" href="#contacto" rounded={100} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener" title="LinkedIn" className="social-circle"><i className="ri-linkedin-fill" style={{ fontSize: 23 }} /></a>
            <a href={SOCIAL.behance} target="_blank" rel="noopener" title="Behance" className="social-circle"><i className="ri-behance-fill" style={{ fontSize: 23 }} /></a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener" title="Instagram" className="social-circle"><i className="ri-instagram-line" style={{ fontSize: 23 }} /></a>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: '50%', bottom: 28, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, zIndex: 10 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#878787' }}>Scroll</span>
        <span style={{ position: 'relative', display: 'block', width: 1, height: 40, background: '#2c3140', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent, #4a44f2, transparent)', animation: 'scrollDown 1.5s ease-in-out infinite' }} />
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Trabajo.tsx (filas + imagen que sigue al cursor)**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { workRows, type WorkRow } from '@/lib/data';
import { RollText, Words } from '@/components/effects/neat';

const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/* La imagen sigue al cursor en vez de vivir en la fila: la lista se lee como
   texto y la prueba visual aparece solo donde apunta la atención. */
export default function Trabajo({ onOpen }: { onOpen: (i: number) => void }) {
  const rows = workRows();
  const list = useRef<HTMLDivElement>(null);
  const peek = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState(BLANK);
  const move = useRef<{ x: (v: number) => void; y: (v: number) => void; placed: boolean } | null>(null);

  useEffect(() => {
    if (!peek.current || isLight()) return;
    move.current = {
      x: gsap.quickTo(peek.current, 'x', { duration: 0.55, ease: 'power3' }),
      y: gsap.quickTo(peek.current, 'y', { duration: 0.55, ease: 'power3' }),
      placed: false,
    };
  }, []);

  /* El primer pointerenter llega antes de cualquier pointermove: se coloca sin
     tween en la primera posición conocida para que no cruce la página. */
  const put = (e: React.PointerEvent, jump: boolean) => {
    const m = move.current;
    const el = peek.current;
    if (!m || !el) return;
    const w = el.offsetWidth || 280;
    const h = w * 0.75;
    const x = e.clientX - w / 2;
    const y = e.clientY - h / 2;
    if (!m.placed || jump) { gsap.set(el, { x, y }); m.placed = true; return; }
    m.x(x);
    m.y(y);
  };

  const enter = (row: WorkRow, e: React.PointerEvent<HTMLDivElement>) => {
    put(e, !move.current?.placed);
    if (!move.current) return;
    setSrc(row.img);
    gsap.to(peek.current, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', overwrite: true });
    const arrow = e.currentTarget.querySelector('[data-work-arrow]');
    if (arrow) gsap.to(arrow, { color: '#8bde5f', x: 4, y: -4, duration: 0.35, ease: 'power2.out' });
  };
  const leave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!move.current) return;
    gsap.to(peek.current, { opacity: 0, scale: 0.94, duration: 0.3, ease: 'power2.out', overwrite: true });
    const arrow = e.currentTarget.querySelector('[data-work-arrow]');
    if (arrow) gsap.to(arrow, { color: '#6d6d6d', x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
  };
  const act = (row: WorkRow) => {
    if (row.action.kind === 'case') onOpen(row.action.index);
    else window.open(row.action.url, '_blank', 'noopener');
  };

  return (
    <div id="trabajo" data-screen-label="Trabajo" style={{ padding: 'clamp(64px, 8vw, 110px) clamp(20px, 4vw, 64px)' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ display: 'inline-block', padding: '5px 11px 4px', fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#15181f', background: '#8bde5f' }}>Casos seleccionados</span>
          <span style={{ fontSize: 10.5, letterSpacing: '0.1em', color: '#a9a4f8' }}>{String(rows.length).padStart(2, '0')}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginTop: 14 }}>
          <Words style={{ margin: 0, fontSize: 'clamp(34px, 6vw, 78px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1 }}>Producto <span className="bebas" style={{ letterSpacing: '0.01em' }}>en producción</span></Words>
          <a href="#sectores" className="link-dim"><RollText>[ Todos los sectores ]</RollText></a>
        </div>
        <div ref={list} onPointerMove={(e) => put(e, false)} style={{ position: 'relative', marginTop: 'clamp(32px, 4vw, 56px)', borderTop: '1px solid #2c3140' }}>
          {rows.map((row) => (
            <div key={row.n} className="work-row" onClick={() => act(row)} onPointerEnter={(e) => enter(row, e)} onPointerLeave={leave}>
              <span style={{ fontSize: 11, color: '#8bde5f', paddingTop: 8 }}>{row.n}</span>
              <div>
                <p style={{ margin: 0, fontSize: 'clamp(22px, 3.2vw, 40px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{row.title}</p>
                <p style={{ margin: '10px 0 0', maxWidth: 520, fontSize: 14.5, lineHeight: 1.6, color: '#878787', textWrap: 'pretty' }}>{row.desc}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, paddingTop: 6 }}>
                <span style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6d6d6d', whiteSpace: 'nowrap' }}>{row.kicker}</span>
                <i className="ri-arrow-right-up-line" data-work-arrow style={{ fontSize: 22, color: '#6d6d6d', transition: 'color 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)' }} />
              </div>
            </div>
          ))}
          <div ref={peek} className="work-peek">
            <img alt="" src={src} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Test de CasoModal (falla)**

`components/home/CasoModal.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CasoModal from './CasoModal';
import { WORKS } from '@/lib/data';

describe('CasoModal', () => {
  it('cerrado no pinta nada', () => {
    const { container } = render(<CasoModal index={null} onClose={() => {}} onOpen={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
  it('abierto muestra el caso, sus capturas y el siguiente', () => {
    const onOpen = vi.fn();
    render(<CasoModal index={0} onClose={() => {}} onOpen={onOpen} />);
    expect(screen.getByRole('heading', { level: 3, name: WORKS[0].title })).toBeInTheDocument();
    const thumbs = screen.getAllByRole('button', { name: /^Captura \d de 6/ });
    expect(thumbs).toHaveLength(6);
    expect(thumbs[0]).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(thumbs[2]);
    expect(thumbs[2]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(WORKS[0].gallery[2][1])).toBeInTheDocument();
    fireEvent.click(screen.getByText(WORKS[1].title + ' →'));
    expect(onOpen).toHaveBeenCalledWith(1);
  });
  it('el último caso enlaza al primero', () => {
    const onOpen = vi.fn();
    render(<CasoModal index={1} onClose={() => {}} onOpen={onOpen} />);
    fireEvent.click(screen.getByText(WORKS[0].title + ' →'));
    expect(onOpen).toHaveBeenCalledWith(0);
  });
  it('el aspa cierra', () => {
    const onClose = vi.fn();
    render(<CasoModal index={0} onClose={onClose} onOpen={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalled();
  });
});
```

Run: `npx vitest run components/home/CasoModal.test.tsx` → Expected: FAIL.

- [ ] **Step 4: CasoModal.tsx**

Marcado de `index.html` líneas 274-357 (solo la rama de caso de trabajo; el bento de grupos era código muerto).

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { WORKS, card, thumb } from '@/lib/data';

interface Props { index: number | null; onClose: () => void; onOpen: (i: number) => void }

/* El clic más repetido de toda la web era el aspa de este modal: se abría un
   caso y la única salida era cerrarlo. El pie ofrece dos continuaciones, el
   otro caso y el contacto, para que leer un caso no termine en un callejón. */
export default function CasoModal({ index, onClose, onOpen }: Props) {
  const [shot, setShot] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);

  useEffect(() => { setShot(0); if (panel.current) panel.current.scrollTop = 0; }, [index]);

  useEffect(() => {
    if (index === null || !panel.current) return;
    const p = panel.current;
    const lines = p.querySelectorAll('[data-box-line]');
    const light = isLight();
    gsap.killTweensOf([p, veil.current, lines]);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (veil.current) tl.fromTo(veil.current, { opacity: 0 }, { opacity: 1, duration: 0.32 }, 0);
    tl.fromTo(p, { opacity: 0, y: light ? 24 : 46, scale: light ? 1 : 0.965 }, { opacity: 1, y: 0, scale: 1, duration: light ? 0.45 : 0.72 }, 0.04);
    if (lines.length) tl.fromTo(lines, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 }, 0.16);
  }, [index]);

  if (index === null) return null;
  const w = WORKS[index];
  const cur = w.gallery[shot] || w.gallery[0];
  const nextIdx = WORKS.length > 1 ? (index + 1) % WORKS.length : null;
  const next = nextIdx === null ? null : WORKS[nextIdx];

  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    /* Salto instantáneo a propósito: ScrollTrigger cancela el scroll suave en
       el primer frame. Espera un tick a que el modal se apague antes de medir. */
    setTimeout(() => {
      const t = document.getElementById('contacto');
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
    }, 0);
  };

  return (
    <div className="box">
      <div ref={veil} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.9)', backdropFilter: 'blur(8px)' }} />
      <div ref={panel} role="dialog" aria-label={w.title} style={{ position: 'relative', width: '100%', maxWidth: 1180, maxHeight: '90vh', overflow: 'auto', borderRadius: 24, border: '1px solid #262626', background: '#101010', willChange: 'transform' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, padding: '22px clamp(20px, 2.6vw, 34px) 0', background: 'linear-gradient(180deg, #101010 70%, transparent)' }}>
          <div>
            <p data-box-line style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8bde5f' }}>{w.kicker}</p>
            <h3 data-box-line className="bebas" style={{ margin: '10px 0 0', fontWeight: 400, fontSize: 'clamp(24px, 3vw, 40px)' }}>{w.title}</h3>
          </div>
          <button type="button" aria-label="Cerrar" className="box-close" onClick={onClose} style={{ background: 'transparent' }}><i className="ri-close-line" style={{ fontSize: 20 }} /></button>
        </div>

        <div className="box-grid">
          <div style={{ minWidth: 0 }}>
            {w.star.map(([, , body, label], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '34px minmax(0, 1fr)', gap: 14, borderTop: '1px solid #2c3140', padding: '16px 0' }}>
                <span className="bebas" style={{ fontSize: 22, color: '#8bde5f' }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.4, color: '#ececec' }}>{label}</p>
                  <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.65, color: '#949494', textWrap: 'pretty' }}>{body}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 'clamp(22px, 2.6vw, 32px)', borderTop: '1px solid #2c3140', paddingTop: 18 }}>
              <p style={{ margin: '0 0 14px', fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#878787' }}>Equipo y liderazgo</p>
              {w.team.map(([icon, name, body]) => (
                <div key={name} style={{ display: 'grid', gridTemplateColumns: '22px minmax(0, 1fr)', gap: 12, marginBottom: 14 }}>
                  <i className={icon} style={{ fontSize: 16, marginTop: 2, color: '#8bde5f' }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 14.5, color: '#ececec' }}>{name}</p>
                    <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.6, color: '#949494', textWrap: 'pretty' }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div role="img" aria-label={cur[1]} style={{ width: '100%', height: 'clamp(320px, 62vh, 720px)', borderRadius: 24, border: '1px solid #2c3140', backgroundColor: '#0d0d0d', backgroundImage: `url(${card(cur[0])})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8, marginTop: 12 }}>
              {w.gallery.map((g, i) => (
                <div key={g[0]} role="button" tabIndex={0} aria-label={`Captura ${i + 1} de ${w.gallery.length}: ${g[1]}`} aria-pressed={shot === i} title={g[1]}
                  onClick={() => setShot(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShot(i); } }}
                  style={{ cursor: 'pointer', height: 62, borderRadius: 14, border: '1px solid ' + (shot === i ? '#8bde5f' : '#2c3140'), backgroundColor: '#232733', backgroundImage: `url(${thumb(g[0])})`, backgroundSize: 'cover', backgroundPosition: 'top left', opacity: shot === i ? 1 : 0.55, transition: 'opacity 0.25s ease, border-color 0.25s ease' }} />
              ))}
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 12, letterSpacing: '0.1em', color: '#6d6d6d' }}>{cur[1]}</p>
            <div style={{ marginTop: 'clamp(22px, 2.6vw, 32px)', borderTop: '1px solid #2c3140', paddingTop: 18 }}>
              <p style={{ margin: '0 0 14px', fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#878787' }}>Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {w.skills.map((k) => <span key={k} style={{ border: '1px solid #262626', borderRadius: 999, padding: '7px 14px', fontSize: 12.5, color: '#d6d6d6', background: 'rgba(139,222,95,0.07)' }}>{k}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, marginTop: 22 }}>
                {w.facts.map(([v, k]) => (
                  <div key={k} style={{ borderTop: '1px solid #2c3140', paddingTop: 12 }}>
                    <p className="bebas" style={{ margin: 0, fontSize: 'clamp(24px, 2.6vw, 34px)', lineHeight: 1 }}>{v}</p>
                    <p style={{ margin: '8px 0 0', fontSize: 12.5, lineHeight: 1.45, color: '#878787' }}>{k}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, margin: '0 clamp(20px, 2.6vw, 34px) clamp(24px, 3vw, 40px)', borderTop: '1px solid #2c3140', paddingTop: 20 }}>
          {next && nextIdx !== null && (
            <a href="#trabajo" className="box-next" onClick={(e) => { e.preventDefault(); onOpen(nextIdx); }}>
              <span style={{ fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#878787' }}>Siguiente caso</span>
              <span style={{ fontSize: 15, lineHeight: 1.3, color: '#ececec' }}>{next.title} →</span>
            </a>
          )}
          <a href="#contacto" className="box-contact" onClick={goContact}>Escríbeme ↗</a>
        </div>
      </div>
    </div>
  );
}
```

Run: `npx vitest run components/home/CasoModal.test.tsx` → Expected: PASS.

- [ ] **Step 5: Test de Contacto (falla)**

`components/Contacto.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Contacto from './Contacto';

vi.mock('next/link', () => ({ default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => <a href={href} {...rest}>{children}</a> }));

describe('Contacto', () => {
  it('en la portada enlaza al perfil; en el perfil, a la portada', () => {
    const { unmount } = render(<Contacto variant="home" />);
    expect(screen.getByRole('link', { name: 'Perfil ↗' })).toHaveAttribute('href', '/perfil');
    unmount();
    render(<Contacto variant="perfil" />);
    expect(screen.getByRole('link', { name: 'Portada ↗' })).toHaveAttribute('href', '/');
  });
  it('copiar correo muestra la confirmación 1,8 s', async () => {
    vi.useFakeTimers();
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    render(<Contacto variant="home" />);
    const msg = screen.getByText('Correo copiado');
    expect(msg.style.opacity).toBe('0');
    await act(async () => { fireEvent.click(screen.getByTitle('Copiar correo')); await Promise.resolve(); await Promise.resolve(); });
    expect(msg.style.opacity).toBe('1');
    act(() => { vi.advanceTimersByTime(1850); });
    expect(msg.style.opacity).toBe('0');
    vi.useRealTimers();
  });
});
```

Run: `npx vitest run components/Contacto.test.tsx` → Expected: FAIL.

- [ ] **Step 6: Contacto.tsx**

Marcado de `index.html` líneas 240-272 (perfil es idéntico salvo el último enlace).

```tsx
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { EMAIL, SOCIAL } from '@/lib/data';
import { resetConsent } from '@/lib/consent';
import Starfield from '@/components/effects/Starfield';
import { RollText } from '@/components/effects/neat';

export default function Contacto({ variant }: { variant: 'home' | 'perfil' }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copyMail = () => {
    const write = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(EMAIL) : Promise.reject();
    write.catch(() => {
      const ta = document.createElement('textarea');
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      ta.remove();
    }).finally(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div id="contacto" data-screen-label="Contacto" data-no-reveal style={{ position: 'relative', padding: 'clamp(56px, 7vw, 96px) 0 0', overflow: 'hidden', borderTop: '1px solid #232733', background: '#15181f' }}>
      <div style={{ padding: '0 clamp(20px, 6vw, 100px)' }}>
        <div className="foot-grid">
          <p style={{ margin: 0, maxWidth: 260, fontSize: 14, lineHeight: 1.6, color: '#878787' }}>Diseño producto B2B donde un error operativo cuesta dinero.</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6d6d6d' }}>Ponte en contacto</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
              <div onClick={copyMail} title="Copiar correo" style={{ display: 'inline-flex' }}>
                <Starfield label={EMAIL} padding="14px 24px" fontSize={16} lightSize={110} pixelDensity={50} speed={50} />
              </div>
              <Starfield label="LinkedIn ↗" href={SOCIAL.linkedin} newTab padding="14px 24px" fontSize={16} lightSize={110} pixelDensity={50} speed={50} />
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 12.5, letterSpacing: '0.1em', color: '#8bde5f', opacity: copied ? 1 : 0, transition: 'opacity 0.3s ease' }}>Correo copiado</p>
          </div>
          <div className="foot-links">
            <a href={SOCIAL.behance} target="_blank" rel="noopener" className="link-muted"><RollText>Behance ↗</RollText></a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener" className="link-muted"><RollText>Instagram ↗</RollText></a>
            {variant === 'home'
              ? <Link href="/perfil" className="link-muted"><RollText>Perfil ↗</RollText></Link>
              : <Link href="/" className="link-muted"><RollText>Portada ↗</RollText></Link>}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 'clamp(36px, 4.6vw, 64px)', padding: '14px clamp(20px, 6vw, 100px)', background: '#3a34e8' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, fontSize: 12.5, color: '#d6e2ff' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#ececec' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#8bde5f', boxShadow: '0 0 10px rgba(139,222,95,0.6)' }} />
            Disponible para proyectos
          </span>
          <span>© 2026 Víctor Maza · Málaga, España · Trabajo en remoto · <Link href="/privacidad" className="strip-link">Privacidad</Link> · <Link href="/privacidad#cookies" className="strip-link" onClick={(e) => { e.preventDefault(); resetConsent(); }}>Cookies</Link></span>
        </div>
      </div>
    </div>
  );
}
```

Run: `npx vitest run components/Contacto.test.tsx` → Expected: PASS.

- [ ] **Step 7: Home.tsx y app/page.tsx**

`components/home/Home.tsx`:
```tsx
'use client';

import { useState } from 'react';
import Loader from '@/components/Loader';
import Hero from './Hero';
import Trabajo from './Trabajo';
import UsoIA from './UsoIA';
import Logos from './Logos';
import Sectores from './Sectores';
import Contacto from '@/components/Contacto';
import CasoModal from './CasoModal';
import { useAfterIntro, useSectionReveal } from '@/components/effects/neat';

export default function Home() {
  const [box, setBox] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  useAfterIntro(() => setReady(true));
  useSectionReveal(ready);
  return (
    <div className="page">
      <Loader />
      <Hero />
      <Trabajo onOpen={setBox} />
      <UsoIA />
      <Logos />
      <Sectores onOpen={setBox} />
      <Contacto variant="home" />
      <CasoModal index={box} onClose={() => setBox(null)} onOpen={setBox} />
    </div>
  );
}
```

Crear temporalmente `components/home/UsoIA.tsx`, `Logos.tsx` y `Sectores.tsx` que devuelven `null` (`Sectores` acepta `{ onOpen: (i: number) => void }`); la Task 9 los sustituye.

`app/page.tsx`:
```tsx
import type { Metadata } from 'next';
import Home from '@/components/home/Home';

const description = 'Diseño producto complejo desde Málaga. Nueve años en SaaS B2B e Insurtech: ordeno dominios densos y construyo design systems con reglas de decisión.';

export const metadata: Metadata = {
  title: 'Víctor Maza — Product Designer (UX/UI)',
  description,
  alternates: { canonical: '/' },
  openGraph: { title: 'Víctor Maza — Product Designer (UX/UI)', description, url: '/' },
};

export default function Page() {
  return <Home />;
}
```

Run: `npx vitest run` → PASS. `npm run build` → OK.

- [ ] **Step 8: Comprobar en el navegador**

Preview en `/`: loader cuenta hasta 100 y se funde en ~2,2 s (1,6 + 0,6 de fundido); recargar → ya no aparece. Pasar el cursor por las filas de trabajo: la imagen sigue al cursor. Clic en la fila 01: abre el modal con 6 miniaturas; "Siguiente caso" cambia al 02; "Escríbeme" cierra y baja a contacto. Clic en la fila 03 abre Ayax en pestaña nueva.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Portada: hero, casos, modal de caso y contacto

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---
### Task 9: Portada II — Casos de uso, logos y sectores

**Files:**
- Create: `public/assets/logos/{hermes,mercantil,mony,flesip,montsaint,ayax}.webp` (extraídos), `components/home/UsoIA.test.tsx`
- Modify (sustituir los vacíos): `components/home/UsoIA.tsx`, `components/home/Logos.tsx`, `components/home/Sectores.tsx`

**Interfaces:**
- Consumes: `USE_CASES`, `LOGOS`, `sectorRows` de `@/lib/data`; `Words`, `RollText`.
- Produces: `<UsoIA />`, `<Logos />`, `<Sectores onOpen />`.

- [ ] **Step 1: Extraer los logos incrustados**

```bash
node -e "
const s = require('./.image-slots.state.json');
const fs = require('fs');
for (const n of ['hermes','mercantil','mony','flesip','montsaint','ayax']) {
  const u = s['v2-logo-' + n].u;
  fs.writeFileSync('public/assets/logos/' + n + '.webp', Buffer.from(u.split(',')[1], 'base64'));
  console.log(n, fs.statSync('public/assets/logos/' + n + '.webp').size);
}"
```
Expected: seis ficheros de 2–7 KB.

- [ ] **Step 2: Test de UsoIA (falla)**

`components/home/UsoIA.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UsoIA from './UsoIA';
import { USE_CASES } from '@/lib/data';

describe('UsoIA', () => {
  it('muestra el primer caso con el primer paso abierto y cambia de pestaña', () => {
    render(<UsoIA />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(USE_CASES[0].title);
    const cards = document.querySelectorAll('.step-card');
    expect(cards[0]).toHaveClass('is-open');
    expect(cards[1]).not.toHaveClass('is-open');
    fireEvent.click(cards[1]);
    expect(cards[1]).toHaveClass('is-open');
    expect(cards[0]).not.toHaveClass('is-open');
    fireEvent.click(cards[1]);
    expect(cards[1]).not.toHaveClass('is-open');
    fireEvent.click(screen.getByText(USE_CASES[1].tab));
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(USE_CASES[1].title);
    expect(document.querySelectorAll('.step-card')[0]).toHaveClass('is-open');
  });
});
```

Run: `npx vitest run components/home/UsoIA.test.tsx` → Expected: FAIL.

- [ ] **Step 3: UsoIA.tsx**

Marcado de `index.html` líneas 134-193.

```tsx
'use client';

import { useState } from 'react';
import { USE_CASES } from '@/lib/data';
import { Words } from '@/components/effects/neat';

export default function UsoIA() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const c = USE_CASES[idx];
  return (
    <div id="casos" data-screen-label="Casos de uso" style={{ padding: 'clamp(56px, 7vw, 96px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 32, height: 1, background: '#343a4a' }} />
              <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Casos de uso</span>
            </div>
            <Words style={{ margin: '20px 0 0', fontSize: 'clamp(26px, 3.8vw, 46px)', fontWeight: 400, letterSpacing: '-0.02em' }}>Cómo resolví <span className="bebas" style={{ letterSpacing: '0.01em' }}>tareas concretas</span></Words>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {USE_CASES.map((u, i) => (
              <div key={u.tab} className={'pill-tab' + (i === idx ? ' is-active' : '')} onClick={() => { setIdx(i); setStep(0); }}>{u.tab}</div>
            ))}
          </div>
        </div>

        <div className="use-grid">
          <div>
            <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8bde5f' }}>{c.kicker}</p>
            <h3 className="bebas" style={{ margin: '14px 0 0', fontWeight: 400, fontSize: 'clamp(26px, 3.4vw, 40px)', lineHeight: 1.06 }}>{c.title}</h3>
            <p style={{ margin: '20px 0 0', fontSize: 15, lineHeight: 1.68, color: '#949494', textWrap: 'pretty' }}>{c.pitch}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 26px', marginTop: 26, paddingTop: 20, borderTop: '1px solid #2c3140', fontSize: 12.5, color: '#6d6d6d' }}>
              <span>{c.role}</span><span>{c.context}</span><span>{c.period}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 26 }}>
              {c.metrics.map((m) => (
                <div key={m.k} style={{ border: '1px solid #2c3140', borderRadius: 24, padding: '14px 18px', background: 'rgba(35,39,51,0.45)' }}>
                  <p className="bebas" style={{ margin: 0, fontSize: 28, lineHeight: 1 }}>{m.v}</p>
                  <p style={{ margin: '8px 0 0', fontSize: 11.5, lineHeight: 1.4, color: '#878787', maxWidth: 130 }}>{m.k}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {c.steps.map((s, i) => {
              const open = step === i;
              return (
                <div key={s.name} className={'step-card' + (open ? ' is-open' : '')} onClick={() => setStep(open ? -1 : i)}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 }}>
                    <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8bde5f' }}>{s.name}</p>
                    <i className={open ? 'ri-subtract-line' : 'ri-add-line'} style={{ fontSize: 15, color: '#6d6d6d' }} />
                  </div>
                  <p style={{ margin: '12px 0 0', fontSize: 14.5, lineHeight: 1.6, color: '#d6d6d6', textWrap: 'pretty' }}>{s.lead}</p>
                  <div className="step-body">
                    {s.points.map((pt) => <p key={pt} style={{ margin: '12px 0 0', paddingLeft: 16, borderLeft: '1px solid #343a4a', fontSize: 13.5, lineHeight: 1.62, color: '#949494' }}>{pt}</p>)}
                  </div>
                </div>
              );
            })}
            <div style={{ border: '1px solid #2c3140', borderRadius: 24, padding: '18px 20px', background: 'rgba(139,222,95,0.05)' }}>
              <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#878787' }}>Qué haría distinto</p>
              <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.62, color: '#a8a8a8', textWrap: 'pretty' }}>{c.learning}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Run: `npx vitest run components/home/UsoIA.test.tsx` → Expected: PASS.

- [ ] **Step 4: Logos.tsx**

Marcado de `index.html` líneas 195-209. Los que no tienen web se pintan como `<span>` (el original usaba `href="javascript:void(0)"`).

```tsx
import { LOGOS } from '@/lib/data';

export default function Logos() {
  return (
    <div data-screen-label="Sistemas" style={{ padding: 'clamp(56px, 7vw, 96px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: 1, background: '#343a4a' }} />
          <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Sistemas en los que he trabajado</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(140px, 18vw, 180px), 1fr))', gap: 'clamp(20px, 2.6vw, 36px)', marginTop: 'clamp(24px, 3vw, 36px)' }}>
          {LOGOS.map((l) => {
            const img = <img src={l.src} alt={l.name} loading="lazy" decoding="async" style={l.size === 'small' ? { maxWidth: '78%', maxHeight: 52, width: 'auto', height: 'auto', objectFit: 'contain' } : { width: '100%', height: '100%', objectFit: 'contain' }} />;
            return l.href
              ? <a key={l.id} href={l.href} target="_blank" rel="noopener" title={l.name} className="logo-cell">{img}</a>
              : <span key={l.id} title={l.name} className="logo-cell">{img}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Sectores.tsx**

Marcado de `index.html` líneas 211-238. La fila no tiene hover (los mapas de calor recogían clics muertos); el destino es un enlace visible.

```tsx
'use client';

import { sectorRows } from '@/lib/data';
import { Words } from '@/components/effects/neat';

export default function Sectores({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div id="sectores" data-screen-label="Sectores" style={{ padding: 'clamp(56px, 7vw, 96px) clamp(20px, 4vw, 64px)' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: 1, background: '#343a4a' }} />
          <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Recorrido</span>
        </div>
        <Words style={{ margin: '20px 0 0', fontSize: 'clamp(30px, 4.6vw, 58px)', fontWeight: 400, letterSpacing: '-0.02em' }}>Cinco sectores, el mismo <span className="bebas" style={{ letterSpacing: '0.01em' }}>tipo de problema</span></Words>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 'clamp(28px, 3.4vw, 44px)' }}>
          {sectorRows().map((s) => (
            <div key={s.n}>
              {s.head && <p className="sector-head">{s.head}</p>}
              <div className="sector-row">
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 999, border: '1px solid #343a4a', fontSize: 12, color: s.color }}>{s.n}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 'clamp(17px, 1.8vw, 22px)' }}>{s.name}</p>
                  <p style={{ margin: '8px 0 0', fontSize: 14.5, lineHeight: 1.6, color: '#878787', textWrap: 'pretty' }}>{s.body}</p>
                  {s.cta && (s.external
                    ? <a href={s.href} target="_blank" rel="noopener" className="sector-cta">{s.cta}</a>
                    : <a href={s.href} className="sector-cta" onClick={(e) => { e.preventDefault(); onOpen(s.caseIdx as number); }}>{s.cta}</a>)}
                </div>
                <span className="sector-year">{s.years}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

Run: `npx vitest run` → PASS. `npm run build` → OK.

- [ ] **Step 6: Comprobar en el navegador**

Preview en `/`: pestañas de casos de uso cambian el contenido; ocho logos en gris que se colorean al pasar el cursor; en Sectores, "Ver el caso ↗" de la fila 01 abre el modal del caso 0; "Ver el producto ↗" de Flesip abre pestaña nueva. Comparar a 1440 px y con `resize_window` móvil (390 px) contra producción: mismas secciones, mismo orden, mismo layout.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Portada: casos de uso, logos y sectores

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Perfil

**Files:**
- Create: `components/perfil/Perfil.tsx`, `Cabecera.tsx`, `Quien.tsx`, `Fuerte.tsx`, `FormaTrabajo.tsx`, `Competencias.tsx`, `components/perfil/Competencias.test.tsx`
- Modify: `app/perfil/page.tsx`

**Interfaces:**
- Consumes: `BIO`, `SKILLS`, `COMP_DATA`, `TOOL_GROUPS`, `SOCIAL` de `@/lib/data`; `splitBold`; `Lines`, `Words`, `ZoomBox`, `RollText`, `useSectionReveal`; `Starfield`; `Contacto`; `gsap`, `ScrollTrigger`; `isLight`.
- Produces: `<Perfil />` y las cinco secciones.

- [ ] **Step 1: Cabecera.tsx** (perfil.html líneas 58-71)

```tsx
'use client';

import Link from 'next/link';
import Starfield from '@/components/effects/Starfield';
import { Lines, RollText } from '@/components/effects/neat';

export default function Cabecera() {
  return (
    <div data-screen-label="Cabecera" data-no-reveal style={{ padding: 'clamp(130px, 16vh, 190px) clamp(20px, 4vw, 64px) clamp(48px, 6vw, 80px)' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <p className="fade" style={{ margin: '0 0 26px', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8bde5f' }}>Perfil · Product Designer (UX/UI)</p>
        <Lines lines={['Diseño sistemas,', 'no pantallas']} className="bebas" style={{ margin: 0, fontWeight: 400, fontSize: 'clamp(42px, 8vw, 112px)', lineHeight: 0.94, letterSpacing: '-0.02em' }} />
        <div className="fade" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
          <Starfield label="Escríbeme ↗" href="#contacto" rounded={100} lightSize={86} />
          <Link href="/#trabajo" className="btn-ghost"><RollText>Ver casos</RollText></Link>
        </div>
        <a className="fade cue-link" href="#quien">
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, border: '1px solid #343a4a', borderRadius: 999 }}><i className="ri-arrow-down-line" style={{ fontSize: 13, color: '#8bde5f' }} /></span>
          <RollText>Baja y te cuento</RollText>
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Quien.tsx** (líneas 73-98)

```tsx
import { BIO, SOCIAL } from '@/lib/data';
import { splitBold } from '@/lib/text';
import { ZoomBox } from '@/components/effects/neat';

export default function Quien() {
  return (
    <div id="quien" data-screen-label="Quién soy" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div className="who-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 32, height: 1, background: '#343a4a' }} />
            <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Quién soy</span>
            <span style={{ fontSize: 10.5, letterSpacing: '0.06em', color: '#4d4d4d' }}>(01)</span>
          </div>
          <ZoomBox style={{ width: '100%', maxWidth: 220, aspectRatio: '1', marginTop: 24, borderRadius: 999, overflow: 'hidden', border: '1px solid #2c3140', background: '#232733' }}>
            <img src="/assets/victor.jpg" alt="Víctor Maza" width={400} height={400} loading="lazy" decoding="async" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.06) brightness(0.94)' }} />
          </ZoomBox>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 22, maxWidth: 220 }}>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener" className="social-pill"><i className="ri-linkedin-fill" style={{ fontSize: 16, color: '#8bde5f' }} />LinkedIn</a>
            <a href={SOCIAL.behance} target="_blank" rel="noopener" className="social-pill"><i className="ri-behance-fill" style={{ fontSize: 16, color: '#8bde5f' }} />Behance</a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener" className="social-pill"><i className="ri-instagram-line" style={{ fontSize: 16, color: '#8bde5f' }} />Instagram</a>
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          {BIO.map((para) => (
            <p key={para.slice(0, 40)} style={{ margin: '0 0 22px', fontSize: 'clamp(15px, 1.3vw, 17.5px)', lineHeight: 1.72, color: '#949494', textWrap: 'pretty' }}>
              {splitBold(para).map((s, i) => <span key={i} style={s.strong ? { color: '#ececec', fontWeight: 600 } : undefined}>{s.text}</span>)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Fuerte.tsx** (líneas 100-118)

```tsx
import { SKILLS } from '@/lib/data';
import { Words } from '@/components/effects/neat';

export default function Fuerte() {
  return (
    <div data-screen-label="Fuerte" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: 1, background: '#343a4a' }} />
          <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>En qué soy fuerte</span>
          <span style={{ fontSize: 10.5, letterSpacing: '0.06em', color: '#4d4d4d' }}>(02)</span>
        </div>
        <Words style={{ margin: '20px 0 0', fontSize: 'clamp(28px, 4.2vw, 52px)', fontWeight: 400, letterSpacing: '-0.02em' }}>Lo que aporto a un <span className="bebas" style={{ letterSpacing: '0.01em' }}>equipo de producto</span></Words>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(14px, 1.8vw, 22px)', marginTop: 'clamp(28px, 3.4vw, 44px)' }}>
          {SKILLS.map((t, i) => (
            <div key={t} className="skill-card">
              <span className="bebas" style={{ fontSize: 20, color: '#8bde5f' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 14.5, lineHeight: 1.55, color: '#d6d6d6' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: FormaTrabajo.tsx** (líneas 120-154, con el efecto de proximidad de `wireProximity`)

El párrafo largo se copia **tal cual** de perfil.html línea 128 convirtiendo cada `<strong style="color: #ececec; font-weight: 500;">` en `<strong style={S}>` con `const S = { color: '#ececec', fontWeight: 500 } as const;`.

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { TOOL_GROUPS } from '@/lib/data';

const S = { color: '#ececec', fontWeight: 500 } as const;

/* Los chips se inclinan hacia el cursor: escala y color según la distancia,
   el más cercano se resalta. */
function useProximity(stage: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = stage.current;
    if (!el || isLight()) return;
    const radius = 150, maxScale = 1.13;
    const chips = () => Array.from(el.querySelectorAll<HTMLElement>('[data-tool]'));
    const onMove = (e: MouseEvent) => {
      let best: HTMLElement | null = null, bestD = Infinity;
      const data = chips().map((chip) => {
        const r = chip.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        if (d < bestD) { bestD = d; best = chip; }
        return { chip, d };
      });
      data.forEach(({ chip, d }) => {
        const pr = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0, radius, 1, 0, d));
        const near = chip === best && bestD < 90;
        chip.style.zIndex = near ? '3' : '1';
        gsap.to(chip, { scale: 1 + (maxScale - 1) * pr, y: -4 * pr, borderColor: near ? '#8bde5f' : pr > 0.5 ? '#3a3a3a' : '#262626', color: pr > 0.4 ? '#ececec' : '#a8a8a8', backgroundColor: near ? '#1d1409' : '#232733', duration: 0.4, overwrite: true, ease: 'power2.out' });
      });
    };
    const onLeave = () => {
      chips().forEach((c) => { c.style.zIndex = '1'; });
      gsap.to(chips(), { scale: 1, y: 0, borderColor: '#262626', color: '#a8a8a8', backgroundColor: '#232733', duration: 0.6, overwrite: true, ease: 'power2.out' });
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [stage]);
}

export default function FormaTrabajo() {
  const stage = useRef<HTMLDivElement>(null);
  useProximity(stage);
  return (
    <div data-screen-label="Forma de trabajo" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(28px, 4vw, 64px)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 32, height: 1, background: '#343a4a' }} />
            <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Forma de trabajo</span>
            <span style={{ fontSize: 10.5, letterSpacing: '0.06em', color: '#4d4d4d' }}>(03)</span>
          </div>
          <p style={{ margin: '22px 0 0', fontSize: 'clamp(15px, 1.3vw, 17.5px)', lineHeight: 1.72, color: '#949494', textWrap: 'pretty' }}>
            Mi proceso es <strong style={S}>iterativo y se adapta a la madurez del producto</strong>. {/* ...resto del párrafo literal de perfil.html línea 128... */}
          </p>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 32, height: 1, background: '#343a4a' }} />
            <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Herramientas</span>
          </div>
          <div ref={stage} style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 22 }}>
            {TOOL_GROUPS.map((g) => (
              <div key={g.name}>
                <p style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8bde5f' }}>{g.name}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '11px 10px' }}>
                  {g.items.map((t) => <span key={t} data-tool style={{ position: 'relative', border: '1px solid #262626', borderRadius: 999, padding: '8px 14px', fontSize: 12.5, lineHeight: 1.2, whiteSpace: 'nowrap', color: '#d6d6d6', background: '#232733', willChange: 'transform' }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 40 }}>
            <span style={{ width: 32, height: 1, background: '#343a4a' }} />
            <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Idiomas</span>
          </div>
          <p style={{ margin: '18px 0 0', fontSize: 15, lineHeight: 1.6, color: '#949494' }}>Español nativo · Inglés B1, en formación activa hacia B2</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Test de Competencias (falla)**

`components/perfil/Competencias.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Competencias from './Competencias';
import { COMP_DATA } from '@/lib/data';

describe('Competencias', () => {
  it('pinta los cuatro grupos abiertos y cada cabecera los pliega', () => {
    render(<Competencias />);
    const lists = document.querySelectorAll('.comp-list');
    expect(lists).toHaveLength(4);
    lists.forEach((l) => expect(l).not.toHaveClass('is-shut'));
    expect(screen.getByText('06 competencias')).toBeInTheDocument();
    fireEvent.click(screen.getByText(COMP_DATA[1].name));
    expect(lists[1]).toHaveClass('is-shut');
    expect(lists[0]).not.toHaveClass('is-shut');
    fireEvent.click(screen.getByText(COMP_DATA[1].name));
    expect(lists[1]).not.toHaveClass('is-shut');
  });
});
```

Run: `npx vitest run components/perfil/Competencias.test.tsx` → Expected: FAIL.

- [ ] **Step 6: Competencias.tsx** (líneas 156-186 y `wireComps`)

```tsx
'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { COMP_DATA } from '@/lib/data';
import { Words } from '@/components/effects/neat';

export default function Competencias() {
  const [shut, setShut] = useState<number[]>([]);
  const stage = useRef<HTMLDivElement>(null);

  /* Cartas apiladas: cada una se encoge y oscurece cuando la siguiente sube. */
  useEffect(() => {
    const el = stage.current;
    if (!el || isLight()) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-comp-card]'));
    const tweens = cards.map((card, i) => {
      if (i === cards.length - 1) return null;
      return gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, { scale: 0.94, filter: 'brightness(0.62)', ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top 85%', end: 'top 30%', scrub: true } });
    });
    return () => tweens.forEach((t) => t?.scrollTrigger?.kill());
  }, []);

  const toggle = (gi: number) => {
    setShut((s) => (s.includes(gi) ? s.filter((x) => x !== gi) : [...s, gi]));
    setTimeout(() => ScrollTrigger.refresh(), 0);
  };

  return (
    <div data-screen-label="Competencias" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: 1, background: '#343a4a' }} />
          <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Competencias clave</span>
          <span style={{ fontSize: 10.5, letterSpacing: '0.06em', color: '#4d4d4d' }}>(04)</span>
        </div>
        <Words style={{ margin: '20px 0 0', fontSize: 'clamp(26px, 3.8vw, 46px)', fontWeight: 400, letterSpacing: '-0.02em' }}>Lo que sé <span className="bebas" style={{ letterSpacing: '0.01em' }}>hacer</span></Words>
        <div ref={stage} style={{ position: 'relative', marginTop: 'clamp(14px, 2vw, 26px)' }}>
          {COMP_DATA.map((g, gi) => {
            const closed = shut.includes(gi);
            return (
              <div key={g.name} className="comp-slot" style={{ zIndex: gi + 1 }}>
                <div data-comp-card className="comp-card" style={{ '--i': gi } as CSSProperties}>
                  <div onClick={() => toggle(gi)} style={{ cursor: 'pointer', display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingBottom: 18, borderBottom: '1px solid #262626' }}>
                    <p className="bebas" style={{ margin: 0, fontSize: 'clamp(24px, 2.8vw, 36px)', lineHeight: 1.1 }}>{g.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <p style={{ margin: 0, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8bde5f' }}>{String(g.items.length).padStart(2, '0')} competencias</p>
                      <i className={closed ? 'ri-add-line' : 'ri-subtract-line'} style={{ fontSize: 18, color: closed ? '#4d4d4d' : '#8bde5f', transition: 'color 0.3s ease' }} />
                    </div>
                  </div>
                  <div className={'comp-list' + (closed ? ' is-shut' : '')}>
                    {g.items.map(([lead, rest], i) => (
                      <div key={lead} style={{ display: 'grid', gridTemplateColumns: '30px minmax(0, 1fr)', gap: 12, alignItems: 'baseline' }}>
                        <span style={{ fontSize: 11, color: '#4d4d4d' }}>{gi + 1}.{i + 1}</span>
                        <p style={{ margin: 0, fontSize: 'clamp(13.5px, 1.1vw, 15px)', lineHeight: 1.58, color: '#949494', textWrap: 'pretty' }}><span style={{ color: '#ececec' }}>{lead}</span>{rest}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

Run: `npx vitest run components/perfil/Competencias.test.tsx` → Expected: PASS.

- [ ] **Step 7: Perfil.tsx y app/perfil/page.tsx**

`components/perfil/Perfil.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { isLight } from '@/lib/motion';
import { useSectionReveal } from '@/components/effects/neat';
import Cabecera from './Cabecera';
import Quien from './Quien';
import Fuerte from './Fuerte';
import FormaTrabajo from './FormaTrabajo';
import Competencias from './Competencias';
import Contacto from '@/components/Contacto';

export default function Perfil() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (isLight()) gsap.from('.fade', { opacity: 0, y: 12, duration: 0.5, stagger: 0.05, ease: 'power2.out' });
    else gsap.from('.fade', { opacity: 0, y: 24, filter: 'blur(8px)', duration: 1, stagger: 0.1, ease: 'power3.out' });
    setReady(true);
  }, []);
  useSectionReveal(ready);
  return (
    <div className="page">
      <Cabecera />
      <Quien />
      <Fuerte />
      <FormaTrabajo />
      <Competencias />
      <Contacto variant="perfil" />
    </div>
  );
}
```

`app/perfil/page.tsx`:
```tsx
import type { Metadata } from 'next';
import Perfil from '@/components/perfil/Perfil';

const description = 'Perfil de Víctor Maza: Product Designer de oficio, nueve años ordenando dominios densos en SaaS B2B e Insurtech. Herramientas, método y casos.';

export const metadata: Metadata = {
  title: 'Sobre mí — Víctor Maza',
  description,
  alternates: { canonical: '/perfil' },
  openGraph: { title: 'Sobre mí — Víctor Maza', description, url: '/perfil' },
};

export default function Page() {
  return <Perfil />;
}
```

Run: `npx vitest run` → PASS. `npm run build` → OK.

- [ ] **Step 8: Comprobar en el navegador**

Preview en `/perfil`: el h1 entra línea a línea; retrato con zoom al pasar el cursor; chips de herramientas reaccionan al cursor; cartas de competencias se apilan al hacer scroll y se pliegan al clic; "Ver casos" lleva a `/#trabajo` sin recarga y baja a la sección. Comparar a 1440 px y 390 px contra `proyectos-theta-hazel.vercel.app/perfil.html`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Perfil: cabecera, quien soy, fuerte, forma de trabajo y competencias

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---
### Task 11: Privacidad

**Files:**
- Create: `components/ConsentState.tsx`, `components/ConsentState.test.tsx`
- Modify: `app/privacidad/page.tsx`

**Interfaces:**
- Consumes: `readConsent`, `resetConsent` de `@/lib/consent`.
- Produces: `<ConsentState />` (estado actual + botón "Cambiar mi decisión"); página `/privacidad` con `robots: noindex, follow`.

- [ ] **Step 1: Test (falla)**

`components/ConsentState.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConsentState from './ConsentState';
import { CONSENT_KEY } from '@/lib/consent';

vi.mock('@/lib/consent', async (orig) => ({ ...(await orig<typeof import('@/lib/consent')>()), resetConsent: vi.fn() }));
import { resetConsent } from '@/lib/consent';

describe('ConsentState', () => {
  it('refleja la decisión guardada', () => {
    const { unmount } = render(<ConsentState />);
    expect(screen.getByText('sin decidir')).toBeInTheDocument();
    unmount();
    localStorage.setItem(CONSENT_KEY, 'granted');
    render(<ConsentState />);
    expect(screen.getByText('aceptadas')).toBeInTheDocument();
  });
  it('el botón deshace la decisión', () => {
    render(<ConsentState />);
    fireEvent.click(screen.getByRole('button', { name: 'Cambiar mi decisión' }));
    expect(resetConsent).toHaveBeenCalled();
  });
});
```

Run: `npx vitest run components/ConsentState.test.tsx` → Expected: FAIL.

- [ ] **Step 2: ConsentState.tsx**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { readConsent, resetConsent } from '@/lib/consent';

const LABEL = { granted: 'aceptadas', denied: 'rechazadas' } as const;

/* Refleja la decisión guardada y permite deshacerla. */
export default function ConsentState() {
  const [state, setState] = useState('sin decidir');
  useEffect(() => { const c = readConsent(); setState(c ? LABEL[c] : 'sin decidir'); }, []);
  return (
    <div className="cookie-box">
      <p>Tu decisión actual: <span className="state">{state}</span></p>
      <button type="button" className="btn" onClick={resetConsent}>Cambiar mi decisión</button>
    </div>
  );
}
```

Run: `npx vitest run components/ConsentState.test.tsx` → Expected: PASS.

- [ ] **Step 3: app/privacidad/page.tsx**

Convertir el `<main>` y el `<footer>` de `privacidad.html` (líneas 81-200) a JSX **sin cambiar ni una palabra**: `class` → `className`, `<br>` → `<br />`, `style="margin-top: 14px; font-size: 13px;"` → `style={{ marginTop: 14, fontSize: 13 }}`, `<a href="index.html">` → `<Link href="/">`, `perfil.html` → `/perfil`, `privacidad.html` → `/privacidad`. La `.cookie-box` se sustituye por `<ConsentState />`.

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import ConsentState from '@/components/ConsentState';

export const metadata: Metadata = {
  title: 'Privacidad y cookies — Víctor Maza',
  description: 'Qué datos recoge esta web, con qué herramientas, para qué, y cómo cambiar tu decisión sobre las cookies.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/privacidad' },
};

export default function Page() {
  return (
    <div className="legal page">
      <main>
        <p className="kicker"><span>Legal</span></p>
        <h1>Privacidad y cookies</h1>
        <p className="updated">Última actualización: 11 de septiembre de 2026</p>
        <p className="lead">{/* texto literal */}</p>
        <section id="responsable">{/* ... */}</section>
        <section id="datos">{/* ... .tools con los 7 .tool ... */}</section>
        <section id="cookies">
          {/* h2, p, .table-wrap con la tabla literal */}
          <ConsentState />
          <p style={{ marginTop: 14, fontSize: 13 }}>{/* texto literal */}</p>
        </section>
        <section id="terceros">{/* ... */}</section>
        <section id="conservacion">{/* ... */}</section>
        <section id="derechos">{/* ... */}</section>
        <section id="cambios">{/* ... */}</section>
      </main>
      <footer>
        <div>
          <span>© 2026 Víctor Maza · Málaga, España</span>
          <span><Link href="/">Inicio</Link> · <Link href="/perfil">Sobre mí</Link> · <Link href="/privacidad">Privacidad</Link></span>
        </div>
      </footer>
    </div>
  );
}
```

Run: `npm run build` → OK. En el HTML generado (`.next/server/app/privacidad.html`) debe aparecer `<meta name="robots" content="noindex, follow"`.

- [ ] **Step 4: Comprobar en el navegador**

Preview en `/privacidad`: mismo aspecto que `privacidad.html` en producción; el nav no muestra "Escríbeme"; "Cambiar mi decisión" borra la clave y recarga mostrando el banner a los 2 s. Desde la portada, el enlace "Cookies" del pie reabre el banner.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Pagina de privacidad y cookies

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 12: Retirar los ficheros del runtime antiguo y reescribir el README

**Files:**
- Delete: `index.html`, `perfil.html`, `privacidad.html`, `support.js`, `image-slot.js`, `.image-slots.state.json`, `consent.js`, `neat-effects.js`
- Modify: `README.md`

- [ ] **Step 1: Comprobar que nada los referencia**

Run: `grep -rn "support.js\|image-slot\|consent.js\|neat-effects\|\.html\"" app components lib --include=*.ts --include=*.tsx`
Expected: sin resultados (los `.html` solo pueden aparecer en `next.config.ts`).

- [ ] **Step 2: Borrar**

```bash
git rm index.html perfil.html privacidad.html support.js image-slot.js .image-slots.state.json consent.js neat-effects.js
```

- [ ] **Step 3: README.md**

Sustituir por:

````markdown
# Víctor Maza — Portfolio

Landing, perfil y política de privacidad de Víctor Maza (Product Designer
UX/UI, Málaga). Next.js 16 (App Router) desplegado en Vercel.

## Estructura

```
app/                 Rutas: / (portada), /perfil, /privacidad. layout.tsx mantiene
                     Nav, fuentes, banner de consentimiento y scripts de efectos.
components/          Secciones de cada página, Nav, Loader, ConsentBanner, Contacto.
components/effects/  RollText, Words, Lines, ZoomBox, useSectionReveal (antes
                     neat-effects.js) y Starfield (envoltorio del custom element).
lib/data.ts          Todos los textos: casos, logos, sectores, casos de uso, bio,
                     competencias, herramientas. Editar aquí para cambiar contenido.
lib/consent.ts       Consentimiento y arranque de GA4, Clarity, Hotjar, Plerdy y HubSpot.
public/assets/       h-card/ y h-thumb/ (capturas del modal), logos/, victor.jpg, og.png.
                     hermes/ y hero-bg.mp4 no se usan.
public/effects/      starfield-button.js y cursor-ring-field.js (custom elements sin cambios).
docs/superpowers/    Spec y plan de la migración.
```

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # vitest
npm run build
```

## Navegación

Los enlaces internos son `<Link>`: no hay recarga entre páginas. `app/template.tsx`
anima la entrada de cada página. El loader de la portada dura 1,6 s y solo se
muestra en la primera visita de la sesión (`sessionStorage['vm-loader']`) en
escritorio.

Las rutas antiguas `/index.html`, `/perfil.html` y `/privacidad.html` redirigen
(301) a las nuevas.

## Despliegue

Vercel, proyecto `proyectos`. `vercel.json` fija el framework a Next.js. Cada
push a `main` despliega.

## Analítica

Cinco servicios detrás del mismo consentimiento (`localStorage['vm-consent']`,
`granted` / `denied`). Ninguno arranca hasta que el visitante acepta; si rechaza
no se pide ningún recurso externo. Clarity, Hotjar y Plerdy no arrancan en local.

| Servicio | Identificador |
|---|---|
| Google Analytics 4 | `G-HZYDMMSVG5` |
| Microsoft Clarity | `yd4g6685po` |
| Hotjar | `6776849` |
| Plerdy | `_suid` `81035` |
| HubSpot (EU) | portal `148496979` |

Al navegar sin recarga, `AnalyticsPageView` envía `page_view` a GA4 en cada
cambio de ruta. `window.vmConsentReset()` reabre el banner.

## Metadatos

`<title>`, description, canonical, Open Graph y `twitter:card` se definen con
`metadata` en cada `page.tsx`. La imagen de previsualización es `public/assets/og.png`.
````

- [ ] **Step 4: Verificación completa**

Run: `npx vitest run` → PASS. Run: `npm run build` → OK, sin warnings de tipos.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Retirar el runtime de Claude Design y documentar el proyecto Next.js

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 13: Verificación final en producción local y despliegue

**Files:** ninguno nuevo.

- [ ] **Step 1: Build de producción y redirects**

```bash
npm run build
```
Arrancar `next start` con la herramienta de preview (añadir a `.claude/launch.json` una configuración `{"name":"start","runtimeExecutable":"npm","runtimeArgs":["run","start"],"port":3000}`) y comprobar:
- `curl -sI http://localhost:3000/perfil.html | head -3` → `HTTP/1.1 308` (o 301) con `location: /perfil`.
- Igual para `/index.html` → `/` y `/privacidad.html` → `/privacidad`.

- [ ] **Step 2: Lista de verificación en el navegador (con `next start`)**

1. `/` primera visita (sessionStorage limpio, escritorio): loader ≤ 1,7 s hasta empezar a fundirse; intro del hero después.
2. Clic "Sobre mí" → `performance.getEntriesByType('navigation').length === 1`, URL `/perfil`, nav sin parpadeo, contenido entra con la transición.
3. En `/perfil`, clic en el logo VM → vuelve a `/` sin recarga y sin loader.
4. `/perfil` → "Ver casos" → `/#trabajo`, baja hasta la sección.
5. Banner: `localStorage.clear()` + recarga en `/perfil` → banner a ~2 s. Rechazar → `performance.getEntriesByType('resource').filter(r => /googletagmanager|clarity\.ms|hotjar|plerdy|hs-scripts/.test(r.name)).length === 0`. `localStorage.clear()` + recarga + Aceptar → aparecen `gtag/js` y `js-eu1.hs-scripts.com`.
6. Modal de caso: abre, 6 miniaturas cambian la captura, "Siguiente caso" cicla 01→02→01, "Escríbeme" cierra y baja a contacto, el aspa cierra.
7. `resize_window` a 390 px: `/` y `/perfil` sin scroll horizontal, sectores en una columna, pie en una columna, sin loader al recargar.
8. Consola sin errores en las tres rutas (`read_console_messages` con `onlyErrors`).
9. Capturas a 1440 px de `/`, `/perfil` y `/privacidad` junto a las de producción: mismas secciones y mismo orden.

Si algo falla: leer el componente implicado, corregir, volver a `npm run build` y repetir el punto.

- [ ] **Step 3: Lighthouse**

En el navegador de la app no hay Lighthouse; usar `npx lighthouse http://localhost:3000 --preset=desktop --only-categories=performance --quiet --chrome-flags="--headless" --output=json --output-path=./lh.json` y leer `categories.performance.score` (≥ 0.9). Borrar `lh.json` después. Si el comando no encuentra Chrome, saltar este paso y anotarlo en el informe final.

- [ ] **Step 4: Push**

```bash
git push origin main
```

Después del push: comprobar en https://vercel.com/tts-projects-fb155959 que el despliegue arranca con framework Next.js. Si el build de Vercel falla por preset, el propietario cambia Settings → Build & Development → Framework Preset a **Next.js** y redespliega. Cuando el despliegue esté listo, repetir los puntos 2, 5 y 6 del Step 2 sobre https://proyectos-theta-hazel.vercel.app/ (en producción Clarity, Hotjar y Plerdy sí deben arrancar al aceptar).
