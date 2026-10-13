---
name: design-system-agency
description: "Agencia de product designers que convierte un par de pantallas (enlaces de Figma o capturas PNG) en un sistema de diseño legible por IA. Genera specs/ por capas (foundations, tokens, atoms, molecules, organisms, patterns), tokens en tres capas (JSON DTCG → tokens.css), auditorías de evidencia, consistencia, accesibilidad y cobertura, y la sección de CLAUDE.md que obliga a usarlo. Úsala cuando el usuario pase pantallas o enlaces de Figma y pida extraer, documentar, crear o ampliar un design system, tokens, specs de componentes, o «exponer el sistema a la IA». También para añadir pantallas nuevas a un sistema ya extraído."
---

# Agencia de sistema de diseño

Tú diriges el encargo. Siete especialistas (`.claude/agents/`) hacen el trabajo. Las reglas de evidencia de `CLAUDE.md` mandan sobre todo lo demás: **nada se afirma sin fuente y nada se inventa para completar**.

El resultado es la estructura del método de Hardik Pandya ([Expose your design system to LLMs](https://hardik.substack.com/p/expose-your-design-system-to-llms)), construida desde pantallas reales y con cada valor trazado hasta su origen.

## Equipo

| Agente | Papel | Escribe (y nadie más) |
|---|---|---|
| `figma-evidence-extractor` | Investigación: mide, no opina | `specs/screens/<slug>.md`, `specs/screens/<slug>.evidence.json`, `output/<run>/capturas/` |
| `token-architect` | Fundamentos y tokens | `tokens/**`, `specs/foundations/*` (menos accesibilidad y contenido), `specs/tokens/*`, `specs/audits/consistency-audit.md`, ADR de tokens |
| `component-and-interaction-analyst` | Componentes | `specs/atoms/*`, `specs/molecules/*`, `specs/organisms/*` |
| `ux-pattern-and-ia-analyst` | Patrones y contenido | `specs/patterns/*`, `specs/foundations/content-and-voice.md` |
| `accessibility-reviewer` | Accesibilidad | `specs/foundations/accessibility.md`, `specs/audits/accessibility-audit.md` |
| `documentation-and-handoff-editor` | Edición y entrega | sección «Relaciones» de todas las specs, `specs/decisions/open-questions.md`, sección de CLAUDE.md, `output/<run>/system-map.md`, `output/<run>/backlog.md` |
| `design-director` | Dirección y control de calidad | `output/<run>/revision-direccion.md` |

Cada agente escribe solo en sus archivos. Así pueden trabajar en paralelo sin pisarse.

Reglas comunes de los encargos a agentes:
- Da siempre la **ruta absoluta del proyecto**: los agentes no arrancan necesariamente en él.
- Cada agente valida solo lo suyo con `node scripts/validate-links.js --only <sus carpetas>` y `npm run ds:verify` (no escribe nada). `npm run ds:check` regenera archivos: lo ejecutan solo tú, el editor y la dirección.
- Pide a cada agente una línea «Fricciones:» al final. Sirve para mejorar la agencia.

Guías en `.claude/skills/design-system-agency/references/`: `evidence-model.md`, `figma-extraction.md`, `figma-evidence-scan.js`, `image-extraction.md`, `taxonomy.md`, `token-architecture.md`, `spec-templates.md`, `quality-gate.md`.

## 0 · Encargo (tú)

1. **Entradas.** Reúne las pantallas:
   - Enlaces de Figma **con `node-id`** (uno por frame). Si falta, pide el enlace del frame.
   - Capturas PNG en `inputs/`. Si el usuario las pega en el chat, cópialas a `inputs/` con un nombre descriptivo.
   - Asigna a cada pantalla un `slug` en kebab-case (`alta-cliente-contacto`).
2. **Modo.** Sin `specs/screens/*.evidence.json` → `crear`. Con ellos → `ampliar`: solo se extraen las pantallas nuevas, el resto de fases se rehacen sobre toda la evidencia y **ningún contrato existente se borra ni se renombra** sin ADR.
3. **Briefing mínimo.** Producto, plataforma (web, iOS, Android) y stack de destino (CSS por defecto; Tailwind si lo dicen). Dedúcelo de las pantallas y del repositorio; pregunta solo lo que no se pueda deducir, en una sola tanda.
4. **Carpeta del encargo.** `output/<AAAA-MM-DD>-<producto>/` con `encargo.md`: entradas, modo, briefing y fecha.
5. **Comprobación previa.** Con enlaces de Figma, haz una llamada barata (`get_screenshot` de la primera pantalla) para confirmar acceso antes de lanzar agentes.

Anuncia en una línea el tamaño del sistema que vas a producir: con 1-3 pantallas, solo lo observado (lo normal son 15-30 archivos, no 64). Una capa pequeña y exacta vale más que una completa e inventada.

## 1 · Evidencia (en paralelo)

Lanza un `figma-evidence-extractor` **por pantalla**, todos a la vez (máximo 6 simultáneos). Prompt de cada uno:

> Encargo `output/<run>/`. Pantalla `<slug>`: `<enlace de Figma o ruta PNG>`. Modo `<crear|ampliar>`. Lee `CLAUDE.md` y la guía `<figma-extraction.md | image-extraction.md>`. Escribe `specs/screens/<slug>.evidence.json` según `evidence-model.md` y `specs/screens/<slug>.md` con la plantilla de pantalla. Solo hechos medidos.

Cuando terminen todos: `node scripts/merge-evidence.js`. Si falla, devuelve el error al extractor de esa pantalla.

Revisa los nombres de componentes del resumen: si dos extractores llamaron igual a cosas distintas (o distinto a lo mismo), corrige las fichas de evidencia **antes** de seguir, con el extractor de cada pantalla. Un nombre mal unido infla el estado en todo lo que viene después.

## 2 · Fundamentos y tokens

Lanza `token-architect`:

> Encargo `output/<run>/`. Lee `specs/audits/evidence-summary.json`, `CLAUDE.md` y `token-architecture.md`. Construye `tokens/*.json`, genera `tokens.css`, escribe las foundations con evidencia y `specs/audits/consistency-audit.md`. Las consolidaciones que cambien algo visible van como ADR `proposed`.

Si el usuario pidió revisar antes de seguir, o el arquitecto deja decisiones que bloquean (dos colores primarios igual de usados, por ejemplo), para aquí: enseña la escala de color, tipografía y espaciado y pregunta. Si no, continúa.

## 3 · Componentes, patrones y accesibilidad (en paralelo)

Antes de lanzar, fija la **lista de nombres**: cada componente y patrón observado con su archivo (`organisms/work-item-header.md`…), según `taxonomy.md`. Escríbela en `encargo.md` y pásala a todos. Los agentes paralelos no se ven entre sí: sin lista común, cada uno enlaza con nombres distintos.

Lanza a la vez:

- `component-and-interaction-analyst`: componentes de `evidence-summary.json` clasificados con `taxonomy.md`, con la plantilla de componente. Con más de 12 componentes, lanza dos: uno para atoms y molecules, otro para organisms.
- `ux-pattern-and-ia-analyst`: patrones observados en `specs/screens/*.md` y `content-and-voice.md`.
- `accessibility-reviewer`: contraste calculado con `node scripts/contrast.js`, foco, teclado, formularios y tablas sobre lo observado.

Todos leen `tokens.css` y citan solo tokens que existan. Lo que falte se cita en dot notation como propuesta (`color.border.control`), nunca como `--variable`. Las referencias a specs de otros agentes van como ruta entre comillas invertidas; el editor las enlaza.

## 4 · Edición

Lanza `documentation-and-handoff-editor`: enlaces pendientes, relaciones «Usa / Lo usan» en ambos sentidos, contradicciones entre specs, preguntas abiertas, mapa del sistema, backlog y la sección «Sistema de diseño» de `CLAUDE.md`. Debe acabar con `npm run ds:check` en 0 errores.

**Vuelta de autores.** Si el editor registra contradicciones de hecho (una spec da por observado lo que otra trata como propuesta, cifras distintas para lo mismo), devuélvelas a sus autores **antes** de la dirección, en paralelo y con el texto de la contradicción. La puerta de calidad sale mucho más barata.

## 5 · Puerta de calidad

Lanza `design-director` con `quality-gate.md`. Puede leer Figma en solo lectura para comprobar colores exactos. Si el veredicto es **No listo**:

1. Relanza solo a los agentes señalados, en paralelo, con sus correcciones (el editor, el último). Si sigues hablando con el mismo agente, retómalo en lugar de lanzar uno nuevo: ya tiene el contexto.
2. Las correcciones arrastran erratas hermanas (la misma cifra en otro archivo): deja que el agente las corrija en la misma vuelta.
3. Vuelve a pasar la puerta **una vez**, retomando a la misma dirección, centrada en comprobar las correcciones. Si sigue sin pasar, entrega con reservas y dilo.

## 6 · Entrega (tú)

1. `npm run ds:check` en verde.
2. `output/<run>/informe.md`: qué se ha creado (árbol), madurez, las 5 inconsistencias más importantes, riesgos de accesibilidad, decisiones que esperan al equipo y **qué pantallas mandar después** (los tipos que faltan en `coverage-matrix.md`).
3. Responde al usuario en pocas líneas: madurez, cifras (pantallas, tokens, specs), lo más relevante que encontró la agencia y el siguiente paso. Enlaza el informe.
4. Si el proyecto es un repositorio git, ofrece el commit; no lo hagas sin que lo pida.

## Si el proyecto ya tiene código

Después de la entrega, `npm run ds:audit-code` (o `node scripts/token-audit.js <carpeta>`) lista los valores escritos a mano con su token sugerido. Sustituirlos es otro encargo: proponlo, no lo hagas por tu cuenta.

## Nunca

- Inventar estados, variantes, breakpoints, flujos o valores para completar una plantilla.
- Crear specs de componentes que no aparecen en las pantallas.
- Dar un estado `confirmed` a algo medido sobre una imagen.
- Editar a mano `tokens.css`, `token-reference.md`, `evidence-matrix.md` o `coverage-matrix.md`: se generan.
- Escribir en Figma. Publicar variables o componentes en Figma es otro encargo (skills `figma-generate-library` o `figma-variables-generator`).
