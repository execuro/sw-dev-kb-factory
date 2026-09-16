# `dev-38` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-38` · `dev` · `Testing` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-32-41` |
| Core version | `6.7.13.0` |

**Query:** How do I write Jest unit tests for my Administration components in Shopware 6.7?

**Expected answer — every fact an answer must contain:**

1. Specs are co-located with the source file as `<name>.spec.js` / `<name>.spec.ts` (a `<name>.spec/` directory of spec files is also matched) and run under Jest 30 with `jest-environment-jsdom` and `@vue/test-utils` 2.4.6 — the Vue 3 API. The 6.7 Administration is Jest, not Vitest. `[code: Resources/app/administration/jest.config.js:50,61,166-181 (shopware/administration), Resources/app/administration/package.json]`
2. A spec must resolve the component through the Shopware registry rather than importing it directly: either `mount(await wrapTestComponent('sw-…', { sync: true }), { global: { stubs, mocks }, attachTo: document.body })` — `wrapTestComponent` and `flushPromises` are globals installed by `test/_setup/prepare_environment.js` through `setupFilesAfterEnv`, not imports — or `Shopware.Component.register(name, cmp)` followed by `await Shopware.Component.build(name)` and `shallowMount(component, { props, global: { stubs, provide } })`. Vue-3 test-utils puts `stubs`/`mocks`/`provide` under `global`, not at the top level. `[code: scripts/create-spec-file/template/template.spec_js:1-43, jest.config.js:96-104 (shopware/administration), Resources/app/administration/src/modules/sw-settings-storefront/component/sw-settings-storefront-configuration/sw-settings-storefront-configuration.spec.js:4-30 (shopware/storefront)]`
3. Shopware 6.7 ships no Jest harness for a plugin: the shipped `jest.config.js` `roots`/`testMatch` cover only the Administration and the Storefront's administration extension, `bin/console plugin:create` scaffolds no jest config or spec, no `@shopware-ag/jest-preset-sw6-admin` is referenced anywhere in the tree, and the installed `shopware/administration` package omits the whole `test/` directory the config depends on — a plugin must supply its own Jest configuration. Inside the platform repo the suite runs as npm `unit` / `unit-watch` (`composer run admin:unit` / `admin:unit:watch`), and `npm run unit-setup` must have generated `test/_helper_/componentWrapper/component-imports.js` first or `jest.config.js` throws at load. `[code: jest.config.js:35-38,14-17, package.json:43-45 (shopware/administration), Framework/Plugin/Command/Scaffolding/Generator/TestsGenerator.php:40-46]`

**Official reference URL:** https://developer.shopware.com/docs/guides/development/testing/unit/jest-admin.html
<!-- expected:end -->

## Evidence — code (decisive)

Paths below are relative to `vendor/shopware/administration/` unless the package is named.

| fact | citation | excerpt |
| --- | --- | --- |
| Jest 30.2.0 + jest-environment-jsdom 30.2.0, `@vue/test-utils` 2.4.6, `@vue/vue3-jest` 29.2.6, `@swc/jest`; no Vitest | `Resources/app/administration/package.json` | `"jest": "30.2.0", "jest-environment-jsdom": "30.2.0",` |
| npm scripts `unit`, `unit-watch`, `unit-setup` | `Resources/app/administration/package.json:43-45` | `"unit": "jest --config jest.config.js --ci",` |
| jest.config.js hard-fails without the generated component-imports map | `Resources/app/administration/jest.config.js:14-17` | `throw new Error('Missing required /test/_helper_/componentWrapper/component-imports.js file to run tests. Run \`npm run unit-setup\` …')` |
| The map is written by the shipped generator into a directory the dist package lacks | `Resources/app/administration/scripts/componentImportResolver/generate.ts:225` | `fs.writeFileSync(path.join(__dirname, '/../../test/_helper_/componentWrapper/component-imports.js'), filestring);` |
| `roots` and `testMatch` cover only the Administration and the Storefront admin extension | `Resources/app/administration/jest.config.js:35-38,166-181` | `roots: ['<rootDir>', '<rootDir>/../../../../Storefront/Resources/app/administration'],` |
| jsdom environment; `.spec.js`/`.spec.ts` and `*.spec/*.spec.*` matched; moduleFileExtensions js, ts, vue, json | `Resources/app/administration/jest.config.js:50,61` | `testEnvironment: 'jsdom',` |
| `wrapTestComponent`/`flushPromises` are globals from `test/_setup/prepare_environment.js`, loaded through `setupFilesAfterEnv` | `Resources/app/administration/jest.config.js:96-104` | `setupFilesAfterEnv: [… '/test/_setup/setup-shopware.js', 'jest-expect-message', '/test/_setup/prepare_environment.js']` |
| The globals are assigned upstream in prepare_environment.js | `https://github.com/shopware/shopware/blob/trunk/src/Administration/Resources/app/administration/test/_setup/prepare_environment.js` | `global.flushPromises = flushPromises; global.wrapTestComponent = wrapTestComponent;` |
| The jest preset's job was folded into the in-repo `test/_setup/setup-shopware.js` | `https://github.com/shopware/shopware/blob/trunk/src/Administration/Resources/app/administration/test/_setup/setup-shopware.js` | `Previously provided by @shopware-ag/jest-preset-sw6-admin.` |
| The canonical generated spec mounts through `wrapTestComponent` with `sync: true`, `global.stubs`/`global.mocks`, `attachTo: document.body` | `Resources/app/administration/scripts/create-spec-file/template/template.spec_js:1-43` | `return mount(await wrapTestComponent('sw-your-component-for-test', { sync: true }), { global: { stubs: {}, mocks: {} }, attachTo: document.body });` |
| The shipped Storefront spec shows the register + build + shallowMount path with Vue-3 `props` and `global.stubs`/`global.provide` | `Resources/app/administration/src/modules/sw-settings-storefront/component/sw-settings-storefront-configuration/sw-settings-storefront-configuration.spec.js:4-30` (shopware/storefront) | `const component = await Shopware.Component.build('sw-settings-storefront-configuration'); const wrapper = shallowMount(component, { props: {…}, global: { stubs: { 'mt-switch': true }, provide: { feature: {} } } });` |
| Module resolution is remapped for specs (`src`/`test` aliases, `lodash-es`→`lodash`, `vue`→`vue/dist/vue.cjs.js`) | `Resources/app/administration/jest.config.js:132-145` | `'^src(.*)$': '<rootDir>/src$1', '^lodash-es$': 'lodash', vue$: 'vue/dist/vue.cjs.js',` |
| Twig/HTML and SVG are compiled by custom transformers, not stubbed | `Resources/app/administration/jest.config.js:123-125` | `'^.+(\\.twig\|\\.html)$': '<rootDir>/test/transformer/twigToVueTransformer.js',` |
| The package's own testing overview names the helper surface (`wrapTestComponent`, `flushPromises`, `global.activeAclRoles`, `global.activeFeatureFlags`, `global.repositoryFactoryMock`) | `Resources/app/administration/technical-docs/07-testing/01-overview.md:96-115` | `- **\`global.activeAclRoles\`** - Set ACL permissions for tests` |
| The commands that overview prescribes are platform-repo composer scripts | `Resources/app/administration/technical-docs/07-testing/01-overview.md:33-44` | `composer run admin:unit` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A project install gives you a runnable Administration Jest harness | absent | the whole `test/` directory is missing from the installed `shopware/administration` package, while `jest.config.js` references `test/_setup/*`, `test/_helper_/jest-resolver.js`, `test/globalTeardown.js`, `test/transformer/*`, `test/_mocks_/styleMock.js` |
| core's `jest.config.js` picks up spec files from a plugin under `custom/plugins` | absent | `roots`/`testMatch` enumerate only the two Shopware packages plus eslint-rules, build/vite-plugins, `test/_helper_` and scripts |
| `plugin:create` scaffolds a Jest setup for a plugin's Administration | absent | the scaffolding stubs hold PHP/JS source stubs plus `phpunit-xml.stub` and `test-bootstrap.stub` only; the single test generator emits `phpunit.xml` and `tests/TestBootstrap.php` |
| Shopware publishes a jest preset package for plugin admin tests in 6.7 | absent | grep for `jest-preset` across `vendor/shopware/` returns nothing; the only trace is the comment in `setup-shopware.js` recording that the preset *used to* provide this |
| The Administration dist package ships example specs to copy from | mostly absent | the only `.spec` artefacts are codemod snapshots; runnable examples survive only under `vendor/shopware/storefront/Resources/app/administration/src/**/*.spec.js` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| the only in-tree runnable admin component spec in this install | `vendor/shopware/storefront/.../sw-settings-storefront-configuration.spec.js:13-35` |
| service / mixin / acl spec patterns | `vendor/shopware/storefront/Resources/app/administration/src/core/service/api/theme.api.service.spec.js` and siblings |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| The official jest-admin guide is scoped to the Shopware-provided Administration; plugin setup is left to the developer | 6.7 | open | https://developer.shopware.com/docs/guides/plugins/plugins/testing/jest-admin.html |
| `@shopware-ag/jest-preset-sw6-admin` resolves `undefined/src$1` when run from a plugin directory | unclear | closed | https://github.com/shopware/jest-preset-sw6-admin/issues/12 |
| A stale `component-imports.js` map makes `wrapTestComponent()` fail with a misleading moduleNameMapper error | 6.8 (trunk) | closed | https://github.com/shopware/shopware/issues/19603 |
| Maintainers are evaluating Vitest browser mode as a replacement for Jest + JSDOM | post-6.7 trunk | open | https://github.com/shopware/shopware/issues/14037 |
| Admin HTTP-mocking idioms break under the 6.8 feature set with Axios v1 | 6.8 | closed | https://github.com/shopware/shopware/issues/18575 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does 6.7 still run Jest, or has any part moved to Vitest? | code | Jest 30.2.0 in `package.json`; no Vitest anywhere in the Administration |
| Which `@vue/test-utils` major does 6.7 use? | code | 2.4.6 — the Vue 3 API, so `localVue`/`wrapper.destroy` are not valid |
| Does `wrapTestComponent()` still exist and is it still the mounting path? | code | yes — it is a global from `test/_setup/prepare_environment.js` and the generated spec template mounts through it |
| Does 6.7 ship anything a plugin can reuse — preset, exported config, resolver? | code | no: no preset in the tree, no plugin scaffold, and `roots`/`testMatch` exclude plugins |
| Is `generate-component-import-resolver-map` present in 6.7 and is the map committed? | code | the `unit-setup` script and the generator ship; the generated map does not, and `jest.config.js` throws without it |
| Is `global.activeFeatureFlags` still the 6.7 way, given the 2026-08-06 ADR's `it.activeFeatureFlags()` helpers? | not settled | the code lane did not read the flag helpers; no fact asserts the flag API, so nothing in the expected answer rests on it |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Jest is the Administration testing framework | "We are using Jest as our testing framework." | `guides/development/testing/unit/jest-admin.md:14` | yes |
| Specs sit beside the source with `.spec.js`/`spec.ts` | "The test files are placed in the same directory as the file that should be tested." | `…/jest-admin.md:30-31` | yes — `testMatch` |
| A component is obtained via `Shopware.Component.build()`, resolving template inheritance and overrides | "we can access the Component using the `Shopware.Component.build()` method" | `…/jest-admin.md:85` | yes — shipped Storefront spec |
| Vue Test Utils **v1** is used; example imports `createLocalVue`, calls `wrapper.destroy()` | "We are using Vue Test Utils (v1 docs link)…" | `…/jest-admin.md:81, 114-166` | no — the package depends on `@vue/test-utils` 2.4.6 |
| Spec boilerplate via `composer run admin:create:test` | "run `composer run admin:create:test`" | `…/jest-admin.md:91` | partly — the generator ships (`scripts/create-spec-file`, npm `create-test`); the composer script exists only in the platform repo |
| Tests run with `composer run admin:unit` / `admin:unit:watch` | "`composer run admin:unit`" | `…/jest-admin.md:97, 105-109` | partly — the npm scripts are `unit`/`unit-watch`; the composer wrappers live in the platform root composer.json |
| The commands apply to the Shopware-provided Administration only; a plugin may need its own scripts | "This only applies to the Shopware-provided Administration!" | `…/jest-admin.md:102` | yes — `roots`/`testMatch` exclude plugins and nothing is scaffolded |
| ACL via `global.activeAclRoles`, flags via `global.activeFeatureFlags`, repository mocking via `global.repositoryFactoryMock` | "You can set the active ACL roles by simply adding values to the global variable `global.activeAclRoles`." | `…/jest-admin.md:416, 432, 448-483` | named by the package's shipped testing overview; the implementing `test/_setup` files are not in the dist package, so not code-confirmed here |
| An unresolved directive must be mocked via `createLocalVue().directive(...)` | "you need to use localVue to provide the directive mock" | `…/jest-admin.md:542` | no — `createLocalVue` does not exist in Vue Test Utils 2 |
| ADR 2026-08-06: never assign `global.activeFeatureFlags`; use `it.activeFeatureFlags()`/`it.deprecated()` | "**Do not assign `global.activeFeatureFlags` in a spec.**" | `adr/2026-08-06-administration-jest-feature-flag-helpers.md:67-74` | not examined — ADR is dated after 6.7 and references the v6.8.0.0 flag |
| ADR 2026-05-06: files over 500 lines split into a `<source>.spec/` directory, both layouts discovered by Jest | "The split test directory uses the source file name with a `.spec` suffix" | `adr/2026-05-06-split-large-administration-test-files.md:21,38,40` | yes for discovery — `testMatch` includes `src/**/*.spec/*.spec.{js,ts}` |
| The composer reference lists `admin:unit:vue3` alongside `admin:unit` | "\| `admin:unit:vue3` \| …with Vue3 \|" | `core-reference/composer-commands-reference.md:41-45` | no — the 6.7 package has a single `unit` script; the Administration is Vue 3 unconditionally |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The jest-admin guide teaches Vue Test Utils v1 — `createLocalVue`, `wrapper.destroy()`, top-level `stubs`/`provide` — with no version caveat, and the live page still shows it | the 6.7 Administration depends on `@vue/test-utils` 2.4.6 and `@vue/vue3-jest`; the shipped spec template and the shipped Storefront spec pass `stubs`/`mocks`/`provide` under `global` | `Resources/app/administration/package.json`, `scripts/create-spec-file/template/template.spec_js:1-43` |
| Tests are run via `composer run admin:unit` / `admin:unit:watch` after `composer run init:js` | the package exposes npm `unit`/`unit-watch`/`unit-setup`; the composer wrappers exist only in the platform repo root, and a project install cannot run the suite at all because `test/` is absent from the dist package | `Resources/app/administration/package.json:43-45`, `jest.config.js:45-47` |
| The composer reference lists separate `admin:unit:vue3` commands | no Vue2/Vue3 split exists in 6.7's administration package — one `unit` script | `Resources/app/administration/package.json:43-45` |
| The guide implies the documented setup gets a plugin's admin specs running | nothing ships for plugins: no preset (`jest-preset` has zero hits in `vendor/shopware/`), no scaffold, and `roots`/`testMatch` never resolve outside the two Shopware packages | `jest.config.js:35-38`, `TestsGenerator.php:40-46` |
| The guide instructs setting `global.activeFeatureFlags` in a spec; ADR 2026-08-06 forbids exactly that | the code lane did not read the flag helpers; the point is recorded, not asserted | `jest-admin.md:432` vs `adr/2026-08-06-…md:67-74` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| "Test files sit next to the tested file with a `.spec.js`/`.spec.ts` suffix, and a component must be resolved through `Shopware.Component.build('name')` (after `Shopware.Component.register`) so template inheritance and overrides are applied." | kept, split | co-location confirmed by `testMatch` (now also naming the `<name>.spec/` directory form); the register/build path confirmed by the shipped Storefront spec and joined by the `wrapTestComponent` path the shipped spec template uses |
| "`shallowMount()` is preferred over `mount()`, missing child components are stubbed via the `stubs` option, and `attachTo: document.body` is needed when interacting with DOM elements." | removed | no code finding supports a preference for `shallowMount` — the generated spec template uses `mount`; and the top-level `stubs` option is Vue Test Utils v1, while 6.7 depends on `@vue/test-utils` 2.4.6 where stubs live under `global` |
| "The setup provides `global.activeAclRoles`, `global.activeFeatureFlags` and `global.repositoryFactoryMock.responses.addResponse(...)`; tests run with `composer run admin:unit` (watch mode `composer run admin:unit:watch`)." | removed | the implementing `test/_setup` files are absent from the dist package, so the globals are not code-confirmed, and the 2026-08-06 ADR contests `global.activeFeatureFlags`; the composer commands exist only in the platform repo, not in a project install |
| — | added | that 6.7 ships nothing for plugin admin Jest (no preset, no scaffold, roots exclude plugins, `test/` missing from the dist package) and that `npm run unit-setup` is a hard precondition — these decide whether an answer is usable |
