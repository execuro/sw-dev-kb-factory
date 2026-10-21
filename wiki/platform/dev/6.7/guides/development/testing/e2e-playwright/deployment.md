---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/deployment.md
title: Deployment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/deployment.html
sourceHash: d04c094551d1bc77d3c142edc247439d8ff344cb
codeCheckedAgainst: "6.7.15.1"
keywords: ["ats deployment", "release-please", "Release-As", "conventional commits", "@shopware-ag/acceptance-test-suite", "npm publish", "release pr", "changelog", "git commit --allow-empty", "acceptance test suite release"]
summary: Release process of the Shopware Acceptance Test Suite - conventional-commit PRs, release-please deployment PR, npm publish, Release-As fix.
lastBuilt: 2026-10-20
---
## What it is

The release process for a new version of the Shopware Acceptance Test Suite (ATS), the Playwright-based test package published to npm as `@shopware-ag/acceptance-test-suite`. Releases are automated with the `release-please` tool, driven by Conventional Commits.

## When to use

Contributing a change to the ATS repository and getting it shipped as a new npm version, or repairing a release that release-please did not create.

## Key steps / config

1. Open a pull request; all commits must follow the Conventional Commits specification (used for automated versioning and changelog generation).
2. After review and approval, merge it into the main branch.
3. `release-please` automatically opens a deployment PR containing version bumps and a generated changelog.
4. The deployment PR needs an additional approval.
5. Merging it creates a GitHub release of the ATS and publishes a new package version of `@shopware-ag/acceptance-test-suite` to npm.
6. After a short delay the version is available on npm and can be referenced in your projects.

## Gotchas

Most failures come from commit messages that do not follow Conventional Commits (check them and rebase if needed). If a non-conforming commit was already merged:

```bash
git commit --allow-empty -m "chore: release 2.0.0" -m "Release-As: 2.0.0"
git push origin <your-branch>
```

A commit on the main branch with `Release-As: x.x.x` (case-insensitive) in its body makes release-please open a PR for that version. Afterwards, adjust the release notes in the deployment PR. The release-please project has its own troubleshooting page for a missing release PR.

## Code check (6.7.15.1)
- unverified `release-please` — release tooling of the external ATS repository, not part of Shopware core/storefront/administration
- unverified `@shopware-ag/acceptance-test-suite` — npm package outside the installed Shopware code, out of scope
- unverified `Release-As` — release-please commit trailer, out of scope
