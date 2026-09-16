'use client';

import { useState } from 'react';
import { USE_CASES } from '@/lib/data';
import { Words } from '@/components/effects/neat';

export default function UsoIA() {
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const c = USE_CASES[idx];
  return (
    <div id="casos" data-screen-label="Casos de uso" style={{ padding: 'clamp(56px, 7vw, 96px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 32, height: 1, background: '#343a4a' }} />
              <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Casos de uso</span>
            </div>
            <Words style={{ margin: '20px 0 0', fontSize: 'clamp(26px, 3.8vw, 46px)', fontWeight: 400, letterSpacing: '-0.02em' }}>Cómo resolví <span className="bebas" style={{ letterSpacing: '0.01em' }}>tareas concretas</span></Words>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {USE_CASES.map((u, i) => (
              <div key={u.tab} className={'pill-tab' + (i === idx ? ' is-active' : '')} onClick={() => { setIdx(i); setStep(0); }}>{u.tab}</div>
            ))}
          </div>
        </div>

        <div className="use-grid">
          <div>
            <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8bde5f' }}>{c.kicker}</p>
            <h3 className="bebas" style={{ margin: '14px 0 0', fontWeight: 400, fontSize: 'clamp(26px, 3.4vw, 40px)', lineHeight: 1.06 }}>{c.title}</h3>
            <p style={{ margin: '20px 0 0', fontSize: 15, lineHeight: 1.68, color: '#949494', textWrap: 'pretty' }}>{c.pitch}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 26px', marginTop: 26, paddingTop: 20, borderTop: '1px solid #2c3140', fontSize: 12.5, color: '#6d6d6d' }}>
              <span>{c.role}</span><span>{c.context}</span><span>{c.period}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 26 }}>
              {c.metrics.map((m) => (
                <div key={m.k} style={{ border: '1px solid #2c3140', borderRadius: 24, padding: '14px 18px', background: 'rgba(35,39,51,0.45)' }}>
                  <p className="bebas" style={{ margin: 0, fontSize: 28, lineHeight: 1 }}>{m.v}</p>
                  <p style={{ margin: '8px 0 0', fontSize: 11.5, lineHeight: 1.4, color: '#878787', maxWidth: 130 }}>{m.k}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {c.steps.map((s, i) => {
              const open = step === i;
              return (
                <div key={s.name} className={'step-card' + (open ? ' is-open' : '')} onClick={() => setStep(open ? -1 : i)}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 }}>
                    <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8bde5f' }}>{s.name}</p>
                    <i className={open ? 'ri-subtract-line' : 'ri-add-line'} style={{ fontSize: 15, color: '#6d6d6d' }} />
                  </div>
                  <p style={{ margin: '12px 0 0', fontSize: 14.5, lineHeight: 1.6, color: '#d6d6d6', textWrap: 'pretty' }}>{s.lead}</p>
                  <div className="step-body">
                    {s.points.map((pt) => <p key={pt} style={{ margin: '12px 0 0', paddingLeft: 16, borderLeft: '1px solid #343a4a', fontSize: 13.5, lineHeight: 1.62, color: '#949494' }}>{pt}</p>)}
                  </div>
                </div>
              );
            })}
            <div style={{ border: '1px solid #2c3140', borderRadius: 24, padding: '18px 20px', background: 'rgba(139,222,95,0.05)' }}>
              <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#878787' }}>Qué haría distinto</p>
              <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.62, color: '#a8a8a8', textWrap: 'pretty' }}>{c.learning}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
