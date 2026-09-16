---
id: platform/dev/6.6/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.md
title: The best-practice to always re-fetch the data after saving
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-09-17-the-best-practice-to-always-re-fetch-the-data-after-saving.html
sourceHash: 7de722ace635af559c134e8722e11eec3f7b4245
keywords: ["repository.save", "repository.get", "re-fetch data", "loadEntityData", "Shopware.Context.api", "Criteria", "inheritance context", "administration CRUD"]
summary: "ADR: administration pages must re-fetch entity data via repository.get after repository.save to avoid working with stale data."
lastBuilt: 2026-09-15
---
## What it is
Establishes the best practice of reloading entity data after saving on administration detail pages.

## When to use
Whenever an administration page saves an entity via the repository and continues to display or edit that entity afterward.

## Key steps / config
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

## Essential identifiers
- `repository.save`
- `repository.get`
- `Shopware.Context.api`

## Gotchas
- Re-assigning saved values locally instead of re-fetching risks working with stale data, since the assigned values may not be the latest after a save due to possible data inconsistency during the saving process.
