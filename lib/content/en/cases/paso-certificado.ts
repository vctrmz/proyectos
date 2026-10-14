import { shot, type CaseStudy } from '../../cases/types';

/* English version of the Certificate step case. Same sources and the same
   rules as the Spanish one: the client is not named, screenshots come from
   the demo with fictitious data or from HERMES screens without client
   branding, and anything that only exists in the demo says so. */
export const pasoCertificadoEn: CaseStudy = {
  slug: 'paso-certificado', title: 'Certificate step: four legal templates, one editable body', company: 'HERMES', years: '2025',
  tagline: 'A new step in the surety issuance flow: pick the language and the certificate template, and adapt the body without touching what binds the insurer.',
  tags: ['Case study', 'In production', 'Insurtech', 'Editor', 'TipTap'], brand: '#123a63',
  hero: shot('pc-paso', 'Certificates step: language, template, variables panel and the A4 page with its editable body', 'Demo of the step with fictitious data: variables on the left, the certificate on the right'),
  context: 'A HERMES tenant that issues surety insurance needed a new step, CERTIFICATE, in its issuance flow: choose Spanish or English, choose one of four templates and edit each document’s content using policy variables.',
  role: 'Product Designer for the step. I led the choice of editor with the front-end lead, the PO and back end, and designed the document model and the interface.',
  delivery: 'A CERTIFICATE step with the A4 page split into regions, an editable body built on TipTap and policy variables. There is now also a public demo that rebuilds it with fictitious data.',
  problem: [
    'Four templates (State Attorney, Private, Storage, and Public with date for airport charges) in two languages. Each operation needs its own body, but header, logo and footer cannot change.',
    'I had never designed a document creation system in HERMES, and the ticket asked for a “WYSIWYG or similar” editor without saying which one.',
  ],
  complexity: { diagram: 'certificate-regions', caption: 'Anatomy before screens: five regions, four of them fixed and shared by all four templates. Only the body goes into the editor.' },
  challenge: {
    title: 'The challenge',
    items: [
      { title: 'New ground', body: 'First document creation system in HERMES: no in-house pattern to start from and no editor chosen yet.' },
      { title: 'Flexibility versus control', body: 'Whoever issues needs to adapt the body to each operation; whatever binds the insurer has to come out identical on every certificate.' },
      { title: 'Data the back end can store', body: 'Content had to reach the document_model as structure, not as free HTML somebody has to interpret later.' },
    ],
  },
  flows: {
    title: 'How the editor was chosen',
    caption: 'When I do not know where to start, I ask for help and organise the decision: first what others do, then the team, and design sets the final criterion.',
    list: [{
      title: 'From research to TipTap', side: 'Design, front-end lead, PO and back end',
      steps: [
        { n: '1', t: 'Desk research', d: 'A benchmark of other products, and design thinking tools to sort out the findings.' },
        { n: '2', t: 'Front-end lead', d: 'I walk them through the idea coming out of the research.' },
        { n: '3', t: 'PO', d: 'I check it against the business: what the step needs and who it serves.' },
        { n: '4', t: 'All three together', d: 'Two or three days later the front-end lead brings a couple of tools. We agree on two.' },
        { n: '5', t: 'Back end', d: 'We did not know how they fitted the database: a couple of hours of research and a meeting with back end. Both worked.' },
        { n: '6', t: 'Design decision', d: 'With both viable, I set the final criterion: which one fitted the design better. TipTap.' },
      ],
    }],
  },
  decisions: [
    { title: 'Split the A4 page into regions before drawing screens.', why: 'All four templates share header, power of attorney, signature and footer; only the body changes.', changed: 'Fixed regions are drawn from the template and never enter the editor, so there is no permission to bypass: the constraint is structural.', figure: { shot: shot('pc-anatomia', 'Demo anatomy mode with the five regions labelled', 'Anatomy: four fixed regions and the editable body, labelled on the A4 page') } },
    { title: 'Organise the decision instead of imposing it.', why: 'It was new ground: desk research gave the options and the team gave the technical filter.', changed: 'I met the front-end lead and the PO separately and then together. The database question was settled with back end in a couple of hours, not by assumption.', wouldFix: 'I would bring in the people who issue certificates before closing the anatomy: the research was desk research and team work, not user research.', figure: { shot: shot('pc-figma-comandos', 'Figma exploration of the HERMES editor with its command menu open', 'Figma exploration: / commands grouped into global style, document style and system data') } },
    { title: 'TipTap, chosen for how it fits the design.', why: 'Front end and back end had validated both finalists: the last question was no longer technical.', changed: 'TipTap is headless: toolbar, menus and chips come from the design system. A variable can be its own node and the body comes out as JSON for the document_model.', tradeoff: 'Being headless, the whole editor interface (toolbar, menus and variables) has to be designed and built; none of it comes out of the box.', figure: { shot: shot('pc-variables', 'Variables menu opened with @ inside the certificate body', 'Variables via @ or the side panel: policy data goes in as a node, not as text between braces') } },
    { title: 'Variables in plain sight, named in business terms.', why: 'The ticket asked for the variable list on the left and the editor on the right: whoever issues does not need to know what {{ tomador.nombre }} means.', changed: 'Each variable reads as “Policyholder · Name” and the key stays for the back end. In the demo you can switch between the label and the actual policy data.', figure: { shot: shot('pc-document-model', 'Demo with policy data resolved and the document_model panel open', 'Policy data resolved and, next to it, the document_model the back end receives') } },
  ],
  system: {
    body: [
      'The anatomy is the system: one five-region structure serves all four templates and both languages, and the tenant only brings its brand and legal name.',
      'The public demo rebuilds the step on TipTap with fictitious data: variables as atomic nodes, / and @ commands, and the document_model live. Every acceptance criterion in the ticket has its own test.',
    ],
    code: {
      title: 'A variable as an atomic TipTap node',
      lang: 'ts',
      source: 'repo',
      href: 'https://github.com/vctrmz/proyectos/blob/main/demos/certificado-caucion/src/editor/VariableNode.ts',
      code: "export const VariableNode = Node.create({\n  name: 'variable',\n  group: 'inline',\n  inline: true,\n  atom: true, // moved and deleted whole; nobody types inside it\n  addAttributes() {\n    return { key: { default: null } }; // 'tomador.nombre'\n  },\n  renderText({ node }) {\n    return `{{ ${node.attrs.key} }}`; // copied as the ticket's syntax\n  },\n});",
    },
    uiKit: [
      { kind: 'slots', title: 'Body with variables', body: 'Policy data goes in as a node with a business name. Everything else on the page is drawn from the template.', wide: true },
      { kind: 'phases', title: 'One more step in issuance', body: 'CERTIFICATE sits between the power-of-attorney check and Summary: the policy already has its data by the time it gets here.', wide: true, label: 'Step 10 of 11 · output: certificate issued' },
      { kind: 'states', title: 'Body status', body: 'It shows whether the body is still the approved template or has been adapted.', wide: true, labels: ['Template', 'Edited', 'Missing data', 'Issued'] },
      { kind: 'actions', title: 'Action hierarchy', body: 'Continue closes the step; saving is reversible; going back carries no weight.', wide: true, label: 'Continue', labels: ['Save and finish later', 'Back'] },
    ],
  },
  demo: { id: 'paso-certificado', intro: 'A clickable rebuild of the step, made for this portfolio with fictitious data: the prototype and the case presentation, in a separate tab (in Spanish).' },
  design: [
    shot('pc-hueco', 'Certificate preview with one policy field still empty', 'In the demo, missing data is flagged in the preview and blocks issuance'),
    shot('pc-emitida', 'Issued policy summary with the certificate among its documents', 'In the demo, the certificate comes out as one more document of the policy'),
    shot('pc-figma-emitida', 'Issued policy screen in HERMES with the generated documents', 'Figma: end of the HERMES flow, with the documents it generates'),
  ],
  implementation: [
    'After the choice, implementation and development with front end on TipTap.',
    'The public demo in this portfolio uses the same regions, variables and document_model, with one test per acceptance criterion.',
  ],
  result: {
    output: [
      { value: '4 · 2', label: 'certificate templates and languages', meaning: 'State Attorney, Private, Storage and Public with date, in Spanish and English, on a single anatomy.' },
      { value: '1 of 5', label: 'editable regions', meaning: 'Only the body enters the editor; header, power of attorney, signature and footer come from the template.' },
      { value: '2', label: 'viable finalists before choosing', meaning: 'Front end and back end validated both tools; choosing TipTap was a design call.' },
    ],
    outcome: 'unavailable',
    measure: 'Not instrumented: issuance time per certificate, certificates redone outside the system and bodies edited away from the template.',
  },
  learnings: [
    'Asking for help is not handing over the decision: desk research brings options, the team filters them and design closes it.',
    'When front end and back end validate two options, the last call can and should be a design one.',
    'Splitting the document into regions before drawing screens solved the legal and the technical side at once.',
  ],
  next: 'vista-360',
};
