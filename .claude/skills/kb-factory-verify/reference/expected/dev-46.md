# `dev-46` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-46` · `dev` · `Admin migration (Vue 3 / Vite / Pinia / Meteor)` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-42-51` |
| Core version | `6.7.13.0` |

**Query:** sw-button and sw-card are deprecated in Shopware 6.7 — how do I migrate my plugin's admin templates to the Meteor components, and is there a codemod that does it?

**Expected answer — every fact an answer must contain:**

1. Neither component is removed in 6.7 — both are `@deprecated tag:v6.8.0` wrapper components that already render the Meteor component. Each declares its own `deprecated` prop (`Boolean`, `required: false`, `default: false`; there is no shared deprecation mixin) and the template condition is exactly `v-if="!deprecated"`, with `v-else` falling back to `sw-button-deprecated` / `sw-card-deprecated`. No feature flag is involved for these two, and they emit no runtime deprecation warning. An unmigrated `<sw-button>` therefore already renders `<mt-button variant="secondary">` in 6.7; `<sw-button deprecated />` opts back out, which is how one codebase serves 6.6 and 6.7. `[code: administration: Resources/app/administration/src/app/component/base/sw-button/sw-button.html.twig:1-20]` `[code: administration: Resources/app/administration/src/app/component/base/sw-button/index.js:15-30]` `[code: administration: Resources/app/administration/src/app/component/base/sw-card/index.ts:3-21]`
2. The `deprecated`-prop rule above governs 15 components only (sw-button, sw-card, sw-alert, sw-icon, sw-colorpicker, sw-datepicker, the text/email/url/password/number/select/checkbox/switch/textarea fields). It is **not** the general mechanism: `sw-tabs` and `sw-popover` have no `deprecated` prop and switch on a `useMeteorComponent` computed gated by `Shopware.Feature.isActive('V6_8_0_0')`, while `sw-loader` and `sw-skeleton-bar` gate on `ENABLE_METEOR_COMPONENTS`. Since `v6.8.0.0` defaults to `false` and `ENABLE_METEOR_COMPONENTS` is not declared in `feature.yaml` at all, those four always render their deprecated variant in a stock 6.7 install regardless of the markup, and warn on every render. `[code: administration: Resources/app/administration/src/app/component/base/sw-tabs/index.ts:24-38]` `[code: administration: Resources/app/administration/src/app/component/utils/sw-loader/index.js:28-41]` `[code: Framework/Resources/config/packages/feature.yaml]`
3. The codemod ships in the administration package. In a project install run `npm run code-mods -- --fix --plugin-name <Name> -v 6.7` from `vendor/shopware/administration/Resources/app/administration` — `composer run admin:code-mods` exists only in the shopware/shopware monorepo. `-v`/`--shopware-version` is mandatory (without it `isVersionNewerOrSame` exits before ESLint is instantiated, so nothing is linted) and only `6.6`/`6.7` are accepted; the plugin must be a git repository unless `-G` is passed, and nothing is written without `--fix`. It only visits `**/*.html.twig` under `custom/plugins/<Name>/src/**/Resources/app/administration/src/`: it renames `sw-` → `mt-` for its 15-entry list (sw-button and sw-card included), applies six non-obvious mappings (`sw-switch-field`→`mt-switch`, `sw-checkbox-field`→`mt-checkbox`, `sw-textarea-field`→`mt-textarea`, `sw-select-field`→`mt-select`, `sw-alert`→`mt-banner`, `sw-popover`→`mt-floating-ui`), prepends a `<!-- TODO Codemod: Converted from … -->` review marker to every fixed tag, and then fixes props/events via `no-deprecated-component-usage`. Component names in JS/TS are never rewritten, and `sw-data-grid` is not renamed at all — it only gets a manual-work comment pointing at `mt-data-table`. `[code: administration: Resources/app/administration/code-mods.js:11-14,98-102,121-146,254-286,470-475]` `[code: administration: Resources/app/administration/eslint-rules/deprecation-rules/no-deprecated-components.js:72-95,167-173,213-220]`

**Trap:** The invocation the docs give, `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7`, does not exist in a Flex/project install — that script is only in the monorepo's `composer.json`. Equally, an answer that says sw-button/sw-card "no longer work" in 6.7 is wrong (they render mt-* already), and one that generalises the `deprecated` prop to all sw-* wrappers is wrong for sw-tabs, sw-popover, sw-loader and sw-skeleton-bar.

**Official reference URL:** https://developer.shopware.com/docs/guides/upgrades-migrations/administration/meteor-components.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| **Deep Q1:** the wrapper condition is exactly `!deprecated`; no feature flag in either template | `administration: src/app/component/base/sw-button/sw-button.html.twig:1-20`; `src/app/component/base/sw-card/sw-card.html.twig:1-24` | `{# @deprecated tag:v6.8.0 - Use \`mt-button\` instead. #}` … `<mt-button v-if="!deprecated" v-bind="$attrs" variant="secondary" @click="onClick">` … `<sw-button-deprecated v-else v-bind="$attrs" :router-link="routerLink">` |
| **Deep Q3:** the `deprecated` prop is declared per component, `Boolean`/`default: false` | `administration: src/app/component/base/sw-button/index.js:15-30`; `src/app/component/base/sw-card/index.ts:12-21` | `deprecated: { type: Boolean, required: false, default: false, },` |
| **Deep Q2:** family B — `sw-tabs` uses a `useMeteorComponent` computed gated on `V6_8_0_0`, with a runtime warning on the deprecated path | `administration: src/app/component/base/sw-tabs/index.ts:24-38` | `if (Shopware.Feature.isActive('V6_8_0_0')) { return true; } Shopware.Utils.debug.warn('sw-tabs', 'The old usage of "sw-tabs" is deprecated…')` |
| **Deep Q2:** `sw-loader` and `sw-skeleton-bar` gate on a different, undeclared flag | `administration: src/app/component/utils/sw-loader/index.js:28-41`; `src/app/component/utils/sw-skeleton-bar/index.ts:14-26` | `if (Shopware.Feature.isActive('ENABLE_METEOR_COMPONENTS')) {` |
| **Deep Q2:** `v6.8.0.0` defaults to false in 6.7 | `Framework/Resources/config/packages/feature.yaml` | `- name: v6.8.0.0\n        default: false` |
| **Deep Q5:** annotation-only deprecation for sw-button/sw-card — no runtime warning | `administration: src/app/component/base/sw-button/index.js:1-44`; `src/app/component/base/sw-card/index.ts:1-28` | `@deprecated tag:v6.8.0 - Will be removed, use mt-button instead` (grep for `console.warn`/`debug.warn` in both trees: 0 hits) |
| **Deep Q4:** `-v` is a registered alias; only `6.6`/`6.7` accepted; no default | `administration: code-mods.js:11-14, :55-61, :98-102` | `{ description: …, name: 'shopware-version', alias: 'v', type: String }` / `console.error(colors.red('Invalid Shopware version. Available: 6.6, 6.7'))` |
| **Deep Q4:** omitting the flag aborts before ESLint runs, so nothing is linted | `administration: code-mods.js:470-475` | `function isVersionNewerOrSame(version, compareVersion) { if (!version) { console.error(…'Please specify a version number using "-v"'…); process.exit(); }` |
| **Deep Q6:** the 15-entry activated list actually used for 6.7 includes sw-button and sw-card | `administration: code-mods.js:254-286` | `if (isVersionNewerOrSame(shopwareVersion, '6.7')) { … activatedComponents: ['sw-button','sw-alert','sw-colorpicker','sw-text-field','sw-card','sw-email-field','sw-switch-field','sw-textarea-field','sw-datepicker','sw-icon','sw-url-field','sw-select-field','sw-checkbox-field','sw-number-field','sw-password-field'],` |
| **Deep Q6:** for 6.6 both Meteor rules are explicitly off | `administration: code-mods.js:278-285` | `return { 'sw-deprecation-rules/no-deprecated-components': 'off', 'sw-deprecation-rules/no-deprecated-component-usage': 'off' };` |
| The codemod refuses to run outside a git repo and only writes with `--fix`; scope is the plugin's admin src | `administration: code-mods.js:121-146` | `const ADMIN_PLUGIN_PATH_PATTERN = \`${pluginDir}/src/**/Resources/app/administration/src/\`;` … `'Plugin is no git repository. Make sure your plugin is in git and has a clean work space!'` |
| Default rename is `sw-` → `mt-` | `administration: eslint-rules/deprecation-rules/no-deprecated-components.js:167-173` | `const newComponentName = componentName.replace('sw-', 'mt-');` |
| Six explicit non-obvious mappings | `administration: eslint-rules/deprecation-rules/no-deprecated-components.js:72-95` | `{ before: 'sw-alert', after: 'mt-banner' }, { before: 'sw-popover', after: 'mt-floating-ui' },` |
| Every autofixed tag gets a review marker | `administration: eslint-rules/deprecation-rules/no-deprecated-components.js:191` | `<!-- TODO Codemod: Converted from ${componentName} - please check if everything works correctly -->` |
| Second rule fixes props/events across 21 per-component check modules | `administration: eslint-rules/deprecation-rules/no-deprecated-component-usage.js:27-33` | `This rule checks if converted components still use the old logic, props, etc.` |
| Concrete mt-button prop migrations | `administration: eslint-rules/deprecation-rules/no-deprecated-component-usage-checks/mt-button.check.js:37-51` | `'[mt-button] The "variant" prop with value "ghost" is deprecated. Please use the "primary" prop in combination with "ghost" prop instead.'` |
| Concrete mt-card migrations | `administration: eslint-rules/deprecation-rules/no-deprecated-component-usage-checks/mt-card.check.js:51,100` | `The "ai-badge" prop is deprecated. Please use the AI badge directly in the slot.` / `The "content-padding" prop was removed.` |
| ~40 Meteor components are registered globally, so plugin templates need no import | `administration: src/app/adapter/view/vue.adapter.ts:490-498` | `Object.entries(meteorComponents).forEach(([componentName, component]) => { … this.app.component(componentNameAsKebabCase, component …) })` |
| mt-card, mt-tabs, mt-datepicker, mt-text-editor are Shopware wrappers, not the raw library components | `administration: src/app/component/index.ts:174-176` | `Shopware.Component.register('mt-card', () => import('src/app/component/meteor-wrapper/mt-card/index'));` |
| Library version in 6.7.13.0 | `administration: Resources/app/administration/package.json:60` | `"@shopware-ag/meteor-component-library": "5.2.0",` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| sw-button / sw-card are removed or non-functional in 6.7 | absent | Both are registered, `@deprecated tag:v6.8.0`, and render the Meteor component by default; an unmigrated template keeps working |
| The `V6_8_0_0` flag appears in the sw-button / sw-card condition | absent | Neither template nor index file mentions it; a flag scan across all wrappers finds `V6_8_0_0` only in `sw-tabs/index.ts` and `sw-popover/index.ts` |
| A shared deprecation mixin declares the prop or emits a warning | absent | `src/app/mixin/` holds 17 mixins, none deprecation-related; the prop block is duplicated verbatim in each of the 15 family-A components |
| `ENABLE_METEOR_COMPONENTS` is a declared feature flag | absent | Four occurrences in `vendor/shopware` (two source, two built assets), none in `feature.yaml`, so `isActive` returns false |
| An `admin:code-mods` composer script exists in a project install | absent | Present only in the monorepo `composer.json` at v6.7.13.0; this project's root `composer.json:56-66` defines only `auto-scripts`, `post-install-cmd`, `post-update-cmd` |
| The codemod converts sw-data-grid to mt-data-table | absent | The branch only inserts `<!-- TODO Codemod: This component need to be manually replaced with mt-data-table -->` |
| The codemod rewrites component names in JS/TS | absent | Both Meteor rules are registered only in the `files: ['**/*.html.twig']` block and are `defineTemplateBodyVisitor` VElement visitors |
| The rule default list and the codemod's list are the same | absent | The rule's own default is 23 entries (22 unique — `sw-tabs` listed twice); the 6.7 list has 15 and omits sw-external-link, sw-loader, sw-tabs, sw-skeleton-bar, sw-progress-bar, sw-popover, sw-data-grid |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| the escape hatch that keeps the pre-Meteor rendering | `administration: src/app/component/base/sw-button/sw-button.html.twig:13-20` |
| the family-B runtime warning, which fires on every deprecated render | `administration: src/app/component/base/sw-tabs/index.ts:31-37` |
| shipped build artefact confirming family B compiles into production assets (not dev-only) | `administration: Resources/public/administration/assets/index-C80Dn4ho.js:1` |
| no jest spec for the sw-button/sw-card wrappers ships in the dist tree | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| sw-* wrappers pass props through "as is" with no translation layer, so `<sw-alert variant="success">` breaks against mt-banner | 6.7 | closed | https://github.com/shopware/shopware/issues/8859 |
| Merged fix: "use the deprecated form components with prop" (6.7.0.0 RC4) | 6.7 | merged | https://github.com/shopware/shopware/pull/8921 |
| On 6.7.5, `<sw-tabs>` routes to sw-tabs-deprecated because `V6_8_0_0` is off, silently ignoring the new `:items` prop | 6.7 | closed | https://github.com/shopware/shopware/issues/13856 |
| `itemsBackwardCompatible` shim drops slot-text labels when `V6_8_0_0` is enabled | 6.7 / 6.8 | open | https://github.com/shopware/shopware/issues/18863 |
| UPGRADE-6.7.md's component replacement table is incomplete | 6.7 | closed | https://github.com/shopware/shopware/issues/11030 |
| Open tracking issues: the sw-* → mt-* migration is unfinished (notably sw-data-grid) | 6.7 / 6.8 | open | https://github.com/shopware/shopware/issues/10621 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is the wrapper mechanism uniform, or does #13856 describe a different one? | deep pass Q2 | **Not uniform.** The community report is correct: two disjoint families — 15 components on a `deprecated` prop with no flag, and sw-tabs/sw-popover (`V6_8_0_0`) plus sw-loader/sw-skeleton-bar (`ENABLE_METEOR_COMPONENTS`, undeclared) on a `useMeteorComponent` computed. |
| What is the exact `v-if` for sw-button / sw-card? | deep pass Q1 | `v-if="!deprecated"` in both; `V6_8_0_0` appears in neither template nor index file. |
| Does the `deprecated` prop exist with default false, and is it shared? | deep pass Q3 | Yes on both, declared per component; no deprecation mixin exists. |
| Is `-v` a real alias, and what happens without it? | deep pass Q4 | Registered as `alias: 'v'`; accepted spellings `--shopware-version 6.7`, `=6.7`, `-v 6.7`, `-v6.7`. No default — omitting it aborts before ESLint is instantiated, so nothing is linted. |
| Do sw-button / sw-card warn at runtime? | deep pass Q5 | No — annotation-only. Family B does warn on every deprecated render. |
| Which activated list applies, and does it touch sw-button/sw-card? | deep pass Q6 | The 15-entry list in `code-mods.js`; both are in it. Corrects round 1: the rule default is 23 entries (22 unique), and the omissions include sw-progress-bar but **not** sw-alert. |
| Does the codemod also do Vuex → Pinia? | code lane | No — `scripts/codemods` holds only js-vue3-feature-flag-removal, sfc-migration, twig-block-removal, twig-feature-flag-removal. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Several admin components are replaced by Meteor components with 6.7 | "we will replace several current administration components with components from the Meteor Component Library" | `guides/upgrades-migrations/administration/meteor-components.md:14` | yes |
| The codemod runs via `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7` | (code block) | `…/meteor-components.md:44-50` | partly — flags are right (`-v` is a real alias), but the composer script exists only in the monorepo |
| Requires a development installation and the plugin in `custom/plugins` | "Your plugin must be located in the `custom/plugins` folder" | `…/meteor-components.md:37-38` | yes — the scope glob is `custom/plugins/<Name>/src/**/Resources/app/administration/src/` |
| The codemod replaces compatible components and leaves guidance comments | "Add guidance comments for components that require manual migration" | `…/meteor-components.md:54-56` | yes — the `TODO Codemod` markers and the sw-data-grid comment |
| A `deprecated` prop was added, default `false`, forcing the old component when true | "**Default Value**: `false` (uses the new Meteor Components by default)" | `…/meteor-components.md:61-65` | yes for the 15 family-A components; **not** for sw-tabs, sw-popover, sw-loader, sw-skeleton-bar |
| The prop lets one codebase serve 6.6 and 6.7 | "Uses mt-button in 6.7 and sw-button-deprecated in 6.6" | `…/meteor-components.md:71-81` | yes |
| Meteor components carry the `mt-` prefix | "The new components will have the prefix `mt-` (Meteor) in their names." | `adr/2024-03-21-implementation-of-meteor-component-library.md:25-27` | yes |
| In 6.7 the old `sw-` component "is not working anymore" | "`<sw-example oldProperty="old">Example</sw-example>` — Not working anymore." | `adr/2024-03-21-…md:49-55` | no — contradicted by code |
| sw-data-grid keeps its old implementation with a deprecation note | "we will keep the old implementation of the `sw-data-grid` component with a deprecation note" | `adr/2024-03-21-…md:66` | yes |
| Codemod coverage is partial by design | "We can't guarantee to provide a codemod for every edge case." | `adr/2024-03-21-…md:62` | admitted as intent |
| A second path exists: `shopware-cli extension fix` / `project fix` with deterministic admin Twig rules | "The fixer also includes deterministic rules for known Administration migration patterns…" | `products/tools/cli/automatic-refactoring.md:111` | not examined — outside the installed tree |
| `code-mods.js` is the Administration JavaScript upgrade tool | "**Codemods**: Helps upgrade Administration JavaScript code." | `guides/hosting/installation-updates/performing-updates.md:209` | yes |
| Per-component upgrade guides live in the release's technical upgrade documentation | "You can find these guides in the technical upgrade documentation for the release." | `…/meteor-components.md:29` | no such page in the docs clone; the authoritative mapping is the codemod rule |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The ADR's 6.7 example marks `<sw-example>` as "Not working anymore" | sw-button and sw-card are still registered in 6.7.13.0, annotated `@deprecated tag:v6.8.0`, and render mt-button / mt-card by default; an unmigrated template keeps working. `meteor-components.md` is right and the ADR is wrong on this point. | `administration: src/app/component/base/sw-button/index.js:3-10`; `src/app/component/base/sw-button/sw-button.html.twig:1-20` |
| `meteor-components.md` presents the `deprecated` prop as the mechanism for "Shopware components" generally | It governs 15 components. sw-tabs and sw-popover switch on `V6_8_0_0`, sw-loader and sw-skeleton-bar on the undeclared `ENABLE_METEOR_COMPONENTS`; all four render their deprecated variant in stock 6.7 no matter how the plugin writes the tag, and warn on every render. | `administration: src/app/component/base/sw-tabs/index.ts:24-38`; `src/app/component/utils/sw-loader/index.js:28-41`; `Framework/Resources/config/packages/feature.yaml` |
| The invocation is `composer run admin:code-mods -- …` | That script exists only in the shopware/shopware monorepo `composer.json`. In a Flex/project install it must be `npm run code-mods -- …` from `vendor/shopware/administration/Resources/app/administration`. The docs also omit two enforced requirements: git repo (unless `-G`) and no writes without `--fix`. | `administration: code-mods.js:70-79, :121-146`; project `composer.json:56-66` |
| "Automatically replace compatible components with Meteor Components" (and one blog claims Vuex → Pinia too) | Only `**/*.html.twig` template bodies are visited; JS/TS component names are never rewritten, sw-data-grid gets a comment rather than a rename, and no codemod touches Vuex or Pinia. | `administration: code-mods.js:243-286`; `eslint-rules/deprecation-rules/no-deprecated-components.js:212-243` |
| The per-component `sw-card` → `mt-card` mapping lives in "the technical upgrade documentation for the release" (absent from the docs clone; users report the UPGRADE-6.7.md table is incomplete) | The authoritative mapping is the codemod rule: `sw-` → `mt-` with six explicit exceptions. | `administration: eslint-rules/deprecation-rules/no-deprecated-components.js:72-95, :167-173` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The codemods are run through Composer: `composer run admin:code-mods -- --plugin-name example-plugin --fix -v 6.7`. | rewritten (fact 3) | Deep pass Q6: the `admin:code-mods` composer script exists only in the shopware/shopware monorepo, not in a project's `composer.json`, so the literal command the suite handed the reader fails in a Flex install. The flags themselves are correct (`-v` is a registered alias, Q4). Replaced with the `npm run code-mods` invocation plus the enforced preconditions and the real scope of the transform. |
| Prerequisites: a development installation of Shopware, and the plugin must live in the `custom/plugins` folder. | removed as a standalone fact, folded into fact 3 | Confirmed by the scope glob `custom/plugins/<Name>/src/**/Resources/app/administration/src/`, but on its own it does not decide whether an answer is usable, and it omitted the two preconditions the code actually enforces and that break a run: mandatory `-v`, and the git-repository check. Both are now in fact 3. |
| Shopware components gained a `deprecated` prop (default `false`, which renders the new Meteor component); setting it to `true` renders the old component, so one codebase can support both 6.6 and 6.7. | split into facts 1 and 2, generalisation removed | True for sw-button and sw-card — deep pass Q1/Q3 confirm `v-if="!deprecated"` and the per-component `Boolean`/`default: false` declaration, with no feature flag and no runtime warning. But "Shopware components" is wrong as a general rule (Q2): four wrappers use a `useMeteorComponent` computed gated on `V6_8_0_0` or on the undeclared `ENABLE_METEOR_COMPONENTS` instead, and always render the deprecated variant in stock 6.7. Fact 1 now states the rule for the components the query names; fact 2 states its limits. |
