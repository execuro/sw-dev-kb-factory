---
id: platform/dev/6.7/resources/references/adr/2024-06-12-add-jest-runner-with-disabled-compat-mode.md
title: Add jest runner with disabled compat mode
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2024-06-12-add-jest-runner-with-disabled-compat-mode.html
sourceHash: 264c05b995917f650c3608d7870c94beef9923ad
codeCheckedAgainst: "6.7.13.0"
keywords: ["jest", "vue compat mode", "@vue/compat", "compatUtils", "unit:disabled-compat", "unit-watch:disabled-compat", "admin:unit:disabled-compat", "admin:unit-watch:disabled-compat", "DISABLE_JEST_COMPAT_MODE", "@group disabledCompat", "administration unit tests", "vue 3 migration"]
summary: "ADR 2024-06-12: Jest runner without Vue compat mode for admin tests; unit:disabled-compat scripts, DISABLE_JEST_COMPAT_MODE, @group disabledCompat marker."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2024-06-12, area administration) adding a second Jest runner that executes Administration component tests with Vue compat mode disabled, so components can be migrated off compat mode one at a time.

## When to use

When fixing an Administration component or its Jest test to work without `@vue/compat`, and marking that test so it also runs in the compat-free pipeline stage.

## Key steps / config

1. Run tests without compat mode via the NPM scripts `unit:disabled-compat` and `unit-watch:disabled-compat`, or the composer wrappers `admin:unit:disabled-compat` and `admin:unit-watch:disabled-compat`. They set the environment variable `DISABLE_JEST_COMPAT_MODE`.
2. The CI pipeline has a stage `Jest (Administration with disabled compat mode)`.
3. Mark a test file as compat-free with the `@group disabledCompat` docblock tag:
   ```javascript
   /**
    * @package admin
    * @group disabledCompat
    */
   import { mount } from '@vue/test-utils';
   ```
4. To make a component work in both modes, branch with `compatUtils` from `@vue/compat`:
   ```javascript
   import { compatUtils } from '@vue/compat';
   if (compatUtils.isCompatEnabled('INSTANCE_LISTENERS')) {
       return this.$listeners;
   }
   return {};
   ```

## Essential identifiers

- `unit:disabled-compat`, `unit-watch:disabled-compat`
- `admin:unit:disabled-compat`, `admin:unit-watch:disabled-compat`
- `DISABLE_JEST_COMPAT_MODE`
- `@group disabledCompat`
- `compatUtils.isCompatEnabled('INSTANCE_LISTENERS')`

## Gotchas

- A test tagged `@group disabledCompat` still runs in the compat-mode runner as well.
- Planned follow-up: fix all components and tests, tag them, then remove compat mode from the Jest configuration.
- In the installed 6.7.13 Administration source, no `compatUtils`, `@vue/compat` import, `disabledCompat` tag or `DISABLE_JEST_COMPAT_MODE` reference was found; spec files, `package.json` and Jest config are not part of the checked source tree, so the runner itself could not be verified. A few legacy components still set `compatConfig: Shopware.compatConfig`.

## Code check (6.7.13.0)
- unverified `unit:disabled-compat` — NPM script lives in administration package.json, outside the checked source roots
- unverified `admin:unit:disabled-compat` — composer script of the monorepo, outside the checked roots
- unverified `DISABLE_JEST_COMPAT_MODE` — no occurrence in administration src; Jest config out of scope
- unverified `@group disabledCompat` — no occurrence in administration src; spec files not shipped
- unverified `compatUtils` — no occurrence in administration src; @vue/compat package out of scope
- confirmed `compatConfig` — legacy component still references Shopware.compatConfig — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-state-machine/page/sw-settings-state-machine-detail/index.js:13
- confirmed `$listeners` — template comment notes vue/compat removes listeners from attrs — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-text-field/sw-text-field.html.twig:1
