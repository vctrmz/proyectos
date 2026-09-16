import { SKILLS } from '@/lib/data';
import { Words } from '@/components/effects/neat';

export default function Fuerte() {
  return (
    <div data-screen-label="Fuerte" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: 1, background: '#343a4a' }} />
          <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>En qué soy fuerte</span>
          <span style={{ fontSize: 10.5, letterSpacing: '0.06em', color: '#4d4d4d' }}>(02)</span>
        </div>
        <Words style={{ margin: '20px 0 0', fontSize: 'clamp(28px, 4.2vw, 52px)', fontWeight: 400, letterSpacing: '-0.02em' }}>Lo que aporto a un <span className="bebas" style={{ letterSpacing: '0.01em' }}>equipo de producto</span></Words>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'clamp(14px, 1.8vw, 22px)', marginTop: 'clamp(28px, 3.4vw, 44px)' }}>
          {SKILLS.map((t, i) => (
            <div key={t} className="skill-card">
              <span className="bebas" style={{ fontSize: 20, color: '#8bde5f' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontSize: 14.5, lineHeight: 1.55, color: '#d6d6d6' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
