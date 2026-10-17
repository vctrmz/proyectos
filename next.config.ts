import type { NextConfig } from 'next';
import { withBotId } from 'botid/next/config';

const nextConfig: NextConfig = {
  /* El idioma va delante en la ruta, así que las URLs anteriores redirigen a
     su equivalente en español. Los enlaces publicados siguen funcionando. */
  async redirects() {
    return [
      { source: '/', destination: '/es', permanent: false },
      { source: '/index.html', destination: '/es', permanent: true },
      { source: '/casos/:slug', destination: '/es/cases/:slug', permanent: true },
      { source: '/sobre-mi', destination: '/es', permanent: true },
      { source: '/perfil', destination: '/es', permanent: true },
      { source: '/perfil.html', destination: '/es', permanent: true },
      /* «Sobre mí» es la portada desde el 2026-10-16: su ruta antigua lleva a
         la raíz del idioma. Temporal, por si el orden vuelve a cambiar. */
      { source: '/:locale(es|en)/about', destination: '/:locale', permanent: false },
      { source: '/privacidad', destination: '/es/privacy', permanent: true },
      { source: '/privacidad.html', destination: '/es/privacy', permanent: true },
      /* El caso «Esta web» se retiró el 2026-10-09: quien llegue por un enlace
         antiguo cae en la portada en lugar de en un 404. */
      { source: '/:locale(es|en)/cases/esta-web', destination: '/:locale/work', permanent: true },
      /* Vista 360 se retiró el 2026-10-17: era el cuarto caso sobre el mismo
         producto de Atrinium. Su enlace lleva al catálogo de trabajos. */
      { source: '/:locale(es|en)/cases/vista-360', destination: '/:locale/work', permanent: true },
      /* La propuesta de portada (2026-10-16) es ya la portada en español. */
      { source: '/es/propuesta', destination: '/es/work', permanent: false },
    ];
  },
};

/* withBotId añade las reescrituras con las que el reto de BotID se sirve desde
   este mismo dominio: así no lo tumban los bloqueadores de anuncios. */
export default withBotId(nextConfig);
