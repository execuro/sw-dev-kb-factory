---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/resources/guidelines/code/core/agent-skills.md
sourceHash: df5295dc1f1a3674560750e4ae7517bbed5476a7
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/agent-skills.html
title: Agent Skills
version: "6.7"
versions:
  - "6.7"
keywords: ["agent skills", "SKILL.md", ".agents/skills", "gh aw", "GitHub Agentic Workflow", "disable-model-invocation", "policy.allow_implicit_invocation", "agents/openai.yaml", "runtime-import", "safe-outputs", "ai skill", "claude code", "codex", "ci twin"]
summary: Core guideline for adding AI Agent Skills to the Shopware repo - SKILL.md layout, optional gh aw CI twin, shared policy files, invocation settings.
lastBuilt: 2026-09-15
---
## What it is

Shopware core coding guideline describing how an AI **Skill** (Anthropic Agent Skills format) is added to the Shopware 6 repository: the file layout, the optional unattended GitHub Agentic Workflow (`gh aw`) twin, and conventions shared by all skills. Skills are consumed by Claude Code, opencode, Codex CLI, Cursor, Gemini CLI and other Agent-Skills-compatible runtimes. This concerns the shopware/shopware monorepo tooling, not plugin or runtime code.

## When to use

When contributing a new AI skill (or a CI-run twin of one) to the Shopware core repository, or reviewing such a change.

## Key steps / config

Each skill has up to two surfaces kept in lockstep:

1. **Interactive** — `.agents/skills/<name>/SKILL.md`; `.claude/skills` is a symlink to `../.agents/skills` (do not edit separately).
2. **Unattended (optional)** — `.github/workflows/<name>.md` (gh aw source) plus a runtime-imported policy fragment `.github/aw/<name>-policy.md`; emits via `safe-outputs` (`upload-artifact`, `create-pull-request`, `push-to-pull-request-branch`, `add-labels`, `add-comment`, `noop`).

Layout:

```
.agents/skills/<name>/SKILL.md          # required
.agents/skills/<name>/agents/openai.yaml # optional, Codex metadata/policy
.agents/skills/<name>/references/        # optional, on-demand context
.agents/skills/<name>/assets/            # optional, examples
.github/workflows/<name>.md              # gh aw source (edit this)
.github/workflows/<name>.lock.yml        # compiled by `gh aw compile`
.github/aw/<name>-policy.md              # gh-aw-mode fragment
.github/aw/shared/<name>-policy.md       # shared rubric for both surfaces
```

`.github/aw/actions-lock.json` and `.github/aw/logs/` are shared across all skills. Install the `gh aw` extension pinned to the version `.github/aw/actions-lock.json` is built against (pin documented in `.github/aw/README.md`).

Checklist:

1. Create `SKILL.md` with at least `name` and `description` frontmatter; keep it short, move stable detail into `references/<TOPIC>.md`.
2. With both surfaces, put the shared policy in `.github/aw/shared/<name>-policy.md` — gh aw runtime-import refuses files outside `.github/`. The fragment imports it with `{{#runtime-import .github/aw/shared/<name>-policy.md}}` (see `sw-triage`).
3. For a CI twin: add the workflow and policy fragment, set `disable-model-invocation: true` in `SKILL.md` (Claude Code) and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` (Codex), then run `gh aw compile`.
4. Add a row to `.agents/skills/README.md` (trigger phrases, deliverable).
5. Run once: `gh aw run <name> -f …`, inspect with `gh aw audit <run-id>`.

## Gotchas

- Skills with a CI twin must be explicit-only in interactive sessions (invoke as `/name` in Claude Code, `$name` in Codex).
- Frontmatter `description` is matched against user messages unless auto-invocation is disabled — name trigger phrases precisely.
- gh aw workflows pin the model in `engine.model`; default is the Sonnet tier, escalations need a documented reason (`sw-bugfixer`, `sw-review` security/architecture personas use Opus).
- Inline sub-agents (`## agent:` blocks): frontmatter must include `name:` or the sub-agent is not registered and its `model:` pin never applies; restrict `tools:` (typically `Read, Grep, Glob, Bash`) so workers cannot consume safe-output quotas; workers return results as their final message and only the orchestrator publishes — make `Task` dispatch mandatory.

## Code check (6.7.13.0)
- unverified `SKILL.md` — repository tooling file, not part of the installed Shopware packages
- unverified `.agents/skills` — monorepo directory, outside the installed code roots
- unverified `disable-model-invocation` — Claude Code skill frontmatter key, not Shopware code
- unverified `policy.allow_implicit_invocation` — Codex `agents/openai.yaml` setting, not Shopware code
- unverified `gh aw compile` — GitHub CLI extension command, out of scope
- unverified `.github/aw/shared/<name>-policy.md` — CI configuration in the monorepo, not shipped in packages
