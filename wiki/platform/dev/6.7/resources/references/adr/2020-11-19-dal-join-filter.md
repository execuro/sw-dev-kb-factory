---
id: platform/dev/6.7/resources/references/adr/2020-11-19-dal-join-filter.md
title: DAL join filter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2020-11-19-dal-join-filter.html
sourceHash: 3a23a3895c5874eceab0c0dbb503b725111f2619
codeCheckedAgainst: "6.7.13.0"
keywords: ["join-filter", "anti-join-filter", "join-groups", "JoinGroupBuilder", "JoinGroup", "MultiFilter", "AndFilter", "NotFilter", "EqualsFilter", "FieldResolver", "to-many association", "criteria filter", "dal"]
summary: "ADR: DAL forms join-groups per multi-filter layer; to-many filters in separate addFilter calls may match different associated records."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2020-11-19) on how the DAL's SQL implementation decides how often to join a `to-many` association when a criteria filters on it, replacing the old automatic `anti-join-filter` that was only built for a `not-filter` on an association field and sometimes returned wrong results or threw PHP exceptions.

## When to use

When a `Criteria` filters on fields of a `to-many` association (e.g. `product.categories.*`, product properties) and you need to know whether the conditions apply to the same associated record or may be satisfied by different ones.

## Key steps / config

- The caller passes no extra parameter; the DBAL layer detects multiple joins itself.
- `join-groups` are formed per `multi-filter` layer: an association is joined once per layer, and several fields of it can be queried in that one join.
- If an already-filtered field is filtered again in another or nested `multi-filter`, a separate join is created for it. Only `to-many` associations are resolved multiple times.
- After grouping, the field and its filter go to the `FieldResolver` that builds the SQL JOIN; resolved filters are marked and combined in the WHERE with AND/OR/NOT logic.
- Negated (anti-join): each group is `LEFT JOIN ... AND x.id IN (...)` with `WHERE x.product_id IS NULL`. Positive (join): same joins with `IS NOT NULL`.

In the installed code this is `JoinGroupBuilder::group()`, which creates a `JoinGroup` when a to-many association is filtered inside a `NotFilter`, or by more than one `multi-filter`; an "empty" filter such as an `EqualsFilter` on `product.tags.id` with `null` creates no group.

To require all conditions on the same associated record, wrap them in one multi filter:

```php
// 1: same category must match name AND be active
$criteria->addFilter(new AndFilter([
    new EqualsFilter('product.categories.name', 'test-category'),
    new EqualsFilter('product.categories.active', true),
]));
// 2: separate calls -> any category named test-category AND any active category
$criteria->addFilter(new EqualsFilter('product.categories.name', 'test-category'));
$criteria->addFilter(new EqualsFilter('product.categories.active', true));
```

## Essential identifiers

- `Shopware\Core\Framework\DataAbstractionLayer\Dbal\JoinGroupBuilder`
- `Shopware\Core\Framework\DataAbstractionLayer\Dbal\JoinGroup`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\MultiFilter`
- `AndFilter`, `NotFilter`, `EqualsFilter`
- `Criteria::addFilter()`

## Gotchas

- Queries with several filters on a to-many association can return more or fewer records than before this change; re-check such queries.
- Filters passed in separate `addFilter()` calls are not tied to the same associated row — wrap them in an `AndFilter` when they must be.
- `JoinGroupBuilder` is marked `@internal`; rely on the filter semantics, not on the class.

## Code check (6.7.13.0)
- confirmed `JoinGroupBuilder` — @internal class that groups filters into join groups — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/JoinGroupBuilder.php:23
- confirmed `JoinGroupBuilder::group()` — creates JoinGroup for not-filter or multiple multi-filters on to-many — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/JoinGroupBuilder.php:44
- confirmed `JoinGroup` — filter class holding grouped filters — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/JoinGroup.php:13
- confirmed `MultiFilter` — base of AndFilter/NotFilter — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/MultiFilter.php:11
- confirmed `AndFilter` — MultiFilter with CONNECTION_AND — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/AndFilter.php:11
- confirmed `NotFilter` — extends MultiFilter — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/NotFilter.php:8
- confirmed `EqualsFilter` — single-field filter — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/EqualsFilter.php:11
- confirmed `Criteria::addFilter()` — accepts variadic Filter — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:260
- confirmed `CriteriaQueryBuilder` — query builder that injects JoinGroupBuilder — vendor/shopware/core/Framework/DataAbstractionLayer/Dbal/CriteriaQueryBuilder.php:25
- unverified `FieldResolver` — generic resolver name from the ADR; not checked against a single class
