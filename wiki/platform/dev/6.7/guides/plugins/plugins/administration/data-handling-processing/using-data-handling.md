---
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md
title: Using Data Handling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.html
sourceHash: 48f5050a63c1c45d63aa0c40e5924bcdfd51729a
codeCheckedAgainst: "6.7.13.0"
keywords: ["admin data handling", "repositoryFactory", "Repository", "Criteria", "EntityCollection", "Shopware.Context.api", "Shopware.Data", "syncDeleted", "assign", "associations", "crud administration", "entity extensions", "addAssociation", "setTotalCountMode"]
summary: Administration JS data layer - repositoryFactory.create, Criteria, and repository search/get/save/delete/syncDeleted/assign, plus association handling.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md"]
---
## What it is

The Administration's JavaScript data handling: a client-side mirror of the DAL that reads and writes almost any entity via the Admin API using repositories, entities, collections and `Criteria`. Background: [reading data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md), [writing data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md), [DAL data handling](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md).

## When to use

Any Administration component (plugin module, override) that must list, load, create, update or delete entities or their associations.

## Key steps / config

**Relevant classes** (`Shopware.Data`): `Repository` (CRUD requests), `Entity` (single record), `EntityCollection` (list of entities; also what `search` resolves to), `Criteria` (filter, sorting, pagination, associations; re-exported from `@shopware-ag/meteor-admin-sdk`). `repositoryFactory` is a DI service; `Shopware.Context.api` holds language, version and auth state.

**1. Get a repository** - inject the service (BottleJS container wrapped into Vue inject/provide):

```javascript
inject: ['repositoryFactory'],
computed: {
    productRepository() { return this.repositoryFactory.create('product'); },
},
```

Signature: `create(entityName, route = '', options = {})`. `route` defaults to `/<entity-name-with-dashes>` and is overridden for association repositories. `options` is a free object; the installed repository reads `useSync` (save via `_action/sync`), `keepApiErrors` and `compatibility`.

**2. Search with Criteria**:

```javascript
const { Criteria } = Shopware.Data;
const criteria = new Criteria();
criteria.setPage(1);
criteria.setLimit(10);
criteria.setTerm('foo');
criteria.setIds(['some-id']);
criteria.setTotalCountMode(2);
criteria.addFilter(Criteria.equals('product.active', true));
criteria.addSorting(Criteria.sort('product.name', 'DESC'));
criteria.addAggregation(Criteria.avg('average_price', 'product.price'));
criteria.getAssociation('categories').addSorting(Criteria.sort('category.name', 'ASC'));
this.productRepository.search(criteria, Shopware.Context.api).then(result => { /* ... */ });
```

Total count modes: `0` no total (fastest), `1` exact total (slow), `2` fetches limit * 5 + 1 for "next page exists" (fast).

**3. Single entity** - `repository.get(id, Shopware.Context.api, criteria?)`.

**4. Update** - change tracking sends only changed fields, but saving is manual: set properties, then `repository.save(entity, Shopware.Context.api)`. Entities are stateless; re-fetch with `get` after saving if you need fresh data.

**5. Delete** - `repository.delete(id, Shopware.Context.api)`; multiple at once with `repository.syncDeleted(ids, Shopware.Context.api)`.

**6. Create** - `const entity = repository.create(Shopware.Context.api)`, fill fields, then `save`.

**7. Associations** - load with `new Criteria().addAssociation('manufacturer')` and pass criteria to `get`. ManyToOne yields an entity (`product.manufacturer`); ToMany yields an `EntityCollection` carrying `entity` and `source` (API route such as `/product/{id}/categories`). Set a ManyToOne by writing the foreign key (`product.manufacturerId = ...`) and saving.

**8. Association repositories** (persisted parent):

```javascript
this.repositoryFactory.create(
    this.product.prices.entity,  // product_price
    this.product.prices.source   // product/<id>/priceRules
);
```

OneToMany: `search`, `create` + `save`, `delete`, `save` on that repository. ManyToMany: `assign(categoryId, Shopware.Context.api)` links, `delete(categoryId, ...)` unlinks.

**9. Local associations** (parent not saved yet) - add entities to the collection with `this.product.prices.add(newPrice)`, remove with `this.product.prices.remove(priceId)`; `this.productRepository.save(this.product, Shopware.Context.api)` sends them with the parent.

**10. Entity extensions** - create the extension entity with its own repository and assign it under `entity.extensions.<name>` (e.g. `salesChannel.extensions.paypalPosSalesChannel = paypalPosSalesChannelRepository.create(Context.api)`); load it via `addAssociation(<extension name>)` and saving the parent writes it.

## Essential identifiers

- `repositoryFactory.create(entityName, route, options)`
- `Repository`: `search`, `get`, `save`, `delete`, `syncDeleted`, `create`, `assign`
- `Shopware.Data.Criteria`: `setPage`, `setLimit`, `setTerm`, `setIds`, `setTotalCountMode`, `addFilter`, `addSorting`, `addAggregation`, `addAssociation`, `getAssociation`, `Criteria.equals`, `Criteria.sort`, `Criteria.avg`
- `EntityCollection` (`entity`, `source`, `add`, `remove`)
- `Shopware.Context.api`

## Gotchas

- It is mandatory to `add` entities to collections for reactive UI data.
- Local associations cannot be sent through an association repository while the parent is new - use the collection as storage.
- A OneToMany price needs more than `quantityStart` to save.
- The source lists a `SearchResult` class; in 6.7.13.0 `search` hydrates into an `EntityCollection`, and `Shopware.Data` has no `SearchResult` export.
- The source says `version` is the only repository option; the installed `Repository` does not read a `version` option.
- `get` internally runs `search` with `setIds([id])` on the passed (or a new `Criteria(1, 1)`) criteria.

## Code check (6.7.13.0)
- confirmed `RepositoryFactory::create()` — signature (entityName, route = '', options = {}) — vendor/shopware/administration/Resources/app/administration/src/core/data/repository-factory.data.ts:42
- corrected `options` — docs: only option is `version`; code reads useSync/keepApiErrors/compatibility — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:157
- corrected `EntityCollection` — docs: search returns SearchResult; hydrator returns EntityCollection — vendor/shopware/administration/Resources/app/administration/src/core/data/entity-hydrator.data.ts:99
- confirmed `Repository::search()` — POSTs criteria to /search route — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:124
- confirmed `Repository::get()` — search with setIds — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:142
- confirmed `Repository::save()` — REST or sync depending on options — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:156
- confirmed `Repository::assign()` — ManyToMany link on association route — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:409
- confirmed `Repository::delete()` — DELETE on route/id — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:418
- confirmed `Repository::syncDeleted()` — bulk delete via _action/sync — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:468
- confirmed `Criteria` — re-exported from meteor-admin-sdk — vendor/shopware/administration/Resources/app/administration/src/core/data/criteria.data.ts:5
