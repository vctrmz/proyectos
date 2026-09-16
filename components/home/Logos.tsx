import { LOGOS } from '@/lib/data';

export default function Logos() {
  return (
    <div data-screen-label="Sistemas" style={{ padding: 'clamp(56px, 7vw, 96px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: 1, background: '#343a4a' }} />
          <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Sistemas en los que he trabajado</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(140px, 18vw, 180px), 1fr))', gap: 'clamp(20px, 2.6vw, 36px)', marginTop: 'clamp(24px, 3vw, 36px)' }}>
          {LOGOS.map((l) => {
            const img = <img src={l.src} alt={l.name} loading="lazy" decoding="async" style={l.size === 'small' ? { maxWidth: '78%', maxHeight: 52, width: 'auto', height: 'auto', objectFit: 'contain' } : { width: '100%', height: '100%', objectFit: 'contain' }} />;
            return l.href
              ? <a key={l.id} href={l.href} target="_blank" rel="noopener" title={l.name} className="logo-cell">{img}</a>
              : <span key={l.id} title={l.name} className="logo-cell">{img}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
