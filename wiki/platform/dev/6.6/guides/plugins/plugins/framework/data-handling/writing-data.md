---
id: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/writing-data.md
title: Writing data
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/data-handling/writing-data.html
sourceHash: 520a8a9916018189291e6d33fd4afce89a9fd621
keywords: ["writing data", "EntityRepository", "create method", "update method", "upsert method", "delete method", "product.repository", "tax.repository", "searchIds", "firstId", "JsonField", "PriceFieldSerializer", "associated data", "mapping entity"]
summary: "Covers create/update/upsert/delete on DAL repositories and how to assign, create, or replace associated (ToOne/ToMany) data."
lastBuilt: "2026-09-15"
---
## What it is
Explains how to write data to the database in Shopware 6 using repository CRUD methods, including assigning and creating associated data.

## When to use
Use when a plugin service needs to create, update, upsert, or delete entities via the DAL, or manage entity associations.

## Key steps / config
1. Inject repositories by service id `entity_name.repository` (e.g. `product.repository`, `tax.repository`) as constructor arguments via `services.xml`.
2. Create: `$this->productRepository->create([[ 'name' => ..., 'productNumber' => ..., 'stock' => 10, 'taxId' => ..., 'price' => [['currencyId' => Defaults::CURRENCY, 'gross' => 50, 'net' => 25, 'linked' => false]] ]], $context);` — array of arrays, since multiple entities can be written at once.
3. Can supply a client-generated `id` (via `Shopware\Core\Framework\Uuid\Uuid::randomHex()`) when creating, to avoid re-fetching the new ID.
4. Update: requires the entity's `id` plus only the fields being changed: `$this->productRepository->update([[ 'id' => $productId, 'name' => 'New name' ]], $context);`
5. Upsert: `upsert()` creates if the ID doesn't exist, updates if it does — must provide an `id` or it will always create.
6. Delete: `$this->productRepository->delete([[ 'id' => $productId ]], $context);`
7. Assigning associated data:
   - `ToOne` (`OneToOne`/`ManyToOne`): set the ID field directly, e.g. `'taxId' => $taxId`.
   - `ToMany` (`OneToMany`/`ManyToMany`): supply an array of `{ 'id' => ... }` under the association name, e.g. `'categories' => [['id' => $categoryId]]`.
   - Mapping entities (e.g. product/category) cannot be updated directly via their own repository — use replacement instead (see `platform/dev/6.6/guides/plugins/plugins/framework/data-handling/replacing-associated-data.md`).
8. Creating associated data inline: instead of an ID, supply the full payload under the association field, e.g. `'tax' => ['name' => 'test', 'taxRate' => 15]`, to create and assign in the same call; works for `ToMany` fields too.
9. Price payload shape (`JsonField`, structure documented in `PriceFieldSerializer::getConstraints`):
```
price: [
  { currencyId, gross, net, linked }
]
```

## Essential identifiers
- `create()`, `update()`, `upsert()`, `delete()`
- `product.repository`, `tax.repository`
- `Shopware\Core\Framework\Uuid\Uuid`
- `PriceFieldSerializer`

## Gotchas
- Updating a `ManyToMany` mapping entity directly (e.g. `product_category.repository->update()`) fails — mapping entities only have primary keys, which cannot themselves be updated; use replacement instead.
- `upsert` without an explicit `id` in the payload will always create a new entity, never update.

## Version notes
- Example price array in the JSON payload references the field structure documented against `v6.3.4.0` of `PriceFieldSerializer`.
