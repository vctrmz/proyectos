import Link from 'next/link';
import ConsentState from '@/components/ConsentState';

export default function PrivacyEn() {
  return (
    <div className="legal">
      <main id="contenido">
        <p className="kicker"><span>Legal</span></p>
        <h1>Privacy and cookies</h1>
        <p className="updated">Last updated: 2 October 2026</p>
        <p className="lead">This site is my portfolio. I collect data for two reasons: to understand how people read it, and to be able to reply if you write to me. Nothing below loads until you accept the cookie notice, apart from what the hosting strictly needs.</p>

        <section id="controller">
          <h2>Who is the <b>controller</b></h2>
          <p><strong>Víctor Maza</strong>, Product Designer. Málaga, Spain.<br />For anything about your data: <a href="mailto:vctrmz47@gmail.com">vctrmz47@gmail.com</a>.</p>
        </section>

        <section id="data">
          <h2>What is collected and <b>what for</b></h2>
          <p>Five tools, all behind the same consent: <strong>Google Analytics 4</strong> for aggregate traffic, <strong>Microsoft Clarity</strong> and <strong>Hotjar</strong> for behaviour on the page, <strong>Plerdy</strong> for click maps —it identifies visitors through local storage and a browser fingerprint rather than cookies— and <strong>HubSpot</strong> for contact, which only holds your details if you write to me. If you decline, not a single request is made to Google, Microsoft, Hotjar, Plerdy or HubSpot. Separately, <strong>Vercel Speed Insights</strong> measures how fast each page loads and responds on real devices: no cookies, nothing stored in your browser, no identifier, and the data goes to my own domain — so it runs without consent, on legitimate interest, and its reports are aggregated per page rather than per person. Hotjar hosts in the EU and HubSpot is set to its European data centre; Plerdy is based in Ukraine, a country without an EU adequacy decision, and its data is anonymous.</p>
          <p>If you write to me through the contact form, I collect your name, your email and your message, and only to reply. The form is delivered by <strong>Resend</strong>, acting as a processor. <strong>There is no database</strong>: this site stores nothing you write — what remains of your message is the email that reaches my inbox. The legal basis is your consent when you tick the box, and afterwards my legitimate interest in answering you. When you send it, your browser also solves an invisible check from <strong>Vercel BotID</strong> that tells a person apart from a spam program, from technical signals of the browser: it asks you nothing, only runs on sending, and I do not use it to measure anything. Its basis is my legitimate interest in keeping the form free of spam.</p>
        </section>

        <section id="rights">
          <h2>Your <b>rights</b></h2>
          <p>You can ask for access, correction, deletion, restriction, objection and portability by writing to the address above, and you can complain to the Spanish data protection authority (AEPD).</p>
        </section>

        <section id="cookies">
          <h2>Change your <b>decision</b></h2>
          <ConsentState />
        </section>

        <p className="lead">The full version, with the table of tools, retention periods and legal bases, is on the <Link href="/es/privacy">Spanish page</Link>, which is the one that governs.</p>
      </main>
    </div>
  );
}
