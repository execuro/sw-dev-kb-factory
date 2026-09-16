# `dev-44` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-44` · `dev` · `Admin migration (Vue 3 / Vite / Pinia / Meteor)` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-42-51` |
| Core version | `6.7.13.0` |

**Query:** After the Vue 3 upgrade my admin plugin broke — this.$parent resolves to the wrong component and a prop default that calls this.$tc throws. What do I have to change?

**Expected answer — every fact an answer must contain:**

1. A prop `default()` has no component `this` in Vue 3: replace `this.$tc('…')` with `Shopware.Snippet.tc('…')`, the getter on the `Shopware` object that spreads the running app's `i18n.global` and aliases `tc` to `t`. Core does exactly this in a prop default (`sw-tagged-field`). `Shopware.Application.getContainer('service').snippetService` is **not** an alternative — it is `SnippetApiService`, an HTTP client for the `/snippet` admin API with no translation method. `[code: administration: Resources/app/administration/src/core/shopware.ts:264-275]` `[code: administration: Resources/app/administration/src/app/component/form/sw-tagged-field/index.js:28-34]` `[code: administration: Resources/app/administration/src/core/service/api/snippet.api.service.ts:21-23]`
2. `this.$parent` shifts because every component **not** in the sync set is registered via `defineAsyncComponent`, inserting exactly one `AsyncComponentWrapper` instance — but the depth is **not fixed**: the 11 hard-coded sync names (extensible at runtime through the public `Shopware.markComponentAsSync`) and the router path (`getComponentForRoute`) insert none. Adding one hard-coded `.$parent` hop is therefore the wrong general fix; walk the chain matching `$options.name`, as core's `sw-sidebar` does, or drop `$parent` for provide/inject or a service. `[code: administration: Resources/app/administration/src/app/adapter/view/vue.adapter.ts:404-427,536-570,624-638]` `[code: administration: Resources/app/administration/src/app/component/sidebar/sw-sidebar/index.js:85-96]`
3. `this.$tc` is not gone in 6.7 — it is still a global property, but only an alias of `i18n.global.t`, `@deprecated tag:v6.8.0`, warning when the `V6_8_0_0` flag is on, and auto-fixable to `$t` by the core eslint rule `no-tc-translation`; note vue-i18n v10 swapped the pluralising argument order, which the adapter shims with a warning. Run `npm run code-mods -- --fix --plugin-name <Name> --shopware-version 6.7` from the administration package to catch the other Vue 3 breakages (`vue/no-deprecated-props-default-this`, destroyed lifecycle, `$on`/`$off`/`$once`, slots-as-functions) — **but that rule set is registered only for `**/*.js`, so a TypeScript plugin gets no warning at all and must be checked by hand.** `[code: administration: Resources/app/administration/src/app/adapter/view/vue.adapter.ts:159-166,182-193]` `[code: administration: Resources/app/administration/code-mods.js:299-319,321-447]`

**Trap:** Two doc-derived claims are wrong in 6.7. `this.$tc` is *not* the safe exception to the "search for `this.$`" rule — it is deprecated for removal in 6.8. And mutating a prop does **not** throw a hard error: Shopware's custom `warnHandler` re-throws only on `Template compilation error`, so prop mutation is a `console.warn` in dev and silent in production (`vue/no-mutating-props` is a CI lint error for `**/*.js` only). An answer that asserts a hard runtime error is wrong.

**Official reference URL:** https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vue3.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| 6.7 runs plain Vue 3.5.22; no `@vue/compat` dependency at all | `administration: Resources/app/administration/package.json:117` | `"vue": "3.5.22",` |
| The only compat left is template-compile level, for plugin builds only (`MODE: 2`) | `administration: Resources/app/administration/build/plugins.vite.ts:79-87` | `compatConfig: { MODE: 2, },` |
| **Deep Q1:** `Shopware.Snippet` is a real getter, computed per access from the running app's i18n; returns `null` before the view exists | `administration: Resources/app/administration/src/core/shopware.ts:264-275` | `public get Snippet() { if (!Shopware.Application.view?.i18n) { return null; } return { ...Shopware.Application.view.i18n.global, tc: Shopware.Application.view.i18n.global.t }; }` |
| **Deep Q2:** core uses `Shopware.Snippet.tc` inside a prop default | `administration: Resources/app/administration/src/app/component/form/sw-tagged-field/index.js:28-34` | `default() { return Shopware.Snippet.tc('global.sw-tagged-field.text-default-placeholder'); },` |
| **Deep Q2:** the same call used entirely outside a component `this` scope, including the plural form | `administration: Resources/app/administration/src/core/factory/http.factory.js:290-342` | `const timesSnippet = Shopware.Snippet.tc('global.default.xTimesIn', times);` |
| **Deep Q2:** `snippetService` is an API service, not a translator | `administration: Resources/app/administration/src/core/service/api/snippet.api.service.ts:21-23` | `super(httpClient, loginService, apiEndpoint); this.name = 'snippetService';` |
| **Deep Q3:** `vue/no-mutating-props` is a lint error scoped to `**/*.js`, not a runtime failure | `administration: Resources/app/administration/eslint.config.mjs:200-218` | `files: ['**/*.js'], ignores: ['**/*.spec.js'] … 'vue/no-mutating-props': 'error',` |
| **Deep Q3:** the custom `warnHandler` re-throws only on template compilation errors | `administration: Resources/app/administration/src/app/adapter/view/vue.adapter.ts:195-213` | `console.warn(...warnArgs); if (msg.includes('Template compilation error')) { … throw new Error(msg); }` |
| **Deep Q4:** the TS/TSX block of `code-mods.js` enables no `vue/*` rule (three `sw-*` rules on, ~110 entries `off`) | `administration: Resources/app/administration/code-mods.js:321-447` | `files: ['**/*.ts','**/*.tsx'] … 'sw-deprecation-rules/no-compat-conditions': ['error'], …` |
| **Deep Q4:** the base config cannot supply it either — vue rules are remapped to js/vue/twig globs | `administration: Resources/app/administration/eslint.config.mjs:129-136` | `// Vue rules scoped to JS, Vue, and Twig files only (not TS)` |
| **Deep Q5:** non-sync components get exactly one `AsyncComponentWrapper` instance | `administration: Resources/app/administration/src/app/adapter/view/vue.adapter.ts:404-427` | `defineAsyncComponent({ loader: importMethod, delay: 0, loadingComponent: { name: 'async-loading-component', … } })` |
| **Deep Q5:** sync components are registered directly — zero wrappers; the sync set holds 11 hard-coded names | `administration: Resources/app/administration/src/app/adapter/view/vue.adapter.ts:536-570`; `src/core/factory/async-component.factory.ts:103-114` | `if (Component.isSyncComponent && Component.isSyncComponent(componentName)) { … this.app?.component(componentName, component);` |
| **Deep Q5:** any plugin can extend the sync set — `markComponentAsSync` is on the public `Shopware` object | `administration: Resources/app/administration/src/core/shopware.ts:139` | `markComponentAsSync` |
| **Deep Q5:** the router path adds no wrapper | `administration: Resources/app/administration/src/app/adapter/view/vue.adapter.ts:624-638` | `getComponentForRoute()` returns the resolved config "without defineAsyncComponent which cannot be used in the router" |
| `$tc` still installed, aliased to `i18n.global.t`, deprecated for 6.8, warns under `V6_8_0_0` | `administration: Resources/app/administration/src/app/adapter/view/vue.adapter.ts:182-193` | `/** @deprecated tag:v6.8.0 - Will be removed, use $t instead. */ … this.app.config.globalProperties.$tc = …` |
| vue-i18n v10 argument-order shim, with warning | `administration: Resources/app/administration/src/app/adapter/view/vue.adapter.ts:159-166` | `if (args.length === 3 && typeof args[1] === 'number' && typeof args[2] === 'object') { console.warn('the order of the parameters for $t has changed…` |
| Auto-fixable core rule rewriting `$tc()` to `$t()` in script and template | `administration: Resources/app/administration/eslint-rules/core-rules/no-tc-translation.js:29-32` | `noTc: 'Use $t() instead of $tc(). $tc is deprecated — $t handles pluralization natively.',` |
| Codemod rule set for plugin JS | `administration: Resources/app/administration/code-mods.js:299-306` | `'vue/no-deprecated-destroyed-lifecycle': 'error', 'vue/no-deprecated-events-api': 'error', 'vue/require-slots-as-functions': 'error', 'vue/no-deprecated-props-default-this': 'error',` |
| Codemod entry point and version switch | `administration: Resources/app/administration/code-mods.js:74-77, :12-16` | `$ npm run code-mods -- [--fix] --plugin-name SwagExamplePlugin` / `const shopwareVersions = ['6.6','6.7'];` |
| Core's robust `$parent` walk matching `$options.name` | `administration: Resources/app/administration/src/app/component/sidebar/sw-sidebar/index.js:85-96` | `while (parent) { if (parent.$options.name === 'sw-page') { this._parent = parent; return; } parent = parent.$parent; }` |
| Core still contains hard-coded double hops, so the pattern is fragile but not banned | `administration: Resources/app/administration/src/app/component/utils/sw-step-item/index.js:63-65` | `stepDisplay() { return this.$parent.$parent; },` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `Shopware.compatConfig` still exists to opt a component into Vue 2 behaviour | absent | No such property on the `Shopware` class; four core modules still write `compatConfig: Shopware.compatConfig`, which now evaluates to `undefined` (`src/module/sw-settings-state-machine/page/sw-settings-state-machine-list/index.js:13`) |
| `@vue/compat` is shipped so Vue 2 runtime behaviour is emulated | absent | `grep -n compat package.json` matches only `@eslint/compat`; no `configureCompat()` anywhere in `src/` |
| An eslint rule or codemod fixes `$parent` traversal | absent | No rule under `eslint-rules/{core,deprecation,plugin}-rules` mentions `$parent`; `code-mods.js` registers none |
| `vue/no-deprecated-props-default-this` applies to TypeScript plugin files | absent | The rule name occurs once, at `code-mods.js:306`, inside the `files: ['**/*.js']` block |
| `snippetService` provides a translation function usable in a prop default | absent | `SnippetApiService extends ApiService` with endpoint `snippet`; only HTTP methods |
| Shopware turns Vue's prop-mutation warning into a thrown error | absent | `warnHandler` re-throws only when the message includes `Template compilation error` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| core production call site of `Shopware.Snippet.tc` in a prop default — the exact pattern asked about | `administration: Resources/app/administration/src/app/component/form/sw-tagged-field/index.js:28-34` |
| `$t`/`$tc` resolvable at runtime via `globalProperties`, so the throw is about `this`, not about `$tc` being gone | `administration: Resources/app/administration/src/app/adapter/view/vue.adapter.ts:179-181` |
| no jest spec anchors `Shopware.Snippet.tc` (deep pass: `sw-tagged-field` ships no spec at v6.7.13.0; code search over the admin `test/` tree returns nothing) | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Contributor reports 6.7's `$tc`→v10 `$t` mapping silently changes argument order for plural+named args | 6.7 | closed | https://github.com/shopware/shopware/issues/9931 |
| Merged PR adding the `$tc` deprecation | 6.7 | merged | https://github.com/shopware/shopware/pull/10352 |
| Core-side follow-up: all `$tc` call sites replaced by `$t`, enforced by an ESLint rule | 6.7 | closed | https://github.com/shopware/shopware/issues/16257 |
| `Component.extend()` against a wrapper SFC child fails silently, forwards no props | unclear | open | https://github.com/shopware/shopware/issues/19602 |
| Agency post listing Vue 3 admin breakages (filters, `setup()` `this`, `$children`, `.sync`) — mentions neither `$parent` nor `$tc` in prop defaults | 6.7 | open | https://www.codecommercesolutions.com/fix-shopware-vuejs-3-plugin-issues/ |
| Blog: prop defaults lose `this`; `$parent` unreliable because of `AsyncWrapperComponent`, "sometimes requiring `this.$parent.$parent`" | 6.7 | open | https://tobias-schaefer.com/blog/shopware-migration-66-to-67/ |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `Shopware.Snippet.tc` exist, given `Shopware.compatConfig` did not? | deep pass Q1 | Yes — a getter at `shopware.ts:264-275`, spreading `i18n.global` with `tc` aliased to `t`; returns `null` before the view is initialised. |
| What actually works for translating in a prop default? | deep pass Q2 | `Shopware.Snippet.tc`, used by core itself; `snippetService` is an HTTP API service and cannot translate. |
| Does prop mutation fail hard, and is it Shopware-enforced? | deep pass Q3 | No throw. Lint-only at build time for `**/*.js`; at runtime plain Vue's `console.warn`, stripped in production. |
| Is `this.$tc` in a prop default flagged for TypeScript plugins? | deep pass Q4 | No — no `vue/*` rule is enabled for `.ts`/`.tsx` in either `code-mods.js` or `eslint.config.mjs`. |
| Is one extra `.$parent` hop the correct general fix? | deep pass Q5 | No — one wrapper for async registration, zero for the 11 sync components and for router-resolved components; the sync set is runtime-extensible. Depth is variable. |
| Does the `$tc` argument order change silently? | code lane | It warns: `fixI18NParametersOrder` detects the old `(key, choice, named)` shape and logs. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| `this.$parent` is unreliable because Vue 3 wraps async components; `this.$parent.$parent` may be needed | "Where in Vue 2, a `this.$parent` call was successful, in Vue 3, a `this.$parent.$parent` may be necessary." | `guides/upgrades-migrations/administration/vue3.md:100` | partly — the wrapper is real, but the depth is variable, so a fixed extra hop is not the fix |
| Avoid `$parent` communication; use services or events | "Try to avoid `this.$parent` communication whenever possible…" | `…/vue3.md:101` | admitted as intent — core still uses `$parent` and no rule bans it |
| Prop defaults lose `this`; use `Shopware.Snippet.tc` | "You can no longer call `this.$tc` in default functions. Use `Shopware.Snippet.tc` instead." | `…/vue3.md:122` | yes — the getter exists and core uses it in a prop default |
| `this.$` calls are likely to break "except for `this.$tc`" | "These calls are very likely to break except for `this.$tc`." | `…/vue3.md:83` | no — `$tc` is deprecated for removal in 6.8 and auto-fixed to `$t` |
| Mutating props "will fail with hard errors" in Vue 3 | "In Vue 3, this will fail with hard errors." | `…/vue3.md:126` | no — `warnHandler` re-throws only on template compilation errors |
| `@hook:mounted` may fire twice for async components | "Vue 3 will emit the hook for the `AsyncComponentWrapper` and the underlying component." | `…/vue3.md:92` | consistent with the wrapper found, but not separately verified |
| The Vue migration build was removed in 6.7 | "All plugins must be fully migrated to Vue 3 without relying on the migration build." | `…/vue-migration-build.md:16` | yes — no `@vue/compat`, no `configureCompat()`, `Shopware.compatConfig` gone |
| `$children`, `$on`/`$off`/`$once`, `$listeners` are removed | "The methods `$on`, `$off`, and `$once` are removed in Vue 3, with no replacement." | `…/vue-migration-build.md:72, :92, :32` | consistent — the codemod set enables `vue/no-deprecated-events-api` |
| shopware-cli's fixer covers only unambiguous Administration rules | "They are not a general-purpose Administration migration engine…" | `products/tools/cli/automatic-refactoring.md:113` | not examined |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| `vue3.md:83` names `this.$tc` as the API that survives the migration | `$tc` is only an alias of `i18n.global.t`, marked `@deprecated tag:v6.8.0`, warns under the `V6_8_0_0` flag, and an auto-fixable core rule rewrites it to `$t`. 6.6-era advice. | `administration: src/app/adapter/view/vue.adapter.ts:182-193`; `eslint-rules/core-rules/no-tc-translation.js:29-32` |
| `vue3.md:126` states prop mutation "will fail with hard errors" in Vue 3 | No throw. `vue/no-mutating-props` is a build-time lint error for `**/*.js` only, and the custom `warnHandler` re-throws only on `Template compilation error`; production builds strip the warning. | `administration: eslint.config.mjs:200-218`; `src/app/adapter/view/vue.adapter.ts:195-213` |
| `vue3.md:100` implies the fix for a shifted `$parent` is an extra `.$parent` hop | One wrapper for async-registered components, none for the 11 sync components or router-resolved ones, and the sync set is extensible at runtime via the public `Shopware.markComponentAsSync`. Depth is variable. | `administration: src/app/adapter/view/vue.adapter.ts:404-427,536-570,624-638`; `src/core/factory/async-component.factory.ts:103-114` |
| `vue3.md:101` calls `$parent` an anti-pattern to be replaced by services or events | Core still ships hard-coded `this.$parent.$parent` hops and no lint rule or codemod covers `$parent`; core's own robust variant walks the chain matching `$options.name`. | `administration: src/app/component/utils/sw-step-item/index.js:63-65`; `src/app/component/sidebar/sw-sidebar/index.js:85-96` |
| `vue3.md` is the 6.7 migration index's Vue 3 reference but is written for the 6.6 release and still lists vuex reactivity as a live concern | 6.7 ships plain Vue 3.5.22 with no `@vue/compat`; `Shopware.compatConfig` no longer exists, so four core modules evaluate it to `undefined`. | `administration: Resources/app/administration/package.json:117`; `src/module/sw-settings-state-machine/page/sw-settings-state-machine-list/index.js:13` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Search the admin code for `this.$` — it indicates Vue internal API that is likely to break; `this.$tc` is the documented exception. | removed | The "`$tc` is the exception" clause is disproved: `$tc` is deprecated for removal in 6.8, warns under `V6_8_0_0` and is auto-fixed to `$t` by `no-tc-translation`. The remaining "search for `this.$`" advice is a doc heuristic with no code backing and does not decide whether an answer is usable; replaced by fact 3, which names the actual tooling (`npm run code-mods`) and its `**/*.js`-only scope. |
| `this.$parent` can need an extra `.$parent` hop because Vue 3 wraps async components in `AsyncWrapperComponent`; the guidance is to replace `$parent` communication with services or events. | rewritten (fact 2) | Deep pass Q5: the wrapper is real but the depth is not fixed — zero wrappers for the 11 sync components (set extensible at runtime via `Shopware.markComponentAsSync`) and for router-resolved components, one otherwise. A hard-coded extra hop is the wrong general fix; the fact now names core's `$options.name` walk. |
| Prop default functions no longer have access to `this`; use `Shopware.Snippet.tc` there instead of `this.$tc`. Mutating props, silently tolerated in Vue 2, now throws a hard error. | split — first sentence kept and strengthened (fact 1), second sentence removed | `Shopware.Snippet.tc` is confirmed to exist and is used by core in a prop default, so the first half stands and gained the `snippetService` absence. The prop-mutation clause is disproved: no hard error at runtime — `warnHandler` re-throws only on template compilation errors, and `vue/no-mutating-props` is CI lint for `**/*.js`. Moved to the Trap as a wrong claim to guard against. |
