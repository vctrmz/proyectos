'use client';
import { motion } from 'motion/react';
import type { UiKitKind, UiKitPiece } from '@/lib/content/cases/types';
import s from './uikit.module.css';

/* El kit del sistema en formato bento. Cada caso declara sus propias piezas
   —solo las que existen en ese producto— y la maqueta se dibuja con el color
   de marca del caso. Las maquetas son decorativas; lo que se lee es el título
   y para qué sirve la pieza. */

type Props = { brand: string; pieces: UiKitPiece[]; label?: string };

const V = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

function Mock({ kind, brand, label, labels, swatches }: { kind: UiKitKind; brand: string; label?: string; labels?: string[]; swatches?: string[] }) {
  const L = (fallback: string[]) => (labels && labels.length ? labels : fallback);
  switch (kind) {
    case 'actions': return (
      <>
        <span className={s.btnSolid} style={{ background: brand }}>{label ?? 'Confirmar'}</span>
        <span className={s.btnOutline}>{labels?.[0] ?? 'Guardar borrador'}</span>
        <span className={s.btnGhost}>{labels?.[1] ?? 'Cancelar'}</span>
      </>
    );
    case 'states': return (
      <>
        {L(['Pendiente', 'En curso', 'Aprobado', 'Bloqueado']).slice(0, 4).map((t, i) => (
          <span key={t} className={`${s.chip} ${[s.cPend, s.cCurso, s.cOk, s.cBad][i]}`}>{t}</span>
        ))}
      </>
    );
    case 'table': return (
      <>
        <span className={s.row}><i /><i className={s.w40} /><span className={`${s.chip} ${s.cOk} ${s.tiny}`}>OK</span></span>
        <span className={s.row}><i /><i className={s.w60} /><span className={`${s.chip} ${s.cCurso} ${s.tiny}`}>···</span></span>
        <span className={s.row}><i /><i className={s.w30} /><span className={`${s.chip} ${s.cBad} ${s.tiny}`}>!</span></span>
        <span className={s.row}><i /><i className={s.w50} /><span className={`${s.chip} ${s.cPend} ${s.tiny}`}>—</span></span>
      </>
    );
    case 'form': return (
      <>
        <span className={s.field}><i className={s.label} /><i className={s.input} /></span>
        <span className={s.field}><i className={s.label} /><i className={s.input} /></span>
        <span className={`${s.field} ${s.cond}`}><i className={s.label} /><i className={s.input} /><em>{label ?? 'condicionado por regla'}</em></span>
      </>
    );
    case 'phases': return (
      <>
        <span className={s.steps}>
          <i className={s.done} style={{ background: brand }} /><b />
          <i className={s.done} style={{ background: brand }} /><b />
          <i className={s.now} style={{ borderColor: brand }} /><b className={s.rest} />
          <i />
        </span>
        <span className={s.hint}>{label ?? 'Fase 2 de 3 · salida: propuesta firmada'}</span>
      </>
    );
    case 'tokens': return (
      <>
        {L(['brand', 'action', 'success', 'warning', 'danger', 'surface']).slice(0, 6).map((role, i) => {
          const hex = swatches?.[i] ?? [brand, '#2f5bea', '#1f9d55', '#d97706', '#c0392b', '#f6f7fb'][i];
          // Un color casi blanco necesita borde para verse sobre la tarjeta.
          const claro = swatches ? /^#(f|e)/i.test(hex) : i === 5;
          return <span key={role} className={s.token}><i style={{ background: hex, borderColor: claro ? '#e3e6ef' : hex }} />{role}</span>;
        })}
      </>
    );
    case 'slots': return (
      <>
        <span className={s.doc}>
          <i className={s.w60} />
          <span className={s.varPill} style={{ background: '#121317' }}>@tomador</span>
          <i className={s.w30} />
          <span className={s.varPill} style={{ background: 'var(--focus)' }}>/tabla-primas</span>
        </span>
        <span className={s.optional}>cláusula opcional · se activa</span>
        <span className={s.locked}>bloque bloqueado</span>
      </>
    );
    case 'thread': return (
      <>
        <span className={s.msg}><i className={s.avatar} style={{ background: brand }} /><span><i className={s.w60} /><i className={s.w40} /></span></span>
        <span className={`${s.msg} ${s.reply}`}><i className={s.avatar} /><span><i className={s.w50} /></span></span>
        <span className={s.hint}>{label ?? 'trazado sobre el párrafo, no en un correo aparte'}</span>
      </>
    );
    case 'identity': return (
      <>
        <span className={s.ident}><i className={s.avatar} style={{ background: brand }} /><span><i className={s.w60} /><i className={s.w30} /></span><span className={`${s.chip} ${s.cBad} ${s.tiny}`}>{label ?? 'riesgo alto'}</span></span>
        <span className={s.figs}><b>12</b><small>pólizas</small><b>3</b><small>recibos</small><b>1</b><small>siniestro</small></span>
      </>
    );
    case 'brands': return (
      <>
        {[brand, '#2f5bea', '#1f9d55', '#d97706'].map((hex) => (
          <span key={hex} className={s.brandCard}><i style={{ background: hex }} /><i className={s.w60} /></span>
        ))}
      </>
    );
    case 'scale': return (
      <>
        {[6, 10, 16, 999].map((r, i) => (
          <span key={r} className={s.radius} style={{ borderRadius: r }}>{['sm', 'md', 'lg', 'pill'][i]}</span>
        ))}
      </>
    );
    case 'product': return (
      <>
        {L(['Ocean', 'Radiant', 'Horizon']).slice(0, 3).map((t) => (
          <span key={t} className={s.prod}><i /><b>{t}</b><em>{label ?? 'Ver más'}</em></span>
        ))}
      </>
    );
    case 'trust': return (
      <>
        {L(['Envío gratis', '14 días', 'Pago seguro', 'WhatsApp']).slice(0, 4).map((t) => (
          <span key={t} className={s.trust}><i style={{ background: brand }} />{t}</span>
        ))}
      </>
    );
    case 'tiers': return (
      <>
        <span className={s.tierHead}>{L(['Standard', 'Advanced', 'Ultimate']).slice(0, 3).map((t, i) => (
          <b key={t} className={i === 1 ? s.tierOn : undefined} style={i === 1 ? { background: brand } : undefined}>{t}</b>
        ))}</span>
        <span className={s.tierRow}><i className={s.w40} /><em>{label ?? 'Incluido'}</em></span>
        <span className={s.tierRow}><i className={s.w60} /><em className={s.tierOpt}>Opcional</em></span>
      </>
    );
    case 'agenda': return (
      <>
        <span className={s.meet}><i className={s.w40} /><span className={s.who}><i style={{ background: brand }} /><i /><i /></span></span>
        <span className={s.meet}><i className={s.w60} /><span className={s.who}><i style={{ background: brand }} /><i /></span></span>
        <span className={s.hint}>{label ?? 'el tipo de reunión sugiere quién asiste'}</span>
      </>
    );
  }
}

export default function UiKit({ brand, pieces, label = 'Kit del sistema' }: Props) {
  if (!pieces.length) return null;
  return (
    <motion.ul className={s.grid} aria-label={label} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ staggerChildren: 0.07 }}>
      {pieces.map((p) => (
        <motion.li key={p.title} className={`${s.card} ${p.wide ? s.wide : ''}`} variants={V}>
          <div data-mock aria-hidden="true" className={s.mock}><Mock kind={p.kind} brand={brand} label={p.label} labels={p.labels} swatches={p.swatches} /></div>
          <h4>{p.title}</h4>
          <p>{p.body}</p>
        </motion.li>
      ))}
    </motion.ul>
  );
}
