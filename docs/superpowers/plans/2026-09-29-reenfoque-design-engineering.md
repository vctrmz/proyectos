# Reenfoque «diseño que llega a código»: plan de implementación

> **Para agentes:** SUB-SKILL OBLIGATORIA: usa superpowers:subagent-driven-development (recomendada) o superpowers:executing-plans para ejecutar este plan tarea a tarea. Los pasos usan casillas (`- [ ]`) para el seguimiento.

**Objetivo:** que un lead técnico o un reclutador vea en 30 segundos que Víctor diseña sistemas y los lleva a código, con pruebas que se pueden abrir (repo público, CV en PDF, código real), sin afirmar nada que no se pueda defender en una entrevista.

**Arquitectura:** los cambios se hacen sobre el sistema existente. Los textos van en `lib/i18n/ui.ts` y `lib/content/*`, en español y en inglés. Hay dos componentes nuevos (`Stack` y `CvLink`), un diagrama nuevo y un caso nuevo, «Esta web», que usa la plantilla `CasePage`. Todo el trabajo va en una rama, se revisa en el preview de Vercel y pasa a producción con un merge a `main`.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, CSS Modules con tokens en `app/globals.css`, Vitest + Testing Library, Playwright + axe (`scripts/audit.mjs`), Vercel.

**Spec:** el feedback de Gemini (`C:\Users\Khan\Downloads\gemini-code-1790697610131.md` y el texto pegado en la sesión del 2026-09-29), filtrado por las decisiones D1–D9 de abajo. Contexto previo: `docs/superpowers/specs/2026-09-22-rediseno-antigravity-design.md` y `docs/auditoria/2026-09-22-reauditoria.md`.

---

## Estado de partida (medido el 2026-09-29)

- `main` local va **1 commit por delante** de `origin/main` (`d310da2` cambia el dominio canónico). Producción sigue sirviendo `canonical = https://proyectos-sable.vercel.app/es`.
- La base de tests está en verde: 27 ficheros y 102 tests.
- `github.com/vctrmz` **no tiene ningún repositorio público**. `vctrmz/proyectos` da 404 sin sesión, así que enlazar GitHub hoy restaría credibilidad.
- La portada define el rol como «Product Designer · B2B SaaS e Insurtech». El CV local (`../cv/cv.html`, 24-08) dice «Product Designer (UX/UI)» y «trabajo con HTML y CSS; colaboración diaria con React…». «Sobre mí» dice: «Mi base en informática **no está para escribir código de producción**». La re-auditoría del 22-09 retiró a propósito del hero el claim «escribo el front».
- El botón «Contactar» del hero lleva a `#contacto`, que es el cierre oscuro, y ahí **no hay ningún botón de contacto**: los botones están en el footer, más abajo.
- Los fragmentos de código de los casos se etiquetan siempre como «ejemplo ilustrativo», en español incluso en `/en`.
- `CasePage` pinta `<SiteFooter />` sin `locale`, así que `/en/cases/hermes` sale con el footer en español.
- `public/assets/shots/` tiene **69 capturas que ningún caso usa** pero que se pueden abrir por URL. Una de ellas, `ayax-sobre.webp`, muestra las fotos y los nombres del equipo de Ayax.
- La imagen `og.png` dice «PRODUCT DESIGNER (UX/UI)» con las fuentes retiradas (Bebas/Montserrat), y ya no existe el HTML del que salió.

## Decisiones (las responde Víctor antes de ejecutar)

| # | Decisión | Recomendación | Por qué |
|---|---|---|---|
| D1 | Rol en la portada | **A:** `Product Designer · Design Systems · B2B SaaS e Insurtech` (en: `… B2B SaaS and Insurtech`). La alternativa **B** es `Product Designer & Design Engineer · B2B SaaS, Design Systems e Insurtech` | La B choca con el CV y con «Sobre mí», y en una entrevista de Design Engineer suele haber prueba técnica en React/TS. La A capta la búsqueda de *design systems* y deja que la capacidad técnica la demuestren el stack y el repo. Elige la B solo si pasarías esa prueba, y en ese caso cambia también el CV y LinkedIn. |
| D2 | Stack visible | Diseño y sistemas: Figma (avanzado), Design tokens, Arquitectura de componentes, Accesibilidad WCAG 2.2. Código y entrega: HTML · CSS, React, Next.js, TypeScript, Git y pull requests, Vitest · axe, Vercel | Todo sale de esta web, que es verificable. **Quita lo que no defenderías en una entrevista técnica.** Style Dictionary y Storybook no entran: no hay evidencia. |
| D3 | Hacer público `vctrmz/proyectos` | Sí, tras la auditoría de la Tarea 8 | Es la prueba más fuerte: planes, specs, tests y commits. El enlace a GitHub no se publica hasta que el repo sea público. |
| D4 | CV en PDF | Un PDF actualizado con el rol de D1, en español, servido en `/victor-maza-cv.pdf` y enlazado desde `/en` como «Download CV (PDF, Spanish)» | El PDF local del 24-08 sigue diciendo «Product Designer (UX/UI)» y enlaza `behance.net/mazdesignr`, con una «r» de más: la web usa `mazdesign`. |
| D5 | Disponibilidad | es: `Disponible ahora · roles Senior o Lead de Product Design · remoto o híbrido en Málaga` / en: `Available now · Senior or Lead Product Design roles · remote or hybrid in Málaga` | «Disponible desde septiembre de 2026» ya caducó, y «Disponible para proyectos» es ambiguo (¿freelance?). Hay que confirmar el tipo de rol, jornada, freelance/fractional y si se incluye «Design Engineering». |
| D6 | Redes | Instagram fuera de toda la web. Behance solo en el footer y en «Sobre mí», porque Taksio vive ahí. El hero enseña LinkedIn y GitHub | Instagram no aporta a un lead técnico. |
| D7 | Afirmaciones sobre Atrinium | Solo entra lo confirmado. Preguntas: ¿cómo llegaban los tokens de Figma al código (Tokens Studio, Style Dictionary, a mano)? ¿La librería de componentes era React + Chakra UI? ¿Se escribían registros de decisión (ADR)? | Gemini propone etiquetas como «ADRs» o «React Component Library». Si no son ciertas, son el mismo riesgo que inventar un estudio. |
| D8 | Caso nuevo «Esta web» | Sí, en español y en inglés | Es la evidencia honesta de «lo llevo a producción»: spec → plan → código con IA → revisión → tests. Depende de D3. |
| D9 | Historial del repo al hacerlo público | Publicar con historial (los commits también son evidencia) y retirar `ayax-sobre.webp` y las capturas sin uso en esta rama | La foto del equipo de Ayax ya se sirve por URL en producción. Si prefieres que tampoco quede en el historial, la alternativa es publicar un repo nuevo con un solo commit inicial. |

Si Víctor elige D1 = B, en la Tarea 1 se usan las cadenas marcadas como «Variante B». El resto del plan no cambia.

## Restricciones globales

- **Nada que no se pueda defender en una entrevista.** No se publican Style Dictionary, ADR ni «React Component Library» referidos a Atrinium sin confirmar D7. Los extractos que reconstruyen código de cliente llevan `source: 'illustrative'`.
- **Ningún enlace a GitHub llega a producción mientras `vctrmz/proyectos` sea privado.** La Tarea 13 lo comprueba antes del merge.
- **Todo texto nuevo existe en `es` y en `en`.** La interfaz `Ui` de `lib/i18n/ui.ts` obliga a ello; en el contenido, `lib/content/en/*` sobrescribe el español.
- **Solo se usan tokens de `app/globals.css`.** No se añaden hex nuevos en componentes: `test/tokens.test.ts` y la re-auditoría lo vigilan.
- **Accesibilidad:** objetivos de toque de 44 px o más, 0 violaciones axe A/AA en `npm run audit`, y todo el motion apagado con `prefers-reduced-motion`.
- **Next.js 16:** antes de tocar APIs de Next (metadata, `Link`, rutas), se lee la guía correspondiente en `node_modules/next/dist/docs/` (`AGENTS.md`).
- **Commits:** en español y en tercera persona del presente, como el historial («Añade…», «Cambia…»). Terminan con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Despliegue:** cada push a `main` despliega a producción. Todo va en la rama `reenfoque/design-engineering` hasta la Tarea 13.

## Foco de revisión

1. **Páginas `/en`:** cada cadena nueva tiene que estar traducida, el footer de un caso en inglés tiene que salir en inglés y el enlace al CV tiene que avisar de que el PDF está en español. Lo cubren los tests de las Tareas 2, 4 y 10.
2. **Enlace al CV:** el archivo tiene que existir y el tamaño que anuncia la etiqueta tiene que coincidir con el real. Si alguien sustituye el PDF sin actualizar `SITE.cv.kb`, la etiqueta miente. Lo cubre el test de la Tarea 4.
3. **Móvil a 375 px:** el kicker del hero es ahora más largo y no puede recortarse (el bug B2 de la auditoría). Los chips del stack tienen que pasar de línea sin desbordar, y el enlace al CV tiene que medir 44 px o más. Lo cubren `npm run audit` (targets y overflow) y la revisión visual de la Tarea 12.
4. **Enlace a GitHub con el repo aún privado:** el visitante vería un 404. Lo cubre la comprobación con `curl` sin sesión de la Tarea 13, paso 1.
5. **Sin JS o con reduced-motion:** el stack, la disponibilidad y los CTA del cierre tienen que estar en el HTML del servidor. Son componentes de servidor sin estado, y la Tarea 12 lo comprueba con JS desactivado.

---

## Mapa de archivos

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `lib/i18n/ui.ts` | Modificar | Kicker, subtítulo, rol del footer, disponibilidad, etiquetas del CV y de los extractos de código |
| `lib/content/site.ts` | Modificar | Añade `github`, `repo` y `cv`; quita `instagram` y `available` |
| `components/ui/socialIcons.ts` | Crear | Trazados de iconos compartidos (LinkedIn, GitHub, Behance) |
| `components/ui/CvLink.tsx` + `.module.css` + `.test.tsx` | Crear | Enlace de descarga del CV con formato y peso |
| `lib/content/stack.ts`, `lib/content/en/stack.ts` | Crear | Contenido del bloque Stack |
| `components/home/Stack.tsx` + `.module.css` + `.test.tsx` | Crear | Bloque Stack en la portada |
| `components/home/Hero.tsx` + `.module.css` | Modificar | Redes (LinkedIn, GitHub) y enlace al CV |
| `components/home/Closing.tsx` + `.module.css` | Modificar | Disponibilidad y CTA (correo y CV) |
| `components/layout/SiteFooter.tsx` + `.module.css` | Modificar | GitHub y CV; fuera Instagram |
| `components/layout/RootShell.tsx` | Modificar | JSON-LD `sameAs` y `knowsAbout` |
| `components/about/SocialLinks.tsx` | Modificar | Iconos compartidos; fuera Instagram |
| `components/case/CasePage.tsx` | Modificar | `locale` en `CodeDemo` y en `SiteFooter` |
| `components/ui/CodeDemo.tsx` + `.module.css` | Modificar | Origen del extracto (ilustrativo/repo), enlace e idioma |
| `lib/content/cases/types.ts` | Modificar | `CodeDemo.source`, `CodeDemo.href`, `lang: 'css'` y `DiagramId 'spec-to-prod'` |
| `lib/content/cases/hermes.ts`, `lib/content/en/cases/hermes.ts` | Modificar | Extracto del esquema del cuestionario y etiquetas |
| `lib/content/cases/design-system.ts` | Modificar | Etiquetas y `next` |
| `lib/content/en/projects.ts` | Modificar | Traducción de las etiquetas nuevas |
| `components/diagrams/SpecToProd.tsx`, `Diagram.tsx` | Crear / modificar | Diagrama de la cadena spec → producción |
| `lib/content/cases/esta-web.ts`, `lib/content/en/cases/esta-web.ts` | Crear | Caso «Esta web» |
| `lib/content/cases/index.ts`, `lib/content/projects.ts`, `lib/content/en/index.ts`, `lib/content/en/projects.ts` | Modificar | Registrar el caso nuevo |
| `scripts/shots-web.mjs`, `scripts/build-images.mjs` | Crear / modificar | Capturas de esta web |
| `scripts/og.mjs` | Crear | Genera `public/assets/og.png` |
| `lib/content/about.ts`, `lib/content/en/about.ts` | Modificar | Visión coherente con el stack y herramientas |
| `app/[locale]/page.tsx` | Modificar | Metadatos y montaje del Stack |
| `public/victor-maza-cv.pdf`, `public/assets/logos/vm.svg` | Crear | CV y logo del caso nuevo |
| `README.md`, `docs/README.es.md` | Modificar / crear | README público en inglés; el actual pasa a `docs/` |

---

### Task 0: Rama de trabajo y el commit pendiente

**Archivos:** ninguno.

- [ ] **Paso 1: Confirmar con Víctor que se sube `d310da2` a producción.** Es un push a `main`, así que despliega. Solo cambia el canonical a `victormaza.vercel.app`.

- [ ] **Paso 2: Subirlo**

```bash
git push origin main
```

Resultado esperado: `main -> main`. Unos minutos después, `curl -s https://victormaza.vercel.app/es | grep -o 'rel="canonical" href="[^"]*"'` devuelve `https://victormaza.vercel.app/es`.

- [ ] **Paso 3: Crear la rama**

```bash
git switch -c reenfoque/design-engineering
npm test
```

Resultado esperado: 27 ficheros y 102 tests en verde.

---

### Task 1: Posicionamiento (rol, subtítulo, metadatos, visión)

**Archivos:**
- Modificar: `lib/i18n/ui.ts:47-49`, `:88`, `:97-99`, `:138`
- Modificar: `app/[locale]/page.tsx:17-26`
- Modificar: `components/layout/RootShell.tsx:29`
- Modificar: `lib/content/about.ts:40`, `:79`; `lib/content/en/about.ts:33`
- Tests: `components/home/home.test.tsx`, `components/layout/SiteFooter.test.tsx`, `lib/content/about.test.ts`

**Interfaces:**
- Produce: `ui.home.kicker`, `ui.home.heroSub` y `ui.footer.role` con el rol nuevo. Las Tareas 4 y 11 las reutilizan.

- [ ] **Paso 1: Escribir los tests que fallan**

En `components/home/home.test.tsx`, dentro de `describe('portada')`:

```tsx
  it('el hero declara design systems y la implementación en React', () => {
    render(<Hero />);
    expect(screen.getByText(/Product Designer · Design Systems · B2B SaaS e Insurtech/)).toBeInTheDocument();
    expect(screen.getByText(/revis\w+ la implementación en React/)).toBeInTheDocument();
  });
  it('el hero en inglés dice lo mismo', () => {
    render(<Hero locale="en" />);
    expect(screen.getByText(/Product Designer · Design Systems · B2B SaaS and Insurtech/)).toBeInTheDocument();
  });
```

En `components/layout/SiteFooter.test.tsx`, cambia la línea 11:

```tsx
    expect(foot.textContent).toMatch(/Product Designer · Design Systems · B2B SaaS e Insurtech/);
```

En `lib/content/about.test.ts`, añade:

```ts
import { ABOUT_EN } from './en/about';
it('la visión no niega el código que enseña el stack', () => {
  expect(JSON.stringify(ABOUT.vision)).not.toContain('no está para escribir código');
  expect(JSON.stringify(ABOUT_EN.vision)).not.toContain('not there to write production code');
});
```

Antes de pegarlo, comprueba si `ABOUT` ya está importado en ese archivo (`grep -n "import" lib/content/about.test.ts`) y reutiliza ese import.

- [ ] **Paso 2: Ejecutar y ver que fallan**

Ejecuta: `npx vitest run components/home/home.test.tsx components/layout/SiteFooter.test.tsx lib/content/about.test.ts`
Resultado esperado: FALLAN los tres tests nuevos o cambiados, porque no encuentran «Design Systems» y porque la visión aún contiene la frase.

- [ ] **Paso 3: Implementar**

`lib/i18n/ui.ts` (es):

```ts
    kicker: 'Product Designer · Design Systems · B2B SaaS e Insurtech',
    heroLines: ['Diseño producto B2B complejo', 'y lo llevo a producción.'],
    heroSub: 'Nueve años en SaaS asegurador, ERP y banca, casi siempre como único diseñador. Modelo el dominio, lo convierto en tokens, componentes y reglas que el front consume tal cual, y reviso la implementación en React hasta que el diseño llega entero.',
```

```ts
  footer: { role: 'Product Designer · Design Systems · B2B SaaS e Insurtech', /* resto igual */ },
```

`lib/i18n/ui.ts` (en):

```ts
    kicker: 'Product Designer · Design Systems · B2B SaaS and Insurtech',
    heroLines: ['I design complex B2B products', 'and take them to production.'],
    heroSub: 'Nine years in insurance SaaS, ERP and banking, almost always as the only designer. I model the domain, turn it into tokens, components and rules the front end consumes as they are, and review the React implementation until the design ships whole.',
```

```ts
  footer: { role: 'Product Designer · Design Systems · B2B SaaS and Insurtech', /* resto igual */ },
```

**Variante B (solo si D1 = B):** kicker es `Product Designer & Design Engineer · B2B SaaS, Design Systems e Insurtech`; en `Product Designer & Design Engineer · B2B SaaS, Design Systems and Insurtech`. heroSub es `… Modelo el dominio, lo convierto en tokens y componentes, y lo construyo en React y TypeScript hasta que llega a producción.`; en `… I model the domain, turn it into tokens and components, and build it in React and TypeScript until it reaches production.` El `jobTitle` del paso de `RootShell` pasa a ser `'Product Designer & Design Engineer'`. Los tests del paso 1 cambian su regex al kicker B.

`app/[locale]/page.tsx`:

```ts
const META = {
  es: {
    title: 'Víctor Maza — Product Designer · Design Systems, B2B SaaS e Insurtech',
    description: 'Convierto reglas de negocio en tokens, componentes y producto que llega a producción. Nueve años en SaaS asegurador, ERP y banca. Casos de HERMES, design systems y el código de esta web.',
  },
  en: {
    title: 'Víctor Maza — Product Designer · Design Systems, B2B SaaS and Insurtech',
    description: 'I turn business rules into tokens, components and products that reach production. Nine years in insurance SaaS, ERP and banking. Case studies on HERMES, design systems and the code behind this site.',
  },
} as const;
```

`components/layout/RootShell.tsx:29`: al objeto `Person` añádele `knowsAbout`. El `sameAs` se cambia en la Tarea 2.

```tsx
knowsAbout: ['Product design', 'Design systems', 'Design tokens', 'B2B SaaS', 'Insurtech', 'WCAG accessibility', 'React'],
```

`lib/content/about.ts:40`: sustituye el arranque del primer párrafo de `vision.paragraphs`.

```ts
      'Mi base en informática me sirve para *pensar el producto en sistemas, en estructura y en cómo se va a construir de verdad*, y para bajarlo a código cuando hace falta. *Modelo el dominio antes que la pantalla*, *defino estados, reglas y casos límite*, y cierro con un *handoff que el equipo puede construir sin interpretar nada*.',
```

`lib/content/en/about.ts:33`:

```ts
      'My computer science background is there to *think the product in systems, in structure and in how it will actually be built*, and to take it down to code when it is needed. *I model the domain before the screen*, *define states, rules and edge cases*, and close with a *handoff the team can build without interpreting anything*.',
```

`lib/content/about.ts:79`: añade Next.js y TypeScript en «Desarrollo y despliegue», solo si D2 los confirma. El inglés reutiliza los mismos items.

```ts
    { name: 'Desarrollo y despliegue', items: ['HTML · CSS', 'React', 'Next.js', 'TypeScript', 'Chakra UI', 'Tailwind', 'Material UI', 'GitHub', 'Vercel', 'WordPress'] },
```

- [ ] **Paso 4: Ejecutar y ver que pasan**

Ejecuta: `npm test`
Resultado esperado: todo en verde. Si falla un test que buscaba el rol o la frase antiguos (`grep -rn "B2B SaaS e Insurtech'\|código de producción" --include=*.test.* .`), actualízalo a la cadena nueva. No borres el test.

- [ ] **Paso 5: Commit**

```bash
git add lib/i18n/ui.ts app/[locale]/page.tsx components/layout/RootShell.tsx lib/content/about.ts lib/content/en/about.ts components/home/home.test.tsx components/layout/SiteFooter.test.tsx lib/content/about.test.ts
git commit -m "Declara design systems en el rol y alinea la visión con el stack"
```

---

### Task 2: Redes (GitHub dentro, Instagram fuera) e iconos compartidos

**Archivos:**
- Crear: `components/ui/socialIcons.ts`
- Modificar: `lib/content/site.ts`, `components/home/Hero.tsx:11-15, 33-35`, `components/layout/SiteFooter.tsx:26-30`, `components/about/SocialLinks.tsx`, `components/layout/RootShell.tsx:29`, `components/case/CasePage.tsx:118`
- Tests: `components/home/home.test.tsx`, `components/layout/SiteFooter.test.tsx`, `components/case/CasePage.test.tsx`

**Interfaces:**
- Produce: `SITE.github: string`, `SITE.repo: string` (la Tarea 3 usa `SITE.repo`), `SOCIAL_ICON: Record<'LinkedIn' | 'GitHub' | 'Behance', string>` y `type SocialName`.

- [ ] **Paso 1: Escribir los tests que fallan**

En `components/home/home.test.tsx`, sustituye el test «el hero presenta a la persona y sus redes»:

```tsx
  it('el hero presenta a la persona, LinkedIn y GitHub', () => {
    render(<Hero />);
    expect(screen.getByText(/Víctor Maza/)).toBeInTheDocument();
    for (const n of ['LinkedIn', 'GitHub']) expect(screen.getByRole('link', { name: new RegExp(n) })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/vctrmz');
    expect(screen.queryByRole('link', { name: /Instagram/ })).toBeNull();
  });
```

En `components/layout/SiteFooter.test.tsx`, dentro del primer test:

```tsx
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/vctrmz');
    expect(screen.queryByRole('link', { name: /Instagram/ })).toBeNull();
```

En `components/case/CasePage.test.tsx` (importa `getCaseIn` de `@/lib/content/en`):

```tsx
  it('un caso en inglés lleva el footer en inglés', () => {
    const { container } = render(<CasePage c={getCaseIn('en', 'hermes')!} locale="en" />);
    expect(container.querySelector('footer')!.textContent).toMatch(/Get in touch/);
  });
```

- [ ] **Paso 2: Ejecutar y ver que fallan**

Ejecuta: `npx vitest run components/home/home.test.tsx components/layout/SiteFooter.test.tsx components/case/CasePage.test.tsx`
Resultado esperado: FALLAN, porque no hay enlace a GitHub, Instagram sigue presente y el footer del caso sale en español.

- [ ] **Paso 3: Implementar**

`components/ui/socialIcons.ts` (LinkedIn y Behance son los mismos trazados que hoy están en `components/home/Hero.tsx:12-13`):

```ts
/* Trazados de 24 × 24 de las redes que enlaza la web. Viven aquí para que el
   hero, el footer y «Sobre mí» pinten el mismo icono. */
export const SOCIAL_ICON = {
  LinkedIn: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z',
  GitHub: 'M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3',
  Behance: 'M9.6 11.3c1.1-.5 1.7-1.4 1.7-2.6 0-2.6-1.9-3.2-4.2-3.2H1v13.1h6.3c2.4 0 4.6-1.1 4.6-3.8 0-1.7-.8-3-2.3-3.5zM3.9 7.7h2.7c1 0 2 .3 2 1.5 0 1.1-.7 1.6-1.8 1.6H3.9V7.7zm3 8.7H3.9v-3.6h3.1c1.2 0 2.1.5 2.1 1.9 0 1.3-1 1.7-2.2 1.7zM19.3 6.1h-5.2V4.9h5.2v1.2zM23 13.2c0-3-1.8-5.3-4.9-5.3-3.1 0-5.1 2.3-5.1 5.3 0 3.1 1.9 5.2 5.1 5.2 2.4 0 4-1.1 4.7-3.4h-2.6c-.3.9-1 1.4-2.1 1.4-1.5 0-2.3-.8-2.4-2.5H23v-.7zm-7.3-1.1c.1-1.3.9-2.2 2.3-2.2 1.3 0 2 .9 2.1 2.2h-4.4z',
} as const;
export type SocialName = keyof typeof SOCIAL_ICON;
```

`lib/content/site.ts`: sustituye el objeto. `available` e `instagram` no se usan fuera de estos componentes; compruébalo con `grep -rn "SITE.available\|SITE.instagram" app components lib`.

```ts
export const SITE = {
  name: 'Víctor Maza',
  role: 'Product Designer',
  email: 'vctrmz47@gmail.com',
  city: 'Málaga',
  linkedin: 'https://linkedin.com/in/victor-maza47',
  github: 'https://github.com/vctrmz',
  /* El repositorio de esta web: la prueba de que el diseño llega a código.
     Solo se enlaza en producción cuando es público (ver el plan del 29-09). */
  repo: 'https://github.com/vctrmz/proyectos',
  behance: 'https://behance.net/mazdesign',
  figma: 'https://www.figma.com/design/lEPRv8iPrIDwUBKnbWKMdu/Portfolio?node-id=8-136130&t=srL7KcBmRZtEGLME-1',
  /* El dominio del CV es el canonico. El otro alias del proyecto de Vercel
     sigue sirviendo la web, pero apunta aqui en canonical y en el sitemap:
     un solo enlace indexable para dos puertas. */
  url: 'https://victormaza.vercel.app',
} as const;
```

`components/home/Hero.tsx`: borra la constante `SOCIAL` de las líneas 11-15 y usa esto:

```tsx
import { SOCIAL_ICON, type SocialName } from '@/components/ui/socialIcons';

const SOCIAL: { name: SocialName; href: string }[] = [
  { name: 'LinkedIn', href: SITE.linkedin },
  { name: 'GitHub', href: SITE.github },
];
```

En el JSX, el `<path d={x.d} />` pasa a ser `<path d={SOCIAL_ICON[x.name]} />`.

`components/layout/SiteFooter.tsx:26-30`:

```tsx
        <ul className={s.links}>
          <li><a href={SITE.github} target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a></li>
          <li><a href={SITE.behance} target="_blank" rel="noopener">Behance <span aria-hidden="true">↗</span></a></li>
          <li><Link href={r.about}>{ui.nav.about}</Link></li>
        </ul>
```

`components/about/SocialLinks.tsx`:

```tsx
import { SITE } from '@/lib/content/site';
import { SOCIAL_ICON, type SocialName } from '@/components/ui/socialIcons';
import s from './about.module.css';
const LINKS: [SocialName, string][] = [['LinkedIn', SITE.linkedin], ['GitHub', SITE.github], ['Behance', SITE.behance]];
export default function SocialLinks() {
  return (
    <ul className={s.social} aria-label="Redes">
      {LINKS.map(([name, href]) => <li key={name}><a href={href} target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={SOCIAL_ICON[name]} /></svg>{name} ↗</a></li>)}
    </ul>
  );
}
```

`components/layout/RootShell.tsx:29`: `sameAs: [SITE.linkedin, SITE.github, SITE.behance]`.

`components/case/CasePage.tsx`: `<SiteFooter />` pasa a ser `<SiteFooter locale={locale} />`.

- [ ] **Paso 4: Ejecutar y ver que pasan**

Ejecuta: `npm test`
Resultado esperado: todo en verde.

- [ ] **Paso 5: Commit**

```bash
git add components/ui/socialIcons.ts lib/content/site.ts components/home/Hero.tsx components/layout/SiteFooter.tsx components/about/SocialLinks.tsx components/layout/RootShell.tsx components/case/CasePage.tsx components/home/home.test.tsx components/layout/SiteFooter.test.tsx components/case/CasePage.test.tsx
git commit -m "Enlaza GitHub, retira Instagram y traduce el footer de los casos"
```

---

### Task 3: Bloque Stack en la portada

**Archivos:**
- Crear: `lib/content/stack.ts`, `lib/content/en/stack.ts`, `components/home/Stack.tsx`, `components/home/Stack.module.css`, `components/home/Stack.test.tsx`
- Modificar: `lib/content/en/index.ts` (añade `stackIn`), `app/[locale]/page.tsx:42`

**Interfaces:**
- Consume: `SITE.repo` (Tarea 2).
- Produce: `interface StackContent { title: string; note: string; link: string; groups: { name: string; items: string[] }[] }` y `stackIn(locale: Locale): StackContent`.

- [ ] **Paso 1: Escribir el test que falla**

`components/home/Stack.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Stack from './Stack';

describe('Stack', () => {
  it('enseña dos grupos con nombre y enlaza al código de esta web', () => {
    render(<Stack />);
    expect(screen.getByRole('heading', { level: 2, name: 'Stack' })).toBeInTheDocument();
    const design = screen.getByRole('list', { name: 'Diseño y sistemas' });
    const code = screen.getByRole('list', { name: 'Código y entrega' });
    expect(within(design).getByText('Design tokens')).toBeInTheDocument();
    for (const t of ['React', 'Next.js', 'TypeScript']) expect(within(code).getByText(t)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /código en GitHub/ })).toHaveAttribute('href', 'https://github.com/vctrmz/proyectos');
  });
  it('en inglés traduce los grupos y el enlace', () => {
    render(<Stack locale="en" />);
    expect(screen.getByRole('list', { name: 'Design and systems' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Code and delivery' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /code on GitHub/ })).toBeInTheDocument();
  });
  it('no presume de herramientas sin evidencia', () => {
    const { container } = render(<Stack />);
    for (const bad of ['Style Dictionary', 'Storybook']) expect(container.textContent).not.toContain(bad);
  });
});
```

- [ ] **Paso 2: Ejecutar y ver que falla**

Ejecuta: `npx vitest run components/home/Stack.test.tsx`
Resultado esperado: FALLA con «Failed to resolve import "./Stack"».

- [ ] **Paso 3: Implementar**

`lib/content/stack.ts` (la lista final es la que confirme D2):

```ts
export interface StackContent { title: string; note: string; link: string; groups: { name: string; items: string[] }[] }

/* Con qué diseño y con qué lo llevo a código. Solo entra lo que se puede
   defender en una entrevista técnica: todo está en el repositorio de esta web. */
export const STACK: StackContent = {
  title: 'Stack',
  note: 'Esta web está hecha con este stack.',
  link: 'Ver el código en GitHub',
  groups: [
    { name: 'Diseño y sistemas', items: ['Figma (avanzado)', 'Design tokens', 'Arquitectura de componentes', 'Accesibilidad WCAG 2.2'] },
    { name: 'Código y entrega', items: ['HTML · CSS', 'React', 'Next.js', 'TypeScript', 'Git y pull requests', 'Vitest · axe', 'Vercel'] },
  ],
};
```

`lib/content/en/stack.ts`:

```ts
import type { StackContent } from '../stack';

export const EN_STACK: StackContent = {
  title: 'Stack',
  note: 'This site is built with this stack.',
  link: 'See the code on GitHub',
  groups: [
    { name: 'Design and systems', items: ['Figma (advanced)', 'Design tokens', 'Component architecture', 'WCAG 2.2 accessibility'] },
    { name: 'Code and delivery', items: ['HTML · CSS', 'React', 'Next.js', 'TypeScript', 'Git and pull requests', 'Vitest · axe', 'Vercel'] },
  ],
};
```

`lib/content/en/index.ts`: añade al final.

```ts
import { STACK, type StackContent } from '@/lib/content/stack';
import { EN_STACK } from './stack';
/* Stack: mismas herramientas, nombres de grupo por idioma. */
export const stackIn = (locale: Locale): StackContent => (locale === 'en' ? EN_STACK : STACK);
```

`components/home/Stack.tsx`:

```tsx
import { SITE } from '@/lib/content/site';
import { stackIn } from '@/lib/content/en';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import s from './Stack.module.css';

/* El stack en dos grupos: con qué diseño y con qué lo llevo a código. Va
   debajo de los hechos porque es lo segundo que busca un lead técnico, y la
   nota enlaza al repositorio: la prueba queda a un clic. Sin JS: es HTML. */
export default function Stack({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const st = stackIn(locale);
  return (
    <section className={s.stack} aria-labelledby="stack-title">
      <h2 id="stack-title" className={s.title}>{st.title}</h2>
      <div className={s.groups}>
        {st.groups.map((g, i) => (
          <div key={g.name}>
            <h3 id={`stack-${i}`} className={s.name}>{g.name}</h3>
            <ul className={s.items} aria-labelledby={`stack-${i}`}>
              {g.items.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className={s.note}>{st.note} <a href={SITE.repo} target="_blank" rel="noopener">{st.link} <span aria-hidden="true">↗</span></a></p>
    </section>
  );
}
```

`components/home/Stack.module.css`:

```css
.stack { display: grid; gap: var(--sp-16); padding-top: var(--sp-32); }
.title { font-size: var(--fs-100); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); font-weight: 500; }
.groups { display: grid; gap: var(--sp-16); }
@media (min-width: 900px) { .groups { grid-template-columns: 1fr 1fr; gap: var(--sp-32); } }
.name { font-size: var(--fs-200); color: var(--ink-2); font-weight: 500; margin-bottom: var(--sp-8); }
.items { display: flex; flex-wrap: wrap; gap: var(--sp-8); margin: 0; padding: 0; list-style: none; }
.items li { font-size: var(--fs-200); color: var(--ink); background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-pill); padding: 6px 12px; }
.note { font-size: var(--fs-200); color: var(--ink-2); }
.note a { display: inline-flex; align-items: center; min-height: 44px; color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
```

`app/[locale]/page.tsx:42`:

```tsx
        <div className="container"><FactStrip facts={ui.home.facts} /><Stack locale={locale} /></div>
```

(Con `import Stack from '@/components/home/Stack';` arriba.)

- [ ] **Paso 4: Ejecutar y ver que pasa**

Ejecuta: `npm test`
Resultado esperado: todo en verde.

- [ ] **Paso 5: Commit**

```bash
git add lib/content/stack.ts lib/content/en/stack.ts lib/content/en/index.ts components/home/Stack.tsx components/home/Stack.module.css components/home/Stack.test.tsx app/[locale]/page.tsx
git commit -m "Añade el bloque Stack a la portada con enlace al código"
```

---

### Task 4: CV descargable

**Archivos:**
- Crear: `public/victor-maza-cv.pdf`, `components/ui/CvLink.tsx`, `components/ui/CvLink.module.css`, `components/ui/CvLink.test.tsx`
- Modificar: `lib/content/site.ts`, `lib/i18n/ui.ts` (interfaz y los dos idiomas), `components/home/Hero.tsx` + `Hero.module.css`, `components/layout/SiteFooter.tsx` + `SiteFooter.module.css`

**Interfaces:**
- Produce: `SITE.cv: { href: string; file: string; kb: number }`, `ui.cv: { label: string; format: string }` y `<CvLink locale?: Locale; className?: string />`. La Tarea 5 usa `CvLink`.

- [ ] **Paso 1: Copiar el PDF que entregue Víctor (D4) y leerlo entero antes de publicarlo**

```bash
cp "<ruta del PDF que entregue Víctor>" public/victor-maza-cv.pdf
node -e "console.log(Math.round(require('fs').statSync('public/victor-maza-cv.pdf').size/1024))"
```

Resultado esperado: un número de KB. Ese número va en `SITE.cv.kb`. Revisa el PDF con la skill de PDF: el rol tiene que coincidir con D1, Behance tiene que ser `behance.net/mazdesign` y no puede haber teléfono ni dirección que Víctor no quiera hacer públicos.

- [ ] **Paso 2: Escribir el test que falla**

`components/ui/CvLink.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '@/lib/content/site';
import CvLink from './CvLink';

describe('CvLink', () => {
  it('descarga el PDF y anuncia formato y peso', () => {
    render(<CvLink />);
    const a = screen.getByRole('link', { name: /Descargar CV/ });
    expect(a).toHaveAttribute('href', '/victor-maza-cv.pdf');
    expect(a).toHaveAttribute('download', 'Victor_Maza_CV.pdf');
    expect(a.textContent).toMatch(new RegExp(`PDF, ${SITE.cv.kb} KB`));
  });
  it('en inglés avisa de que el CV está en español', () => {
    render(<CvLink locale="en" />);
    expect(screen.getByRole('link', { name: /Download CV/ }).textContent).toMatch(/Spanish/);
  });
  it('el peso anunciado es el del archivo publicado', () => {
    const bytes = statSync(join(process.cwd(), 'public', SITE.cv.href)).size;
    expect(SITE.cv.kb).toBe(Math.round(bytes / 1024));
  });
});
```

En `components/home/home.test.tsx` y `components/layout/SiteFooter.test.tsx`, añade:

```tsx
    expect(screen.getByRole('link', { name: /Descargar CV/ })).toHaveAttribute('href', '/victor-maza-cv.pdf');
```

- [ ] **Paso 3: Ejecutar y ver que falla**

Ejecuta: `npx vitest run components/ui/CvLink.test.tsx components/home/home.test.tsx components/layout/SiteFooter.test.tsx`
Resultado esperado: FALLA con «Failed to resolve import "./CvLink"».

- [ ] **Paso 4: Implementar**

`lib/content/site.ts`: añade dentro de `SITE`, después de `repo`. Donde pone `89`, va el número del paso 1.

```ts
  /* kb lo comprueba un test contra el archivo: la etiqueta no puede mentir. */
  cv: { href: '/victor-maza-cv.pdf', file: 'Victor_Maza_CV.pdf', kb: 89 },
```

`lib/i18n/ui.ts`: en la interfaz `Ui`, añade `cv: { label: string; format: string };`. Después, en `es`, `cv: { label: 'Descargar CV', format: 'PDF' },` y en `en`, `cv: { label: 'Download CV', format: 'PDF, Spanish' },`. Si D4 aporta un CV en inglés, el formato en inglés es `'PDF'` y el `href` depende del idioma; en ese caso, avisa antes de implementarlo.

`components/ui/CvLink.tsx`:

```tsx
import { SITE } from '@/lib/content/site';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './CvLink.module.css';

/* El CV en PDF, para quien tiene que reenviarlo antes de llamar. Dice el
   formato y el peso antes del clic; `download` le da un nombre legible. */
export default function CvLink({ locale = DEFAULT_LOCALE, className = '' }: { locale?: Locale; className?: string }) {
  const t = getUi(locale).cv;
  return (
    <a href={SITE.cv.href} download={SITE.cv.file} type="application/pdf" className={`${s.cv} ${className}`}>
      {t.label} <span className={s.meta}>({t.format}, {SITE.cv.kb} KB)</span>
    </a>
  );
}
```

`components/ui/CvLink.module.css`:

```css
.cv { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; font-size: var(--fs-200); font-weight: 500; text-decoration: underline; text-underline-offset: 3px; }
.meta { font-weight: 400; opacity: .72; }
```

`components/home/Hero.tsx`: envuelve la `ul.social` con un `div` y pon el `CvLink` al lado.

```tsx
        <div className={s.meta}>
          <ul className={s.social} aria-label={ui.about.socialLabel}>{/* igual que antes */}</ul>
          <CvLink locale={locale} className={s.cv} />
        </div>
```

`Hero.module.css`: añade `.meta { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--sp-16); }` y `.cv { color: var(--ink-2); }`. Si `.social` tenía un margen propio en otra regla (`grep -n "social" components/home/Hero.module.css`), ese margen pasa a `.meta`.

`components/layout/SiteFooter.tsx`: debajo de `<div className={s.ctas}>…</div>`, dentro de `.contact`, añade `<CvLink locale={locale} className={s.cv} />`. En `SiteFooter.module.css`, añade `.cv { color: var(--inset-ink); }`.

- [ ] **Paso 5: Ejecutar y ver que pasa**

Ejecuta: `npm test`
Resultado esperado: todo en verde.

- [ ] **Paso 6: Commit**

```bash
git add public/victor-maza-cv.pdf lib/content/site.ts lib/i18n/ui.ts components/ui/CvLink.tsx components/ui/CvLink.module.css components/ui/CvLink.test.tsx components/home/Hero.tsx components/home/Hero.module.css components/layout/SiteFooter.tsx components/layout/SiteFooter.module.css components/home/home.test.tsx components/layout/SiteFooter.test.tsx
git commit -m "Publica el CV en PDF y lo enlaza desde el hero y el footer"
```

---

### Task 5: Disponibilidad y acción en el cierre

**Archivos:**
- Modificar: `lib/i18n/ui.ts` (interfaz `home.availability`, `footer.available` en los dos idiomas), `components/home/Closing.tsx`, `components/home/Closing.module.css`
- Tests: `components/home/home.test.tsx`, `components/layout/SiteFooter.test.tsx`

**Interfaces:**
- Consume: `CvLink` (Tarea 4) y `StarfieldButton` (sin cambios).

- [ ] **Paso 1: Escribir los tests que fallan**

En `components/home/home.test.tsx`, dentro del test del cierre:

```tsx
    expect(screen.getByText(/Disponible ahora · roles Senior o Lead de Product Design/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /vctrmz47@gmail.com/ })).toHaveAttribute('href', 'mailto:vctrmz47@gmail.com');
    expect(screen.getByRole('link', { name: /Descargar CV/ })).toBeInTheDocument();
```

En `components/layout/SiteFooter.test.tsx`, el test «la barra inferior anuncia disponibilidad» pasa a esperar esto:

```tsx
    expect(container.querySelector('footer')!.textContent).toMatch(/Disponible ahora · Senior \/ Lead · remoto/);
```

- [ ] **Paso 2: Ejecutar y ver que fallan**

Ejecuta: `npx vitest run components/home/home.test.tsx components/layout/SiteFooter.test.tsx`
Resultado esperado: FALLAN, porque no aparece «Disponible ahora».

- [ ] **Paso 3: Implementar (textos según D5)**

`lib/i18n/ui.ts`: en la interfaz, `home` gana `availability: string`.
- es: `availability: 'Disponible ahora · roles Senior o Lead de Product Design · remoto o híbrido en Málaga'`, y `footer.available: 'Disponible ahora · Senior / Lead · remoto'`.
- en: `availability: 'Available now · Senior or Lead Product Design roles · remote or hybrid in Málaga'`, y `footer.available: 'Available now · Senior / Lead · remote'`.

`components/home/Closing.tsx`:

```tsx
import Inset from '@/components/ui/Inset';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import StarfieldButton from '@/components/ui/StarfieldButton';
import CvLink from '@/components/ui/CvLink';
import Starfield from './Starfield';
import Competencies from './Competencies';
import { SITE } from '@/lib/content/site';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './Closing.module.css';

/* El bloque de cierre: el inset oscuro con el campo de estrellas y el titular
   a dos tonos. El «Contactar» del hero aterriza aquí, así que la acción vive
   aquí: disponibilidad, correo y CV. El footer los repite para quien llega al
   final. Debajo, las competencias en filas desplegables. */
export default function Closing({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ui = getUi(locale);
  return (
    <section id="contacto" className={`container ${s.wrap}`} aria-labelledby="closing-title">
      <Inset className={s.inset}>
        <Starfield />
        <div className={s.content}>
          <TwoToneHeading as="h2" id="closing-title" size="xl" lines={ui.home.closingTitle} />
          <div className={s.grid}>
            {ui.home.closingGrid.map((x) => <div key={x.k}><p className={s.k}>{x.k}</p><p className={s.v}>{x.v}</p></div>)}
          </div>
          <div className={s.action}>
            <p className={s.available}><span className={s.dot} aria-hidden="true" />{ui.home.availability}</p>
            <div className={s.ctas}>
              <StarfieldButton label={SITE.email} href={`mailto:${SITE.email}`} />
              <CvLink locale={locale} className={s.cv} />
            </div>
          </div>
          <Competencies />
        </div>
      </Inset>
    </section>
  );
}
```

`components/home/Closing.module.css`: añade al final.

```css
.action { display: grid; gap: var(--sp-16); justify-items: start; }
.available { display: inline-flex; align-items: center; gap: 10px; padding: 8px 14px; border: 1px solid rgba(139,222,95,.35); border-radius: var(--r-pill); font-size: var(--fs-200); color: var(--inset-ink); }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex: none; }
.ctas { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-16); }
.cv { color: var(--inset-ink); }
```

(`rgba(139,222,95,.35)` es `--accent` con transparencia. Si `tokens.test.ts` o la revisión piden no escribir valores literales, define `--accent-line: rgba(139,222,95,.35)` en `:root` y úsalo.)

- [ ] **Paso 4: Ejecutar y ver que pasan**

Ejecuta: `npm test`
Resultado esperado: todo en verde. El test del cierre sigue contando 3 filas cerradas y 1 abierta, porque los botones nuevos no tienen `aria-expanded`.

- [ ] **Paso 5: Commit**

```bash
git add lib/i18n/ui.ts components/home/Closing.tsx components/home/Closing.module.css components/home/home.test.tsx components/layout/SiteFooter.test.tsx
git commit -m "Pone disponibilidad, correo y CV donde aterriza Contactar"
```

---

### Task 6: Extractos de código que dicen de dónde salen

**Archivos:**
- Modificar: `lib/content/cases/types.ts:18`, `components/ui/CodeDemo.tsx`, `components/ui/CodeDemo.module.css`, `components/case/CasePage.tsx:55`, `lib/i18n/ui.ts` (`case.codeIllustrative`, `case.codeRepo`, `case.codeOpen`)
- Test: `components/ui/ui.test.tsx`

**Interfaces:**
- Produce: `interface CodeDemo { title: string; lang: 'json' | 'ts' | 'css'; code: string; source?: 'illustrative' | 'repo'; href?: string }` y `<CodeDemo {...CodeDemo} locale?: Locale />`. La Tarea 9 usa `source: 'repo'`.

- [ ] **Paso 1: Escribir los tests que fallan**

En `components/ui/ui.test.tsx`, dentro de `describe('CodeDemo')`:

```tsx
  it('marca el código real del repositorio y enlaza al archivo', () => {
    render(<CodeDemo title="Tokens" lang="css" code=":root {}" source="repo" href="https://github.com/vctrmz/proyectos/blob/main/app/globals.css" />);
    expect(screen.getByText(/extracto del repositorio/)).toBeInTheDocument();
    expect(screen.queryByText(/ilustrativo/)).toBeNull();
    expect(screen.getByRole('link', { name: /Ver el archivo en GitHub/ })).toHaveAttribute('target', '_blank');
  });
  it('en inglés la etiqueta va en inglés', () => {
    render(<CodeDemo title="Demo" lang="json" code="{}" locale="en" />);
    expect(screen.getByText(/illustrative example/)).toBeInTheDocument();
  });
```

- [ ] **Paso 2: Ejecutar y ver que fallan**

Ejecuta: `npx vitest run components/ui/ui.test.tsx`
Resultado esperado: FALLAN, porque la etiqueta siempre dice «ejemplo ilustrativo» y no hay enlace.

- [ ] **Paso 3: Implementar**

`lib/content/cases/types.ts:18`:

```ts
/* `source` dice de dónde sale el extracto: 'illustrative' cuando reconstruye
   la idea sin enseñar código de un cliente, 'repo' cuando es código real y
   público, con `href` al archivo. Por defecto, ilustrativo. */
export interface CodeDemo { title: string; lang: 'json' | 'ts' | 'css'; code: string; source?: 'illustrative' | 'repo'; href?: string }
```

`lib/i18n/ui.ts`: en `case`, añade `codeIllustrative: string; codeRepo: string; codeOpen: string;` a la interfaz. En es: `codeIllustrative: 'ejemplo ilustrativo', codeRepo: 'extracto del repositorio', codeOpen: 'Ver el archivo en GitHub'`. En en: `codeIllustrative: 'illustrative example', codeRepo: 'excerpt from the repository', codeOpen: 'See the file on GitHub'`.

`components/ui/CodeDemo.tsx`:

```tsx
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import type { CodeDemo as CodeDemoData } from '@/lib/content/cases/types';
import s from './CodeDemo.module.css';

/* Cada extracto dice de dónde sale. Sin `source` se asume ilustrativo: lo
   prudente es no presentar como real lo que no se puede enseñar. */
export default function CodeDemo({ title, lang, code, source = 'illustrative', href, locale = DEFAULT_LOCALE }: CodeDemoData & { locale?: Locale }) {
  const t = getUi(locale).case;
  return (
    <div className={s.wrap}>
      <div className={s.head}><span>{title}</span><span className={s.tag}>{lang} · {source === 'repo' ? t.codeRepo : t.codeIllustrative}</span></div>
      <pre className={s.pre} tabIndex={0}><code>{code}</code></pre>
      {href && <a className={s.open} href={href} target="_blank" rel="noopener">{t.codeOpen} <span aria-hidden="true">↗</span></a>}
    </div>
  );
}
```

`components/ui/CodeDemo.module.css`: añade `.open { display: flex; align-items: center; min-height: 44px; padding: 0 16px; border-top: 1px solid var(--line); font-size: var(--fs-200); color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }`.

`components/case/CasePage.tsx:55`: `{c.system.code && <CodeDemo {...c.system.code} locale={locale} />}`.

- [ ] **Paso 4: Ejecutar y ver que pasan**

Ejecuta: `npm test`
Resultado esperado: todo en verde, incluidos los tests anteriores de `CodeDemo` y de `CasePage`, porque por defecto sigue siendo ilustrativo y en español.

- [ ] **Paso 5: Commit**

```bash
git add lib/content/cases/types.ts lib/i18n/ui.ts components/ui/CodeDemo.tsx components/ui/CodeDemo.module.css components/case/CasePage.tsx components/ui/ui.test.tsx
git commit -m "Distingue extractos ilustrativos de código real y los traduce"
```

---

### Task 7: HERMES y el design system enseñan la infraestructura

**Archivos:**
- Modificar: `lib/content/cases/hermes.ts:6`, `:30`; `lib/content/en/cases/hermes.ts` (tags y `system.code`); `lib/content/cases/design-system.ts:6`; `lib/content/en/projects.ts:60-65`
- Test: `lib/content/cases/cases.test.ts`

**Interfaces:**
- Consume: `CodeDemo.source` (Tarea 6).

- [ ] **Paso 1: Escribir los tests que fallan**

En `lib/content/cases/cases.test.ts`:

```ts
  it('HERMES enseña su decisión central como dato: el cuestionario por esquema', () => {
    const h = getCase('hermes')!;
    expect(h.system.code!.code).toContain('"visibleIf"');
    expect(h.system.code!.source ?? 'illustrative').toBe('illustrative');
    expect(h.tags).toContain('Formularios por esquema');
    expect(getCaseIn('en', 'hermes')!.system.code!.code).toBe(h.system.code!.code);
  });
  it('no se afirman herramientas de Atrinium sin confirmar', () => {
    const all = JSON.stringify(CASES);
    for (const bad of ['Style Dictionary', 'Storybook', 'ADR']) expect(all, bad).not.toContain(bad);
  });
```

Si D7 confirma alguna de esas herramientas, sácala de la lista `bad` en el mismo commit que la añade al caso.

- [ ] **Paso 2: Ejecutar y ver que falla**

Ejecuta: `npx vitest run lib/content/cases/cases.test.ts`
Resultado esperado: FALLA el primero, porque HERMES todavía enseña tokens.

- [ ] **Paso 3: Implementar**

`lib/content/cases/hermes.ts:6`:

```ts
  tags: ['Caso de estudio', 'En producción', 'Insurtech', 'Multi-tenant', 'Formularios por esquema', 'Design tokens'], brand: '#1f2a5a',
```

`lib/content/cases/hermes.ts:30`: sustituye `code` por esto. Los tokens ya los enseña el caso del design system, y este extracto enseña la decisión que define HERMES.

```ts
    code: { title: 'El cuestionario de un ramo, declarado como dato (extracto)', lang: 'json', source: 'illustrative', code: "{\n  \"line\": \"motor-fleet\",\n  \"version\": 3,\n  \"steps\": [\n    {\n      \"id\": \"vehicle\",\n      \"fields\": [\n        { \"id\": \"plate\", \"type\": \"text\", \"required\": true, \"pattern\": \"^[0-9]{4}[A-Z]{3}$\" },\n        { \"id\": \"use\", \"type\": \"select\", \"options\": [\"private\", \"fleet\", \"taxi\"], \"required\": true },\n        { \"id\": \"fleetSize\", \"type\": \"number\", \"min\": 2,\n          \"visibleIf\": { \"field\": \"use\", \"equals\": \"fleet\" } },\n        { \"id\": \"taxiLicence\", \"type\": \"text\",\n          \"visibleIf\": { \"field\": \"use\", \"equals\": \"taxi\" } }\n      ]\n    }\n  ],\n  \"labels\": \"i18n:insurance.motor\"\n}" },
```

`lib/content/en/cases/hermes.ts`: el mismo `code` literal, con `title: 'A line’s questionnaire, declared as data (excerpt)'`, y los tags `['Case study', 'In production', 'Insurtech', 'Multi-tenant', 'Schema-driven forms', 'Design tokens']`.

`lib/content/cases/design-system.ts:6`:

```ts
  tags: ['Design system', 'En producción', 'Multi-producto', 'Design tokens (JSON)', 'Tokens multi-marca'], brand: '#15181f',
```

`lib/content/en/projects.ts`, dentro de `EN_TAGS`, añade: `'Formularios por esquema': 'Schema-driven forms', 'Design tokens': 'Design tokens', 'Design tokens (JSON)': 'Design tokens (JSON)', 'Tokens multi-marca': 'Multi-brand tokens', 'Design system': 'Design system', 'Multi-producto': 'Multi-product',`.

Si D7 confirma el flujo de tokens (por ejemplo, «variables de Figma exportadas a JSON con Tokens Studio»), añade al `system.body` de `design-system.ts` una frase literal con lo confirmado, y nada más.

- [ ] **Paso 4: Ejecutar y ver que pasan**

Ejecuta: `npm test`
Resultado esperado: todo en verde. `CasePage.test` («pinta un CodeDemo… ejemplo ilustrativo») sigue pasando.

- [ ] **Paso 5: Commit**

```bash
git add lib/content/cases/hermes.ts lib/content/en/cases/hermes.ts lib/content/cases/design-system.ts lib/content/en/projects.ts lib/content/cases/cases.test.ts
git commit -m "HERMES enseña el cuestionario como dato y etiqueta su infraestructura"
```

---

### Task 8: Preparar el repositorio para hacerlo público

**Archivos:**
- Modificar: `README.md` (reescrito en inglés), `public/assets/shots/manifest.json`
- Crear: `docs/README.es.md` (el README actual, movido)
- Borrar: `public/assets/shots/ayax-sobre.webp` y las capturas sin uso que Víctor apruebe

- [ ] **Paso 1: Buscar secretos en todo el historial**

```bash
git log -p --all | grep -nE "(sk_live|sk_test|ghp_|github_pat_|AKIA[0-9A-Z]{16}|-----BEGIN|password\s*[:=]|NEXT_PUBLIC_[A-Z_]*KEY)" | head -20
git ls-files | grep -iE "\.env|secret|credential"
```

Resultado esperado: sin resultados. Los IDs de GA4 y Clarity del README ya son públicos, porque viajan en el HTML. Si aparece algo, se para aquí y se avisa a Víctor.

- [ ] **Paso 2: Revisar lo que se publica fuera del código**

```bash
git ls-files | grep -vE "^(app|components|lib|public|scripts|test|types)/"
```

Víctor lee `docs/` (auditorías, specs y planes) y confirma que no hay nada confidencial de Atrinium, Ayax o Mercantil. Regla de su memoria: nada del pitch de inversores de Atrinium, ni fotos del equipo de Ayax, ni contactos personales.

- [ ] **Paso 3: Retirar las capturas sin uso**

Lista las capturas que ningún archivo referencia:

```bash
for f in public/assets/shots/*.webp; do n=$(basename "$f" .webp); grep -rqF "'$n'" lib components app || grep -rqF "/$n.webp" lib components app || echo "$n"; done
```

A 29-09 salen 69. `ayax-sobre` (equipo de Ayax con nombres) se borra siempre. El resto se enseña a Víctor, y se borran las que él apruebe:

```bash
git rm public/assets/shots/ayax-sobre.webp
node -e "const f='public/assets/shots/manifest.json';const m=require('./'+f);delete m['ayax-sobre'];require('fs').writeFileSync(f,JSON.stringify(m,null,2))"
npm test
```

Resultado esperado: todo en verde. Si un test se queja de una entrada del manifest que falta, es que esa captura sí se usaba: se restaura con `git restore --staged --worktree`.

- [ ] **Paso 4: README público en inglés**

```bash
git mv README.md docs/README.es.md
```

Contenido de `README.md`:

````markdown
# victormaza.vercel.app

Portfolio of **Víctor Maza**, Product Designer (design systems, B2B SaaS, insurtech), Málaga.
Live: https://victormaza.vercel.app · CV: https://victormaza.vercel.app/victor-maza-cv.pdf

## How it is built

Every change follows the same chain, and every step leaves a document in this repo:

1. **Spec**: what and why, with the options discarded (`docs/superpowers/specs/`).
2. **Plan**: small tasks, each with its test (`docs/superpowers/plans/`).
3. **Code**: implemented with Claude Code, task by task.
4. **Review**: I review every task before it is committed.
5. **Tests and audit**: Vitest for components and content, Playwright + axe for accessibility (`docs/auditoria/`).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules on design tokens (`app/globals.css`) ·
GSAP, Lenis and Motion, all disabled under `prefers-reduced-motion` · Vitest · Playwright + axe · Vercel.

## Worth a look

- `app/globals.css`: the token layer. `test/tokens.test.ts` fails if retired values come back.
- `lib/content/`: every case study is typed data. `lib/content/cases/cases.test.ts` fails if an outcome
  is not explained or a business metric nobody measured sneaks in.
- `components/ui/`: the primitives every page is built from.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm test
npm run audit   # axe + metrics, with the dev server running
```

Spanish documentation: `docs/README.es.md`.

Content, case studies and images © Víctor Maza. All rights reserved.
````

- [ ] **Paso 5: Commit**

```bash
git add -A README.md docs/README.es.md public/assets/shots
git commit -m "Prepara el repositorio para publicarlo: README en inglés y capturas sin uso fuera"
```

- [ ] **Paso 6 (lo hace Víctor):** en GitHub, `vctrmz/proyectos` → Settings → General → Danger Zone → Change visibility → Public. Después, en el perfil, se fija el repo (Customize your pins). Comprobación sin sesión: `curl -s -o /dev/null -w "%{http_code}" https://github.com/vctrmz/proyectos` → `200`.

---

### Task 9: Caso «Esta web» (español)

Depende de D8 y de la Tarea 8 (el `href` del extracto apunta al repo público).

**Archivos:**
- Crear: `components/diagrams/SpecToProd.tsx`, `lib/content/cases/esta-web.ts`, `scripts/shots-web.mjs`, `public/assets/logos/vm.svg`
- Modificar: `lib/content/cases/types.ts:1`, `components/diagrams/Diagram.tsx`, `components/diagrams/Diagram.test.tsx`, `lib/content/cases/index.ts`, `lib/content/projects.ts`, `lib/content/cases/design-system.ts` (`next`), `scripts/build-images.mjs`
- Tests: `lib/content/projects.test.ts`, `components/catalog/Catalog.test.tsx`, `app/casos-slug.test.ts`, `lib/content/cases/cases.test.ts`

**Interfaces:**
- Consume: `CodeDemo.source/href/lang 'css'` (Tarea 6).
- Produce: `DiagramId 'spec-to-prod'`, el caso `estaWeb` con slug `'esta-web'` y el proyecto `esta-web` en `PROJECTS`.

- [ ] **Paso 1: Actualizar los tests de recuento y añadir el del caso**

`lib/content/projects.test.ts`: `toHaveLength(10)` → `11`, `size).toBe(10)` → `11`. La lista de `hasCase` termina en `'design-system', 'esta-web'`. `c.todo` → `11`, `c.casos` → `10`, `c.produccion` → `11`. El título del test «los nueve casos» pasa a «los diez casos».
`components/catalog/Catalog.test.tsx`: las dos líneas `toHaveLength(10)` pasan a `11`, y el título «los 10 proyectos» a «los 11 proyectos».
`app/casos-slug.test.ts`: la lista en español termina en `'design-system', 'esta-web'`, y el título dice «los diez casos».
`components/diagrams/Diagram.test.tsx`: añade `'spec-to-prod'` a `IDS` y este test:

```tsx
  it('spec-to-prod enseña la revisión humana antes del commit', () => {
    render(<Diagram id="spec-to-prod" />);
    expect(screen.getByRole('img').textContent).toMatch(/Revisión/);
    expect(screen.getByRole('img').textContent).toMatch(/Tests \+ axe/);
  });
```

`lib/content/cases/cases.test.ts`:

```ts
  it('el caso de esta web enseña código real y enlazado', () => {
    const c = getCase('esta-web')!;
    expect(c.system.code!.source).toBe('repo');
    expect(c.system.code!.href).toMatch(/^https:\/\/github\.com\/vctrmz\/proyectos\//);
    expect(c.result.outcome).toBe('unavailable');
  });
```

- [ ] **Paso 2: Ejecutar y ver que fallan**

Ejecuta: `npm test`
Resultado esperado: FALLAN los recuentos, el diagrama y el caso.

- [ ] **Paso 3: Diagrama**

`lib/content/cases/types.ts:1`: añade `| 'spec-to-prod'` a `DiagramId`.

`components/diagrams/SpecToProd.tsx`:

```tsx
import { motion } from 'motion/react';
const V = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
/* Cómo se construye esta web: cada paso deja un documento que el siguiente
   consume. La caja oscura es la que no se delega: la revisión antes del commit. */
const STEPS = [
  ['Spec', 'qué y por qué', 'por escrito'],
  ['Plan', 'tareas pequeñas', 'con su test'],
  ['Código', 'Claude Code', 'tarea a tarea'],
  ['Revisión', 'mía, línea a línea', 'antes del commit'],
  ['Tests + axe', 'antes de publicar', 'o no se publica'],
];
export default function SpecToProd({ s }: { s: Record<string, string> }) {
  return (
    <>
      {STEPS.map(([n, verb, sub], i) => (
        <motion.g key={n} variants={V}>
          <rect x={20 + i * 156} y={130} width={136} height={110} rx={18} className={i === 3 ? s.boxInk : s.box} />
          <text x={88 + i * 156} y={166} textAnchor="middle" className={i === 3 ? s.tw : s.t}>{n}</text>
          <text x={88 + i * 156} y={190} textAnchor="middle" className={i === 3 ? `${s.tw} ${s.small}` : s.t3}>{verb}</text>
          <text x={88 + i * 156} y={212} textAnchor="middle" className={i === 3 ? `${s.tw} ${s.small}` : s.t3} opacity={i === 3 ? 0.72 : 1}>{sub}</text>
          {i < 4 && <path d={`M ${156 + i * 156} 185 H ${176 + i * 156}`} className={`${s.line} ${s.acc}`} />}
        </motion.g>
      ))}
      <text x={400} y={300} textAnchor="middle" className={s.t3}>cada paso deja un documento que el siguiente consume</text>
    </>
  );
}
```

`components/diagrams/Diagram.tsx`: importa `SpecToProd` y añade a `MAP`:

```tsx
  'spec-to-prod': { label: 'De la spec al plan, al código con IA, a mi revisión y a los tests antes de publicar', C: SpecToProd, box: '0 110 800 210' },
```

- [ ] **Paso 4: Capturas de esta web**

`scripts/shots-web.mjs`:

```js
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

/* Capturas de esta web para su propio caso. Se hacen sobre el build local
   (npm run build && npm start) con reduced-motion y sin banner de consentimiento,
   y van a la misma carpeta de fuentes que el resto de casos. */
const BASE = process.env.BASE ?? 'http://localhost:3000';
const OUT = '../portfolio-export/web/img';
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await page.addInitScript(() => localStorage.setItem('vm-consent', 'denied'));
for (const [name, path] of [['home', '/es'], ['case', '/es/cases/hermes']]) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}/${name}.png` });
}
await browser.close();
```

`scripts/build-images.mjs`: añade a `SOURCES` la entrada `{ dir: '../portfolio-export/web/img', prefix: 'web-' },`.

```bash
npm run build && npm start
```

En otra terminal:

```bash
node scripts/shots-web.mjs && npm run images
cp public/favicon.svg public/assets/logos/vm.svg
```

Resultado esperado: `public/assets/shots/web-home.webp` y `web-case.webp` existen y aparecen en `manifest.json`. Para el servidor cuando acabe.

- [ ] **Paso 5: El caso y su registro**

`lib/content/cases/esta-web.ts`. Antes, comprueba las primitivas con `ls components/ui/*.tsx | grep -v test | wc -l`: el resultado esperado es `16`, porque son 15 más `CvLink`. Si sale otro número, ajusta «dieciséis».

```ts
import { shot, type CaseStudy } from './types';

export const estaWeb: CaseStudy = {
  slug: 'esta-web', title: 'Esta web, del sistema al código', company: 'Proyecto propio', years: '2026',
  tagline: 'Un portfolio tratado como producto: tokens, componentes, contenido tipado y tests que impiden publicar cifras que nadie midió. El diseño es mío; la implementación, dirigida con IA y revisada tarea a tarea.',
  tags: ['Caso de estudio', 'En producción', 'Design tokens', 'Next.js', 'Accesibilidad'], brand: '#121317',
  hero: shot('web-home', 'Portada de esta web con el titular, la franja de hechos y el stack', 'La portada: quién, qué y la prueba, antes del primer scroll'),
  context: 'La web anterior era HTML con 203 estilos inline, sin landmarks, con diez controles que no respondían al teclado y los casos dentro de un modal que fallaba en la primera visita. Quería que el portfolio demostrara lo mismo que cuenta: sistema, reglas y entrega.',
  role: 'Diseño, sistema, contenido y dirección técnica. Escribí las specs y los planes, dirigí la implementación con Claude Code y revisé cada tarea antes del commit.',
  delivery: 'Next.js 16 con App Router, tokens en CSS, dieciséis primitivas de interfaz, los casos como datos tipados, dos idiomas con el idioma en la URL, analítica solo con consentimiento y una batería de tests y auditorías automáticas.',
  problem: [
    'Un portfolio que dice «lo llevo a producción» y no enseña cómo pierde la frase en la primera entrevista técnica.',
    'La salida fácil era una plantilla vistosa; la útil, construirlo como construiría un producto: con sistema, decisiones escritas y pruebas.',
  ],
  complexity: { diagram: 'spec-to-prod', caption: 'Cada paso deja un documento que el siguiente consume, y la revisión antes del commit no se delega.' },
  decisions: [
    { title: 'Escribir la spec y el plan antes de pedir una línea de código.', why: 'Con IA, generar es barato; lo caro es corregir algo que nadie decidió.', changed: 'Cada rediseño tiene su spec y su plan fechados en el repositorio, con lo decidido y lo descartado. La IA implementa tareas pequeñas y cada una pasa por mi revisión antes del commit.', tradeoff: 'Más tiempo antes de ver nada en pantalla, a cambio de no deshacer trabajo después.' },
    { title: 'Tokens en :root y un test que los vigila.', why: 'Un sistema que depende de la disciplina se degrada a la tercera iteración.', changed: 'Color, tipografía, espacio y radios viven como variables CSS. Un test falla si reaparecen los grises retirados o las fuentes antiguas.' },
    { title: 'El contenido es dato tipado, y los tests defienden su honestidad.', why: 'En un portfolio el riesgo no es un bug: es una cifra que no se puede defender en una entrevista.', changed: 'Todos los casos son objetos TypeScript con la misma forma. Los tests fallan si un resultado no explica de dónde sale o si aparece una métrica de negocio que nadie midió.' },
    { title: 'Motion con interruptor, accesibilidad medida.', why: 'La animación ayuda a leer el recorrido, pero no puede ser un requisito para entenderlo.', changed: 'Todo el motion se apaga con prefers-reduced-motion y los efectos de scroll también con puntero táctil. axe se pasa en cada ruta y viewport: cero violaciones A/AA.' },
    { title: 'El idioma va en la URL y ningún enlace publicado se rompe.', why: 'Los enlaces a los casos ya circulaban por LinkedIn y por correo.', changed: 'Español en /es e inglés en /en, redirecciones permanentes desde las rutas antiguas y un interruptor que sabe a qué página del otro idioma ir.' },
  ],
  system: {
    body: [
      'Las primitivas —botón, chip, figura, divulgación, métrica…— consumen los mismos tokens, y los casos no tienen estilos propios: la plantilla se construye con el contenido. Añadir un caso es escribir datos, no maquetar.',
    ],
    code: { title: 'Tokens del sistema (extracto de app/globals.css)', lang: 'css', source: 'repo', href: 'https://github.com/vctrmz/proyectos/blob/main/app/globals.css', code: ':root {\n  --bg: #ffffff; --ink: #121317; --ink-2: #45474d; --ink-3: #6a6a71;\n  --surface: #f8f9fc; --accent: #8bde5f; --focus: #4a44f2;\n  --fs-100: 0.78125rem; --fs-300: 1rem; --fs-1100: clamp(3.5rem, 9vw, 6.6875rem);\n  --sp-4: 4px; --sp-8: 8px; --sp-16: 16px; --sp-32: 32px; --sp-128: 128px;\n  --r-media: 36px; --r-card: 16px; --r-pill: 9999px;\n  --ease: cubic-bezier(0.22, 1, 0.36, 1);\n}' },
    uiKit: [
      { kind: 'tokens', title: 'Tokens con nombre de función', body: 'Tinta en tres niveles, superficie, acento y foco: la interfaz elige por función, nunca por color.', wide: true },
      { kind: 'scale', title: 'Tres radios', body: 'Media, tarjeta y píldora. Lo que no está en la escala no se usa.' },
      { kind: 'actions', title: 'Una acción con peso por vista', body: 'Un solo botón sólido por pantalla; el resto, contorno o texto.', label: 'Ver el caso' },
    ],
  },
  design: [
    shot('web-home', 'Portada de la web', 'Portada: titular, hechos y stack antes del primer scroll'),
    shot('web-case', 'Página de caso con el índice numerado a la izquierda', 'Plantilla de caso: el índice se construye desde el contenido'),
  ],
  implementation: [
    'Cada cambio pasa por la misma cadena: spec, plan por tareas, implementación con Claude Code, mi revisión, tests y auditoría con axe antes de publicar.',
    'El repositorio es público: están el historial de commits, los planes y las auditorías.',
  ],
  result: {
    output: [
      { value: '0', label: 'violaciones axe A/AA', meaning: 'En las nueve combinaciones auditadas: portada, caso y sobre mí a 1280, 768 y 375 px.' },
      { value: '0,91 s', label: 'LCP en escritorio', meaning: 'Medido en frío sobre el build de producción; antes, 1,26 s más un loader de 1,6 s.' },
      { value: '100+', label: 'tests automáticos', meaning: 'Componentes, contenido y tokens, incluidos los que impiden publicar cifras sin explicar.' },
    ],
    outcome: 'unavailable',
    measure: 'Qué casos se abren desde la portada, cuánto se lee cada uno y cuántas visitas acaban en el correo o en el CV: el embudo de Clarity está pendiente de configurar.',
  },
  learnings: [
    'Con IA la ventaja no está en escribir más rápido, sino en saber qué pedir y reconocer cuándo lo que vuelve no sirve.',
    'Un test que protege la honestidad del contenido vale tanto como uno que protege el código.',
  ],
  next: 'hermes',
};
```

`lib/content/cases/index.ts`: `import { estaWeb } from './esta-web';` y añade `estaWeb` al final de `CASES`.

`lib/content/cases/design-system.ts`: `next: 'esta-web'`.

`lib/content/projects.ts`: antes de `taksio`, añade:

```ts
  { slug: 'esta-web', title: 'Esta web, del sistema al código', company: 'Proyecto propio', years: '2026', type: 'case', status: 'production', sector: null, brand: '#121317', logo: '/assets/logos/vm.svg', hasCase: true, url: 'https://github.com/vctrmz/proyectos',
    image: shot('web-home', 'Portada de esta web con el titular y el stack'),
    summary: 'El portfolio construido como un producto: tokens, componentes, contenido tipado, tests y auditoría de accesibilidad, con la implementación dirigida con IA. El código es público.' },
```

- [ ] **Paso 6: Ejecutar y ver que pasa**

Ejecuta: `npm test`
Resultado esperado: todo en verde. Si falla «cada caso trae su propio kit del sistema» porque `tokens+scale+actions` ya existe, cambia el orden o una pieza para que la firma sea única.

- [ ] **Paso 7: Commit**

```bash
git add components/diagrams/SpecToProd.tsx components/diagrams/Diagram.tsx components/diagrams/Diagram.test.tsx lib/content/cases/types.ts lib/content/cases/esta-web.ts lib/content/cases/index.ts lib/content/cases/design-system.ts lib/content/projects.ts lib/content/projects.test.ts components/catalog/Catalog.test.tsx app/casos-slug.test.ts lib/content/cases/cases.test.ts scripts/shots-web.mjs scripts/build-images.mjs public/assets/shots public/assets/logos/vm.svg
git commit -m "Añade el caso Esta web: del sistema al código, con el repositorio público"
```

---

### Task 10: Caso «Esta web» en inglés

**Archivos:**
- Crear: `lib/content/en/cases/esta-web.ts`
- Modificar: `lib/content/en/index.ts:18`, `lib/content/en/projects.ts` (`EN_PROJECTS['esta-web']`, `EN_TAGS`), `app/casos-slug.test.ts`

- [ ] **Paso 1: Test que falla**

`app/casos-slug.test.ts`: la lista en inglés pasa a ser `['hermes', 'esta-web']`. El test existente «los casos traducidos al inglés están completos» ya cubre la ausencia de español suelto.

- [ ] **Paso 2: Ejecutar y ver que falla**

Ejecuta: `npx vitest run app/casos-slug.test.ts`
Resultado esperado: FALLA (`['hermes']` ≠ `['hermes', 'esta-web']`).

- [ ] **Paso 3: Implementar**

`lib/content/en/cases/esta-web.ts`:

```ts
import { estaWeb } from '@/lib/content/cases/esta-web';
import { shot, type CaseStudy } from '@/lib/content/cases/types';

/* Same structure as the Spanish case: images, code, kit and order come from
   there; only the words change. */
export const estaWebEn: CaseStudy = {
  ...estaWeb,
  title: 'This site, from system to code', company: 'Personal project',
  tagline: 'A portfolio treated as a product: tokens, components, typed content and tests that block any figure nobody measured. The design is mine; the implementation was directed with AI and reviewed task by task.',
  tags: ['Case study', 'In production', 'Design tokens', 'Next.js', 'Accessibility'],
  hero: shot('web-home', 'Home page of this site with the headline, the facts strip and the stack', 'The home page: who, what and the proof, before the first scroll'),
  context: 'The previous site was HTML with 203 inline styles, no landmarks, ten controls that ignored the keyboard and case studies inside a modal that broke on first visit. I wanted the portfolio to prove what it claims: system, rules and delivery.',
  role: 'Design, system, content and technical direction. I wrote the specs and plans, directed the implementation with Claude Code and reviewed every task before it was committed.',
  delivery: 'Next.js 16 with the App Router, CSS tokens, sixteen interface primitives, case studies as typed data, two languages in the URL, analytics only after consent, and a suite of automated tests and audits.',
  problem: [
    'A portfolio that says “I take it to production” without showing how loses the claim in the first technical interview.',
    'The easy way out was a flashy template; the useful one was to build it like a product: a system, written decisions and tests.',
  ],
  complexity: { diagram: 'spec-to-prod', caption: 'Every step leaves a document the next one consumes, and the review before each commit is never delegated.' },
  decisions: [
    { title: 'Write the spec and the plan before asking for a single line of code.', why: 'With AI, generating is cheap; fixing something nobody decided is expensive.', changed: 'Every redesign has a dated spec and plan in the repository, with what was decided and what was discarded. AI implements small tasks and each one goes through my review before it is committed.', tradeoff: 'More time before anything shows on screen, in exchange for not undoing work later.' },
    { title: 'Tokens in :root and a test that guards them.', why: 'A system that relies on discipline decays by the third iteration.', changed: 'Colour, type, spacing and radii live as CSS variables. A test fails if retired greys or old fonts come back.' },
    { title: 'Content is typed data, and tests defend its honesty.', why: 'In a portfolio the risk is not a bug: it is a figure you cannot defend in an interview.', changed: 'Every case study is a TypeScript object of identical shape. Tests fail if an outcome does not explain its source or if a business metric nobody measured sneaks in.' },
    { title: 'Motion behind a switch, accessibility measured.', why: 'Animation helps read the journey, but it cannot be required to understand it.', changed: 'All motion turns off under prefers-reduced-motion and scroll effects also on touch pointers. axe runs on every route and viewport: zero A/AA violations.' },
    { title: 'Language lives in the URL and no published link breaks.', why: 'Links to the case studies were already circulating on LinkedIn and by email.', changed: 'Spanish under /es and English under /en, permanent redirects from the old routes, and a switch that knows which page of the other language to open.' },
  ],
  system: {
    ...estaWeb.system,
    body: ['The primitives —button, chip, figure, disclosure, metric…— consume the same tokens, and case studies have no styles of their own: the template is built from the content. Adding a case study means writing data, not layout.'],
    code: { ...estaWeb.system.code!, title: 'System tokens (excerpt from app/globals.css)' },
    uiKit: [
      { kind: 'tokens', title: 'Tokens named by purpose', body: 'Three ink levels, surface, accent and focus: the interface picks by purpose, never by colour.', wide: true },
      { kind: 'scale', title: 'Three radii', body: 'Media, card and pill. Anything outside the scale is not used.' },
      { kind: 'actions', title: 'One weighted action per view', body: 'A single solid button per screen; everything else is outline or text.', label: 'Read the case' },
    ],
  },
  design: [
    shot('web-home', 'Home page of the site', 'Home: headline, facts and stack before the first scroll'),
    shot('web-case', 'Case page with the numbered index on the left', 'Case template: the index is built from the content'),
  ],
  implementation: [
    'Every change goes through the same chain: spec, task plan, implementation with Claude Code, my review, tests and an axe audit before publishing.',
    'The repository is public: commit history, plans and audits included.',
  ],
  result: {
    output: [
      { value: '0', label: 'axe A/AA violations', meaning: 'Across the nine audited combinations: home, case and about at 1280, 768 and 375 px.' },
      { value: '0.91 s', label: 'desktop LCP', meaning: 'Measured cold on the production build; before, 1.26 s plus a 1.6 s loader.' },
      { value: '100+', label: 'automated tests', meaning: 'Components, content and tokens, including the ones that block unexplained figures.' },
    ],
    outcome: 'unavailable',
    measure: 'Which case studies get opened from the home page, how much of each is read and how many visits end in an email or a CV download: the Clarity funnel is still to be configured.',
  },
  learnings: [
    'With AI the edge is not writing faster, but knowing what to ask for and recognising when what comes back is not good enough.',
    'A test that protects the honesty of the content is worth as much as one that protects the code.',
  ],
};
```

`lib/content/en/index.ts:18`: `import { estaWebEn } from './cases/esta-web';` y `const EN_CASES: CaseStudy[] = [hermesEn, estaWebEn];`.

`lib/content/en/projects.ts`: en `EN_PROJECTS`, añade `'esta-web': { title: 'This site, from system to code', company: 'Personal project', summary: 'The portfolio built as a product: tokens, components, typed content, tests and an accessibility audit, with the implementation directed with AI. The code is public.' },`. En `EN_TAGS`, añade `'Next.js': 'Next.js', Accesibilidad: 'Accessibility',`. Si la forma de `EN_PROJECTS` no es esa, mira la entrada `hermes` e imítala.

- [ ] **Paso 4: Ejecutar y ver que pasa**

Ejecuta: `npm test`
Resultado esperado: todo en verde, incluido «nada de español suelto en la versión inglesa».

- [ ] **Paso 5: Commit**

```bash
git add lib/content/en/cases/esta-web.ts lib/content/en/index.ts lib/content/en/projects.ts app/casos-slug.test.ts
git commit -m "Traduce el caso Esta web al inglés"
```

---

### Task 14: Libros que recomiendo en «Sobre mí»

Petición del 29-09, tras la primera versión del plan. Se ejecuta antes de la Task 11. La fuente es la estantería «read» de Goodreads de Víctor (captura del 29-09). La lista es privada, así que los datos salen de esa captura, y las portadas, de Open Library (covers.openlibrary.org).

**Archivos:**
- Crear: `lib/content/books.ts`, `lib/content/books.test.ts`, `scripts/fetch-books.mjs`, `public/assets/books/*.webp`, `components/about/Bookshelf.tsx`, `components/about/bookshelf.module.css`, `components/about/Bookshelf.test.tsx`
- Modificar: `lib/i18n/ui.ts` (`about.books`), `components/about/AboutPage.tsx` (sección nueva entre Herramientas y Contacto)

**Interfaces:**
- Produce: `interface Book { slug: string; title: string; author: string; cover: string | null }`, `BOOKS: Book[]` y `<Bookshelf locale?: Locale />`.

- [ ] **Paso 1: Tests que fallan**

`lib/content/books.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { BOOKS } from './books';

describe('libros', () => {
  it('once libros con título, autor y slug único', () => {
    expect(BOOKS).toHaveLength(11);
    expect(new Set(BOOKS.map((b) => b.slug)).size).toBe(11);
    for (const b of BOOKS) { expect(b.title.length, b.slug).toBeGreaterThan(3); expect(b.author.length, b.slug).toBeGreaterThan(3); }
  });
  it('cada portada declarada existe en public', () => {
    for (const b of BOOKS) if (b.cover) expect(existsSync(join(process.cwd(), 'public', b.cover)), b.slug).toBe(true);
  });
});
```

`components/about/Bookshelf.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Bookshelf from './Bookshelf';
import { BOOKS } from '@/lib/content/books';

describe('Bookshelf', () => {
  it('pinta cada libro con portada, título y autor', () => {
    render(<Bookshelf />);
    const list = screen.getByRole('list', { name: 'Libros que recomiendo' });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(BOOKS.length);
    expect(within(items[0]).getByText(BOOKS[0].title)).toBeInTheDocument();
    expect(within(items[0]).getByText(BOOKS[0].author)).toBeInTheDocument();
    expect(list.querySelectorAll('img')).toHaveLength(BOOKS.filter((b) => b.cover).length);
  });
  it('un libro sin imagen lleva una portada tipográfica, no un hueco', () => {
    render(<Bookshelf />);
    const sin = BOOKS.find((b) => !b.cover)!;
    expect(screen.getAllByText(sin.title).length).toBeGreaterThanOrEqual(2);
  });
  it('en inglés la lista se llama Books I recommend', () => {
    render(<Bookshelf locale="en" />);
    expect(screen.getByRole('list', { name: 'Books I recommend' })).toBeInTheDocument();
  });
});
```

- [ ] **Paso 2: Ejecutar y ver que fallan**

Ejecuta: `npx vitest run lib/content/books.test.ts components/about/Bookshelf.test.tsx`
Resultado esperado: FALLAN con «Failed to resolve import».

- [ ] **Paso 3: Portadas**

`scripts/fetch-books.mjs`:

```js
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

/* Portadas de los libros de «Sobre mí», desde Open Library (datos abiertos).
   Se ejecuta a mano cuando cambia la lista: node scripts/fetch-books.mjs
   Salida: WebP de 240 px de ancho en public/assets/books/<slug>.webp.
   UX Strategy no está aquí: Open Library solo tiene una portadilla sin
   diseño, así que la web pinta una portada tipográfica. */
const SOURCES = {
  'design-of-everyday-things': 'isbn/9780465050659',
  'dont-make-me-think': 'isbn/9780321965516',
  'laws-of-ux': 'isbn/9781492055310',
  '100-things': 'isbn/9780321767530',
  'lean-agile-design-thinking': 'id/10220335',
  sprint: 'isbn/9781501121746',
  hooked: 'isbn/9781591847786',
  'investigacion-ux': 'id/13680063',
  'atomic-habits': 'isbn/9780735211292',
  'camino-del-artista': 'id/15242036',
};
const OUT = 'public/assets/books';
await mkdir(OUT, { recursive: true });
for (const [slug, path] of Object.entries(SOURCES)) {
  const res = await fetch(`https://covers.openlibrary.org/b/${path}-L.jpg?default=false`, { headers: { 'User-Agent': 'victormaza-portfolio (vctrmz47@gmail.com)' } });
  if (!res.ok) { console.log('(sin portada)', slug, res.status); continue; }
  const info = await sharp(Buffer.from(await res.arrayBuffer())).resize({ width: 240 }).webp({ quality: 82 }).toFile(`${OUT}/${slug}.webp`);
  console.log(slug, `${info.width}x${info.height}`, Math.round(info.size / 1024) + 'KB');
}
```

Ejecuta: `node scripts/fetch-books.mjs`
Resultado esperado: diez líneas `slug 240xNNN NKB`.

- [ ] **Paso 4: Contenido, componente y montaje**

`lib/content/books.ts`:

```ts
export interface Book { slug: string; title: string; author: string; cover: string | null }

/* Libros que recomiendo: la estantería «leídos» de Goodreads, ordenada de lo
   más del oficio a lo más personal. Títulos en su idioma original. `cover`
   null pinta una portada tipográfica (ver scripts/fetch-books.mjs). */
const c = (slug: string) => `/assets/books/${slug}.webp`;
export const BOOKS: Book[] = [
  { slug: 'design-of-everyday-things', title: 'The Design of Everyday Things', author: 'Don Norman', cover: c('design-of-everyday-things') },
  { slug: 'dont-make-me-think', title: 'Don’t Make Me Think, Revisited', author: 'Steve Krug', cover: c('dont-make-me-think') },
  { slug: 'laws-of-ux', title: 'Laws of UX', author: 'Jon Yablonski', cover: c('laws-of-ux') },
  { slug: '100-things', title: '100 Things Every Designer Needs to Know About People', author: 'Susan M. Weinschenk', cover: c('100-things') },
  { slug: 'ux-strategy', title: 'UX Strategy', author: 'Jaime Levy', cover: null },
  { slug: 'lean-agile-design-thinking', title: 'Lean vs Agile vs Design Thinking', author: 'Jeff Gothelf', cover: c('lean-agile-design-thinking') },
  { slug: 'sprint', title: 'Sprint', author: 'Jake Knapp', cover: c('sprint') },
  { slug: 'hooked', title: 'Hooked', author: 'Nir Eyal', cover: c('hooked') },
  { slug: 'investigacion-ux', title: 'Investigación UX', author: 'Jorge Barahona Ch.', cover: c('investigacion-ux') },
  { slug: 'atomic-habits', title: 'Atomic Habits', author: 'James Clear', cover: c('atomic-habits') },
  { slug: 'camino-del-artista', title: 'El camino del artista', author: 'Julia Cameron', cover: c('camino-del-artista') },
];
```

`lib/i18n/ui.ts`: añade `books: string` a `about` (es `'Libros que recomiendo'`, en `'Books I recommend'`).

`components/about/Bookshelf.tsx`:

```tsx
import Image from 'next/image';
import { BOOKS } from '@/lib/content/books';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getUi } from '@/lib/i18n/ui';
import s from './bookshelf.module.css';

/* La estantería: portada, título y autor. La portada es decorativa (el
   título va escrito debajo), así que su alt va vacío. Sin imagen, la
   portada se compone con tipografía sobre superficie: nunca un hueco. */
export default function Bookshelf({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getUi(locale).about;
  return (
    <ul className={s.shelf} aria-label={t.books}>
      {BOOKS.map((b) => (
        <li key={b.slug} className={s.book}>
          {b.cover
            ? <Image src={b.cover} alt="" width={240} height={360} sizes="(max-width: 600px) 45vw, 160px" className={s.cover} />
            : <div className={`${s.cover} ${s.fallback}`} aria-hidden="true"><span className={s.fTitle}>{b.title}</span><span className={s.fAuthor}>{b.author}</span></div>}
          <p className={s.title}>{b.title}</p>
          <p className={s.author}>{b.author}</p>
        </li>
      ))}
    </ul>
  );
}
```

`components/about/bookshelf.module.css`:

```css
.shelf { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(128px, 1fr)); gap: var(--sp-32) var(--sp-24); }
.book { display: grid; gap: 6px; align-content: start; }
.cover { width: 100%; height: auto; aspect-ratio: 2 / 3; object-fit: cover; border-radius: 6px; box-shadow: 0 1px 2px rgba(18,19,23,.08), 0 8px 24px rgba(18,19,23,.10); margin-bottom: 8px; }
.fallback { display: flex; flex-direction: column; justify-content: space-between; padding: 14px 12px; background: var(--inset-bg); color: var(--inset-ink); }
.fTitle { font-size: var(--fs-400); font-weight: 500; line-height: 1.15; letter-spacing: -0.01em; }
.fAuthor { font-size: var(--fs-100); color: var(--inset-ink-2); }
.title { font-size: var(--fs-200); color: var(--ink); font-weight: 500; line-height: 1.3; }
.author { font-size: var(--fs-100); color: var(--ink-3); }
```

`components/about/AboutPage.tsx`: entre la sección de Herramientas y la de Contacto:

```tsx
          <section className={s.sec} aria-labelledby="a-libros"><h2 id="a-libros">{t.books}</h2>
            <Bookshelf locale={locale} />
          </section>
```

(Con `import Bookshelf from './Bookshelf';`.)

- [ ] **Paso 5: Ejecutar y ver que pasa**

Ejecuta: `npm test`
Resultado esperado: todo en verde.

- [ ] **Paso 6: Commit**

```bash
git add lib/content/books.ts lib/content/books.test.ts scripts/fetch-books.mjs public/assets/books lib/i18n/ui.ts components/about/Bookshelf.tsx components/about/bookshelf.module.css components/about/Bookshelf.test.tsx components/about/AboutPage.tsx
git commit -m "Añade a Sobre mí los libros que recomiendo, con portada, título y autor"
```

---

### Task 11: Imagen de previsualización (OG) con el rol nuevo

**Archivos:**
- Crear: `scripts/og.mjs`
- Modificar: `public/assets/og.png`, y `README` / `docs/README.es.md` (quitar «pendiente de regenerar»)

- [ ] **Paso 1: Script**

`scripts/og.mjs`:

```js
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

/* La imagen que enseñan LinkedIn, Slack o WhatsApp al compartir la web. Se
   genera desde HTML con los tokens del sitio, así que cambiar el rol es
   cambiar una línea y volver a ejecutar: node scripts/og.mjs */
const photo = (await readFile('public/assets/victor.jpg')).toString('base64');
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body { margin: 0; width: 1200px; height: 630px; display: flex; align-items: center; justify-content: space-between; padding: 0 88px; box-sizing: border-box; background: #1b1e27; color: #ececec; font-family: Geist, system-ui, sans-serif; }
  .k { display: inline-block; padding: 8px 14px; border: 1px solid rgba(139,222,95,.45); border-radius: 999px; color: #8bde5f; font-size: 20px; letter-spacing: .04em; }
  h1 { margin: 28px 0 16px; font-size: 76px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; }
  p { margin: 0; font-size: 32px; color: #b4b8c4; line-height: 1.3; max-width: 640px; }
  img { width: 300px; height: 300px; border-radius: 50%; object-fit: cover; border: 4px solid #4a44f2; }
</style></head><body>
  <div><span class="k">Product Designer · Design Systems</span><h1>Víctor Maza</h1><p>Diseño producto B2B complejo y lo llevo a producción.</p></div>
  <img src="data:image/jpeg;base64,${photo}" alt="">
</body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/assets/og.png' });
await browser.close();
```

Con D1 = B, el kicker es `Product Designer & Design Engineer`. El color `#1b1e27` es `--inset-bg`; aquí van literales porque el HTML no carga `globals.css`.

- [ ] **Paso 2: Generar y mirar el resultado**

```bash
node scripts/og.mjs
```

Resultado esperado: `public/assets/og.png` de 1200×630. Ábrelo con Read y comprueba que el texto no se corta y que la foto se ve.

- [ ] **Paso 3: Commit**

```bash
git add scripts/og.mjs public/assets/og.png docs/README.es.md README.md
git commit -m "Regenera la imagen de previsualización con el rol nuevo"
```

---

### Task 12: Verificación completa en local

**Archivos:** ninguno, salvo las correcciones que salgan.

- [ ] **Paso 1: Tests y build**

```bash
npm test && npm run build
```

Resultado esperado: todo en verde, y el build genera 10 casos en `/es` y 2 en `/en`.

- [ ] **Paso 2: Auditoría de accesibilidad**

Con `npm start` en marcha, ejecuta `npm run audit`.
Resultado esperado: 0 violaciones axe, 0 targets por debajo de 44 px y sin overflow horizontal en las 9 combinaciones.

- [ ] **Paso 3: Revisión visual en el navegador**

Abre `http://localhost:3000/es` y `/en` a 1280 y a 375 px, además de `/es/cases/hermes`, `/es/cases/esta-web` y `/en/cases/esta-web`. Hay que comprobar:
1. El kicker del hero no se recorta a 375 px.
2. Los chips del stack pasan de línea sin desbordar.
3. «Contactar» lleva al cierre y ahí están el correo y el CV.
4. El CV se descarga con el nombre `Victor_Maza_CV.pdf`.
5. En `/en`, el footer y las etiquetas salen en inglés.
6. Con JS desactivado, el stack, la disponibilidad y los CTA siguen ahí.
7. Con `prefers-reduced-motion`, no hay animación.

Guarda una captura de cada viewport como prueba para Víctor.

- [ ] **Paso 4: Commit de las correcciones que haya**, con un mensaje que describa cada corrección concreta.

---

### Task 13: Paso a producción

**Archivos:** ninguno.

- [ ] **Paso 1: Condición previa.** `curl -s -o /dev/null -w "%{http_code}" https://github.com/vctrmz/proyectos` tiene que devolver `200`. Si devuelve `404`, **no se hace el merge**: se pide a Víctor que haga público el repo (Tarea 8, paso 6).

- [ ] **Paso 2: Preview.** Con permiso de Víctor, `git push -u origin reenfoque/design-engineering`. Vercel crea un Preview Deployment, cuya URL aparece en el panel de Vercel o en los checks de GitHub. Víctor lo revisa en el móvil y en el escritorio.

- [ ] **Paso 3: Merge a producción.** Con el OK de Víctor:

```bash
git switch main
git merge --ff-only reenfoque/design-engineering
git push origin main
```

- [ ] **Paso 4: Comprobación en producción**

```bash
curl -s https://victormaza.vercel.app/es | grep -o 'rel="canonical" href="[^"]*"'
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" https://victormaza.vercel.app/victor-maza-cv.pdf
curl -s -o /dev/null -w "%{http_code}\n" https://victormaza.vercel.app/es/cases/esta-web
curl -s -o /dev/null -w "%{http_code}\n" https://victormaza.vercel.app/assets/shots/ayax-sobre.webp
```

Resultado esperado, por orden: canonical `https://victormaza.vercel.app/es`; `200 application/pdf`; `200`; `404`.

- [ ] **Paso 5: Fuera del código (Víctor).**
1. Titular de LinkedIn con el mismo rol que D1.
2. En el perfil de GitHub: biografía, enlace a la web y repo fijado.
3. Refrescar la previsualización en https://www.linkedin.com/post-inspector/ para que LinkedIn coja la OG nueva.
4. Revisar el embudo de Clarity (pendiente P0-7 de la re-auditoría) para medir clics en el CV y en el correo.

---

## Fuera de este plan (siguiente iteración)

- Añadir a «Cómo llegó a producción» de HERMES pruebas reales de handoff (spec en Figma Dev Mode, ticket, revisión de PR), anonimizadas, si Víctor las tiene. Hoy `implementation` es `string[]` y aceptar figuras obliga a cambiar el tipo.
- Traducir al inglés el resto de casos: hoy solo existen en inglés HERMES y «Esta web».
- Los diagramas tienen las etiquetas solo en español, también en `/en`.
