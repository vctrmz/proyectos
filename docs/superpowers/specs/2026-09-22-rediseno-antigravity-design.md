# Rediseño del portfolio — estructura Felipe Cardona, sistema Antigravity

**Fecha:** 2026-09-22 · **Rama:** `redesign/antigravity` · **Base:** `proyectos-web` (Next.js 16, React 19, GSAP)
**Origen:** auditoría `docs/auditoria/2026-09-21-diagnostico.md` + referencias felipecardona.com y antigravity.google.
**Estado:** diseño aprobado por Víctor el 2026-09-22.

## 1. Objetivo

Que el portfolio demuestre "sé entender complejidad, convertirla en sistemas y llevar esos sistemas a producción" con:

- la **estructura** de felipecardona.com: hero corto → catálogo único con filtros → páginas de caso con plantilla estable → "sobre mí" en primera persona;
- el **sistema visual y los efectos** de antigravity.google: fondo blanco, tinta negra, titulares a dos tonos, bloques oscuros insertados con radio 36 px, marcos con glow, inset que crece con el scroll, header que se esconde, smooth scroll;
- **transiciones fluidas en React**: View Transitions (ruta), `motion` (catálogo, Ikigai), GSAP ScrollTrigger + Lenis (scroll).

Restricciones: no inventar métricas, clientes ni resultados; conservar todo el contenido real de `lib/data.ts`; accesible (WCAG AA, teclado, reduced-motion); rápido (LCP < 2 s).

## 2. Rutas

| Ruta | Contenido | Notas |
|---|---|---|
| `/` | Portada | Acepta `?f=<filtro>` |
| `/casos/[slug]` | `hermes`, `suscripcion`, `editor-propuesta`, `vista-360`, `design-system` | `generateStaticParams`; metadata por caso |
| `/sobre-mi` | Sustituye a `/perfil` | 308 desde `/perfil` y `/perfil.html` |
| `/privacidad` | Se mantiene, restilado con los tokens | — |

Se elimina `CasoModal`. Landmarks en todas las páginas: `<header>`/`<nav>`, `<main>`, `<section aria-labelledby>`, `<footer>`, skip link `#contenido`.

## 3. Sistema visual

### Color (CSS variables en `:root`)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#ffffff` | fondo de página |
| `--ink` | `#121317` | texto principal, botón sólido |
| `--ink-2` | `#45474d` | segunda línea de titulares, texto secundario |
| `--ink-3` | `#6a6a71` | metadatos (≥ 4,5:1 sobre blanco; mínimo permitido) |
| `--surface` | `#f8f9fc` | pills, cards, fondo de marcos |
| `--line` | `rgba(183,191,217,.18)` | hairlines |
| `--inset-bg` | `#1b1e27` | bloques oscuros insertados |
| `--inset-ink` | `#ececec` | texto en insets |
| `--accent` | `#8bde5f` | **solo** dentro de insets (contraste 10:1 sobre `--inset-bg`) |
| `--glow` | `linear-gradient(135deg, #4a44f2, #8bde5f, #f8f9fc)` a 12 % | detrás de `Frame` |
| `--focus` | `#4a44f2` | anillo de foco 2 px + offset 3 px |

Ningún texto por debajo de `--ink-3`. Los colores de marca de cada proyecto (`brand`) solo se usan como fondo de la imagen 4:3 de su card.

### Tipografía

Geist (next/font, pesos 400 y 500; display con `font-variation-settings: 'wght' 450`). Escala en rem:

`--fs-100` 12.5 · `--fs-200` 14.5 · `--fs-300` 16 · `--fs-400` 17.5 · `--fs-500` 20 · `--fs-600` 24 · `--fs-700` 28 · `--fs-800` clamp(32, 4vw, 42) · `--fs-900` clamp(36, 5vw, 54) · `--fs-1000` clamp(44, 7vw, 80) · `--fs-1100` clamp(56, 9vw, 107)

Tracking: `-0.02em` de 28 px en adelante, `-0.03em` en display. Interlineado 1.1 display, 1.25 titulares, 1.55 texto. Piso: 12,5 px para metadatos, 14,5 px para lectura. Kickers en mayúsculas solo a 12,5 px con tracking 0,08em. Bebas Neue, Montserrat y Remixicon se retiran.

### Espaciado, radios, contenedor

Escala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Secciones: 96/128 px desktop, 64 móvil. Contenedor 1.200 px, gutter `clamp(20px, 4vw, 72px)`. Radios: `--r-media` 36, `--r-card` 16, `--r-pill` 9999. Los insets llevan `margin-inline: 8px` en desktop. Sombras: una sola, `0 2px 4px rgba(49,49,49,.10)` para chips; ninguna en cards (hairline).

### Componentes (`components/ui/`)

`Button` (solid · outline · ghost; md 44 px · lg 52 px; `as` link/button) · `Chip` (filtro con contador, `aria-pressed`) · `Kicker` · `TwoToneHeading` (h1/h2, línea 1 `--ink`, línea 2 `--ink-2`) · `Inset` (bloque oscuro 36 px) · `Frame` (marco 36 px con glow opcional) · `CaseCard` · `FactStrip` · `Metric` (cifra + significado) · `Figure` (next/image + caption) · `Diagram` (SVG animado) · `CodeDemo` (bloque de código con etiqueta "Ejemplo ilustrativo") · `Disclosure` (`<details>`) · `SectionHeader` · `LogoMarquee` · `SiteHeader` · `SiteFooter` · `Closing`.

Regla: cero `style={{}}` salvo valores dinámicos (colores de marca, índices). CSS Modules + tokens globales.

## 4. Portada

| Orden | Sección | Contenido | Efecto |
|---|---|---|---|
| 1 | Header | VM · Trabajo · Sobre mí · [Contactar] | fijo; se esconde al bajar (translateY) y vuelve al subir |
| 2 | Hero (≤ 640 px) | Kicker "Product Designer · B2B SaaS · Insurtech" · H1 dos tonos "Convierto reglas de negocio / en producto que llega a producción." · sub "Nueve años en SaaS asegurador, ERP y banca. Málaga · disponible desde septiembre de 2026" · [Ver el caso HERMES] [Contactar] | entrada 0,5 s opacity+y; H1 estático |
| 3 | Inset HERMES | Captura hero de HERMES (desde `assets/hermes/`, optimizada) en `Inset` | `scale 0.5 → 1` con scrub (GSAP), radio constante |
| 4 | FactStrip | 165 pantallas en producción · 8 áreas de producto · 5 productos, un lenguaje · 2022–2026 único diseñador | reveal |
| 5 | LogoMarquee | Atrinium · Flesip · Montsaint · Mercantil · Mony · Taksio · Wakari · Linikit · Ayax en pills `--surface`, logo 18 px alto en `--ink-3`, monocromo, marquee CSS lento (60 s), pausa al hover, sin color al hover | CSS `@keyframes`; estático en reduced-motion |
| 6 | Manifiesto | "Diseño producto B2B donde un error operativo cuesta dinero. Diseñé reglas en lugar de casos." | tecleo guiado por scroll (ScrollTrigger scrub sobre `clip`/caracteres); texto completo en SSR |
| 7 | Catálogo | Chips + grid (§5) | `motion` layout |
| 8 | Cierre | `Inset` con starfield de fondo: "¿Tienes un producto complejo?" · Problema: complejidad B2B · Método: UX + sistema + UI + implementación · Evidencia: nueve años, SaaS asegurador en producción · [Contactar] [LinkedIn ↗] | starfield canvas solo aquí, solo `pointer: fine`, sin reduced-motion |
| 9 | Footer | © 2026 Víctor Maza · Málaga · Privacidad · Cookies | — |

Objetivos: primera captura de HERMES a ≤ 750 px; altura total ≤ 6.000 px a 1280.

## 5. Catálogo y filtros

**Piezas (`lib/content/projects.ts`)**

| slug | Título · Empresa · Año | type | status | sector | hasCase |
|---|---|---|---|---|---|
| hermes | HERMES, plataforma aseguradora · Atrinium · 2022–2026 | case | production | insurtech | sí |
| suscripcion | Módulo de suscripción de cliente · HERMES Admin · 2025 | case | production | insurtech | sí |
| editor-propuesta | Editor de propuesta con TipTap · HERMES Admin · 2025 | case | production | insurtech | sí |
| vista-360 | Vista 360 del cliente · Atrinium · 2026 | case | production | insurtech | sí |
| design-system | Design system: 267 → 24 tokens · Atrinium · 2024 | design-system | production | multi | sí |
| flesip | Facturación electrónica · Flesip · 2024–2025 | product | production | erp | no (externo) |
| montsaint | Catálogo y checkout · Montsaint · 2023–2025 | product | production | ecommerce | no (externo) |
| mercantil | Banca digital y app Mony · Mercantil Panamá · 2020–2022 | product | production | banca | no (diagrama) |
| taksio | Plataforma de movilidad · Taksio · 2018–2019 | product | production | transporte | no (diagrama) |
| ayax | Landing · Ayax · 2026 | landing | production | — | no (externo) |

**Filtros**: `todo` (defecto) · `casos` (type=case) · `produccion` (status) · `design-system` · `insurtech` · `erp` · `banca` · `ecommerce` · `transporte` · `landing`. Cada chip muestra su contador. Selección única. Estado en `?f=`; sin parámetro = todo; parámetro desconocido = todo.

**Interacción**: chips `role="radiogroup"` / `role="radio"` + `aria-checked`; `aria-live="polite"` anuncia "N proyectos"; cards `<a>` con `layout` y `layoutId` (`motion`), salida `opacity 0 / scale .98` 200 ms, entrada escalonada 40 ms. Orden fijo por tabla.

**Card**: icono de empresa (SVG 24 px) + `Título · Empresa · Año` (h3) · tags separados por `·` · una frase · imagen 4:3 dentro de `Frame` con fondo `brand` · botón "Ver caso" si `hasCase`; si no, toda la card enlaza al sitio (externo, ↗) o, sin sitio, no enlaza.

## 6. Página de caso

Plantilla única (`components/case/`):

1. `← Trabajo` (vuelve conservando `?f`)
2. Icono + H1 `Título · Empresa` · frase de una línea · tags · año
3. `Inset` hero con captura a sangre — objetivo de View Transition `case-{slug}` desde la card
4. **Contexto | Rol | Entrega** (tres columnas)
5. **Problema** — dos frases en `--fs-700`, `--ink-2`
6. **Complejidad** — `Diagram`
7. **Decisiones** — 3–5 bloques "decisión → por qué → qué cambió", cada uno con `Frame` (captura o diagrama)
8. **Sistema** — tokens, componentes, reglas; `CodeDemo`
9. **Diseño** — galería de `Figure` con captions (las capturas actuales con sus captions)
10. **Implementación** — cómo llegó a producción y con quién
11. **Resultado** — tres columnas: Output · Outcome (con "Dato no disponible" donde no haya) · Qué mediría hoy
12. **Aprendizajes** — dos frases
13. Siguiente caso → · [Contactar]

Secciones 8 y 10 dentro de `Disclosure` abierto por defecto en desktop, cerrado en móvil.

**Contenido por caso** (todo procede de `data.ts`; se reestratifica, no se reescribe la voz):

- `hermes`: `USE_CASES[0]` (terreno, lograr, hice, acabó, métricas 165/8/60→14, aprendizaje) + bio (5 idiomas, 7 locales, paleta por cliente, migración) + tokens 267→24. Diagramas: clientes → sistema; mapa 8 áreas; 60 → 14. CodeDemo: cuestionario de ramo declarado como dato. Outcome: **Dato no disponible**; "Qué mediría": del aprendizaje.
- `suscripcion`: `WORKS[0]` (STAR + team + facts 5 semanas · 267→24 · 3 fases/6 roles). Diagrama: máquina de estados 3 fases / 6 roles. CodeDemo: fase como objeto `{ fase, audiencia, salida }`. Se retira "70 % del flujo en Fase 1" salvo aclaración.
- `editor-propuesta`: `WORKS[1]`. Diagrama: plantilla con huecos (variables `@`, componentes `/`, bloques opcionales). Se retiran las métricas 0 / 100 % / 2.
- `vista-360`: `USE_CASES[1]`. Diagrama: rejilla 12 → 4 → 1.
- `design-system`: bio + team "Pensamiento sistémico" + "Diseño reutilizable". Diagrama: ciclo sistema ↔ módulo; tabla 267 → 24. CodeDemo: token semántico resuelto por tenant.

Cifras del CV no publicadas en la web (12 idiomas y locales, 347 permisos, ciclo 5 → 2 días, tickets) **solo si Víctor las confirma**; hasta entonces no aparecen.

**CodeDemo**: bloques de ≤ 15 líneas, sintaxis real (JSON/TS), etiqueta "Ejemplo ilustrativo", sin ejecutar nada. **Diagram**: SVG inline, entra una vez al ser visible (`motion`), estático con reduced-motion, `role="img"` + `aria-label`.

## 7. Sobre mí (`/sobre-mi`)

1. Polaroid (foto `assets/victor.jpg`, pie manuscrito "Víctor Maza") — sin fuente manuscrita externa: Geist itálica ligera.
2. **Personal** — frases cortas en primera persona con chips inline: "Soy Víctor, Product Designer. Vivo en **Málaga**. Nací en Venezuela: **Cumaná**, **Caracas**, **Zulia**. En España he vivido en **Jaén**, **Madrid**, **Lleida** y **Barcelona**." Años solo donde consten (Málaga 2022–; el resto sin año).
3. **Lugares** — polaroids; el bloque no se renderiza hasta que haya fotos en `content/about.ts`.
4. **Formación** — "Licenciatura en Informática · Universidad de Oriente, Cumaná · 2006–2017" + "Informático de formación, Product Designer de oficio."
5. **Ikigai** — `IkigaiDiagram`: tres círculos SVG (design · tech · business) con degradados que se desplazan lentamente (animación de `gradientTransform`), leve respiración (scale 1 → 1.03), al hover/focus de un círculo se resalta su intersección y aparece su frase; la intersección central "product design" late. Frases: tech "Informático de formación: sé cómo se construye lo que diseño."; design "Product Designer de oficio: nueve años en producto B2B."; business "Reglas de negocio, discovery con Product Owners y decisiones defendidas en lenguaje de negocio." Accesible por teclado; estático con reduced-motion; `<figcaption>` con el texto completo.
6. **Empresas** — tabs Atrinium (2022–2026) · Mercantil Panamá (2020–2022) · Taksio (2017–2019) → párrafo corto de la bio + enlace al caso o al producto.
7. **Mi visión** — "Diseño sistemas, no pantallas." + tres párrafos recortados de `BIO`.
8. Contacto — [Email] (copiar) · [LinkedIn ↗].

Competencias: de 22 a 8 (las que tienen evidencia en los casos), en una lista de dos columnas dentro de "Mi visión". Herramientas: solo Figma, FigJam, prototipado, Chakra UI, Tailwind, React, GitHub, Vercel, Clarity, GA4, Maze, Mobbin, Claude.

## 8. Motion

| Herramienta | Uso | Gating |
|---|---|---|
| Lenis | smooth scroll | off con `prefers-reduced-motion` y `pointer: coarse` |
| GSAP ScrollTrigger | inset que crece, header, manifiesto, reveals | idem |
| `motion` | catálogo (layout/presence), Ikigai, hover de cards | reduced-motion → `MotionConfig reducedMotion="user"` |
| View Transitions | ruta card → caso (`experimental.viewTransition`, `<ViewTransition name>`); fallback: navegación normal | nativo del navegador |
| CSS | marquee, focus, hover | `@media (prefers-reduced-motion)` |

Solo `transform` y `opacity`; `will-change` únicamente mientras dura la interacción. Sin loader, sin cursor custom, sin rotador de palabras, sin canvas salvo el starfield del cierre.

## 9. Contenido y datos

```
lib/content/site.ts        nav, email, social, disponibilidad
lib/content/projects.ts    catálogo (tabla §5) + filtros + helpers
lib/content/cases/*.ts     un archivo por caso (secciones §6)
lib/content/about.ts       personal, lugares, formación, ikigai, empresas, visión
lib/data.ts                se conserva hasta migrar; después se elimina
```

Imágenes: `public/assets/cases/<slug>/hero.webp` (≤ 1600 px) y galería en WebP; `assets/hermes/*.png` y `hero-bg.mp4` se eliminan del repo tras generar los WebP. Logos en SVG monocromo en `public/assets/logos/mono/`.

## 10. Accesibilidad, rendimiento, SEO

- WCAG AA: contraste, `:focus-visible` global, targets ≥ 44 px, `aria-*` en chips y tabs, orden de foco, skip link, `alt` real en capturas.
- Presupuestos: LCP < 2 s (hero sin imagen bloqueante; inset con `priority`), CLS < 0,05, JS inicial < 200 KB gz, 0 fuentes de iconos.
- `app/robots.ts`, `app/sitemap.ts`, JSON-LD `Person` en layout y `CreativeWork` por caso, OG por caso.
- Analítica: se mantienen GA4 y Clarity; Hotjar, Plerdy y HubSpot se retiran de `lib/consent.ts`; banner más corto.

## 11. Verificación

- Vitest: `projects.test.ts` (cada pieza tiene imagen, slug único, filtros con contadores correctos, parámetro desconocido → todo); `cases.test.ts` (cada caso tiene las 13 secciones; ningún caso sin "Resultado"); `a11y.test.tsx` (landmarks y un h1 por página).
- Playwright + axe en `/`, `/casos/hermes`, `/sobre-mi` a 1280/768/375: 0 violaciones; sin overflow horizontal a 320; teclado abre un caso desde la portada.
- Re-auditoría con las mediciones del diagnóstico (landmarks, focus, targets, contraste, transferencia, LCP, altura, px hasta la primera captura).

## 12. Fuera de alcance

Versión en inglés; fotos personales y de lugares; años en cada ciudad; export de Figma (pendiente de activar Dev Mode MCP); publicación en `main`/Vercel (decisión posterior a la re-auditoría).
