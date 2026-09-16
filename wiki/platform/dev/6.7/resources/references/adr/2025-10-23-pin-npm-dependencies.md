---
id: platform/dev/6.7/resources/references/adr/2025-10-23-pin-npm-dependencies.md
title: Pin All NPM Dependencies to Exact Versions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-10-23-pin-npm-dependencies.html
sourceHash: 90c1527932ccf7da06e70c87cd36b4922e6641ae
codeCheckedAgainst: "6.7.13.0"
keywords: ["package.json", "package-lock.json", "npm-audit-check.yml", "scripts/runNpmAudit.ts", "npm install", "npm outdated", "npm update", "dependencies", "devDependencies", "pinned versions", "exact version", "semver range", "adr", "supply chain security"]
summary: "ADR (2025-10-23): all npm dependencies and devDependencies in Shopware 6 package.json files must use exact versions; CI blocks unpinned ranges."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (ADR, area: infrastructure) stating that every NPM dependency in the Shopware 6 repository is pinned to an exact version, without `^` or `~` range specifiers. It applies to both `dependencies` and `devDependencies` in all `package.json` files of the repository.

## When to use

- When adding or updating an npm package in a Shopware core, Administration or Storefront `package.json` (e.g. when contributing to the platform).
- When a CI run of the Shopware repository rejects a PR because of an unpinned dependency.
- As a reference for why the shipped Storefront/Administration JS builds use exact versions.

## Key steps / config

Allowed vs. rejected specifier:

```json
{
  "dependencies": {
    "package": "1.2.3"
  }
}
```

- Rejected: `"package": "^1.2.3"` or `"package": "~1.2.3"`.
- Accepted: `"package": "1.2.3"`.

Workflow for developers when adding or updating dependencies:

1. Always specify the exact version in `package.json`.
2. Run `npm install` to update `package-lock.json`.
3. The CI pipeline rejects PRs with unpinned dependencies.
4. Use `npm outdated` to check for available updates; update explicitly with `npm update` or `npm install package@version`.

CI enforcement (workflow `npm-audit-check.yml`):

- Discovers all `package.json` files in the repository, validates that no unpinned dependencies exist, and blocks merges if any are found.
- Pull requests and pushes to trunk audit only tracked packages whose `package.json`, `package-lock.json` or `scripts/runNpmAudit.ts` changed.
- Scheduled and manual runs execute the full audit matrix for all tracked packages; scheduled audit failures create or update a single GitHub issue listing the affected packages.

## Essential identifiers

- `package.json` — `dependencies`, `devDependencies`
- `package-lock.json`
- `npm-audit-check.yml` (CI workflow)
- `scripts/runNpmAudit.ts`
- `npm install`, `npm update`, `npm install package@version`, `npm outdated`

## Gotchas

- Rationale given: range specifiers cause non-deterministic builds, open a window for malicious package versions through automatic updates, and allow breaking changes in minor/patch releases.
- Trade-off: updates are no longer picked up automatically; security patches must be applied through explicit pull requests.
- The rule targets dependency entries; the installed Storefront `package.json` still uses ranges in its `engines` block (node/npm), which is not a dependency list.

## Version notes

- 2025-11-15 update: the PR audit runs only on packages with pinned dependencies, not on all npm packages in the repository.

## Code check (6.7.13.0)
- confirmed `dependencies` — Storefront package.json lists exact versions (e.g. `@popperjs/core` 2.11.8) — vendor/shopware/storefront/Resources/app/storefront/package.json:37
- confirmed `devDependencies` — Storefront package.json devDependencies are exact versions (e.g. `@babel/cli` 7.23.4) — vendor/shopware/storefront/Resources/app/storefront/package.json:72
- unverified `npm-audit-check.yml` — repository CI workflow, not shipped in vendor/shopware packages
- unverified `scripts/runNpmAudit.ts` — repository script, not shipped in vendor/shopware packages
- unverified `package-lock.json` — Administration package root is outside the checked vendor roots
