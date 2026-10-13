# Instrucciones para Claude

## Propósito

Mantener un sistema de diseño trazable desde las pantallas (Figma o capturas) hasta la documentación, los tokens y el código. Para crearlo o ampliarlo, usa la skill `design-system-agency`.

## Jerarquía de evidencia

- `confirmed`: en Figma y ligado a una variable, un estilo o un componente maestro.
- `recurring`: observado en 2+ pantallas, o 3+ veces en una misma pantalla.
- `candidate`: aparece 1-2 veces en una sola pantalla; puede ser reutilizable o un error.
- `proposed`: recomendación no observada; siempre con su motivo.
- `pending`: falta información o validación; la pregunta va a `specs/decisions/open-questions.md`.

Lo medido sobre una captura nunca es `confirmed`. Detalle en `.claude/skills/design-system-agency/references/evidence-model.md`.

## Reglas

1. Nunca presentes una propuesta como si fuera evidencia.
2. Toda spec indica sus fuentes (`figma:<fileKey>/<nodeId>` o `image:<ruta>`) o declara que no las tiene.
3. No inventes estados, variantes, breakpoints, flujos ni valores de token presentados como observados. Lo que propongas va con estado `proposed` y su motivo; lo que no se pueda proponer con criterio, a preguntas abiertas como `pending`.
4. Tokens en tres capas: primitivas (`--ds-*`), semánticos y de componente. Los componentes usan solo la capa 2 o la 3.
5. Nombra tokens por propósito, en dot notation: `color.text.primary` → `--color-text-primary`.
6. Kebab-case para archivos y PascalCase para componentes de código.
7. No borres ni renombres tokens o componentes sin un ADR en `specs/decisions/`.
8. No declares cumplimiento WCAG sin la ratio calculada con `scripts/contrast.js`.
9. No generes archivos vacíos ni specs de componentes que no aparecen en las pantallas.
10. No edites a mano los archivos generados: `tokens.css`, `specs/tokens/token-reference.md`, `specs/audits/evidence-matrix.md`, `specs/audits/evidence-summary.json`, `specs/audits/coverage-matrix.md`.
11. Antes de terminar, `npm run ds:verify` con 0 errores (no escribe nada). `npm run ds:check` regenera evidencia, tokens y cobertura: lo ejecutan quien dirige el encargo, el editor y la dirección.

## Checklist previo a un cambio

- ¿Existe evidencia o está marcado como propuesta?
- ¿El nombre expresa intención y no apariencia?
- ¿Hay un componente o token equivalente que pueda reutilizarse?
- ¿Se documentaron accesibilidad, estados y comportamiento?
- ¿La decisión afecta a diseño y código? Si sí, registra un ADR.

## Sistema de diseño

Todavía no hay sistema extraído. La sección la completa `documentation-and-handoff-editor` al terminar el primer encargo, con la regla de sesión y la lista de componentes documentados.
