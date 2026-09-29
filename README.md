# victormaza.vercel.app

Portfolio of **Víctor Maza**, Product Designer (design systems, B2B SaaS, insurtech), Málaga.
Live: https://victormaza.vercel.app · CV: https://victormaza.vercel.app/victor-maza-cv.pdf

## How it is built

Every change follows the same chain, and every step leaves a document in this repo:

1. **Spec**: what and why, with the options discarded (`docs/superpowers/specs/`).
2. **Plan**: small tasks, each with its test (`docs/superpowers/plans/`).
3. **Code**: implemented with Claude Code, task by task.
4. **Review**: I review every task before it is committed.
5. **Tests and audit**: Vitest for components and content, Playwright + axe for accessibility (`docs/auditoria/`).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules on design tokens (`app/globals.css`) ·
GSAP, Lenis and Motion, all disabled under `prefers-reduced-motion` · Vitest · Playwright + axe · Vercel.

## Worth a look

- `app/globals.css`: the token layer. `test/tokens.test.ts` fails if retired values come back.
- `lib/content/`: every case study is typed data. `lib/content/cases/cases.test.ts` fails if an outcome
  is not explained or a business metric nobody measured sneaks in.
- `components/ui/`: the primitives every page is built from.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm test
npm run audit   # axe + metrics, with the dev server running
```

Spanish documentation: `docs/README.es.md`.

Content, case studies and images © Víctor Maza. All rights reserved.
