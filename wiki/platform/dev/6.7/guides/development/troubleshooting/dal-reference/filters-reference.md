---
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md
title: Filters Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/filters-reference.html
sourceHash: a7cfebb53392db138b03513392a1a737ce25a1bb
codeCheckedAgainst: "6.7.15.1"
keywords: ["dal filters", "criteria filter", "EqualsFilter", "EqualsAnyFilter", "ContainsFilter", "RangeFilter", "NotFilter", "MultiFilter", "PrefixFilter", "SuffixFilter", "QueryStringParser", "api search filter", "where clause"]
summary: DAL filter types (equals, equalsAny, contains, range, not, multi, prefix, suffix) with PHP filter classes, API JSON shape and the SQL each produces.
lastBuilt: 2026-10-21
---
## What it is

Reference for the filters in `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter` that restrict a `Criteria` search, in PHP (`$criteria->addFilter(...)`) and in the API search body (`filter` list, parsed by `QueryStringParser`).

## When to use

When building a repository search or a Store/Admin API search request and you need the exact filter `type`, its parameters and the PHP class.

## Key steps / config

| API `type` | PHP class | Background SQL (from source) |
|---|---|---|
| `equals` | `new EqualsFilter('stock', 10)` | `WHERE stock = 10` |
| `equalsAny` | `new EqualsAnyFilter('productNumber', [...])` | `WHERE productNumber IN (...)` |
| `contains` | `new ContainsFilter('name', 'Lightweight')` | `LIKE '%Lightweight%'` |
| `prefix` | `new PrefixFilter('name', 'Lightweight')` | `LIKE 'Lightweight%'` |
| `suffix` | `new SuffixFilter('name', 'Lightweight')` | `LIKE '%Lightweight'` |
| `range` | `new RangeFilter('stock', [RangeFilter::GTE => 20, RangeFilter::LTE => 30])` | `WHERE stock >= 20 AND stock <= 30` |
| `not` | `new NotFilter(NotFilter::CONNECTION_OR, [...])` | `WHERE !(a OR b)` |
| `multi` | `new MultiFilter(MultiFilter::CONNECTION_OR, [...])` | `WHERE (a OR b)` |

Range parameters: `gte`, `lte`, `gt`, `lt` (constants `RangeFilter::GTE`, `LTE`, `GT`, `LT`); in the API they go under `parameters`.

Container operators: `MultiFilter::CONNECTION_AND`, `CONNECTION_OR`, `CONNECTION_XOR` (`NotFilter` extends `MultiFilter`, so it inherits them). API operators are case-insensitive (`"or"` works).

API shape:

```json
{
  "filter": [
    { "type": "equals", "field": "active", "value": true },
    { "type": "equalsAny", "field": "productNumber", "value": ["...", "..."] },
    { "type": "range", "field": "stock", "parameters": { "gte": 20, "lte": 30 } },
    { "type": "multi", "operator": "or", "queries": [
        { "type": "equals", "field": "stock", "value": 1 },
        { "type": "equals", "field": "availableStock", "value": 1 } ] }
  ]
}
```

Several top-level `filter` entries / `addFilter()` calls are combined with AND.

## Essential identifiers

- `EqualsFilter`, `EqualsAnyFilter`, `ContainsFilter`, `PrefixFilter`, `SuffixFilter`, `RangeFilter`, `NotFilter`, `MultiFilter`
- `RangeFilter::GTE`, `RangeFilter::LTE`, `RangeFilter::GT`, `RangeFilter::LT`
- `MultiFilter::CONNECTION_OR`, `MultiFilter::CONNECTION_AND`, `NotFilter::CONNECTION_OR`
- `QueryStringParser`, `Criteria::addFilter()`

## Gotchas

- The `range` filter's API key is `parameters` (plural); a missing or empty `parameters` object is rejected. The source's prose calls it `parameter`.
- `not` defaults to operator `AND` and `multi` defaults to `AND` when `operator` is omitted; `multi` only switches to OR for the value `or`/`OR`.
- `equals` requires a scalar or `null` `value`; `equalsAny` also accepts a `|`-separated string, which is split into a list.
- `contains`, `prefix` and `suffix` reject an empty value.
- The parser also knows types the source does not document: `and`, `or`, `nand`, `nor`, `equalsAll`, `since`, `until`.
- String matching is generally case-insensitive in the storage systems.

## Code check (6.7.15.1)
- confirmed `RangeFilter::GTE` — 'gte'; also LTE/LT/GT — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/RangeFilter.php:18
- corrected `range` — docs: `parameter` property; parser reads `parameters` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:150
- confirmed `MultiFilter::CONNECTION_OR` — 'OR'; AND and XOR also valid — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/MultiFilter.php:14
- confirmed `MultiFilter::__construct()` — operator upper-cased and validated — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/MultiFilter.php:28
- confirmed `NotFilter` — extends MultiFilter — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/NotFilter.php:8
- confirmed `not` — operator defaults to AND — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:93
- confirmed `equals` — value must be scalar or null — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:78
- confirmed `equalsAny` — string value split on pipe — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:39
- confirmed `equalsAll` — additional undocumented filter type — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:163
- confirmed `ContainsFilter` — extends SingleFieldFilter — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/ContainsFilter.php:11
