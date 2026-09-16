---
id: platform/dev/6.7/resources/references/adr/2026-08-06-administration-jest-feature-flag-helpers.md
title: Use declarative Jest helpers for feature flags in the Administration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-08-06-administration-jest-feature-flag-helpers.html
sourceHash: 9c1c4a8d42b2ee992cc0f68fe227b352651aeecf
codeCheckedAgainst: "6.7.13.0"
keywords: ["it.activeFeatureFlags", "it.deprecated", "global.activeFeatureFlags", "feature", "isActive", "jest", "feature flag test", "administration spec", "provide.feature mock", "v6.8.0.0", "adr"]
summary: "ADR: Admin Jest specs declare feature flags via it.activeFeatureFlags()/it.deprecated() instead of mutating global.activeFeatureFlags or mocking feature."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record: feature flags in Administration Jest specs are declared on the test with helpers, not assigned inside it by mutating `global.activeFeatureFlags`.

## When to use

Writing or migrating Administration unit tests that depend on a feature flag (e.g. a major flag such as `v6.8.0.0`), or tests covering behaviour that is removed with a major.

## Key steps / config

Old pattern (discouraged):

```js
global.activeFeatureFlags = ['v6.8.0.0'];
```

It is order dependent (the shared array leaks between tests), too late (set inside the test callback, after `beforeEach` has mounted the component), and cannot express whether a test belongs before or after the major.

New pattern:

```js
it.activeFeatureFlags(['v6.8.0.0'])('renders the meteor tabs', async () => { /* ... */ });

// @deprecated tag:v6.8.0.0 - The test will be removed with the legacy sw-tabs branch.
it.deprecated('v6.8.0.0')('renders the deprecated tabs', async () => { /* ... */ });

it.activeFeatureFlags(['v6.8.0.0']).each(rows)('handles %s', async (row) => { /* ... */ });
```

Rules:

1. Do not assign `global.activeFeatureFlags` in a spec. A custom Jest environment activates the flags before setup hooks run and restores the baseline afterwards.
2. Do not provide a local `feature` mock (e.g. `provide: { feature: { isActive: ... } }`). The globally registered feature service reads the active flags. Mounting with `provide.feature` inside a test using `it.activeFeatureFlags()` throws.
3. `it.deprecated()` means "this disappears with that version", not "this currently fails". The test is skipped once the flag is active and its registered name gains a `(removed in <version>)` suffix.

## Essential identifiers

- `it.activeFeatureFlags(flags)(name, fn)` and `.each(rows)`
- `it.deprecated(version)(name, fn)`
- `global.activeFeatureFlags`
- injected `feature` service, `isActive(flagName)`

## Gotchas

- A test's flag context is only visible on its `it` line, not in the body — but it applies to hooks that run before the callback too.
- Specs still using manual flag mutation or a local `feature` mock keep working; the shadowing check only fires when both styles are combined in one test.
- Pair `@deprecated tag:v6.8.0` comments with `it.deprecated('v6.8.0.0')` so major cleanup is a search.
- The ADR says the feature service normalises both `v6.8.0.0` and `V6_8_0_0`; in installed 6.7.13.0 `Feature.isActive` in `src/core/feature.ts` only upper-cases the name.
- The helpers and custom Jest environment live in the Administration test setup outside `src`, so they were not checked against the installed code.

## Code check (6.7.13.0)
- unverified `it.activeFeatureFlags()` — Jest helper in Administration test setup, outside the checked `src` root
- unverified `it.deprecated()` — Jest helper in Administration test setup, outside the checked `src` root
- unverified `global.activeFeatureFlags` — Jest global, not referenced in Administration `src`
- confirmed `FeatureService::isActive()` — injected `feature` service delegates to `Feature` — vendor/shopware/administration/Resources/app/administration/src/app/service/feature.service.ts:20
- corrected `Feature::isActive()` — docs: normalises `v6.8.0.0` and `V6_8_0_0`; installed code only calls `toUpperCase()` — vendor/shopware/administration/Resources/app/administration/src/core/feature.ts:29
