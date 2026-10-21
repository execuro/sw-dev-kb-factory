---
id: platform/dev/6.7/resources/references/adr/2024-06-12-add-jest-runner-with-disabled-compat-mode.md
title: Add jest runner with disabled compat mode
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-06-12-add-jest-runner-with-disabled-compat-mode.html
sourceHash: 264c05b995917f650c3608d7870c94beef9923ad
codeCheckedAgainst: "6.7.15.1"
keywords: ["unit:disabled-compat", "unit-watch:disabled-compat", "admin:unit:disabled-compat", "admin:unit-watch:disabled-compat", "DISABLE_JEST_COMPAT_MODE", "@group disabledCompat", "compatUtils", "isCompatEnabled", "jest", "vue compat mode", "administration unit tests", "test runner"]
summary: "ADR: extra Jest runner for Administration tests without Vue compat mode; mark spec files with @group disabledCompat, run via unit:disabled-compat."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2024-06-12, area administration) that adds a second Jest runner, which runs the Administration component tests with the Vue compat mode disabled. Until then all component tests ran with compat mode enabled. To remove compat mode component by component, the tests also had to prove that they pass without it.

## When to use

Read it when you write or fix an Administration Jest spec that must pass without the Vue 3 compat mode, or when you see `@group disabledCompat` in a spec header and need to know what it does.

## Key steps / config

1. Run the tests without compat mode:
   - NPM scripts: `unit:disabled-compat`, `unit-watch:disabled-compat`
   - Composer wrappers: `admin:unit:disabled-compat`, `admin:unit-watch:disabled-compat`
   - These commands set the environment variable `DISABLE_JEST_COMPAT_MODE` to turn compat mode off.
2. Mark each spec file that works without compat mode with the `@group` tag `@group disabledCompat` in its header docblock:

```javascript
/**
 * @package admin
 * @group disabledCompat
 */
import { mount } from '@vue/test-utils';
```

3. CI has a separate pipeline stage for these tests, `Jest (Administration with disabled compat mode)`.
4. To make a component work in both modes, the ADR uses the `compatUtils` helper from `@vue/compat`, for example `compatUtils.isCompatEnabled('INSTANCE_LISTENERS')` to decide whether to return `this.$listeners` or `{}`.

## Essential identifiers

- `unit:disabled-compat`, `unit-watch:disabled-compat`
- `admin:unit:disabled-compat`, `admin:unit-watch:disabled-compat`
- `DISABLE_JEST_COMPAT_MODE`
- `@group disabledCompat`
- `compatUtils.isCompatEnabled()`

## Gotchas

- A marked test still runs with compat mode as well, in parallel. Marking a file adds the disabled-compat run; it does not replace the normal one.
- The planned follow-up was to fix components and tests so they also run without compat mode, mark the fixed tests, and finally remove compat mode from the Jest configuration.
- In the 6.7.15.1 Administration source, nothing imports `@vue/compat` and nothing calls `isCompatEnabled`. The dual-mode helper pattern is historical there. The `@group disabledCompat` markers are still present in spec files.

## Code check (6.7.15.1)
- confirmed `@group disabledCompat` — spec header tag still used — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/sw-block/sw-block.spec.js:3
- confirmed `@group disabledCompat` — also in TypeScript specs — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-block-override/shim/create-shim-slot.spec.ts:3
- unverified `DISABLE_JEST_COMPAT_MODE` — read by Jest config, outside the checked package roots
- unverified `unit:disabled-compat` — NPM script in package.json, outside the checked roots
- unverified `admin:unit:disabled-compat` — composer script, outside the checked roots
- unverified `compatUtils.isCompatEnabled()` — not found in admin src; @vue/compat not imported there
