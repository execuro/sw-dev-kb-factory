---
id: platform/dev/6.7/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md
title: The best-practice to always re-fetch the data after saving
docType: developer
version: "6.7"
versions:
  - "6.7"
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.html
sourceHash: 7de722ace635af559c134e8722e11eec3f7b4245
codeCheckedAgainst: "6.7.13.0"
keywords: ["re-fetch after save", "reload entity", "repository.save", "repository.get", "Criteria", "Shopware.Context.api", "inheritance", "onSave", "loadEntityData", "administration", "data handling", "adr"]
summary: "ADR: in Administration pages always reload the entity with repository.get() after repository.save() resolves, instead of re-assigning local values."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-09-17): after saving an entity in an Administration page, always re-fetch it from the server so the user keeps working on the latest data.

## When to use

- Any Administration detail/edit page that saves an entity through a repository and keeps editing afterwards.

## Key steps / config

Saving without reloading means re-assigning values locally, but those may not be the latest ones because of possible data inconsistency during the save. Re-fetching keeps the data consistent and ready for further CRUD operations:

1. Bind the form fields and a save button (`sw-button-process` in the ADR example, `@click="onSave"`, label `$tc('global.default.save')`).
2. In `onSave`, call `repository.save(entity, context)`; when the promise resolves, reload.
3. Reload with `repository.get(id, context, criteria)` and replace the component's data.

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

Installed repository behaviour: `get()` sets the id on the given criteria (or a new `Criteria(1, 1)`) and runs a search; `save()` sends only the change set (REST or sync). A context with `inheritance: true` sends the `sw-inheritance` header.

## Essential identifiers

- `repository.save(entity, context)`
- `repository.get(id, context, criteria)`
- `Criteria`
- `Shopware.Context.api`, `inheritance`

## Gotchas

- The ADR's form example binds the status with `sw-switch-field` (`v-model="data.status"`), which is deprecated in the installed Administration (to be removed in v6.8.0; use `mt-switch`).

## Code check (6.7.13.0)
- confirmed `get()` — repository shorthand fetching one entity by id via search — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:142
- confirmed `save()` — sends change set via REST or sync — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:156
- confirmed `inheritance` — context flag sent as sw-inheritance header — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:687
- confirmed `sw-button-process` — global button component with loading/success feedback — vendor/shopware/administration/Resources/app/administration/src/app/component/base/sw-button-process/index.js:9
- deprecated `sw-switch-field` — deprecated tag:v6.8.0, use mt-switch — vendor/shopware/administration/Resources/app/administration/src/app/component/form/sw-switch-field/index.js:10
- confirmed `save` — global.default.save snippet value Save — vendor/shopware/administration/Resources/app/administration/src/app/snippet/en.json:35
