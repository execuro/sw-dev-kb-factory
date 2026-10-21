---
id: platform/dev/6.7/resources/references/adr/2026-06-17-shared-guidance-files-for-humans-and-agents.md
title: Shared Guidance Files for Humans and Agents
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-06-17-shared-guidance-files-for-humans-and-agents.html
sourceHash: cda5a7517e313961a65cbcf1d340954fbbef4c58
codeCheckedAgainst: "6.7.15.1"
keywords: ["AGENTS.md", "CLAUDE.md", "@AGENTS.md", ".agents/skills", ".claude/skills", "coding-guidelines", "AGENTS.override.md", "GEMINI.md", "agent skills", "ai coding agents", "repository guidance", "shopware-admin-js", "adr"]
summary: "ADR: where Shopware repo guidance lives - concise root AGENTS.md, CLAUDE.md bridges, skills in .agents/skills, rules in coding-guidelines/"
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-06-17, area: process) defining how the Shopware 6 repository stores guidance shared by human contributors and agent tools (Codex, Claude, Gemini and others). It fixes which file type holds which kind of rule, so guidance is not duplicated per audience and task-specific rules do not sit in the always-loaded root context.

## When to use

- Deciding where a new rule, convention or piece of durable knowledge belongs when contributing to the Shopware repository.
- Adding or reviewing an `AGENTS.md`/`CLAUDE.md` file or an Agent Skill in the platform repository.
- Understanding why the repository has one-line `CLAUDE.md` files next to `AGENTS.md` files.

## Key steps / config

Placement rules decided by the ADR:

1. Root `AGENTS.md` stays concise: repository-wide context, routing to the main subtrees, and mandatory linting guidance only.
2. Main subtree `AGENTS.md` files are allowed when they contain real subtree rules or route to substantial existing guidance.
3. No mechanical `AGENTS.md` or `GEMINI.md` stubs that only point at README files. Exception: every tracked `AGENTS.md` has a sibling `CLAUDE.md` whose only body is `@AGENTS.md`, so Claude Code loads the same guidance without a duplicated copy.
4. Task-specific guidance lives in Agent Skills under `.agents/skills/` and loads only when a task needs it.
5. Reusable normative rules go into `coding-guidelines/`.
6. Folder-specific human guidance may stay in an existing README when contributors naturally read it for that work.
7. ADRs record durable decisions, trade-offs and consequences; they are not living checklists.
8. Local-only agent mechanics (local setup, tool preferences, Docker setup, approval rules) stay in untracked override files such as `AGENTS.override.md`.

Skill location: Shopware-specific skills are branch-local and live in the repository under `.agents/skills/`, so a guidance change is reviewed together with the platform change it describes and needs no separate install or sync. Claude Code discovers project skills from `.claude/skills/`, which is a Git-tracked symlink to `../.agents/skills`; `.agents/skills` stays the source of truth — never edit or duplicate skills through the symlink as a separate copy.

Initial skills:

- `shopware-knowledge-capture` — saving durable knowledge and routing it to AGENTS, coding guidelines, README, ADR, skills or local notes (codifies this ADR's placement rules).
- `shopware-change-scope` — root-cause analysis, boyscouting, cleanup scope.
- `shopware-release-docs` — release notes, upgrade notes, developer changelog decisions.
- `shopware-pr-hygiene` — PR templates, conventional titles, review follow-up commits.
- `shopware-php-code` — PHP architecture, API schema, migrations, deprecations, BC-sensitive code.
- `shopware-admin-js` — Administration JavaScript, TypeScript, Vue, ACL, Jest.
- `shopware-phpunit-tests` — PHPUnit structure, fixtures, feature flags, coverage, data providers.

## Essential identifiers

- `AGENTS.md`, `CLAUDE.md` (body `@AGENTS.md`), `GEMINI.md`, `AGENTS.override.md`
- `.agents/skills/`, `.claude/skills/` (symlink to `../.agents/skills`)
- `coding-guidelines/`

## Gotchas

- Exact reuse of these skills in plugin or other repositories is harder; the ADR accepts this so skills stay next to the branch-local guidance they depend on.
- Rejected alternatives: duplicating guidance into every agent file (drift), a dedicated skills repository (install/sync work), README stubs everywhere (agents do not always auto-load references), and putting everything in root `AGENTS.md` (wastes context, makes task-specific rules look mandatory).
- `CLAUDE.md` bridge files are accepted only where real `AGENTS.md` guidance exists.

## Code check (6.7.15.1)
- confirmed `@AGENTS.md` — subtree CLAUDE.md bridge whose only body is the import line — vendor/shopware/administration/Resources/app/administration/src/core/CLAUDE.md:1
- confirmed `@AGENTS.md` — same bridge pattern in the core MCP subtree — vendor/shopware/core/Framework/Mcp/CLAUDE.md:1
- confirmed `shopware-admin-js` — module AGENTS.md routes Administration module work to this skill under `.agents/skills/` — vendor/shopware/administration/Resources/app/administration/src/module/AGENTS.md:4
- unverified `AGENTS.override.md` — repository-root, untracked file; outside the package roots
- unverified `coding-guidelines/` — repository-root directory, outside the package roots
- unverified `.claude/skills` — repository-root symlink, outside the package roots
- unverified `GEMINI.md` — no such file under the package roots; repository root not in scope
