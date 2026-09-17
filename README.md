# Víctor Maza — Portfolio

Landing, perfil y política de privacidad de Víctor Maza (Product Designer
UX/UI, Málaga). Next.js 16 (App Router) desplegado en Vercel.

## Estructura

```
app/                 Rutas: / (portada), /perfil, /privacidad. layout.tsx mantiene
                     Nav, fuentes, banner de consentimiento y scripts de efectos.
components/          Secciones de cada página, Nav, Loader, ConsentBanner, Contacto.
components/effects/  RollText, Words, Lines, ZoomBox, useSectionReveal (antes
                     neat-effects.js) y Starfield (envoltorio del custom element).
lib/data.ts          Todos los textos: casos, logos, sectores, casos de uso, bio,
                     competencias, herramientas. Editar aquí para cambiar contenido.
lib/consent.ts       Consentimiento y arranque de GA4, Clarity, Hotjar, Plerdy y HubSpot.
public/assets/       h-card/ y h-thumb/ (capturas del modal), logos/, victor.jpg, og.png.
                     hermes/ y hero-bg.mp4 no se usan.
public/effects/      starfield-button.js y cursor-ring-field.js (custom elements sin cambios).
docs/superpowers/    Spec y plan de la migración.
```

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # vitest
npm run build
```

## Navegación

Los enlaces internos son `<Link>`: no hay recarga entre páginas. `app/template.tsx`
anima la entrada de cada página. El loader de la portada dura 1,6 s y solo se
muestra en la primera visita de la sesión (`sessionStorage['vm-loader']`) en
escritorio.

Las rutas antiguas `/index.html`, `/perfil.html` y `/privacidad.html` redirigen
(308, `permanent: true` en `next.config.ts`) a las nuevas.

## Despliegue

Vercel, proyecto `proyectos`. `vercel.json` fija el framework a Next.js. Cada
push a `main` despliega.

## Analítica

Cinco servicios detrás del mismo consentimiento (`localStorage['vm-consent']`,
`granted` / `denied`). Ninguno arranca hasta que el visitante acepta; si rechaza
no se pide ningún recurso externo. Clarity, Hotjar y Plerdy no arrancan en local.

| Servicio | Identificador |
|---|---|
| Google Analytics 4 | `G-HZYDMMSVG5` |
| Microsoft Clarity | `yd4g6685po` |
| Hotjar | `6776849` |
| Plerdy | `_suid` `81035` |
| HubSpot (EU) | portal `148496979` |

Con navegación sin recarga, GA4 registra los cambios de página mediante la
medición mejorada ("Cambios de página según eventos del historial del
navegador", activada por defecto en la propiedad); no se envía `page_view` a
mano. `window.vmConsentReset()` reabre el banner.

## Metadatos

`<title>`, description, canonical, Open Graph y `twitter:card` se definen con
`metadata` en cada `page.tsx`. La imagen de previsualización es `public/assets/og.png`.
