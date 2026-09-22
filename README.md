# Víctor Maza — Portfolio

Portada con catálogo de proyectos, cinco casos de estudio, "sobre mí" y política
de privacidad de Víctor Maza (Product Designer B2B SaaS e Insurtech, Málaga).
Next.js 16 (App Router) desplegado en Vercel. Sistema visual claro con tokens
propios; estructura tipo catálogo con filtros y páginas de caso.

## Estructura

```
app/                 Rutas: / (portada), /casos/[slug] (cinco casos estáticos), /sobre-mi,
                     /privacidad, robots.ts y sitemap.ts. layout.tsx: Geist, skip link,
                     MotionProvider, SmoothScroll (Lenis), banner de consentimiento, JSON-LD.
lib/content/         Todo el contenido: site.ts (nav, email, redes), projects.ts (catálogo
                     y filtros), cases/*.ts (un archivo por caso), about.ts (sobre mí),
                     shots.ts (dimensiones de capturas). Editar aquí para cambiar textos.
lib/motion/          prefs.ts (gating por prefers-reduced-motion y pointer: coarse),
                     useScrollDirection.ts.
components/ui/       Primitivas del sistema: Button, Chip, Kicker, TwoToneHeading, Inset,
                     Frame, SectionHeader, Metric, FactStrip, Figure, Disclosure, CodeDemo.
components/layout/   SiteHeader (se esconde al bajar), SiteFooter, SkipLink.
components/home/     Hero, HeroInset (crece con el scroll), LogoMarquee, Manifesto,
                     Closing (+ Starfield).
components/catalog/  Catalog (filtro en ?f=), FilterChips, ProjectCard, BrandTile.
components/case/     Plantilla de caso: CasePage, CaseHero, DecisionBlock, ResultBlock, NextCase.
components/about/    AboutPage, IkigaiDiagram, CompanyTabs, CityChips, Polaroid.
components/diagrams/ Ocho diagramas SVG animados (Diagram.tsx los expone por id).
components/motion/   MotionProvider, SmoothScroll, ScaleIn, Reveal.
public/assets/shots/ Capturas en WebP ≤ 1600 px + manifest.json (generadas con npm run images).
public/assets/logos/ Logos de empresas. victor.jpg, og.png.
scripts/             build-images.mjs (sharp), audit.mjs (Playwright + axe).
docs/superpowers/    Spec y plan del rediseño. docs/auditoria/: diagnóstico y re-auditoría.
```

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # vitest
npm run build
npm run images   # regenera public/assets/shots desde las fuentes
npm run audit    # axe + métricas en /, /casos/hermes y /sobre-mi (con el servidor arrancado)
```

## Navegación

Los enlaces internos son `<Link>`. El filtro del catálogo vive en la URL
(`/?f=insurtech`) y se escribe con `history.replaceState`. El cambio card → caso
usa `<ViewTransition>` de React. Todo el motion (Lenis, ScrollTrigger, motion) se
apaga con `prefers-reduced-motion`; los efectos de scroll también con puntero táctil.

Las rutas antiguas `/index.html`, `/perfil`, `/perfil.html` y `/privacidad.html`
redirigen (308) a las nuevas.

## Despliegue

Vercel, proyecto `proyectos`. `vercel.json` fija el framework a Next.js. Cada
push a `main` despliega.

## Analítica

Dos servicios detrás del mismo consentimiento (`localStorage['vm-consent']`,
`granted` / `denied`). Ninguno arranca hasta que el visitante acepta; si rechaza
no se pide ningún recurso externo. Clarity no arranca en local.

| Servicio | Identificador |
|---|---|
| Google Analytics 4 | `G-HZYDMMSVG5` |
| Microsoft Clarity | `yd4g6685po` |

Con navegación sin recarga, GA4 registra los cambios de página mediante la
medición mejorada; no se envía `page_view` a mano. `window.vmConsentReset()`
reabre el banner.

## Metadatos

`<title>`, description, canonical, Open Graph y `twitter:card` se definen con
`metadata` en cada `page.tsx` (`lib/seo.ts`). JSON-LD `Person` en el layout y
`CreativeWork` en cada caso. `robots.txt` y `sitemap.xml` se generan desde `app/`.
La imagen de previsualización es `public/assets/og.png` (pendiente de regenerar
con el sistema nuevo).
