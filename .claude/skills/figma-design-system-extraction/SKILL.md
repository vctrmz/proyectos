---
name: figma-design-system-extraction
description: Analiza selecciones de Figma mediante MCP y crea o actualiza documentación de un Design System trazable. Úsala cuando haya enlaces de Figma, frames, pantallas o peticiones para extraer tokens, patrones, componentes o auditorías de consistencia.
---

# Extracción de Design System desde Figma

## Objetivo

Construir documentación y artefactos de Design System desde evidencia verificable en Figma, sin presentar inferencias como hechos.

## Secuencia

1. Comprueba acceso y lista los frames procesables.
2. Obtén el contexto estructurado de cada selección mediante Figma MCP.
3. Actualiza `specs/audits/evidence-matrix.md`.
4. Clasifica cada hallazgo: `confirmed`, `recurring`, `candidate`, `proposed` o `pending`.
5. Extrae foundations antes de crear componentes.
6. Propón tokens solo ante repetición o decisión explícita.
7. Documenta componentes, patrones y accesibilidad.
8. Ejecuta QA editorial y de trazabilidad.
9. Actualiza `README.md`, `CLAUDE.md` y `output/`.

## Reglas críticas

- No inventes valores, variantes, estados ni flujos.
- Toda afirmación debe tener evidencia o etiqueta explícita de propuesta.
- No declares contraste o cumplimiento WCAG sin datos verificables.
- No crees archivos vacíos.
- Documenta la migración antes de renombrar o eliminar contratos existentes.

## Respuesta final

Devuelve resumen ejecutivo, madurez, inventario, inconsistencias, riesgos de accesibilidad, backlog, archivos modificados y preguntas abiertas justificadas.
