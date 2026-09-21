import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/perfil.html', destination: '/sobre-mi', permanent: true },
      { source: '/perfil', destination: '/sobre-mi', permanent: true },
      { source: '/privacidad.html', destination: '/privacidad', permanent: true },
    ];
  },
};

export default nextConfig;
