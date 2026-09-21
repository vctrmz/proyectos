import s from './CodeDemo.module.css';
export default function CodeDemo({ title, lang, code }: { title: string; lang: 'json' | 'ts'; code: string }) {
  return (
    <div className={s.wrap}>
      <div className={s.head}><span>{title}</span><span className={s.tag}>{lang} · ejemplo ilustrativo</span></div>
      <pre className={s.pre}><code>{code}</code></pre>
    </div>
  );
}
