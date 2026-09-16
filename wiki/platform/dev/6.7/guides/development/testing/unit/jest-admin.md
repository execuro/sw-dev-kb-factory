---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/development/testing/unit/jest-admin.md
sourceHash: af4683436390d196cac24b7520aba78204ea7293
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html
title: Jest Unit Tests in Shopware's Administration
version: "6.7"
versions:
  - "6.7"
keywords: ["jest", "administration unit tests", "admin tests", "vue test utils", "shallowMount", "Shopware.Component.build", "composer run admin:unit", "admin:unit:watch", "admin:create:test", "global.activeAclRoles", "global.activeFeatureFlags", "repositoryFactoryMock", "stubs", "mocks", "spec file"]
summary: "Jest unit tests for Administration code: .spec placement, Shopware.Component.build with shallowMount, stubs/mocks, ACL and feature-flag test globals."
lastBuilt: 2026-09-15
---
## What it is

Guide to writing and running Jest unit tests for Shopware Administration code: isolated services/ES modules and Vue components built through the global `Shopware.Component` factory, plus the preconfigured mocks the Admin test suite provides.

## When to use

When adding or changing Administration JavaScript/TypeScript (components, services, helpers) and a unit test must cover the change, or when a component test throws Vue warnings about missing props, components, directives, or injections.

## Key steps / config

1. **Location**: put the test next to the tested file, same name with suffix `.spec.js` or `.spec.ts`.
2. **Services / ES modules**: import directly and test like any Jest code, e.g. `import Sanitizer from 'src/core/helper/sanitizer.helper';` then `expect(Sanitizer.sanitize('<details open ontoggle=confirm()>')).toBe('<details open=""></details>')`.
3. **Boilerplate**: in the Shopware root run `composer run admin:create:test` and paste the path of the untested component/service; it generates a `.spec` file with the recommended boilerplate.
4. **Dependencies**: `composer run init:js`.
5. **Run**: `composer run admin:unit` (all tests + coverage); `composer run admin:unit:watch` (changed files, re-runs on save). These scripts apply to the Shopware-provided Administration; plugins may need their own scripts.
6. **Mount components** via the factory, not a direct component import. `Shopware.Component.build()` resolves the Twig template and all overrides/extensions into a Vue component; in 6.7 it is `async` and returns a Promise, so await it:

```typescript
async function createWrapper() {
    return shallowMount(await Shopware.Component.build('sw-your-component-for-test'), {
        props: { /* required props */ },
        stubs: { 'sw-missing-component-one': await Shopware.Component.build('sw-missing-component-one') },
        mocks: { /* add mocks if needed */ },
        attachTo: document.body, // needed if you interact with elements
    });
}
```

   Prefer `shallowMount()` (children stubbed) over `mount()`. In `beforeEach` create the wrapper and `await flushPromises()`; in `afterEach` tear the wrapper down and flush again. A first test: `expect(wrapper.vm).toBeTruthy()`.
7. **Fix Vue warnings**:
   - `Missing required prop: "options"` → pass the props.
   - `Unknown custom element: <sw-select-base>` → stub it, with a dummy or with `Shopware.Component.build('sw-select-base')` when the real child is needed.
   - `Error in render: "TypeError: hasError is not a function"` → add a mock, e.g. `hasError: () => false`.
   - `Failed to resolve directive: clipboard` → provide a directive mock.
   - `Injection "mediaService" not found` → `provide: { mediaService: {} }` mutes it; a realistic stub mocks the used methods, e.g. `mediaService: { renameMedia: () => Promise.resolve() }`. If code calls `Shopware.Service('mediaService')`, register a mock in `beforeAll` with `Shopware.Service.register('mediaService', { ... })`.
8. **Slots**: mount with `slots: { default: 'My custom message' }` and assert the rendered text.

Preconfigured test environment:

- ACL: `global.activeAclRoles = ['product.editor']` (default: no rights).
- Feature flags: `global.activeFeatureFlags = ['FEATURE_NEXT_12345']`.
- Repository factory works by default (generated from the entity schema); unmocked routes log a hint. Add responses via `global.repositoryFactoryMock.responses.addResponse({ method, url, status, response: { data: [...] } })`; silence with `global.repositoryFactoryMock.showWarning = false`.
- Global directives and filters are registered; some services have mocks (missing ones warn); the `Shopware` context is prepared (override in `Shopware.Store`); `$tc`, `$device`, `$store`, `$router` are auto-mocked. Everything can be overridden in the `mount`/`shallowMount` options.

## Essential identifiers

- `Shopware.Component.build()`, `Shopware.Component.register()`
- `Shopware.Service.register()`, `Shopware.Store`
- `shallowMount`, `mount` (`@vue/test-utils`), `flushPromises`
- `composer run admin:unit`, `composer run admin:unit:watch`, `composer run admin:create:test`, `composer run init:js`
- `global.activeAclRoles`, `global.activeFeatureFlags`, `global.repositoryFactoryMock`

## Gotchas

- The 6.7 Administration boots with Vue 3 (`createApp` from `vue`). The source's snippets still use Vue 2-era Vue Test Utils helpers such as `createLocalVue`, `localVue.directive()` and `wrapper.destroy()`, and some call `Shopware.Component.build()` without `await`; check these against the `@vue/test-utils` version your Jest setup uses.
- Importing `src/app/component/form/select/base/sw-multi-select` (its `index.js`) does not register the component in 6.7: the file only `export default`s the config. Registration happens lazily in `src/app/component/index.ts` via `Shopware.Component.register('sw-multi-select', () => import(...))`.
- `sw-alert` now renders `mt-banner` by default; the `.sw-alert__message` element used in the source's slot example exists only in the `sw-alert-deprecated` template.

## Code check (6.7.13.0)
- confirmed `build` — `async function build(componentName, skipTemplate)` returns a Promise — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:709
- corrected `sw-multi-select` — docs: side-effect import of the component file registers it; registration is in the component index with a lazy import — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:325
- confirmed `sanitize` — `Sanitizer.sanitize(dirtyHtml, config)` wraps DOMPurify — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.js:98
- corrected `sw-alert__message` — docs: rendered by `sw-alert`; only in `sw-alert-deprecated` — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-alert-deprecated/sw-alert-deprecated.html.twig:35
- confirmed `mt-banner` — default render of `sw-alert` — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-alert/sw-alert.html.twig:2
- confirmed `renameMedia` — `mediaService` API method — vendor/shopware/administration/Resources/app/administration/src/core/service/api/media.api.service.js:285
- confirmed `createApp` — Administration runs on Vue 3 — vendor/shopware/administration/Resources/app/administration/src/app/adapter/view/vue.adapter.ts:128
- unverified `global.activeAclRoles` — Jest setup lives in the Admin `test/` folder, outside the scanned roots
- unverified `createLocalVue` — `@vue/test-utils` package, out of scope
- unverified `composer run admin:unit` — composer script of the development template, out of scope
