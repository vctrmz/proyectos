# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Principal: quien contrata un puesto Senior o Lead de Product Design** (confirmado por Víctor el 2026-09-30).

- **Recruiter.** Decide en unos 30 segundos. Necesita ver nivel, especialización, años, casos con imagen y un CV que pueda reenviar. Suele abrir el enlace desde LinkedIn, muchas veces en el móvil, y reenvía la URL de un caso a quien decide.
- **Design lead o tech lead.** Evalúa a fondo. Lee los casos, las decisiones y sus contrapartidas, y abre el repositorio para comprobar que el diseño llega a código.

Los recruiters internacionales entran por `/en`. Captar clientes freelance o de agencia **no** es el objetivo de esta web: no se optimiza para eso sin que Víctor lo confirme.

## Product Purpose

Portfolio personal de Víctor Maza, en producción en https://victormaza.vercel.app. Existe para conseguir un rol Senior o Lead de Product Design, en remoto o en híbrido en Málaga.

El éxito tiene dos niveles. El recruiter entiende en 30 segundos qué hace Víctor y a qué nivel, y contacta (correo, CV en PDF, LinkedIn). El lead encuentra pruebas que se pueden abrir y defender en una entrevista.

## Positioning

Confirmado tal como está en la web (2026-09-30): producto B2B complejo en dominios regulados (SaaS asegurador, ERP y banca) donde un error operativo cuesta dinero. Víctor lo modela como sistema en lugar de pantalla a pantalla: fue el único diseñador de un holding con cinco productos y un solo lenguaje, y redujo 267 valores de color a 24 tokens que adoptaron los cuatro desarrolladores front. Después revisa la implementación en React hasta que el diseño llega entero a producción.

Esta misma web es la prueba: está construida como un producto (tokens, componentes, contenido tipado, tests y auditoría de accesibilidad) y su código es público.

## Operating Context

- Rutas: `/es` (por defecto) y `/en`. Cada caso tiene URL propia en `/[locale]/cases/[slug]`, para poder compartirla. Hay además «Sobre mí» y privacidad.
- Hay un CV por idioma: `/victor-maza-cv.pdf` (es) y `/victor-maza-cv-en.pdf` (en). Los dos tienen fuente en `scripts/cv/cv-<idioma>.html` con la maqueta común en `scripts/cv/cv.css`, y se imprimen con `npm run cv`. Se descargan desde el hero de «Sobre mí», con selector de idioma.
- En `/en` solo HERMES y «Esta web» están traducidos. El resto de casos se abre en español y el enlace lo avisa («in Spanish»).
- La analítica (Clarity, GA, Hotjar, Plerdy, HubSpot) solo se activa si el visitante la acepta. Dato de la re-auditoría del 22-09: pocas sesiones (39) y el 27 % de scroll medio en portada, así que lo importante tiene que estar arriba.
- Flujo de trabajo: spec → plan → código con Claude Code → revisión → tests y auditoría (`docs/superpowers/`, `docs/auditoria/`). Cada push a `main` despliega a producción; el trabajo va en ramas con preview de Vercel.

## Capabilities and Constraints

- Catálogo de 12 proyectos con filtros por tipo y sector. 11 tienen caso completo; Taksio enlaza a Behance.
- Todo texto existe en español y en inglés: la interfaz `Ui` de `lib/i18n/ui.ts` lo obliga, y `lib/content/en/*` sobrescribe el español.
- **Nada que no se pueda defender en una entrevista.** Los tests de `lib/content/cases/cases.test.ts` lo vigilan: cada cifra del outcome se explica, lo que no se midió se dice, no entran métricas de negocio que nadie midió, no se publican cifras del CV pendientes de confirmar y no se afirman herramientas de Atrinium sin confirmar. El 2026-09-30 Víctor confirmó que puede explicar el 36 % de tiempo liberado, los 347 permisos y los 12 idiomas; «de 5 a 2 días» y la bajada de tickets salieron del CV y de LinkedIn.
- **Un solo relato en web, CV y LinkedIn** (revisión de reclutador del 2026-09-30): mismo título, WCAG 2.2 AA (nunca AAA), Darien Technology de febrero de 2021 a mayo de 2022 (Mercantil 2021–2022, en remoto) y Atrinium de mayo de 2022 a agosto de 2026. Un cambio de fecha, título o cifra llega a los tres a la vez.
- Los extractos de código que reconstruyen trabajo de cliente van marcados como «ejemplo ilustrativo». Solo el código de esta web se enseña como real y enlazado.
- Solo se usan los tokens de `app/globals.css`, sin hex nuevos en componentes: `test/tokens.test.ts` falla si vuelven valores retirados.
- Next.js 16 tiene cambios que rompen convenciones: antes de tocar sus APIs se lee `node_modules/next/dist/docs/` (`AGENTS.md`).
- **Decisión abierta (D7 del plan del 29-09):** sin confirmar cómo llegaban los tokens de Figma al código en Atrinium, si la librería era React + Chakra UI y si se escribían ADR. Hasta entonces, nada de eso se afirma.

## Brand Commitments

- Nombre: Víctor Maza. Rol publicado: «Senior Product Designer · Design Systems · B2B SaaS e Insurtech» (en: «… B2B SaaS and Insurtech»), el mismo que el CV y LinkedIn desde el 2026-09-30.
- Disponibilidad publicada: «Disponible ahora · roles Senior o Lead de Product Design · remoto o híbrido en Málaga».
- Voz: primera persona, sobria y concreta. Cifras que se pueden comprobar, lenguaje de negocio, sin superlativos ni promesas. Informático de formación, Product Designer de oficio.
- Redes: LinkedIn y GitHub (`vctrmz`). El Behance es `behance.net/mazdesignr`, con «r»: `mazdesign` es otro estudio. Instagram queda fuera.

## Evidence on Hand

- Casos tipados en `lib/content/cases/`: Ayax, HERMES, Flesip, Montsaint, Mercantil, módulo de suscripción, editor de propuesta, vista 360, design system (267 → 24 tokens) y «Esta web». Los traducidos al inglés están en `lib/content/en/cases/`.
- Capturas en `public/assets/shots/` y logos en `public/assets/logos/`.
- El CV en PDF en `public/victor-maza-cv.pdf`. El repositorio público en https://github.com/vctrmz/proyectos, con specs, planes, tests y commits.
- Las auditorías de la propia web en `docs/auditoria/` (diagnóstico del 21-09 y re-auditoría del 22-09).
- **Ausencias que no se pueden inventar:** testimonios, clientes o logos que no estén ya en los casos, prensa, métricas de negocio no medidas y research con usuarios donde no lo hubo (en Atrinium el research fue por observación indirecta).

## Product Principles

1. **Cada afirmación se puede abrir.** Si no hay un caso, un archivo del repo o el CV que la respalde, no se publica.
2. **30 segundos para el recruiter, profundidad para el lead.** La primera pantalla responde nivel, especialización, años y cómo contactar; el detalle vive en los casos.
3. **La web es el argumento.** Está hecha como un producto; un fallo de calidad, accesibilidad o coherencia desmiente el posicionamiento.
4. **El inglés no es de segunda.** Cada cambio llega a `/es` y a `/en` a la vez.

## Accessibility & Inclusion

- WCAG 2.2 AA como requisito de entrada: 0 violaciones axe A/AA en `npm run audit` (Playwright + axe).
- Objetivos de toque de 44 px o más; navegación completa con teclado y skip link.
- Todo el motion (GSAP, Lenis, Motion) se apaga con `prefers-reduced-motion`.
- El contenido clave (stack, disponibilidad, CTA) está en el HTML del servidor y funciona sin JavaScript.
- Funciona a 375 px sin recortes ni desbordes.
