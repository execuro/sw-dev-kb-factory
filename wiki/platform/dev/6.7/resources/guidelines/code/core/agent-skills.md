---
id: platform/dev/6.7/resources/guidelines/code/core/agent-skills.md
title: Agent Skills
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/core/agent-skills.html
sourceHash: df5295dc1f1a3674560750e4ae7517bbed5476a7
codeCheckedAgainst: "6.7.15.1"
keywords: ["agent skills", "SKILL.md", ".agents/skills", "gh aw", "github agentic workflow", "disable-model-invocation", "policy.allow_implicit_invocation", "agents/openai.yaml", "runtime-import", "safe-outputs", "engine.model", "ai skill", "claude code", "codex"]
summary: Shopware repo guideline for adding an AI Agent Skill - SKILL.md layout, optional gh aw CI twin, shared policy files and invocation conventions.
lastBuilt: 2026-10-21
---
## What it is

A core guideline, mirrored from `coding-guidelines/core/agent-skills.md` in the Shopware 6 repository, that explains how to add an AI Skill to that repository: the file layout, the optional unattended CI twin, and the conventions that keep all skills built the same way. A Skill packages an AI capability in the Anthropic Agent Skills format (spec at agentskills.io) and is offered to Claude Code, opencode, Codex CLI, Cursor, Gemini CLI and other compatible runtimes.

## When to use

When you add or change a skill under `.agents/skills/` in the Shopware repository, or wire a skill to run unattended in CI as a GitHub Agentic Workflow (`gh aw`).

## Key steps / config

Each skill has up to two surfaces, kept in lockstep:

1. **Interactive**: `.agents/skills/<name>/SKILL.md`, loaded into a developer's editor session. `.claude/skills` is a symlink to the same directory (`.claude/skills -> ../.agents/skills`), so do not edit it separately.
2. **Unattended (optional)**: `.github/workflows/<name>.md` (gh aw source, the file you edit) plus a runtime-imported policy fragment `.github/aw/<name>-policy.md`. `gh aw compile` regenerates `.github/workflows/<name>.lock.yml`. Output goes through `safe-outputs` (`upload-artifact`, `create-pull-request`, `push-to-pull-request-branch`, `add-labels`, `add-comment`, `noop`).

When both surfaces exist, the shared rubric lives at `.github/aw/shared/<name>-policy.md`. Interactive-only references go in `.agents/skills/<name>/references/`.

```
.agents/skills/<name>/
├── SKILL.md            # required: frontmatter + body
├── agents/openai.yaml  # optional: Codex UI metadata and policy
├── references/         # optional: on-demand context
└── assets/             # optional: examples, fixtures
```

Checklist for a new skill:

1. Create `SKILL.md` with at least `name` and `description` in the frontmatter. Keep it short and move detail into `references/<TOPIC>.md`.
2. If the skill has both surfaces, put the shared policy under `.github/aw/shared/`, not under `references/`. gh aw's runtime-import security validation forbids importing files outside `.github/`. The policy fragment imports it with `{{#runtime-import .github/aw/shared/<name>-policy.md}}` (the `sw-triage` skill shows the pattern).
3. For a CI twin, make the interactive skill explicit-only: `disable-model-invocation: true` in `SKILL.md` (Claude Code) and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` (Codex), then run `gh aw compile`.
4. Add a row to `.agents/skills/README.md` with trigger phrases and deliverable.
5. Run it once with `gh aw run <name> -f …` and inspect it with `gh aw audit <run-id>`.

Install the `gh aw` extension once per workstation, pinned to the version `.github/aw/actions-lock.json` is built against (pin and install command in `.github/aw/README.md`). `actions-lock.json` and `.github/aw/logs/` are shared by all skills.

## Essential identifiers

- `.agents/skills/<name>/SKILL.md`, `.github/workflows/<name>.md`, `.github/aw/<name>-policy.md`, `.github/aw/shared/<name>-policy.md`
- `disable-model-invocation: true`, `policy.allow_implicit_invocation: false`
- `gh aw compile`, `gh aw run`, `gh aw audit`
- `engine.model`

## Gotchas

- A skill with a CI twin must not auto-load in ordinary conversations; users can still call it as `/name` (Claude Code) or `$name` (Codex).
- The frontmatter `description` is matched against user messages unless automatic invocation is disabled, so name trigger phrases precisely.
- Model choice: gh aw workflows pin the model in their own `engine.model` frontmatter, Sonnet tier by default (e.g. `sw-triage`, `sw-review`). Escalate only with a documented reason; `sw-bugfixer` and the `security`/`architecture` personas of `sw-review` use the Opus tier.
- Inline sub-agents (`## agent:` blocks in a gh aw source; see `sw-review.md`): the frontmatter must include `name:`, or Claude Code does not register the sub-agent and any per-agent `model:` pin is ignored; restrict `tools:` (typically `Read, Grep, Glob, Bash`) so workers cannot use safe-output tools and quotas; workers return their result as the final message and only the orchestrator publishes, with dispatch via the `Task` tool made mandatory.

## Code check (6.7.15.1)
- unverified `SKILL.md` — repository tooling under `.agents/skills`, outside the vendor/shopware core, storefront and administration packages
- unverified `disable-model-invocation` — agent runtime frontmatter key, not read by Shopware code
- unverified `policy.allow_implicit_invocation` — Codex `agents/openai.yaml` key, not part of the installed packages
- unverified `gh aw` — GitHub CLI extension and `.github/` workflow files, out of scope for the package check
