# Product Design Agency Starter

Repositorio para extraer, documentar y gobernar un sistema de diseño desde pantallas de Figma con Claude Code, Figma MCP y un flujo multiagente.

## Principio operativo

La evidencia observada en Figma es la base. Toda conclusión se clasifica como `confirmed`, `recurring`, `candidate`, `proposed` o `pending`. Las propuestas no son hechos hasta que se aprueben.

## Flujo

1. Copia enlaces a selecciones concretas de Figma.
2. Ejecuta la skill `figma-design-system-extraction`.
3. Revisa la matriz de evidencia antes de aceptar tokens o componentes.
4. Aprueba las decisiones abiertas.
5. Publica tokens y componentes validados en Figma y desarrollo.

## Estructura

- `specs/`: documentación humana y contexto para agentes.
- `tokens/`: contratos técnicos de tokens.
- `.claude/skills/`: workflows reutilizables.
- `.claude/agents/`: roles especializados.
- `output/`: entregables de cada ejecución.

## Estado de madurez

Empieza como **exploratorio**. No consideres el sistema consolidado hasta que se hayan revisado pantallas representativas de navegación, formularios, tablas/listados, detalle, carga, vacío y error.
