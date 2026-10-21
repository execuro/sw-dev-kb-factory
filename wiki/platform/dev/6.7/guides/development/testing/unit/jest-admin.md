---
id: platform/dev/6.7/guides/development/testing/unit/jest-admin.md
title: Jest Unit Tests in Shopware's Administration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html
sourceHash: af4683436390d196cac24b7520aba78204ea7293
codeCheckedAgainst: "6.7.15.1"
keywords: ["jest", "administration unit tests", "component tests", "@vue/test-utils", "Shopware.Component.build", "wrapTestComponent", "shallowMount", "composer run admin:unit", "admin:unit:watch", "admin:create:test", "global.activeAclRoles", "global.activeFeatureFlags", "global.repositoryFactoryMock", "stubs", "mocks"]
summary: Jest tests for Administration components and services - spec location, wrapTestComponent mounting, stubs, mocks, ACL/feature-flag/repository mocks.
lastBuilt: 2026-10-21
---
## What it is

Guide to writing Jest unit tests for Shopware Administration services, ES modules, and Vue components. Components cannot be imported as plain Vue components: they are registered on the global `Shopware` object and must be built through the component factory (which resolves Twig template inheritance, overrides and extensions) before mounting with Vue Test Utils.

## When to use

When adding or changing Administration JavaScript/TypeScript code (services, helpers, components) and you need a spec for it, or when debugging Vue warnings such as missing props, unknown custom elements, unresolved directives or missing injections in a test run.

## Key steps / config

1. **Location**: place the test next to the file under test, same name with suffix `.spec.js` or `.spec.ts` (e.g. `src/core/helper/sanitizer.helper.spec.js`).
2. **Boilerplate**: from the Shopware root run `composer run admin:create:test`, paste the path of the untested component/service; a `.spec` file with the recommended boilerplate is generated.
3. **Services / ES modules**: import directly and test like any Jest test, no mocking needed:
   `import Sanitizer from 'src/core/helper/sanitizer.helper';`
4. **Components**: build the component via the factory and mount it. In 6.7 core specs this is done with `wrapTestComponent` and Vue Test Utils `mount`/`shallowMount`, passing stubs under `global`:

```javascript
import { mount } from '@vue/test-utils';

async function createWrapper() {
    return mount(await wrapTestComponent('sw-multi-select', { sync: true }), {
        props: { options: [], value: '' },
        global: {
            stubs: { 'sw-select-base': await wrapTestComponent('sw-select-base'), 'sw-loader': true },
        },
    });
}
```

   `Shopware.Component.build('<name>')` is the underlying factory call that returns a native Vue component with the resolved template.
5. **Fix warnings**:
   - missing required prop → pass `props`;
   - `Unknown custom element` → stub the child (with a built component or a dummy);
   - `Failed to resolve directive: clipboard` → provide a directive mock;
   - `Injection "mediaService" not found` → provide the injection (`mediaService: {}` mutes it; give methods such as `renameMedia: () => Promise.resolve()` when the test calls them);
   - a service read via `Shopware.Service('mediaService')` → register a mock in `beforeAll` (the doc uses `Shopware.Service.register('mediaService', { /* mock */ })`);
   - `hasError is not a function` → add `hasError` to `mocks`.
6. **Run**: install dependencies first with `composer run init:js`, then `composer run admin:unit` (all tests + coverage) or `composer run admin:unit:watch` (changed files only, restarts on save). These scripts apply to the Shopware-provided Administration; plugins may need their own scripts.

Preconfigured test environment:

- ACL: `global.activeAclRoles = ['product.editor'];` — no ACL rights by default.
- Feature flags: `global.activeFeatureFlags = ['FEATURE_NEXT_12345'];`
- Repository factory works by default (generated from the entity schema); unmocked routes print a hint. Add responses with:

```javascript
global.repositoryFactoryMock.responses.addResponse({
    method: 'Post', url: '/search/product', status: 200,
    response: { data: [{ id: '...', attributes: { id: '...' } }] },
});
global.repositoryFactoryMock.showWarning = false;
```

- All global directives and filters are registered; some services have mock alternatives (a console warning names missing ones); the `Shopware` context is prepared (override via `Shopware.Store`); `$tc`, `$device`, `$store`, `$router` are auto-mocked. Everything can be overridden in the `mount`/`shallowMount` options.

## Essential identifiers

- `Shopware.Component.build()`, `Shopware.Service`, `Shopware.Store`
- `wrapTestComponent`, `mount`, `shallowMount` (`@vue/test-utils`), `flushPromises`
- `composer run admin:create:test`, `composer run admin:unit`, `composer run admin:unit:watch`, `composer run init:js`
- `global.activeAclRoles`, `global.activeFeatureFlags`, `global.repositoryFactoryMock`

## Gotchas

- The doc's examples use Vue Test Utils v1 idioms (`createLocalVue`, top-level `stubs`, `wrapper.destroy()`, `localVue.directive(...)`). 6.7 core specs pass stubs under `global` and build components with `wrapTestComponent`; `createLocalVue` appears in only one core spec.
- Importing a component's `index.js` does not register it: `index.js` only exports the component config, and `Shopware.Component.register('sw-multi-select', ...)` happens centrally with an async import in `src/app/component/index.ts`.
- The doc's `sw-alert` slot example is outdated: `sw-alert` is deprecated (`tag:v6.8.0`, use `mt-banner`) and renders `mt-banner`, so asserting `.sw-alert__message` does not match current markup.
- Repository mock responses must match the real backend API response; inspect the real API response in the Administration to copy the shape.

## Code check (6.7.15.1)
- confirmed `Shopware.Component.build` — `Component.build` maps to `AsyncComponentFactory.build` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:138
- corrected `Shopware.Component.register('sw-multi-select'` — docs: registered by the component's own `index.js`; actually registered centrally with async import — vendor/shopware/administration/Resources/app/administration/src/app/component/index.ts:329
- confirmed `Shopware.Service` — `Service` is the `ServiceFactory`; `.register` signature not checked — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:221
- confirmed `wrapTestComponent` — global test helper `(componentName, { sync? }) => Promise<VueComponent>` — vendor/shopware/administration/Resources/app/administration/src/global.types.ts:516
- corrected `global` — docs: `stubs` at top level of mount options; core specs nest them under `global` — vendor/shopware/administration/Resources/app/administration/src/app/component/form/select/base/sw-multi-select/sw-multi-select.spec.js:9
- deprecated `sw-alert` — `@deprecated tag:v6.8.0`, use `mt-banner` — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-alert/index.ts:10
- corrected `mt-banner` — docs: assert text in `.sw-alert__message`; sw-alert now renders `mt-banner` — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-alert/sw-alert.spec.js:23
- confirmed `global.repositoryFactoryMock` — `responses.addResponse` used in core specs — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-customer-group/page/sw-settings-customer-group-create/sw-settings-customer-group-create.spec.js:134
- unverified `global.activeAclRoles` — defined in the Administration `test/` setup, outside the checked roots
- unverified `composer run admin:unit` — composer script in the repository root, outside the checked roots
