'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readConsent, writeConsent, startAnalytics, installConsentGlobals } from '@/lib/consent';
import { loaderSeen, onLoaderDone } from '@/lib/loader';

/* Esperamos a que acabe la intro para no taparla. Si en la página no hay
   loader (perfil, privacidad) damos 2 s de margen, como consent.js. */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    installConsentGlobals();
    const decision = readConsent();
    if (decision === 'granted') { startAnalytics(); return; }
    if (decision === 'denied') return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const show = (ms: number) => { t = setTimeout(() => setOpen(true), ms); };
    let off = () => {};
    if (loaderSeen()) show(400);
    else if (document.querySelector('[data-loader]')) off = onLoaderDone(() => show(400));
    else show(2000);
    return () => { off(); if (t) clearTimeout(t); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  if (!open) return null;

  const close = () => { setShown(false); setTimeout(() => setOpen(false), 350); };
  const accept = () => { writeConsent('granted'); startAnalytics(); close(); };
  const reject = () => { writeConsent('denied'); close(); };

  return (
    <div role="dialog" aria-label="Consentimiento de analítica" className={'consent' + (shown ? ' is-in' : '')}>
      <p>
        Uso Google Analytics, Microsoft Clarity, Hotjar, Plerdy y HubSpot para ver cómo se navega esta web y para atender lo que me escribes. Usan cookies y solo se activan si lo aceptas.{' '}
        <Link href="/privacidad">Más información</Link>
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-btn" onClick={reject}>Rechazar</button>
        <button type="button" className="consent-btn is-primary" onClick={accept}>Aceptar</button>
      </div>
    </div>
  );
}
