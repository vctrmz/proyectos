# SDD ledger — plan: docs/superpowers/plans/2026-09-22-rediseno-antigravity.md
Spec: docs/superpowers/specs/2026-09-22-rediseno-antigravity-design.md (read)
Pre-flight (shared interfaces):
- T2→T9/T10: FilterId/parseFilter/filterProjects/filterCounts/projectTags/getProject — consumed with same names. OK.
- T3→T11/T12: DiagramId, Shot, CaseStudy, getCase/CASE_SLUGS — consumed with same names. OK.
- T5→T7/T9/T10/T12/T13: Button(href/external/onClick), Chip(role=radio), TwoToneHeading(lines), Inset, Frame(brand/glow/ratio), Metric, FactStrip, Figure(width/height), Disclosure, CodeDemo — signatures match. OK.
- T6→T9/T10/T12: scrollEffectsAllowed, ScaleIn(from), Reveal — match. OK.
- T8→T9/T10/T12: shotSize(src) — match; T8 test imports PROJECTS/CASES (T2/T3) — order OK.
- T1 next.config redirects /perfil while app/perfil exists until T10/T13 — plan notes it; acceptable on branch.
- Ruling (pre-flight): T2 test expects insurtech=4 (design-system sector 'multi'); spec §5 said 5. Test/plan wins (design-system is multi-producto) — cost if wrong: one count label.
Task 1: Ruling: tokens.test.ts reads globals.css via path.join(process.cwd()) instead of new URL(import.meta.url) — jsdom env gives a non-file import.meta.url — cost if wrong: none (test-only).
Task 1: Ruling: next.config has NO experimental.viewTransition — Next 16.3.5 has no such flag; React 19.3 exports stable `ViewTransition` from 'react'. Tasks 9/12 import `{ ViewTransition } from 'react'` — cost if wrong: route transition degrades to plain navigation.
Task 1: complete (commits c855de1..1773b2e, tests: npx vitest run test/tokens.test.ts →    Duration  2.34s (environment 81%, setup 14%, transform 4%, worker 1%))
Task 2: Ruling: filter 'casos' matches p.hasCase (not type==='case') so the design-system case counts as caso de estudio (spec §5: 5 casos) — cost if wrong: one chip count.
Task 2: complete (commits 1773b2e..438a43a, tests: npx vitest run lib/content/projects.test.ts →    Duration  3.82s (environment 80%, setup 15%, transform 3%, tests 1%, import 1%))
Task 3: complete (commits 438a43a..c46c444, tests: npx vitest run lib/content →    Duration  3.27s (environment 79%, setup 14%, transform 5%, import 1%, tests 1%))
Task 4: complete (commits c46c444..0cabd6f, tests: npx vitest run lib/content/about.test.ts →    Duration  2.51s (environment 77%, setup 18%, transform 4%))
Task 5: complete (commits 0cabd6f..ab40fea, tests: npx vitest run components/ui →    Duration  3.69s (environment 66%, tests 12%, setup 9%, transform 7%, import 6%))
Task 6: Ruling: ScaleIn uses ScaleIn.module.css (transform-origin) instead of inline style and drops permanent will-change — spec §3 (no inline styles) and §8 (will-change only during interaction) — cost if wrong: none.
Task 6: complete (commits ab40fea..5583821, tests: npx vitest run lib/motion →    Duration  2.52s (environment 84%, setup 12%, transform 3%))
Task 7: complete (commits 5583821..f41112c, tests: npx vitest run →              learn more: https://vitest.dev/guide/improving-performance#test-environments)
Task 8: Ruling: build-images.mjs also reads public/assets/h-card/*.jpg for the six names that have no PNG source (01-datos-del-contacto, 02-notas-y-comite, 03-metodo-de-pago, 04-preparar-producto, 05-contratos, 06-agenda-participantes); PNG wins when both exist. Those six are 1000 px wide (JPG source) — cost if wrong: slightly softer images for the subscription case until better sources arrive. h-card stays until Task 14 (script source).
Task 8: complete (commits f41112c..9ad9454, tests: npx vitest run scripts/images.test.ts →    Duration  2.97s (environment 72%, setup 17%, transform 8%, import 2%, tests 1%))
Task 9: Ruling: shared test/motion-mock.tsx replaces the inline motion mock of the plan (reused by Tasks 10–13); ViewTransition imported as stable `ViewTransition` from 'react' per Task 1 ruling — cost if wrong: none.
Task 9: complete (commits 9ad9454..ee9067b, tests: npx vitest run components/catalog →    Duration  7.80s (environment 49%, tests 20%, transform 12%, setup 11%, import 8%))
Task 10: Ruling: / is prerendered static; Catalog reads ?f= via useSearchParams on the client (initialFilter prop optional) instead of page searchParams — LCP and Vercel static hosting; parseFilter still guards unknown values (test added) — cost if wrong: none.
Task 10: Ruling: HeroInset scales 0.6 → 1 (spec/plan said 0.5) to shrink the reserved gap at scroll 0 — cost if wrong: slightly less dramatic reveal.
Task 10: Ruling: Frame contains tall shots (max-height 100%, object-fit contain) — portrait captures were overflowing the 4:3 frame — cost if wrong: none.
Task 10: Ruling: home height 7072 px at 1280 (target ≤ 6000) — 2-column catalog of 10 cards; kept per Felipe structure, first capture at 851 px (target ≤ 750, hero copy is 3 lines at this width). Both noted for re-audit.
Task 10: complete (commits ee9067b..c2d38e8, tests: npx vitest run →              learn more: https://vitest.dev/guide/improving-performance#test-environments)
Task 11: complete (commits c2d38e8..abf41ab, tests: npx vitest run components/diagrams →    Duration  2.61s (environment 64%, tests 13%, setup 11%, transform 10%, import 1%))
Task 12: complete (commits abf41ab..aabdc9e, tests: npx vitest run components/case app/casos →    Duration  4.15s (environment 53%, import 19%, transform 10%, setup 10%, tests 8%))
Task 13: Ruling: Ikigai SMIL gradient rotation is enabled in an effect after mount (avoids SSR/CSR mismatch) and disabled under reduced-motion; CityChips gets `only` prop so "Vivo en Málaga · Antes, en Jaén…" reads correctly — cost if wrong: none.
Task 13: complete (commits aabdc9e..921e234, tests: npx vitest run components/about →    Duration  3.25s (environment 61%, tests 12%, setup 11%, transform 10%, import 6%))
Task 14: Ruling: _og-source.html and _serve.js were untracked; removed from disk (not from git). og.png kept as-is (regeneration pending, noted in README) — cost if wrong: OG preview shows the old dark design until regenerated.
Task 14: complete (commits 921e234..96327ab, tests: npx vitest run →              learn more: https://vitest.dev/guide/improving-performance#test-environments)
Task 15: Ruling: manifesto dim floor 0.18 -> 0.5 (large text 3:1), CodeDemo <pre> tabIndex=0, tab years use --ink-3, case header <header> -> <div>, hero/inset/manifesto rhythm trimmed and --fs-1000 capped at 4.5rem so the first capture lands at 679 px - all from the audit RED run; audit exit 0 after - cost if wrong: none.
Task 15: Ruling: audit.mjs uses browser.newContext() per run (axe requirement) - cost if wrong: none.
Final: minor (deferred): / height 6467 px at 1280 vs 6000 target.
Task 15: complete (commits 96327ab..f8e6d99, tests: npx vitest run →              learn more: https://vitest.dev/guide/improving-performance#test-environments)
Final review: self-review (no subagent tool in this session).
Final: fixed content hidden without JS (motion SSR opacity:0 on hero, cards, diagrams) — test/nojs.test.tsx 3 tests RED→GREEN (hero static CSS entrance, data-reveal + noscript override), suite 74/74.
Final: fixed header "Contactar" href #contacto → /#contacto (anchor absent on case pages) — SiteHeader.test RED→GREEN, suite 74/74.
Final: minor (deferred): / height 6467 px at 1280 vs 6000 target.
Final: minor (deferred): Design gallery rows uneven when a portrait shot sits next to a landscape one (case pages).
Final: minor (deferred): og.png still the old dark design.
