---
id: platform/dev/6.7/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.md
title: Npm packages pre-release versions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.html
sourceHash: 7c633f95d83adb76aa70cfb1ee78aab239f5075c
codeCheckedAgainst: "6.7.13.0"
keywords: ["npm", "pre-release version", "prerelease", "alpha version", "preinstall", "npm audit", "security advisory", "package.json", "administration dependencies", "adr"]
summary: "ADR 2023-01-16: pre-release npm package versions such as 1.9.0-alpha1 are prohibited in Shopware packages, enforced by an npm preinstall script."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-01-16, area administration) that prohibits depending on pre-release npm package versions, i.e. a version followed by a hyphen and an alphanumeric string such as `1.9.0-alpha1`.

## When to use

When adding or upgrading npm dependencies of the Shopware JavaScript packages and a dependency is only available as an alpha/beta/rc build, or when a `preinstall` check rejects such a version.

## Key steps / config

- Why: npm interprets any pre-release version like `1.9.0-alpha1` as `<0.0.0`. Scenario from the ADR: a package is marked insecure at `1.8.7`, fixed in `2.0.0`; while `1.9.0-alpha1` is used, npm never reports the `1.8.7` vulnerability.
- Decision: pre-release package versions are prohibited.
- Enforcement: an npm `preinstall` script checks the dependencies.

## Essential identifiers

- `preinstall` (npm lifecycle script)
- Version pattern `<major>.<minor>.<patch>-<tag>`, e.g. `1.9.0-alpha1`

## Gotchas

- Bug fixes that are only published in a pre-release (preview) package cannot be used until a regular release exists.

## Code check (6.7.13.0)
- unverified `preinstall` — lives in the administration package.json, outside the checked administration src root
- unverified `1.9.0-alpha1` — example version from the ADR, not a code identifier
