---
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md
title: Aggregations Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/aggregations-reference.html
sourceHash: 6ab753e9ef51809a1a5bb6aa4cf15cc1ae6ebee1
codeCheckedAgainst: "6.7.15.1"
keywords: ["aggregations", "metric aggregation", "bucket aggregation", "AvgAggregation", "TermsAggregation", "FilterAggregation", "EntityAggregation", "DateHistogramAggregation", "RangeAggregation", "StatsAggregation", "AggregationParser", "facets", "histogram", "criteria aggregations"]
summary: DAL aggregation types (avg, count, max, min, stats, sum, entity, filter, terms, histogram, range) with PHP classes, API JSON shape and nesting.
lastBuilt: 2026-10-21
---
## What it is

Reference for DAL aggregations: extra information computed over the whole search result (totals, unique values, averages), added to a `Criteria` via `addAggregation()` or to an API search body under `aggregations`. Two kinds exist: **metric** aggregations apply a formula to a field and always yield a value; **bucket** aggregations determine a list of keys and can carry a nested aggregation per key.

## When to use

When a repository search or Store/Admin API search must also return counts, sums, min/max, distinct values, date buckets, price ranges or loaded entities for facets, without a second query.

## Key steps / config

PHP: `$criteria->addAggregation(new AvgAggregation('avg-price', 'price'));`, then `$result->getAggregations()->get('avg-price')` returns the typed result (`AvgResult::getAvg()` etc.).

| API `type` | PHP class (namespace `...\Search\Aggregation\`) | Extra parameters / result |
|---|---|---|
| `avg`, `count`, `max`, `min`, `sum` | `Metric\AvgAggregation`, `CountAggregation`, `MaxAggregation`, `MinAggregation`, `SumAggregation` (`$name, $field`) | `getAvg()`, `getCount()`, `getMax()`, `getMin()`, `getSum()` |
| `stats` | `Metric\StatsAggregation` | `getMin()`, `getMax()`, `getAvg()`, `getSum()` |
| `entity` | `Metric\EntityAggregation($name, $field, $entity)` | API key `definition` (required), e.g. `product_manufacturer`; `getEntities()` |
| `terms` | `Bucket\TermsAggregation($name, $field, ?int $limit, ?FieldSorting $sorting, ?Aggregation $aggregation)` | API `limit`, `sort: {field, order, naturalSorting}`, `aggregation`; `getBuckets()` |
| `filter` | `Bucket\FilterAggregation($name, Aggregation $aggregation, array $filter)` | API `filter` (list of filters) and `aggregation` both required |
| `histogram` | `Bucket\DateHistogramAggregation($name, $field, $interval, ?FieldSorting, ?Aggregation, ?string $format, ?string $timeZone)` | API `interval` (required), `format`, `timeZone`, `sort`, `aggregation` |
| `range` | `Metric\RangeAggregation($name, $field, array $ranges)` | API `ranges` (required): list of `{from?, to?, key?}`; `RangeResult::getRanges()` |

Histogram intervals (`DateHistogramAggregation::ALLOWED_INTERVALS`): `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year` (constants `PER_MINUTE` ... `PER_YEAR`); anything else throws.

Range bounds: `from` is compared with greater-than-or-equal, `to` with lower-than; a missing key is built as `<from>-<to>` with `*` for an open bound (e.g. `*-100`).

API request shape (every aggregation is a list entry with `name` and `type`; `field` is required except for `filter`):

```json
{
  "aggregations": [
    { "name": "manufacturer-ids", "type": "terms", "field": "manufacturerId",
      "limit": 3, "sort": { "field": "manufacturer.name", "order": "DESC" } },
    { "name": "active-price-avg", "type": "filter",
      "filter": [ { "type": "equals", "field": "active", "value": true } ],
      "aggregation": { "name": "avg-price", "type": "avg", "field": "price" } },
    { "name": "price_ranges", "type": "range", "field": "price",
      "ranges": [ { "to": 100 }, { "from": 100, "to": 200 }, { "from": 200 } ] }
  ]
}
```

Nesting: bucket aggregations take a nested aggregation (`aggregation` in the API, last constructor argument in PHP). Read it per bucket with `$bucket->getKey()`, `$bucket->getCount()` and `$bucket->getResult()`. Example from the source: `FilterAggregation('my-filter', new TermsAggregation('per-category', 'categories.id', null, null, new TermsAggregation('manufacturer-ids', 'manufacturerId')), [new RangeFilter('price', ['gte' => 500])])`.

## Essential identifiers

- `AvgAggregation`, `CountAggregation`, `MaxAggregation`, `MinAggregation`, `SumAggregation`, `StatsAggregation`, `EntityAggregation`, `RangeAggregation`
- `TermsAggregation`, `FilterAggregation`, `DateHistogramAggregation`, `DateHistogramAggregation::PER_MONTH`
- `AvgResult`, `CountResult`, `MaxResult`, `MinResult`, `SumResult`, `StatsResult`, `EntityResult`, `TermsResult`, `DateHistogramResult`, `RangeResult`
- `Criteria::addAggregation()`, `getAggregations()->get()`, `FieldSorting::DESCENDING`

## Gotchas

- A `filter` aggregation produces no result of its own: read the nested aggregation by **its** name (`avg-price`, not `active-price-avg`). Its filters only apply to that aggregation, not to search results or other aggregations.
- The docs' API sample for range aggregations uses an Elasticsearch-style object keyed by name (`"price_ranges": { "range": { ... } }`); the installed `AggregationParser` only accepts the list form shown above with `"type": "range"` and `ranges`.
- `terms` `limit` defaults to `null` (no limit), not zero as the docs state; without `sort` the buckets are unsorted.
- `EntityAggregation` and `RangeAggregation` live in the `Metric` namespace even though the docs list them as bucket aggregations.
- Aggregation names must be non-empty, non-numeric and must not contain backticks, question marks, colons or control characters; range `key` values follow the same rule.
- `max`/`min` may come back as strings in API responses (e.g. `"979"`).

## Code check (6.7.15.1)
- corrected `TermsAggregation::$limit` — docs: default zero; code defaults to null — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Bucket/TermsAggregation.php:18
- corrected `range` — docs: ES-style nested API object; parser requires list entry with `ranges` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:240
- corrected `RangeAggregation` — docs: bucket type; class is in Metric namespace — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Metric/RangeAggregation.php:16
- confirmed `EntityAggregation` — third argument is entity name, API key `definition` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Metric/EntityAggregation.php:12
- confirmed `DateHistogramAggregation::ALLOWED_INTERVALS` — minute..year, seven values — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Bucket/DateHistogramAggregation.php:27
- confirmed `histogram` — API requires `interval`, accepts `format`/`timeZone` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:143
- confirmed `FilterAggregation` — constructor (name, aggregation, filter list) — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Bucket/FilterAggregation.php:13
- confirmed `filter` — API requires `filter` and `aggregation` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:271
- confirmed `Bucket::getResult()` — nested aggregation result per bucket — vendor/shopware/core/Framework/DataAbstractionLayer/Search/AggregationResult/Bucket/Bucket.php:32
- confirmed `RangeAggregation::buildRangeKey()` — default key `<from>-<to>` with `*` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Metric/RangeAggregation.php:67
