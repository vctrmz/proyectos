import Link from 'next/link';
import ConsentState from '@/components/ConsentState';

export default function PrivacyEn() {
  return (
    <div className="legal">
      <main id="contenido">
        <p className="kicker"><span>Legal</span></p>
        <h1>Privacy and cookies</h1>
        <p className="updated">Last updated: 25 September 2026</p>
        <p className="lead">This site is my portfolio. I collect data for two reasons: to understand how people read it, and to be able to reply if you write to me. Nothing below loads until you accept the cookie notice, apart from what the hosting strictly needs.</p>

        <section id="controller">
          <h2>Who is the <b>controller</b></h2>
          <p><strong>Víctor Maza</strong>, Product Designer. Málaga, Spain.<br />For anything about your data: <a href="mailto:vctrmz47@gmail.com">vctrmz47@gmail.com</a>.</p>
        </section>

        <section id="data">
          <h2>What is collected and <b>what for</b></h2>
          <p>Two analytics tools, and only with your consent: <strong>Google Analytics 4</strong> for aggregate traffic and <strong>Microsoft Clarity</strong> for behaviour on the page. If you decline, not a single request is made to Google or Microsoft. If you write to me, I keep your email and your message to answer it, nothing else.</p>
        </section>

        <section id="rights">
          <h2>Your <b>rights</b></h2>
          <p>You can ask for access, correction, deletion, restriction, objection and portability by writing to the address above, and you can complain to the Spanish data protection authority (AEPD).</p>
        </section>

        <section id="cookies">
          <h2>Change your <b>decision</b></h2>
          <ConsentState />
        </section>

        <p className="lead">The full version, with the table of tools, retention periods and legal bases, is on the <Link href="/privacidad">Spanish page</Link>, which is the one that governs.</p>
      </main>
    </div>
  );
}
