'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ABOUT } from '@/lib/content/about';
import s from './about.module.css';
export default function CompanyTabs() {
  const [i, setI] = useState(0);
  const c = ABOUT.companies[i];
  const n = ABOUT.companies.length;
  return (
    <div>
      <div role="tablist" aria-label="Empresas" className={s.tabs}>
        {ABOUT.companies.map((co, k) => (
          <button key={co.id} role="tab" id={`tab-${co.id}`} aria-selected={i === k} aria-controls={`panel-${co.id}`} tabIndex={i === k ? 0 : -1} className={s.tab} onClick={() => setI(k)}
            onKeyDown={(e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault(); const nx = (k + d + n) % n; setI(nx); document.getElementById(`tab-${ABOUT.companies[nx].id}`)?.focus(); }}>
            {co.name} <small>{co.years}</small>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${c.id}`} aria-labelledby={`tab-${c.id}`} className={s.panel}>
        <p>{c.body}</p>
        <Link href={c.href} className={s.more}>{c.href.startsWith('/casos') ? 'Ver el caso →' : 'Ver en el catálogo →'}</Link>
      </div>
    </div>
  );
}
