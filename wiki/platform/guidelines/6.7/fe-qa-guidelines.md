---
id: platform/guidelines/6.7/fe-qa-guidelines.md
title: Frontend QA guidelines
docType: guideline
version: "6.7"
summary: Rules for Administration Jest tests, Storefront Jest tests, Administration ESLint and Playwright e2e with the Shopware Acceptance Test Suite.
keywords: ["jest", "vue test utils", "administration", "storefront", "eslint", "twig-vue", "playwright", "acceptance test suite", "fixtures", "testdataservice", "e2e", "unit tests"]
sources: [{url: "code:administration/Resources/app/administration/technical-docs/07-testing/**", hash: "b3fd893024c1e3bcb2f90f7e5fb25aae83dd446c31641f549f2c22e3ff5cb30f"}, {url: "https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html", hash: "a7fa6b7ad13d1a533cdba26df105890bf05fbd1495b1f36810fad5847dd75d23"}, {url: "https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html", hash: "d6f0f5e6d026494f076c0366bf446f78e34d1eebcdc16f9045263b5a29445974"}, {url: "https://developer.shopware.com/docs/guides/development/testing/unit/jest-storefront.html", hash: "e61b7a80b044242d68e41f221703ad2da29e3814351bb849a0265b936930408f"}, {url: "https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/", hash: "7e26fe2d97046b084f0a4029a321db936aad3324a797ab428e1c6b45aac36fc5"}, {url: "https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/install-configure.html", hash: "96f43d5f9461469a9fa8f2d6629f936cf03192bcc9fa759d3764d76fa9d178ef"}, {url: "https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/test.html", hash: "be943bf76574885bc3c7356baa10e4e088600a8eade5d08ebfebd0d2faf00572"}, {url: "https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/fixtures.html", hash: "86356ff2e77fa50e6ecd28436e4410218c4a28e44b7376d7c548e1ec0ae90582"}, {url: "https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/best-practices.html", hash: "5a17ba514c1e9a26eb94da5cfbf4c25c4fa1b8975a1c8ddecc04f61f495e7695"}]
codeVersion: "6.7.13.0+8da531fe"
lastBuilt: 2026-09-15
---

## admin jest setup

- Write a Jest test for every functional Administration change. Name new specs `<name>.spec.ts`; Jest only matches `src/**/*.spec.{js,ts}` and `src/**/*.spec/*.spec.{js,ts}`.
- Split a large spec into a `<name>.spec/` directory, one file per behaviour group (warning at 500 lines, error at 1000).
- Stack: Jest 30, `@vue/test-utils` 2.x, Vue 3, `jsdom`. Never copy Vue 2 APIs (`createLocalVue`, `localVue`).
- `clearMocks` and `restoreMocks` are on; never rely on mock state across tests.
- Platform repo: run `npm run unit-setup` once (generates the component import map `jest.config.js` needs), then `composer run admin:unit` (or `admin:unit:watch`); single spec: `npx jest --collectCoverage=false <path>`; boilerplate: `composer run admin:create:test`. A plugin needs its own Jest scripts.

Enforced by: ESLint
Read more: https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html

## admin component tests

- Mount via `wrapTestComponent('<component-name>', { sync: true })` and `mount` from `@vue/test-utils`; it resolves Twig inheritance and overrides like `Shopware.Component.build()`, a plain Vue import does not.
- Wrap the mount in `async function createWrapper(options = {})` and `await flushPromises()` after it.
- Test input/output: set props or slots, interact with the DOM, assert on rendered DOM and behaviour.
- Stub children you do not assert on (`'sw-icon': true`). Import services and ES modules (e.g. `src/core/helper/sanitizer.helper`) directly.
- Top-level `describe`/`it` (not `test`), hooks first in lifecycle order, at least one `expect` per test, `await` every async call, no disabled tests.

Enforced by: ESLint
Read more: https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html

## admin preconfigured mocks

- ACL: `global.activeAclRoles = ['product.editor']` per test (default: no rights). Feature flags: `global.activeFeatureFlags = ['FEATURE_...']`.
- Mock repository calls with `global.repositoryFactoryMock.responses.addResponse({ method, url, status, response })`, matching the real Admin API payload shape.
- Register missing services with `Shopware.Service.register('<name>', () => ({ ... }))`, with realistic method mocks (`renameMedia: () => Promise.resolve()`), not `{}`.
- Directives, filters, `Shopware` and `$tc`, `$router`, `$store`, `$device` are preregistered; override one only in that test's mount options.

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html

## admin eslint

- ESLint on `src` (JS, TS, `*.html.twig`) runs in CI and blocks the change.
- Props: declare a type for each, a default for optional ones, `false` for booleans; never mutate props (`vue/no-mutating-props` is `error`). Kebab-case component names.
- Twig: the `twig-vue` processor turns Twig into HTML comments, so indent inner markup at the `{% block %}` level. Write `{% block block_name %}` with spaces; `{% block block_name%}` breaks parsing.
- Templates: kebab-case tags, hyphenated attributes, self-close components (`<sw-language-switcher />`) but never plain HTML elements, one attribute per line once there are several.
- Inline `eslint-disable` does not work in Twig files (shifted line numbers); fix the violation. `max-len` is off only in specs and templates.

Enforced by: ESLint
Read more: https://developer.shopware.com/docs/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html

## storefront jest

- Place tests under `Resources/app/storefront/test/` mirroring the source path, named `<name>.test.js` (core matches `**/test/**/*.test.js`, excluding `test/e2e`). Plugins follow their own Jest config.
- Import helpers directly (`src/helper/feature.helper`); set fixtures in `beforeEach` (e.g. `Feature.init(flags)`) and assert active, inactive and unknown values.
- For plugins extending `src/plugin-system/plugin.class`, mock `window.PluginManager` (`getPluginInstancesFromElement` returning a `Map`, `getPlugin` returning `{ get: () => [] }`) before constructing on a `document.createElement(...)` element; null the instance in `afterEach`.
- Platform repo: `composer run storefront:unit` (85% coverage threshold on `src/helper`).

Read more: https://developer.shopware.com/docs/guides/development/testing/unit/jest-storefront.html

## playwright setup

- Use Playwright with `@shopware-ag/acceptance-test-suite` (ATS): `npm install @shopware-ag/acceptance-test-suite`, `npx playwright install`, `npx playwright install-deps`; set `"type": "module"`.
- `.env`: `APP_URL` plus `SHOPWARE_ACCESS_KEY_ID`/`SHOPWARE_SECRET_ACCESS_KEY` (preferred) or `SHOPWARE_ADMIN_USERNAME`/`SHOPWARE_ADMIN_PASSWORD`; `MAILPIT_BASE_URL` for mail tests. Set `use.baseURL` from `process.env['APP_URL']`.
- One base file does `export * from '@shopware-ag/acceptance-test-suite'` and exports `test = base.extend<FixtureTypes>({ ... })`; import `test` and `expect` from it in every spec.

Read more: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/install-configure.html

## playwright fixtures

- `DefaultSalesChannel` (worker-scoped): isolated sales channel with `salesChannel`, `customer`, `url`.
- `AdminApiContext`: authenticated Admin API calls for test data. `StoreApiContext` does not log in; call `login(DefaultSalesChannel.customer)` when needed.
- Build page objects on `AdminPage`/`StorefrontPage` rather than raw locators. Request only fixtures the test uses.
- New ATS fixtures go in `src/fixtures`, merged in `src/index.ts`; cover new page objects and `TestDataService` methods in the ATS `tests` folder.

Read more: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/fixtures.html
Read more: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/test.html

## playwright best practices

- Tests run in parallel on a shop in unknown state: create all data through `TestDataService` (it cleans up), never depend on existing rules, flows, categories, `en_GB` or `EUR`.
- Never change global settings; only set settings explicitly on the sales channel the test created.
- Open entities by created ID or unique name; never assume a result holds exactly one item.
- Reference the blocking GitHub issue in `test.skip(...)`.
- Run credential steps in a separate setup project with `trace: 'off'` that the test project depends on.
- Debug a failing API call with `(await response.json()).errors[0]`.

Read more: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/best-practices.html

## Code check (6.7.13.0+8da531fe)

- confirmed `Shopware.Component.build` — global component factory entry used by test wrappers — administration/core/shopware.ts:133
- confirmed `Sanitizer.sanitize` — static helper importable directly in specs — administration/core/helper/sanitizer.helper.js:98
- confirmed `Feature.init` — Storefront feature helper fixture setup — storefront/Resources/app/storefront/src/helper/feature.helper.js:60
- confirmed `window.PluginManager.getPluginInstancesFromElement` — called on plugin construction, must be mocked — storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:157
- unverified `global.activeAclRoles` — admin test setup files are not shipped in vendor
- unverified `DefaultSalesChannel` — npm package @shopware-ag/acceptance-test-suite, out of scope
