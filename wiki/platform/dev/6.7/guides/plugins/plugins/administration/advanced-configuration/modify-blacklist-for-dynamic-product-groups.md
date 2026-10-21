---
id: platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/modify-blacklist-for-dynamic-product-groups.md
title: Modify Dynamic Product Groups Blacklist
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/advanced-configuration/modify-blacklist-for-dynamic-product-groups.html
sourceHash: fe2e22acfd44ae78e33b13b0d3f3bcae28659c26
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw-product-stream-field-select", "conditionDataProviderService", "isPropertyInAllowList", "addToEntityAllowList", "removeFromEntityAllowList", "addToGeneralAllowList", "removeFromGeneralAllowList", "dynamic product groups", "product stream", "blacklist", "allow list", "condition builder fields"]
summary: Control which fields the dynamic product group condition builder offers; 6.7 uses allow-list methods on conditionDataProviderService, not a blacklist.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md"]
---
## What it is

The "Dynamic product groups" module (product streams) has a condition builder that does not offer every entity property. The guide shows how a plugin changes which properties are selectable by overriding `sw-product-stream-field-select`, whose computed property `options` filters the properties. In 6.7 the filter is an **allow list** (only listed properties are shown), not the blacklist the guide describes.

## When to use

You want to hide a property from the condition builder, or make a property selectable that is not offered by default.

## Key steps / config

Override the component (see [customizing components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md)) and change the list **before** calling `$super('options')`, because the check runs inside `options`:

```javascript
const { Component } = Shopware;

Component.override('sw-product-stream-field-select', {
    computed: {
        options() {
            // hide: remove from the product allow list
            this.conditionDataProviderService.removeFromEntityAllowList('product', ['deliveryTime']);
            // show: add to an entity allow list
            this.conditionDataProviderService.addToEntityAllowList('category', ['breadcrumb', 'path']);
            return this.$super('options');
        },
    },
});
```

- `addToEntityAllowList(entity, properties)` / `removeFromEntityAllowList(entity, properties)` — per-entity list (the dropdown for the selected entity; the first dropdown is the `product` entity).
- `addToGeneralAllowList(properties)` / `removeFromGeneralAllowList(properties)` — properties allowed for every entity (default: `id` only).
- `properties` may be a string or an array.

## Essential identifiers

- `sw-product-stream-field-select`, computed `options`
- `conditionDataProviderService.isPropertyInAllowList(entity, property)`
- `addToEntityAllowList`, `removeFromEntityAllowList`, `addToGeneralAllowList`, `removeFromGeneralAllowList`

## Gotchas

- The guide's methods `addToGeneralBlacklist`, `addToEntityBlacklist`, `removeFromGeneralBlacklist` and `removeFromEntityBlacklist` do not exist in 6.7; calling them throws. The meaning is inverted: "add to blacklist" is now "remove from allow list" and vice versa.
- `createdAt` is already in the default `product` allow list; `category` only allows `id` by default.
- The remove functions use `splice(indexOf(entry), 1)`: removing an entry that is not in the list removes the **last** element instead. Only remove entries that are present.
- `options` runs on every recompute, so additions are pushed again each time; guard against duplicates if needed.

## Version notes

The guide was written against the 6.3 blacklist implementation. Shopware 6.7 ships the allow-list API in the product stream condition service.

## Code check (6.7.15.1)
- absent `addToGeneralBlacklist` — no definition anywhere in the installed code; replaced by allow-list methods
- absent `addToEntityBlacklist` — no definition anywhere in the installed code
- absent `removeFromGeneralBlacklist` — no definition anywhere in the installed code
- absent `removeFromEntityBlacklist` — no definition anywhere in the installed code
- corrected `options()` — docs: checks properties against a blacklist; code checks isPropertyInAllowList — vendor/shopware/administration/Resources/app/administration/src/module/sw-product-stream/component/sw-product-stream-field-select/index.js:46
- confirmed `isPropertyInAllowList` — general list or entity list must contain the property — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:319
- confirmed `addToGeneralAllowList` — pushes string or array onto the general list (default ['id']) — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:329
- confirmed `addToEntityAllowList` — pushes onto the entity list, creates it if missing — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:338
- confirmed `removeFromGeneralAllowList` — splice by indexOf — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:352
- confirmed `removeFromEntityAllowList` — splice by indexOf, no-op for unknown entity — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:363
