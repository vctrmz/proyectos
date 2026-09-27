'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readConsent, writeConsent, startAnalytics, installConsentGlobals } from '@/lib/consent';
import { useLocale, useUi } from '@/lib/i18n/LocaleContext';
import { ROUTES } from '@/lib/i18n/config';

/* Aparece a los 400 ms de montar, salvo que ya haya decisión guardada. */
export default function ConsentBanner() {
  const locale = useLocale();
  const ui = useUi();
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
    <div role="dialog" aria-label={locale === "es" ? "Consentimiento de analítica" : "Analytics consent"} className={'consent' + (shown ? ' is-in' : '')}>
      {/* El aviso nombra las herramientas que de verdad se cargan, y sale del
          diccionario: en inglés estaba enseñando este párrafo en español. */}
      <p>
        {ui.consent.text}{' '}
        <Link href={ROUTES[locale].privacy}>{ui.about.more}</Link>
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-btn" onClick={reject}>{ui.consent.reject}</button>
        <button type="button" className="consent-btn is-primary" onClick={accept}>{ui.consent.accept}</button>
      </div>
    </div>
  );
}
