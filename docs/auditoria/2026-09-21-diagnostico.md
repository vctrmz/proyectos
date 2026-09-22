# Auditoría del portfolio — diagnóstico previo al rediseño

**Sitio:** https://proyectos-theta-hazel.vercel.app/ · **Código:** `proyectos-web` (Next.js 16, App Router, GSAP) · **Fecha:** 2026-09-21
**Método:** lectura completa del código (`lib/data.ts`, `globals.css`, 27 componentes), captura en vivo con Playwright a 1280, 768 y 375 px, medición de DOM, foco, contraste, transferencia y Web Vitals. Nada se ha modificado.

---

## 0. Resumen ejecutivo

El **contenido** ya es de nivel senior: dominio real, decisiones defendidas, frases con pensamiento de producto ("Diseñé reglas en lugar de casos", "No abrir Figma hasta entender el proceso manual", "Instrumenté el design system pero no el producto"). El problema no es lo que dice; es **el contenedor**:

1. **Hay bugs que rompen la lectura de un caso en la primera visita** (modal fuera de pantalla, kickers recortados en tablet y móvil).
2. **La web no es operable con teclado ni legible por lector de pantalla** (0 landmarks, 10 controles `<div onClick>`, sin `:focus-visible`, modal sin foco/Esc/scroll-lock).
3. **HERMES está troceado en cuatro sitios con dos estructuras narrativas distintas**, y su evidencia más fuerte (165 · 8 · 60→14) vive escondida en un acordeón, no en el caso protagonista.
4. **En móvil la portada no muestra ni una captura de producto.** La única prueba visual está dentro del modal, a 3.842 px de scroll.
5. **El propio portfolio no demuestra sistema**: 203 `style={{}}` inline, 30 hex distintos, 19 tamaños tipográficos, 8 radios, sin tokens.

Mi lectura del 84/100: el **contenido** está en ~80; la **experiencia** que lo envuelve está en ~55. La meta es que la ejecución esté a la altura del contenido.

---

## 1. Inventario (lo que existe)

| Elemento | Estado |
|---|---|
| Rutas | `/` (portada), `/perfil`, `/privacidad`. Sin páginas de caso: los casos son un modal. |
| Secciones portada | Hero → Trabajo (4 filas) → Casos de uso (2 tabs, acordeón) → Logos (8) → Sectores (5) → Contacto |
| Secciones perfil | Cabecera → Quién soy (bio 637 palabras) → Fuerte (16 cards) → Forma de trabajo (párrafo 242 palabras + herramientas) → Competencias (22 ítems en 4 cartas) → Contacto |
| Jerarquía | Portada: H1 "Víctor Maza" · H2 ×3 · H3 ×1 (dentro de Casos de uso). Modal: H3 sin H2 padre. Trabajo/Logos/Contacto sin heading. Perfil: H1 + H2 ×2; "Quién soy", "Forma de trabajo", "Competencias" sin heading. |
| Landmarks | `main` 0 · `nav` 0 · `section` 0 · `footer` 0 · `header` 0. Todo son `div`. |
| CTAs | Hero: "Ver casos" (#trabajo) + "Escríbeme ↗" (#contacto) + 3 sociales. Nav: "Escríbeme ↗". Modal: "Siguiente caso" + "Escríbeme ↗". Pie: email (copiar) + LinkedIn. |
| Fuentes | Montserrat 300/400/500/600/700 + Bebas Neue 400 + Remixicon (185 KB, ~20 iconos usados) |
| Colores en código | 30 hex distintos. Fondo `#1b1e27`, superficie `#232733`, acento `#8bde5f`, secundario `#4a44f2`/`#3a34e8`, lila `#a9a4f8`. Bordes: `#262626`, `#2c3140`, `#2f2f2f`, `#343a4a` (cuatro bordes para el mismo rol). Grises de texto: `#ececec #e2e4ea #d6d6d6 #c9c9c9 #b4b4b4 #a8a8a8 #949494 #878787 #6d6d6d #4d4d4d`. |
| Tipografía en código | 19 tamaños: 10, 10.5 (×28), 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 18, 20, 22, 23, 28 + clamps. |
| Radios | 6, 14, 16, 18, 20, 24, 40, 999 |
| Estilos | 203 `style={{}}` inline en componentes + 170 líneas de CSS global. Sin variables CSS salvo las fuentes. |
| Assets | `h-card` 2,6 MB (21 jpg, hasta 175 KB) · `h-thumb` 600 KB · `hermes/` 20 MB PNG **no usados** · `hero-bg.mp4` 12 MB **no usado** · `og.png` 560 KB |
| Analítica | GA4 + Clarity + Hotjar + Plerdy + HubSpot tras consentimiento (tres grabadores de sesión redundantes). |
| SEO | Title/description/OG/canonical correctos. Sin `robots.txt` (404), sin `sitemap.xml` (404), sin JSON-LD `Person`. Casos no indexables (modal). |

---

## 2. Bugs confirmados con evidencia

| # | Bug | Evidencia | Severidad |
|---|---|---|---|
| B1 | **El panel del modal queda fuera de pantalla en la primera visita.** `app/template.tsx` retira `.page-enter` en `onAnimationEnd`, pero la animación CSS (0,35 s) termina antes de que React hidrate en frío (684 ms medidos) y el evento nunca llega. El `transform` residual convierte los `position: fixed` en relativos: el `[role=dialog]` mide `y = 972` en un viewport de 800. En caliente (199 ms) funciona. | Captura `audit-modal-desktop.jpg` (solo velo). `pageEnter: true` tras carga en frío; `false` tras recarga. | **P0** — la primera vez que alguien abre un caso ve un velo negro. Afecta también a `.work-peek` y al loader. |
| B2 | **Kicker de cada caso recortado en ≤ 820 px.** `.work-row` pasa a `28px 1fr`; la tercera celda (kicker + flecha, `nowrap`, alineada a la derecha) cae a la fila siguiente en una columna de 28 px y se corta por la izquierda: "‑TENANT", "· FASE 2", "ODUCCIÓN", "TRABAJO". | `audit-home-tablet.jpg`, medición `left: 41, width: 28`. | **P0** — visible en tablet y móvil en la sección principal. |
| B3 | **Modal sin gestión de foco**: `activeElement` sigue en `body` al abrir, no cierra con Esc, `body.overflow` no se bloquea, sin `aria-modal`, sin devolver el foco al cerrar. | Medido en vivo. | **P0** (WCAG 2.1.1, 2.1.2, 2.4.3) |
| B4 | **10 controles `<div onClick>`** sin `role`, `tabindex` ni teclado: 4 filas de caso, 2 tabs, 4 step-cards. También el `div` "copiar correo" y las cabeceras de Competencias. | Medido. | **P0** — un usuario de teclado no puede abrir ningún caso. |
| B5 | **Sin `:focus-visible`** en toda la hoja (única regla: el roll del texto). | Grep de reglas. | **P0** (WCAG 2.4.7) |
| B6 | Logos a `opacity: 0.42 + grayscale` sobre fondo oscuro: la sección aparece **vacía** en la captura completa. | `audit-home-desktop.jpg`. | P1 |
| B7 | Nav pill en móvil se rompe en dos filas (328×87 px) por `flex-wrap`. | Medido a 375. | P1 |
| B8 | Rotador de palabras del hero (`setInterval` 2,2 s) no respeta `prefers-reduced-motion`. | `Hero.tsx:311`. | P1 |
| B9 | 5 `<canvas>` activos también en móvil/touch (campo de cursor + 4 starfield). | Medido a 375. | P1 |

---

## 3. Nielsen — 10 heurísticas

| # | Heurística | Problema | Evidencia | Sev. | Recomendación | Impacto esperado |
|---|---|---|---|---|---|---|
| 1 | Visibilidad del estado | Loader con contador falso 0→100 durante 1,6 s; el modal se abre sin mover el foco ni bloquear el fondo; el rotador cambia el titular cada 2,2 s. | `Loader.tsx`, `CasoModal.tsx`, `Hero.tsx` | Media | Quitar el loader (o ≤ 400 ms y saltable); foco al modal; titular estable. | Percepción de rapidez; el hero se lee entero de una vez. |
| 2 | Sistema ↔ mundo real | Lenguaje del dominio excelente. La flecha ↗ se usa para externos, para anclas internas (#contacto) y para abrir un modal ("Ver el caso ↗"). | `Sectores.tsx`, `Nav.tsx` | Baja | ↗ solo para externos; → para navegar; sin flecha para acciones en página. | Menos sorpresas al hacer clic. |
| 3 | Control y libertad | El caso no tiene URL: no hay atrás, no se comparte, no se abre en pestaña. Sin Esc. Sin salir del loader. B1 deja al usuario ante un velo sin salida visible. | Medido | **Alta** | Ruta `/casos/[slug]`; Esc + clic fuera + botón; scroll-lock; loader saltable. | Un recruiter puede enviar el enlace del caso a un lead. |
| 4 | Consistencia | Dos estructuras de caso conviven: STAR (modal) vs Terreno/Lograr/Hice/Acabó (Casos de uso). Dos estilos de kicker (etiqueta verde vs línea+texto). Cuatro colores de borde para el mismo rol. Botón primario con tres aspectos (starfield, ghost, `.box-contact`). | `data.ts`, `globals.css` | Alta | Una plantilla de caso; un kicker; tokens de borde y botón. | La web deja de parecer tres webs. |
| 5 | Prevención de errores | Poco que prevenir. Externos con `noopener`; copiar correo con fallback. | — | Baja | Mantener. | — |
| 6 | Reconocimiento vs recuerdo | Los casos son texto sin miniatura (la imagen sigue al cursor solo en desktop). Logos invisibles. Las métricas del acordeón no dicen cómo se lograron. En móvil, cero pistas visuales. | Capturas | Alta | Miniatura fija por caso; logos legibles; cada número con una línea de "qué significa". | El escaneo de 5 s funciona en cualquier dispositivo. |
| 7 | Flexibilidad y eficiencia | Sin teclado; sin skip link; sin enlace directo a caso; sin CV descargable. | Medido | **Alta** | B3–B5; skip link; ruta por caso; enlace a CV/LinkedIn en nav. | Recruiters y screen readers completan el recorrido. |
| 8 | Estética y minimalismo | Paleta contenida y buena. Pero: 5 canvas, cursor-field de 300 partículas, contador falso, rotador, modal de 2.200 palabras, bio de 637, 22 competencias genéricas. | Código | Media | Motion solo donde refuerza; progressive disclosure real; recortar copy HR. | Sube la percepción "senior, preciso". |
| 9 | Recuperar de errores | El estado roto de B1 no ofrece recuperación (velo sin panel, sin Esc). | B1 | Media | Corregir B1; Esc siempre. | — |
| 10 | Ayuda | Captions en capturas (bien). Sociales con `title`. Sin tooltips necesarios. | — | Baja | Mantener captions; añadirlas en móvil junto a cada imagen. | — |

---

## 4. UX Laws — dónde se cumplen y dónde no

| Ley | Estado | Dónde se aplica / se incumple |
|---|---|---|
| Fitts | **FAIL** | 15 objetivos < 44 px en móvil: nav links 32 px, "Ver el caso" 32 px, tabs 36 px, "[ Todos los sectores ]" 16 px, enlaces del pie 15–19 px. Los CTA del hero (btn-ghost 48 px) sí cumplen. |
| Hick | PASS con matiz | Nav de 3 ítems, bien. Pero el hero ofrece 5 acciones (2 CTA + 3 sociales) al mismo nivel visual; y "Trabajo" y "Casos de uso" son dos secciones de casos compitiendo. |
| Jakob | Parcial | Se espera: nombre → qué hago → casos con imagen → contacto. Aquí los casos no tienen imagen ni página, y "Sobre mí" es otra ruta cuando el patrón dominante en portfolios senior es una portada que ya responde "cómo pienso". |
| Miller | PASS | Secciones ≤ 7; competencias chunked en 4 grupos (aunque 22 ítems es mucho). |
| Proximidad | Parcial | En `.work-row` el kicker está a la derecha, lejos del título que califica. En Sectores el año está a 600 px del nombre. Métricas del acordeón sí agrupadas. |
| Similitud | FAIL | Los cuatro "casos" no son del mismo tipo (2 casos, 1 web externa, 1 archivo Figma) pero se presentan iguales → el usuario espera cuatro casos y encuentra dos. |
| Región común | PASS | Cards de sector, step-cards y cartas de competencias delimitan bien. |
| Prägnanz | Parcial | Hero: nombre gigante en Bebas + frase + párrafo + 5 acciones + campo de partículas; la forma simple ("quién / qué / para quién") no emerge. |
| Continuidad | Parcial | La línea vertical de filas en Trabajo guía bien; el salto de "Casos" a "Logos" (sección casi vacía) rompe el flujo. |
| Cierre | PASS | Logos y capturas parciales se completan mentalmente. |
| Von Restorff | FAIL | Nada destaca: HERMES es la fila 01 con el mismo peso que "Ver el proyecto en Figma" (fila 04). El acento verde se reparte en 20+ sitios por viewport. |
| Posición serial | FAIL | Primero: bien (HERMES). Último "caso": un enlace a Figma. Última sección: pie con email; sin cierre que resuma. |
| Peak-End | FAIL | El pico posible (165 pantallas / "reglas en lugar de casos") está en un acordeón a mitad de página. El final es un footer estándar. |
| Zeigarnik | Sin uso | No hay progresión visible en el caso (sin índice, sin barra de lectura, sin "siguiente paso" en la portada). |
| Tesler | PASS | La complejidad del dominio se explica, no se traslada. |
| Doherty | **FAIL** | Loader 1,6 s bloqueante en la primera visita de escritorio (LCP real 1,26 s, percibido ~2,9 s); B1 en la primera apertura del modal. |
| Postel | Parcial | Acepta teclado en las miniaturas del modal, pero no en filas, tabs ni acordeón. |
| Estética-usabilidad | A favor, con riesgo | La paleta y el tipo generan confianza; pero cuando el modal falla (B1) el efecto se invierte: "bonito pero roto". |
| Parkinson | FAIL en contenido | Sin límite por sección: bio 637 palabras, modal 2.200, párrafo de método 242 sin un solo corte. |

---

## 5. Arquitectura de información

¿Puede responder un visitante en la portada?

| Pregunta | Hoy | Veredicto |
|---|---|---|
| 1. Quién soy | Nombre gigante + "Product Designer (UX/UI)" | Sí, pero el nombre ocupa el espacio de la propuesta |
| 2. Qué hago | "Diseño producto [complejo/regulado/escalable/medible] desde Málaga" | Parcial: el rotador diluye; "desde Málaga" ocupa el slot clave |
| 3. Para quién | No se dice en el hero (aparece en logos invisibles y sectores al final) | **No** |
| 4. Qué problemas resuelvo | Párrafo del hero lo insinúa ("ordeno dominios densos") | Parcial |
| 5. Qué evidencia tengo | 165/8/60→14 en un acordeón; logos invisibles | **Escondida** |
| 6. Mejores casos | Fila 01 HERMES, sin imagen, sin destacar | Parcial |
| 7. Cómo trabajo | Solo en `/perfil` (párrafo de 242 palabras) | **No en portada** |
| 8. Cómo contactar | Nav + hero + pie | Sí |

**Por perfil**

- **Recruiter** (30 s): necesita nivel, especialización, años, casos con imagen y CV. Hoy: nivel no explícito, "nueve años" en un párrafo, casos sin imagen, sin CV. → Añadir una **franja de hechos** bajo el hero (años · sector · rol · en producción) y enlace a CV.
- **Design Lead**: necesita decisiones y criterio. Hoy lo tiene, pero repartido entre modal (STAR), acordeón (4 pasos) y bio. → Un **caso HERMES con página propia** y un bloque "Cómo trabajo" en portada de 4 pasos.
- **Founder / PM**: necesita "qué problema me resuelve" y contacto. Hoy la frase que lo dice ("Diseño producto B2B donde un error operativo cuesta dinero") está en el **pie**. → Subirla al hero o al cierre con CTA.

**Mapa de secciones propuesto (una sola web para los tres)**

```
/                                   /casos/hermes            /perfil
─────────────────────────────────   ─────────────────────    ────────────────
1 Hero: propuesta + hechos + 2 CTA  Overview (escaneable)    Quién soy (bio en 3 bloques)
2 Featured: HERMES (imagen grande,  Contexto y complejidad   Cómo trabajo (4 pasos)
  3 métricas explicadas, CTA)       Decisiones (3–5)         Competencias (recortadas)
3 Más casos: Suscripción · Editor · Sistema (tokens, reglas) Herramientas
  Vista 360  (con miniatura)        Implementación
4 Cómo trabajo (4 pasos, 1 línea)   Resultado: output/outcome
5 Recorrido: sectores + logos       Aprendizajes
  (fusionados, legibles)            Siguiente caso / CTA
6 Cierre: "¿Tienes un producto
  complejo?" + resumen + contacto
```

---

## 6. Hero — diagnóstico y propuesta conceptual

**Hoy:** etiqueta verde "Product Designer (UX/UI)" → "VÍCTOR MAZA" (148 px Bebas) → "Diseño producto *complejo* desde Málaga." (rotador) → párrafo → "Ver casos" + "Escríbeme ↗" + 3 sociales → cue "Scroll".

Problemas:
- El **nombre** es el elemento dominante; el nombre no vende, la propuesta sí. El nombre puede vivir en el nav y en la etiqueta.
- **"desde Málaga"** ocupa el final de la frase clave. La ubicación va en la franja de hechos.
- El **rotador** hace que la frase nunca esté completa y obliga a esperar 8,8 s para leer las cuatro variantes.
- **"Diseño y escribo el front, así el diseño llega entero a producción"** (hero) choca con la bio: "*la implementación la generé con IA y la dirigí*". Un Design Lead lo notará. Hay que elegir una formulación honesta: *dirijo la implementación* / *entrego un handoff que se construye sin interpretar*.
- **5 acciones** al mismo nivel: dos CTA + tres sociales.

**Propuesta (concepto, no copy final):**

```
PRODUCT DESIGNER · B2B SAAS · INSURTECH

Convierto reglas de negocio
en producto que llega a producción.

Nueve años diseñando SaaS asegurador y ERP para compañías que no se
parecen entre sí. Entiendo el dominio, lo modelo como reglas y
componentes, y acompaño la implementación hasta que el diseño llega entero.

[ Ver el caso HERMES ]   [ Contactar ]

165 pantallas en producción · 8 áreas de producto · 5 productos, un lenguaje · Único diseñador 2022–2026
```

Responde en 5 s: quién (kicker), qué (H1), para quién (sub), qué problema (reglas de negocio → producción), por qué seguir (franja de hechos). Alternativas de H1 a valorar: *"Producto B2B complejo, diseñado como sistema y entregado en producción."* / *"Donde hay reglas de negocio densas, diseño el sistema que las hace usables."*

---

## 7. HERMES como caso protagonista

**Hoy HERMES está en cuatro sitios con tres formatos:**
1. Fila 01 "Módulo de suscripción de cliente" → modal STAR (2.200 palabras, 6 capturas).
2. Fila 02 "Preparar la demo con el cliente" → modal STAR (Fase 2 del mismo módulo).
3. Tab "Producto multi-tenant" en Casos de uso → 4 pasos + 3 métricas (165 · 8 · 60→14) + aprendizaje.
4. Sector 01 "Insurtech · HERMES" → botón "Ver el caso" que abre el modal 1.

La evidencia más potente (plataforma completa, 165 pantallas, 8 áreas, multi-tenant, 5 idiomas, tokens adoptados por 4 front) está en el **acordeón**, mientras el "caso" del modal es un módulo concreto de cinco semanas. Un recruiter que abre el caso 01 no se entera de que existe la plataforma.

**Narrativa propuesta para `/casos/hermes` (todo con datos que ya existen en `data.ts`):**

| Bloque | Contenido disponible | Evidencia visual propuesta |
|---|---|---|
| **Problema** | SaaS asegurador vendido a compañías con lógicas de negocio incompatibles. "Si el producto se dobla ante cada cliente deja de ser producto; si no se dobla nada, no lo usa nadie." | Diagrama: Cliente A/B/C → reglas → **sistema configurable** |
| **Contexto** | Atrinium 2022–2026, único diseñador, equipo de 7, corredurías + agencias + aseguradoras sobre el mismo núcleo, producto en producción sin ventana de parada, migración de framework y BD con dos generaciones de UI conviviendo. | Franja de hechos |
| **Complejidad** | Moneda, idioma y regulador por compañía; 8 áreas; cuestionario distinto por ramo; white-label por tenant. | Mapa de las 8 áreas |
| **Decisiones** | 1) Reglas en lugar de casos: el cuestionario se declara como dato y la UI lo renderiza con validación. 2) El nivel de sistema que cada producto se puede permitir. 3) Migración módulo a módulo priorizando consistencia completa. 4) Marca e idioma como variables. | Antes/después: 60 → 14 campos por paso |
| **Sistema** | 267 → 24 tokens con rol; componentes con contrato; accesibilidad forzada por linter; 5 idiomas, 7 locales; paleta por cliente al iniciar sesión. | Tabla de tokens / captura de 2 tenants con la misma pantalla |
| **Diseño** | Módulo de suscripción: máquina de estados de 3 fases y 6 roles (no un wizard de 20 pasos). Editor de propuesta sobre TipTap con variables `@` y componentes `/`. | Diagrama de estados; capturas h-card |
| **Implementación** | Tokens adoptados por los 4 front; módulo en producción en 5 semanas apoyado en el catálogo Hermes Tenant; componentes nuevos devueltos al catálogo. | Ciclo sistema ↔ módulo |
| **Resultado** | Output: 165 pantallas, 8 áreas, 5 productos con un lenguaje, cliente real operando. Outcome (tiempo de emisión, errores, tickets, adopción): **Dato no disponible.** | Bloque Output / Outcome separado |
| **Aprendizajes** | "Instrumenté el design system pero no el producto… Hoy pediría analítica de uso desde el primer módulo migrado." | Texto |

Los otros dos casos (Suscripción-Fase 2 / Editor y Vista 360) pasan a **casos secundarios** con la misma plantilla, más cortos.

---

## 8. Estructura de case study (plantilla única)

```
Overview  ── 4 líneas: qué, para quién, mi rol, periodo + 3 hechos + imagen hero   (escaneo, 20 s)
Contexto y restricciones ── 1 párrafo + lista de 3                                  (1 min)
Decisiones clave ── 3 a 5 bloques "decisión → por qué → qué cambió"                (el corazón)
Sistema ── tokens, componentes, reglas                                            (colapsable)
Diseño ── galería con caption por captura                                          (visual)
Implementación ── cómo llegó a producción, con quién                               (colapsable)
Resultado ── Output | Outcome | Qué mediría                                        (honesto)
Aprendizajes ── 2 frases
Siguiente caso / Contactar
```

Progressive disclosure: Overview + Decisiones + Resultado siempre visibles; Sistema/Implementación en `<details>` accesibles. El modal actual desaparece o queda como vista rápida que enlaza a la página.

---

## 9. Métricas — output vs outcome, número a número

| Número (hoy) | Dónde | Tipo | Veredicto |
|---|---|---|---|
| 165 pantallas en producción | Acordeón | Output | ✔ Mover al featured. Añadir: "una por flujo real, no por variante". |
| 8 áreas de producto | Acordeón | Output | ✔ Nombrarlas (suscripción, pólizas, recibos, facturación, siniestros, admin, usuarios…). |
| 60 → 14 campos visibles por paso al emitir póliza | Acordeón | Output de diseño (proxy de carga cognitiva) | ✔ Falta el **cómo** (¿campos condicionados por ramo? ¿ocultos por reglas?). Sin eso es un número sin mecanismo. |
| 5 idiomas · 7 locales | Solo en texto | Output | ✔ Subir como hecho. |
| 267 → 24 tokens · 4 front | Modal, bio, texto (×3) | Output + adopción | ✔ Una sola vez, en Sistema. Es el dato más cercano a outcome (adopción). |
| 5 semanas a producción | Modal | Output de entrega | ✔ Contexto: "frente a 3 meses de ciclo manual" es contexto del proceso, no ahorro medido. No presentarlo como outcome. |
| 70 % del flujo en Fase 1 | Modal | Ambiguo | ⚠ Aclarar o retirar. |
| 3 fases · 6 roles | Modal | Alcance | ✔ Como hecho de complejidad. |
| 0 texto libre sin control / 100 % campos trazables | Modal 2 | Relleno | ✖ Retirar: "0" y "100 %" sin base de medición restan credibilidad. |
| 2 áreas co-diseñando / 1 nuevo módulo | Modal 2 / acordeón 2 | Relleno | ✖ Retirar. |
| 12 alternativas · 4 finalistas | Acordeón 2 | Output de proceso | ✔ Válido si se muestran (aunque sea una rejilla de 12 miniaturas). |
| Tiempo de emisión, errores, tickets, adopción, onboarding | — | Outcome | **Dato no disponible.** Decirlo así y añadir "Qué mediría hoy" (el aprendizaje ya lo dice). |

---

## 10. UX Writing

**Conservar y subir de sitio** (ya son frases senior):
- "Diseñé reglas en lugar de casos."
- "Diseño producto B2B donde un error operativo cuesta dinero." (hoy en el pie)
- "La primera decisión fue no abrir Figma hasta entender el proceso manual."
- "Si el producto se dobla ante cada cliente deja de ser producto; si no se dobla nada, no lo usa nadie."
- "Instrumenté el design system pero no el producto."
- "El sistema alimenta el módulo y el módulo devuelve componentes al sistema."
- "Una propuesta que llega con la viabilidad validada deja de ser una petición y pasa a ser una opción."

**Nuevas oportunidades del mismo tipo** (a validar contigo, no inventar):
- "El Excel que ya usaban era la mejor especificación disponible." (ya está en el modal, casi literal)
- "Modelo el dominio antes que la pantalla." (ya está en la bio)
- "Un módulo nuevo se arma con lo que existe; si necesita algo nuevo, lo devuelve al catálogo."

**Eliminar o recortar:**
- Rotador "complejo / regulado / escalable / medible".
- "Diseño y escribo el front" (inconsistente con la bio).
- Competencias: "Evangelización de producto y diseño", "Influencia transversal", "Autonomía y adaptación", "Trabajo ágil y delivery" — copy de oferta de empleo, no de diseñador. Reducir 22 → 8–10 con evidencia.
- Herramientas: "Canva, CapCut, Pincel, Premiere, WordPress, SendGrid" diluyen el posicionamiento senior. Dejar las de producto.
- "Baja y te cuento", "Ponte en contacto" → tono más directo.
- Bio: 8 párrafos → 3 bloques con subtítulo (Qué hago / Dónde lo he hecho / Cómo trabajo).
- Método: 242 palabras en un párrafo → 4 pasos.
- Modal: cada STAR "Acción" de 120+ palabras → 3 decisiones de 40.

Tono: ya es senior y directo. El riesgo es la **longitud**, no el registro.

---

## 11. Diseño visual

### Tipografía
- **Pareja**: Montserrat (texto) + Bebas Neue (display). Bebas en mayúsculas condensadas funciona en 1–3 palabras; en "MÓDULO DE SUSCRIPCIÓN DE CLIENTE" o "UN PRODUCTO ESTÁNDAR PARA NEGOCIOS QUE NO SE PARECEN" pierde legibilidad y grita. Recomendación: Bebas solo para el H1 del hero y cifras; títulos de caso en Montserrat 500 con tracking −0.02em (ya se hace en "Producto en producción", y es lo que mejor funciona).
- **Escala**: 19 tamaños, con 28 usos de 10.5 px y tracking 0.3em. Los kickers de 10.5 px en `#878787` son ilegibles en móvil.
- **Cuerpo**: 14.5 px / 1.6 para párrafos de 600 palabras; subir a 16–17 px en lectura larga.
- **Propuesta de escala** (rem, con clamp en display): 12 · 13 · 14 · 16 · 18 · 20 · 24 · 32 · 40 · 56 · 72 · 96.

### Espaciado
- Clamps distintos por sección (`clamp(56px,7vw,96px)`, `clamp(64px,8vw,110px)`, `clamp(48px,6vw,80px)`) sin relación entre sí. Gaps: 7, 8, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28…
- **Propuesta**: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 como tokens; ritmo de sección = 96/128 desktop, 64 móvil.

### Grid
- `max-width: 1200` con padding `clamp(20px,4vw,64px)`: correcto. Dos columnas en Casos de uso y modal; el resto es una columna. En 1280 px la línea de lectura de la bio es de ~110 caracteres: demasiado. Limitar a 65–75 ch.

### Color — tokens semánticos propuestos (a partir de los valores que ya usas)

```
--bg            #1b1e27     --text          #ececec     --accent        #8bde5f
--bg-deep       #15181f     --text-2        #c9c9c9     --accent-ink    #12151c
--surface       #232733     --text-3        #949494     --accent-2      #4a44f2 (solo decorativo)
--surface-hi    #2c3140     --text-muted    #878787 (mín. 4.6:1 sobre bg, solo ≥ 14 px)
--border        #2c3140     --border-hi     #343a4a     --focus         #8bde5f (2 px + offset 3)
```
Retirar `#6d6d6d`, `#4d4d4d`, `#262626`, `#2f2f2f`, `#3a3a3a`, `#a8a8a8`, `#b4b4b4`, `#d6d6d6`, `#e2e4ea` (redundantes o sin contraste).

---

## 12. Accesibilidad (WCAG 2.2)

| Criterio | Estado | Detalle |
|---|---|---|
| 1.3.1 Info y relaciones | ✖ | Sin landmarks; títulos de sección como `<span>`; títulos de caso como `<p>`. |
| 1.4.3 Contraste | ✖ | `#6d6d6d` sobre `#1b1e27` = 3,2:1 en años, kickers y captions de 11–12 px; `#4d4d4d` = 1,97:1 en índices "(01)"; `#6d6d6d` sobre cards = 2,9:1. |
| 1.4.11 Contraste no textual | ⚠ | Bordes `#262626` sobre `#101010` (modal) ≈ 1,3:1. |
| 2.1.1 Teclado | ✖ | 10+ controles no alcanzables (filas, tabs, acordeón, copiar correo, cabeceras de competencias). |
| 2.1.2 Sin trampas | ⚠ | Modal sin trampa porque no hay foco dentro; al tabular se navega la página tapada. |
| 2.4.1 Saltar bloques | ✖ | Sin skip link. |
| 2.4.3 Orden de foco | ✖ | Modal no recibe ni devuelve foco. |
| 2.4.7 Foco visible | ✖ | Sin `:focus-visible`. |
| 2.5.8 Tamaño de objetivo (24 px mín.) | ✖ | Enlaces del pie 15–19 px, "[ Todos los sectores ]" 16 px. |
| 2.3.3 Animación por interacción | ⚠ | Rotador y canvases ignoran `prefers-reduced-motion` (GSAP sí lo respeta vía `isLight`). |
| 1.1.1 Alternativas | ⚠ | `alt` presente. Capturas del modal como `background-image` con `role=img` + label: aceptable, pero mejor `<img>` con `alt` y `figcaption`. |
| 4.1.2 Nombre/rol/valor | ✖ | Tabs sin `role=tablist/tab/aria-selected`; acordeón sin `aria-expanded`. |
| Idioma | ✔ | `lang="es"`. |

---

## 13. Responsive

- Un solo breakpoint (820 px): tablet recibe el layout móvil. Sin overflow horizontal a 320 (bien).
- **Hero móvil**: 812 px de alto para nombre + frase + párrafo + 5 acciones + "Scroll"; la primera prueba de producto llega tras 2 pantallas.
- **Nav móvil**: dos filas (87 px) tapando el inicio del hero.
- **Casos móvil**: sin imagen; kicker recortado (B2).
- **Modal móvil**: 5.245 px de scroll; texto primero, imagen a 3.842 px; imagen apaisada en caja vertical 271×503 con `contain` → captura diminuta.
- **Métricas móvil**: cards de 130 px con label de 11.5 px.
- **Sectores móvil**: año en gris 11 px al fondo de la card, a 3,2:1.
- Sin `env(safe-area-inset-*)` en nav ni banner (iPhone con notch).

---

## 14. Performance

| Métrica (desktop, Vercel, red normal) | Valor |
|---|---|
| TTFB | 147 ms |
| DOMContentLoaded | 684 ms (frío) / 199 ms (caliente) |
| LCP | 1,26 s (`<p>` del hero) — pero el loader tapa la página **1,6 s** en la primera visita: LCP percibido ≈ 2,9 s |
| CLS | 0,010 |
| Transferencia inicial | 506 KB: script 231 · CSS 185 (**Remixicon 185 KB para ~20 iconos**) · fuentes 76 |
| Canvas activos | 5 (300 partículas + 4 starfield) también en móvil |

Acciones: SVG inline para los ~20 iconos (−185 KB); Montserrat a 2–3 pesos; `next/image` con `width/height` y `sizes` para logos y capturas; capturas del caso en WebP/AVIF a 1600 px máx.; quitar del repo `assets/hermes/` (20 MB) y `hero-bg.mp4` (12 MB); `will-change` solo durante la interacción (hoy permanente en `.roll-inner`, `.comp-card`, chips); no animar `max-height`; loader fuera o ≤ 400 ms; cursor-field solo con `pointer: fine` y no en reduced-motion; JSON-LD `Person`; `robots.txt` + `sitemap.xml`.

---

## 15. Motion

**Hoy**: loader con contador, entrada del hero con blur, palabra rotatoria, campo de partículas que sigue al cursor, 4 botones con estrellas en canvas, texto que rueda al hover, imagen que sigue al cursor en la lista, reveal por sección, palabras que suben en cada H2, cartas apiladas con scale/brightness en Competencias, chips que se inclinan hacia el cursor.

Es motion **decorativo**: ninguna pieza cuenta "complejidad → sistema → producción". Propuesta:
- Conservar: reveal por sección (más corto, 0,5 s), roll del nav, hover de filas.
- Retirar: loader, contador, rotador, cursor-field, starfield en botones, chips proximales, cartas apiladas (rompen la lectura de las competencias).
- Añadir con propósito: **diagrama animado** Cliente A/B/C → sistema (una sola vez, al entrar); **antes/después 60→14** con transición de campos; barra de progreso de lectura en la página de caso; contador de métricas solo si hay `prefers-reduced-motion: no-preference`.

---

## 16. Gestalt

- **Project cards**: número, título, descripción a la izquierda; kicker y flecha a la derecha a 700 px → proximidad rota. Sin imagen → figura/fondo débil.
- **Métricas**: bien agrupadas en cards, pero el significado (label) a 11.5 px en `#878787`: la cifra es figura y el significado desaparece.
- **Casos de uso**: dos columnas equilibradas; la columna derecha de acordeón es la única con contenido revelable y no se distingue de las cards de métrica (mismo borde, mismo radio).
- **Navegación**: pill flotante con buen contraste de región; en móvil la región se rompe en dos filas.
- **Secciones**: separadores `1px #232733` a 1,2:1 sobre el fondo: los límites entre secciones casi no existen; el ritmo depende solo del padding.

---

## 17. Conversión, posición serial y final

- **CTA primario** hoy: "Ver casos" (→ #trabajo) y "Escríbeme ↗" con el mismo peso visual (ambos pill). Propuesta: **"Ver el caso HERMES"** (relleno acento) + **"Contactar"** (ghost). "Escríbeme ↗" del nav → "Contactar".
- **Primer caso**: HERMES, correcto. **Último "caso"**: "Ver el proyecto en Figma" — retirar de la lista y ponerlo como enlace secundario dentro del caso.
- **Cierre** propuesto (Peak-End):

```
¿Tienes un producto complejo?
Reglas de negocio densas, varios clientes sobre el mismo núcleo, un equipo que necesita
diseño que se pueda construir.

Problema   Complejidad B2B          Evidencia   Nueve años · SaaS asegurador en producción
Método     UX + Sistema + UI +      Acción      [ Contactar ]   [ LinkedIn ]
           Implementación
```

---

## 18. Design system del portfolio (a definir en la implementación)

- **Tokens**: color (§11), tipografía (12 pasos), espaciado (10 pasos), radio (4: 8 · 12 · 16 · 999), sombra (2), breakpoints (480 · 768 · 1024 · 1280), z-index (nav 50 · modal 90 · banner 100).
- **Componentes**: `Button` (primary/ghost/link, tamaño md/lg, todos ≥ 44 px), `Kicker`, `SectionHeader` (kicker + h2 + acción), `CaseCard` (miniatura, título, kicker, hechos), `Metric` (cifra + significado), `FactStrip`, `Tag`, `Tabs` (ARIA), `Disclosure` (`<details>` estilizado), `Figure` (img + caption), `Diagram` (SVG), `Footer/Cierre`.
- **Regla**: cero `style={{}}` salvo valores dinámicos. CSS Modules o Tailwind con tokens: el propio código demuestra el sistema.

---

## 19. Información → evidencia (dónde sustituir texto por visual)

| Afirmación en texto | Visual propuesto |
|---|---|
| "Compañías con lógicas de negocio incompatibles sobre el mismo núcleo" | Diagrama Cliente A/B/C → reglas → sistema configurable |
| "60 → 14 campos visibles por paso" | Antes/después de la pantalla de emisión |
| "Máquina de estados de tres fases, no un wizard de veinte pasos" | Diagrama de estados con audiencias y salidas |
| "267 → 24 tokens con rol" | Tabla/paleta de tokens con nombre semántico |
| "8 áreas de producto" | Mapa de módulos |
| "Paleta por cliente al iniciar sesión" | La misma pantalla en dos tenants |
| "Doce alternativas, cuatro finalistas" | Rejilla de 12 miniaturas con las 4 marcadas |
| "El sistema alimenta el módulo y el módulo devuelve componentes" | Ciclo de dos flechas |
| Bio: "cinco productos, un solo lenguaje" | Timeline 2018–2026 con productos |

---

## 20. Backlog priorizado

### P0 — críticos (rompen la experiencia o excluyen usuarios)

| # | Problema | Solución | UX | Negocio | Esfuerzo |
|---|---|---|---|---|---|
| P0-1 | Modal fuera de pantalla en primera visita (B1) | Animar solo `opacity` en `.page-enter` (sin `transform`) o montar modal/peek con `createPortal` en `body`; retirar la clase también por timeout | Alto | Alto: el primer caso no se puede leer | S |
| P0-2 | Kicker recortado ≤ 820 (B2) | Reordenar grid móvil: kicker encima del título, `white-space: normal` | Alto | Alto | S |
| P0-3 | Sin teclado ni semántica (B3–B5) | `<main> <nav> <section aria-labelledby> <footer>`; filas → `<a href="/casos/…">` o `<button>`; tabs y acordeón con ARIA; `:focus-visible` global; modal con foco, Esc, `aria-modal`, scroll-lock, retorno de foco; skip link | Alto | Alto: recruiters con teclado y auditorías de accesibilidad de empresas | M |
| P0-4 | Casos sin URL | Ruta `/casos/[slug]` con plantilla única (§8); el modal desaparece | Alto | Alto: compartible e indexable | M |
| P0-5 | Móvil sin evidencia visual | Miniatura fija por caso; featured con imagen grande; captura primero en la página de caso | Alto | Alto | S–M |
| P0-6 | Loader 1,6 s bloqueante | Retirar (o ≤ 400 ms, saltable, solo `pointer: fine`) | Medio | Medio: velocidad = calidad | S |

### P1 — alto impacto

| # | Problema | Solución | Esfuerzo |
|---|---|---|---|
| P1-1 | Hero sin propuesta (§6) | Nuevo hero: kicker + H1 propuesta + sub + 2 CTA + franja de hechos; sin rotador; sin claim "escribo el front" | M |
| P1-2 | HERMES no es protagonista (§7) | Sección Featured en portada + `/casos/hermes` con la narrativa completa; los otros dos como secundarios | L |
| P1-3 | Métricas de relleno y sin significado (§9) | Retirar 0 %/100 %/2/1; cada cifra con una línea de significado; bloque Output/Outcome/Qué mediría | S |
| P1-4 | Sin tokens ni componentes (§11, §18) | Tokens CSS + 12 componentes; eliminar 203 estilos inline | L |
| P1-5 | Contraste y tamaños (§12) | Retirar `#6d6d6d`/`#4d4d4d`; kickers ≥ 12 px; targets ≥ 44 px | S |
| P1-6 | Logos invisibles | Opacidad 0,75 sin grayscale, o monocromo en `#c9c9c9`; fusionar con Sectores como "Recorrido" | S |
| P1-7 | Perfil demasiado largo y genérico (§10) | Bio en 3 bloques; método en 4 pasos; competencias 22 → 8–10; herramientas solo de producto | M |
| P1-8 | Cierre sin resumen ni CTA (§17) | Sección de cierre "¿Tienes un producto complejo?" | S |
| P1-9 | Fila "Ver el proyecto en Figma" como caso | Retirar de la lista; enlace dentro del caso | XS |
| P1-10 | Motion decorativo (§15) | Retirar canvases, rotador, chips, cartas apiladas; añadir 2 diagramas con propósito | M |
| P1-11 | Nav móvil en dos filas | Reducir a logo + "Casos" + "Contactar"; `nowrap` | XS |

### P2 — mejoras secundarias

| # | Problema | Solución | Esfuerzo |
|---|---|---|---|
| P2-1 | Remixicon 185 KB | SVG inline de los ~20 iconos | S |
| P2-2 | Sin `robots.txt`, `sitemap.xml`, JSON-LD | Añadir con `app/robots.ts`, `app/sitemap.ts`, `Person` + `CreativeWork` por caso | XS |
| P2-3 | Imágenes sin `next/image` | Migrar capturas y logos; WebP; `sizes` | S |
| P2-4 | 32 MB de assets no usados en `public/` | Retirar `assets/hermes/` y `hero-bg.mp4` | XS |
| P2-5 | 5 herramientas de analítica | GA4 + un grabador (Clarity); banner más corto | XS |
| P2-6 | `will-change` permanente, `max-height` animado | Aplicar en hover/abrir; usar `grid-template-rows: 0fr→1fr` | XS |
| P2-7 | Flecha ↗ inconsistente | Solo externos | XS |
| P2-8 | Sin `safe-area-inset` | Añadir en nav y banner | XS |
| P2-9 | Montserrat 5 pesos | 400/500/600 | XS |
| P2-10 | Inglés | Valorar versión EN de portada + caso HERMES (recruiters internacionales); no antes de P0/P1 | L |

---

## 21. Puntuación de partida (mi criterio; la explicación está en las secciones)

| Dimensión | Hoy | Por qué |
|---|---|---|
| Positioning | 62 | Frase clave en el pie; hero centrado en el nombre; claim inconsistente |
| UX | 55 | Modal roto en frío; sin teclado; casos sin URL |
| UI | 70 | Paleta y tipo con criterio; sin escala; Bebas en títulos largos |
| Information Architecture | 60 | HERMES en 4 sitios; dos secciones de casos; "para quién" ausente |
| UX Writing | 74 | Voz senior real; exceso de longitud; algo de copy HR |
| Accessibility | 35 | 0 landmarks, 0 focus-visible, 10 divs clicables, contraste |
| Responsive | 52 | Un breakpoint; kicker recortado; sin imagen en móvil; nav rota |
| Design System | 35 | 203 inline, 30 hex, 19 tamaños, 8 radios |
| Storytelling | 64 | Narrativa STAR sólida pero enterrada y duplicada |
| Case Studies | 58 | Sin página, sin imagen primero, dos estructuras |
| Evidence | 55 | Capturas buenas pero a 530 px; logos invisibles; sin diagramas |
| Metrics | 60 | Buenos outputs, sin significado, con relleno |
| Conversion | 60 | CTAs iguales; sin cierre; Figma como último caso |
| Performance | 68 | 506 KB, LCP 1,26 s, pero loader 1,6 s + 5 canvas + 185 KB de iconos |
| **Overall Product Design quality** | **58** | Contenido ~80 · Contenedor ~55 |

**UsabilityScore (judged, rúbrica ui-craft):** Nielsen 3·4·2·3·4·3·2·3·3·4 → media 3,1 → base 53; leyes fallidas Fitts + Doherty → −10 → **43 / F**. Es la nota de la *experiencia*, no del contenido: los P0 la levantan sola a la banda C.

---

## 22. Alcance propuesto

**Rebuild parcial**: se conservan marca (paleta, Montserrat/Bebas, voz, nombre), rutas existentes (`/`, `/perfil`, `/privacidad` + redirecciones), todo el contenido de `data.ts` y todas las capturas. Cambian la composición de la portada, la existencia de `/casos/[slug]`, la capa de estilos (tokens + componentes) y el motion.

Orden de ejecución sugerido: **P0-1 → P0-3 → P0-2/P0-5 (con tokens de P1-4 como base) → P0-4 + P1-2 (HERMES) → P1-1 (hero) → P1-8 (cierre) → resto de P1 → P2 → re-auditoría con las mismas mediciones.**

Craft Read: portfolio editorial oscuro · audiencia recruiter / design lead / founder · variance 4 (marca comprometida; la apuesta va a composición y evidencia, no a identidad nueva) · signature bet: el diagrama "Clientes → reglas → sistema" como firma visual del posicionamiento.

---

## 23. Datos de Clarity (8 días, 39 sesiones) y contraste con el brief externo

**Fuente:** `auditoria-portfolio-brief.md` (21-09-2026). Los datos de comportamiento son válidos como señal cualitativa; la auditoría de DOM del brief corresponde al **sitio estático anterior** (migrado a Next.js el 17-09), así que varias evidencias ya no aplican. Verificado contra el deploy actual.

### Lo que Clarity confirma o cambia

| Dato | Valor | Qué confirma | Cambio en el backlog |
|---|---|---|---|
| Scroll medio | 27,7 % de 4.736 px ≈ 1.300 px | El usuario medio se detiene entre el final del hero y la primera fila de casos. Nunca ve HERMES, ni las métricas (a ~2.400 px), ni los logos, ni el cierre. | **Sube** P1-1 (hero) y P1-2 (HERMES como featured inmediatamente bajo el hero) al nivel de los P0 técnicos. La primera captura de producto debe estar a < 900 px. |
| Páginas/sesión | 1,0 · self-referral 11/39 | El sitio antiguo (multi-documento + loaders de analítica distintos por página) fragmentaba sesiones. Con `<Link>` y consentimiento unificado esto ya está corregido en código; no hay datos post-migración suficientes para confirmarlo. | Ninguno. Verificar en 3–4 semanas. |
| LCP | 2,9 s | Coincide con mi estimación de LCP *percibido* (1,26 s real + loader 1,6 s). | Confirma P0-6 (retirar loader). |
| INP 160 ms · CLS 0,003 | OK | Los 5 canvas no penalizan INP en desktop. | Ninguno; en móvil no hay datos. |
| Mobile | 1 sesión de 39 | Sin datos. **No** significa que móvil no importe: un recruiter abre el enlace desde LinkedIn en el móvil. | Mantener P0-5. |
| Tiempo activo | 1 min de 3,5 | Ratio 28 %: hay espera (loader, animaciones) o lectura pasiva. | Refuerza §15 (motion). |
| Errores JS | 0 | El problema es de arquitectura de interacción, no de runtime. | — |

### Qué del brief ya no aplica al código actual (verificado)

| Tarea del brief | Afirmación | Estado real hoy |
|---|---|---|
| TASK-01 | "`.work-row` sin event handler, sin modal" | Tiene `onClick` React que abre el modal. La conclusión (convertir en `<a href="/casos/…">`) coincide con P0-3/P0-4 y se mantiene. |
| TASK-02 | "`/index.html` y `/perfil.html` sirven páginas duplicadas" | `curl -I` → **308** a `/`, `/perfil`, `/privacidad`. Canonical presente en `/perfil`. **Hecho.** |
| TASK-03 | "27 `<script>`, 5 vendors cargan en `<head>`" | HTML inicial: 12 scripts, **0** vendors antes del consentimiento (`lib/consent.ts`). Sigue siendo cierto que hay 5 vendors tras aceptar → P2-5 (dejar GA4 + Clarity) se mantiene y es barato. |
| TASK-04 | "Intro de 3–4 s; `<h1>` con `opacity: 0` esperando IntersectionObserver" | Loader ahora 1,6 s. El hero se renderiza visible en SSR y GSAP anima *desde* opacidad 0 (no *hacia*). **Nuevo hallazgo derivado:** el velo del loader se sirve con `opacity: 1` en el HTML (`aria-hidden="false"`) y solo lo apaga la hidratación → **sin JS o si la hidratación falla, escritorio muestra un velo opaco indefinido**. Refuerza P0-6. El solape nav/hero (dos "Escríbeme" a la vez) es válido → P1-11. |
| TASK-05 | "`#a8a8a8` 1,44:1 · `#878787` 2,17:1" | Incorrecto: sobre `#1b1e27` son 6,5:1 y 4,6:1 (medido). Los fallos reales son `#6d6d6d` (3,2:1) y `#4d4d4d` (1,97:1), como en §12. La escala de 7 pasos y el piso de 12 px coinciden con §11. |
| TASK-06 | "No existe banner de consentimiento" | Existe (`ConsentBanner.tsx`) y bloquea los 5 vendors hasta aceptar. **Hecho.** |
| TASK-07 | Sin embudo ni smart events en Clarity | Válido y barato. **Se añade** como P0-7: sin instrumentación, el rediseño no se puede evaluar. |
| Restricción | "Mantén el sitio como HTML estático, sin frameworks" | Obsoleta: el sitio ya es Next.js 16. |

### Ajustes al backlog

- **P0-7 (nuevo):** embudo Clarity `/ → clic en caso → página de caso → #contacto / clic email` + smart events (caso, contactar, copiar email, LinkedIn). Hacerlo **antes** del rediseño para tener línea base comparable.
- **P0-6 (reforzado):** el loader además rompe el no-JS. Retirar.
- **P1-1 y P1-2 pasan a la primera tanda** junto a los P0: con un 27 % de scroll, ningún arreglo técnico sirve si la evidencia sigue a 2.400 px.
- **P2-5 → P1:** eliminar Hotjar, Plerdy y HubSpot (tres grabadores redundantes; menos peso tras aceptar; banner más corto).
- Re-medir a 30 días con el embudo; no antes.
