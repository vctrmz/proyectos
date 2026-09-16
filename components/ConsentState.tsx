'use client';

import { useEffect, useState } from 'react';
import { readConsent, resetConsent } from '@/lib/consent';

const LABEL = { granted: 'aceptadas', denied: 'rechazadas' } as const;

/* Refleja la decisión guardada y permite deshacerla. */
export default function ConsentState() {
  const [state, setState] = useState('sin decidir');
  useEffect(() => { const c = readConsent(); setState(c ? LABEL[c] : 'sin decidir'); }, []);
  return (
    <div className="cookie-box">
      <p>Tu decisión actual: <span className="state">{state}</span></p>
      <button type="button" className="btn" onClick={resetConsent}>Cambiar mi decisión</button>
    </div>
  );
}
