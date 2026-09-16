---
id: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.md
title: Add custom data to the search
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/data-handling-processing/search-custom-data.html
sourceHash: 99ecf41fc5c2d1affce504a8a7de326de5d26154
keywords: ["global search", "searchTypeService", "defaultSearchConfiguration", "Module.register", "addServiceProviderDecorator", "sw-search-bar-item", "sw-search-more-results", "upsertType", "listingRoute", "placeholderSnippet", "hideOnGlobalSearchBar", "typed search"]
summary: "Explains how to make a custom entity searchable via the untyped and typed global search bar in the Shopware Administration."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to add a custom entity to Shopware's global search bar, covering both the untyped and typed (tagged) search.

## When to use
Use when a plugin's entity listing should be findable via the Administration's global search.

## Key steps / config
1. Make the entity searchable in the untyped search by setting `entity` and `defaultSearchConfiguration` on the Administration module:
```javascript
Shopware.Module.register('swag-plugin', {
    entity: 'swag_example',
    defaultSearchConfiguration: {
        _searchable: true,
        name: { _searchable: true, _score: 500 },
        description: { name: { _searchable: true, _score: 500 } },
    },
});
```
2. Add a search tag for the typed search by decorating `searchTypeService`:
```javascript
Application.addServiceProviderDecorator('searchTypeService', searchTypeService => {
    searchTypeService.upsertType('foo_bar', {
        entityName: 'foo_bar',
        placeholderSnippet: 'foo-bar.general.placeholderSearchBar',
        listingRoute: 'foo.bar.index',
        hideOnGlobalSearchBar: false,
    });
    return searchTypeService;
});
```
3. Add a result-item template block by overriding `sw-search-bar-item` (extending the `sw_search_bar_item_cms_page` block with a `v-else-if` branch for the new type).
4. Optionally override `sw-search-more-results`/`sw-search` to customize the "show more results" link.
5. To fix a missing-translation tag label, add a `global.entities.<entity>` snippet, structured like:
```json
{ "global": { "entities": { "my_entity": "My entity | My entities" } } }
```
6. To change the tag color/icon, register a module with `color`, `icon`, and `entity` properties.

## Essential identifiers
- `searchTypeService`
- `Application.addServiceProviderDecorator()`
- `upsertType()`
- `defaultSearchConfiguration`
- `sw-search-bar-item`, `sw-search-more-results`

## Gotchas
- Adding a search tag clutters the UI if every plugin adds its own; think twice before doing so.
- The result-item override must keep the Vue `v-else-if` chain in `sw-search-bar-item` intact, regardless of which block is extended.
