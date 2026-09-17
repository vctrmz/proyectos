'use client';

import { useState } from 'react';

/* La clase se retira al acabar: un ancestro con transform convertiría los
   position: fixed de dentro (modal, loader, peek) en relativos a la página. */
export default function Template({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  return <div className={done ? undefined : 'page-enter'} onAnimationEnd={(e) => { if (e.target === e.currentTarget) setDone(true); }}>{children}</div>;
}
