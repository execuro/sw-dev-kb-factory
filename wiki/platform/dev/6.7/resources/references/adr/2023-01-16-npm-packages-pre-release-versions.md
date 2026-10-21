---
id: platform/dev/6.7/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.md
title: Npm packages pre-release versions
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-01-16-npm-packages-pre-release-versions.html
sourceHash: 7c633f95d83adb76aa70cfb1ee78aab239f5075c
codeCheckedAgainst: "6.7.15.1"
keywords: ["npm", "preinstall", "pre-release version", "prerelease", "alpha version", "package.json", "npm audit", "security advisories", "dependency versions", "administration", "semver", "adr"]
summary: "ADR: pre-release npm package versions (e.g. 1.9.0-alpha1) are prohibited, enforced by an npm preinstall script, so npm security reports apply."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-01-16, area: administration) that prohibits pre-release versions of npm packages in Shopware's JavaScript dependencies. A pre-release version is a version followed by a hyphen and an alphanumeric string, such as `1.9.0-alpha1`.

## When to use

- You add or bump an npm dependency of the Shopware administration and consider an alpha/beta/rc release.
- An install fails in the `preinstall` step because a dependency resolves to a pre-release version.

## Key steps / config

- Use only regular (non-pre-release) versions of npm packages.
- The rule is enforced by an npm `preinstall` script, which runs before dependencies are installed.

## Gotchas

- npm interprets any pre-release version like `1.9.0-alpha1` as `<0.0.0` when matching security advisories. Example from the ADR: a package is reported insecure at `1.8.7` and fixed in `2.0.0`; a project pinned to `1.9.0-alpha1` would never receive that report from npm until it switched to a non-pre-release version.
- Consequence of the rule: a bug fix that is only available as a preview in a pre-release package cannot be used until a regular release ships it.

## Code check (6.7.15.1)
- unverified `preinstall` — npm script lives in the administration package.json, outside the checked source roots; no match under the administration src root
- unverified `1.9.0-alpha1` — illustrative version from the ADR, not a code identifier
