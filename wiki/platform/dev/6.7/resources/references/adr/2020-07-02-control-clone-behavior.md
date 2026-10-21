---
id: platform/dev/6.7/resources/references/adr/2020-07-02-control-clone-behavior.md
title: Get control of association clone behavior as developer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-07-02-control-clone-behavior.html
sourceHash: 9f1c20f4babce9111730e15e4d4f6de37cfbd5f6
codeCheckedAgainst: "6.7.15.1"
keywords: ["CascadeDelete", "cloneRelevant", "isCloneRelevant", "clone entity", "association clone", "VersionManager", "OneToManyAssociationField", "searchKeywords", "productReviews", "categoriesRo", "dal flag", "duplicate product"]
summary: ADR 2020-07-02 - the CascadeDelete flag's cloneRelevant constructor argument (default true) controls whether an association is copied when an entity is cloned.
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2020-07-02, area core) giving developers control over whether an association is included when an entity is cloned. Cloning follows associations flagged with `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\CascadeDelete`; the decision adds an optional constructor parameter to that flag to opt an association out of cloning.

## When to use

When defining an entity association that should be deleted together with its parent (cascade delete) but **not** duplicated when the parent is cloned — for example data that is rebuilt by an indexer or managed separately by the Administration.

## Key steps / config

Pass `false` as the constructor argument of `CascadeDelete` on the association field:

```php
(new OneToManyAssociationField('searchKeywords', ProductSearchKeywordDefinition::class, 'product_id'))
    ->addFlags(new CascadeDelete(false)),
```

- Constructor: `CascadeDelete::__construct(bool $cloneRelevant = true)` — omitting the argument keeps the association clone-relevant.
- During cloning, `VersionManager` skips any association whose `CascadeDelete` flag is missing or whose `isCloneRelevant()` returns `false`.

Associations of `product` opted out in core:

- `product.productReviews` — already overwritten by the Administration.
- `product.searchKeywords` — rebuilt by the product indexer.
- `product.categoriesRo` — rebuilt by the product indexer.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\CascadeDelete`
- `CascadeDelete::$cloneRelevant`
- `CascadeDelete::isCloneRelevant()`
- `OneToManyAssociationField`, `ProductSearchKeywordDefinition`

## Gotchas

- Only associations carrying `CascadeDelete` are considered in the clone process at all; an association without the flag is never cloned.
- `new CascadeDelete(false)` only disables cloning: the flag's `parse()` still yields `cascade_delete => true` regardless of the constructor argument.

## Version notes

- Controllable since Shopware 6.3 by setting `$cloneRelevant` to `false`.

## Code check (6.7.15.1)
- confirmed `CascadeDelete::$cloneRelevant` — promoted constructor property, default `true` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/CascadeDelete.php:13
- confirmed `CascadeDelete::isCloneRelevant()` — returns the constructor flag — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/CascadeDelete.php:22
- confirmed `CascadeDelete::parse()` — yields `cascade_delete` regardless of clone flag — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/CascadeDelete.php:17
- confirmed `isCloneRelevant` — clone skips associations without the flag or with it false — vendor/shopware/core/Framework/DataAbstractionLayer/VersionManager.php:435
- confirmed `searchKeywords` — `new CascadeDelete(false)` on product — vendor/shopware/core/Content/Product/ProductDefinition.php:264
- confirmed `productReviews` — `new CascadeDelete(false)` on product — vendor/shopware/core/Content/Product/ProductDefinition.php:266
- confirmed `categoriesRo` — `new CascadeDelete(false)` on product — vendor/shopware/core/Content/Product/ProductDefinition.php:284
