# Re-auditoría tras el rediseño — 2026-09-22

**Rama:** `redesign/antigravity` (local, sin publicar) · **Método:** las mismas mediciones del diagnóstico del 21-09 (`scripts/audit.mjs`: axe WCAG 2.x A/AA, landmarks, targets, overflow, LCP, altura, px hasta la primera captura) en `/`, `/casos/hermes` y `/sobre-mi` a 1280, 768 y 375, más recorrido de teclado y comprobación con `prefers-reduced-motion`.

## Antes / después (medido)

| Medición | Antes (21-09, producción) | Después (22-09, build local) |
|---|---|---|
| Landmarks `main/nav/header/footer` en `/` | 0 / 0 / 0 / 0 | 1 / 1 / 1 / 1 (en las tres rutas) |
| Controles `<div onClick>` sin teclado | 10 | 0 |
| Reglas `:focus-visible` | 0 (solo el roll) | global, 2 px `--focus` |
| Violaciones axe (A/AA) | contraste 3,2:1 y 1,97:1 en metadatos | **0** en 9 combinaciones ruta × viewport |
| Targets < 44 px en 375 | 15 | **0** |
| Overflow horizontal | no | no |
| LCP en 1280 | 1,26 s + loader 1,6 s (≈ 2,9 s percibido; Clarity 2,9 s) | **0,91 s** en frío (0,2–0,26 s en caliente); sin loader |
| Transferencia inicial `/` | 506 KB (185 KB de Remixicon) | 586 KB (sin fuente de iconos; incluye imagen hero WebP con `priority`) |
| Primera captura de producto en `/` (1280) | ≈ 2.400 px (acordeón); en móvil ninguna | **679 px** (1280) · 703 px (375) |
| Altura de `/` (1280) | 4.805 px | 6.467 px (objetivo ≤ 6.000; ver pendientes) |
| Casos con URL propia | 0 (modal; roto en primera visita) | 5 páginas estáticas `/casos/[slug]` |
| Modal fuera de pantalla (bug B1) | sí | no existe el modal |
| Kicker recortado ≤ 820 px (B2) | sí | no |
| Rotador / loader / cursor-field / 5 canvas | sí | no; 1 canvas (starfield del cierre) solo con puntero fino y sin reduced-motion |
| Vendors de analítica tras aceptar | 5 | 2 (GA4 + Clarity) |
| `robots.txt` / `sitemap.xml` / JSON-LD | 404 / 404 / no | sí / sí / `Person` + `CreativeWork` por caso |
| Estilos inline `style={{}}` | 203 | solo valores dinámicos (color de marca, `transformOrigin` del ikigai) |
| Colores hex en componentes | 30 | tokens en `:root`; hex solo en `projects.ts` (marca) y diagramas SVG |

## Recorrido de teclado (`/`)

Tab: Saltar al contenido → VM (inicio) → Trabajo → Sobre mí → Contactar → Ver el caso HERMES → Contactar → chip "Todo" (roving tabindex: 1 chip tabulable de 10; flechas cambian el filtro y mueven el foco) → cards → "Ver caso" con anillo de foco visible → Enter abre `/casos/hermes` → Atrás vuelve a `/?f=casos` con el filtro conservado. **Correcto.**

## `prefers-reduced-motion: reduce` (`/`)

Sin Lenis, inset a escala 1 (`transform: none`), manifiesto con opacidad 1, marquee sin animación, ikigai sin rotación de degradado. **Correcto.**

## Backlog del diagnóstico: estado

| Ítem | Estado |
|---|---|
| P0-1 modal fuera de pantalla | Resuelto (sin modal; páginas de caso) |
| P0-2 kicker recortado | Resuelto |
| P0-3 teclado y semántica | Resuelto (landmarks, `<a>`/`<button>`, ARIA en chips y tabs, skip link, focus-visible) |
| P0-4 casos sin URL | Resuelto (`/casos/[slug]`, estáticos, con metadata y JSON-LD) |
| P0-5 móvil sin evidencia | Resuelto (inset de HERMES a 703 px; cards con captura) |
| P0-6 loader | Resuelto (eliminado) |
| P0-7 embudo Clarity | **Pendiente de Víctor** (configurar en el panel de Clarity tras publicar) |
| P1-1 hero | Resuelto (H1 a dos tonos con propuesta; sin rotador; sin claim "escribo el front") |
| P1-2 HERMES protagonista | Resuelto (inset bajo el hero, primer card, caso completo) |
| P1-3 métricas de relleno | Resuelto (retiradas 0 %/100 %/70 %; cada cifra con significado; Output/Outcome/Qué mediría) |
| P1-4 tokens y componentes | Resuelto |
| P1-5 contraste y tamaños | Resuelto (0 violaciones; piso 12,5 px) |
| P1-6 logos invisibles | Resuelto (marquee monocromo discreto) |
| P1-7 perfil largo | Resuelto (`/sobre-mi` estratificado; competencias 22 → 8) |
| P1-8 cierre | Resuelto |
| P1-9 "Ver Figma" como caso | Resuelto (retirado) |
| P1-10 motion decorativo | Resuelto (solo scroll-scale, header, manifiesto, reveals, marquee CSS, ikigai) |
| P1-11 nav móvil | Resuelto (una fila; nombre oculto < 480 px) |
| P2-1 Remixicon | Resuelto (sin fuente de iconos) |
| P2-2 robots/sitemap/JSON-LD | Resuelto |
| P2-3 next/image | Resuelto (capturas y polaroid) |
| P2-4 assets sin uso | Resuelto (−32 MB) |
| P2-5 5 vendors | Resuelto (2) |
| P2-6 will-change / max-height | Resuelto |
| P2-7 flecha ↗ | Resuelto (solo externos) |
| P2-8 safe-area | Resuelto en el banner |
| P2-9 Montserrat 5 pesos | Resuelto (Geist 400/500) |
| P2-10 inglés | Fuera de alcance |

## Pendiente de Víctor

- Fotos personales y de lugares (`lib/content/about.ts` → `places`), y años en las ciudades españolas.
- Confirmar o descartar las cifras del CV (12 idiomas y locales, 347 permisos, ciclo 5 → 2 días, tickets) para añadirlas a los casos.
- Confirmar "Disponible desde septiembre de 2026" (sale del CV: Atrinium hasta agosto de 2026).
- Export de Figma cuando se active el Dev Mode MCP (capturas mejores para el módulo de suscripción, hoy a 1.000 px).
- Logo de Taksio (hoy el tile muestra solo el nombre).
- Regenerar `og.png` con el sistema nuevo.
- Configurar el embudo en Clarity tras publicar; re-medir a 30 días.

## Fuera de objetivo (aceptado)

- Altura de `/` a 1280: 6.467 px frente a 6.000 objetivo. Catálogo de 10 cards a dos columnas; se puede bajar recortando el hueco reservado por el inset que crece o pasando a tres columnas ≥ 1.100 px.

## Puntuación (mismo criterio que el diagnóstico)

| Dimensión | 21-09 | 22-09 | Por qué |
|---|---|---|---|
| Positioning | 62 | 84 | H1 con la propuesta; hechos bajo el hero; manifiesto; cierre que resume |
| UX | 55 | 84 | Casos con URL; filtros compartibles; sin modal ni loader |
| UI | 70 | 86 | Sistema claro con tokens, dos tonos, insets y frames; sin Bebas en títulos largos |
| Information Architecture | 60 | 86 | Un catálogo, una plantilla de caso, un "sobre mí" |
| UX Writing | 74 | 82 | Copy estratificado; sin relleno; sin claim inconsistente |
| Accessibility | 35 | 90 | 0 violaciones axe; teclado completo; reduced-motion; targets ≥ 44 |
| Responsive | 52 | 84 | Tres viewports sin overflow ni recortes; captura en móvil a 703 px |
| Design System | 35 | 86 | Tokens, 12 primitivas, CSS Modules, sin inline |
| Storytelling | 64 | 82 | Problema → complejidad → decisiones → sistema → resultado → aprendizajes |
| Case Studies | 58 | 84 | Cinco páginas con la misma plantilla, diagramas y código ilustrativo |
| Evidence | 55 | 80 | Captura a 679 px; 21 capturas WebP; 8 diagramas; faltan fotos y export Figma |
| Metrics | 60 | 82 | Output con significado; Outcome declarado como no disponible; qué mediría |
| Conversion | 60 | 82 | CTA primario + secundario; cierre con contacto; siguiente caso en cada página |
| Performance | 68 | 86 | LCP 0,9 s frío; sin loader; sin fuente de iconos; −32 MB de assets |
| **Overall** | **58** | **84** | Pendientes: fotos, cifras del CV, OG, embudo, altura de portada |

La subida más importante no es el número: es que la primera captura de HERMES está donde el 27 % de scroll de Clarity la puede ver, y que un recruiter con teclado puede abrir un caso.
