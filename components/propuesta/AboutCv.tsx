import Link from 'next/link';
import Stack from '@/components/home/Stack';
import { ROUTES } from '@/lib/i18n/config';
import { Rise, Part } from './Rise';
import s from './AboutCv.module.css';

/* Sobre mí en la portada, sacado del CV (scripts/cv/cv-es.html): el perfil
   en primera persona, la experiencia y la formación. El CV descargable se
   queda en la página Sobre mí, a la que enlaza. Debajo, el stack con el
   enlace al repositorio. */
const JOBS = [
  { role: 'Senior Product Designer', where: 'Atrinium · Málaga', years: '2022 – 2026', note: 'Único diseñador de un holding de cinco productos: HERMES, su administrador, Flesip, pólizas 360 y un e-commerce.' },
  { role: 'UI / Product Designer', where: 'Darien Technology · Panamá, en remoto', years: '2021 – 2022', note: 'Banca digital para Mercantil Banco Panamá: pagos, Mony, Tadelanto, Next Gen, hipotecas y préstamos.' },
  { role: 'UX/UI Designer y freelance', where: 'Taksio y clientes internacionales', years: '2017 – 2020', note: 'Design system y flujos de una plataforma de movilidad; fintech, banca y logística como freelance.' },
];

export default function AboutCv() {
  return (
    <div className={s.grid}>
      <Rise className={s.copy}>
        <Part as="p" className={s.lead}>
          Llevo nueve años convirtiendo problemas de negocio complejos en arquitectura de información y flujos que se pueden operar: ERP asegurador, banca digital, fintech y movilidad.
        </Part>
        <Part as="p">
          Mi especialidad es el producto B2B que se vende a muchos clientes a la vez. Durante cuatro años fui el único diseñador de un holding cuyo núcleo es un SaaS multi-tenant que sostiene lógicas, monedas, idiomas y marcas distintas sin bifurcarse por cliente.
        </Part>
        <Part as="p">
          Construyo design systems con reglas de uso y criterios de decisión, no solo librerías de componentes. Soy graduado en Informática: reviso la implementación en React y prototipo con IA. Esta web es un proyecto Next.js con tests y código público.
        </Part>
        <Part>
          <Link href={ROUTES.es.about} className={s.more}>Más sobre mí y el CV <span aria-hidden="true">→</span></Link>
        </Part>
      </Rise>

      <Rise as="ul" className={s.jobs}>
        {JOBS.map((j) => (
          <Part as="li" key={j.role} className={s.job}>
            <p className={s.years}>{j.years}</p>
            <div>
              <p className={s.role}>{j.role}</p>
              <p className={s.where}>{j.where}</p>
              <p className={s.note}>{j.note}</p>
            </div>
          </Part>
        ))}
        <Part as="li" className={s.job}>
          <p className={s.years}>2017</p>
          <div>
            <p className={s.role}>Titulación en Informática</p>
            <p className={s.where}>Universidad de Oriente · 5 años</p>
          </div>
        </Part>
      </Rise>

      <div className={s.stack}><Stack locale="es" /></div>
    </div>
  );
}
