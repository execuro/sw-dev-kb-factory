---
id: platform/dev/6.7/resources/references/adr/2026-05-13-administration-pr-guidelines.md
title: Administration Pull Request Guidelines
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-05-13-administration-pr-guidelines.html
sourceHash: f6d645ae8320157e4b4c5cf50d062b2b7a123a10
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration pull request", "pr guidelines", "code review", "adr", "stacked prs", "500 changed lines", "reproduction steps", "review order", "pareto principle", "pr description", "administration coding guidelines", "linting"]
summary: "ADR: Administration PRs need self-reviewed diffs, area context, repro steps, review order, under 500 changed lines; split larger work into stacked PRs"
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, dated 2026-05-13, area `administration`) mirrored from the Shopware 6 repository. It defines how Administration pull requests must be prepared so that reviewers without the author's feature context can understand, verify and review them asynchronously.

## When to use

- Opening or preparing a pull request against the Shopware Administration (Vue/JS/TS code under the administration package).
- Reviewing an Administration PR and deciding where to spend review attention.
- Planning a large Administration change that will need to be split.

## Key steps / config

Authors, before requesting review:

1. **Review your PR diff** — read your own diff first; check that the PR is understandable, sufficiently scoped and small enough.
2. **Explain the area** — when the change touches a niche or non-obvious feature, the PR description links existing documentation or briefly describes the concept.
3. **How to reproduce** — give concrete reproduction/verification steps, state behavior before and after the change, and explain how a reviewer confirms the problem is solved.
4. **Give context how to review** — explain non-obvious diffs in the PR description or as a GitHub comment on the relevant lines.
5. **How should I review your PR?** — when useful, prescribe a review order (e.g. concept document first, then the test file, then the API implementation).
6. **Only small PRs** — stay below 500 changed lines; split larger changes into stacked PRs with a clear review order.
7. **Code Guidelines** — follow the existing Administration coding guidelines and required linting.

Reviewers:

- **Pareto Principle** — focus on the small part of the change that carries most of the risk or impact; avoid low-impact feedback that tooling or existing guidelines already cover.

## Gotchas

- The 500-changed-lines limit is a process rule for Administration PRs, not a technical check; large features must be planned up front as smaller, stackable PRs rather than one broad diff.
- The ADR accepts the trade-off that authors invest more effort before requesting review in exchange for less reviewer time spent reconstructing context.

## Code check (6.7.13.0)
- unverified `500 changed lines` — PR process rule; not enforced anywhere in the installed shopware core/storefront/administration source
- unverified `stacked PRs` — contribution workflow convention, nothing to check in installed code
- unverified `Administration coding guidelines` — repository guideline and lint tooling live outside the installed package roots
