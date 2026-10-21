---
id: platform/dev/6.7/resources/references/adr/2026-08-06-administration-jest-feature-flag-helpers.md
title: Use declarative Jest helpers for feature flags in the Administration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-08-06-administration-jest-feature-flag-helpers.html
sourceHash: 9c1c4a8d42b2ee992cc0f68fe227b352651aeecf
codeCheckedAgainst: "6.7.15.1"
keywords: ["jest", "feature flags", "it.activeFeatureFlags", "it.deprecated", "global.activeFeatureFlags", "provide.feature", "feature service", "v6.8.0.0", "V6_8_0_0", "administration tests", "unit tests", "major flag", "spec"]
summary: "ADR: Admin Jest specs declare feature flags via it.activeFeatureFlags() / it.deprecated() instead of setting global.activeFeatureFlags."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-08-06) for Administration Jest specs: feature flags are declared on the test with helpers, not assigned inside it.

Previously specs mutated a global by hand (`global.activeFeatureFlags = ['v6.8.0.0'];`). That was:

- **Order dependent** — the shared array leaked into later tests unless reset; specs grew defensive `beforeEach`/`afterEach` resets, and those that forgot were flaky when file order changed.
- **Too late** — assigning inside the test callback happens after setup hooks ran, so a component mounted in `beforeEach` never saw the flag.
- **Unable to express intent** — a test meant only for before a major looked identical to one meant only for after it; running the suite with the major flag on required each spec to anticipate it.

Many specs also shadowed the globally registered feature service with a local mock (`provide: { feature: { isActive: (flag) => ... } }`), so the component read a hardcoded boolean and the test proved nothing about the flag.

## When to use

- Writing or updating Administration Jest specs whose behavior depends on a feature flag, especially the `v6.8.0.0` major flag.
- Marking tests that cover behavior that disappears with a major version.

## Key steps / config

```js
// Runs with the flag active, in the default and the major suite alike.
it.activeFeatureFlags(['v6.8.0.0'])('renders the meteor tabs', async () => { /* ... */ });

// Skipped once the flag is active.
// @deprecated tag:v6.8.0.0 - The test will be removed with the legacy sw-tabs branch.
it.deprecated('v6.8.0.0')('renders the deprecated tabs', async () => { /* ... */ });

// Table-driven variant.
it.activeFeatureFlags(['v6.8.0.0']).each(rows)('handles %s', async (row) => { /* ... */ });
```

Rules:

1. Do not assign `global.activeFeatureFlags` in a spec. A custom Jest environment owned by the helpers activates the flags before setup hooks run and restores the baseline afterwards.
2. Do not provide a local `feature` mock. The globally registered feature service already reads the active flags and normalises both notations (`v6.8.0.0` and `V6_8_0_0`). Mounting a component with `provide.feature` inside a test that uses `it.activeFeatureFlags()` throws.
3. `it.deprecated()` means "this disappears with that version", not "this currently fails". The registered test name gains a `(removed in <version>)` suffix so skipped tests explain themselves in reporter output.

## Essential identifiers

- `it.activeFeatureFlags([...])`, `it.activeFeatureFlags([...]).each(rows)`
- `it.deprecated('<version>')`
- `global.activeFeatureFlags` (do not assign in specs)
- `provide.feature` (do not mock locally)
- `@deprecated tag:v6.8.0` next to `it.deprecated('v6.8.0.0')`

## Gotchas

- A test's flag context is no longer visible in its body — read the `it` line. In exchange it applies everywhere, including hooks that run before the callback.
- Legacy and post-major expectations can live side by side in one file, and both suites can be green at the same time.
- Specs still using manual flag mutation or a local `feature` mock keep working but are not covered; the shadowing check only fires when both styles are combined in one test.
- Pairing `@deprecated tag:v6.8.0` comments with `it.deprecated('v6.8.0.0')` makes the major cleanup a search instead of an audit.

## Code check (6.7.15.1)
- confirmed `it.activeFeatureFlags` — used in specs with `['v6.8.0.0']` — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-tag/component/sw-settings-tag-detail-modal/sw-settings-tag-detail-modal.spec.js:81
- unverified `it.deprecated` — used across specs (always beside a `@deprecated tag:v6.8.0` comment); helper defined in the Administration `test/` setup, outside the checked roots
- confirmed `Feature::isActive()` — global feature registry uppercases flag names on lookup — vendor/shopware/administration/Resources/app/administration/src/core/feature.ts:24
- unverified `global.activeFeatureFlags` — helper and custom Jest environment live in the Administration `test/` setup, outside the checked roots
- unverified `provide.feature` — the shadowing check that throws is part of the test setup, outside the checked roots
- unverified `V6_8_0_0` — dot/underscore notation normalisation not found in `src/core/feature.ts`; likely in test setup, outside the checked roots
