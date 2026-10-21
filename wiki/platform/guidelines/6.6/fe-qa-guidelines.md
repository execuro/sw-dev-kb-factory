---
id: platform/guidelines/6.6/fe-qa-guidelines.md
title: Frontend QA guidelines
docType: guideline
version: "6.6"
summary: Rules for admin Jest specs, storefront Jest plugin tests, admin ESLint and end-to-end tests in Shopware 6.6.
keywords: ["jest", "vue test utils", "administration", "storefront", "eslint", "e2e", "cypress", "fixtures", "selectors", "test isolation", "mocks", "acl"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html", hash: "a7fa6b7ad13d1a533cdba26df105890bf05fbd1495b1f36810fad5847dd75d23"}, {url: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/jest-admin.html", hash: "3506a1198bdc840ae443e0c4f3c4cc8cf569e34c83ebfdf407c25b9c48c18cd0"}, {url: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/jest-storefront.html", hash: "d51a483830d31c7234c00a2244948ae90570a50fbf8312f3118724c832ee3ceb"}, {url: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/end-to-end-testing.html", hash: "b22c248daa171ccfb660b51445369bf2608ceca95e6927e3992a66b4fcbe24ee"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/testing/e2e-best-practises.html", hash: "047f44990b2d5ec369c2d1524329a25b6bdaee0843e87a4045f5229e5fae506d"}]
codeVersion: "6.6.10.29+c8b59f9d"
lastBuilt: 2026-10-21
---

## admin jest specs

- Write a unit test for every functional change in the Administration.
- Place the spec next to the file under test, same file name with suffix `.spec.js` or `.spec.ts`.
- Generate the boilerplate with `composer run admin:create:test` (platform repo); run with `composer run admin:unit` (full run with coverage) or `composer run admin:unit:watch` (changed files only) — these scripts cover the core Administration only; a plugin needs its own Jest scripts.
- Test services, helpers and plain ES modules by importing them directly; no mocking needed.
- Test components by input and output: set props and assert rendered DOM, interact with the DOM and assert the behaviour.

Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/jest-admin.html

## admin component mounting

- Mount through the component registry, never by importing the raw options object: in 6.6 specs use `mount(await wrapTestComponent('<component-name>', { sync: true }), { global: { … } })` from `@vue/test-utils`. The build step (`Shopware.Component.build`) resolves template inheritance, overrides and extensions, which a raw import skips.
- Put `stubs`, `mocks` and `provide` inside the `global` mounting option (Vue Test Utils 2 shape). Do not use `createLocalVue` or a top-level `stubs`/`mocks` key — that is the Vue 2 shape shown in older docs.
- Stub child components you do not exercise (`'sw-icon': true` or `{ template: '<div><slot /></div>' }`); pass the real built component only when the test needs its behaviour.
- Pass every required prop so the mount emits no `Missing required prop` warning.
- Provide injected services with the methods the component actually calls (e.g. `mediaService: { renameMedia: () => Promise.resolve() }`); an empty object is acceptable only to silence an unused injection.
- For code that calls `Shopware.Service('name')` directly, register a mock service in `beforeAll` via `Shopware.Service().register('name', …)`.
- Await asynchronous setup (`flushPromises()`) before asserting.

Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/jest-admin.html

## admin preconfigured mocks

- Set ACL privileges per test with `global.activeAclRoles = ['product.editor']`; the default is no privileges. Reset it in `beforeEach`.
- Enable feature flags per test with `global.activeFeatureFlags = ['…']`, and reset it afterwards.
- Answer repository requests with `global.repositoryFactoryMock.responses.addResponse({ method, url, status, response })`; the response must match the real Admin API payload — copy it from the browser network tab. Silence the unmocked-route notice with `global.repositoryFactoryMock.showError = false`.
- Global directives, filters, the `Shopware` context and mocks such as `$tc`, `$router`, `$store` are prepared automatically; override them in the mounting options only when the test needs a custom behaviour.

Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/jest-admin.html

## storefront jest tests

- Place storefront tests under `Resources/app/storefront/test/`, mirroring the source path, and keep the location consistent with your `package.json` Jest config.
- Import helpers directly (e.g. `src/helper/feature.helper`) and set fixtures in `beforeEach` (`Feature.init({...})`, then assert `Feature.isActive(...)`).
- For JS plugins (classes extending `src/plugin-system/plugin.class`) add `@jest-environment jsdom`, mock `window.PluginManager` with `getPluginInstancesFromElement` (returning a `Map`) and `getPlugin`, and construct the plugin on a `document.createElement('div')` element.
- Reset the plugin instance in `afterEach` (`plugin = null`) so every test is isolated.
- Run core storefront tests with `composer run storefront:unit`; plugins need their own scripts.

Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/jest-storefront.html

## admin eslint

- Keep the Administration ESLint-clean; it runs in CI.
- In `*.js`: declare a type for every prop (`vue/require-prop-types`), give optional props a default (`vue/require-default-prop`), name components in kebab-case (`vue/component-definition-name-casing`).
- In `*.html.twig`: use kebab-case component names and hyphenated attributes, self-close empty components (`<sw-language-switcher />`), and put each attribute on its own line once there is more than one.
- Do not indent content inside `{% block %}` relative to the block tag — Twig is turned into HTML comments for linting, so blocks do not count for indentation.
- Always write a space before `%}` (`{% block block_name %}`); `block_name%}` breaks parsing and floods the file with errors.
- `max-len` is not enforced in `*.spec.js`.
- Disable a template rule only deliberately and locally, never to silence the linter wholesale.

Enforced by: ESLint
Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html

## e2e test selection

- Write few, well-chosen E2E tests: cover the happy path and the critical, most damaging-if-broken workflows.
- Do not duplicate unit coverage: test the UI reaction to a failed validation, not the validation itself.
- Write each test workflow-based, from the user's point of view, not the developer's.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/testing/e2e-best-practises.html

## e2e test structure and isolation

- One test, one workflow. Create everything else (sales channels, products, categories, login) via API in `beforeEach`, not through the UI.
- Run against a clean installation without demo data, in production mode, with a theme assigned to the sales channel.
- Keep tests independent so they can run alone or in any order; never rely on state left by a previous test.
- Clean up in `before`/`beforeEach`, not `after`/`afterEach` — an `after` hook is not guaranteed to run when a test fails.
- Use `describe()` and `it()` (not `context()`/`specify()`) and BDD-style `should`/`expect` assertions.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/testing/e2e-best-practises.html
Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/end-to-end-testing.html

## e2e fixtures

- Store static test data as JSON in `cypress/fixtures` and create it with `cy.createDefaultFixture('<endpoint>')` from the `@shopware-ag/e2e-testsuite-platform` package.
- For entities that need existing IDs, write a fixture service extending `AdminFixtureService` that searches the IDs, merges them with `mergeFixtureWithData`, and posts via `this.apiClient`.
- Use only fields reachable in the UI/Storefront in fixtures, and keep a fixture compatible with every test in its file.
- Never use UUIDs as selectors or hard-coded references; they change between installations.
- Look up required entity fields in the matching `*Definition` (e.g. `CustomerDefinition`).

Read more: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/testing/end-to-end-testing.html

## e2e selectors and waiting

- Do not use XPath or framework classes (`.btn-primary`, `[data-toggle="modal"]`, `.custom-checkbox`) as selectors; use Shopware-specific classes such as `.btn-buy` or `.checkout-confirm-tos-label`, and add a descriptive class when none exists.
- Never wait for fixed times (`cy.wait(500)`). Wait on an assertion (`.should('be.visible')`) or on an aliased network request (`cy.wait('@alias')`).
- Wrap vanilla JavaScript in `.then()` or a custom command so it runs inside the Cypress command queue.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/testing/e2e-best-practises.html

## Code check (6.6.10.29+c8b59f9d)

- confirmed `build` — component build resolving overrides and extensions — administration/core/factory/async-component.factory.ts:690
- corrected `shallowMount(Shopware.Component.build(...))` — code uses `mount(await wrapTestComponent(...), { global })` instead, administration/module/sw-settings-number-range/page/sw-settings-number-range-detail/sw-settings-number-range-detail.spec.js:8
- corrected `repositoryFactoryMock.showWarning` — code uses `repositoryFactoryMock.showError` instead, administration/module/sw-sales-channel/view/sw-sales-channel-detail-base/sw-sales-channel-detail-base.spec.js:86
- confirmed `global.activeAclRoles` — per-test ACL fixture — administration/module/sw-settings-number-range/page/sw-settings-number-range-detail/sw-settings-number-range-detail.spec.js:101
- confirmed `Feature.init` — storefront feature helper init — storefront/Resources/app/storefront/src/helper/feature.helper.js:60
- confirmed `Feature.isActive` — storefront feature helper check — storefront/Resources/app/storefront/src/helper/feature.helper.js:71
- confirmed `getPluginInstancesFromElement` — called by the plugin base class on construction — storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:122
