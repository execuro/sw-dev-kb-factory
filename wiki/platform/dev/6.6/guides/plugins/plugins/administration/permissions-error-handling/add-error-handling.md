---
id: platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-error-handling.md
title: Adding error handling
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/permissions-error-handling/add-error-handling.html
sourceHash: 71abe7a7c13be69d1436bea641d8bdf9df59d0b2
keywords: ["error store", "getApiErrorFromPath", "getApiError", "mapPropertyErrors", "mapPageErrors", "Vuex store", "hasError", "sw-page", "error.cfg.json", "sw-product-basic-form", "computed error"]
summary: How Administration API errors are stored in Vuex and read via getApiError/getApiErrorFromPath or the mapPropertyErrors/mapPageErrors helpers.
lastBuilt: 2026-09-15
---
## What it is

Explains how the Administration stores API errors in the Vuex store in a flat structure keyed by entity name and id, and how components read them directly or via helper functions.

## When to use

Use this when a component needs to display validation/API errors bound to specific entity fields, or surface an error indicator across tabs on a multi-view page.

## Key steps / config

Flat error store shape:

```text
(state)
 |- entityNameA
    |- id1
        |- property1
```

Read a raw error with the getter `getApiErrorFromPath`:

```javascript
function getApiErrorFromPath (state) => (entityName, id, path)
```

Or the scalar-field wrapper `getApiError`:

```javascript
function getApiError(state) => (entity, field)
```

Use it in a computed property:

```javascript
computed: {
    propertyError() {
        return this.$store.getters.getApiError(myEntity, 'myFieldName');
    }
}
```

`mapPropertyErrors(subject, properties)` reduces boilerplate by generating computed getters (camelCase, suffixed `Error`) for a list of fields on an entity:

```javascript
const { mapPropertyErrors } = Shopware.Component.getComponentHelper();

Component.register('sw-product-basic-form', {
    computed: {
        ...mapPropertyErrors('product', ['name', 'description'])
    }
})
```

For nested views/tabs, configure per-view error tracking and use `mapPageErrors`:

```json
{
  "sw.product.detail.base": {
    "product": ["taxId", "price"]
  }
}
```

```javascript
const { mapPageErrors } = Shopware.Component.getComponentHelper();

Shopware.Component.register('sw-product-detail', {
    computed: {
        ...mapPageErrors(errorConfiguration),
    }
})
```

This produces a boolean (e.g. `swProductDetailBaseError`) usable on `<sw-tabs :hasError="...">`.

## Essential identifiers

- `getApiErrorFromPath(state)(entityName, id, path)`
- `getApiError(state)(entity, field)`
- `mapPropertyErrors(subject, properties)`
- `mapPageErrors(config)`
- `Shopware.Component.getComponentHelper()`
