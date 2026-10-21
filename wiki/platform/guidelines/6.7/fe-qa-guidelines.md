---
id: platform/guidelines/6.7/fe-qa-guidelines.md
title: Frontend QA guidelines
docType: guideline
version: "6.7"
summary: Rules for Administration and Storefront Jest tests, admin template linting, and Playwright e2e tests with the Shopware Acceptance Test Suite.
keywords: ["jest", "vue test utils", "wraptestcomponent", "administration testing", "storefront testing", "eslint", "twig linting", "playwright", "acceptance test suite", "fixtures", "testdataservice", "test isolation"]
sources: [{url: "code:administration/Resources/app/administration/technical-docs/07-testing/**", hash: "524ca568868967bb5242a755e23f50af2e267a0788c2d704ab36a9db49c8d621"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html", hash: "a7fa6b7ad13d1a533cdba26df105890bf05fbd1495b1f36810fad5847dd75d23"}, {url: "https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html", hash: "d6f0f5e6d026494f076c0366bf446f78e34d1eebcdc16f9045263b5a29445974"}, {url: "https://developer.shopware.com/docs/guides/development/testing/unit/jest-storefront.html", hash: "e61b7a80b044242d68e41f221703ad2da29e3814351bb849a0265b936930408f"}, {url: "https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/", hash: "7e26fe2d97046b084f0a4029a321db936aad3324a797ab428e1c6b45aac36fc5"}, {url: "https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/install-configure.html", hash: "96f43d5f9461469a9fa8f2d6629f936cf03192bcc9fa759d3764d76fa9d178ef"}, {url: "https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/test.html", hash: "be943bf76574885bc3c7356baa10e4e088600a8eade5d08ebfebd0d2faf00572"}, {url: "https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/fixtures.html", hash: "86356ff2e77fa50e6ecd28436e4410218c4a28e44b7376d7c548e1ec0ae90582"}, {url: "https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/best-practices.html", hash: "5a17ba514c1e9a26eb94da5cfbf4c25c4fa1b8975a1c8ddecc04f61f495e7695"}]
codeVersion: "6.7.15.1+7d4303db"
lastBuilt: 2026-10-21
---

## admin jest tests

- Write a Jest unit test for every functional change in the Administration.
- Co-locate the spec with the code: `sw-button/index.js` gets `sw-button/sw-button.spec.js` or `.spec.ts` (pattern `src/**/*.spec.{js,ts}`).
- Run `composer run admin:unit` (full suite, coverage) or `composer run admin:unit:watch`; run `npm run unit-setup` once first. Scaffold a spec with `composer run admin:create:test`.
- Mount via `mount(await wrapTestComponent('sw-name', { sync: true }), {...})`, never the raw component object — components are built at runtime by the component factory, so overrides only resolve through it.
- Create the wrapper in an `async function createWrapper()`, fresh per test in `beforeEach`; `await flushPromises()` after mounting and interactions.
- Put stubs, mocks and provides under `global` (`global: { stubs: { 'mt-button': true } }`), props under `props`. Stub children you do not assert on.
- Assert on rendered DOM for given props/slots and after DOM interaction, not on internals.
- Provide each injection the component uses with realistic method stubs (`mediaService: { renameMedia: () => Promise.resolve() }`).
- Test services, helpers and ES modules by importing them directly (`import Sanitizer from 'src/core/helper/sanitizer.helper'`).

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html

## admin mocks and globals

- Set ACL roles per test with `global.activeAclRoles = ['product.editor']`; the suite has no ACL rights by default.
- Enable feature flags per test with `it.activeFeatureFlags(['v6.8.0.0'])('...', async () => {})`.
- Mock repository calls with `global.repositoryFactoryMock.responses.addResponse({ method: 'Post', url: '/search/product', status: 200, response: { data: [] } })`, shaped like the real Admin API response.
- Register missing services in `beforeAll` with `Shopware.Service().register('name', () => ({ method: jest.fn() }))`.
- Rely on the preconfigured mocks (`$tc`, `$router`, directives, filters); override them in mount options only when needed.

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html

## admin template linting

- Keep ESLint green for scripts and `*.html.twig`; it runs in CI.
- Declare prop types (`vue/require-prop-types`), default optional props (`vue/require-default-prop`), and name components in kebab-case (`vue/component-definition-name-casing`).
- In templates use kebab-case component names, hyphenated attributes (`hello-world=""`), self-closing empty components (`<sw-language-switcher />`), and one attribute per line once there is more than one.
- Do not indent markup relative to an enclosing `{% block %}` tag; Twig is turned into HTML comments for linting and does not count for indentation.
- Write `{% block block_name %}` with the space before `%}`; without it the file fails with `invalid-x-end-tag`.
- Disable a rule only locally and with a reason. `max-len` does not apply to spec files.

Enforced by: ESLint

Read more: https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html

## storefront jest tests

- Place tests under `Resources/app/storefront/test/`, mirroring the source path, named `<file>.test.js` (`test/helper/feature.helper.test.js`). In a plugin, follow the test path its `package.json` Jest config declares.
- Import modules directly and set fixtures in `beforeEach` (`Feature.init({ test1: true })`, then assert `Feature.isActive('test1')`).
- For JS plugin tests add the `@jest-environment jsdom` docblock and mock `window.PluginManager` (`getPluginInstancesFromElement` returning a `Map`, plus `getPlugin`) before constructing the plugin on a created element — the `Plugin` base class registers itself through it.
- Set the plugin instance to `null` in `afterEach`.
- Run the core suite with `composer run storefront:unit`.

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/jest-storefront.html

## playwright e2e setup

- Write e2e tests with Playwright and `@shopware-ag/acceptance-test-suite`; set `"type": "module"` in `package.json`.
- Keep one base test file (`export * from '@shopware-ag/acceptance-test-suite'`, `export const test = base.extend<FixtureTypes>({ ... })`) and import `test`/`expect` from it in every spec.
- Configure `APP_URL` in `.env`; prefer integration credentials (`SHOPWARE_ACCESS_KEY_ID`, `SHOPWARE_SECRET_ACCESS_KEY`) over `SHOPWARE_ADMIN_USERNAME`/`SHOPWARE_ADMIN_PASSWORD`. Set `baseURL: process.env['APP_URL']` in `playwright.config.ts`.
- For mail tests set `MAILPIT_BASE_URL` to a running Mailpit.

Read more: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/install-configure.html
Read more: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/

## playwright fixtures

- Request fixtures as test arguments: `DefaultSalesChannel` (worker-scoped; `salesChannel`, `customer`, `url`), `AdminApiContext` (authenticated Admin API client), `StoreApiContext` (Store API client, not logged in), `AdminPage`, `StorefrontPage`.
- Call `StoreApiContext.login(DefaultSalesChannel.customer)` when the scenario needs a logged-in customer.
- Prefer page objects over raw `AdminPage.locator(...)` calls.
- In the suite itself, add fixtures under `src/fixtures`, merge them in `src/index.ts`, and test new page objects and `TestDataService` methods in its `tests` folder.

Read more: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/fixtures.html
Read more: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/test.html

## playwright best practices

- Keep each test isolated so it runs in parallel against a shop in unknown state.
- Create all needed data (sales channels, customers, users) with `TestDataService`, which also cleans it up.
- Set required settings on the test's own sales channel, customer or user; never change global settings (tax, search).
- Do not rely on existing data or implicit configuration (rules, flows, categories) or on `en_GB`/`EUR` defaults.
- Open entities by their created ID or a unique name; never assume a list or API result holds one item.
- Remove fixtures the test does not use.
- Reference the blocking GitHub issue in the `test.skip(...)` reason.
- Move credential steps into a setup project with `trace: 'off'` listed in the test project's `dependencies`.
- Debug failed API calls by logging `errors[0]` of the JSON response.

Read more: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/best-practices.html

## Code check (6.7.15.1+7d4303db)

- confirmed `wrapTestComponent` — mounting helper with `global.stubs` — administration/app/component/base/sw-button/sw-button.spec.js:8
- confirmed `global.activeAclRoles` — per-test ACL roles — administration/app/component/media/sw-media-media-item/sw-media-media-item.spec.js:82
- corrected `global.activeFeatureFlags` — code uses `it.activeFeatureFlags([...])` instead, administration/module/sw-settings-shipping/component/sw-settings-shipping-price-matrix/sw-settings-shipping-price-matrix.spec.js:114
- confirmed `global.repositoryFactoryMock.responses` — repository response mocking — administration/module/sw-product-stream/page/sw-product-stream-detail/sw-product-stream-detail.spec.js:8
- corrected `Shopware.Service.register` — code uses `Shopware.Service().register` instead, administration/module/sw-product/helper/sw-products-variants-generator.spec.js:25
- confirmed `Feature.init` — static fixture setup on the Storefront feature helper — storefront/Resources/app/storefront/src/helper/feature.helper.js:60
- confirmed `getPluginInstancesFromElement` — called via `window.PluginManager` on registration — storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:168
- unverified `@shopware-ag/acceptance-test-suite` — external npm package, not in this code root
