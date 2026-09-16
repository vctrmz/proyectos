import { BIO, SOCIAL } from '@/lib/data';
import { splitBold } from '@/lib/text';
import { ZoomBox } from '@/components/effects/neat';

export default function Quien() {
  return (
    <div id="quien" data-screen-label="Quién soy" style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 64px)', borderTop: '1px solid #232733' }}>
      <div className="who-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 32, height: 1, background: '#343a4a' }} />
            <span style={{ fontSize: 10.5, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#878787' }}>Quién soy</span>
            <span style={{ fontSize: 10.5, letterSpacing: '0.06em', color: '#4d4d4d' }}>(01)</span>
          </div>
          <ZoomBox style={{ width: '100%', maxWidth: 220, aspectRatio: '1', marginTop: 24, borderRadius: 999, overflow: 'hidden', border: '1px solid #2c3140', background: '#232733' }}>
            <img src="/assets/victor.jpg" alt="Víctor Maza" width={400} height={400} loading="lazy" decoding="async" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.06) brightness(0.94)' }} />
          </ZoomBox>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 22, maxWidth: 220 }}>
            <a href={SOCIAL.linkedin} target="_blank" rel="noopener" className="social-pill"><i className="ri-linkedin-fill" style={{ fontSize: 16, color: '#8bde5f' }} />LinkedIn</a>
            <a href={SOCIAL.behance} target="_blank" rel="noopener" className="social-pill"><i className="ri-behance-fill" style={{ fontSize: 16, color: '#8bde5f' }} />Behance</a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener" className="social-pill"><i className="ri-instagram-line" style={{ fontSize: 16, color: '#8bde5f' }} />Instagram</a>
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          {BIO.map((para) => (
            <p key={para.slice(0, 40)} style={{ margin: '0 0 22px', fontSize: 'clamp(15px, 1.3vw, 17.5px)', lineHeight: 1.72, color: '#949494', textWrap: 'pretty' } as React.CSSProperties}>
              {splitBold(para).map((s, i) => <span key={i} style={s.strong ? { color: '#ececec', fontWeight: 600 } : undefined}>{s.text}</span>)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
