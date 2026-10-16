# Upstream

Vendored from https://github.com/bnayoo3-cyber/magnific-mcp-skill (MIT, see `LICENSE`). Community skill, not official Magnific.

- Commit: `421cbf4abbd77a05f86d95be65672c04a02db3dd` (2026-09-28)
- Catalog snapshot: September 2026. The live catalogs (`*_models_list`) and `simulate_cost` are the source of truth.

## Local changes

- Credit report strings in Spanish (upstream had them in Hebrew).
- `user_config.json` and `budget.json` live in `~/.claude/magnific-mcp/`, never in the project root: this repo is public and those files hold account spend data. Both names are also in `.gitignore` as a safety net.

## Requirements

The Magnific MCP (`claude mcp add --transport http magnific https://mcp.magnific.com`, OAuth in the browser) or the claude.ai custom connector with the same URL. Without it, the skill has no tools to drive.

## Updating

Copy `SKILL.md` from a newer upstream commit, re-apply the local changes above and update the commit hash.
