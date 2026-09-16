---
id: platform/guidelines/6.6/fe-qa-guidelines.md
title: Frontend QA guidelines
docType: guideline
version: "6.6"
summary: "Admin ESLint template/JS rules, admin Jest specs, storefront Jest and ESLint config, and e2e test hygiene for Shopware 6.6 frontend code."
keywords: ["eslint", "administration", "vue", "twig templates", "jest", "storefront", "unit tests", "e2e", "wraptestcomponent", "pluginmanager", "linting", "qa"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html", hash: "a7fa6b7ad13d1a533cdba26df105890bf05fbd1495b1f36810fad5847dd75d23"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-15
---

## admin eslint for js

- Declare a type for every prop (`vue/require-prop-types`) and a default for every optional prop (`vue/require-default-prop`).
- Register component names in kebab-case (`vue/component-definition-name-casing`), e.g. `sw-sales-channel-detail`.
- Do not mutate props. The 6.6 admin source carries line-level `eslint-disable-next-line vue/no-mutating-props` suppressions, so treat the rule as active; the ADR's "off" trade-off is not what the code shows.
- Suppress a rule only per line with `// eslint-disable-next-line <rule>` and only when you know why the rule does not apply — "know the rules, break the rules", not "don't bug me linter".
- ESLint runs in CI; keep a working ESLint setup locally rather than relying on the pipeline to report.

Enforced by: ESLint

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html

## admin eslint for twig templates

`*.html.twig` files are linted as Vue templates after all Twig syntax is converted to HTML comments. Consequences an agent must write for:

- Do not indent content inside a `{% block %}`; Twig tags are invisible to the indentation rule, so block content sits at the indentation of the block tag itself:

```twig
{% block sw_sales_channel_detail_content_language_info %}
<sw-language-info
    :entity-description="placeholder(salesChannel, 'name', $tc('sw-sales-channel.detail.textHeadline'))"
    is-new-entity
/>
{% endblock %}
```

- Write a space before the closing `%}` (`{% block block_name %}`, never `{% block block_name%}`); the malformed form produces a cascade of `invalid-x-end-tag` errors across the whole file.
- Use kebab-case component names in templates (`vue/component-name-in-template-casing`) and hyphenated attributes (`vue/attribute-hyphenation`: `hello-world=""`, not `helloWorld=""`).
- Self-close components without content: `<sw-language-switch disabled />`, not an empty open/close pair.
- As soon as an element has more than one attribute, put every attribute on its own line and the closing `>` or `/>` on its own line.
- Slot names containing `.` are allowed (`vue/valid-v-slot` with `allowModifiers`). Multiple template roots, lone `<template>` tags, `v-html`, template shadowing and scoped-slot "unused vars" are not flagged, because template inheritance and the Twig-to-comment conversion make those checks unreliable.
- To suppress a rule for one template line, place an HTML comment whose text is `eslint-disable-next-line <rule>` on the line directly above the element (see the code check reference for a real example).
- PHPStorm needs `html,twig` added to the `eslint.additional.file.extensions` registry key to lint templates in the IDE.

Enforced by: ESLint

Read more: https://developer.shopware.com/docs/v6.6/resources/references/adr/2021-05-28-introduce-eslint-on-vue-admin.html

## admin jest unit tests

- Place the spec next to the file it tests, suffixed `.spec.js` or `.spec.ts`.
- Mount components through `wrapTestComponent('<component-name>', { sync: true })` passed to `mount` from `@vue/test-utils`, so Shopware's component registry, inheritance and overrides are resolved; stub children via `global.stubs` and inject services via `global.provide`.
- Set ACL privileges per test with `global.activeAclRoles = ['<entity>.editor']` and feature flags with `global.activeFeatureFlags = ['<flag>']`; reset them in the test that needs a different state.
- Mock repository responses through `global.repositoryFactoryMock.responses` instead of hitting the API.
- Await `flushPromises()` after actions that trigger async loading before asserting.
- Do not disable `max-len` in specs by hand: spec files are exempt so test names and selectors can stay readable.

Enforced by: review

Read more: platform/dev/6.6/guides/plugins/plugins/testing/jest-admin.md

## storefront jest and eslint

- Name storefront unit tests `*.test.js` and put them under `Resources/app/storefront/test/`, mirroring the source path (e.g. `test/plugin/<plugin-name>/<name>.plugin.test.js`); the core `jest.config.js` `testMatch` only picks up `**/test/**/*.test.js` and excludes `test/e2e`.
- The core config sets `testEnvironment: 'jsdom'`, `clearMocks`, `resetMocks` and `restoreMocks`; do not rely on mock state leaking between tests.
- Mock `window.PluginManager` (e.g. `getPluginInstancesFromElement`, `getPlugin`) in `beforeEach` before instantiating a JS plugin, and restore or null the instance afterwards.
- Keep `src/helper` coverage at or above the configured 85 % statements/branches/functions threshold.
- Storefront ESLint: never commit `it.only`/`describe.only` (`jest/no-focused-tests` is an error), no duplicate hooks (`jest/no-duplicate-hooks`), always-multiline trailing commas, semicolons, one declaration per `var`/`let`/`const`, 4-space indent, single quotes, no `console` except `warn`/`error`.
- In `*.ts` files use `import type`/`export type` for type-only symbols (`@typescript-eslint/consistent-type-imports`, `consistent-type-exports`) and exhaustive `switch` over unions.

Enforced by: ESLint

Read more: platform/dev/6.6/guides/plugins/plugins/testing/jest-storefront.md

## e2e tests

- Write few, workflow-based e2e tests from the end user's point of view: the happy path and the critical path. Test validation logic and edge cases in unit tests instead.
- One test per workflow; create prerequisite data (sales channels, products, login) via API fixtures in `beforeEach`, not through the UI.
- Keep tests independent of run order and of each other; clean up in `beforeEach`, since `after` hooks may not run when a test fails.
- Select elements by stable Shopware-specific classes (e.g. `.btn-buy`), never by XPath, framework classes such as `.btn-primary`, or generated UUIDs.
- Never wait a fixed duration; wait on assertions or on an intercepted request alias.
- Run e2e suites against a clean installation without demo data, in production mode.

Enforced by: review

Read more: platform/dev/6.6/resources/guidelines/testing/e2e-best-practises.md
Read more: platform/dev/6.6/guides/plugins/plugins/testing/end-to-end-testing.md

## Code check (6.6.10.24+87965325)

- confirmed `vue/no-mutating-props` — active rule, suppressed per line in admin source — administration/app/component/form/sw-custom-field-set-renderer/index.js:185
- confirmed `vue/require-default-prop` — suppressed per line, so enforced — administration/module/sw-sales-channel/view/sw-sales-channel-detail-base/index.js:57
- confirmed `eslint-disable-next-line vue/valid-v-slot` — template-level suppression comment — administration/module/sw-sales-channel/page/sw-sales-channel-create/sw-sales-channel-create.html.twig:4
- confirmed `wrapTestComponent` — admin spec mounting helper — administration/module/sw-sales-channel/page/sw-sales-channel-detail/sw-sales-channel-detail.spec.js:8
- confirmed `global.activeAclRoles` — per-test ACL setup — administration/module/sw-sales-channel/page/sw-sales-channel-detail/sw-sales-channel-detail.spec.js:84
- confirmed `global.activeFeatureFlags` — per-test feature flags — administration/core/factory/module.factory.spec.js:379
- confirmed `testMatch` — storefront Jest only matches `*.test.js` — storefront/Resources/app/storefront/jest.config.js:84
- confirmed `jest/no-focused-tests` — storefront ESLint error — storefront/Resources/app/storefront/.eslintrc.js:39
- corrected `.spec.js` — storefront Jest uses `*.test.js` instead, storefront/Resources/app/storefront/jest.config.js:84
