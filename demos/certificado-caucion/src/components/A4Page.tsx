import type { ReactNode } from 'react';
import { TENANT } from '../domain/tenant';
import type { Locale, PolicyData, RegionId, TemplateLocaleContent } from '../domain/types';
import { RenderInline } from './RenderDoc';

interface Props {
  content: TemplateLocaleContent;
  locale: Locale;
  data: PolicyData;
  /** El cuerpo: el editor en el paso, el render resuelto en la vista previa. */
  children: ReactNode;
  /** true en la vista previa: las variables de las regiones fijas se resuelven. */
  resolve?: boolean;
  anatomy?: boolean;
}

const REGION_LABEL: Record<RegionId, string> = {
  header: 'Cabecera · fija',
  preamble: 'Apoderamiento · fijo',
  body: 'Cuerpo · editable',
  signature: 'Firma · fija',
  footer: 'Pie y logotipo · fijos',
};

function Region({ id, editable, anatomy, children }: { id: RegionId; editable?: boolean; anatomy?: boolean; children: ReactNode }) {
  return (
    <section
      className={`region region--${id}`}
      data-region={id}
      data-editable={editable ? 'true' : 'false'}
      data-label={anatomy ? REGION_LABEL[id] : undefined}
      aria-label={REGION_LABEL[id]}
    >
      {!editable && !anatomy && (
        <span className="region__lock" title="Región fija: viene de la plantilla aprobada">
          <i className="ri-lock-2-line" aria-hidden="true" />
        </span>
      )}
      {children}
    </section>
  );
}

/* La anatomía del Figma («Anatomy»): cinco regiones sobre un A4, y solo el
   cuerpo es editable. Las regiones fijas no están dentro del editor, así que
   no hay forma de editarlas: la restricción es estructural, no un permiso. */
export function A4Page({ content, locale, data, children, resolve = false, anatomy = false }: Props) {
  const inline = (text: string) => <RenderInline text={text} data={data} locale={locale} resolve={resolve} />;
  return (
    <article className={`a4${anatomy ? ' a4--anatomy' : ''}`} lang={locale}>
      <Region id="header" anatomy={anatomy}>
        <h2 className="a4__title">{inline(content.title)}</h2>
      </Region>
      <Region id="preamble" anatomy={anatomy}>
        <p>{content.preamble}</p>
        <p className="a4__insures">{content.insures}</p>
      </Region>
      <Region id="body" editable anatomy={anatomy}>
        {children}
      </Region>
      <Region id="signature" anatomy={anatomy}>
        <p>{inline(content.signature)}</p>
      </Region>
      <Region id="footer" anatomy={anatomy}>
        <div className="a4__band">
          <span className="a4__logo" aria-hidden="true">S</span>
          <span className="a4__brand">{TENANT.name}</span>
        </div>
        <p className="a4__legal">{content.footer}</p>
      </Region>
    </article>
  );
}
