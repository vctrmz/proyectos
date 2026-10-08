import type { Locale } from '@/lib/i18n/config';
import s from './Lamina.module.css';

/* La lámina de cada proyecto: un diagrama que explica la idea del caso en vez
   de enseñar su logo o una captura diminuta. Todas comparten gramática —fondo
   claro, contornos de tinta, paneles lila y un solo acento índigo, con el
   verde como rotulador— y cada una dibuja el mecanismo de su caso.

   Nada se inventa: las etiquetas salen del propio caso (estados de Flesip,
   fases del módulo de suscripción, tokens del design system, el CSS real de
   esta web). Donde el caso no da un texto, va una barra en lugar de una
   palabra. El SVG es decorativo: la tarjeta ya se anuncia con su título. */

type L = { es: string; en: string };
const tr = (l: Locale, x: L) => (l === 'en' ? x.en : x.es);

/* Baldosa con la esquina doblada, como la de la referencia. */
function Glyph({ x, y, size, children }: { x: number; y: number; size: number; children?: React.ReactNode }) {
  const c = Math.round(size * 0.26);
  return (
    <g>
      <path className="box" d={`M${x} ${y}h${size}v${size - c}l${-c} ${c}h${-(size - c)}z`} />
      <path className="ink" d={`M${x + size} ${y + size - c}v${c}h${-c}z`} />
      {children}
    </g>
  );
}

function Chevrons({ x, y }: { x: number; y: number }) {
  return (
    <g className="go">
      <path className="acc-line" d={`M${x} ${y}l13 13l-13 13`} />
      <path className="acc-line" d={`M${x + 16} ${y}l13 13l-13 13`} />
    </g>
  );
}

function Check({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle className="acc" cx={x} cy={y} r={11} />
      <path className="w-line" d={`M${x - 5} ${y}l3.5 3.5l6.5 -7`} />
    </g>
  );
}

function Ayax({ l }: { l: Locale }) {
  const items = l === 'en' ? ['General', 'Partner', 'Taxi', 'Event'] : ['General', 'Partner', 'Taxi', 'Evento'];
  return (
    <>
      <Glyph x={56} y={44} size={80}>
        <image href="/assets/logos/ayax.webp" x={70} y={58} width={46} height={46} className="logo" />
      </Glyph>
      <Chevrons x={164} y={71} />
      <rect className="ink" x={222} y={44} width={80} height={80} rx={12} />
      <rect className="paper" x={238} y={64} width={48} height={8} rx={4} />
      <rect className="paper" x={238} y={80} width={48} height={8} rx={4} />
      <rect className="acc" x={238} y={98} width={28} height={12} rx={6} />

      <rect className="soft-box" x={24} y={160} width={318} height={156} rx={14} />
      <circle className="acc" cx={60} cy={210} r={12} />
      <circle className="paper" cx={60} cy={210} r={4.5} />
      <text className="big t-acc" x={86} y={224}>Partner</text>
      <path className="cursor" d="M70 216l0 26l7 -7l5 11l5 -2l-5 -11l10 0z" />
      <rect className="ink" x={86} y={240} width={146} height={28} />
      <text className="caps t-w" x={98} y={259}>{tr(l, { es: 'Seleccionado', en: 'Selected' })}</text>
      <circle className="ring mute" cx={60} cy={290} r={11} />
      <text className="big mute" x={86} y={304}>Taxi</text>

      <rect className="tint" x={362} y={18} width={218} height={46} rx={8} />
      <text className="caps" x={380} y={47}>{tr(l, { es: 'Formularios', en: 'Forms' })}</text>
      <path className="ink" d="M552 36h14l-7 9z" />
      <rect className="tint" x={362} y={72} width={218} height={250} rx={8} />
      {items.map((t, i) => (
        <text key={t} className={i === 1 ? 'mid t-acc strong' : 'mid'} x={380} y={112 + i * 38}>{t}</text>
      ))}
      <path className="hair" d="M380 262h182" />
      <text className="small" x={380} y={290}>{tr(l, { es: 'Confirmación → plazo', en: 'Confirmation → timing' })}</text>
    </>
  );
}

function Hermes({ l }: { l: Locale }) {
  const co = l === 'en' ? 'Insurer' : 'Compañía';
  return (
    <>
      {['A', 'B', 'C'].map((k, i) => (
        <g key={k}>
          <rect className="box" x={30} y={40 + i * 94} width={176} height={64} rx={10} />
          <text className="mid" x={50} y={80 + i * 94}>{co} {k}</text>
          <path className="acc-line" d={`M206 ${72 + i * 94}C268 ${72 + i * 94} 282 169 338 169`} />
        </g>
      ))}
      <rect className="acc" x={338} y={96} width={236} height={146} rx={14} />
      <text className="t-w lead" x={362} y={150}>{tr(l, { es: 'Un núcleo', en: 'One core' })}</text>
      <text className="t-w small" x={362} y={180}>{tr(l, { es: '165 pantallas · 8 áreas', en: '165 screens · 8 areas' })}</text>
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} className={i === 0 ? 'ink' : 'tint'} x={338 + i * 30} y={264} width={22} height={22} rx={5} />
      ))}
    </>
  );
}

function Flesip({ l }: { l: Locale }) {
  const states = l === 'en' ? ['Draft', 'Pending', 'Processed', 'Overdue'] : ['Borrador', 'Pendiente', 'Procesada', 'Vencida'];
  return (
    <>
      <rect className="box" x={44} y={30} width={256} height={340} rx={12} />
      <text className="caps" x={70} y={74}>{tr(l, { es: 'Factura', en: 'Invoice' })}</text>
      <rect className="acc-box" x={184} y={54} width={96} height={28} rx={14} />
      <text className="tiny t-acc strong" x={232} y={73} textAnchor="middle">{states[1]}</text>
      <text className="small mute-2" x={70} y={124}>{tr(l, { es: 'Importe', en: 'Amount' })}</text>
      <rect className="ink" x={70} y={136} width={118} height={16} rx={4} />
      <text className="small mute-2" x={70} y={192}>{tr(l, { es: 'Destinatario', en: 'Recipient' })}</text>
      <rect className="mark" x={66} y={202} width={212} height={32} rx={5} />
      <text className="small" x={78} y={224}>{tr(l, { es: 'lo completa el cliente', en: 'the client fills it in' })}</text>
      <rect className="tint" x={70} y={262} width={204} height={12} rx={6} />
      <rect className="tint" x={70} y={286} width={150} height={12} rx={6} />

      <rect className="tint" x={330} y={30} width={244} height={278} rx={10} />
      <text className="caps" x={352} y={66}>{tr(l, { es: 'Estados', en: 'States' })}</text>
      <rect className="acc-box" x={342} y={130} width={220} height={44} rx={8} />
      {states.map((t, i) => (
        <g key={t}>
          <circle className={i === 1 ? 'acc' : 'ring'} cx={362} cy={104 + i * 48} r={7} />
          <text className={i === 1 ? 'mid t-acc strong' : 'mid'} x={380} y={111 + i * 48}>{t}</text>
        </g>
      ))}
    </>
  );
}

function Montsaint({ l }: { l: Locale }) {
  const win = (x: number, title: string) => (
    <g>
      <rect className="box" x={x} y={22} width={258} height={216} rx={12} />
      <path className="line" d={`M${x} 58h258`} />
      {[0, 1, 2].map((i) => <circle key={i} className="ink" cx={x + 18 + i * 13} cy={40} r={4} />)}
      <text className="caps" x={x + 66} y={45}>{title}</text>
    </g>
  );
  return (
    <>
      {win(30, tr(l, { es: 'Tienda', en: 'Store' }))}
      {['Ocean', 'Radiant', 'Horizon'].map((m, i) => (
        <g key={m}>
          <rect className="tint" x={48} y={72 + i * 40} width={30} height={30} rx={6} />
          <text className="mid" x={90} y={93 + i * 40}>{m}</text>
        </g>
      ))}
      <rect className="acc" x={186} y={196} width={86} height={30} rx={15} />
      <text className="tiny t-w strong" x={229} y={216} textAnchor="middle">{tr(l, { es: 'Comprar', en: 'Buy' })}</text>

      {win(312, tr(l, { es: 'Ópticas', en: 'Opticians' }))}
      <text className="huge" x={330} y={132}>+700</text>
      <text className="small" x={332} y={162}>{tr(l, { es: 'ópticas en la red', en: 'opticians in the network' })}</text>
      <rect className="box thin" x={332} y={194} width={104} height={30} rx={15} />
      <text className="tiny strong" x={384} y={214} textAnchor="middle">{tr(l, { es: 'Contacto', en: 'Contact' })}</text>

      <path className="line" d="M159 238v28M441 238v28" />
      <rect className="tint" x={30} y={266} width={540} height={52} rx={10} />
      <text className="small strong" x={50} y={298}>{tr(l, { es: 'Una colección · 8 modelos', en: 'One collection · 8 models' })}</text>
      <image href="/assets/logos/montsaint.webp" x={420} y={284} width={130} height={14} className="logo" />
    </>
  );
}

function Mercantil({ l }: { l: Locale }) {
  const sev = l === 'en'
    ? [['Critical', 'ink'], ['High', 'acc'], ['Medium', 'tint'], ['Low', 'box thin']]
    : [['Crítica', 'ink'], ['Alta', 'acc'], ['Media', 'tint'], ['Baja', 'box thin']];
  return (
    <>
      <rect className="box" x={36} y={26} width={528} height={300} rx={12} />
      <text className="caps" x={60} y={60}>{tr(l, { es: 'Hallazgo', en: 'Finding' })}</text>
      <text className="caps" x={340} y={60}>{tr(l, { es: 'Severidad', en: 'Severity' })}</text>
      <path className="line" d="M36 78h528" />
      {sev.map(([t, c], i) => {
        const y = 96 + i * 46;
        const dark = c === 'ink' || c === 'acc';
        return (
          <g key={t}>
            <rect className="tint" x={60} y={y + 8} width={[230, 190, 250, 160][i]} height={14} rx={7} />
            <rect className={c} x={340} y={y} width={96} height={30} rx={6} />
            <text className={`tiny strong ${dark ? 't-w' : ''}`} x={388} y={y + 20} textAnchor="middle">{t}</text>
            {i < 3 && <path className="hair" d={`M60 ${y + 40}h480`} />}
          </g>
        );
      })}
      <rect className="ink" x={360} y={282} width={180} height={30} rx={6} />
      <text className="caps t-w" x={450} y={302} textAnchor="middle">{tr(l, { es: '5 de 9 resueltos', en: '5 of 9 fixed' })}</text>
    </>
  );
}

function Suscripcion({ l }: { l: Locale }) {
  const fases = l === 'en' ? ['Qualification', 'Negotiation', 'Closed'] : ['Cualificación', 'Negociación', 'Cerrado'];
  return (
    <>
      <text className="caps" x={24} y={84}>Excel</text>
      <g className="faded">
        <rect className="box" x={24} y={98} width={112} height={140} rx={6} />
        {[126, 154, 182, 210].map((y) => <path key={y} className="hair" d={`M24 ${y}h112`} />)}
        <path className="hair" d="M62 98v140M100 98v140" />
      </g>
      <Chevrons x={150} y={155} />
      {fases.map((f, i) => {
        const x = 196 + i * 134;
        const cls = i === 0 ? 'ink' : i === 1 ? 'acc-box' : 'box';
        const tcls = i === 0 ? 't-w' : i === 1 ? 't-acc strong' : 'mute-2';
        return (
          <g key={f}>
            <text className="caps mute-2" x={x + 58} y={118} textAnchor="middle">{tr(l, { es: 'Fase', en: 'Phase' })} {i + 1}</text>
            <rect className={cls} x={x} y={136} width={116} height={56} rx={10} />
            <text className={`tiny ${tcls}`} x={x + 58} y={169} textAnchor="middle">{f}</text>
            {i < 2 && <path className="acc-line" d={`M${x + 116} 164h18`} />}
          </g>
        );
      })}
      <path className="line" d="M388 192v24" />
      <rect className="tint" x={310} y={216} width={156} height={56} rx={8} />
      <text className="small mute-2" x={326} y={239}>{tr(l, { es: 'salida:', en: 'exit:' })}</text>
      <text className="small" x={326} y={261}>{tr(l, { es: 'propuesta firmada', en: 'signed proposal' })}</text>
      <rect className="mark" x={24} y={266} width={166} height={36} rx={18} />
      <text className="small strong" x={107} y={290} textAnchor="middle">{tr(l, { es: '13 → 5 semanas', en: '13 → 5 weeks' })}</text>
    </>
  );
}

function Editor({ l }: { l: Locale }) {
  return (
    <>
      <rect className="box" x={36} y={22} width={366} height={340} rx={12} />
      <text className="caps" x={62} y={62}>{tr(l, { es: 'Propuesta', en: 'Proposal' })}</text>
      <rect className="tint" x={62} y={84} width={120} height={14} rx={7} />
      <rect className="ink" x={190} y={78} width={118} height={26} rx={6} />
      <text className="mono tiny t-w" x={200} y={96}>@variable</text>
      <rect className="tint" x={62} y={118} width={300} height={14} rx={7} />
      <rect className="tint" x={62} y={150} width={80} height={14} rx={7} />
      <rect className="acc" x={150} y={144} width={136} height={26} rx={6} />
      <text className="mono tiny t-w" x={160} y={162}>{tr(l, { es: '/componente', en: '/component' })}</text>
      <rect className="dashed" x={62} y={190} width={314} height={70} rx={8} />
      <text className="caps" x={80} y={216}>{tr(l, { es: 'Cláusula opcional', en: 'Optional clause' })}</text>
      <rect className="tint" x={80} y={232} width={220} height={10} rx={5} />
      <rect className="acc" x={326} y={204} width={36} height={20} rx={10} />
      <circle className="paper" cx={352} cy={214} r={7} />
      <rect className="tint" x={62} y={280} width={280} height={14} rx={7} />
      <rect className="tint" x={62} y={306} width={200} height={14} rx={7} />

      <path className="acc-line dash" d="M366 125H424" />
      <rect className="tint" x={424} y={78} width={152} height={112} rx={12} />
      <circle className="acc" cx={448} cy={104} r={12} />
      <rect className="paper" x={468} y={98} width={84} height={12} rx={6} />
      <text className="tiny" x={442} y={146}>{tr(l, { es: 'sobre el párrafo,', en: 'on the paragraph,' })}</text>
      <text className="tiny" x={442} y={168}>{tr(l, { es: 'no en un correo', en: 'not in an email' })}</text>
    </>
  );
}

function Vista360({ l }: { l: Locale }) {
  const finalists = [1, 4, 10, 7];
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const x = 28 + (i % 4) * 62, y = 52 + Math.floor(i / 4) * 52;
        const cls = i === 7 ? 'acc' : finalists.includes(i) ? 'acc-box' : 'tint';
        return <rect key={i} className={cls} x={x} y={y} width={52} height={40} rx={6} />;
      })}
      <text className="lead" x={28} y={244}>12 → 4 → 1</text>
      <text className="small mute-2" x={28} y={274}>{tr(l, { es: 'composiciones', en: 'compositions' })}</text>
      <Chevrons x={286} y={130} />
      <rect className="box" x={334} y={34} width={240} height={270} rx={12} />
      <circle className="ring-ink" cx={372} cy={82} r={20} />
      <rect className="ink" x={402} y={70} width={112} height={14} rx={7} />
      <rect className="tint" x={402} y={92} width={78} height={10} rx={5} />
      <rect className="ink" x={354} y={122} width={112} height={28} rx={14} />
      <text className="tiny t-w strong" x={410} y={141} textAnchor="middle">{tr(l, { es: 'riesgo alto', en: 'high risk' })}</text>
      <text className="caps" x={354} y={188}>{tr(l, { es: 'Pólizas', en: 'Policies' })}</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect className="tint" x={354} y={204 + i * 28} width={[150, 120, 136][i]} height={12} rx={6} />
          <rect className="ink" x={520} y={204 + i * 28} width={34} height={12} rx={6} />
        </g>
      ))}
    </>
  );
}

function DesignSystem() {
  const rows: [string, string, string, string | null][] = [
    ['button.bg', '#2f5bea', 'action', '#2f5bea'],
    ['button.text', '#ffffff', 'action-ink', '#ffffff'],
    ['card.bg', '#f6f7fb', 'surface', '#f6f7fb'],
    ['card.radius', '10', 'radius.md', null],
  ];
  return (
    <>
      <rect className="tint" x={36} y={26} width={156} height={36} rx={6} />
      <text className="mono tiny" x={50} y={50}>tokens.json</text>
      <text className="lead" x={564} y={56} textAnchor="end">267 → 24</text>
      {rows.map(([use, before, after, sw], i) => {
        const y = 92 + i * 58;
        return (
          <g key={use}>
            <text className="mono tiny" x={36} y={y + 26}>{use}</text>
            <rect className="tint" x={168} y={y} width={104} height={40} rx={6} />
            <text className="mono tiny mute-2 strike" x={182} y={y + 26}>{before}</text>
            <path className="acc-line go" d={`M284 ${y + 20}h30m-9 -8l9 8l-9 8`} />
            <rect className="acc-box" x={330} y={y} width={234} height={40} rx={6} />
            {sw && <rect x={346} y={y + 12} width={16} height={16} rx={4} className="swatch" style={{ fill: sw }} />}
            <text className="mono tiny t-acc strong" x={sw ? 372 : 346} y={y + 26}>{after}</text>
          </g>
        );
      })}
    </>
  );
}

function Pidemony({ l }: { l: Locale }) {
  return (
    <>
      <rect className="box" x={40} y={20} width={180} height={344} rx={30} />
      <rect className="ink" x={106} y={34} width={48} height={10} rx={5} />
      <image href="/assets/logos/mony-wordmark.webp" x={62} y={58} width={74} height={23} className="logo" preserveAspectRatio="xMinYMid meet" />
      {[0, 1, 2, 3].map((i) => <rect key={i} className={i < 2 ? 'acc' : 'tint'} x={62 + i * 36} y={100} width={30} height={6} rx={3} />)}
      <text className="caps" x={62} y={130}>{tr(l, { es: 'Paso 2 de 4', en: 'Step 2 of 4' })}</text>
      <rect className="tint" x={62} y={146} width={136} height={30} rx={6} />
      <rect className="tint" x={62} y={186} width={136} height={30} rx={6} />
      <rect className="acc" x={62} y={236} width={136} height={38} rx={19} />
      <text className="tiny t-w strong" x={130} y={260} textAnchor="middle">Pide tu Mony</text>

      <path className="acc-line dash" d="M220 172h22M358 172h22" />
      <rect className="mark" x={252} y={114} width={96} height={26} rx={5} />
      <text className="tiny strong" x={300} y={132} textAnchor="middle">{tr(l, { es: 'caduca', en: 'expires' })}</text>
      <rect className="acc-box" x={242} y={152} width={116} height={40} rx={20} />
      <path className="acc-line thin" d="M264 168a6 6 0 0 1 8.5 0l2 2a6 6 0 0 1 0 8.5M276.5 176a6 6 0 0 1 -8.5 0l-2 -2a6 6 0 0 1 0 -8.5" />
      <text className="small t-acc strong" x={288} y={178}>{tr(l, { es: 'enlace', en: 'link' })}</text>

      <rect className="box" x={380} y={40} width={194} height={262} rx={12} />
      <path className="line" d="M380 72h194" />
      {[0, 1, 2].map((i) => <circle key={i} className="ink" cx={398 + i * 13} cy={56} r={4} />)}
      <text className="caps" x={398} y={102}>{tr(l, { es: 'Pago', en: 'Payment' })}</text>
      <rect className="tint" x={398} y={116} width={158} height={34} rx={6} />
      <rect className="line thin-line" x={410} y={126} width={22} height={14} rx={3} />
      <rect className="paper" x={442} y={128} width={88} height={10} rx={5} />
      <rect className="tint" x={398} y={160} width={158} height={34} rx={6} />
      <rect className="ink" x={398} y={244} width={158} height={38} rx={19} />
      <text className="tiny t-w strong" x={477} y={268} textAnchor="middle">{tr(l, { es: 'Pagar', en: 'Pay' })}</text>
    </>
  );
}

function EstaWeb({ l }: { l: Locale }) {
  const lines: [string, number, boolean][] = [
    [':root {', 58, false], ['--ink: #121317;', 84, false], ['--focus: #4a44f2;', 84, true],
    ['--accent: #8bde5f;', 84, false], ['--r-card: 16px;', 84, false], ['}', 58, false],
  ];
  const checks = l === 'en' ? ['100+ tests', 'axe A/AA: 0', 'LCP 0.91 s'] : ['100+ tests', 'axe A/AA: 0', 'LCP 0,91 s'];
  return (
    <>
      <rect className="tint" x={34} y={26} width={384} height={250} rx={10} />
      {lines.map(([t, x, hi], i) => (
        <g key={t}>
          {hi && <rect className="mark" x={x - 8} y={52 + i * 36} width={222} height={30} rx={3} />}
          <text className="mono code" x={x} y={73 + i * 36}>{t}</text>
        </g>
      ))}
      {checks.map((t, i) => (
        <g key={t}>
          <Check x={452} y={62 + i * 46} />
          <text className="small" x={472} y={68 + i * 46}>{t}</text>
        </g>
      ))}
      <text className="mono tiny mute-2" x={34} y={312}>{tr(l, { es: 'spec → plan → código → revisión', en: 'spec → plan → code → review' })}</text>
    </>
  );
}

function Taksio({ l }: { l: Locale }) {
  const phone = (x: number, label: string, route: string) => (
    <g>
      <rect className="box" x={x} y={26} width={126} height={300} rx={22} />
      <text className="caps" x={x + 16} y={62}>{label}</text>
      <rect className="tint" x={x + 14} y={76} width={98} height={158} rx={8} />
      <path className="acc-line" d={route} />
      <rect className="acc" x={x + 14} y={250} width={98} height={30} rx={15} />
      <rect className="paper" x={x + 42} y={261} width={42} height={8} rx={4} />
    </g>
  );
  return (
    <>
      <rect className="tint" x={26} y={48} width={200} height={242} rx={10} />
      <text className="caps" x={44} y={80}>Design system</text>
      <rect className="acc" x={44} y={98} width={112} height={30} rx={15} />
      <rect className="box thin" x={44} y={142} width={164} height={30} rx={6} />
      <rect className="box thin" x={44} y={188} width={62} height={24} rx={12} />
      <rect className="box thin" x={114} y={188} width={62} height={24} rx={12} />
      {['ink', 'acc', 'mark', 'box thin'].map((c, i) => <rect key={c} className={c} x={44 + i * 32} y={234} width={22} height={22} rx={5} />)}
      <Chevrons x={238} y={156} />
      {phone(290, tr(l, { es: 'Conductor', en: 'Driver' }), 'M318 214c20 -10 6 -40 30 -52s30 -26 26 -56')}
      {phone(446, tr(l, { es: 'Pasajero', en: 'Passenger' }), 'M474 110c26 12 4 44 34 56s22 34 40 46')}
    </>
  );
}

const PLATES: Record<string, (p: { l: Locale }) => React.ReactNode> = {
  ayax: Ayax, hermes: Hermes, flesip: Flesip, montsaint: Montsaint, mercantil: Mercantil,
  suscripcion: Suscripcion, 'editor-propuesta': Editor, 'vista-360': Vista360,
  'design-system': DesignSystem, pidemony: Pidemony, 'esta-web': EstaWeb, taksio: Taksio,
};

export const hasLamina = (slug: string) => slug in PLATES;

export default function Lamina({ slug, locale }: { slug: string; locale: Locale }) {
  const Plate = PLATES[slug];
  if (!Plate) return null;
  return (
    <div className={s.plate} data-testid="lamina">
      <svg viewBox="0 0 600 338" aria-hidden="true" focusable="false" className={s.svg}>
        <Plate l={locale} />
      </svg>
    </div>
  );
}
