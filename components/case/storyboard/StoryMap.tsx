'use client';
import { useEffect, useState } from 'react';
import { useScrollDirection } from '@/lib/motion/useScrollDirection';
import s from './storyboard.module.css';

export type MapShot = { id: string; no: string; title: string; decision: boolean; kind: string };
export type MapAct = { id: string; roman: string; title: string; shots: MapShot[] };
type Labels = { map: string; mapNote: string; rowActs: string; rowShots: string; rowDecision: string; rowFrame: string; act: string; shot: string; decision: string; progress: string };

/* Plano activo: el último cuyo borde superior ya pasó la línea de lectura, al
   40 % de la pantalla. Se calcula por posición en un rAF por scroll —son una
   docena de elementos— para que un salto largo, por ancla o por teclado, deje
   la tira en el plano correcto. Los enlaces son anclas reales: sin JS, el
   mapa y la tira siguen navegando. */
function useActiveShot(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  /* La lista llega nueva en cada render: el efecto depende de su contenido. */
  const key = ids.join(' ');
  useEffect(() => {
    const els = key.split(' ').map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    let raf = 0;
    const pick = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let cur: string | null = null;
      for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id;
      setActive(cur);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(pick); };
    pick();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, [key]);
  return active;
}

const all = (acts: MapAct[]) => acts.flatMap((a) => a.shots);

/* El mapa del caso, a escala: cada columna es un plano y cada acto ocupa los
   planos que tiene. Es la misma lectura que la línea de tiempo de un
   storyboard de cine, con las decisiones en lugar de los títulos de fase. */
export function StoryMap({ acts, labels }: { acts: MapAct[]; labels: Labels }) {
  const shots = all(acts);
  const active = useActiveShot(shots.map((x) => x.id));
  const cols = { gridTemplateColumns: `var(--rl) repeat(${shots.length}, minmax(64px, 1fr))` } as React.CSSProperties;
  const on = (id: string) => (active === id ? 'true' : undefined);
  return (
    <section className={s.map} aria-labelledby="sb-map">
      <div className={s.mapHead}>
        <h2 id="sb-map">{labels.map}</h2>
        <p>{labels.mapNote}</p>
      </div>
      <div className={s.tlWrap}>
        <div className={s.tl} style={cols}>
          <span className={s.rl} aria-hidden="true">{labels.rowActs}</span>
          {acts.map((a) => (
            <span key={a.id} className={s.actCell} style={{ gridColumn: `span ${a.shots.length}` }} aria-hidden="true">
              <b>{a.roman}</b> {a.title}
            </span>
          ))}
          <span className={s.rl} aria-hidden="true">{labels.rowShots}</span>
          {shots.map((x) => {
            const act = acts.find((a) => a.shots.includes(x))!;
            return (
              <a key={x.id} href={`#${x.id}`} className={s.shotCell} data-on={on(x.id)}
                aria-label={`${labels.shot} ${x.no}, ${labels.act} ${act.roman}: ${x.title}${x.decision ? `. ${labels.decision}` : ''}`}>
                <span className={s.no}>{x.no}</span>
                <span className={s.nm}>{x.title}</span>
              </a>
            );
          })}
          <span className={s.rl} aria-hidden="true">{labels.rowDecision}</span>
          {shots.map((x) => (
            <span key={`d${x.id}`} className={s.decCell} data-on={on(x.id)} aria-hidden="true">{x.decision && <i />}</span>
          ))}
          <span className={s.rl} aria-hidden="true">{labels.rowFrame}</span>
          {shots.map((x) => (
            <span key={`k${x.id}`} className={s.kindCell} data-on={on(x.id)} aria-hidden="true">{x.kind}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* La tira pegajosa: un segmento por plano, agrupados por acto, con el plano
   activo en acento. Baja con la cabecera cuando esta reaparece. */
export function StoryStrip({ acts, labels }: { acts: MapAct[]; labels: Labels }) {
  const shots = all(acts);
  const active = useActiveShot(shots.map((x) => x.id));
  const dir = useScrollDirection();
  const i = shots.findIndex((x) => x.id === active);
  const cur = i >= 0 ? shots[i] : null;
  const act = cur ? acts.find((a) => a.shots.includes(cur)) : null;
  return (
    <nav className={s.strip} data-header={dir === 'down' ? 'hidden' : 'shown'} data-live={cur ? 'true' : undefined} aria-label={labels.progress}>
      <div className={s.stripIn}>
        <p className={s.now} aria-live="polite">
          {cur && act ? <><b>{act.roman}</b><span className={s.nowAct}>{act.title}</span><span className={s.nowShot}>{cur.no} · {cur.title}</span></> : <span className={s.nowAct}>{labels.map}</span>}
        </p>
        {/* Por debajo de 900 px los segmentos no caben a 24 px de toque (WCAG
            2.5.8): la tira pasa a ser solo una barra de progreso y la
            navegación queda en el mapa. */}
        <span className={s.bar} aria-hidden="true">
          {shots.map((x, k) => <span key={x.id} data-state={k === i ? 'on' : i >= 0 && k < i ? 'past' : undefined} />)}
        </span>
        <ol className={s.segs}>
          {acts.map((a) => (
            <li key={a.id} className={s.segAct}>
              <ol>
                {a.shots.map((x) => {
                  const k = shots.indexOf(x);
                  return (
                    <li key={x.id}>
                      <a href={`#${x.id}`} className={s.seg} data-state={k === i ? 'on' : i >= 0 && k < i ? 'past' : undefined} aria-current={k === i ? 'step' : undefined}
                        aria-label={`${labels.shot} ${x.no}: ${x.title}`}><span /></a>
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
