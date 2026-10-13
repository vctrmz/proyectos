# Product Design Agency Starter

Una agencia de product designers hecha de agentes de Claude Code. Le pasas un par de pantallas (enlaces de Figma o capturas PNG) y te devuelve un sistema de diseño legible por IA: specs por capas, tokens en tres capas, `tokens.css`, auditorías y la sección de `CLAUDE.md` que obliga a usarlo.

> Esta rama (`agencia-design-system`) vive aparte del portfolio: no comparte historial con `main` y no se despliega en Vercel (`vercel.json` desactiva los despliegues de esta rama).

Sigue el método de Hardik Pandya, [Expose your design system to LLMs](https://hardik.substack.com/p/expose-your-design-system-to-llms), con una diferencia: aquí todo parte de pantallas reales y cada valor apunta a su origen (un nodo de Figma o un píxel).

## Cómo se usa

1. Copia esta carpeta para cada proyecto (o úsala como plantilla de repositorio).
2. Abre Claude Code en ella, con el conector de Figma activo si vas a usar enlaces.
3. Pide el encargo:

   ```text
   /design-system-agency
   https://www.figma.com/design/<fileKey>/<nombre>?node-id=1-2
   https://www.figma.com/design/<fileKey>/<nombre>?node-id=3-4
   ```

   O con capturas: déjalas en `inputs/` (en PNG) y escribe `/design-system-agency inputs/`.

Cada enlace debe apuntar a un frame concreto (con `node-id`). Con capturas, los colores salen exactos y las medidas, estimadas: la agencia lo marca.

## Qué hace la agencia

| Fase | Quién | Resultado |
|---|---|---|
| 0 · Encargo | Claude (dirección del encargo) | `output/<fecha>-<producto>/encargo.md` |
| 1 · Evidencia | `figma-evidence-extractor`, uno por pantalla, en paralelo | `specs/screens/` y la matriz de evidencia |
| 2 · Fundamentos y tokens | `token-architect` | `tokens/*.json`, `tokens.css`, `specs/foundations/`, `specs/tokens/`, auditoría de consistencia |
| 3 · Componentes, patrones, accesibilidad | `component-and-interaction-analyst`, `ux-pattern-and-ia-analyst`, `accessibility-reviewer`, en paralelo | `specs/atoms/`, `molecules/`, `organisms/`, `patterns/`, auditoría de accesibilidad |
| 4 · Edición | `documentation-and-handoff-editor` | relaciones, preguntas abiertas, mapa, backlog, `CLAUDE.md` |
| 5 · Calidad | `design-director` | veredicto y correcciones |
| 6 · Entrega | Claude | `output/<run>/informe.md` |

Para ampliar el sistema, vuelve a lanzar la skill con pantallas nuevas: solo extrae esas, rehace lo demás sobre toda la evidencia y no borra nada sin ADR.

## Estructura que se genera

```text
specs/
  foundations/   color, typography, spacing, radius…   (solo las que tienen evidencia)
  tokens/        token-reference (generado) y una por categoría
  atoms/  molecules/  organisms/                        (solo lo que aparece en pantalla)
  patterns/      form-layout, list-detail…
  screens/       una ficha y un .evidence.json por pantalla
  audits/        evidencia, consistencia, accesibilidad, cobertura
  decisions/     ADR y preguntas abiertas
tokens/          primitives.json · semantic.json · components.json · modes/   (fuente de verdad, DTCG)
tokens.css       generado: capa 1 --ds-*, capa 2 semánticos, capa 3 componentes
output/          un informe por encargo
```

## Scripts

Sin dependencias; Node 18 o superior.

| Comando | Qué hace |
|---|---|
| `npm run ds:evidence` | Une la evidencia de las pantallas y la clasifica (`merge-evidence.js`) |
| `npm run ds:build` | Valida los tokens y genera `tokens.css` y la referencia |
| `npm run ds:verify` | Comprueba tokens, enlaces, frontmatter y tokens citados sin escribir nada (para agentes y revisiones) |
| `npm run ds:check` | Regenera evidencia, tokens y cobertura y lo valida todo. Debe salir en 0 errores |
| `npm run ds:audit-code` | Busca valores escritos a mano en `src/` y sugiere el token |
| `node scripts/image-palette.js <png>` | Paleta exacta de una captura; `--at x,y` lee un píxel |
| `node scripts/contrast.js <texto> <fondo>` | Ratio de contraste WCAG |

## Madurez

`npm run ds:check` calcula la madurez en `specs/audits/coverage-matrix.md`:

- **exploratorio**: pocas pantallas o poca evidencia sólida. Es lo normal tras el primer encargo.
- **emergente**: 3+ de los 6 tipos de pantalla (formulario, tabla, detalle, carga, vacío, error) y 40 %+ de specs con evidencia sólida.
- **consolidado**: 5+ de esos 6 tipos y 70 %+ sólidas.

El informe de cada encargo dice qué pantallas mandar después para subir de nivel.

## Créditos

- Método: Hardik Pandya, [Expose your design system to LLMs](https://hardik.substack.com/p/expose-your-design-system-to-llms).
- La arquitectura de tokens, las plantillas y la auditoría de código se inspiran en [ds-specs](https://github.com/ejun-9/ds-specs) (MIT, Eun Ji Jung).
