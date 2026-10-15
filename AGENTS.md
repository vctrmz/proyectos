<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Design skills

- **`impeccable` es la fuente de verdad del diseño.** `PRODUCT.md`, `.impeccable/`, los tokens y los hooks de `.claude/settings.local.json` mandan sobre cualquier otra dirección visual.
- **`design-taste-frontend` (taste-skill v2) solo se usa si se invoca de forma explícita** (`/design-taste-frontend`), para explorar o criticar la dirección visual de páginas públicas (home, casos, about). No sirve para el lab ni para pantallas de app. Úsalo con `--keep palette,type`: los tokens existentes no se sustituyen por los que reparta su librería. Sus house rules entran como input de una crítica, no como mandato, y se contrastan con el posicionamiento de `PRODUCT.md` antes de aplicarlas. Está vendorizado en `.claude/skills/design-taste-frontend/` (ver `UPSTREAM.md`).
