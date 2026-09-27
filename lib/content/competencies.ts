/* Las competencias tal como están redactadas en el portfolio anterior
   (su página /perfil, ya sustituida por esta): mismo texto, misma numeración.
   Aquí solo cambia la presentación. */
export type Competency = { id: string; title: string; body: string };
export type CompetencyGroup = { n: string; name: string; items: Competency[] };

export const COMPETENCIES: CompetencyGroup[] = [
  {
    n: '01',
    name: 'Estrategia y diseño de producto',
    items: [
      { id: '1.1', title: 'Diseño de producto end-to-end', body: 'Definición del problema, investigación, arquitectura de información, user flows, prototipado, validación, entrega e iteración después del lanzamiento.' },
      { id: '1.2', title: 'Pensamiento de producto y negocio', body: 'Traducir necesidades de usuario y objetivos de negocio en soluciones viables, escalables y alineadas con la estrategia.' },
      { id: '1.3', title: 'Diseño basado en evidencia', body: 'Analítica de producto, feedback de usuarios, pruebas de usabilidad e hipótesis para priorizar mejoras y fundamentar decisiones.' },
      { id: '1.4', title: 'Experiencias complejas en B2B SaaS', body: 'Entornos con reglas de negocio, múltiples roles, flujos críticos y alta densidad de información.' },
      { id: '1.5', title: 'Arquitectura de información y flujos', body: 'Simplificar procesos complejos para mejorar comprensión, eficiencia y finalización de tareas.' },
      { id: '1.6', title: 'Diseño accesible e inclusivo', body: 'Aplicación práctica de WCAG 2.1 y 2.2 en componentes, contenido, contraste, foco, navegación por teclado y estados de error.' },
    ],
  },
  {
    n: '02',
    name: 'Liderazgo e influencia',
    items: [
      { id: '2.1', title: 'Comunicación estratégica', body: 'Presentar propuestas, racionales de diseño y hallazgos para alinear a Product, Engineering, Product Owners y stakeholders.' },
      { id: '2.2', title: 'Facilitación de dinámicas de producto', body: 'Workshops, sesiones de co-creación, design critiques, definición de flujos y decisiones tomadas en grupo.' },
      { id: '2.3', title: 'Influencia transversal', body: 'Equilibrio entre experiencia de usuario, objetivos de negocio, prioridades de roadmap y restricciones técnicas.' },
      { id: '2.4', title: 'Evangelización de producto y diseño', body: 'Explicar la propuesta de valor y las decisiones de diseño ante equipos internos, clientes o audiencias externas.' },
      { id: '2.5', title: 'Gestión del conocimiento', body: 'Documentación, guías, onboarding y estándares de trabajo que dan autonomía y consistencia al equipo.' },
      { id: '2.6', title: 'Autonomía y adaptación', body: 'Ownership de iniciativas desde la exploración hasta la implementación, en contextos dinámicos y de alta ambigüedad.' },
    ],
  },
  {
    n: '03',
    name: 'Design systems y calidad',
    items: [
      { id: '3.1', title: 'Pensamiento sistémico', body: 'Creación, evolución y mantenimiento de design systems para plataformas digitales complejas.' },
      { id: '3.2', title: 'Gobernanza del sistema', body: 'Principios, foundations, tokens, componentes, patrones, documentación, contribución y adopción entre equipos.' },
      { id: '3.3', title: 'Interfaces escalables', body: 'UI consistente, responsive, accesible y preparada para múltiples casos de uso, estados y dispositivos.' },
      { id: '3.4', title: 'Calidad de experiencia', body: 'Interacción, jerarquía visual, microcopy, estados vacíos, errores, carga, feedback y escenarios límite.' },
      { id: '3.5', title: 'Coherencia entre marca y producto', body: 'Identidad visual, tono y principios de marca aplicados al producto, junto a Brand y Marketing.' },
    ],
  },
  {
    n: '04',
    name: 'Colaboración técnica y entrega',
    items: [
      { id: '4.1', title: 'Colaboración estrecha con desarrollo', body: 'Especificaciones claras, handoff estructurado, revisión de implementación y dudas resueltas juntos para preservar la intención de diseño.' },
      { id: '4.2', title: 'Front-end aplicado al diseño', body: 'Componentes, responsive, design tokens y límites de implementación en entornos React, TypeScript y Chakra UI.' },
      { id: '4.3', title: 'Diseño orientado a viabilidad técnica', body: 'Soluciones que equilibran calidad UX/UI, esfuerzo de desarrollo, mantenimiento y escalabilidad.' },
      { id: '4.4', title: 'Trabajo ágil y delivery', body: 'Scrum y Kanban con Jira: prioridades, refinamiento y seguimiento de iniciativas.' },
      { id: '4.5', title: 'Herramientas de diseño y documentación', body: 'Figma, prototipado, bibliotecas de componentes, documentación de patrones y handoff con equipos técnicos.' },
    ],
  },
];
