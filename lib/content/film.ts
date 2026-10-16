/* «Página en blanco»: motion film sin voz, de 85 segundos, sobre design
   thinking con IA. Los tramos y los planos salen de su shot spec (la misma
   tabla que el mapa de estructura del kit): la línea de tiempo del
   reproductor es la del film, no una barra genérica. */
export type FilmAct = { r: string; name: string; es: string; en: string };
export type FilmShot = { act: number; dur: number; es: string; en: string };

export const FILM = {
  /* H.264 primero (Safari, Chrome, Firefox); VP9 de reserva para los Chromium
     sin códecs propietarios. Pesan lo mismo, unos 4 MB. */
  sources: [
    { src: '/assets/film/pagina-en-blanco-720p.mp4', type: 'video/mp4' },
    { src: '/assets/film/pagina-en-blanco-720p.webm', type: 'video/webm' },
  ],
  poster: '/assets/film/pagina-en-blanco-poster.webp',
  fps: 24,
  /* Paso de las flechas en la línea de tiempo: un compás a 96 BPM. */
  step: 2.5,
  acts: [
    { r: '0', name: 'Blank page', es: 'Prólogo', en: 'Prologue' },
    { r: 'I', name: 'Empathize', es: 'Empatizar', en: 'Empathize' },
    { r: 'II', name: 'Define', es: 'Definir', en: 'Define' },
    { r: 'III', name: 'Ideate', es: 'Idear', en: 'Ideate' },
    { r: 'IV', name: 'Prototype', es: 'Prototipar', en: 'Prototype' },
    { r: 'V', name: 'Test', es: 'Testear', en: 'Test' },
    { r: 'VI', name: 'Deliver', es: 'Mesa de clientes', en: 'Client table' },
    { r: 'VII', name: 'Blank page', es: 'Epílogo', en: 'Epilogue' },
  ] as FilmAct[],
  shots: [
    { act: 0, dur: 2.5, es: 'Silencio', en: 'Silence' },
    { act: 0, dur: 5, es: 'Primer trazo', en: 'First stroke' },
    { act: 0, dur: 2.5, es: 'Dentro de la pantalla', en: 'Into the screen' },
    { act: 1, dur: 5, es: 'Observar', en: 'Observe' },
    { act: 1, dur: 7.5, es: 'Investigación con IA', en: 'Research with AI' },
    { act: 2, dur: 5, es: 'Affinity map', en: 'Affinity map' },
    { act: 2, dur: 5, es: 'Journey y foco', en: 'Journey and focus' },
    { act: 3, dur: 7.5, es: 'Crazy 8s', en: 'Crazy 8s' },
    { act: 3, dur: 3.75, es: 'Divergir con IA', en: 'Diverge with AI' },
    { act: 3, dur: 3.75, es: 'Converger', en: 'Converge' },
    { act: 4, dur: 3.75, es: 'De boceto a wireframe', en: 'Sketch to wireframe' },
    { act: 4, dur: 5, es: 'Sistema de diseño', en: 'Design system' },
    { act: 4, dur: 6.25, es: 'Flujo', en: 'Flow' },
    { act: 5, dur: 5, es: 'Usability test', en: 'Usability test' },
    { act: 5, dur: 5, es: 'Iterar', en: 'Iterate' },
    { act: 6, dur: 3.75, es: 'La mesa', en: 'The table' },
    { act: 6, dur: 5, es: 'Sí', en: 'Yes' },
    { act: 7, dur: 3.75, es: 'Vuelta a la página', en: 'Back to the page' },
  ] as FilmShot[],
};

/* Entradas y salidas acumuladas: cada plano empieza donde acaba el anterior. */
export const FILM_SHOTS = (() => {
  let t = 0;
  return FILM.shots.map((s, i) => { const at = t; t += s.dur; return { ...s, no: i + 1, in: at, out: t }; });
})();
export const FILM_DURATION = FILM_SHOTS.at(-1)!.out;
export const FILM_ACTS = FILM.acts.map((a, i) => {
  const sh = FILM_SHOTS.filter((s) => s.act === i);
  return { ...a, start: sh[0].in, end: sh.at(-1)!.out };
});

/* Timecode de montaje: minutos, segundos y fotogramas (mm:ss:ff). */
export function timecode(t: number, fps = FILM.fps) {
  const f = Math.floor((t % 1) * fps + 1e-6);
  const s = Math.floor(t) % 60;
  const m = Math.floor(t / 60);
  return [m, s, f].map((n) => String(n).padStart(2, '0')).join(':');
}
