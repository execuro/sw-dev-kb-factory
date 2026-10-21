---
id: platform/dev/6.7/resources/references/adr/2025-10-23-pin-npm-dependencies.md
title: Pin All NPM Dependencies to Exact Versions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-10-23-pin-npm-dependencies.html
sourceHash: 90c1527932ccf7da06e70c87cd36b4922e6641ae
codeCheckedAgainst: "6.7.15.1"
keywords: ["npm", "package.json", "package-lock.json", "pinned dependencies", "exact versions", "semver range", "dependencies", "devDependencies", "npm-audit-check.yml", "scripts/runNpmAudit.ts", "npm audit", "npm outdated", "supply chain security"]
summary: "ADR: all npm dependencies and devDependencies in Shopware package.json files use exact versions, no ^/~ ranges; enforced by npm-audit-check.yml CI."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2025-10-23) requiring every NPM dependency in the Shopware 6 repository to be pinned to an exact version, with a CI check that blocks merges containing range specifiers.

## When to use

- You add or update an npm package in any `package.json` of the Shopware repository (Administration, Storefront, tooling).
- A CI audit job rejected your pull request for unpinned dependencies.

## Key steps / config

Rule — applies to both `dependencies` and `devDependencies` in all `package.json` files:

```json
{
  "dependencies": {
    "package": "1.2.3"
  }
}
```

Not allowed: `"package": "^1.2.3"` or `"package": "~1.2.3"`.

When adding or updating a dependency:

1. Specify the exact version in `package.json` (e.g. `npm install package@version`).
2. Run `npm install` to update `package-lock.json`.
3. CI rejects pull requests with unpinned dependencies.
4. Use `npm outdated` to check for available updates; update explicitly with `npm update` or `npm install package@version`.

CI enforcement runs in the `npm-audit-check.yml` workflow: it discovers all `package.json` files, validates that none contain unpinned dependencies, and blocks merges otherwise.

- Pull requests and pushes to trunk audit only tracked packages whose `package.json`, `package-lock.json` or `scripts/runNpmAudit.ts` changed.
- Scheduled and manual runs execute the full audit matrix for all tracked packages; a scheduled failure creates or updates one GitHub issue listing the latest affected packages.

Rationale: range specifiers cause non-deterministic builds, open a window for malicious package versions to arrive without review, let minor/patch updates introduce breakage, and make issues harder to reproduce across environments.

## Essential identifiers

- `package.json`, `package-lock.json`
- `dependencies`, `devDependencies`
- `npm-audit-check.yml`, `scripts/runNpmAudit.ts`
- `npm install`, `npm update`, `npm outdated`

## Gotchas

- Updates are no longer automatic: every security patch or version bump needs an explicit pull request and review, which means more maintenance effort and more frequent PRs.
- The rule targets dependency entries; the `engines` field is not a dependency, and the Storefront `package.json` still declares a range there (`"node": "^20.19.0 || >=22.12.0"`).

## Version notes

- Update 2025-11-15: the PR audit runs only on packages with pinned dependencies, not on all npm packages in the repository.

## Code check (6.7.15.1)
- confirmed `dependencies` — Storefront `package.json` dependency block uses exact versions — vendor/shopware/storefront/Resources/app/storefront/package.json:36
- confirmed `bootstrap` — pinned as `5.3.8`, no range specifier — vendor/shopware/storefront/Resources/app/storefront/package.json:41
- confirmed `webpack` — pinned as `5.104.1` — vendor/shopware/storefront/Resources/app/storefront/package.json:66
- confirmed `devDependencies` — no `^`/`~` entries in the block — vendor/shopware/storefront/Resources/app/storefront/package.json:71
- confirmed `engines` — only remaining range (`^20.19.0`), outside dependency blocks — vendor/shopware/storefront/Resources/app/storefront/package.json:109
- unverified `npm-audit-check.yml` — GitHub workflow, outside the checked package roots
- unverified `scripts/runNpmAudit.ts` — repository-level script, outside the checked package roots
- unverified `package-lock.json` — not inspected
