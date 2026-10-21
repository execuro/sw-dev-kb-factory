---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md
title: Writing Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/writing-data.html
sourceHash: bcd9d5c0e2d6ab82c72c8dcc0dba6a266a912938
codeCheckedAgainst: "6.7.15.1"
keywords: ["EntityRepository", "product.repository", "create", "update", "upsert", "delete", "searchIds", "firstId", "Defaults::CURRENCY", "Uuid::randomHex", "write data", "dal write", "crud", "associations", "many to many"]
summary: "Create, update, upsert and delete entities via DAL EntityRepository, incl. assigning or creating OneToOne/ManyToOne/ToMany associated data."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md
  - platform/dev/6.7/concepts/framework/data-abstraction-layer.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-associations.md
  - platform/dev/6.7/guides/plugins/plugins/framework/data-handling/replacing-associated-data.md
---
## What it is

How to write entity data (example: products) through the Data Abstraction Layer repositories: create, update, upsert, delete, and how to assign or create associated entities in the same write. Builds on the [Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md) and [Reading data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md).

## When to use

A plugin service needs to persist, change or remove DAL entities (products, taxes, categories, orders, custom entities) from PHP.

## Key steps / config

1. **Inject the repository.** Every entity gets an auto-generated repository service named `<entity_name>.repository` (`product.repository`, `tax.repository`, `order.repository`). Type-hint `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`:

```php
$services->set(WritingData::class)
    ->args([
        service('product.repository'),
        service('tax.repository'),
    ]);
```

2. **Create.** `create(array $data, Context $context)` takes an array of entity arrays (multiple entities per call). Minimal product payload (mandatory fields `name`, `productNumber`, `stock`, `taxId`, `price`):

```php
$this->productRepository->create([[
    'name' => 'Example product',
    'productNumber' => 'SW123',
    'stock' => 10,
    'taxId' => $taxId,
    'price' => [['currencyId' => Defaults::CURRENCY, 'gross' => 50, 'net' => 25, 'linked' => false]],
]], $context);
```

   Imports: `Shopware\Core\Defaults`, `Shopware\Core\Framework\Context`, `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`, `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter`. Look up an existing tax ID with `$this->taxRepository->searchIds($criteria, $context)->firstId()` using `new EqualsFilter('taxRate', 19.00)`.
   - `price` is a JSON field holding a list of prices; each entry needs `currencyId`, `gross`, `net`, `linked` (if `linked` is `true`, gross changes also affect net via the product's tax).
3. **Own IDs.** IDs are UUIDs; pass `'id' => Uuid::randomHex()` (`Shopware\Core\Framework\Uuid\Uuid`) to know the ID without re-reading.
4. **Update.** `update([['id' => $productId, 'name' => 'New name']], $context)` — the ID is always required; only listed fields change.
5. **Upsert.** `upsert()` creates or updates; without an `id` it always creates.
6. **Delete.** `delete([['id' => $productId]], $context)` — the arrays contain only the ID.
7. **Associations.**
   - OneToOne / ManyToOne: set the FK field (`taxId`) to the existing entity's ID.
   - OneToMany / ManyToMany: pass the association name with an array of arrays, e.g. `'categories' => [['id' => $categoryId]]`.
   - Create the associated entity inline by passing its data instead of an ID: `'tax' => ['name' => 'test', 'taxRate' => 15]`, or `'categories' => [['id' => ..., 'name' => 'Example category']]` for ToMany. All required fields of the associated entity must be provided.

## Essential identifiers

- `EntityRepository::create()`, `::update()`, `::upsert()`, `::delete()`, `::searchIds()`
- `IdSearchResult::firstId()`
- `product.repository`, `tax.repository`, `product_category.repository`
- `Defaults::CURRENCY`, `Uuid::randomHex()`
- `Criteria`, `EqualsFilter`, `Context`

## Gotchas

- A ManyToMany mapping entity (e.g. via `product_category.repository`) cannot be updated — all its fields are primary keys. Replace the association instead: see [Replacing associated data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/replacing-associated-data.md).
- Without an `id`, `upsert` never updates.
- `firstId()` returns `?string` (null when nothing matched), although the guide's `getTaxId()` helper declares `string`.
- One source sample passes the tax ID under `'tax' =>`; an ID belongs in `taxId`, the `tax` key takes association data.

## Code check (6.7.15.1)
- confirmed `EntityRepository::create()` — takes array of payloads plus Context — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:140
- confirmed `EntityRepository::update()` — returns EntityWrittenContainerEvent — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:112
- confirmed `EntityRepository::upsert()` — present — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:126
- confirmed `EntityRepository::delete()` — takes array of ID arrays — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:154
- confirmed `IdSearchResult::firstId()` — returns ?string — vendor/shopware/core/Framework/DataAbstractionLayer/Search/IdSearchResult.php:68
- confirmed `.repository` — service id is entity name plus `.repository` — vendor/shopware/core/Framework/DependencyInjection/CompilerPass/EntityCompilerPass.php:68
- confirmed `Defaults::CURRENCY` — default currency constant — vendor/shopware/core/Defaults.php:25
- confirmed `Uuid::randomHex()` — UUID generator — vendor/shopware/core/Framework/Uuid/Uuid.php:26
- confirmed `price.linked` — price entries require currencyId/gross/net, linked boolean — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/PriceFieldSerializer.php:184
- confirmed `categories` — ManyToMany association on product — vendor/shopware/core/Content/Product/ProductDefinition.php:280
