---
id: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-error-handling.md
title: Adding Error Handling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/permissions-error-handling/add-error-handling.html
sourceHash: 99b562e3e9414dd8c05f30f5c4803183d620e570
codeCheckedAgainst: "6.7.13.0"
keywords: ["getApiError", "getApiErrorFromPath", "mapPropertyErrors", "mapPageErrors", "getComponentHelper", "error store", "Shopware.Store", "hasError", "api validation errors", "form field errors", "tab error indicator", "error.cfg.json"]
summary: Read Administration API validation errors from the error store (getApiError) and map them to computed props with mapPropertyErrors and mapPageErrors.
lastBuilt: 2026-09-15
---
## What it is

The Administration keeps API validation errors in a central error store with a flat structure: entity name, then entity id, then property. This page covers reading those errors and mapping them to computed properties for fields and for whole pages/tabs.

## When to use

- A plugin form field should show the API error for its property after a failed save.
- A detail page with tabs must indicate that another tab contains an error.

## Key steps / config

**Read errors directly** from the Pinia error store `Shopware.Store.get('error')`:

- `getApiErrorFromPath(entityName, id, path)` — `path` is an array of nested property names.
- `getApiError(entity, field)` — takes the entity object (uses `entity.getEntityName()` and `entity.id`) and a dotted field string like `'myFieldName.nested'`.

```javascript
computed: {
    propertyError() {
        return Shopware.Store.get('error').getApiError(this.myEntity, 'myFieldName');
    }
}
```

Bind it on a field: `<mt-text-field v-model="product.name" :error="propertyError" />`.

**Map property errors** with the component helper:

```javascript
const { mapPropertyErrors } = Shopware.Component.getComponentHelper();

Shopware.Component.register('sw-product-basic-form', {
    computed: {
        ...mapPropertyErrors('product', ['name', 'description', 'productNumber'])
    }
});
```

The first argument is the name of the component property holding the entity (`this.product`), not the entity itself. Generated names are camelCase of `<subject>.<property>.error`, e.g. `productNameError`.

**Page/tab errors.** An error config (e.g. `error.cfg.json`) maps route names to entity => properties:

```json
{
  "sw.product.detail.base": { "product": ["taxId", "price", "stock", "name"] },
  "sw.product.detail.cross.selling": { "product_cross_selling": ["name", "type"] }
}
```

Import it and spread `...mapPageErrors(errorConfiguration)` into `computed` (helper from `Shopware.Component.getComponentHelper()`). Each route yields a boolean `<camelCase route>Error`, e.g. `swProductDetailBaseError`, usable as `<sw-tabs-item :hasError="swProductDetailBaseError">`.

## Essential identifiers

- `Shopware.Store.get('error')`: `getApiError`, `getApiErrorFromPath`, `existsErrorInProperty`
- `Shopware.Component.getComponentHelper()`: `mapPropertyErrors`, `mapPageErrors`
- `sw-tabs-item` prop `hasError`

## Gotchas

- The docs use `this.$store.getters.getApiError(...)` (Vuex); in 6.7 the error store is Pinia (`Shopware.Store.get('error')`), which the mapping helpers use internally.
- The docs bind `:hasError` on `sw-tabs`; the prop is declared on `sw-tabs-item`.
- The docs' fields use `sw-field`; core 6.7 templates bind `:error` on Meteor fields such as `mt-text-field`.
- `mapPropertyErrors` getters return `null` if the named property is not an entity.

## Code check (6.7.13.0)
- corrected `getApiError` — docs: `this.$store.getters.getApiError`; Pinia error store getter — vendor/shopware/administration/Resources/app/administration/src/app/store/error.store.ts:162
- confirmed `getApiErrorFromPath` — `(entityName, id, path: string[])` — vendor/shopware/administration/Resources/app/administration/src/app/store/error.store.ts:141
- confirmed `mapPropertyErrors` — reads `this[entityName]`, camelCase `<entity>.<property>.error` names — vendor/shopware/administration/Resources/app/administration/src/app/service/map-errors.service.ts:11
- confirmed `Shopware.Store.get('error')` — helpers read errors from the Pinia store — vendor/shopware/administration/Resources/app/administration/src/app/service/map-errors.service.ts:28
- confirmed `mapPageErrors` — builds `<camelCase routeName>Error` booleans — vendor/shopware/administration/Resources/app/administration/src/app/service/map-errors.service.ts:66
- confirmed `existsErrorInProperty` — store getter used by mapPageErrors — vendor/shopware/administration/Resources/app/administration/src/app/store/error.store.ts:190
- confirmed `getComponentHelper` — exposed on `Shopware.Component` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:137
- corrected `hasError` — docs: prop on `sw-tabs`; declared on `sw-tabs-item` — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-tabs-item/index.js:81
- confirmed `mt-text-field` — core template binds `:error` on it — vendor/shopware/administration/Resources/app/administration/src/module/sw-settings-product-feature-sets/page/sw-settings-product-feature-sets-detail/sw-settings-product-feature-sets-detail.html.twig:60
- unverified `sw-field` — no `sw-field` registration found in the admin component index; only a form-renderer component name
