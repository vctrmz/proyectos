'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readConsent, writeConsent, startAnalytics, installConsentGlobals } from '@/lib/consent';

/* Aparece a los 400 ms de montar, salvo que ya haya decisión guardada. */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    installConsentGlobals();
    const decision = readConsent();
    if (decision === 'granted') { startAnalytics(); return; }
    if (decision === 'denied') return;
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
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
        Uso Google Analytics y Microsoft Clarity para ver cómo se navega esta web. Usan cookies y solo se activan si lo aceptas.{' '}
        <Link href="/privacidad">Más información</Link>
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-btn" onClick={reject}>Rechazar</button>
        <button type="button" className="consent-btn is-primary" onClick={accept}>Aceptar</button>
      </div>
    </div>
  );
}
