---
id: platform/dev/6.7/resources/references/adr/2026-06-17-shared-guidance-files-for-humans-and-agents.md
title: Shared Guidance Files for Humans and Agents
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-06-17-shared-guidance-files-for-humans-and-agents.html
sourceHash: 40a2fa7b41603239fee71752a35fabec725171da
codeCheckedAgainst: "6.7.13.0"
keywords: ["AGENTS.md", "CLAUDE.md", "GEMINI.md", "AGENTS.override.md", ".agents/skills", ".claude/skills", "coding-guidelines", "agent skills", "adr", "ai agent guidance", "shopware-knowledge-capture", "shopware-php-code", "contributor documentation"]
summary: "ADR: concise root AGENTS.md, CLAUDE.md bridges with @AGENTS.md, task skills in .agents/skills, reusable rules in coding-guidelines/"
lastBuilt: 2026-09-15
---
## What it is

An accepted ADR (2026-06-17, area `process`) for the Shopware platform repository that decides where guidance for human contributors and agent tools (Codex, Claude, Gemini and others) lives, so it is not duplicated per audience and task-specific rules do not bloat the always-loaded context.

## When to use

- Deciding where to put a new rule, convention or piece of knowledge when contributing to the Shopware platform repository.
- Understanding why the repository has `AGENTS.md`, `CLAUDE.md` and `.agents/skills/` files and how agent tools load them.

## Key steps / config

Placement rules:

1. Root `AGENTS.md` stays concise: repository-wide context, main subtree routing, mandatory linting guidance only.
2. Main subtree `AGENTS.md` files are allowed only when they hold real subtree rules or route to substantial existing guidance.
3. No mechanical `AGENTS.md` or `GEMINI.md` stubs that just point at README files. Exception: every tracked `AGENTS.md` has a sibling `CLAUDE.md` whose only body is `@AGENTS.md`.
4. Task-specific guidance lives in Agent Skills under `.agents/skills/` (loaded only when the task needs it).
5. Reusable normative rules belong in `coding-guidelines/`.
6. Folder-specific human guidance may live in an existing README contributors naturally read.
7. ADRs capture durable decisions, trade-offs and consequences — not living checklists.
8. Local-only agent mechanics (local setup, tool preferences, Docker, approval rules) stay in untracked override files such as `AGENTS.override.md`.

Skill location: `.agents/skills/` is the source of truth; `.claude/skills/` is a Git-tracked symlink to `../.agents/skills` so Claude Code discovers the same skills.

Initial skills:

- `shopware-knowledge-capture` — saving durable knowledge and routing it to AGENTS, coding guidelines, README, ADR, skills or local notes
- `shopware-change-scope` — root-cause analysis, boyscouting, cleanup scope
- `shopware-release-docs` — release notes, upgrade notes, changelog decisions
- `shopware-pr-hygiene` — PR templates, conventional titles, review follow-up commits
- `shopware-php-code` — PHP architecture, API schema, migrations, deprecations, BC-sensitive code
- `shopware-admin-js` — Administration JS/TS, Vue, ACL, Jest
- `shopware-phpunit-tests` — PHPUnit structure, fixtures, feature flags, coverage, data providers

## Essential identifiers

- `AGENTS.md`, `CLAUDE.md` (body `@AGENTS.md`), `AGENTS.override.md`
- `.agents/skills/`, `.claude/skills` symlink
- `coding-guidelines/`

## Gotchas

- Do not edit or duplicate skill files through the `.claude/skills` symlink as a separate copy; `.agents/skills` is canonical.
- Skills are branch-local to the platform repository; exact reuse in plugin or other repositories is intentionally harder.
- Rejected alternatives: duplicating guidance into every agent file (drift), a dedicated skills repository (install/sync work), README stubs everywhere (not auto-loaded by agents), putting everything in root `AGENTS.md` (wastes context).

## Code check (6.7.13.0)
- unverified `AGENTS.md` — repository-root guidance file; not shipped in the installed composer packages
- unverified `.agents/skills/` — lives in the shopware/shopware monorepo, outside the installed package roots
- unverified `coding-guidelines/` — repository documentation folder, not part of installed code
- unverified `AGENTS.override.md` — untracked local file by definition, nothing to check in vendor code
