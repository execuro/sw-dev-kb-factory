---
id: platform/dev/6.6/resources/references/adr/2024-06-12-add-jest-runner-with-disabled-compat-mode.md
title: Add jest runner with disabled compat mode
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2024-06-12-add-jest-runner-with-disabled-compat-mode.html"
sourceHash: "264c05b995917f650c3608d7870c94beef9923ad"
keywords: ["Jest", "compat mode", "unit:disabled-compat", "unit-watch:disabled-compat", "admin:unit:disabled-compat", "DISABLE_JEST_COMPAT_MODE", "disabledCompat group", "compatUtils", "@vue/compat", "administration unit tests", "pipeline stage"]
summary: "ADR adding a second Jest runner (`unit:disabled-compat`) plus `@group disabledCompat` marker to test administration components without Vue compat mode."
lastBuilt: "2026-09-15"
---
## What it is
This ADR documents adding a second Jest test runner that executes the administration's component unit tests with Vue compat mode disabled, alongside the existing compat-mode runner.

## When to use
Relevant when writing or fixing a Jest unit test for an administration component being migrated off Vue compat mode, or when configuring the CI pipeline stage that runs tests without compat mode.

## Key steps / config
- New NPM script commands: `unit:disabled-compat` and `unit-watch:disabled-compat`; corresponding composer commands `admin:unit:disabled-compat` and `admin:unit-watch:disabled-compat`.
- These commands use the environment variable `DISABLE_JEST_COMPAT_MODE` to turn off compat mode for the test run.
- A new pipeline stage, `Jest (Administration with disabled compat mode)`, runs this variant in CI.
- A test file is marked as compat-mode-free by adding a `@group disabledCompat` tag in its docblock:

```javascript
/**
 * @package admin
 * @group disabledCompat
 */
import { mount } from '@vue/test-utils';
async function createWrapper() {
...
```

- To support both modes in one component, tests can branch on `compatUtils.isCompatEnabled(...)` from `@vue/compat`, e.g. checking `'INSTANCE_LISTENERS'` and falling back to `{}` when compat is disabled.
- Tests tagged `disabledCompat` continue to also run under the normal compat-mode runner in parallel.

## Essential identifiers
- `@group disabledCompat`
- `DISABLE_JEST_COMPAT_MODE`
- `compatUtils.isCompatEnabled()` (from `@vue/compat`)

## Gotchas
A test file must be explicitly tagged `@group disabledCompat` and fixed to pass without compat mode before it is meaningfully covered — untagged tests keep running only under the original compat-mode runner, and the compat-mode Jest configuration is removed only once every test is fixed and tagged.
