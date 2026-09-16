---
id: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/writing-data.md
title: Writing Data
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/writing-data.html
sourceHash: bcd9d5c0e2d6ab82c72c8dcc0dba6a266a912938
codeCheckedAgainst: "6.7.13.0"
keywords: ["EntityRepository", "product.repository", "create", "update", "upsert", "delete", "searchIds", "Defaults::CURRENCY", "Uuid::randomHex", "taxId", "write data", "crud", "associations", "mapping entity", "dal write"]
summary: Create, update, upsert and delete DAL entities via EntityRepository, incl. writing ManyToOne/ToMany associations and nested associated data.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/data-abstraction-layer.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-data-associations.md", "platform/dev/6.7/guides/plugins/plugins/framework/data-handling/replacing-associated-data.md"]
---
## What it is

How to write data (create, update, upsert, delete) through the Data Abstraction Layer's generated entity repositories, using products as the example, including assigning existing and creating new associated entities. Background: [Data abstraction layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md); reading IDs: [Reading data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/reading-data.md).

## When to use

A plugin service must persist entity data (core or custom entities) from PHP code, e.g. in a controller, subscriber or command.

## Key steps / config

1. **Inject the repository.** Service id pattern `entity_name.repository` (`product.repository`, `tax.repository`, `order.repository`); type `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository`.

```php
$services->set(WritingData::class)
    ->args([service('product.repository'), service('tax.repository')]);
```

2. **Create.** `create(array $data, Context $context)` takes an array of arrays (several entities per call). Product required fields: `name`, `productNumber`, `stock`, `taxId`, `price`.

```php
$this->productRepository->create([[
    'id' => Uuid::randomHex(),          // optional, define the ID up front
    'name' => 'Example product',
    'productNumber' => 'SW123',
    'stock' => 10,
    'taxId' => $taxId,
    'price' => [['currencyId' => Defaults::CURRENCY, 'gross' => 50, 'net' => 25, 'linked' => false]],
]], $context);
```

   Imports: `Shopware\Core\Defaults`, `Shopware\Core\Framework\Context`, `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`, `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter`, `Shopware\Core\Framework\Uuid\Uuid`.
   Get an existing tax ID: `$this->taxRepository->searchIds((new Criteria())->addFilter(new EqualsFilter('taxRate', 19.00)), $context)->firstId()`.
   `price` is a JSON-stored price list: each row needs `currencyId`, `gross`, `net`; `linked` (bool) makes gross changes recalculate net via tax.

3. **Update.** `update([['id' => $productId, 'name' => 'New name']], $context)` - the `id` is always required.
4. **Upsert.** `upsert([...], $context)` - updates when the `id` exists, creates otherwise; without an `id` it always creates.
5. **Delete.** `delete([['id' => $productId]], $context)` - arrays contain only the ID.
6. **Assign associations.**
   - OneToOne / ManyToOne: set the FK field (`taxId`) to the existing entity's ID.
   - OneToMany / ManyToMany: pass the association name with a list of `['id' => ...]` rows, e.g. `'categories' => [['id' => $categoryId]]`.
7. **Create associated data inline.** Pass the association field instead of the FK with all required fields of the new entity, e.g. `'tax' => ['name' => 'test', 'taxRate' => 15]`; for ToMany: `'categories' => [['id' => ..., 'name' => 'Example category']]`.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository` - `create`, `update`, `upsert`, `delete`, `searchIds`
- `product.repository`, `tax.repository`, `product_category.repository`
- `Shopware\Core\Defaults::CURRENCY`
- `Shopware\Core\Framework\Uuid\Uuid::randomHex()`
- `PriceFieldSerializer` (price JSON constraints)

## Gotchas

- A ManyToMany mapping entity (e.g. via `product_category.repository`) cannot be updated: all its fields are primary keys. Replace the association instead, see [Replacing associated data](platform/dev/6.7/guides/plugins/plugins/framework/data-handling/replacing-associated-data.md).
- The `price` list must contain a row for `Defaults::CURRENCY`; otherwise the write fails with "No price for default currency defined".
- `IdSearchResult::firstId()` returns `?string`; the docs' `getTaxId(): string` helper throws a TypeError if no tax with that rate exists.
- One docs example passes `'tax' => $this->getTaxId($context)`; `tax` is the ManyToOne association (expects an array), the ID belongs in `taxId`.
- The docs' category example calls `searchIds(new Criteria())` without a context; the installed signature requires `Context` as the second argument.
- `Context::createDefaultContext()` (used in one docs example) is marked `@internal` in 6.7; prefer the context passed through from the controller/event.

## Code check (6.7.13.0)
- confirmed `EntityRepository::create()` — `(array $data, Context $context)` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:127
- confirmed `EntityRepository::upsert()` — same signature as create/update — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:113
- confirmed `EntityRepository::delete()` — `(array $ids, Context $context)` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:141
- corrected `EntityRepository::searchIds()` — docs: called without context in one example; Context is required — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:87
- confirmed `IdSearchResult::firstId()` — returns `?string` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/IdSearchResult.php:68
- corrected `tax` — docs: `'tax' => <tax id>`; `tax` is a ManyToOneAssociationField, the FK is `taxId` — vendor/shopware/core/Content/Product/ProductDefinition.php:233
- confirmed `taxId` — FkField with Required flag; `price`, `productNumber`, `stock` also Required — vendor/shopware/core/Content/Product/ProductDefinition.php:161
- confirmed `PriceFieldSerializer::getConstraints()` — currencyId/gross/net NotBlank, linked boolean — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/PriceFieldSerializer.php:173
- confirmed `Defaults::CURRENCY` — default price row required (ensureDefaultPrice) — vendor/shopware/core/Framework/DataAbstractionLayer/FieldSerializer/PriceFieldSerializer.php:223
- confirmed `Context::createDefaultContext()` — exists, annotated @internal — vendor/shopware/core/Framework/Context.php:119
