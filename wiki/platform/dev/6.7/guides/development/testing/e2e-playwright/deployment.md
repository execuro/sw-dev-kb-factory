---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/deployment.md
title: Deployment
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/deployment.html
sourceHash: d04c094551d1bc77d3c142edc247439d8ff344cb
codeCheckedAgainst: "6.7.13.0"
keywords: ["ats deployment", "release process", "release-please", "conventional commits", "Release-As", "@shopware-ag/acceptance-test-suite", "npm publish", "changelog", "version bump", "deployment pr", "acceptance test suite"]
summary: Release process of the Shopware Acceptance Test Suite - conventional commits, release-please deployment PR, NPM publish, Release-As empty-commit fix.
lastBuilt: 2026-09-15
---
## What it is

The release process for a new version of the Shopware Acceptance Test Suite (ATS) itself, automated with `release-please` and published to NPM as `@shopware-ag/acceptance-test-suite`.

## When to use

Contributing a change to the ATS repository and getting it released, or fixing a release that `release-please` did not pick up.

## Key steps / config

1. **Create a pull request** — all commits must follow the Conventional Commits specification (drives automated versioning and changelog).
2. **Approval and merge** — merge the reviewed PR into the main branch.
3. **Automated deployment PR** — `release-please` opens a new PR containing version bumps and a generated changelog.
4. **Review and approve the deployment PR** — it needs an additional approval.
5. **Merge the deployment PR** — creates a GitHub release of the ATS and publishes a new package version to NPM under `@shopware-ag/acceptance-test-suite`.
6. **Use the new version** — after a short delay the version is available on NPM and can be referenced in projects.

### Troubleshooting a missing release PR

Usually caused by commit messages not following Conventional Commits; check them and rebase if needed. If a non-conforming commit was already merged:

```bash
git commit --allow-empty -m "chore: release 2.0.0" -m "Release-As: 2.0.0"
git push origin <your-branch>
```

A commit on the main branch whose body contains `Release-As: x.x.x` (case-insensitive) makes Release Please open a PR for that version. Afterwards, adjust the release notes in the deployment PR.

## Essential identifiers

- `release-please`
- `@shopware-ag/acceptance-test-suite`
- `Release-As: x.x.x` commit trailer
- `git commit --allow-empty -m "chore: release 2.0.0" -m "Release-As: 2.0.0"`

## Gotchas

- The deployment PR needs its own approval; merging the feature PR alone does not publish anything.
- The published NPM version is not available immediately after merge.
- Release notes generated for a `Release-As` release need manual adjustment in the deployment PR.

## Code check (6.7.13.0)
- unverified `@shopware-ag/acceptance-test-suite` — separate npm package; no occurrence in vendor/shopware core/storefront/administration
- unverified `release-please` — external release tooling of the ATS repository, out of scope
- unverified `Release-As` — release-please commit trailer, out of scope of the installed code
