import Kicker from './Kicker';
import TwoToneHeading from './TwoToneHeading';
import s from './SectionHeader.module.css';
export default function SectionHeader({ id, kicker, title, action }: { id: string; kicker: string; title: [string, string]; action?: React.ReactNode }) {
  return (
    <div className={s.head}>
      <div><Kicker>{kicker}</Kicker><TwoToneHeading as="h2" id={id} lines={title} /></div>
      {action}
    </div>
  );
}
