---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/references/adr/2026-05-13-administration-pr-guidelines.md
sourceHash: f6d645ae8320157e4b4c5cf50d062b2b7a123a10
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-05-13-administration-pr-guidelines.html
title: Administration Pull Request Guidelines
version: "6.7"
versions:
  - "6.7"
keywords: ["administration", "pull request", "pr guidelines", "code review", "pr description", "reproduction steps", "stacked prs", "500 changed lines", "pareto principle", "review order", "linting", "contribution"]
summary: "ADR: rules for Administration pull requests: self-review, explain the area, reproduction steps, review guidance, under 500 changed lines, stacked PRs."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record that sets the rules for preparing and reviewing pull requests against the Shopware Administration. Administration PRs are often reviewed by people without the author's feature context; without guidance, reviewers must reconstruct the affected area, the reason for the diff and the intended behaviour from code alone, which slows reviews and lets important changes slip while minor feedback gets too much attention. The decision: PRs must be prepared for reviewers who do not share the author's context.

## When to use

- You open, or are about to request review for, a pull request that changes the Administration.
- You review an Administration PR and need to decide where to spend attention.
- A planned Administration change is large and needs to be split.

## Key steps / config

Author checklist before requesting review:

1. **Review your PR diff** — read your own diff first; check that the PR is understandable, sufficiently scoped and small enough.
2. **Explain the area** — when the change touches a niche or non-obvious feature, describe the affected area in the PR description: link existing documentation or briefly describe the concept.
3. **How to reproduce** — give concrete reproduction or verification steps, state the behaviour before and after the change, and explain how a reviewer can confirm the problem is solved.
4. **Give context how to review** — explain non-obvious diffs, either in the PR description or as a GitHub comment on the relevant lines.
5. **How should I review your PR?** — when useful, prescribe a review order, for example: concept document first, then the test file, then the API implementation.
6. **Only small PRs** — keep Administration PRs below 500 changed lines; split larger work into stacked PRs with a clear review order.
7. **Code Guidelines** — follow the existing Administration coding guidelines and the required linting.

Reviewer rule:

- **Pareto Principle** — focus on the small part of the change that carries most of the risk or impact; skip low-impact feedback that tooling or existing guidelines already cover.

## Gotchas

- The 500-changed-lines limit means large Administration features must be planned up front as a series of smaller, stackable PRs rather than one broad diff.
- Authors spend more effort before requesting review; the payoff is less reviewer time spent reconstructing context and easier asynchronous review.
- Lint-level issues are meant to be caught by tooling, not by reviewer comments.

## Code check (6.7.15.1)
- confirmed `sw-test-rules/test-file-max-lines-warning` — Administration lint rules are applied to source and test files (here opted out per file) — vendor/shopware/administration/Resources/app/administration/src/module/sw-import-export/component/sw-import-export-activity/sw-import-export-activity.spec.js:1
- unverified `500 changed lines` — PR size limit is a process rule, not enforced in the code roots
- unverified `stacked PRs` — review-process guidance, nothing to check in installed code
