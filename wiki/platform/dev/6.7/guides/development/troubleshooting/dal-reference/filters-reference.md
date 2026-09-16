---
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md
title: Filters Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/filters-reference.html
sourceHash: a7cfebb53392db138b03513392a1a737ce25a1bb
codeCheckedAgainst: "6.7.13.0"
keywords: ["EqualsFilter", "EqualsAnyFilter", "ContainsFilter", "RangeFilter", "NotFilter", "MultiFilter", "PrefixFilter", "SuffixFilter", "Criteria", "addFilter", "api criteria filter", "dal search filter", "where condition"]
summary: DAL filters (equals, equalsAny, contains, range, not, multi, prefix, suffix) - PHP filter classes and API criteria JSON shapes.
lastBuilt: 2026-09-15
---
## What it is

Reference of the DAL search filters, each available as a PHP class added via `Criteria::addFilter()` and as a JSON object in the `filter` array of API criteria.

## When to use

When building a `Criteria` in PHP or an API search body and you need the exact filter class, `type` string and parameter names.

## Key steps / config

| API `type` | PHP class | SQL equivalent |
|---|---|---|
| `equals` | `EqualsFilter('stock', 10)` | `stock = 10` |
| `equalsAny` | `EqualsAnyFilter('productNumber', [...])` | `productNumber IN (...)` |
| `contains` | `ContainsFilter('name', 'Lightweight')` | `LIKE '%Lightweight%'` |
| `prefix` | `PrefixFilter('name', 'Lightweight')` | `LIKE 'Lightweight%'` |
| `suffix` | `SuffixFilter('name', 'Lightweight')` | `LIKE '%Lightweight'` |
| `range` | `RangeFilter('stock', [RangeFilter::GTE => 20, RangeFilter::LTE => 30])` | `stock >= 20 AND stock <= 30` |
| `not` | `NotFilter(NotFilter::CONNECTION_OR, [...])` | `!(a OR b)` |
| `multi` | `MultiFilter(MultiFilter::CONNECTION_OR, [...])` | `(a OR b)` |

Range operators: `gte`, `lte`, `gt`, `lt`.

```php
$criteria = new Criteria();
$criteria->addFilter(new EqualsFilter('active', true));
$criteria->addFilter(new MultiFilter(MultiFilter::CONNECTION_OR, [
    new EqualsFilter('stock', 1),
    new EqualsFilter('availableStock', 1),
]));
```

```json
{ "filter": [
  { "type": "equals", "field": "stock", "value": 10 },
  { "type": "range", "field": "stock", "parameters": { "gte": 20, "lte": 30 } },
  { "type": "multi", "operator": "or", "queries": [ { "type": "equals", "field": "..", "value": ".." } ] }
] }
```

Parser rules in the installed code:
- `type` is required; `equals` needs `field` and a scalar or null `value`.
- `contains`/`prefix`/`suffix` reject an empty `value`; `equalsAny` takes an array or a `|`-separated string.
- `range` requires a non-empty `parameters` object.
- `multi`: `operator` is upper-cased; only `OR` is recognised, everything else becomes `AND`. `not`: `operator` defaults to `AND`.
- Also accepted: `equalsAll`, `and`, `or`, `nand`, `nor`, `since`, `until`.

## Essential identifiers

- Namespace `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter`
- `EqualsFilter`, `EqualsAnyFilter`, `ContainsFilter`, `PrefixFilter`, `SuffixFilter`, `RangeFilter`, `MultiFilter`, `NotFilter`
- `RangeFilter::GTE`, `RangeFilter::LTE`, `RangeFilter::GT`, `RangeFilter::LT`
- `MultiFilter::CONNECTION_AND`, `MultiFilter::CONNECTION_OR`

## Gotchas

- The docs' prose calls the range property `parameter`; the key the parser reads is `parameters`.
- `NotFilter` extends `MultiFilter` and negates the combined queries.
- Storage systems are generally case-insensitive: casing of string filter values does not affect results.

## Code check (6.7.13.0)
- confirmed `EqualsFilter` — built from type equals with field and value — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:68
- confirmed `equalsAny` — accepts array or pipe-separated string — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:173
- corrected `parameters` — docs prose: `parameter` property — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:132
- confirmed `RangeFilter::GTE` — value 'gte' — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/RangeFilter.php:18
- confirmed `MultiFilter::CONNECTION_OR` — value 'OR' — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/MultiFilter.php:14
- confirmed `NotFilter` — extends MultiFilter — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Filter/NotFilter.php:8
- confirmed `MultiFilter::CONNECTION_AND` — multi operator defaults to AND unless OR — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:91
- confirmed `not` — operator defaults to 'AND' — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:77
- confirmed `contains` — empty value rejected — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:100
- confirmed `equalsAll` — additional filter type not listed in the docs — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:145
