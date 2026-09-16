# `dev-30` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-30` · `dev` · `Storefront` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2117-22-31` |
| Core version | `6.7.13.0` |

**Query:** How do I add a custom filter to the Storefront product listing from my plugin, both the criteria side and the filter panel?

**Expected answer — every fact an answer must contain:**

1. The criteria side is served by either of two routes: a service extending `AbstractListingFilterHandler` (implementing `getDecorated()` and `create(Request, SalesChannelContext): ?Filter`) that carries the service tag `shopware.listing.filter.handler`, or a subscriber to `Shopware\Core\Content\Product\Events\ProductListingCollectFilterEvent` that adds a `Filter` to the mutable collection returned by `$event->getFilters()`. `[code: Content/Product/SalesChannel/Listing/Filter/AbstractListingFilterHandler.php:12-33]` `[code: Content/Product/SalesChannel/Listing/Processor/AggregationListingProcessor.php:78-94]`
2. The added object is `Shopware\Core\Content\Product\SalesChannel\Listing\Filter`, constructed with `name`, `filtered`, `aggregations`, `filter` (a DAL filter) and `values`, plus an optional sixth `exclude` flag defaulting to `true`; `AggregationListingProcessor::prepare()` adds its aggregations to the `Criteria` and its DAL filter as a **post** filter when `filtered` is true. `[code: Content/Product/SalesChannel/Listing/Filter.php:11-25]` `[code: Content/Product/SalesChannel/Listing/Processor/AggregationListingProcessor.php:38-55]`
3. The filter panel is a separate mechanism — nothing renders a panel item from a registered `Filter` automatically. The plugin extends `storefront/component/listing/filter-panel.html.twig`, overrides the block `component_filter_panel_items` and `sw_include`s one of the reusable filter component templates under `component/listing/filter/` (`filter-boolean`, `filter-multi-select`, `filter-property-select`, `filter-range`, `filter-rating-select`), passing a `name` that matches the registered filter's name. `[code: shopware/storefront Resources/views/storefront/component/listing/filter-panel.html.twig:19-34]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/add-listing-filters.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Criteria-side handler contract: `getDecorated()` and `create()` are abstract, `process()` is optional post-processing. | `Content/Product/SalesChannel/Listing/Filter/AbstractListingFilterHandler.php:12-33` | `abstract public function create(Request $request, SalesChannelContext $context): ?Filter;` |
| Handlers are consumed through the tag `shopware.listing.filter.handler`, injected as a `tagged_iterator` into `AggregationListingProcessor`; core handlers get the tag from an `<instanceof>` block in the same XML file. | `Content/DependencyInjection/product.xml:343-360` | `<tag name="shopware.listing.filter.handler" />` … `<argument type="tagged_iterator" tag="shopware.listing.filter.handler" />` |
| `Filter` bundles name, filtered, aggregations, DAL filter, values and `exclude` (default `true`). | `Content/Product/SalesChannel/Listing/Filter.php:11-25` | `protected string $name, protected bool $filtered, protected array $aggregations, protected DALFilter $filter, protected int\|float\|string\|bool\|array\|null $values, protected bool $exclude = true` |
| `prepare()` adds aggregations to the criteria, adds the DAL filter as a **post** filter when active, and stores the `FilterCollection` as the `filters` extension. | `Content/Product/SalesChannel/Listing/Processor/AggregationListingProcessor.php:38-55` | `$criteria->addPostFilter($filter->getFilter());` … `$criteria->addExtension('filters', $filters);` |
| Tag-free route: after all handlers run, `ProductListingCollectFilterEvent` is dispatched with the mutable `FilterCollection`. | `Content/Product/SalesChannel/Listing/Processor/AggregationListingProcessor.php:78-94` | `$event = new ProductListingCollectFilterEvent($request, $filters, $context); $this->dispatcher->dispatch($event);` |
| The event exposes `getRequest()`, `getFilters(): FilterCollection` and the `SalesChannelContext`. | `Content/Product/Events/ProductListingCollectFilterEvent.php:14-41` | `public function getFilters(): FilterCollection` |
| Reference shape: `ManufacturerListingFilterHandler` returns `null` to opt out and builds a `Filter` whose name is the key later read from `listing.aggregations` in Twig. | `Content/Product/SalesChannel/Listing/Filter/ManufacturerListingFilterHandler.php:23-38` | `return new Filter('manufacturer', $ids !== [], [new EntityAggregation(...)], new EqualsAnyFilter('product.manufacturerId', $ids), $ids);` |
| Panel side: each core filter sits in its own named block inside `component_filter_panel_items` and `sw_include`s a filter component template, reading the aggregation by name. | `shopware/storefront Resources/views/storefront/component/listing/filter-panel.html.twig:19-34` | `{% block component_filter_panel_items %}` … `{% set manufacturers = listing.aggregations.get('manufacturer') %}` |
| Reusable filter component templates ship under `component/listing/filter/`, matching JS plugins of the same names. | `shopware/storefront Resources/app/storefront/src/plugin/listing/` | `filter-base.plugin.js, filter-boolean.plugin.js, filter-multi-select.plugin.js, filter-property-select.plugin.js, filter-range.plugin.js, filter-rating-select.plugin.js` |
| A custom JS filter must extend `FilterBasePlugin`; `_init()` calls `listing.registerFilter(this)` and hard-validates `getValues`, `getLabels`, `reset`, `resetAll`. | `shopware/storefront Resources/app/storefront/src/plugin/listing/filter-base.plugin.js:14-59` | `this.listing.registerFilter(this);` … ``throw new Error(`[${this._pluginName}] Needs the method "getValues"'`);`` |
| Registered filters feed the listing request; the `Listing` plugin collects each plugin's `getValues()`. | `shopware/storefront Resources/app/storefront/src/plugin/listing/listing.plugin.js:110-150` | `this._registry.forEach((filterPlugin) => { const values = filterPlugin.getValues();` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A plugin's filter handler is tagged automatically just by extending `AbstractListingFilterHandler` | partially absent | The only `<instanceof>` for `AbstractListingFilterHandler` lives in core's `Content/DependencyInjection/product.xml:343-346`; Symfony applies `<instanceof>` per service-definition file, so a plugin declaring its handler in its own `services.xml` must add `<tag name="shopware.listing.filter.handler"/>` itself. No compiler pass adds the tag globally. |
| There is a single dedicated "add listing filter" API covering both criteria and panel | absent | Criteria side (handler service / `ProductListingCollectFilterEvent`) and panel side (Twig block override plus a `FilterBasePlugin` subclass) are separate mechanisms; nothing renders a panel item from a registered `Filter`. `shopware/storefront .../filter-panel.html.twig:19` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _None — no functional test for a custom listing filter handler is present in the trimmed dist tree._ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `Listing` JS plugin mishandled values from registered filters (`TypeError: e[t].push is not a function`; `p=1\|2` causing 400s); notes for plugin authors: return arrays, do not return `p`. | 6.7.3.0 | closed | https://github.com/shopware/shopware/issues/12965 |
| Core fix hardening the filter merge and single-valued query keys. | 6.7 | merged | https://github.com/shopware/shopware/pull/16323 |
| Official tutorial followed verbatim: filter renders, toggling has no effect on the result set. | 6.4-era docs | open | https://forum.shopware.com/t/add-custom-listing-filters-tutorial/98951 |
| Custom filter plugin broke across a patch update (6.5.5.2 → 6.5.8.11). | 6.5 | open | https://forum.shopware.com/t/nach-dem-shopware-update-6-5-5-2-6-5-8-11-funktioniert-das-individuelle-filter-plugin-nicht-mehr/104740 |
| Filter panel on a custom CMS page with a ProductListing element does not filter. | 6.x | open | https://forum.shopware.com/t/eigene-cms-seite-mit-filter-panel-und-productlisting-funktioniert-nicht/105346 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Are `ProductListingCriteriaEvent` / `ProductListingResultEvent` still the events for adding a listing filter in 6.7? | code | Superseded: filters are collected by `AggregationListingProcessor` from tagged handlers plus `ProductListingCollectFilterEvent`. `AggregationListingProcessor.php:78-94` |
| Does a `ProductListingFeaturesSubscriber`-style flow still add `Filter`/`FilterCollection` to the criteria, or was it replaced by a processor chain? | code | Replaced: `AggregationListingProcessor` (tagged `shopware.listing.processor`) does it. `product.xml:343-360`, `AggregationListingProcessor.php:38-55` |
| Does `filter-panel.html.twig` still exist in 6.7 with the block `component_filter_panel_items`? | code | Yes. `shopware/storefront .../filter-panel.html.twig:19-34` |
| Is `registerFilter()` still the JS registration API, and does `FilterBasePlugin` still exist at the documented path? | code | Yes; `FilterBasePlugin::_init()` calls `listing.registerFilter(this)` and requires `getValues`/`getLabels`/`reset`/`resetAll`. `filter-base.plugin.js:14-59` |
| Does a server-side filter alone suffice, or is a JS filter plugin needed for AJAX listing updates? | code | The `Listing` plugin builds the request from `getValues()` of registered filter plugins, so a panel item needs a registered JS filter plugin — supplied by the reusable core filter component templates. `listing.plugin.js:110-150` |
| What does `getValues()` return after PR 16323 — scalars or arrays, and is there a single-valued key set? | not settled by code | The code lane did not read the post-16323 merge/normalisation logic; not asserted in the facts. |
| Does the 6.7 result still carry `currentFilters` / `$result->addCurrentFilter()`? | not settled by code | Not examined; not asserted in the facts. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Filters are registered via `ProductListingCollectFilterEvent`; the event supplies metadata, core decides if and how the filter is applied. | "New listing filters … can be registered via the event `\Shopware\Core\Content\Product\Events\ProductListingCollectFilterEvent`" | `docs/.../storefront/howto/add-listing-filters.md` | yes — `AggregationListingProcessor.php:78-94` |
| `Filter` takes six parameters: name, filtered, aggregations, filter, values, exclude. | "\| `name` \| Unique name of the filter \| … \| `exclude` \| Configure exclusions \|" | same | yes — `Filter.php:11-25` (`exclude` defaults to `true`) |
| Existing filters come from `$event->getFilters()` and the new one is merged via `$filters->add($filter)`. | "// fetch existing filters\n$filters = $event->getFilters();" | same | yes — `ProductListingCollectFilterEvent.php:14-41` |
| Whether the filter is active is derived from `$event->getRequest()`. | "$request = $event->getRequest(); $filtered = (bool) $request->get('isCloseout');" | same | yes — event exposes `getRequest()`; `ManufacturerListingFilterHandler.php:23-38` shows the same shape |
| The Storefront side extends `filter-panel.html.twig` block `component_filter_panel_items`. | "It's this one - `src/Storefront/Resources/views/storefront/component/listing/filter-panel.html.twig`." | same | yes — `filter-panel.html.twig:19-34` |
| The block `component_filter_panel_items` exists from 6.4.8.0. | "The block `component_filter_panel_items` is available from Shopware Version 6.4.8.0" | same | present in 6.7.13.0; the 6.4.8.0 introduction date was not checked |
| The UI element is rendered with `sw_include` of a filter component template, passing `name` and `displayName`. | "{% sw_include '@Storefront/storefront/component/listing/filter/filter-boolean.html.twig' with { name: 'isCloseout', … } %}" | same | yes — `filter-panel.html.twig:19-34` |
| Five reusable filter components are available. | "\| `filter-boolean` \| … \| `filter-rating-select` …" | same | yes — `shopware/storefront .../plugin/listing/` |
| Position is controlled by where `{{ parent() }}` sits, or by extending a per-filter block. | "We could put it at the beginning by moving the `parent()` call to the end of the block." | same | consistent with the per-filter blocks in `filter-panel.html.twig:19-34` |
| The subscriber belongs at `/src/Subscriber/ExampleListingSubscriber.php`. | "…in the same path as you're seeing in Shopware's core" | same | convention only, not a code fact |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The event is presented as *the* way to register a listing filter. | The primary route in core is a service extending `AbstractListingFilterHandler` tagged `shopware.listing.filter.handler`; the event runs after all handlers as a second route. The docs never mention the handler or the tag. | `Content/Product/SalesChannel/Listing/Filter/AbstractListingFilterHandler.php:12-33`, `Content/DependencyInjection/product.xml:343-360` |
| The guide never shows registering the subscriber as a service. | A subscriber only receives the event if registered and tagged; a reader following only this page ends with an unregistered subscriber. | `Content/DependencyInjection/product.xml:343-360` |
| The docs give no namespace for `Filter` or the aggregation classes. | `Shopware\Core\Content\Product\SalesChannel\Listing\Filter`, taking a DAL filter such as `EqualsAnyFilter` and aggregations such as `EntityAggregation`. | `Content/Product/SalesChannel/Listing/Filter.php:11-25`, `ManufacturerListingFilterHandler.php:23-38` |
| The docs describe `values` as "the values added as currentFilter" but pass a bool in the sample, and omit `exclude` from both samples. | `values` is `int\|float\|string\|bool\|array\|null` and `exclude` defaults to `true`, so the omission is legal but the sample's bool `values` does not match the table's description. | `Content/Product/SalesChannel/Listing/Filter.php:11-25` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Subscribe to `Shopware\Core\Content\Product\Events\ProductListingCollectFilterEvent` and add the new filter to the supplied filter collection. | rewritten | Code shows this is the second of two routes; the tagged `AbstractListingFilterHandler` service is the one core itself uses, and a plugin's handler needs the explicit `shopware.listing.filter.handler` tag. |
| The `Filter` instance takes the parameters `name`, `filtered`, `aggregations`, `filter`, `values` and `exclude`. | rewritten | Kept and made checkable: `exclude` is optional with default `true`, and the fact now states what the processor does with the aggregations and the DAL filter (post filter). |
| The template side extends `storefront/component/listing/filter-panel.html.twig` block `component_filter_panel_items` and includes a filter component such as `filter-boolean.html.twig`. | rewritten | Kept and extended with the code-shown absence: the panel is not derived from the registered `Filter`, and the included component's `name` must match the filter name. |
