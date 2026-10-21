---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/_index.md
sourceHash: 48f5050a63c1c45d63aa0c40e5924bcdfd51729a
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.html
title: Using Data Handling
version: "6.7"
versions:
  - "6.7"
keywords: ["repositoryFactory", "Repository", "Criteria", "Shopware.Data", "EntityCollection", "Shopware.Context.api", "syncDeleted", "addAssociation", "setTotalCountMode", "admin data handling", "crud", "associations", "entity extensions"]
summary: "Admin JS data handling: repositoryFactory.create, Criteria search, get/save/delete/create, and OneToMany/ManyToMany association handling."
lastBuilt: 2026-10-21
---
## What it is

The Administration's JavaScript data layer, which remotely operates the Data Abstraction Layer over the Admin API: repositories created by `repositoryFactory`, `Criteria` for searches, change-tracked entities, and association handling. See [reading data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md) and [writing data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md) with the DAL.

## When to use

When an Administration component must fetch, create, update or delete entities, or work with their associations and entity extensions.

## Key steps / config

Relevant classes: `Repository` (CRUD requests), `Entity` (single record), `EntityCollection` (collection of entities), `SearchResult`, `RepositoryFactory`, `Context` (language, version, auth, ...), `Criteria` (filter, sorting, pagination, ...).

1. **Inject and create a repository** — services come from the BottleJS DI container via Vue `inject`:

```javascript
inject: ['repositoryFactory'],
// ...
const productRepository = this.repositoryFactory.create('product');
```

   Signature: `create(entityName, route = '', options = {})`. Without `route` it uses `/<entity-name-with-dashes>`; a custom route is used for association loading. Options read by the repository include `useSync` (save via sync API), `keepApiErrors` and `compatibility`.

2. **Search with Criteria** (`const { Criteria } = Shopware.Data;`):

```javascript
const criteria = new Criteria();
criteria.setPage(1);
criteria.setLimit(10);
criteria.setTerm('foo');
criteria.setIds(['some-id']);
criteria.setTotalCountMode(2); // 0 none, 1 exact, 2 limit*5+1
criteria.addFilter(Criteria.equals('product.active', true));
criteria.addSorting(Criteria.sort('product.name', 'DESC'));
criteria.addAggregation(Criteria.avg('average_price', 'product.price'));
criteria.getAssociation('categories').addSorting(Criteria.sort('category.name', 'ASC'));
this.productRepository.search(criteria, Shopware.Context.api).then(result => { /* ... */ });
```

3. **Single entity** — `repository.get(id, Shopware.Context.api, criteria?)`; it builds a `Criteria(1, 1)` with `setIds([id])` when none is given.

4. **Update** — change properties, then call `repository.save(entity, Shopware.Context.api)`. Only changed fields are sent (change tracking); saving is never automatic. The entity is stateless after save — re-`get` it if needed.

5. **Delete** — `repository.delete(id, Shopware.Context.api)`; for several ids `repository.syncDeleted(ids, context)`.

6. **Create** — `repository.create(Shopware.Context.api)` returns a new entity; fill it and `save` it.

7. **Associations** — load with `new Criteria().addAssociation('manufacturer')` and pass the criteria to `get`. ManyToOne yields an entity (write via the foreign key, e.g. `product.manufacturerId`, then save the parent); ToMany yields an `EntityCollection` with `entity` and `source` properties.

8. **Association repository** (saved parent) — `this.repositoryFactory.create(this.product.prices.entity, this.product.prices.source)`; then `search`, `create` + `save`, `delete`. For ManyToMany use `assign(id, context)` to link and `delete(id, context)` to unlink.

9. **Local associations** (unsaved parent) — create the child through the association repository, `this.product.prices.add(newPrice)` / `this.product.prices.remove(priceId)`, then `productRepository.save(this.product, Shopware.Context.api)` sends everything. Adding to the collection is mandatory for reactive UI data.

10. **Entity extensions** — load the extension via `addAssociation(<extensionName>)`; assign a new entity from the extension's repository to `entity.extensions.<name>` and save the parent:

```javascript
this.salesChannel.extensions.paypalPosSalesChannel =
    this.paypalPosSalesChannelRepository.create(Context.api);
this.salesChannelRepository.save(this.salesChannel, Context.api);
```

## Essential identifiers

- `repositoryFactory`, `repositoryFactory.create(entityName, route, options)`
- `Repository` methods: `search`, `get`, `save`, `delete`, `syncDeleted`, `create`, `assign`
- `Shopware.Data.Criteria`, `Shopware.Data.EntityCollection`, `Shopware.Context.api`
- Criteria: `setPage`, `setLimit`, `setTerm`, `setIds`, `setTotalCountMode`, `addFilter`, `addSorting`, `addAggregation`, `addAssociation`, `getAssociation`, `Criteria.equals`, `Criteria.sort`, `Criteria.avg`

## Gotchas

- The source passes `{ version: 1 }` as the third `create()` argument and says there are no other options; the 6.7 `Repository` does not read a `version` option at all, while it does read `useSync`, `keepApiErrors` and `compatibility`.
- `Criteria` is re-exported from `@shopware-ag/meteor-admin-sdk`; its full API lives in that package, not in the Administration source.
- A new price needs more fields than `quantityStart` before it saves.

## Code check (6.7.15.1)
- confirmed `RepositoryFactory::create()` — `(entityName, route = '', options = {})`, default route from entity name — vendor/shopware/administration/Resources/app/administration/src/core/data/repository-factory.data.ts:42
- corrected `this.options.useSync` — docs: `version` is the only option; repository reads useSync/keepApiErrors/compatibility — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:195
- confirmed `Repository::search()` — POST `/search<route>` with criteria — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:137
- confirmed `Repository::get()` — Criteria(1, 1) with setIds when none given — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:162
- confirmed `Repository::save()` — changeset-based create/update — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:194
- confirmed `Repository::assign()` — ManyToMany link — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:451
- confirmed `Repository::delete()` — deletes one id — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:460
- confirmed `Repository::syncDeleted()` — deletes an array of ids — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:510
- confirmed `Repository::create()` — `(context, id = null)` returns new entity — vendor/shopware/administration/Resources/app/administration/src/core/data/repository.data.ts:566
- unverified `Criteria` — implemented in @shopware-ag/meteor-admin-sdk, out of scope (re-export only in core/data/criteria.data.ts)
