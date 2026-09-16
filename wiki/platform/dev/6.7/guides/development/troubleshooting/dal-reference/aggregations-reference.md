---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md
sourceHash: 6ab753e9ef51809a1a5bb6aa4cf15cc1ae6ebee1
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/aggregations-reference.html
title: Aggregations Reference
version: "6.7"
versions:
  - "6.7"
keywords: ["aggregations", "dal aggregation", "metric aggregation", "bucket aggregation", "TermsAggregation", "FilterAggregation", "EntityAggregation", "DateHistogramAggregation", "RangeAggregation", "StatsAggregation", "AvgAggregation", "addAggregation", "facets", "histogram", "getAggregations"]
summary: "DAL aggregation types (avg, count, max, min, stats, sum, entity, filter, terms, histogram, range): PHP classes, API JSON shape, result getters, nesting."
lastBuilt: 2026-09-15
---
## What it is

Reference for DAL aggregations: extra information computed over a search result (totals, unique values, averages) alongside the hits. Two kinds: **metric** (a formula over a field, always has a result) and **bucket** (a list of keys, each of which can carry nested aggregations).

## When to use

When a `Criteria` search (PHP repository or Admin/Store API) must also return sums, min/max, counts, distinct values with counts, entities per key, date histograms or numeric range facets.

## Key steps / config

PHP: add to the criteria, read by aggregation name from the result.

```php
$criteria->addAggregation(new AvgAggregation('avg-price', 'price'));
$result = $repository->search($criteria, $context);
/** @var AvgResult $aggregation */
$aggregation = $result->getAggregations()->get('avg-price');
$aggregation->getAvg();
```

API: `aggregations` is a list; each entry needs a non-empty `name` (no `?` or `:`) and a `type`; `field` is required for every type except `filter`.

```json
{ "aggregations": [
  { "name": "manufacturer-ids", "type": "terms", "field": "manufacturerId",
    "limit": 3, "sort": { "field": "manufacturer.name", "order": "DESC" },
    "aggregation": { "name": "...", "type": "...", "field": "..." } }
] }
```

| API `type` | PHP class (constructor args) | Result |
|---|---|---|
| `avg`/`max`/`min`/`sum` | `AvgAggregation`/`MaxAggregation`/`MinAggregation`/`SumAggregation` (name, field) | `getAvg()`/`getMax()`/`getMin()`/`getSum()` |
| `count` | `CountAggregation` (name, field) | `CountResult::getCount()` |
| `stats` | `StatsAggregation` (name, field) — max, min, avg, sum | `StatsResult` |
| `terms` | `TermsAggregation` (name, field, ?limit, ?`FieldSorting`, ?nested) | `TermsResult::getBuckets()` |
| `filter` | `FilterAggregation` (name, nested, filters[]) | under the nested aggregation's name |
| `entity` | `EntityAggregation` (name, field, entity); API key `definition` | `EntityResult::getEntities()` |
| `histogram` | `DateHistogramAggregation` (name, field, interval, ?sorting, ?nested, ?format, ?timeZone); API key `interval` | `DateHistogramResult::getBuckets()` |
| `range` | `RangeAggregation` (name, field, ranges); API key `ranges` | `RangeResult::getRanges()` |

Namespaces: `Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric\` (avg, count, max, min, stats, sum, entity, range) and `Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Bucket\` (terms, filter, histogram).

- Histogram intervals (`DateHistogramAggregation::PER_*`, e.g. `PER_MONTH`): `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year`; lower-cased and validated, else an exception.
- Range entries: `from` compared with greater-than-or-equal, `to` with lower-than; optional `key`, otherwise built as `<from>-<to>` with `*` for an open bound.
- Filter aggregation API: `{ "name": "...", "type": "filter", "filter": [ { "type": "equals", "field": "active", "value": true } ], "aggregation": { ... } }` — `filter` and `aggregation` both required.
- Nesting: bucket results expose `getKey()`, `getCount()` and `getResult()` (the nested aggregation's result), e.g. a `filter` with `RangeFilter('price', ['gte' => 500])` wrapping `terms` on `categories.id` wrapping `terms` on `manufacturerId`.

## Essential identifiers

- `Criteria::addAggregation()`, `getAggregations()->get('<name>')`
- `AvgAggregation`, `CountAggregation`, `MaxAggregation`, `MinAggregation`, `SumAggregation`, `StatsAggregation`, `EntityAggregation`, `RangeAggregation`, `TermsAggregation`, `FilterAggregation`, `DateHistogramAggregation`
- API types: `avg`, `count`, `max`, `min`, `stats`, `sum`, `entity`, `filter`, `terms`, `histogram`, `range`

## Gotchas

- `filter` produces no result of its own and cannot be used alone; its filters affect only the wrapped aggregation, not search results or other aggregations.
- `terms` `limit` defaults to `null` (no limit) in code; the docs say "default: zero". Unsorted unless `sort` is given (any `order` other than `desc` is ascending).
- The docs show the `range` API request as an object keyed by name (`"price_ranges": { "range": { ... } }`); the installed parser only reads list entries with `name`, `type: "range"`, `field`, `ranges`.
- The docs label `entity` and `range` as bucket aggregations; in code both are in the `Metric` namespace and extend `Aggregation` directly (`RangeAggregation` is `final`).
- The docs' interval list repeats `day`; code allows exactly seven.

## Code check (6.7.13.0)
- corrected `TermsAggregation::$limit` — docs: default zero; code default null — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Bucket/TermsAggregation.php:18
- corrected `ranges` — docs: name-keyed `range` object in API request; parser requires list entry with `ranges` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:240
- confirmed `DateHistogramAggregation::ALLOWED_INTERVALS` — minute, hour, day, week, month, quarter, year — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Bucket/DateHistogramAggregation.php:27
- confirmed `definition` — required API key for entity aggregation — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:248
- confirmed `interval` — required API key for histogram aggregation — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:288
- confirmed `FilterAggregation` — constructor (name, nested aggregation, filters) — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Bucket/FilterAggregation.php:13
- corrected `EntityAggregation` — docs: bucket aggregation; class is in Metric namespace extending Aggregation — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Metric/EntityAggregation.php:12
- confirmed `RangeAggregation` — final, from >= / to < bounds, key built from bounds — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Aggregation/Metric/RangeAggregation.php:16
- confirmed `Bucket::getResult()` — nested aggregation result per bucket — vendor/shopware/core/Framework/DataAbstractionLayer/Search/AggregationResult/Bucket/Bucket.php:32
- confirmed `EntityResult::getEntities()` — returns EntityCollection — vendor/shopware/core/Framework/DataAbstractionLayer/Search/AggregationResult/Metric/EntityResult.php:29
