import { TENANT } from '../tenant';
import type { CertificateTemplate, Locale, TemplateId, TemplateLocaleContent } from '../types';

/* Las cuatro plantillas del ticket APRD-513. Las regiones fijas (cabecera,
   apoderamiento, firma y pie) son comunes; cada modelo cambia el cuerpo.
   El texto legal se ha resumido y anonimizado a partir de los modelos de
   Figma: aseguradora, apoderado y datos registrales son de ejemplo. */

type Fixed = Omit<TemplateLocaleContent, 'body'>;

const FIXED: Record<Locale, Fixed> = {
  es: {
    title: 'CERTIFICADO DE SEGURO DE CAUCIÓN Nº {{certificado.numero}}',
    preamble: `${TENANT.insurer}, con C.I.F. A-00000001 y en adelante, EL ASEGURADOR, debidamente representada por su apoderado con poderes suficientes para obligarle en este acto, según resulta de la verificación de la representación que consta en la parte inferior de este documento, y con domicilio a efectos de notificaciones en Paseo Ejemplo 10, 28001 Madrid, correo electrónico caucion@example.com, a la atención de ${TENANT.legalName}, quien actúa en nombre y por cuenta de ${TENANT.insurer},`,
    insures: 'ASEGURA',
    signature: `${TENANT.legalName} actuando en nombre y por cuenta del Asegurador. En {{certificado.lugar}}, a {{certificado.fecha}}.`,
    footer: `${TENANT.legalName}, agencia de suscripción autorizada por la DGSFP. Datos registrales de ejemplo. Domicilio social en Paseo Ejemplo 10, 28001 Madrid.`,
  },
  en: {
    title: 'SURETY INSURANCE CERTIFICATE No. {{certificado.numero}}',
    preamble: `${TENANT.insurer}, with Tax ID A-00000001, hereinafter THE INSURER, duly represented by its attorney-in-fact with sufficient powers to bind it in this act, as evidenced by the verification of representation at the bottom of this document, and with address for notices at Paseo Ejemplo 10, 28001 Madrid, email caucion@example.com, for the attention of ${TENANT.legalName}, acting in the name and on behalf of ${TENANT.insurer},`,
    insures: 'INSURES',
    signature: `${TENANT.legalName}, acting in the name and on behalf of the Insurer. In {{certificado.lugar}}, on {{certificado.fecha}}.`,
    footer: `${TENANT.legalName}, underwriting agency authorised by the DGSFP. Sample registry data. Registered office at Paseo Ejemplo 10, 28001 Madrid.`,
  },
};

const withFixed = (es: string, en: string) => ({ es: { ...FIXED.es, body: es }, en: { ...FIXED.en, body: en } });

export const TEMPLATES: CertificateTemplate[] = [
  {
    id: 'abogacia',
    code: 'File.2A',
    name: { es: 'Certificado Abogacía del Estado', en: 'State Attorney certificate' },
    summary: { es: 'Contratos del Sector Público (LCSP)', en: 'Public Sector Contracts Act (LCSP)' },
    content: withFixed(
      `A **{{tomador.nombre}}** con CIF {{tomador.cif}}, en concepto de tomador del seguro, ante **{{beneficiario.nombre}}** con CIF {{beneficiario.cif}} (en adelante el Asegurado), hasta el importe de **{{poliza.suma_texto}} ({{poliza.suma}})**, en los términos y condiciones establecidos en la Ley 9/2017, de 8 de noviembre, de Contratos del Sector Público, su normativa de desarrollo y el pliego de cláusulas administrativas particulares por el que se rige el contrato **{{poliza.contrato}}**, Nº de expediente {{poliza.expediente}}, en concepto de garantía **{{poliza.concepto}}**, para responder de las obligaciones, penalidades y demás gastos que se puedan derivar frente al asegurado.

La falta de pago de la prima, sea única, primera o siguientes, no dará derecho al asegurador a resolver el contrato, ni éste quedará extinguido, ni la cobertura del asegurador suspendida, ni éste liberado de su obligación, caso de que el asegurador deba hacer efectiva la garantía.

El asegurador no podrá oponer al asegurado las excepciones que puedan corresponderle contra el tomador del seguro, y asume el compromiso de indemnizar al asegurado al primer requerimiento de la Caja General de Depósitos.

El presente Seguro de Caución estará en vigor hasta que {{beneficiario.nombre}}, o quien en su nombre sea habilitado legalmente para ello, autorice su cancelación o devolución.`,
      `To **{{tomador.nombre}}**, Tax ID {{tomador.cif}}, as policyholder, before **{{beneficiario.nombre}}**, Tax ID {{beneficiario.cif}} (hereinafter the Insured), up to the amount of **{{poliza.suma_texto}} ({{poliza.suma}})**, under the terms and conditions of Law 9/2017 of 8 November on Public Sector Contracts, its implementing regulations and the specific administrative clauses governing the contract **{{poliza.contrato}}**, file no. {{poliza.expediente}}, as a **{{poliza.concepto}}** guarantee, to cover the obligations, penalties and other expenses that may arise towards the insured.

Non-payment of the premium, whether single, first or subsequent, shall not entitle the insurer to terminate the contract, nor shall the contract be extinguished, the insurer's cover suspended or the insurer released from its obligation, should the insurer be required to honour the guarantee.

The insurer may not raise against the insured any defences it may have against the policyholder, and undertakes to indemnify the insured on first demand by the General Deposit Fund (Caja General de Depósitos).

This Surety Insurance shall remain in force until {{beneficiario.nombre}}, or whoever is legally empowered on its behalf, authorises its cancellation or return.`,
    ),
  },
  {
    id: 'privado',
    code: 'File.2B',
    name: { es: 'Certificado Privado', en: 'Private certificate' },
    summary: { es: 'Garantía contractual entre privados', en: 'Contractual guarantee between private parties' },
    content: withFixed(
      `A **{{tomador.nombre}}**, CIF {{tomador.cif}}, con domicilio a efecto de notificaciones en {{tomador.domicilio}}, en concepto de TOMADOR del Seguro, ante **{{beneficiario.nombre}}**, CIF {{beneficiario.cif}}, en adelante BENEFICIARIO, hasta el importe máximo de **{{poliza.suma_texto}} ({{poliza.suma}})**, en concepto de garantía **{{poliza.concepto}}** para responder de sus obligaciones contractuales reguladas en el **ACUERDO DE {{poliza.acuerdo}}** referido al **CONTRATO PARA EL PROYECTO {{poliza.contrato}}**, suscrito entre el Tomador y el Beneficiario con fecha {{poliza.fecha_contrato}}.

El ASEGURADOR pagará al BENEFICIARIO, a primer requerimiento, cualquier cantidad que éste reclame de manera fehaciente (la «Reclamación») hasta el límite de **{{poliza.suma_texto}} ({{poliza.suma}})**. La presente Garantía podrá ejecutarse total o parcialmente, hasta alcanzar el Importe Máximo.

El pago se realizará en la cuenta bancaria especificada por el BENEFICIARIO dentro de los **quince (15) días hábiles** siguientes a la recepción de la Reclamación.

Esta garantía se otorga exclusivamente a favor del Beneficiario y no puede ser cedida ni transferida a un tercero sin el consentimiento previo y expreso del ASEGURADOR.

Este Seguro de Caución tendrá vigencia hasta el día **{{poliza.fecha_vencimiento}}** («Fecha de Vencimiento»), fecha a partir de la cual expirará, haya sido o no devuelto al Asegurador. Esta garantía se regirá por las leyes de España y estará sujeta a la jurisdicción de los tribunales de Madrid.`,
      `To **{{tomador.nombre}}**, Tax ID {{tomador.cif}}, with address for notices at {{tomador.domicilio}}, as POLICYHOLDER, before **{{beneficiario.nombre}}**, Tax ID {{beneficiario.cif}}, hereinafter the BENEFICIARY, up to a maximum amount of **{{poliza.suma_texto}} ({{poliza.suma}})**, as a **{{poliza.concepto}}** guarantee to cover its contractual obligations under the **{{poliza.acuerdo}} AGREEMENT** relating to the **CONTRACT FOR THE {{poliza.contrato}} PROJECT**, entered into by the Policyholder and the Beneficiary on {{poliza.fecha_contrato}}.

The INSURER shall pay the BENEFICIARY, on first demand, any amount it reliably claims (the "Claim") up to the limit of **{{poliza.suma_texto}} ({{poliza.suma}})**. This Guarantee may be called in whole or in part, up to the Maximum Amount.

Payment shall be made to the bank account specified by the BENEFICIARY within **fifteen (15) business days** of receipt of the Claim.

This guarantee is granted exclusively in favour of the Beneficiary and may not be assigned or transferred to a third party without the prior express consent of the INSURER.

This Surety Insurance shall remain valid until **{{poliza.fecha_vencimiento}}** (the "Expiry Date"), after which it shall expire whether or not it has been returned to the Insurer. This guarantee shall be governed by the laws of Spain and subject to the jurisdiction of the courts of Madrid.`,
    ),
  },
  {
    id: 'almacenamiento',
    code: 'File.2C',
    name: { es: 'Certificado Almacenamiento', en: 'Storage certificate' },
    summary: { es: 'Acceso y conexión a la red eléctrica (RD 1183/2020)', en: 'Grid access and connection (RD 1183/2020)' },
    content: withFixed(
      `**{{tomador.nombre}}**, con NIF {{tomador.cif}}, en concepto de Tomador del Seguro, ante **{{beneficiario.nombre}}** con CIF {{beneficiario.cif}}, en adelante, Asegurado, hasta el importe de **{{poliza.suma_texto}} ({{poliza.suma}})**, en los términos establecidos en el artículo 23 bis del Real Decreto 1183/2020, de 29 de diciembre, de acceso y conexión a las redes de transporte y distribución de energía eléctrica.

En concepto de GARANTÍA para responder ante el asegurado del desistimiento por parte del tomador de la construcción de la instalación, de la caducidad de los procedimientos de autorización administrativa o del incumplimiento de los plazos, hasta obtener la autorización de explotación definitiva de la instalación **{{riesgo.instalacion}}** de **{{riesgo.capacidad_mw}} MW** de capacidad de acceso, sita en el término municipal de {{riesgo.municipio}}, provincia de {{riesgo.provincia}}, para la subestación **{{riesgo.subestacion}}**.

Este seguro de caución se otorga solidariamente respecto al obligado principal, con renuncia expresa a los beneficios de excusión y división. El Asegurador asume el compromiso de indemnizar al Asegurado al primer requerimiento de la Caja General de Depósitos.

El presente seguro de caución estará en vigor hasta que {{beneficiario.nombre}}, o quien en su nombre sea habilitado legalmente para ello, autorice su cancelación o devolución.`,
      `**{{tomador.nombre}}**, Tax ID {{tomador.cif}}, as Policyholder, before **{{beneficiario.nombre}}**, Tax ID {{beneficiario.cif}}, hereinafter the Insured, up to the amount of **{{poliza.suma_texto}} ({{poliza.suma}})**, under the terms of article 23 bis of Royal Decree 1183/2020 of 29 December on access and connection to electricity transmission and distribution networks.

As a GUARANTEE to answer to the insured for the policyholder's withdrawal from building the facility, the lapse of the administrative authorisation procedures or failure to meet deadlines, until final operating authorisation is obtained for the facility **{{riesgo.instalacion}}** with **{{riesgo.capacidad_mw}} MW** of access capacity, located in the municipality of {{riesgo.municipio}}, province of {{riesgo.provincia}}, for the **{{riesgo.subestacion}}** substation.

This surety insurance is granted jointly and severally with the principal obligor, with express waiver of the benefits of excussion and division. The Insurer undertakes to indemnify the Insured on first demand by the General Deposit Fund.

This surety insurance shall remain in force until {{beneficiario.nombre}}, or whoever is legally empowered on its behalf, authorises its cancellation or return.`,
    ),
  },
  {
    id: 'publico-tasas',
    code: 'File.2D',
    name: { es: 'Certificado Público con Fecha – Tasas Aeroportuarias', en: 'Public certificate with date – Airport charges' },
    summary: { es: 'Tasas aeroportuarias ante Aena (Ley 21/2003)', en: 'Airport charges before Aena (Law 21/2003)' },
    content: withFixed(
      `Con carácter solidario e irrevocable, a **{{tomador.nombre}}**, con CIF {{tomador.cif}}, ante **{{beneficiario.nombre}}**, por la cantidad de **{{poliza.suma_texto}} ({{poliza.suma}})** para garantizar el pago de las tasas y prestaciones patrimoniales de carácter público de las que la citada compañía se hiciera deudora por la utilización de los aeropuertos españoles, y en especial según lo dispuesto en el art. 68.2 de la Ley 21/2003.

El presente seguro será ejecutable por {{beneficiario.nombre}} a la primera demanda realizada, bastando para ello el simple requerimiento a la Entidad aseguradora, dándole cuenta del incumplimiento de pago en que haya incurrido la Empresa asegurada.

Asimismo, podrá ser ejecutable por la Agencia Estatal de Administración Tributaria en el caso de que sea dicha Agencia quien lleve a cabo la gestión de cobro de la deuda asegurada, a través del procedimiento administrativo de apremio.

Este seguro tendrá validez hasta el día **{{poliza.fecha_vencimiento}}**, fecha a partir de la cual el asegurador queda liberado de cualquier obligación en virtud del presente certificado. El seguro se someterá a la legislación española.`,
      `Jointly, severally and irrevocably, to **{{tomador.nombre}}**, Tax ID {{tomador.cif}}, before **{{beneficiario.nombre}}**, for the amount of **{{poliza.suma_texto}} ({{poliza.suma}})** to guarantee payment of the public charges and fees that the said company may owe for the use of Spanish airports, and in particular under art. 68.2 of Law 21/2003.

This insurance shall be enforceable by {{beneficiario.nombre}} on first demand, a simple request to the Insurer reporting the insured company's payment default being sufficient.

It may also be enforced by the State Tax Administration Agency where that Agency manages the collection of the insured debt through the administrative enforcement procedure.

This insurance shall be valid until **{{poliza.fecha_vencimiento}}**, after which the insurer is released from any obligation under this certificate. The insurance shall be governed by Spanish law.`,
    ),
  },
];

export const findTemplate = (id: TemplateId) => {
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) throw new Error(`Plantilla desconocida: ${id}`);
  return t;
};
