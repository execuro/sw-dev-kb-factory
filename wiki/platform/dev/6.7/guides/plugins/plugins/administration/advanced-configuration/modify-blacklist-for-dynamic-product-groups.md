---
id: platform/dev/6.7/guides/plugins/plugins/administration/advanced-configuration/modify-blacklist-for-dynamic-product-groups.md
title: Modify Dynamic Product Groups Blacklist
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/advanced-configuration/modify-blacklist-for-dynamic-product-groups.html
sourceHash: fe2e22acfd44ae78e33b13b0d3f3bcae28659c26
codeCheckedAgainst: "6.7.13.0"
keywords: ["dynamic product groups", "product stream", "blacklist", "allow list", "sw-product-stream-field-select", "conditionDataProviderService", "productStreamConditionService", "addToGeneralAllowList", "addToEntityAllowList", "removeFromGeneralAllowList", "removeFromEntityAllowList", "isPropertyInAllowList", "condition builder"]
summary: "Control which properties the dynamic product group condition builder offers: override sw-product-stream-field-select and edit the service's allow lists."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md"]
---
## What it is

The "Dynamic product groups" (product stream) condition builder in the Administration only lists some entity properties. The guide shows how a plugin changes that list by overriding the `sw-product-stream-field-select` component and calling list-mutation methods on `conditionDataProviderService`. In 6.7.13.0 the list is an **allow list** (only listed properties are shown), not a blacklist as the docs describe.

## When to use

You want a property selectable in the product stream condition builder that is not offered by default (e.g. category `path`), or you want to hide one that is offered (e.g. product `deliveryTime`).

## Key steps / config

1. Override the component (see [customizing components](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/customizing-components.md)), e.g. in `<plugin-root>/src/Resources/app/administration/app/src/component/sw-product-stream-field-select/index.js`.
2. Mutate the allow lists inside the computed `options` **before** calling `this.$super('options')`, because `options` filters properties with `isPropertyInAllowList(entity, property)`:

```javascript
const { Component } = Shopware;
Component.override('sw-product-stream-field-select', {
    computed: {
        options() {
            this.conditionDataProviderService.addToEntityAllowList('category', ['path']);
            this.conditionDataProviderService.removeFromEntityAllowList('product', ['deliveryTime']);
            return this.$super('options');
        }
    }
});
```

- `addToGeneralAllowList(properties)` — allow a property for every entity (general list defaults to `['id']`).
- `addToEntityAllowList(entity, properties)` — allow nested "entity properties" for one entity (e.g. `category`, `product_manufacturer`); creates the entity entry if missing.
- `removeFromGeneralAllowList(properties)` / `removeFromEntityAllowList(entity, properties)` — hide properties again.
- `properties` may be a string or an array.

## Essential identifiers

- `sw-product-stream-field-select` (computed `options`)
- `conditionDataProviderService` (injected; the page passes `productStreamConditionService`)
- `isPropertyInAllowList`, `addToGeneralAllowList`, `addToEntityAllowList`, `removeFromGeneralAllowList`, `removeFromEntityAllowList`
- `Component.override`, `this.$super('options')`

## Gotchas

- The documented methods `addToGeneralBlacklist`, `addToEntityBlacklist`, `removeFromGeneralBlacklist` and `removeFromEntityBlacklist` do not exist in the installed Administration; semantics are inverted: adding shows a property, removing hides it.
- The docs' examples no longer match defaults: product `createdAt` is already allowed; category allows only `id` by default, so `path`/`breadcrumb` are hidden unless added.
- The remove methods splice at `indexOf(entry)`; removing an entry that is not in the list (index -1) removes the last entry instead. Only remove properties you know are present.
- The component is marked `@private`, so overrides may break between releases.

## Version notes

- Product `states` is in the product allow list only while feature flag `v6.8.0.0` is inactive.

## Code check (6.7.13.0)
- corrected `addToGeneralAllowList` — docs: `addToGeneralBlacklist` (blacklist semantics) — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:342
- corrected `addToEntityAllowList` — docs: `addToEntityBlacklist` — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:351
- corrected `removeFromGeneralAllowList` — docs: `removeFromGeneralBlacklist` — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:365
- corrected `removeFromEntityAllowList` — docs: `removeFromEntityBlacklist` — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:376
- corrected `isPropertyInAllowList` — docs: options checks a blacklist — vendor/shopware/administration/Resources/app/administration/src/module/sw-product-stream/component/sw-product-stream-field-select/index.js:52
- confirmed `conditionDataProviderService` — injected into the field select component — vendor/shopware/administration/Resources/app/administration/src/module/sw-product-stream/component/sw-product-stream-field-select/index.js:12
- confirmed `productStreamConditionService` — registered service provider — vendor/shopware/administration/Resources/app/administration/src/app/main.ts:153
- corrected `allowedProperties` — docs: `createdAt` hidden by default; general list is `['id']`, product list includes `createdAt` — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:16
- confirmed `$super` — component factory resolves `this.$super()` in computed/methods — vendor/shopware/administration/Resources/app/administration/src/core/factory/async-component.factory.ts:919
- confirmed `v6.8.0.0` — `states` pushed to product allow list only when flag inactive — vendor/shopware/administration/Resources/app/administration/src/app/service/product-stream-condition.service.js:79
