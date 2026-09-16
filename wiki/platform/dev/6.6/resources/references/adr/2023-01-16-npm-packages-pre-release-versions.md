---
id: platform/dev/6.6/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.md
title: Npm packages pre-release versions
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.html"
sourceHash: "7c633f95d83adb76aa70cfb1ee78aab239f5075c"
keywords: ["npm", "pre-release version", "preinstall script", "package.json", "semver", "administration", "npm audit", "dependency security", "alpha version", "beta version", "vulnerability reporting"]
summary: "Shopware ADR prohibiting npm pre-release package versions because npm treats them as `<0.0.0`, hiding security fix reports."
lastBuilt: "2026-09-15"
---
## What it is
This is an architecture decision record (ADR), mirrored from the Shopware 6 repository, that prohibits the use of npm pre-release package versions (a version followed by a hyphen and an alphanumeric string, e.g. `1.9.0-alpha1`) anywhere in the administration's npm dependencies.

## When to use
Relevant when adding or updating an npm dependency for the administration, or when deciding how to pin a package version in `package.json` — for example choosing between a stable release and an available alpha/beta/rc build.

## Key steps / config
The decision is enforced with an npm `preinstall` script that checks for pre-release version strings and fails the install if any are found. The rationale given in the ADR:

- A package version like `1.8.7` marked insecure, fixed in `2.0.0`.
- If the project instead pins a pre-release such as `1.9.0-alpha1`, npm interprets any pre-release version as `<0.0.0` for the purposes of `npm audit`/version-range matching.
- As a result, the known insecurity in `1.8.7` would never be reported by npm's audit tooling unless the project switches to a non-pre-release version.
- Consequence: bug fix releases that are only available as a preview in a pre-release package cannot be used — the project must wait for (or request) a full release.

## Essential identifiers
- npm `preinstall` script (the enforcement mechanism)
- pre-release version pattern: `<version>-<alphanumeric>`, e.g. `1.9.0-alpha1`

## Gotchas
A pinned pre-release version silently drops out of npm's vulnerability-detection range checks (`<0.0.0`), so a package that looks "pinned to a safe version" can still ship a known vulnerability without npm flagging it.
