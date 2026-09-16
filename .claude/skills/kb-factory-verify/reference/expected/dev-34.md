# `dev-34` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-34` · `dev` · `Administration` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-32-41` |
| Core version | `6.7.13.0` |

**Query:** How do I extend an existing Administration component and its Twig blocks from my plugin, for example to change the dashboard headline?

**Expected answer — every fact an answer must contain:**

1. `Shopware.Component.override('sw-dashboard-index', { template })` changes an existing component in place, whereas `Shopware.Component.extend('<new-name>', 'sw-dashboard-index', { template })` registers a **new** component under a new name and leaves the original untouched. The override config's `template` is consumed by the template factory and deleted from the config; the target need not be registered yet, and nothing validates that it exists.  `[code: administration package — src/core/factory/async-component.factory.ts:578-598,608-613,655-666,671-679]`
2. The template override declares a Twig `{% block %}` with the same name as in the original template — for the dashboard headline, `sw_dashboard_index_content_intro_content_headline` in `sw-dashboard-index.html.twig`, which is still an Options-API component with a `.html.twig` template in 6.7.13.0. `{% parent %}` is required to keep the original markup: without it the block is replaced wholesale, in the legacy merge and in the 6.7 native `<sw-block>` runtime alike. An override naming a block that does not exist (or one another plugin has already replaced without `{% parent %}`) is silently dropped — no warning.  `[code: administration package — src/core/factory/template.factory.js:55-73,236,310-345,348-368]` `[code: administration package — src/module/sw-dashboard/page/sw-dashboard-index/sw-dashboard-index.html.twig:13-17]`
3. `this.$super('<name>')` calls the inherited implementation instead of replacing it. It is generated, not declared: a method or computed only enters the super registry when its own source text matches `/\.\$super/`, and `$super` is injected into `config.methods` only when that registry is non-empty. For a computed declared as a getter/setter object the key is `'<name>.get'` / `'<name>.set'`, not the bare name; an unresolvable name throws.  `[code: administration package — src/core/factory/async-component.factory.ts:771-783,960-968,991-996,1017-1030,1175-1184]`

**Trap:** "Extend" is the word developers use for what the API calls `Component.override`; `Component.extend` creates a differently named new component instead of changing the existing one. A second trap: `*.override.vue` is auto-registered by the Vite build but `registerOverrideComponent` is `@experimental stableVersion:v6.8.0` behind `ADMIN_COMPOSITION_API_EXTENSION_SYSTEM`, so it is not the stable 6.7 route.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/customizing-components.html
<!-- expected:end -->

## Evidence — code (decisive)

Source version `6.7.13.0`. Paths relative to `vendor/shopware/administration/Resources/app/administration/` unless stated.

| fact | citation | excerpt |
| --- | --- | --- |
| `register` / `extend` / `override` are the three extension entry points on the global | `src/core/shopware.ts:130-132` | `register: AsyncComponentFactory.register, extend: AsyncComponentFactory.extend, override: AsyncComponentFactory.override,` |
| `override(componentName, config, overrideIndex = null)` pushes into an override registry keyed by component name, sorted by index ascending; the target need not be registered first | `src/core/factory/async-component.factory.ts:608-613,671-679` | `overrides.push({ index: overrideIndex !== null ? overrideIndex : 0, config: configResolveMethod }); overrides.sort((a, b) => a.index - b.index);` |
| An override config's `template` is handed to `TemplateFactory.registerTemplateOverride` and then deleted from the config | `src/core/factory/async-component.factory.ts:655-666` | `TemplateFactory.registerTemplateOverride(componentName, config.template as string, overrideIndex); … delete config.template;` |
| `extend(componentName, extendComponentName, config)` registers a **new** component name inheriting the extended template, setting `config.extends` | `src/core/factory/async-component.factory.ts:578-598` | `TemplateFactory.extendComponentTemplate(componentName, extendComponentName, config.template as string); … config.extends = extendComponentName;` |
| `{% parent %}` is a Twig **statement tag** (not a function), to avoid clashing with Vue syntax | `src/core/factory/template.factory.js:55-73` | `TwigCore.exports.extendTag({ type: 'parent', regex: /^parent/, … output: '{{\|PARENT\|}}' });` |
| Legacy merge: an override block replaces the base token, with `{% parent %}` expanded to the base block's output; a leftover parent placeholder is stripped to empty | `src/core/factory/template.factory.js:236,326-345,348-368` | `if (t.type === 'logic' && t.token.type === 'parent') { return [...acc, ...token.token.output]; }` · `templateDefinition.html.replace(parentRegExp, '')` |
| Native runtime: `{% parent %}` becomes the element `<sw-block-parent />`; `sw-block` renders only the **last** node of the stack and hands the earlier ones to the `parents` injection | `src/core/factory/reconstruct-twig-template.ts:59-62`; `src/app/component/structure/sw-block-override/sw-block/index.ts:156-170` | `return '<sw-block-parent />';` · `const lastNode = blocksNodes.pop(); … providedParents.value = blocksNodes; return lastNode;` |
| Both runtimes are live in 6.7.13.0 and one `override({ template })` feeds both: the block index (`indexTwigBlocksFromTemplate`) **and** `registerTemplateOverride` | `src/core/factory/async-component.factory.ts:615-665,800-810` | `if (!isSyncWithTemplate) { indexTwigBlocksFromTemplate(componentName, config.template as string); }` |
| Which runtime renders depends on the target: a classic Options-API component with a registered `template` string goes through the legacy string merge, which assigns the merged HTML back onto `config.template` | `src/core/factory/template.factory.js:184-198,220-240,256-303`; `async-component.factory.ts:800-803` | `const componentTemplate = await getComponentTemplate(componentName); if (config && typeof componentTemplate === 'string') { config.template = componentTemplate; }` |
| A component rendering `<sw-block name="…">` has no registered Twig template, so the merge yields nothing and `sw-block` pulls the indexed entries into shim slots instead | `src/app/component/structure/sw-block-override/sw-block/index.ts:84-125,145-172` | `props.name && hasBlockEntries(props.name) ? getBlockEntries(props.name).map(…)` |
| Block identity differs between the runtimes: the legacy registry is keyed by **component name**, the native index is a `Map<blockName, BlockEntry[]>` where component name is metadata only | `src/core/factory/template.factory.js:184-196`; `src/core/factory/transform-legacy-block-conditionals.ts:200,1003-1011,1043-1047` | `const legacyTwigBlockIndex = new Map<string, BlockEntry[]>();` |
| Only **top-level** `{% block %}` tokens of an override become index entries; nested blocks are re-emitted as `<sw-block name="…">` elements | `src/core/factory/twig-block-index.ts:100-107`; `src/core/factory/reconstruct-twig-template.ts:64-67` | `return \`<sw-block name="${token.token.blockName}">${innerContent}</sw-block>\`;` |
| Replacing an outer block without `{% parent %}` deletes the base's inner block token from the tree, so another plugin's inner override matches nothing; `resolveTokens` does not recurse into the replaced base token | `src/core/factory/template.factory.js:310-345` | `if (isInOverrides) { … return [...acc, isInOverrides]; } const resolvedTokens = resolveTokens(token.token.output, overrideTokens);` |
| `overrideIndex` orders the legacy merge only; the native shim order is plain registration (push) order and never consults the index | `src/core/factory/template.factory.js:195`; `src/core/factory/transform-legacy-block-conditionals.ts:976-1011,1030` | `component.overrides.sort((a, b) => a.index - b.index);` · `indexedLegacyTwigBlockEntries.push({ componentName, entries });` |
| TwigJS output tokens (`{{ }}` and whitespace variants) are stripped — only the block system is used; data binding stays with Vue | `src/core/factory/template.factory.js:38-53` | `TwigCore.token.definitions = TwigCore.token.definitions.filter((token) => …token.type !== TwigCore.token.type.output);` |
| `$super` is generated from a super registry and merged into `config.methods` only when that registry is non-empty | `src/core/factory/async-component.factory.ts:771-783` | `const superRegistry = buildSuperRegistry(config); if (isNotEmptyObject(superRegistry) && config) { config.methods = { ...config.methods, ...addSuperBehaviour(inheritedFrom, superRegistry) }; }` |
| A method/computed enters the registry only when its **source text** matches `/\.\$super/` | `src/core/factory/async-component.factory.ts:991-996` | `const superCallPattern = /\.\$super/g; … if (!hasSuperCall) { return superRegistry; }` |
| `$super(name)` walks a non-reactive per-instance `_virtualCallStack` to find the next implementation up the chain; calling `$super('$super')` or an unresolvable name throws | `src/core/factory/async-component.factory.ts:1017-1030`; `src/app/plugin/virtual-call-stack.plugin.ts:8-19` | `throw new Error(\`There was an error resolving the "$super" chain for method "${name}".\`);` |
| For a computed declared as a getter/setter object the registry path is `` `${name}.${cmd}` `` and the placeholder calls `this.$super('<name>.get')` | `src/core/factory/async-component.factory.ts:960-968,1175-1184` | `targetConfig[methodOrComputed][key][cmd] = function (...args) { return this.$super(\`${key}.${cmd}\`, ...args); };` |
| The dashboard headline `<h1>` sits in block `sw_dashboard_index_content_intro_content_headline` and renders the computed `welcomeMessage` | `src/module/sw-dashboard/page/sw-dashboard-index/sw-dashboard-index.html.twig:13-17` | `{% block sw_dashboard_index_content_intro_content_headline %} <h1 class="sw-dashboard-index__welcome-title">{{ welcomeMessage }}</h1>` |
| `sw-dashboard-index` is still Options-API with a `.html.twig` template in 6.7.13.0 — the whole `sw-dashboard` module contains no `.vue` SFC | `src/module/sw-dashboard` (file listing); `…/sw-dashboard-index/index.js:1-12` | `import template from './sw-dashboard-index.html.twig'; … wrapComponentConfig({ template,` |
| The same headline can be changed without touching the template, by overriding the `welcomeMessage` computed property | `src/module/sw-dashboard/page/sw-dashboard-index/index.js:24-43` | `computed: { welcomeMessage() {` |
| A Vite plugin auto-imports every `*.override.vue` under the plugin's admin src and registers it | `build/vite-plugins/override-component-register/index.ts:12-59` | `return \`Shopware.Component.registerOverrideComponent(${name});\`;` |
| `registerOverrideComponent` is **experimental**, stable only in 6.8, behind `ADMIN_COMPOSITION_API_EXTENSION_SYSTEM` | `src/core/shopware.ts:145-156` | `@experimental stableVersion:v6.8.0 feature:ADMIN_COMPOSITION_API_EXTENSION_SYSTEM` |
| `Shopware.Template` exposes the template factory directly, so a template-only override is possible | `src/core/shopware.ts:159-164` | `override: TemplateFactory.registerTemplateOverride,` |
| `register()` refuses a duplicate component name — re-registering is not a way to extend | `src/core/factory/async-component.factory.ts:483-491` | `The component "${componentName}" is already registered. Please select a unique name` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| An override warns or fails when the Twig block it declares does not exist (or was removed by another override) | absent | `resolveTokens` / `applyTemplateOverrides` contain no warn or error path for an unmatched block name — `src/core/factory/template.factory.js:310-345` |
| `Component.override` validates that the overridden component exists | absent | `override()` writes straight into `overrideRegistry` with no `componentRegistry` lookup; a typo'd name yields a dangling override and no warning — `src/core/factory/async-component.factory.ts:671-679` |
| `{% parent %}` is optional because the 6.7 block runtime retains parent content automatically | absent | Neither runtime retains it: the legacy merge strips a missing parent placeholder to empty, and `sw-block` returns only the last node, discarding the preceding ones — `template.factory.js:236`; `sw-block/index.ts:164-170` |
| `overrideIndex` orders overrides consistently across both runtimes | absent | `template.factory.js` sorts by index; `ensureLegacyTwigBlockIndex` replays entries in push order and never consults `overrideIndex` — `transform-legacy-block-conditionals.ts:976-1011` |
| `$super` is available on every component | absent | It is merged into `config.methods` only when `buildSuperRegistry` returned a non-empty registry, and a function enters that registry only if its source text matches `/\.\$super/` — `async-component.factory.ts:771-783,991-996` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Active spec exercising the `$super` chain from an override (file stripped from the vendor dist; read from `shopware/shopware` default branch) | `github:shopware/shopware src/Administration/…/src/core/factory/async-component.factory.spec.js` |
| Active specs for the native block runtime and the legacy Twig shim at tag `v6.7.13.0` | `github:shopware/shopware (refs/tags/v6.7.13.0) …/async-component.factory.spec/{legacy-twig-shim-condition-chains.spec.js, native-block-condition-chains.spec.js}` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| A correct narrow override (`{% block %}` + `{% parent %}`) renders nothing once another extension replaces the enclosing block; reporter states overrides merge by a numeric index defaulting to 0, so registration order decides | 6.7.12.1 and trunk | open | https://github.com/shopware/shopware/issues/19906 |
| Same failure mode: a plugin fully replaces `sw_order_line_items_grid_grid_actions_extension` without `{% parent %}`, so another plugin's extension never shows | 6.6.10.5 | closed | https://github.com/shopware/shopware/issues/13116 |
| In 6.7 the `sw-*` components are thin wrappers around Meteor components with props passed through untranslated, so 6.6 markup re-emitted inside an overridden block can silently misbehave (`variant="success"` → `variant="positive"`) | 6.7.0.0-rc2 | closed | https://github.com/shopware/shopware/issues/8859 |
| Maintainer-filed: `<sw-block>` is keyed by blockName only, not componentName + blockName, and a caller attribute can silently retarget a block | trunk / 6.8 | open | https://github.com/shopware/shopware/issues/20076 |
| 6.7 upgrade notes: `sw-dashboard-statistics` and the `sw-chart-card__before` / `__after` sections were removed, replaced by `sw-dashboard__before-content` / `__after-content` | 6.7 | merged | https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `sw-dashboard-index.html.twig` still declare the headline block in 6.7? | code lane | Settled: yes — `sw_dashboard_index_content_intro_content_headline` at `sw-dashboard-index.html.twig:13-17`, and the deep pass confirms the module has no `.vue` SFC |
| Is `template` still an accepted key of `Component.override()` in 6.7? | code lane | Settled: yes — consumed and then deleted from the config at `async-component.factory.ts:655-666` |
| Does a dead override (matching no block) produce a warning? | code lane | Settled: no — silent, `template.factory.js:313-348` |
| How are two overrides of the same block ordered, and what happens to an inner-block override when an outer block is replaced without `{% parent %}`? | deep pass | Settled: the inner override is silently dropped in both runtimes and `overrideIndex` does not rescue it — it only helps when the outer override itself contains `{% parent %}` or re-declares the inner block. Fact 2 |
| Is a Twig block identified by componentName + blockName in 6.7, and does `<sw-block>` or the legacy merge render plugin overrides? | deep pass | Settled: both runtimes are live and disagree — legacy is componentName + blockName, native is blockName alone. For `sw-dashboard-index` (a classic Options-API component with a registered template) the legacy merge is what renders |
| Does `this.$super()` exist, and what does it resolve to? | deep pass | Settled: generated from a source-text-matched super registry, with `'<name>.get'` keys for getter/setter computeds. Fact 3 |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| `extend` creates a new component; `override` overwrites the previous behaviour | "With `Component.override()`, on the other hand, the previous behavior of the component is simply overwritten." | `…/customizing-components.md` | yes — `async-component.factory.ts:578-598,608-613` |
| An override is `Shopware.Component.override(name, config)`, the config holding the overridden properties | "the second parameter has to be an object containing the actually overridden properties" | same page | yes — `async-component.factory.ts:608-613,655-666` |
| Template customisation goes through Twig blocks; `{% parent %}` renders the original block content | "you can render the original markup of a block by using `{% parent %}`" | same page | yes — `template.factory.js:55-73,348-368`; and the deep pass shows it is required, not optional |
| Only TwigJS's block system is used in the Administration | "Every other feature of TwigJS is not used in the Administration." | same page | yes — `template.factory.js:38-53` |
| The dashboard headline is changed by overriding `sw_dashboard_index_content_intro_content_headline` | "we only need to override the twig block with the name `sw_dashboard_index_content_intro_content_headline`" | same page | yes — `sw-dashboard-index.html.twig:13-17`, still the working route at 6.7.13.0 |
| The override must be wired through `main.js` under `src/Resources/app/administration/src` | "It has to be placed into the `<plugin root>/src/Resources/app/administration/src` directory" | same page | yes, established for dev-33 at `Framework/Plugin/BundleConfigGenerator.php:127-139` |
| `this.$super('<name>')` calls the original implementation | "You can achieve this by using `this.$super()` call." | same page | yes — `async-component.factory.ts:1017-1030`, with the source-text and `.get`/`.set` caveats the docs omit |
| A Twig block override applies to every occurrence of the template | "overrides apply to all occurrences of this template" | `…/writing-templates.md` | yes for the legacy merge (the merged template is the component's template); under the native index it is broader still — any `<sw-block>` of that name |
| Multiple plugins may override the same component; overrides apply in registration order | "Overrides are applied in the order they are registered." | `…/customizing-components.md` | partly — the legacy merge sorts by `overrideIndex` (default 0) with registration order breaking ties; the native shim really is registration order |
| The Composition API extension system is experimental with no committed timeline | "Its API can still change, and there is no committed timeline" | same page | yes — `src/core/shopware.ts:145-156` marks it `stableVersion:v6.8.0` behind a flag |
| Overrides of migrated components must follow the `*.override.vue` convention and are auto-loaded | "`*.override.vue` files will be loaded automatically in your main entry file." | `…/vue-native.md` | yes as a build mechanism — `build/vite-plugins/override-component-register/index.ts:12-59` — but the API it calls is experimental in 6.7, and `sw-dashboard-index` is not migrated |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| Overrides are applied in registration order | The legacy merge sorts by a numeric `overrideIndex` (default 0); registration order only decides ties, and the native shim path ignores the index entirely, so the two runtimes can stack overrides differently | `src/core/factory/async-component.factory.ts:671-679`; `src/core/factory/transform-legacy-block-conditionals.ts:976-1011` |
| `*.override.vue` is presented in `vite.md` as a plain part of the 6.7 build | The API it registers into is marked `@experimental stableVersion:v6.8.0` behind `ADMIN_COMPOSITION_API_EXTENSION_SYSTEM` | `src/core/shopware.ts:145-156` |
| `vue-native.md` implies overrides must migrate to the native block implementation once the target is `.vue` | For `sw-dashboard-index` the question does not arise at 6.7.13.0: the module contains no `.vue` SFC, so the documented Twig route is the working one | `src/module/sw-dashboard` (file listing); `…/sw-dashboard-index/index.js:1-12` |
| The docs present `this.$super()` as generally available on an overridden component | `$super` exists only when some function in the chain textually contains `.$super`, and a getter/setter computed must be addressed as `'<name>.get'` / `'<name>.set'` | `src/core/factory/async-component.factory.ts:771-783,991-996,1175-1184` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `Shopware.Component.override('sw-text-field', { template })` replaces an existing component in place, whereas `Shopware.Component.extend('sw-custom-field', 'sw-text-field', { template })` creates a new component under a new name. | kept, re-targeted to the query's example | Confirmed verbatim in substance (`async-component.factory.ts:578-598,608-613`); the component name was switched to `sw-dashboard-index` so the fact matches the case's own example, and the "no validation of the target" finding was added. |
| Template customization declares a Twig `{% block %}` with the same name as in the original template; adding `{% parent %}` inside it keeps the original markup instead of replacing it. | rewritten | Confirmed, but incomplete in the way that decides whether an answer is usable: the deep pass shows `{% parent %}` is required in both 6.7 runtimes, that an unmatched or outer-replaced block is dropped with no warning, and that `sw-dashboard-index` is still the Twig-template component the docs example assumes. |
| `this.$super('onInput')` calls the inherited method or computed property implementation instead of replacing it completely. | rewritten | Confirmed that `$super` exists and does this, but the bare statement is misleading: it exists only when the source text of a function in the chain matches `/\.\$super/`, and a getter/setter computed must be addressed as `'<name>.get'`. |
