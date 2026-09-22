import GlitchText from './GlitchText';
import t from './text.module.css';
type Props = { as?: 'h1' | 'h2'; lines: [string, string]; size?: 'display' | 'xl' | 'lg'; id?: string; className?: string };
export default function TwoToneHeading({ as: Tag = 'h2', lines, size = 'xl', id, className = '' }: Props) {
  return (
    <Tag id={id} className={`two-tone ${t[size]} ${className}`}>
      <span>{lines[0]}</span><br /><span><GlitchText text={lines[1]} /></span>
    </Tag>
  );
}
