'use client';
import { useEffect, useRef, useState } from 'react';
import { tc, PHASE_WORDS, type Film } from '@/lib/content/film';
import { renderShot } from './engine';
import f from './film.module.css';

export interface FilmUi { eyebrow: string; title: string; lead: string; play: string; pause: string; replay: string; timeline: string; shot: string; stage: string }
/* Cada plano lleva el nombre que verá quien use la línea de tiempo. */
export type FilmLabels = string[];

/* El reproductor: un escenario grande, play, código de tiempo y la línea de
   tiempo con un segmento por plano. No arranca solo; los botones «Desde aquí»
   de la lista lo ponen en marcha con un evento. */
export default function CaseFilm({ film, labels, ui }: { film: Film; labels: FilmLabels; ui: FilmUi }) {
  const stage = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const section = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const run = useRef({ offset: 0, t0: 0, k: -1, raf: 0, clean: () => {} });
  const S = film.shots, TOTAL = film.total;

  const at = (sec: number) => { for (let k = S.length - 1; k >= 0; k--) if (sec >= S[k].start) return k; return 0; };
  const paint = (sec: number) => {
    if (head.current) head.current.style.left = `${(sec / TOTAL) * 100}%`;
    if (time.current) time.current.textContent = `${tc(sec)} / ${tc(TOTAL)}`;
  };
  const show = (k: number, still: boolean) => {
    run.current.clean();
    run.current.k = k;
    run.current.clean = renderShot(stage.current!, S[k], still);
    setCurrent(k);
  };
  const stop = () => { cancelAnimationFrame(run.current.raf); setPlaying(false); };
  const play = (from: number) => {
    cancelAnimationFrame(run.current.raf);
    const r = run.current;
    r.offset = from; r.t0 = performance.now(); r.k = -1;
    setPlaying(true);
    const loop = () => {
      const sec = r.offset + (performance.now() - r.t0) / 1000;
      if (sec >= TOTAL) { paint(TOTAL); r.offset = TOTAL; setPlaying(false); return; }
      const k = at(sec);
      if (k !== r.k) show(k, false);
      paint(sec);
      r.raf = requestAnimationFrame(loop);
    };
    loop();
  };

  useEffect(() => {
    show(0, true); paint(0);
    const onPlay = (e: Event) => {
      const k = (e as CustomEvent<number>).detail;
      section.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      play(S[k].start);
    };
    window.addEventListener('casefilm:play', onPlay);
    const r = run.current;
    return () => { window.removeEventListener('casefilm:play', onPlay); cancelAnimationFrame(r.raf); r.clean(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [film]);

  const toggle = () => {
    if (playing) { stop(); run.current.offset = S[run.current.k].start; return; }
    play(run.current.offset >= TOTAL ? 0 : S[at(run.current.offset)].start);
  };
  const phases = PHASE_WORDS.map((w, p) => {
    const ss = S.filter((x) => x.phase === p);
    return ss.length ? { w, from: ss[0].start, to: ss[ss.length - 1].start + ss[ss.length - 1].dur } : null;
  }).filter((x): x is { w: string; from: number; to: number } => !!x);

  return (
    <section ref={section} className={f.band} aria-labelledby="film" style={{ scrollMarginTop: 72 }}>
      <div className="container">
        <div className={f.head}>
          <p className={f.eyebrow}>{ui.eyebrow}</p>
          <h2 id="film" className={f.title}>{ui.title}</h2>
          <p className={f.lead}>{ui.lead}</p>
        </div>
        <div className={f.player}>
          <div ref={stage} className={f.stage} style={{ ['--brand' as string]: film.brand }} role="img" aria-label={`${ui.stage}: ${labels[current]}`} />
          <div className={f.controls}>
            <button type="button" className={f.play} onClick={toggle} aria-pressed={playing}>
              <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>{playing ? ui.pause : run.current.offset >= TOTAL ? ui.replay : ui.play}
            </button>
            <span ref={time} className={f.tc} />
            <span className={f.now} aria-live="polite">{ui.shot} {String(current + 1).padStart(2, '0')} · {labels[current]}</span>
          </div>
          <div className={f.phases} aria-hidden="true">
            {phases.map((p) => <span key={p.w} style={{ width: `${((p.to - p.from) / TOTAL) * 100}%` }}>{p.w}</span>)}
          </div>
          <div className={f.timeline} role="group" aria-label={ui.timeline}>
            {S.map((s) => (
              <button key={s.i} type="button" className={f.seg} data-title={s.kind === 'title' ? '' : undefined} style={{ width: `${(s.dur / TOTAL) * 100}%` }} onClick={() => play(s.start)} aria-label={`${ui.shot} ${s.i + 1}: ${labels[s.i]}`}>
                {String(s.i + 1).padStart(2, '0')}
              </button>
            ))}
            <div ref={head} className={f.playhead} />
          </div>
        </div>
      </div>
    </section>
  );
}
