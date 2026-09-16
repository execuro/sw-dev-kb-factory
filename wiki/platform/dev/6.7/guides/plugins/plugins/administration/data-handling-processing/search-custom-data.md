---
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.md
title: Add Custom Data to the Search
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.html
sourceHash: 4197383b054e4cde1bcf20cd285e80d490b67d3f
codeCheckedAgainst: "6.7.13.0"
keywords: ["global search", "admin search bar", "searchTypeService", "upsertType", "defaultSearchConfiguration", "sw-search-bar-item", "sw-search-more-results", "sw_search_bar_item_cms_page", "hideOnGlobalSearchBar", "addServiceProviderDecorator", "typed search", "search tag", "global.entities", "custom entity"]
summary: Make a custom entity findable in the Administration global search - module defaultSearchConfiguration, searchTypeService tag, sw-search-bar-item override.
lastBuilt: 2026-09-15
---
## What it is

How a plugin adds its own entity to the Administration's global search bar. There are two modes: the untyped global search (all entities) and the typed global search (one entity, selected via a search tag). They differ in the API used and in how results are displayed.

## When to use

You have a custom entity with a frequently used listing and want admins to reach its records through the search bar. The source warns to think twice: if every plugin adds its own search tag, the bar gets cluttered.

Prerequisites: a plugin and a custom entity (DAL definition).

## Key steps / config

1. **Untyped search support** - the entity must be attached to an Administration module. Add `entity` and `defaultSearchConfiguration` to the module registration:

```javascript
Shopware.Module.register('swag-plugin', {
    entity: 'swag_example',
    defaultSearchConfiguration: {
        _searchable: true,
        name: { _searchable: true, _score: 500 },
    },
});
```

2. **Search tag (typed search)** - decorate `searchTypeService` and call `upsertType(name, configuration)`:

```javascript
Shopware.Application.addServiceProviderDecorator('searchTypeService', searchTypeService => {
    searchTypeService.upsertType('foo_bar', {
        entityName: 'foo_bar',
        placeholderSnippet: 'foo-bar.general.placeholderSearchBar',
        listingRoute: 'foo.bar.index',
        hideOnGlobalSearchBar: false,
    });
    return searchTypeService;
});
```

- Key and `entityName` are the same; `upsertType` merges into an existing type, so it can also change core types.
- `placeholderSnippet`: translation key shown when no term is entered.
- `listingRoute`: route for the "continue search in the module listing" link.
- `hideOnGlobalSearchBar`: whether the entity is excluded from the untyped global search.

3. **Result item rendering** - without this, results for your type are not shown. Override `sw-search-bar-item` and extend a block with an extra `v-else-if` branch for your type (the source uses `sw_search_bar_item_cms_page` with `{% parent %}` followed by a `router-link` with `v-else-if="type === 'foo_bar'"`, pointing at `foo.bar.detail`, with a `sw-highlight-text` label).
   Register the override in `main.js`: `Shopware.Component.override('sw-search-bar-item', () => import('./app/component/structure/sw-search-bar-item'));` whose `index.js` only exports `{ template }`.
4. **Custom "show more results" link** (optional, for externally searchable entities) - override `sw-search-more-results` (block `sw_search_more_results`) or `sw-search` the same way.
5. **Missing tag translation** - add a snippet under `global.entities`: `{ "global": { "entities": { "my_entity": "My entity | My entities" } } }`.
6. **Tag color / icon** - register a module with `color`, `icon` and `entity: 'my_entity'`; the search bar looks up the module by entity name.

## Essential identifiers

- `searchTypeService`, `upsertType`, `Shopware.Application.addServiceProviderDecorator`
- `entityName`, `placeholderSnippet`, `listingRoute`, `hideOnGlobalSearchBar`
- `defaultSearchConfiguration`, `_searchable`, `_score`
- `sw-search-bar-item`, block `sw_search_bar_item_cms_page`
- `sw-search-more-results`, block `sw_search_more_results`
- `Shopware.Component.override`, snippet key `global.entities.<entity>`

## Gotchas

- Which core block you append after does not matter as long as the `v-if`/`v-else-if` chain stays intact; `sw_search_bar_item_cms_page` is used only because it was the last block when the guide was written.
- In 6.7.13.0 the core items render `router-link` with `custom` and `v-slot="{ href, navigate }"` wrapping an `a` element; the source's older markup (`v-bind:to` directly on `router-link`) may need aligning to that pattern.
- Without a module registered for the entity, the search bar falls back to color `#5C738A` and icon `regular-books`.

## Code check (6.7.13.0)
- confirmed `upsertType` — merges configuration into the type store under the given name — vendor/shopware/administration/Resources/app/administration/src/app/service/search-type.service.js:130
- confirmed `hideOnGlobalSearchBar` — types with this flag are filtered out of the untyped search — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-search-bar/index.js:271
- confirmed `searchTypeService` — registered as an Administration service provider — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:175
- confirmed `addServiceProviderDecorator` — Application method used to decorate services — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:281
- confirmed `defaultSearchConfiguration` — optional module manifest key with `_searchable`/`_score` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:119
- confirmed `sw_search_bar_item_cms_page` — block exists in the search bar item template — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-search-bar-item/sw-search-bar-item.html.twig:184
- confirmed `sw_search_more_results` — root block of the more-results template — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-search-more-results/sw-search-more-results.html.twig:1
- confirmed `global.entities` — tag label resolved via this snippet namespace — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-search-bar/index.js:326
- confirmed `getModuleByEntityName` — tag color taken from the module manifest found by entity — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-search-bar/index.js:836
- confirmed `Component.override` — exposed on the global Shopware object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:132
