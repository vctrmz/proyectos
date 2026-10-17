'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import { motionAllowed } from '@/lib/motion/prefs';
import { aboutIn } from '@/lib/content/en';
import { useLocale } from '@/lib/i18n/LocaleContext';
import s from './ikigai.module.css';

type K = 'design' | 'tech' | 'business';
const R = 130;
/* Posición final de cada círculo (el diagrama de Venn) y de dónde llega al
   hacer scroll: tech desde la izquierda y business desde la derecha. Design ya
   está dibujado al entrar —su ventana acaba en 0—: al llegar con el scroll se
   ve el primer círculo y su frase, no una retícula vacía. Las etiquetas van
   en la zona exclusiva de cada círculo. */
const C: { k: K; cx: number; cy: number; lx: number; ly: number; from: [number, number]; win: [number, number] }[] = [
  { k: 'design', cx: 280, cy: 170, lx: 280, ly: 105, from: [0, -150], win: [-0.1, 0] },
  { k: 'tech', cx: 200, cy: 300, lx: 152, ly: 360, from: [-190, 90], win: [0.16, 0.42] },
  { k: 'business', cx: 360, cy: 300, lx: 408, ly: 360, from: [190, 90], win: [0.42, 0.68] },
];
const CENTER_WIN: [number, number] = [0.7, 0.88];
/* Nombre visible de cada círculo, con mayúscula inicial. */
const NAME: Record<K, string> = { design: 'Design', tech: 'Tech', business: 'Business' };
const LEN = 2 * Math.PI * R;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => 1 - (1 - v) ** 3;
const prog = (v: number, [a, b]: [number, number]) => ease(clamp((v - a) / (b - a)));
const stepOf = (v: number) => (v < C[1].win[0] ? 0 : v < C[2].win[0] ? 1 : v < CENTER_WIN[0] ? 2 : 3);

/* La infografía se cuenta con el scroll. La sección se queda fija mientras
   los tres círculos llegan, cada uno a su ritmo y desde su lado (parallax),
   y se dibujan mientras al lado aparece qué aporta cada uno. Cuando están los
   tres, la intersección se enciende y aparece «Product design»: la tesis no
   se enuncia, se ve llegar.

   Sin JavaScript o con movimiento reducido no hay recorrido: el diagrama está
   montado desde el principio y las tres frases se leen en la lista. Los
   círculos siguen siendo botones: tocarlos fija su frase. */
function Ring({ c, p, active, onToggle }: { c: (typeof C)[number]; p: MotionValue<number>; active: K | null; onToggle: (k: K) => void }) {
  const x = useTransform(p, (v) => c.from[0] * (1 - prog(v, c.win)));
  const y = useTransform(p, (v) => c.from[1] * (1 - prog(v, c.win)));
  const opacity = useTransform(p, (v) => 0.12 + 0.88 * prog(v, c.win));
  const dash = useTransform(p, (v) => LEN * (1 - prog(v, c.win)));
  const label = useTransform(p, (v) => clamp((v - c.win[0]) / (c.win[1] - c.win[0]) * 1.6 - 0.6));
  return (
    <motion.g style={{ x, y, opacity }}>
      <g role="button" tabIndex={0} aria-label={NAME[c.k]} aria-pressed={active === c.k}
        className={`${s.ring} ${active && active !== c.k ? s.dim : ''} ${active === c.k ? s.on : ''}`}
        onClick={() => onToggle(c.k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(c.k); } }}>
        <circle cx={c.cx} cy={c.cy} r={R + 14} fill="transparent" stroke="none" />
        <motion.circle data-ring cx={c.cx} cy={c.cy} r={R} fill="none" stroke="url(#ik-line)" strokeWidth={1.5}
          strokeDasharray={LEN} style={{ strokeDashoffset: dash }} />
      </g>
      <motion.text x={c.lx} y={c.ly} textAnchor="middle" className={s.label} style={{ opacity: label }}>{NAME[c.k]}</motion.text>
    </motion.g>
  );
}

export default function IkigaiDiagram() {
  const locale = useLocale();
  const ABOUT = aboutIn(locale);
  const [active, setActive] = useState<K | null>(null);
  const [fx, setFx] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => { setFx(motionAllowed()); }, []);

  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const still = useMotionValue(1);
  const p = fx ? scrollYProgress : still;
  const [step, setStep] = useState(3);
  useEffect(() => { setStep(stepOf(p.get())); }, [p]);
  useMotionValueEvent(p, 'change', (v) => setStep(stepOf(v)));

  /* Capas de parallax: la retícula de puntos viaja más despacio que los
     círculos, y el conjunto sube un poco mientras dura el recorrido. */
  const gridY = useTransform(p, (v) => 40 - v * 80);
  const sceneY = useTransform(p, (v) => 24 - v * 48);
  const core = useTransform(p, (v) => prog(v, CENTER_WIN));
  const coreScale = useTransform(core, (v) => 0.85 + 0.15 * v);
  const bars = [useTransform(p, (v) => prog(v, C[0].win)), useTransform(p, (v) => prog(v, C[1].win)), useTransform(p, (v) => prog(v, C[2].win))];

  const t = locale === 'es'
    ? { where: 'Donde se cruzan las tres.', hint: 'Toca un círculo para ver cada parte.', tap: 'Toca un círculo.' }
    : { where: 'Where the three meet.', hint: 'Tap a circle to see each part.', tap: 'Tap a circle.' };
  const steps = [
    ...C.map((c, i) => ({ id: c.k, n: `0${i + 1}`, title: NAME[c.k], body: ABOUT.ikigai[c.k] })),
    { id: 'center', n: '', title: ABOUT.ikigai.center, body: t.where },
  ];
  const shown = active ? C.findIndex((c) => c.k === active) : step;
  const toggle = (k: K) => setActive((a) => (a === k ? null : k));

  return (
    <div ref={track} className={`${s.track} ${fx ? s.scroll : ''}`}>
      <div className={s.stage}>
        <div className={s.copy}>
          <div className={s.rail} aria-hidden="true">
            {bars.map((b, i) => <span key={i}><motion.i style={{ scaleX: b }} /></span>)}
          </div>
          {/* Las cuatro frases están siempre en el DOM: el lector de pantalla
              las lee en orden, y a la vista solo queda la del paso actual. */}
          <ol className={s.steps}>
            {steps.map((x, i) => (
              <li key={x.id} className={`${s.step} ${i === shown ? s.now : ''}`} aria-current={i === shown ? 'step' : undefined}>
                {x.n && <span className={s.n}>{x.n} / 03</span>}
                <span className={`${s.title} ${x.id === 'center' ? s.thesis : ''}`}>{x.title}</span>
                <span className={s.body}>{x.body}</span>
              </li>
            ))}
          </ol>
          <AnimatePresence>
            {step === 3 && !active && <motion.p className={s.hint} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{t.hint}</motion.p>}
          </AnimatePresence>
        </div>

        <motion.svg viewBox="55 25 450 420" className={s.svg} style={{ y: sceneY }} role="group" aria-label="Diagrama: diseño, tecnología y negocio se cruzan en product design">
          <defs>
            <linearGradient id="ik-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4a44f2" />
              <stop offset="55%" stopColor="#8bde5f" />
              <stop offset="100%" stopColor="#4a44f2" stopOpacity="0.15" />
            </linearGradient>
            <radialGradient id="ik-core" cx="50%" cy="55%" r="60%">
              <stop offset="0%" stopColor="#8bde5f" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#4a44f2" stopOpacity="0.35" />
            </radialGradient>
            <radialGradient id="ik-fade-g" cx="50%" cy="50%" r="50%">
              <stop offset="35%" stopColor="#fff" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="ik-fade" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#ik-fade-g)" /></mask>
            <pattern id="ik-dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" className={s.dot} /></pattern>
            <clipPath id="ik-tech"><circle cx={200} cy={300} r={R} /></clipPath>
            <clipPath id="ik-business"><circle cx={360} cy={300} r={R} /></clipPath>
          </defs>

          <motion.rect x={-40} y={-60} width={640} height={560} fill="url(#ik-dots)" mask="url(#ik-fade)" className={s.grid} style={{ y: gridY }} aria-hidden="true" />

          {/* La intersección de los tres: el círculo de design recortado por
              tech y por business. Se enciende al final del recorrido. */}
          <motion.g style={{ opacity: core }} aria-hidden="true">
            <g clipPath="url(#ik-tech)"><g clipPath="url(#ik-business)"><circle cx={280} cy={170} r={R} fill="url(#ik-core)" /></g></g>
          </motion.g>

          {C.map((c) => <Ring key={c.k} c={c} p={p} active={active} onToggle={toggle} />)}

          <motion.text x={280} y={262} textAnchor="middle" className={s.center} style={{ opacity: core, scale: coreScale, transformOrigin: '280px 258px' }}>{ABOUT.ikigai.center}</motion.text>
        </motion.svg>
      </div>
      <p role="status" aria-live="polite" className="visually-hidden">{active ? ABOUT.ikigai[active] : t.tap}</p>
    </div>
  );
}
