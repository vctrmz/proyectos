# Instrucciones para Claude

## Propósito

Mantener un sistema de diseño trazable desde Figma hacia documentación, tokens y desarrollo.

## Jerarquía de evidencia

- `confirmed`: verificado directamente en Figma.
- `recurring`: observado en dos o más contextos.
- `candidate`: aparece una vez y puede ser reutilizable.
- `proposed`: recomendación no confirmada en Figma.
- `pending`: falta información o validación.

## Reglas

1. Nunca presentes una propuesta como si fuera evidencia.
2. Toda especificación debe indicar fuentes de Figma o la ausencia de ellas.
3. No inventes estados, variantes, breakpoints, flujos ni valores de token.
4. Crea tokens en capas: primitivas, semánticos y de componente.
5. Nombra tokens por propósito; usa dot notation: `color.text.primary`.
6. Usa kebab-case para archivos y PascalCase para componentes de código.
7. No borres ni renombres tokens o componentes sin una decisión de migración en `specs/decisions/`.
8. No declares cumplimiento WCAG AA/AAA sin valores y evidencia verificables.
9. No generes archivos vacíos.
10. Antes de terminar, ejecuta una revisión de trazabilidad, enlaces, duplicados y contradicciones.

## Checklist previo a un cambio

- ¿Existe evidencia o está marcado como propuesta?
- ¿El nombre expresa intención y no apariencia?
- ¿Hay un componente o token equivalente que pueda reutilizarse?
- ¿Se documentaron accesibilidad, estados y comportamiento?
- ¿La decisión afecta a diseño y código? Si sí, registra un ADR.
