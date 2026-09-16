---
id: platform/dev/6.7/resources/guidelines/code/contribution.md
title: Contribution Guidelines
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/contribution.html
sourceHash: 4fbb1a71acdbe76f505d5595075e74d949f9219b
codeCheckedAgainst: "6.7.13.0"
keywords: ["contribution guidelines", "pull request", "RELEASE_INFO", "UPGRADE", "trunk", "conventional commits", "backport", "shopware/shopware", "PR template", "code review", "declined pull request", "squash merge"]
summary: Shopware core PR requirements - target trunk, PR template, RELEASE_INFO/UPGRADE docs, tests, Conventional Commits title; review and decline rules.
lastBuilt: 2026-09-15
---
## What it is

Guideline for contributing code to the Shopware core via GitHub pull requests: the checklist a PR must meet, the author's responsibilities during review, how PRs are triaged, and common reasons for rejection.

## When to use

Before opening or while maintaining a pull request against the `shopware/shopware` repository.

## Key steps / config

**PR checklist**

1. Open the PR against the main repository `https://github.com/shopware/shopware`.
2. Fill out the pull request template (`.github/PULL_REQUEST_TEMPLATE.md`) as fully as possible.
3. Document community-relevant changes in the `RELEASE_INFO` file (installed core checks `RELEASE_INFO-6.7.md`); document breaking changes additionally in the `UPGRADE` file. See `delivery-process/documenting-a-release.md` in the repository.
4. Target the `trunk` branch. For a backport to the previous major, say so in the PR description.
5. Include translations, backward compatibility handling and deprecations where relevant.
6. Provide tests.
7. Check for an existing PR tackling the same issue.
8. Write commit messages in English. The PR title must follow Conventional Commits, because PRs are squashed and the title becomes the commit message, e.g.:
   - `feat: Add new product import API`
   - `fix: Resolve cart calculation issue`
   - `docs: Update installation instructions`

**Author responsibilities**

- Respond to review comments in time and update code per feedback.
- Resolve conflicts with the target branch and keep all pipeline checks green.
- After the PR is public, add commits instead of rebasing/force-pushing.
- Allow maintainers to edit the PR branch so they can fix minor issues.

**Triage**: every weekday PRs are assigned to the responsible domain team, which accepts, declines or requests changes.

## Gotchas

- PRs not meeting the checklist will most likely be rejected.
- PRs stale for two weeks after a review or change request (no author activity) are closed; they can be reopened.
- Common decline reasons: missing required info, no update after a label was added, change already handled internally, benefit only for the contributor's own use case, feature not fitting the roadmap or company values.
- For new features or behaviour changes, open an issue or discussion first.

## Code check (6.7.13.0)
- confirmed `RELEASE_INFO-6.7.md` — default release-info file checked by the Danger rule `MissingReleaseInfo` — vendor/shopware/core/DevOps/StaticAnalyze/Danger/Rules/MissingReleaseInfo.php:16
- unverified `.github/PULL_REQUEST_TEMPLATE.md` — repository file, not part of the installed vendor packages
- unverified `trunk` — branch policy, not checkable in installed code
