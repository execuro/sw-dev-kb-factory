---
id: platform/dev/6.7/resources/references/adr/2026-09-25-major-feature-flag-inheritance.md
title: Major feature flag inheritance
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-09-25-major-feature-flag-inheritance.html
sourceHash: 1ccb361488bb9d2f8b1dd28b9672f427052aa977
codeCheckedAgainst: "6.7.15.1"
keywords: ["FEATURE_ALL", "V6_8_0_0", "v6.8.0.0", "CACHE_REWORK", "JSON_LD_DATA", "Feature::isActive", "majorVersion", "feature.yaml", "major flag", "feature flag inheritance", "sub-feature", "parent flag", "adr"]
summary: "ADR: sub-features declaring major: v6.8.0.0 follow that major flag; FEATURE_ALL just enables all. 6.7.15.1 still uses boolean major"
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-09-25) that links separately toggleable feature flags to the major version flag they belong to, so that enabling a major flag such as `v6.8.0.0` reliably turns on the complete release state, and that reduces `FEATURE_ALL` to a single meaning.

## When to use

- Declaring a feature flag in the feature configuration (`feature.yaml`) for work targeting a major release.
- Deciding which environment variables to set when testing an upcoming major (`V6_8_0_0=1`) versus all features (`FEATURE_ALL=1`).
- Writing call sites that check a flag, or CI lanes that select a release state.

## Key steps / config

Problem: call sites were inconsistent (some checked `v6.8.0.0` plus a flag such as `CACHE_REWORK`, others only the flag such as `JSON_LD_DATA`), so enabling the major flag alone did not give the full 6.8 behavior. CI compensated with a special `FEATURE_ALL=major` value.

Decision:

1. A standalone major flag is identified by its version-shaped name (`v6.8.0.0`).
2. A sub-feature that belongs to that release declares its parent in the feature configuration (`major: v6.8.0.0` in the ADR's notation — a parent flag name, not a boolean).
3. Precedence for a sub-feature: explicit environment value or stored/runtime toggle, then a truthy `FEATURE_ALL`, then an active declared major parent, then its configured `default`.
4. `FEATURE_ALL`: any truthy value enables all registered features; no special `major`, `minor` or version-shaped modes.
5. At call sites, check only the feature's own flag; no `major || feature` double checks. Features meant for a minor release or several majors get no parent.

Environment usage per the ADR:

- `V6_8_0_0=1` — 6.8 release state including declared 6.8 sub-features, excluding unrelated experiments and later-major features.
- `FEATURE_ALL=1` — all features together, including independent experiments.
- An explicit sub-feature setting can still enable it alone or disable it while the major is active.

Installed behavior in 6.7.15.1 (what the code does today): `feature.yaml` entries carry `major` as a boolean (normalised with `(bool)` on registration) plus an optional `majorVersion` string; `Feature::isActive()` checks the explicit env value first, then `FEATURE_ALL`, then a stored `active`, then `default`. There is no parent lookup.

## Essential identifiers

- `Feature::isActive()`, `feature.yaml` keys `name`, `default`, `major`, `majorVersion`, `toggleable`
- `FEATURE_ALL`, `V6_8_0_0`, `v6.8.0.0`
- Example sub-features: `CACHE_REWORK`, `JSON_LD_DATA`

## Gotchas

- In 6.7.15.1 `FEATURE_ALL` still has modes: `FEATURE_ALL=major` (constant `Feature::ALL_MAJOR`) enables only flags with `major: true`, and a version-shaped value such as `FEATURE_ALL=v6.8.0.0` enables major flags arriving in that major or earlier (via `majorVersion`). Any other truthy value enables non-major flags.
- In 6.7.15.1 `CACHE_REWORK` has `major: false`, so it is not enabled by a major mode; `JSON_LD_DATA` has `major: true` without a parent.
- The unit test bootstrap enables all registered flags regardless of `FEATURE_ALL`; unit tests needing an older state must disable the major flag explicitly.
- The migration CI lane sets the Composer root version to 6.8 separately, because migration namespace selection depends only on that version.

## Version notes

Targets the 6.8 major cycle. When the next major starts, the explicit version flag in major workflow settings must be updated; the feature configuration stays the source of truth for which sub-features belong to a major.

## Code check (6.7.15.1)
- confirmed `Feature::isActive()` — explicit env value wins before `FEATURE_ALL` — vendor/shopware/core/Framework/Feature.php:139
- corrected `FEATURE_ALL` — docs: single meaning, no `major`/version modes; installed still has major-only and version-shaped modes — vendor/shopware/core/Framework/Feature.php:158
- confirmed `Feature::ALL_MAJOR` — `'major'` mode constant still present — vendor/shopware/core/Framework/Feature.php:20
- corrected `major` — docs: parent flag name; installed casts it to a boolean — vendor/shopware/core/Framework/Feature.php:407
- confirmed `majorVersion` — optional arrival major for flags not named after a version — vendor/shopware/core/Framework/Feature.php:481
- confirmed `v6.8.0.0` — major flag, `default: false` — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:16
- corrected `CACHE_REWORK` — docs: declared 6.8 sub-feature; installed `major: false`, no parent — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:64
- confirmed `JSON_LD_DATA` — `major: true`, toggleable, no parent declared — vendor/shopware/core/Framework/Resources/config/packages/feature.yaml:94
- unverified `FEATURE_ALL=major` — CI workflow usage lives outside the shopware package roots
