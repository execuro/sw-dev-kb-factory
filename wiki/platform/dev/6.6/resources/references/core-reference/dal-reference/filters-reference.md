---
id: platform/dev/6.6/resources/references/core-reference/dal-reference/filters-reference.md
title: Filters Reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/core-reference/dal-reference/filters-reference.html
sourceHash: 31c2dfb1361ef521f6e6f27732db1ef750b22267
keywords: ["EqualsFilter", "EqualsAnyFilter", "ContainsFilter", "RangeFilter", "NotFilter", "MultiFilter", "PrefixFilter", "SuffixFilter", "Criteria filter", "DAL filters"]
summary: "DAL Criteria filter types (equals, equalsAny, contains, range, not, multi, prefix, suffix) as PHP classes and API JSON."
lastBuilt: "2026-09-15"
---

## What it is
Reference for the DAL Criteria filter types: `equals`, `equalsAny`, `contains`, `range`, `not`, `multi`, `prefix`, `suffix`, shown both as PHP `Criteria` filter classes and as API criteria JSON.

## When to use
Use this reference when building a search `Criteria` (in PHP or via the Admin/Store API) and you need the exact filter type name, its PHP class, and its JSON `type` value.

## Key steps / config
- `Equals` — exact match, e.g. `WHERE stock = 10`. PHP: `new EqualsFilter('stock', 10)`. API: `{ "type": "equals", "field": "stock", "value": 10 }`.
- `EqualsAny` — at least one exact match from a list, e.g. `WHERE productNumber IN (...)`. PHP: `new EqualsAnyFilter('productNumber', [...])`. API: `{ "type": "equalsAny", "field": "productNumber", "value": [...] }`.
- `Contains` — wildcard match containing the value, e.g. `WHERE name LIKE '%Lightweight%'`. PHP: `new ContainsFilter('name', 'Lightweight')`.
- `Range` — value-space match on numeric/date fields using `gte`, `lte`, `gt`, `lt` parameters, e.g. `WHERE stock >= 20 AND stock <= 30`. PHP: `new RangeFilter('stock', [RangeFilter::GTE => 20, RangeFilter::LTE => 30])`.
- `Not` — negates a filter, combined via a `NotFilter::CONNECTION_OR`/`AND` operator.
- `Multi` — logically links multiple filters via a `MultiFilter::CONNECTION_OR`/`AND` operator.
- `Prefix` / `Suffix` — wildcard match at the start/end of a value, e.g. `WHERE name LIKE 'Lightweight%'` / `WHERE name LIKE '%Lightweight'`.

```json
{
    "filter": [
        { "type": "range", "field": "stock", "parameters": { "gte": 20, "lte": 30 } }
    ]
}
```

## Essential identifiers
`EqualsFilter`, `EqualsAnyFilter`, `ContainsFilter`, `RangeFilter`, `NotFilter`, `MultiFilter`, `PrefixFilter`, `SuffixFilter`, `RangeFilter::GTE`, `RangeFilter::LTE`, `NotFilter::CONNECTION_OR`, `MultiFilter::CONNECTION_OR`

## Gotchas
Storage systems are case-insensitive: the casing of filter values does not affect how they are matched.
