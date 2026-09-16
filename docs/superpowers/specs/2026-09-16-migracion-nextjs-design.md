# Migración del portfolio a Next.js — diseño

Fecha: 2026-09-16
Repo: `vctrmz/proyectos` (rama `main`) → Vercel `proyectos` → https://proyectos-theta-hazel.vercel.app/

## Problema

Los testers dicen que "la web carga mucho". Medido en producción el peso es
bajo (portada 208 KB, `load` 675 ms; perfil 81 KB, 307 ms). Lo que se percibe
como lentitud es:

1. Un loader artificial de 2,8 s (2,4 s de contador + 0,4 s) en la primera
   visita de escritorio.
2. Cada enlace interno (`perfil.html`, `index.html`, `privacidad.html`) es
   una recarga completa: velo 320 ms, descarga de HTML, React UMD desde unpkg,
   `support.js` compila las plantillas `x-dc` en el navegador, GSAP relanza
   la intro de 1,2 s. Se siente "como irse a otra web".
3. Efectos decorativos permanentes (cursor ring, starfield, neat-effects,
   `filter: blur`) que bajan FPS en equipos modestos.

## Objetivo

Que la navegación entre portada, perfil y privacidad sea instantánea y sin
recarga, manteniendo el diseño actual al 100 %. Migración, no rediseño.

Fuera de alcance: cambiar textos, colores, tipografías, layout, analítica o
copys. Rediseñar cualquier sección. Añadir páginas nuevas.

## Decisiones

- **Stack:** Next.js 15 (App Router) + React 19 + TypeScript. Generación
  estática de las tres rutas en build.
- **Claude Design deja de ser la fuente.** A partir de aquí se edita el código.
  `index.html`, `perfil.html`, `privacidad.html`, `support.js`, `image-slot.js`
  y `.image-slots.state.json` se eliminan del repo una vez migrados.
- **Mismo repo, misma rama, mismo proyecto Vercel.** Se cambia el Framework
  Preset de Vercel de `Other` a `Next.js` (acción manual del propietario).
- **Loader:** 1,6 s en total, solo en la primera visita de la sesión
  (`sessionStorage['vm-loader']`) y solo en escritorio (`max-width: 820px`
  lo desactiva), como hoy.
- **GSAP** se instala desde npm y se importa en los componentes cliente que
  lo usan; se deja de cargar desde CDN. React deja de venir de unpkg.

## Estructura

```
app/
  layout.tsx            Shell persistente: <html lang="es">, fuentes (next/font:
                        Montserrat 300-700, Bebas Neue), Remixicon (CSS desde
                        npm), <Nav/>, <Footer/>, <ConsentBanner/>, efectos de
                        fondo. NUNCA se desmonta al navegar.
  template.tsx          Transición de entrada de cada página: opacity 0→1 y
                        translateY 12px→0 en ~350 ms. Respeta
                        prefers-reduced-motion (sin animación).
  page.tsx              Portada (/)  — metadata: title, description, canonical,
                        OG, twitter:card (los mismos valores que hoy).
  perfil/page.tsx       Sobre mí (/perfil) — metadata propia.
  privacidad/page.tsx   Política (/privacidad) — metadata propia.
  globals.css           Reset + estilos globales que hoy están en <style>.
components/
  Nav.tsx               Barra superior con <Link> a /, /perfil, #contacto.
  Footer.tsx
  Loader.tsx            Contador 0→100 en 1,6 s + palabras Diseñar/Ordenar/Entregar.
  ConsentBanner.tsx     Banner + arranque condicional de GA4, Clarity, Hotjar,
                        Plerdy y HubSpot (traducción 1:1 de consent.js y del
                        snippet Plerdy; misma clave `vm-consent`, misma guarda
                        de localhost, expone window.vmConsentReset).
  home/
    Hero.tsx            Nombre, rol rotatorio (2,2 s), CTAs, redes.
    Trabajo.tsx         Cards de casos + filtros de sector.
    CasoModal.tsx       Modal "box" con capturas, hechos, siguiente caso.
    Logos.tsx           Franja "Sistemas en los que he trabajado" (8 logos).
    Sectores.tsx
    Archivo.tsx         Lista con filtros `arch`.
    UsoIA.tsx           Tabs useTabs/useCase.
    Contacto.tsx        Email con "copiado" (copyTimer).
  perfil/
    (secciones de perfil.html, una por bloque visual)
  effects/
    CursorRingField.tsx   useEffect que registra/monta cursor-ring-field.js
    StarfieldButton.tsx   idem starfield-button.js
    NeatEffects.tsx       idem neat-effects.js
lib/
  data.ts               Casos, logos, sectores, hechos, tabs, textos: lo que hoy
                        devuelven workData(), logos(), sectors(), sectorData(),
                        captions(), archive(), useData(), useTabs(), useCase(),
                        archFilters().
  analytics.ts          IDs: GA G-HZYDMMSVG5, Clarity yd4g6685po, Hotjar 6776849
                        sv 6, HubSpot 148496979 (EU), Plerdy (snippet actual).
public/
  favicon.svg
  assets/               hermes/, h-card/, h-thumb/, logos/, victor.*, og.png,
                        hero-bg.mp4 (se conserva aunque hoy no se usa).
  effects/              cursor-ring-field.js, starfield-button.js, neat-effects.js
                        (tal cual, se cargan con next/script strategy
                        afterInteractive o import dinámico).
next.config.ts          redirects: /index.html→/, /perfil.html→/perfil,
                        /privacidad.html→/privacidad (301). images: formats
                        avif+webp.
```

## Flujo de navegación

1. `layout.tsx` monta una vez: Nav, fondo, efectos, banner.
2. Los enlaces internos son `<Link>`; Next precarga la ruta cuando el enlace
   entra en viewport. El clic cambia solo el `children` del layout.
3. `template.tsx` anima la entrada del nuevo contenido. No hay velo ni
   `window.location.href`.
4. Los anchors dentro de la portada (`#trabajo`, `#contacto`, `#casos`) siguen
   siendo scroll suave; desde `/perfil` un `<Link href="/#trabajo">` navega y
   luego hace scroll al ancla.
5. La intro GSAP del hero (`name-reveal`, `blur-in`) se ejecuta cuando `Hero`
   se monta. Como Next desmonta la página al salir, al volver se repite, pero
   sin loader y sin recarga: es la misma sensación que un fade. Si al probar
   resulta molesto, se guarda un flag en `sessionStorage` y se salta.

## Imágenes

- Capturas de HERMES (`assets/hermes/*.png`, 20 MB): se sirven con
  `next/image` (`sizes` según el ancho del modal, `quality` 80). Next genera
  AVIF/WebP redimensionado bajo demanda en Vercel. Los originales se quedan
  en `public/assets/hermes/`.
- Cards y miniaturas (`h-card/`, `h-thumb/`): `next/image` con `loading="lazy"`.
- Los seis logos incrustados como webp base64 en `.image-slots.state.json`
  se extraen a `public/assets/logos/<nombre>.webp` en un paso de la migración
  y se referencian como ficheros normales. `image-slot.js` desaparece.
- `og.png` se mantiene como está.

## Analítica y consentimiento

`ConsentBanner.tsx` es un componente cliente montado en `layout.tsx`.
Reproduce `consent.js` sin cambios funcionales:

- Lee/escribe `localStorage['vm-consent']` (`granted` / `denied`).
- Sin decisión: muestra el banner. `granted`: arranca los cinco servicios.
  `denied`: no pide ningún recurso externo.
- Guarda `isLocalHost()` idéntica (Clarity y Hotjar no arrancan en local).
- GA4: crea `dataLayer` y `gtag` antes de inyectar `gtag.js`; expone
  `window.gtag`.
- Plerdy: la función `__plerdyStart` del snippet actual pasa a
  `lib/analytics.ts`; se llama al aceptar.
- Expone `window.vmConsentReset()`.

Al navegar entre páginas con `<Link>` no se dispara un page_view nuevo en GA4
automáticamente; se envía `gtag('event','page_view')` desde un `useEffect`
sobre `usePathname()` cuando el consentimiento es `granted`.

## Efectos

`cursor-ring-field.js`, `starfield-button.js` y `neat-effects.js` son
scripts vanilla que registran custom elements o se enganchan al DOM. Se
copian a `public/effects/` sin cambios y cada uno tiene un wrapper React en
`components/effects/` que los carga con `import()` dentro de `useEffect`
(solo cliente) y renderiza el elemento correspondiente. Si alguno resulta
depender de `support.js` (DCLogic), se reescribe en React solo ese.

## Errores y casos límite

- `sessionStorage`/`localStorage` inaccesibles (modo privado): todo va
  envuelto en try/catch, como hoy; el loader se muestra y el banner también.
- `prefers-reduced-motion: reduce` o móvil: sin loader, animaciones cortas,
  sin parallax, como hoy (`light`).
- Enlaces antiguos `*.html`: redirect 301.
- Fallo de carga de un script de efecto: el wrapper lo ignora; la página
  funciona sin el efecto.

## Verificación

- `npm run build` sin errores ni warnings de tipos.
- `npm run dev` y navegación real en el navegador de la app:
  - `/` → clic en "Sobre mí" → no hay recarga (`performance.getEntriesByType
    ('navigation').length` sigue en 1), Nav no parpadea, contenido entra
    con la transición.
  - `/perfil` → clic en logo/Inicio → vuelve a `/` sin recarga.
  - `/perfil.html` → 301 a `/perfil`.
  - Loader dura ≤ 1,7 s en primera visita y no aparece en la segunda.
  - Banner de consentimiento: rechazar → cero peticiones a
    googletagmanager.com, clarity.ms, hotjar.com, plerdy.com, hs-scripts.com.
    Aceptar → los cinco arrancan (en local solo GA4, HubSpot y Plerdy, por la
    guarda).
  - Modal de caso: abre, muestra capturas en WebP/AVIF, "Siguiente caso"
    funciona.
  - Comparación visual portada/perfil/privacidad contra producción a 1440 px
    y 390 px: mismo layout.
- Lighthouse en `/` (móvil): Performance ≥ 90.

## Despliegue

1. Push de `main`.
2. El propietario cambia en Vercel → Settings → Build & Development →
   Framework Preset a **Next.js**, Root Directory `./`, y redespliega.
3. Comprobar en el dominio real la lista de verificación anterior.

## Ficheros que se eliminan del repo tras la migración

`index.html`, `perfil.html`, `privacidad.html`, `support.js`, `image-slot.js`,
`.image-slots.state.json`, `consent.js`, `cursor-ring-field.js`,
`starfield-button.js`, `neat-effects.js` (los tres últimos se mueven a
`public/effects/`), `_serve.js` (ya ignorado). El `README.md` se reescribe
para el nuevo flujo.
