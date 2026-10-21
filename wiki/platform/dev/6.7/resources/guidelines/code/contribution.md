---
id: platform/dev/6.7/resources/guidelines/code/contribution.md
title: Contribution Guidelines
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/contribution.html
sourceHash: 4fbb1a71acdbe76f505d5595075e74d949f9219b
codeCheckedAgainst: "6.7.15.1"
keywords: ["contribution guidelines", "pull request", "PR checklist", "RELEASE_INFO", "UPGRADE", "trunk", "conventional commits", "backport", "github", "code review", "stale pull request", "declined pull request"]
summary: Checklist for Shopware core pull requests - target trunk, Conventional Commits PR title, RELEASE_INFO/UPGRADE docs, tests; review and decline rules.
lastBuilt: 2026-10-21
---
## What it is

The rules for contributing code to the Shopware core via GitHub pull requests: what a PR must contain to be accepted, how the review workflow runs, and the common reasons a PR is declined.

## When to use

Before opening or while maintaining a pull request against the Shopware core repository.

## Key steps / config

**PR checklist** (PRs not meeting it will most likely not be accepted):

1. Open the PR against the main repository `github.com/shopware/shopware`.
2. Fill out the pull request info template (`.github/PULL_REQUEST_TEMPLATE.md`) in as much detail as possible.
3. Changes relevant to the broader community go into the `RELEASE_INFO` file; breaking changes are documented in the `UPGRADE` file as well (see the release documentation guide `delivery-process/documenting-a-release.md`).
4. Target the `trunk` branch. If the change should also land in the previous major, say so in the PR description — a backport can be done.
5. Check for missing parts: translations, backward compatibility, deprecations.
6. Provide tests.
7. Check whether another PR already tackles the same issue.
8. Write commit messages in English. Individual commits do not matter (the PR is squashed on merge), but the **PR title** must follow Conventional Commits because it becomes the final commit message, for example:
   - `feat: Add new product import API`
   - `fix: Resolve cart calculation issue`
   - `docs: Update installation instructions`

**Maintaining the PR** — the author is responsible for:

- responding to review comments in a timely manner and updating the code accordingly;
- keeping the PR up to date with the target branch when conflicts arise;
- making sure all pipeline checks succeed.

**Review process:** every weekday the PR is assigned to the domain team responsible for that part of Shopware, which then accepts it, declines it, or asks for more information or changes.

## Gotchas

- Once the PR is public, do not rebase or force-push; add new commits so reviewers can follow what changed. The PR is squashed automatically on merge.
- Allow maintainers to edit your PR so they can fix minor issues themselves and merge faster.
- A PR with no activity from the author for two weeks after a review or change request is closed as stale; it can be reopened later.
- Common decline reasons: checklist not fulfilled; no update after a label was added; the change is already being handled internally; the benefit is specific to your use case rather than the whole product; the feature does not fit the roadmap or company values.
- To avoid a decline, open an issue or discussion in the Shopware repository first — especially before implementing a new feature or changing existing behaviour.

## Code check (6.7.15.1)
- unverified `RELEASE_INFO` — repository-root release file, outside the three installed package roots
- unverified `UPGRADE` — repository-root upgrade notes file, outside the installed package roots
- unverified `PULL_REQUEST_TEMPLATE.md` — GitHub repository metadata, not part of vendor/shopware packages
