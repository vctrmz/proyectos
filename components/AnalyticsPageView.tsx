'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { readConsent } from '@/lib/consent';

/* Con navegación sin recarga gtag no ve el cambio de página: se envía a mano
   a partir de la segunda ruta (la primera la manda `config`). */
export default function AnalyticsPageView() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (readConsent() !== 'granted') return;
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (gtag) gtag('event', 'page_view', { page_path: pathname, page_location: location.href, page_title: document.title });
  }, [pathname]);
  return null;
}
