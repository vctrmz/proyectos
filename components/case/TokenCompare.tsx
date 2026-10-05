import type { TokenCompare as Datos } from '@/lib/content/cases/types';
import s from './TokenCompare.module.css';

/* Los mismos valores nombrados de dos formas. Por apariencia, cada fila deja
   una pregunta abierta; por intención, el nombre la responde y el valor queda
   como equivalencia. Se leen las tres capas de un sistema de tokens: la
   propiedad del componente, el token semántico y el valor primitivo.

   Cada tarjeta es una tabla de verdad —propiedad, token y nota— para que un
   lector de pantalla la recorra por filas igual que se ve. */
export default function TokenCompare({ t }: { t: Datos }) {
  const Muestra = ({ hex }: { hex?: string }) =>
    hex ? <i className={s.swatch} style={{ background: hex }} aria-hidden="true" /> : <i className={s.noSwatch} aria-hidden="true" />;
  return (
    <figure className={s.wrap}>
      <h3 className={s.title}>{t.title}</h3>
      <p className={s.lead}>{t.lead}</p>
      <div className={s.cards}>
        <div className={s.card}><table>
          <caption><span>Por apariencia</span><code>tokens.json</code></caption>
          <thead className="visually-hidden"><tr><th scope="col">Propiedad</th><th scope="col">Valor</th><th scope="col">Lo que no dice</th></tr></thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.use}>
                <th scope="row">{r.use}</th>
                <td className={s.value}><span className={s.tok}><Muestra hex={r.swatch} />{r.before}</span></td>
                <td className={s.question}>{r.question}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <div className={s.card}><table>
          <caption><span>Por intención</span><code>tokens.json</code></caption>
          <thead className="visually-hidden"><tr><th scope="col">Propiedad</th><th scope="col">Token</th><th scope="col">Equivale a</th></tr></thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.use}>
                <th scope="row">{r.use}</th>
                <td className={`${s.value} ${s.intent}`}><span className={s.tok}><Muestra hex={r.swatch} />{r.after}</span></td>
                <td className={s.equals}><span aria-hidden="true">= </span><span className="visually-hidden">equivale a </span>{r.before}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
      {t.note && <figcaption className={s.note}>{t.note}</figcaption>}
    </figure>
  );
}
