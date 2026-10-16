'use client';
import { useEffect, useRef, useState } from 'react';
import { FILM, FILM_ACTS, FILM_DURATION, FILM_SHOTS, timecode } from '@/lib/content/film';
import { motionAllowed } from '@/lib/motion/prefs';
import type { Locale } from '@/lib/i18n/config';
import s from './film.module.css';

type Labels = { play: string; pause: string; replay: string; music: string; fullscreen: string; exitFullscreen: string; timeline: string; hint: string; stage: string };

/* Reproductor del film. No estorba: no se reproduce solo, no descarga nada
   hasta que se pulsa (preload="none" sobre el póster) y vive en una caja
   oscura que enmarca el papel blanco del film como una pantalla.

   Sobre la imagen, con ratón, el cursor se convierte en un play grande que lo
   sigue; un clic arranca el film. Con el dedo, o con menos movimiento pedido,
   el mismo botón se queda quieto en el centro. Debajo, los controles del
   animatic: reproducir, timecode, tramo y plano en curso, música, pantalla
   completa y la línea de tiempo con los tramos a escala, que se pulsa para
   saltar y se mueve con las flechas un compás cada vez. */
const PlayIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" /></svg>;
const SoundIcon = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={s.stroke}>
    <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
    {on ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
  </svg>
);
const FsIcon = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={s.stroke}>
    {on ? <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
  </svg>
);

export default function FilmPlayer({ locale, labels }: { locale: Locale; labels: Labels }) {
  const box = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [t, setT] = useState(0);
  const [muted, setMuted] = useState(false);
  const [fs, setFs] = useState(false);
  const [follow, setFollow] = useState(false); // ¿el play sigue al cursor?
  const [hover, setHover] = useState(false);
  /* Con preload="none" no hay metadatos hasta pedirlos: un salto antes del
     primer play se guarda y se aplica al cargar. */
  const pending = useRef<number | null>(null);

  useEffect(() => { setFollow(motionAllowed() && window.matchMedia('(hover: hover) and (pointer: fine)').matches); }, []);

  /* El tiempo se lee en cada fotograma mientras suena: timeupdate llega cuatro
     veces por segundo y el timecode iría a saltos. */
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => { setT(video.current?.currentTime ?? 0); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  useEffect(() => {
    const on = () => setFs(document.fullscreenElement === box.current);
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { setStarted(true); setEnded(false); void v.play(); } else v.pause();
  };
  const seek = (to: number) => {
    const v = video.current;
    const x = Math.max(0, Math.min(FILM_DURATION, to));
    if (v) { if (v.readyState === 0) { pending.current = x; v.preload = 'metadata'; v.load(); } else v.currentTime = x; }
    setT(x); setEnded(false);
  };
  const toggleMute = () => { const v = video.current; const m = !muted; if (v) v.muted = m; setMuted(m); };
  const toggleFs = () => {
    const el = box.current as (HTMLElement & { webkitRequestFullscreen?: () => void }) | null;
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) { void document.exitFullscreen(); return; }
    if (el?.requestFullscreen) void el.requestFullscreen();
    else if (v?.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iPhone: solo el vídeo puede ir a pantalla completa
  };

  /* El play que sigue al cursor: se mueve con transform en un rAF, con un poco
     de inercia, sin pasar por el estado de React en cada movimiento. */
  useEffect(() => {
    if (!follow) return;
    const el = stage.current, c = cursor.current;
    if (!el || !c) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => { x += (tx - x) * 0.22; y += (ty - y) * 0.22; c.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0; };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const enter = (e: PointerEvent) => { const r = el.getBoundingClientRect(); x = tx = e.clientX - r.left; y = ty = e.clientY - r.top; loop(); setHover(true); };
    const leave = () => setHover(false);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerenter', enter); el.removeEventListener('pointerleave', leave); if (raf) cancelAnimationFrame(raf); };
  }, [follow]);

  const shot = FILM_SHOTS.find((x) => t >= x.in && t < x.out) ?? FILM_SHOTS.at(-1)!;
  const act = FILM_ACTS[shot.act];
  const actLabel = act[locale];
  const pct = (v: number) => `${(v / FILM_DURATION) * 100}%`;
  const bigLabel = playing ? labels.pause : ended ? labels.replay : labels.play;

  const onSlider = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
    if (d) { e.preventDefault(); seek(t + d * FILM.step); return; }
    if (e.key === 'Home') { e.preventDefault(); seek(0); }
    if (e.key === 'End') { e.preventDefault(); seek(FILM_DURATION - 0.01); }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
  };
  const onTrack = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - r.left) / r.width) * FILM_DURATION);
  };

  return (
    <figure ref={box} className={s.film} data-fs={fs ? 'true' : undefined}>
      <div ref={stage} className={s.stage} data-follow={follow ? 'true' : undefined} data-hover={hover ? 'true' : undefined} data-playing={playing ? 'true' : undefined} data-started={started ? 'true' : undefined}>
        <video ref={video} className={s.video} poster={FILM.poster} preload="none" playsInline
          aria-label={labels.stage} onClick={toggle}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setEnded(true); }}
          onLoadedMetadata={() => { const v = video.current; if (v && pending.current != null) { v.currentTime = pending.current; pending.current = null; } }}
          onSeeked={() => setT(video.current?.currentTime ?? 0)}>
          {FILM.sources.map((x) => <source key={x.type} src={x.src} type={x.type} />)}
        </video>
        {/* Un solo botón: con ratón sigue al cursor; si no, se queda en el
            centro. Mientras suena solo aparece al pasar por encima. */}
        <span ref={cursor} className={s.cursor} aria-hidden="true">
          <span className={s.cursorDisc}>{playing ? <PauseIcon /> : <PlayIcon />}</span>
          <span className={s.cursorText}>{bigLabel}</span>
        </span>
        <button type="button" className={s.big} onClick={toggle} aria-label={bigLabel}>
          <span className={s.bigDisc}>{playing ? <PauseIcon /> : <PlayIcon />}</span>
        </button>
      </div>

      <div className={s.bar}>
        <div className={s.row}>
          <button type="button" className={s.primary} onClick={toggle}>{playing ? <PauseIcon /> : <PlayIcon />}<span>{bigLabel}</span></button>
          <p className={s.tc}><span className={s.now}>{timecode(t)}</span><span className={s.total}> / {timecode(FILM_DURATION)}</span></p>
          <p className={s.where} aria-live="off">
            <span className={s.whereAct}>{actLabel} · {act.name}</span>
            <span className={s.whereShot}>{String(shot.no).padStart(2, '0')} · {shot[locale]}</span>
          </p>
          <div className={s.side}>
            <button type="button" className={s.ghost} onClick={toggleMute} aria-pressed={!muted}><SoundIcon on={!muted} /><span>{labels.music}</span></button>
            <button type="button" className={s.ghost} onClick={toggleFs}><FsIcon on={fs} /><span>{fs ? labels.exitFullscreen : labels.fullscreen}</span></button>
          </div>
        </div>

        <div className={s.track} role="slider" tabIndex={0} aria-label={labels.timeline}
          aria-valuemin={0} aria-valuemax={FILM_DURATION} aria-valuenow={Math.round(t * 10) / 10}
          aria-valuetext={`${timecode(t)} · ${actLabel}, ${shot[locale]}`}
          onKeyDown={onSlider} onPointerDown={onTrack}>
          {FILM_ACTS.map((a, i) => (
            <span key={a.r + i} className={s.act} data-on={a === act ? 'true' : undefined} style={{ left: pct(a.start), width: pct(a.end - a.start) }}>
              <span className={s.actR}>{a.r}</span>
              {FILM_SHOTS.filter((x) => x.act === i && x.in > a.start).map((x) => <i key={x.no} className={s.tick} style={{ left: `${((x.in - a.start) / (a.end - a.start)) * 100}%` }} />)}
            </span>
          ))}
          <span className={s.head} style={{ left: pct(t) }} aria-hidden="true" />
        </div>
        <p className={s.hint}>{labels.hint}</p>
      </div>
    </figure>
  );
}
