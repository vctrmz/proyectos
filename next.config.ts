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
      { source: '/sobre-mi', destination: '/es/about', permanent: true },
      { source: '/perfil', destination: '/es/about', permanent: true },
      { source: '/perfil.html', destination: '/es/about', permanent: true },
      { source: '/privacidad', destination: '/es/privacy', permanent: true },
      { source: '/privacidad.html', destination: '/es/privacy', permanent: true },
    ];
  },
};

/* withBotId añade las reescrituras con las que el reto de BotID se sirve desde
   este mismo dominio: así no lo tumban los bloqueadores de anuncios. */
export default withBotId(nextConfig);
