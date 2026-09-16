---
id: "platform/dev/6.6/resources/guidelines/code/contribution.md"
title: "Contribution Guidelines"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/contribution.html"
sourceHash: "a0c4b99cbc7480b5e4e9679805dc25313e0f9c54"
keywords: ["contribution guidelines", "pull request", "PR", "conventional commits", "trunk branch", "changelog", "backport", "code review", "GitHub workflow", "squash merge", "pull request template"]
summary: "Requirements for a Shopware core pull request: target trunk, use conventional commit PR titles, include a changelog, and provide tests."
lastBuilt: "2026-09-15"
---
## What it is

Requirements and workflow expectations for contributing code to the Shopware core via pull request.

## When to use

Use before and while opening a pull request against the `shopware/shopware` repository.

## Key steps / config

Checklist for a pull request:
- Open the PR against the main `shopware/shopware` repository, targeting the `trunk` branch (backports to a previous major are possible, mention this in the PR description).
- Fill out the pull request info template (`.github/PULL_REQUEST_TEMPLATE.md`) as detailed as possible.
- Add a changelog file documenting the change.
- Check for missing translations, backward compatibility, and deprecations.
- Provide tests for the implementation.
- Check for an existing PR addressing the same issue.
- Write commit messages in English; the PR title must follow the Conventional Commits format (e.g. `feat: Add new product import API`, `fix: Resolve cart calculation issue`, `docs: Update installation instructions`) since it becomes the final squashed commit message.

After opening the PR, keep it up to date with the target branch, respond to review comments, and ensure pipeline checks pass. Avoid rebasing or force-pushing once the PR is public — new commits make review easier and the PR is squashed on merge. Allowing maintainers to push to the PR branch helps it merge faster.

Every weekday the PR is assigned to the domain team responsible for that area, which accepts, declines, or requests changes.

## Gotchas

- PRs that do not meet the checklist will most likely be rejected.
- A stale PR (no author activity for two weeks after a review or change request) will be closed, though it can be reopened later.
- Common decline reasons: unmet requirements, no update after a requested-changes label, the change is already handled internally, the change only benefits the author's own use case, or it does not fit the roadmap/company values.
