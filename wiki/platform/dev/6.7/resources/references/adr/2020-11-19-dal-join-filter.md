---
id: platform/dev/6.7/resources/references/adr/2020-11-19-dal-join-filter.md
title: DAL join filter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-11-19-dal-join-filter.html
sourceHash: 3a23a3895c5874eceab0c0dbb503b725111f2619
codeCheckedAgainst: "6.7.15.1"
keywords: ["join-filter", "anti-join-filter", "join-groups", "JoinGroup", "JoinGroupBuilder", "multi-filter", "not-filter", "to-many association", "AndFilter", "EqualsFilter", "FieldResolver", "criteria", "dal", "adr"]
summary: "ADR: the DAL forms join-groups per multi-filter layer, so filters on a to-many association get separate joins unless wrapped together."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2020-11-19, area: core) on how the DAL's SQL implementation filters `to-many` associations. The former `anti-join-filter`, assembled automatically in the entity searcher when a `not-filter` pointed to an association field, sometimes returned wrong results or failed with a PHP exception, and its counterpart, the `join-filter`, was missing.

## When to use

When you filter on fields of a `to-many` association (e.g. `product.categories.*`, product properties) with several filters, negated filters, or nested multi filters, and need to predict which records the criteria returns.

## Key steps / config

- Target SQL shape: each value group joins the association separately (`LEFT JOIN property_properties color_filter ... AND color_filter.id IN (...)`, likewise `size_filter`). The `join-filter` then requires `... .product_id IS NOT NULL` for every join; the `anti-join-filter` requires `... .product_id IS NULL`.
- The DBAL implementation decides by itself whether an association must be joined several times; the DAL user passes no extra parameter.
- `join-groups` are formed per `multi-filter` layer: an association is joined only once per layer, and several fields can be queried within that one join. A field filtered again in another or nested `multi-filter` gets its own join. Only `to-many` associations are resolved multiple times.
- After grouping, the field and the filter containing it are passed to the `FieldResolver`, which builds the SQL JOIN. Filters resolved in the JOIN are marked and later combined in the WHERE with the matching AND/OR/NOT logic.
- To relate several filters on one `to-many` association to each other, wrap them in a multi filter:

```php
// 1: same category must match both conditions
$criteria->addFilter(new AndFilter([
    new EqualsFilter('product.categories.name', 'test-category'),
    new EqualsFilter('product.categories.active', true),
]));
// 2: each condition may match a different category
$criteria->addFilter(new EqualsFilter('product.categories.name', 'test-category'));
$criteria->addFilter(new EqualsFilter('product.categories.active', true));
```

Variant 1 returns products assigned to `test-category` where that category is active; variant 2 returns products assigned to `test-category` that also have some active category.

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Dbal\JoinGroupBuilder` (`group()`), `Shopware\Core\Framework\DataAbstractionLayer\Dbal\JoinGroup`
- `AndFilter`, `MultiFilter`, `NotFilter`, `EqualsFilter`
- `CriteriaPartResolver`, field resolvers' `join()`

## Gotchas

- Queries can now behave differently when several filters are set on a to-many association; check existing filters on to-many fields, as more or fewer records may be returned.
- In the installed `JoinGroupBuilder`, a `JoinGroup` is created when a to-many association is filtered with a `not-filter` or by more than one `multi-filter`; an empty filter such as `new EqualsFilter('product.tags.id', null)` produces no join group.

## Code check (6.7.15.1)
- confirmed `JoinGroupBuilder` — internal class grouping filters into join groups — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/JoinGroupBuilder.php:23
- confirmed `JoinGroupBuilder::group()` — rules: not-filter or multiple multi-filters on to-many — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/JoinGroupBuilder.php:44
- confirmed `JoinGroup` — filter holding queries, path, suffix, operator — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/JoinGroup.php:13
- confirmed `CriteriaPartResolver` — resolves criteria parts into joins — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/FieldResolver/CriteriaPartResolver.php:34
- confirmed `AbstractFieldResolver::join()` — field resolver builds the SQL JOIN — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/FieldResolver/AbstractFieldResolver.php:13
- confirmed `AndFilter` — extends MultiFilter — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/AndFilter.php:11
- confirmed `NotFilter` — extends MultiFilter, negates nested group — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/NotFilter.php:8
- confirmed `EqualsFilter` — SingleFieldFilter — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/EqualsFilter.php:11
- confirmed `MultiFilter` — base for AND/OR/NOT grouping — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/MultiFilter.php:11
