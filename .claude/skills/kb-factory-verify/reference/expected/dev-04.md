# `dev-04` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-04` · `dev` · `Content (CMS/mail/SEO/media/sitemap)` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 (6.6 checked against branch `6.6.x` and tag `v6.6.0.0`) |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-2-11` |
| Core version | `6.7.13.0` |

**Query:** How do I create a custom CMS element for Shopping Experiences?

**Expected answer — every fact an answer must contain:**

1. Administration registration is `Shopware.Service('cmsService').registerCmsElement({ name, component, … })`, called from a file imported by the plugin entry point `src/Resources/app/administration/src/main.js`. Only `name` and `component` are required (registration returns `false` if either is missing or `flag === false`), but an element registered without `previewComponent` is silently invisible in the slot's element picker, so a usable element registers component, configComponent and previewComponent. The contract is identical in 6.6 and 6.7. `[code: administration Resources/app/administration/src/module/sw-cms/service/cms.service.ts:155-171 and .../component/sw-cms-slot/sw-cms-slot.html.twig:180-181; core Framework/Plugin/Command/Scaffolding/Generator/AdminModuleGenerator.php:66-69]`
2. Storefront rendering is by naming convention only — a Twig template at `src/Resources/views/storefront/element/cms-element-<name>.html.twig`, where `<name>` is the registered element name. The block template includes `'@Storefront/storefront/element/cms-element-' ~ element.type ~ '.html.twig'` with `ignore missing`, so no PHP or DI registration of the template exists and a missing file renders nothing rather than erroring. `[code: storefront Resources/views/storefront/block/cms-block-text.html.twig:7]`
3. Server-side data is optional and comes from a class extending `AbstractCmsElementResolver`, which implements none of the interface's methods — the subclass must supply all three of `getType(): string`, `collect(CmsSlotEntity, ResolverContext): ?CriteriaCollection` and `enrich(CmsSlotEntity, ResolverContext, ElementDataCollection): void`, with `getType()` returning the element name and `enrich()` attaching a Struct via `$slot->setData(...)`. The DI tag is `shopware.cms.data_resolver`, but it is applied automatically by autoconfiguration to any `CmsElementResolverInterface` implementation in 6.6 and 6.7, so an explicit tag is not required. `[code: Content/Cms/DataResolver/Element/CmsElementResolverInterface.php:11-18, Content/Cms/DataResolver/Element/AbstractCmsElementResolver.php:21-27, Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:148-150]`

**Trap:** registering the element alone is enough to reach it through the "change element" modal of an already-placed block, but the Shopping Experiences sidebar list is built solely from the block registry — without a block the element can never be dragged onto the stage on its own. `[code: administration .../sw-cms/component/sw-cms-slot/index.ts:74-81, .../sw-cms-sidebar/index.ts:144-161]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The PHP contract for element data resolution is `CmsElementResolverInterface` with exactly three methods | `Content/Cms/DataResolver/Element/CmsElementResolverInterface.php:11-18` | `public function getType(): string; public function collect(...): ?CriteriaCollection; public function enrich(...): void;` |
| `AbstractCmsElementResolver` implements the interface but none of the three methods, so a subclass must supply all three | `Content/Cms/DataResolver/Element/AbstractCmsElementResolver.php:21-27` | `abstract class AbstractCmsElementResolver implements CmsElementResolverInterface` |
| The DI tag is `shopware.cms.data_resolver`, consumed by a tagged_iterator in `CmsSlotsDataResolver` | `Content/DependencyInjection/cms.xml:32` | `<argument type="tagged_iterator" tag="shopware.cms.data_resolver"/>` |
| Explicit tagging is optional — autoconfiguration tags every `CmsElementResolverInterface` implementation | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:148-150` | `->registerForAutoconfiguration(CmsElementResolverInterface::class)->addTag('shopware.cms.data_resolver');` |
| Identical autoconfiguration exists on the 6.6.x branch — registration mechanism unchanged between 6.6 and 6.7 | `github.com/shopware/shopware@6.6.x src/Core/Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php` (sha 2712fe2) | same three lines |
| The resolver registry is keyed by `getType()`; the type string is the element's unique identifier and a later registration silently replaces a core one | `Content/Cms/DataResolver/CmsSlotsDataResolver.php:41-50` | `$this->resolvers[$resolver->getType()] = $resolver;` |
| `enrich()` attaches a Struct via `$slot->setData(...)` | `Content/Product/Cms/ProductBoxCmsElementResolver.php:51-53` | `$productBox = new ProductBoxStruct(); $slot->setData($productBox);` |
| Storefront template resolution is by naming convention, no PHP registration | `storefront Resources/views/storefront/block/cms-block-text.html.twig:7` | `{% sw_include '@Storefront/storefront/element/cms-element-' ~ element.type ~ '.html.twig' ignore missing %}` |
| `registerCmsElement(config)` requires only `name` and `component`; returns false otherwise; `collect`/`enrich` default to generic implementations | `administration .../sw-cms/service/cms.service.ts:155-171` | `if (!config.name \|\| !config.component \|\| config.flag === false) { return false; }` |
| `CmsElementConfig` type: `configComponent`, `previewComponent`, `label`, `defaultConfig`, `allowedPageTypes`, `hidden`, `removable` are all optional | `administration .../sw-cms/service/cms.service.ts:41-63` | `type CmsElementConfig = { name: string; component: string; configComponent?: string; … }` |
| Core elements register three Vue components per element directory, then call `registerCmsElement`; `allowedPageTypes` restricts where an element may be dropped | `administration .../sw-cms/elements/manufacturer-logo/index.ts:1-22` | `Shopware.Service('cmsService').registerCmsElement({ name: 'manufacturer-logo', …, allowedPageTypes: [...] });` |
| Plugin administration entry point is `src/Resources/app/administration/src/main.js` | `Framework/Plugin/Command/Scaffolding/Generator/AdminModuleGenerator.php:66-69` | `Stub::raw('src/Resources/app/administration/src/main.js', $this->mainJsEntry)` |
| **Deep, Q1:** element-only registration reaches the per-slot "change element" modal — the picker is built from `getCmsElementRegistry()` filtered only by `isElementAllowedInPageType`, no block is consulted — but each item is gated on `!element.hidden && element.previewComponent` | `administration .../sw-cms/component/sw-cms-slot/index.ts:74-81`; `.../sw-cms-slot/sw-cms-slot.html.twig:180-181` | `const elements = Object.entries(this.cmsService.getCmsElementRegistry()).filter(([name]) => this.cmsService.isElementAllowedInPageType(name, currentPageType));` \|\| `<div v-if="!element.hidden && element.previewComponent" …>` |
| **Deep, Q1:** the sidebar element list comes solely from the block registry, so without a registered block the element cannot be dragged onto the stage; slots themselves are created from `blockConfig.slots` on block drop | `administration .../sw-cms/component/sw-cms-sidebar/index.ts:144-161,582-600` | `const blocks = Object.entries(this.cmsService.getCmsBlockRegistry()).filter(([name, block]) => …)` |
| **Deep, Q1:** an unknown element type in a slot degrades to the "Element could not be load" panel after a 10s timer rather than throwing | `administration .../sw-cms/component/sw-cms-slot/index.ts:152-159` | `mountedComponent()` timeout → `.sw-cms-slot__element-not-found` |
| **Deep, Q2:** the `registerCmsElement` contract is identical in 6.6 and 6.7 — same required `name`/`component`, same optional keys; 6.7 adds only `hover?: boolean`. The file is TypeScript at 6.6.x head and plain JS at tag v6.6.0.0, with the same validation; the previewComponent gate is byte-identical in 6.6 | `github.com/shopware/shopware@6.6.x .../sw-cms/service/cms.service.ts:39-60,151-167`; `@v6.6.0.0 .../sw-cms/service/cms.service.js:34-37` | `function registerCmsElement(config) { if (!config.name \|\| !config.component \|\| config.flag === false) { return false; }` |
| **Deep, Q3:** the app / Admin-SDK route is a different mechanism — the SDK payload is `{name, label, defaultConfig}` only, and the administration handler overrides `component`/`previewComponent`/`configComponent` to the fixed location-renderer trio and injects `appData.baseUrl`; the app renders into iframe locations `<name>-element\|-preview\|-config` | `administration .../app/init/cms.init.ts:6-25`; `shopware/meteor packages/admin-sdk/src/ui/cms/index.ts:3,6-31`; `administration .../sw-cms/elements/location-renderer/component/index.ts:34-40` | `Shopware.Service('cmsService').registerCmsElement({ ...element, name: element.name, component: 'sw-cms-el-location-renderer', previewComponent: 'sw-cms-el-preview-location-renderer', configComponent: 'sw-cms-el-config-location-renderer', appData: { baseUrl: extension.baseUrl } });` |
| **Deep, Q3:** app config travels through the data channel id `<name>__config-element`, suffixed `__<elementId>` since 6.7 (the unsuffixed id is deprecated for removal in 6.8); a registration whose origin matches no installed extension is a silent no-op | `administration .../sw-cms/elements/location-renderer/component/index.ts:88-101`; `.../app/init/cms.init.ts:7-13` | `publishingKey(): string { return \`${this.elementData.name}__config-element\`; }` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| An app (`manifest.xml`) can declare a custom CMS element the way it declares a CMS block | absent | `app_cms_block` exists (`Framework/App/Aggregate/CmsBlock/AppCmsBlockDefinition.php:28`); grep for `CmsElement` under `Framework/App` returns no file |
| A custom element must be registered in the storefront by PHP/DI to get a template | absent | the block template interpolates `element.type` into the include path with `ignore missing` (`…/block/cms-block-text.html.twig:7`) |
| `CmsElementResolverInterface` requires more than three methods (config/template hook) | absent | interface declares only `getType()`, `collect()`, `enrich()` (`…/CmsElementResolverInterface.php:11-18`) |
| `registerCmsElement` enforces `previewComponent`, or warns when it is missing | absent | the only validation is name/component/flag; the element registers (returns `true`) yet the picker's `v-if="!element.hidden && element.previewComponent"` hides it — a silent dead end (`cms.service.ts:155-171`; `sw-cms-slot.html.twig:180-181`) |
| The Shopping Experiences sidebar lists CMS elements alongside blocks | absent | `sw-cms-sidebar` builds every list from `getCmsBlockRegistry()` only; `getCmsElementRegistry` is never called there (`sw-cms-sidebar/index.ts:151,205,216,294,386,582`) |
| An app can supply its own component/previewComponent/configComponent via the Admin-SDK `cmsRegisterElement` payload | absent | the SDK payload type has only `name`, `label`, `defaultConfig`, and the admin handler sets all three component keys after spreading the payload (`meteor packages/admin-sdk/src/ui/cms/index.ts:6-31`; `app/init/cms.init.ts:15-24`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Minimal custom element resolver shape used by upstream unit tests | `github.com/shopware/shopware@trunk tests/unit/Core/Content/Cms/DataResolver/Element/Fixtures/StubCmsElementResolver.php` (sha ee66a4c) |
| Static analysis asserts `shopware.cms.data_resolver` services implement `CmsElementResolverInterface` | `DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:88` |
| `registerCmsElement` rejects a config without `component` and stores the config verbatim otherwise | `@6.7.13.x .../sw-cms/service/cms.service.spec.js:53-117` |
| Elements registered through `cmsService` alone — no `registerCmsBlock` anywhere in the file — appear in the slot's element picker, filtered only by `allowedPageTypes` | `@6.7.13.x .../sw-cms/component/sw-cms-slot/sw-cms-slot.spec.js:60-125,204-232` |
| Unknown element type degrades to the "Element could not be load" panel after 10s | `@6.7.13.x .../sw-cms/component/sw-cms-slot/sw-cms-slot.spec.js:375-383` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Official "Add CMS element" guide reported hard to follow: leads with the admin preview component, no end-to-end example | unclear | open | https://github.com/shopware/docs/issues/1636 |
| Documented app/Admin-SDK CMS element example reported to diverge from the maintained `shopware/meteor` example | unclear (2025-08) | closed | https://github.com/shopware/docs/issues/1914 |
| Shopware docs team opened a task to re-validate the "Add CMS Element" article | unclear | closed | https://github.com/shopware/docs/issues/2273 |
| add-cms-block guide names the SCSS file inconsistently with the component directory | 6.4-era | closed | https://github.com/shopware/docs/issues/674 |
| Extension overrides of `sw-cms-list` context menus dropped when SwagCommercial >= 7.11.0 is installed | 6.7.12.1 + trunk | open | https://github.com/shopware/shopware/issues/19906 |
| Commerce CMS elements render as empty placeholders in non-commerce layouts (resolvers lack product context) | 6.7.6.0 | open | https://github.com/shopware/shopware/issues/14125 |
| Migration-path ticket for converting CMS elements to new Storefront components | 6.7+/trunk | open | https://github.com/shopware/shopware/issues/16594 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is `registerCmsElement()` still the admin entry point in 6.7? | code | yes — `cms.service.ts:155-171` |
| Is the resolver base still `AbstractCmsElementResolver` with `getType()`/`collect()`/`enrich()`? | code | yes — interface unchanged, three methods only |
| Does the storefront template still resolve by `cms-element-<type>.html.twig` convention? | code | yes — `cms-block-text.html.twig:7`, `ignore missing` |
| Can a custom element restrict itself to page types? | code | yes — `allowedPageTypes` in `CmsElementConfig` |
| Does the app route for CMS elements go through `manifest.xml`? | code | no — no `app_cms_element` exists |
| Is registering an element alone enough for it to be usable in the editor, or must a block be registered too? | deep code pass | element-only registration reaches the per-slot "change element" modal (needs `previewComponent`, must not be `hidden`); the sidebar drag list is block-only, so a block is required to place the element on a fresh stage |
| Does the Admin-SDK app route match the documented shape or the `shopware/meteor` example? | deep code pass | the meteor shape matches 6.7: payload is `{name, label, defaultConfig}`, components are forced to the location-renderer trio; it is a separate app-only mechanism, not an alternative spelling of the plugin API |
| Is the 6.6 `registerCmsElement` contract the same as 6.7's? | deep code pass | yes — identical required/optional keys; 6.7 adds only `hover?: boolean` |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Element is registered in the Administration through `cmsService.registerCmsElement()` | `Shopware.Service('cmsService').registerCmsElement({ name: 'dailymotion', … })` | `guides/plugins/plugins/content/cms/add-cms-element.md` | yes — `cms.service.ts:155-171` |
| Three Vue components are involved (main, config, preview); `hidden`/`removable` are optional | `\| hidden \| (Optional) Hides the element in the "replace element" modal \|` | same | yes — `cms.service.ts:41-63`, `manufacturer-logo/index.ts` |
| Element components use the `cms-element` mixin and call `initElementConfig` in `created()` | `mixins: ['cms-element'], created() { this.initElementConfig('dailymotion'); }` | same | not checked by either code pass |
| Storefront template lives in `src/Resources/views/storefront/element`, named `cms-element-<name>.html.twig` | `**Prefix**: cms-element- … **Extension**: .html.twig` | same | yes — `cms-block-text.html.twig:7` |
| The `element` variable is passed to the template automatically | `The element is automatically passed to the template…` | same | not checked by either code pass |
| CMS element configuration is inherited unless explicitly overridden | `By default, configuration will be inherited unless explicitly overridden…` | same | not checked by either code pass |
| Server-side data comes from a class extending `AbstractCmsElementResolver`, tagged `shopware.cms.data_resolver` | `$services->set(DailyMotionCmsElementResolver::class)->tag('shopware.cms.data_resolver');` | `…/cms/add-data-to-cms-elements.md` | yes — tag exists; code additionally shows the tag is optional under autoconfiguration |
| `getType()` returns the element's technical name | `the getType method … returning the dailymotion string` | same | yes — `CmsSlotsDataResolver.php:41-50` |
| Creating a CMS element from an app requires the Meteor Admin SDK; `cms.xml` is limited to reusing existing elements | `Creating a new element requires the Meteor Admin SDK.` | `…/apps/administration/add-cms-element-via-admin-sdk.md` | yes — no `app_cms_element` manifest route exists, and the SDK path goes through `cmsRegisterElement` → `cms.init.ts:6-25` |

Intent/business context code cannot express:

- Elements are the content primitives of the page > section > block > slot > element hierarchy; each slot holds exactly one element.
- The preview component exists for the merchant-facing element selector thumbnail.
- Config components should use Meteor components for a consistent UI.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The resolver service must be tagged `shopware.cms.data_resolver` | The tag is applied automatically by autoconfiguration to any `CmsElementResolverInterface` implementation; explicit tagging is optional | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:148-150` |
| The registration object lists `configComponent`/`previewComponent` as part of the example | Only `name` and `component` are required by the validation; everything else is optional in `CmsElementConfig` — but an element without `previewComponent` never appears in the picker, so the docs' fuller object is the usable one | `…/sw-cms/service/cms.service.ts:41-63,155-171`; `…/sw-cms-slot/sw-cms-slot.html.twig:180-181` |
| The apps CMS index page says apps can add "custom CMS blocks or elements" | There is no `app_cms_element` definition or lifecycle handler under `Framework/App`; the app element route exists only through the Meteor Admin SDK `cmsRegisterElement` message | `Framework/App/Aggregate/CmsBlock/AppCmsBlockDefinition.php:28`; `administration .../app/init/cms.init.ts:6-25` |
| The docs page `add-cms-element-via-admin-sdk` is reported (docs issue #1914) to diverge from the maintained `shopware/meteor` example | The meteor example matches the 6.7 administration: SDK payload `{name, label, defaultConfig}`, iframe locations `<name>-element\|-preview\|-config`, data id `<name>__config-element[__<elementId>]`. Any documented shape differing from that is wrong for 6.7. The page's own wording was not read by the code lanes | `meteor packages/admin-sdk/src/ui/cms/index.ts:6-31`; `administration .../app/init/cms.init.ts:15-24` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `Administration: `Shopware.Service('cmsService').registerCmsElement({ name, label, component, configComponent, previewComponent, defaultConfig })` from `src/Resources/app/administration/src/module/sw-cms/elems/<name>/`.` | rewritten | the directory `…/module/sw-cms/elems/<name>/` is not a path the code requires or uses (core elements live under `sw-cms/elements/<name>/`); what the code actually requires is that the registration file be imported from the plugin entry point `src/Resources/app/administration/src/main.js` (`AdminModuleGenerator.php:66-69`). Required/optional key split added from `cms.service.ts:155-171`, and the `previewComponent` picker gate added from `sw-cms-slot.html.twig:180-181` |
| `Storefront: a Twig template `src/Resources/views/storefront/element/cms-element-<name>.html.twig`.` | kept, extended | confirmed by `cms-block-text.html.twig:7`; extended to state that resolution is by convention with `ignore missing`, so a missing file renders nothing rather than erroring |
| `Optional data resolver extending `AbstractCmsElementResolver`.` | rewritten | correct but not checkable as written — the code shows the subclass must implement all three of `getType()`/`collect()`/`enrich()` (the abstract base implements none) and that the `shopware.cms.data_resolver` tag is applied by autoconfiguration |
