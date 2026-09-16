---
id: platform/dev/6.6/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.md
title: Using the data handling
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/data-handling-processing/using-data-handling.html
sourceHash: 46e5d9364cd21dd82654e18e579390654a262dca
keywords: ["Repository", "Entity", "EntityCollection", "SearchResult", "RepositoryFactory", "Context", "Criteria", "repositoryFactory", "addAssociation", "Criteria.equals", "Criteria.sort", "Shopware.Context.api", "search", "save", "delete"]
summary: "Documents the Administration's data-handling layer — Repository, Criteria, and the repositoryFactory — for CRUD operations and associations against the API."
lastBuilt: "2026-09-15"
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/framework/data-handling/reading-data.md
  - platform/dev/6.6/guides/plugins/plugins/framework/data-handling/writing-data.md
---
## What it is
Explains the Administration's data-handling layer, which remotely operates the Data Abstraction Layer (DAL) through a `Repository`/`Criteria` API.

## When to use
Use when a custom Administration component needs to fetch, create, update, delete, or manage associations for entities via the Admin API.

## Key steps / config
Relevant classes: `Repository` (CRUD requests), `Entity` (single record), `EntityCollection` (collection), `SearchResult`, `RepositoryFactory`, `Context` (global Administration state), `Criteria` (filter/sorting/pagination).

Inject and create a repository:
```javascript
inject: ['repositoryFactory'],
// ...
this.repository = this.repositoryFactory.create('product', null, options);
```
`options.version` picks an API version; the default is always the newest.

Search with a criteria object:
```javascript
const criteria = new Criteria();
criteria.setPage(1);
criteria.setLimit(10);
criteria.setTerm('foo');
criteria.setTotalCountMode(2);
criteria.addFilter(Criteria.equals('product.active', true));
criteria.addSorting(Criteria.sort('product.name', 'DESC'));
criteria.addAggregation(Criteria.avg('average_price', 'product.price'));
```
`setTotalCountMode`: `0` no total count (fastest), `1` exact total count (slow), `2` fetches `limit * 5 + 1` (fast, supports "next page exists").

Core CRUD calls: `repository.search(criteria, Context.api)`, `repository.get(id, Context.api)`, `repository.save(entity, Context.api)`, `repository.delete(id, Context.api)`, `repository.syncDeleted(ids, Context.api)` (batch delete), `repository.create(Context.api)`.

Associations are fetched with `criteria.addAssociation('name')`. A ManyToOne association is written by setting the foreign key (for example `product.manufacturerId`) and then saving. A ToMany association exposes a nested repository built from `entity.<association>.entity` and `.source`, for example `this.repositoryFactory.create(this.product.prices.entity, this.product.prices.source)`.

For unsaved (new) parent entities, associations can't be sent through their own repository directly — use the parent's local collection (`add()`/`remove()`) instead, and the parent's `save()` call will send the association changes together.

## Essential identifiers
- `Repository`, `Entity`, `EntityCollection`, `SearchResult`, `RepositoryFactory`, `Context`, `Criteria`
- `repositoryFactory.create()`
- `Criteria.equals()`, `Criteria.sort()`, `Criteria.avg()`
- `Shopware.Context.api`

## Gotchas
- Updates are not automatic — change tracking exists internally, but `save()` must always be called explicitly.
- Entities are stateless after `save()`; re-`get()` if the latest server data is needed.
- Entities must be added to collections with `add()` (not by direct array mutation) to remain reactive in the UI.
- For ManyToMany associations, use `assign(id, Context.api)`/`delete(id, Context.api)` on the association-specific repository built from `entity.<association>.entity`/`.source`.

## Version notes
The `repositoryFactory.create()` third parameter (`options.version`) selects an API version; the default is always the newest version.
