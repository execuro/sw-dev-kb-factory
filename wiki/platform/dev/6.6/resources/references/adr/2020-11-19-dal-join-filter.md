---
id: platform/dev/6.6/resources/references/adr/2020-11-19-dal-join-filter.md
title: DAL join filter
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-11-19-dal-join-filter.html
sourceHash: 3a23a3895c5874eceab0c0dbb503b725111f2619
keywords: ["anti-join-filter", "join-filter", "join-groups", "multi-filter", "FieldResolver", "criteria", "DAL", "Data Abstraction Layer", "AndFilter", "EqualsFilter", "to-many association", "negated filter"]
summary: "ADR: DAL forms per-multi-filter join-groups so to-many association filters (anti-join / join) resolve correctly without extra params."
lastBuilt: "2026-09-15"
---
## What it is

An architecture decision record describing how the Data Abstraction Layer (DAL) resolves filters against `to-many` associations, fixing incorrect results from the earlier `anti-join-filter` implementation and adding a missing `join-filter` counterpart.

## Key steps / config

- The DBAL implementation itself detects whether several joins must be made on an association; the DAL user does not pass an extra parameter.
- `join-groups` are formed per `multi-filter` layer, so a join to an association happens once per `multi-filter` layer, allowing several fields to be queried within one join.
- If an already-filtered field is filtered again in another or nested `multi-filter`, a separate join is created for that field.
- After `join-groups` are formed, the field to resolve is passed to the `FieldResolver` (which builds the SQL JOIN) along with the filter it belongs to; resolved filters are then linked in the WHERE clause with AND/OR/NOT logic.
- To filter a `to-many` association on multiple fields that should all relate to each other, wrap them in a multi filter, e.g.:

```php
$criteria->addFilter(
    new AndFilter([
        new EqualsFilter('product.categories.name', 'test-category'),
        new EqualsFilter('product.categories.active', true)
    ])
);
```

Two separate `addFilter` calls on the same association (instead of one `AndFilter`) now behave differently: each filter is resolved against its own join, matching products that have *any* category named `test-category` AND *any* active category, rather than requiring the same category to satisfy both conditions.

## Essential identifiers

- `anti-join-filter`, `join-filter`, `join-groups`, `multi-filter`
- `FieldResolver`
- `AndFilter`, `EqualsFilter`

## Gotchas

Queries against the DAL can behave differently once multiple filters are set on a to-many association; existing code that relies on filters combining into a single join (the old `anti-join-filter` auto-assembly behavior) should be checked, since results may now include more or fewer records.
