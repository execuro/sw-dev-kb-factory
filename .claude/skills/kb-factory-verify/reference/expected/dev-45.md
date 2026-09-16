# `dev-45` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-45` · `dev` · `Admin migration (Vue 3 / Vite / Pinia / Meteor)` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-42-51` |
| Core version | `6.7.13.0` |

**Query:** Shopware.State is deprecated in 6.7 — how do I convert my administration Vuex module into a Pinia store?

**Expected answer — every fact an answer must contain:**

1. Registration moves from `Shopware.State.registerModule` to `Shopware.Store.register`, which is typed as Pinia's `defineStore` and takes either a single options object carrying an `id` property or `('<id>', <setup function>)`; `Shopware.Store.unregister('<id>')` removes it again. A store file only has to be imported for its side effect — Pinia itself is installed on the Vue app earlier, in `init-pre/store.init.ts`.  `[code: shopware/administration: Resources/app/administration/src/app/store/index.ts:59-90, src/app/store/tabs.store.ts:15-33, src/app/store/session.store.ts:4-6, src/app/init-pre/store.init.ts:29-39]`
2. The store body is `state` as a function returning the initial state, `getters` that receive `state` as their first argument, and `actions` that mutate the state directly through `this`. There is no `mutations` key and no `commit` equivalent — `Shopware.Store` exposes only `register`, `unregister`, `get`, `list` and `clear`.  `[code: shopware/administration: Resources/app/administration/src/app/store/tabs.store.ts:15-33, src/app/store/extensions.store.ts:52-56, src/app/store/index.ts:1-118]`
3. Reads change from `Shopware.State.get('<id>')` to `Shopware.Store.get('<id>')`, which throws `Store with id "<id>" not found` when the id was never registered. `Shopware.State` is **not** gone in 6.7.13.0: it is still a live property backed by Vuex 4.1.0 and carries `@deprecated tag:v6.8.0`, so a plugin's own Vuex module still runs on 6.7 and the hard cut is 6.8.  `[code: shopware/administration: Resources/app/administration/src/app/store/index.ts:51-57, src/core/shopware.ts:167-171, package.json:227-229]`

**Trap:** the sibling page `guides/plugins/plugins/administration/data-handling-processing/using-vuex-state.md` still teaches `Shopware.State.registerModule` with no deprecation notice, so an agent that lands there writes a Vuex module. The facts above must come from the Pinia page and the source.

**Official reference URL:** https://developer.shopware.com/docs/guides/upgrades-migrations/administration/pinia.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `Store.register` is the documented `registerModule` replacement and is typed as `defineStore` | `Resources/app/administration/src/app/store/index.ts:59-90` | `/**\n * Register a new Pinia store. Works similar like Vuex's registerModule.\n */\npublic register = (<…>` … `const store = defineStore(id, definition as DefineStoreOptions<Id, S, G, A>);` |
| Options form: single object with `id`, a `state` factory and `actions` mutating via `this` | `Resources/app/administration/src/app/store/tabs.store.ts:15-33` | `const tabsStore = Shopware.Store.register({ id: 'tabs', state: (): TabsState => ({ tabItems: {} }), actions: { addTabItem(…)` |
| Setup/composable form: `register('<id>', composable)` | `Resources/app/administration/src/app/store/session.store.ts:4-6` | `const sessionStore = Shopware.Store.register('session', useSession);` |
| Getters receive `state` as first argument | `Resources/app/administration/src/app/store/extensions.store.ts:52-56` | `getters: { privilegedExtensionBaseUrls(state) {` |
| Importing a store file registers it; Pinia is installed in init-pre | `Resources/app/administration/src/app/init-pre/store.init.ts:29-39` | `app.use(Store.instance._rootState);` |
| `Store.get` throws on an unknown id | `Resources/app/administration/src/app/store/index.ts:51-57` | `if (!piniaStore) { throw new Error(\`Store with id "${id}" not found\`); }` |
| `Shopware.State` still live, deprecated for 6.8, `Shopware.Store` beside it | `Resources/app/administration/src/core/shopware.ts:167-171` | `/** @deprecated tag:v6.8.0 - Will be removed, use Store instead. */ public State = StateFactory(); public Store = Store.instance;` |
| Vuex still shipped, removal announced in the manifest itself | `Resources/app/administration/package.json:227-229` | `"dependenciesComments": { "vuex": "Vuex is deprecated and will be removed with Shopware 6.8.0" }` |
| Pinia version in use | `Resources/app/administration/package.json:100` | `"pinia": "2.3.1",` |
| Store ids are declared on a global `PiniaRootState` interface; `VuexRootState` is deprecated for 6.8 | `Resources/app/administration/src/global.types.ts:386-394` | `/** @deprecated tag:v6.8.0 - Will be removed use PiniaRootState instead */ interface VuexRootState {` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `Shopware.State` has already been removed in 6.7 | absent | Still a live public property returning the Vuex-backed `FullState`; the Vuex root is still handed to the Vue app (`const vuexRoot = State._store; this.app.use(vuexRoot)`) — `src/app/adapter/view/vue.adapter.ts:287-294` |
| A `mutations` concept or `commit()` equivalent on a Pinia store | absent | `Store` exposes only `register`, `unregister`, `get`, `list`, `clear`; no core store in `src/app/store` declares `mutations` — `src/app/store/index.ts:1-118` |
| A codemod that converts a Vuex module to a Pinia store | absent | `code-mods.js` registers only the Vue-3 lint rules and the Meteor component rules; `scripts/codemods` holds js-vue3-feature-flag-removal, sfc-migration, twig-block-removal, twig-feature-flag-removal — none touches Vuex or Pinia — `Resources/app/administration/scripts/codemods/` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| the full list of core stores already converted, usable as reference implementations | `Resources/app/administration/src/app/init-pre/store.init.ts:1-23` |
| the exported-type pattern each core store follows so a plugin store can be typed on `PiniaRootState` | `Resources/app/administration/src/app/store/tabs.store.ts:35-42` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `Shopware.State.get(...)` returns `undefined` for a store that moved to Pinia; a shipped plugin crashed the admin on 6.7.12.2 | 6.7 | closed | https://github.com/shopware/shopware/issues/19700 |
| Core stores migrated to Pinia one PR at a time (swProductDetail, swOrder, swFlow, swBulkEdit, …) | 6.6 / 6.7 | merged | https://github.com/shopware/shopware/pull/5885 |
| Maintainer reports Pinia's `mapState` helper broke once vue-compat was disabled; core replaced it with plain computed properties | 6.7 | closed | https://github.com/shopware/shopware/issues/5944 |
| Blog: `registerModule` deprecated, mutations gone, Vuex helpers renamed `mapVuexState`/`mapVuexGetters`/… , `Shopware.State` removed in 6.8 | 6.7 | open | https://tobias-schaefer.com/blog/shopware-migration-66-to-67/ |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `Shopware.State` still exist in 6.7, or does `State.get()` return undefined? | code | State is live and Vuex-backed; a plugin's **own** Vuex module still resolves. Issue #19700 is about **core** stores that moved to Pinia and are therefore no longer Vuex modules — not a contradiction. No fact asserts that a core store is reachable through `State`. |
| Exact signature of `Store.register`; must `state` be a function? | code | `index.ts:59-90` (typed as `defineStore`, both forms) and `tabs.store.ts:15-33` (state factory). |
| Is `Store.get(id)` throwing on an unknown id? | code | Yes — `index.ts:51-57`. |
| Are `mutations` supported? | code | No — absence table. |
| Were the Vuex helpers renamed to `mapVuexState`/`mapVuexMutations`/`mapVuexGetters`/`mapVuexActions`? | code | Confirmed at `src/app/init/component-helper.init.ts:6-24`, and core still calls Pinia `mapState` at 6.7.13.0 (`src/module/sw-flow/component/sw-flow-sequence-action-error/index.js:22`), which is in tension with issue #5944. Deliberately kept **out of the facts**: it is not needed to convert a store, and the tension is unresolved. |
| Do `Shopware.State` functions emit a runtime deprecation warning? | not settled | Kept out of the facts — see divergence below. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Vuex is replaced by Pinia with 6.7 | "With the release of Shopware 6.7, we will replace Vuex with Pinia as the state management library for the administration." | `guides/upgrades-migrations/administration/pinia.md:9` | partly — Pinia is in place, but Vuex is still shipped and `Shopware.State` still works in 6.7 |
| Register with `Shopware.Store.register`, defining `state`, `getters`, `actions` | "First, register it with `Shopware.Store.register` and define the store with `state`, `getters`, and `actions` properties" | `pinia.md:19` | yes — `index.ts:59-90`, `tabs.store.ts:15-33` |
| `state` must be a function returning the initial state | "In Pinia, `state` must be a function that returns the initial state rather than a static object." | `pinia.md:104` | yes — `tabs.store.ts:15-33` |
| `mutations` are gone; state is modified directly in actions | "Vuex `mutations` are no longer needed in Pinia, since you can modify the state directly in actions or compute it dynamically." | `pinia.md:114` | yes — absence table |
| A getter may not share a name with a state property | "There cannot be getters with the same name as a property in the state, as both are exposed at the same level in the store." | `pinia.md:126` | **no** — no code finding; a Pinia-library rule no core store demonstrates |
| Reads change from `Shopware.State.get` to `Shopware.Store.get` | "To access the store in Vuex, you would typically do: `Shopware.State.get('<storeName>');` … it changes to: `Shopware.Store.get('<storeName>');`" | `pinia.md:206-216` | yes — `index.ts:51-57` |
| Importing the store file is enough to register it | "To register a store from a component or index file, simply import the store file." | `pinia.md:84` | yes — `store.init.ts:1-23,29-39` |
| Re-registering an existing store overwrites it; `unregister` exists | "If you register a store that already exists, it will be overwritten. You can also unregister a store:" | `pinia.md:78` | `unregister` yes; the overwrite semantics were not checked |
| All `Shopware.State` functions cause DevTools deprecation warnings in 6.7 | "All `Shopware.State` functions will cause warnings to appear in the DevTools. For example `Shopware.State.registerModule is deprecated. Use Shopware.Store.register instead!`" | `adr/2024-06-17-replace-vuex-with-pinia.md:27-29` | **no** — see divergence |
| `Shopware.State`, `state.init.ts`, `state.factory.ts`, `VuexRootState` and the vuex package all go in 6.8 | "With Shopware 6.8 we will entirely remove everything Vuex related including the dependency." | `adr/…-pinia.md:68-74` | yes, as an announcement — the `@deprecated tag:v6.8.0` annotations and the package.json comment match |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The ADR says every `Shopware.State` function emits a DevTools deprecation warning in 6.7. | The state factory and `Shopware.State` carry `@deprecated tag:v6.8.0` annotations, but the code lane found no runtime warning path — `registerModule` is still a plain Vuex passthrough on the `FullState` interface. A developer who expects to be warned at runtime may not be. | `src/core/factory/state.factory.ts:1-4`; `src/core/shopware.ts:167-171` |
| `using-vuex-state.md` still teaches `Shopware.State.registerModule` / `unregisterModule` / `get()` as the way to hold admin state, with no deprecation banner and with Vue-2-era `beforeCreate`/`beforeDestroy` and `sw-text-field`. | `Shopware.State` is deprecated for removal in 6.8 and `Store` is the replacement named in the source itself. | `src/core/shopware.ts:167-171` |
| `pinia.md` is written in future tense ("we will replace Vuex") although 6.7 is released, and the ADR's own example writes a getter as an arrow function using `this`. | Core stores use ordinary method getters receiving `state`. | `src/app/store/extensions.store.ts:52-56` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `Register with `Shopware.Store.register('<storeName>', { state, getters, actions })` and unregister with `Shopware.Store.unregister('<storeName>')`; importing the store file is enough to register it, no `Shopware.State.registerModule` call.` | rewritten | The `(id, definition)` call form takes a **setup function**, not an options object; the options form is a single object carrying `id` (`tabs.store.ts:15-33`, `session.store.ts:4-6`). The rest is confirmed. |
| `Reads change from `Shopware.State.get('<storeName>')` to `Shopware.Store.get('<storeName>')`; a getter may not share a name with a state property.` | clause removed | No code finding backs "a getter may not share a name with a state property"; it is an unconfirmed Pinia-library claim from `pinia.md:126` that no core store demonstrates. Replaced with the code-backed throw behaviour of `Store.get` and the fact that `Shopware.State` is still alive in 6.7. |
| `state` must be a function returning the initial state rather than a static object, and `mutations` are removed — state is modified directly inside `actions`. | kept, retagged | Confirmed by `tabs.store.ts:15-33` and the `mutations` absence; extended with the getter signature and the closed `Store` API surface. |
