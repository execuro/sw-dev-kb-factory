---
id: platform/dev/6.7/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md
title: The best-practice to always re-fetch the data after saving
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.html
sourceHash: 7de722ace635af559c134e8722e11eec3f7b4245
codeCheckedAgainst: "6.7.15.1"
keywords: ["re-fetch after save", "reload entity", "repository.save", "repository.get", "Criteria", "Shopware.Context.api", "inheritance", "sw-button-process", "data handling", "crud", "administration", "adr"]
summary: "ADR: in Administration pages, always reload the entity with repository.get() after repository.save() resolves instead of reusing local values."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2020-09-17, area: administration) stating that Administration pages should always re-fetch entity data after saving. Without reloading, you have to re-assign values yourself and cannot be sure they are the latest ones, because data can become inconsistent during the save process.

## When to use

Any Administration detail page or component that saves an entity through a repository and keeps working with that entity afterwards (further CRUD operations).

## Key steps / config

1. Save via the repository: `this.repository.save(this.data, Shopware.Context.api)`.
2. In the promise's success handler, call a reload method.
3. The reload method fetches the entity again with `this.repository.get(id, context, criteria)` and replaces the local data with the result.

```javascript
onSave() {
    this.repository.save(this.data, Shopware.Context.api).then(() => {
        this.loadEntityData();
    });
},
loadEntityData() {
    const criteria = new Criteria();
    const context = { ...Shopware.Context.api, inheritance: true };
    this.repository.get(this.data.id, context, criteria).then((data) => {
        this.data = data;
    });
},
```

The template side binds the field with `v-model="data.status"` and triggers `onSave` from an `<sw-button-process @click="onSave">` button.

## Essential identifiers

- `repository.save(entity, context)` — defaults `context` to `Shopware.Context.api`
- `repository.get(id, context, criteria)` — fetches a single entity; without a criteria it uses `new Criteria(1, 1)` with the id set
- `Criteria`
- `Shopware.Context.api`, with `inheritance: true` sent as the `sw-inheritance` header
- `sw-button-process`

## Gotchas

- The source template uses `sw-switch-field` for the bound field; in 6.7.15.1 that component is marked deprecated for removal in 6.8.0 (use `mt-switch`).

## Code check (6.7.15.1)
- confirmed `Repository::save()` — context defaults to Shopware.Context.api — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:194
- confirmed `Repository::get()` — id, context, criteria parameters — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:162
- confirmed `Criteria` — default Criteria(1, 1) used by get() when none passed — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:181
- confirmed `inheritance` — context flag mapped to sw-inheritance header — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:764
- confirmed `sw-button-process` — component present, status ready — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-button-process/index.js:8
- deprecated `sw-switch-field` — removal in v6.8.0, use mt-switch — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-switch-field/index.js:10
