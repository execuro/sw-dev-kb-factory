---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.md
sourceHash: 4197383b054e4cde1bcf20cd285e80d490b67d3f
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.html
title: Add Custom Data to the Search
version: "6.7"
versions:
  - "6.7"
keywords: ["searchTypeService", "upsertType", "defaultSearchConfiguration", "hideOnGlobalSearchBar", "placeholderSnippet", "listingRoute", "sw-search-bar-item", "sw-search-more-results", "sw_search_bar_item_cms_page", "global search", "search bar", "typed search", "custom entity search"]
summary: "Make a custom entity findable in the Admin global search: module entity + defaultSearchConfiguration, searchTypeService.upsertType tag, result item template."
lastBuilt: 2026-10-21
---
## What it is

How to add a plugin's custom entity to the Administration global search bar, both the untyped global search and the typed search (search tag), and how to render its result items.

## When to use

When a plugin has a frequently visited entity listing and users should reach entries via the global search. The source warns to think twice: if every plugin adds its own search tag, the bar gets cluttered.

Prerequisites: a plugin, a custom entity, and an Administration module for it.

## Key steps / config

1. **Untyped search via the search API** — the entity must belong to an Administration module. Add `entity` and `defaultSearchConfiguration` to the module registration:

```javascript
Shopware.Module.register('swag-plugin', {
    entity: 'swag_example',
    defaultSearchConfiguration: {
        _searchable: true,
        name: { _searchable: true, _score: 500 },
    },
});
```

2. **Search tag (typed search)** — decorate `searchTypeService` and call `upsertType(name, configuration)`; it merges the configuration into any existing type of that name:

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

   - Key and `entityName` are the same; reusing an existing key changes that type.
   - `placeholderSnippet`: translation key shown when no term is entered.
   - `listingRoute`: route for the "continue search" link to the module listing.
   - `hideOnGlobalSearchBar`: whether the entity is excluded from untyped global search.

3. **Result item** — `sw-search-bar-item` picks the module registered for the result's entity (`getModuleByEntityName`) and its last block, `sw_search_bar_item_other_entity`, renders a link to the module's `detail` route showing `entityDisplayProperty` (falling back to `name`, then `id`). For a custom rendering, override the component and extend a block with a `v-else-if` branch:

```twig
{% block sw_search_bar_item_cms_page %}
    {% parent %}
    <router-link v-else-if="type === 'foo_bar'"
                 :to="{ name: 'foo.bar.detail', params: { id: item.id } }"
                 class="sw-search-bar-item__link">...</router-link>
{% endblock %}
```

   Register it with `Shopware.Component.override('sw-search-bar-item', () => import('./app/component/structure/sw-search-bar-item'));` where `index.js` exports `{ template }`.

4. **Custom "show more results" link** — override `sw-search-more-results` (block `sw_search_more_results`) or `sw-search` the same way, via `Shopware.Component.override('sw-search-more-results', ...)`.

5. **Missing tag translation** — add a snippet `global.entities.<entity>`:

```json
{ "global": { "entities": { "my_entity": "My entity | My entities" } } }
```

6. **Tag color / icon** — register a module with `color`, `icon` and `entity` (e.g. `entity: 'my_entity'`).

## Essential identifiers

- `searchTypeService`, `upsertType`, `entityName`, `placeholderSnippet`, `listingRoute`, `hideOnGlobalSearchBar`
- `Shopware.Module.register` options `entity`, `defaultSearchConfiguration` (`_searchable`, `_score`), `entityDisplayProperty`, `color`, `icon`
- `Application.addServiceProviderDecorator`, `Shopware.Component.override`
- `sw-search-bar-item`, `sw-search-more-results`, `sw-search`; blocks `sw_search_bar_item_cms_page`, `sw_search_bar_item_other_entity`, `sw_search_more_results`

## Gotchas

- Without a module for the entity (and a template branch, or a `detail` route for the generic branch), search requests show no result items.
- The docs say `sw_search_bar_item_cms_page` is the last block; in 6.7 it is followed by `sw_search_bar_item_landing_page`, `sw_search_bar_item_module` and `sw_search_bar_item_other_entity`. Any block works as long as the `v-else-if` chain stays intact.

## Code check (6.7.15.1)
- confirmed `upsertType` — merges config into existing type store entry — vendor/shopware/administration/Resources/app/administration/src/app/service/search-type.service.js:140
- confirmed `hideOnGlobalSearchBar` — used by core types next to `placeholderSnippet`/`listingRoute` — vendor/shopware/administration/Resources/app/administration/src/app/service/search-type.service.js:50
- confirmed `defaultSearchConfiguration` — module manifest option with `_searchable`/`_score` — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:119
- confirmed `entityDisplayProperty` — module manifest option — vendor/shopware/administration/Resources/app/administration/src/core/factory/module.factory.ts:106
- confirmed `sw_search_bar_item_cms_page` — block exists in sw-search-bar-item template — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-search-bar-item/sw-search-bar-item.html.twig:184
- corrected `sw_search_bar_item_other_entity` — docs: cms_page is the last block; this generic block is last — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-search-bar-item/sw-search-bar-item.html.twig:274
- confirmed `getModuleByEntityName` — result item resolves module manifest by entity — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-search-bar-item/index.js:95
- confirmed `sw_search_more_results` — root block of sw-search-more-results — vendor/shopware/administration/Resources/app/administration/src/app/component/structure/sw-search-more-results/sw-search-more-results.html.twig:1
- unverified `global.entities` — snippet path not checked in admin snippet files
