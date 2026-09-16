---
id: platform/dev/6.6/guides/plugins/plugins/administration/advanced-configuration/modify-blacklist-for-dynamic-product-groups.md
title: Modify dynamic product groups blacklist
docType: developer
version: "6.6"
versions: ["6.6"]
relatedPages: ["platform/dev/6.6/guides/plugins/plugins/administration/module-component-management/customizing-components.md"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/advanced-configuration/modify-blacklist-for-dynamic-product-groups.html
sourceHash: 3a6453001ea774b1b7495fed5db17d6205ed6be8
keywords: ["dynamic product groups", "blacklist", "sw-product-stream-field-select", "conditionDataProviderService", "addToGeneralBlacklist", "addToEntityBlacklist", "removeFromGeneralBlacklist", "removeFromEntityBlacklist", "condition builder", "createdAt", "component override", "category properties"]
summary: "Add or remove properties from the dynamic product groups condition builder blacklist by overriding sw-product-stream-field-select."
lastBuilt: "2026-09-15"
---
## What it is

This guide explains how to add properties to, or remove properties from, the blacklist that hides certain properties in the dynamic product groups condition builder — for example `createdAt` is blacklisted by default.

## When to use

Use this when a plugin needs a property (or an entity's nested "entity property", such as a `category` field) to be selectable — or explicitly hidden — in the dynamic product groups condition builder inside the Administration.

## Key steps / config

The blacklist check happens in the computed property `options` of the `sw-product-stream-field-select` component (which must be overridden), so modifications must run before that check. Add to the general blacklist:

```javascript
// <plugin-root>/src/Resources/app/administration/app/src/component/sw-product-stream-field-select/index.js
Component.override('sw-product-stream-field-select', {
    computed: {
        options() {
            this.conditionDataProviderService.addToGeneralBlacklist(['deliveryTimeId']);
            return this.$super('options');
        }
    }
});
```

Nested "entity properties" (selectable once a property such as `Categories` is chosen) use `addToEntityBlacklist` instead, e.g. blacklisting `breadcrumb` on the `category` entity. To do the opposite and make a hidden property available, call `removeFromGeneralBlacklist` or `removeFromEntityBlacklist`:

```javascript
Component.override('sw-product-stream-field-select', {
    computed: {
        options() {
            this.conditionDataProviderService.removeFromGeneralBlacklist(['createdAt']);
            this.conditionDataProviderService.removeFromEntityBlacklist('category', ['path']);
            return this.$super('options');
        }
    }
});
```

## Essential identifiers

- `sw-product-stream-field-select` — component whose `options` computed property enforces the blacklist.
- `conditionDataProviderService` — service exposing the blacklist methods.
- `addToGeneralBlacklist()`, `addToEntityBlacklist()` — hide a property (general or per-entity).
- `removeFromGeneralBlacklist()`, `removeFromEntityBlacklist()` — reveal a previously blacklisted property.

## Gotchas

- Blacklist changes must be applied inside the `options` computed property before it returns, since that is where the check happens.
