# Upstream

Vendored from https://github.com/wheresryan22/anatomy (MIT, see `LICENSE`). Project site: https://skills.wheresryan.sh

- Commit: `e9488296a44211c42701ff71705b7901470ec78f` (2026-10-15)

## Local changes

- `SKILL.md` frontmatter: `disable-model-invocation: true`. The skill runs only when called as `/anatomy`, so its broad description ("any explanatory diagram or figure") does not compete with `impeccable` for automatic routing. See `AGENTS.md`.
- Left out: `.github/` (upstream CI, issue templates, README images) and `.gitattributes`.
- Left out: the built example pages (`examples/*/*.html`, about 10.7 MB). They are build output: `node examples/<name>/build.mjs` writes the dark page next to the script, `--light` the light one (`turning-dial/stress.mjs` the stress pages). `.gitignore` has an extra line so rebuilt pages are never committed.

## Repo integration

- `tsconfig.json` and `vitest.config.mts` exclude `.claude/`: `kit/iso-kit.ts` and `kit/react/*.tsx` must not enter the Next type-check, and `scripts/*.test.mjs` are `node:test` files, not part of the vitest suite.

## Running the skill's own tests

Passed 279/279 at the commit above. From this folder, with upstream's pinned deps in a temp prefix (`npm install --prefix <tmp> --ignore-scripts react@19.3.0 react-dom@19.3.0 typescript@5.9.3 esbuild@0.28.2`):

```sh
node examples/turning-dial/build.mjs --light --verify   # orbit-sampling.test.mjs reads this page
NODE_PATH=<tmp>/node_modules CHROME_PATH=<chromium> node --test scripts/*.test.mjs
```

The React tests need TypeScript 5: Node resolves the repo's own `node_modules/typescript` (a newer major) before `NODE_PATH`, so they fail inside this repo unless that one is out of the way. A copy of the skill outside the repo has no such clash.

## Requirements

Node.js 20.10+, and Chrome or Chromium for `capture.mjs`, `drive.mjs`, `lines.mjs` and `turn-check.mjs`. No API keys.

## Updating

`git archive` a newer upstream commit over this folder, keep `UPSTREAM.md`, re-apply the local changes above and update the commit hash.
