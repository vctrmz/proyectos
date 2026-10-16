# Upstream

Vendored from https://github.com/Leonxlnx/taste-skill (`skills/taste-skill`, MIT, see `LICENSE`).

- Commit: `f624f37a8c650b9cc550253104925efe4c8de246` (2026-10-14)
- Only `design-taste-frontend` (v2). The rest of the repo's skills (style variants, image generation, legacy versions) are left out on purpose.

## Local changes

- `SKILL.md` frontmatter: `disable-model-invocation: true`. The skill runs only when called as `/design-taste-frontend`, so it does not compete with `impeccable` for automatic routing. See `AGENTS.md`.

## Updating

Copy `skills/taste-skill/` from a newer upstream commit over this folder, keep `LICENSE` and this file, re-apply the local changes above and update the commit hash.
