---
id: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-error-handling.md
title: Adding Error Handling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/permissions-error-handling/add-error-handling.html
sourceHash: 99b562e3e9414dd8c05f30f5c4803183d620e570
codeCheckedAgainst: "6.7.15.1"
keywords: ["getApiError", "getApiErrorFromPath", "mapPropertyErrors", "mapPageErrors", "getComponentHelper", "error.cfg.json", "Shopware.Store.get('error')", "existsErrorInProperty", "api errors", "field validation errors", "error store", "tab error indicator", "administration"]
summary: "Admin API error store (Pinia store 'error'): getApiError/getApiErrorFromPath, mapPropertyErrors for fields, mapPageErrors for tab error flags."
lastBuilt: 2026-10-21
---
## What it is

The Administration keeps API (validation) errors in a central error store, keyed flat by entity name, then entity id, then property path. Components read errors from it directly via getters or through helper mappers that generate computed properties. In 6.7 this store is the Pinia store with id `error` (the docs still describe it as a Vuex store).

```text
(state.api)
 |- entityNameA
    |- id1
        |- property1
        |- property2
 |- entityNameB
```

## When to use

- Showing a field-level error on an input after a failed save (e.g. empty product name).
- Flagging a tab or nested view that contains an error the user cannot currently see.

## Key steps / config

1. **Read a single error.** Access the store with `Shopware.Store.get('error')`:
   - `getApiErrorFromPath(entityName, id, path)` — `path` is an array of nested property names, e.g. `['name']`.
   - `getApiError(entity, field)` — wrapper taking the entity object (needs `getEntityName()` and `id`) and a dotted field such as `'name'` or `'myFieldName.nested'`; it splits the field on `.` and calls `getApiErrorFromPath`.
   Wrap calls in computed properties and bind them to the input's `error` prop.
   ```javascript
   computed: {
       propertyError() {
           return Shopware.Store.get('error').getApiError(this.myEntity, 'myFieldName');
       }
   }
   ```
2. **Map many fields at once** with `mapPropertyErrors(subject, properties)` from `Shopware.Component.getComponentHelper()`. `subject` is the entity *name*, and the component must expose that entity under the same property name (`this.product`). Each generated computed is camelCase of `<subject>.<property>.error`, e.g. `productNameError`.
   ```javascript
   const { mapPropertyErrors } = Shopware.Component.getComponentHelper();
   computed: { ...mapPropertyErrors('product', ['name', 'productNumber']) }
   ```
   Bind with `:error="productNameError"`.
3. **Page/tab error flags.** Write an `error.cfg.json` mapping route names to entity → property lists, then spread `mapPageErrors(errorConfiguration)`:
   ```json
   {
     "sw.product.detail.base": { "product": ["taxId", "price", "name"] },
     "sw.product.detail.cross.selling": { "product_cross_selling": ["name", "type"] }
   }
   ```
   ```javascript
   import errorConfiguration from './error.cfg.json';
   const { mapPageErrors } = Shopware.Component.getComponentHelper();
   computed: { ...mapPageErrors(errorConfiguration) }
   ```
   Each route key yields a boolean computed named camelCase(route) + `Error` (e.g. `swProductDetailBaseError`), true when any listed property of that entity has an error. Bind it to a tab's `has-error` / `hasError`.

## Essential identifiers

- `Shopware.Store.get('error')`
- `getApiErrorFromPath(entityName, id, path)`, `getApiError(entity, field)`, `existsErrorInProperty(entity, properties)`
- `Shopware.Component.getComponentHelper()` → `mapPropertyErrors`, `mapPageErrors`
- `error.cfg.json`, `swProductDetailBaseError`

## Gotchas

- The docs' `this.$store.getters.getApiError(...)` refers to the old Vuex store; in 6.7 there is no Vuex error module — use `Shopware.Store.get('error')`.
- `mapPropertyErrors` returns `null` when `this[subject]` is not an entity (no `getEntityName()`), so the property name must match the subject string.
- `mapPageErrors` checks entity-wide (any entity id), not a specific record.

## Code check (6.7.15.1)
- corrected `getApiError` — docs: Vuex `this.$store.getters.getApiError`; code: Pinia store `error` getter — vendor/shopware/administration/Resources/app/administration/src/app/store/error.store.ts:162
- confirmed `getApiErrorFromPath` — getter `(entityName, id, path: string[])` — vendor/shopware/administration/Resources/app/administration/src/app/store/error.store.ts:141
- confirmed `Shopware.Store.register` — error store registered with `id: 'error'` — vendor/shopware/administration/Resources/app/administration/src/app/store/error.store.ts:87
- confirmed `existsErrorInProperty` — backs page error flags — vendor/shopware/administration/Resources/app/administration/src/app/store/error.store.ts:190
- confirmed `mapPropertyErrors` — computed name camelCase of `entity.property.error` — vendor/shopware/administration/Resources/app/administration/src/app/service/map-errors.service.ts:11
- confirmed `mapPageErrors` — route key → `<camelCase>Error` boolean — vendor/shopware/administration/Resources/app/administration/src/app/service/map-errors.service.ts:70
- confirmed `getComponentHelper` — exposed on `Shopware.Component` — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:142
- confirmed `error.cfg.json` — imported by sw-product-detail — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/index.js:7
- confirmed `swProductDetailBaseError` — bound as tab error flag — vendor/shopware/administration/Resources/app/administration/src/module/sw-product/page/sw-product-detail/index.js:161
