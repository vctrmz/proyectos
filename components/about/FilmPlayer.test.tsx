import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilmPlayer from './FilmPlayer';
import { FILM_ACTS, FILM_DURATION, FILM_SHOTS, timecode } from '@/lib/content/film';
import { getUi } from '@/lib/i18n/ui';

const t = getUi('es').about.film;
const labels = { play: t.play, pause: t.pause, replay: t.replay, music: t.music, fullscreen: t.fullscreen, exitFullscreen: t.exitFullscreen, timeline: t.timeline, hint: t.hint, stage: t.stage };

describe('FilmPlayer', () => {
  it('no se impone: sin autoplay y sin descargar nada hasta que se pulsa', () => {
    const { container } = render(<FilmPlayer locale="es" labels={labels} />);
    const v = container.querySelector('video')!;
    expect(v.autoplay).toBe(false);
    expect(v.getAttribute('preload')).toBe('none');
    expect(v.getAttribute('poster')).toMatch(/poster\.webp$/);
    expect(screen.getAllByRole('button', { name: 'Reproducir' }).length).toBeGreaterThanOrEqual(1);
  });

  it('la música se quita y se pone, y la línea de tiempo se mueve un compás con las flechas', () => {
    render(<FilmPlayer locale="es" labels={labels} />);
    const music = screen.getByRole('button', { name: 'Música' });
    expect(music).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(music);
    expect(music).toHaveAttribute('aria-pressed', 'false');
    const slider = screen.getByRole('slider', { name: 'Línea de tiempo del film' });
    expect(slider).toHaveAttribute('aria-valuemax', String(FILM_DURATION));
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toHaveAttribute('aria-valuenow', '5');
    expect(slider.getAttribute('aria-valuetext')).toMatch(/00:05:00 · Prólogo, Primer trazo/);
    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider.getAttribute('aria-valuetext')).toMatch(/Epílogo, Vuelta a la página/);
  });
});

describe('Datos del film', () => {
  it('dura 85 s, ocho tramos encadenados y 18 planos', () => {
    expect(FILM_DURATION).toBe(85);
    expect(FILM_SHOTS).toHaveLength(18);
    expect(FILM_ACTS).toHaveLength(8);
    FILM_ACTS.forEach((a, i) => { if (i) expect(a.start).toBe(FILM_ACTS[i - 1].end); });
  });
  it('el timecode va en minutos, segundos y fotogramas', () => {
    expect(timecode(0)).toBe('00:00:00');
    expect(timecode(85)).toBe('01:25:00');
    expect(timecode(12.5)).toBe('00:12:12');
  });
});
