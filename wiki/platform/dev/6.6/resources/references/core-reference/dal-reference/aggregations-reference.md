---
id: platform/dev/6.6/resources/references/core-reference/dal-reference/aggregations-reference.md
title: Aggregations Reference
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/core-reference/dal-reference/aggregations-reference.html
sourceHash: e3fb07700f2413404094e9cf663921eaff8fe556
keywords: ["aggregations reference", "AvgAggregation", "CountAggregation", "MaxAggregation", "MinAggregation", "SumAggregation", "StatsAggregation", "TermsAggregation", "FilterAggregation", "EntityAggregation", "DateHistogramAggregation", "RangeAggregation", "DAL aggregations", "metric aggregation", "bucket aggregation"]
summary: "Reference for DAL Criteria aggregation types: metric (avg/count/max/min/sum/stats) and bucket (entity/filter/terms/histogram/range)."
lastBuilt: 2026-09-15
---
## What it is

Reference for DAL `Criteria` aggregations, which compute additional information (totals, unique values, averages) about a search result beyond the matched entities themselves.

## When to use

Use this page when a `Criteria` query or API search request needs summary statistics or grouped counts alongside (or instead of) the raw result list.

## Key steps / config

Two aggregation families: `metric` (a calculated result — `avg`, `count`, `max`, `min`, `stats`, `sum`) and `bucket` (a list of keys, each optionally with nested aggregations — `entity`, `filter`, `terms`, `histogram`, `range`).

PHP example:

```php
$criteria = new Criteria();
$criteria->addAggregation(new AvgAggregation('avg-price', 'price'));
$result = $repository->search($criteria, $context);
$aggregation = $result->getAggregations()->get('avg-price');
$aggregation->getAvg();
```

Equivalent API request shape:

```json
{
    "aggregations": [
        { "name": "avg-price", "type": "avg", "field": "price" }
    ]
}
```

`TermsAggregation` accepts `limit`, `sort`, and a nested `aggregation`. `DateHistogramAggregation` accepts an interval of `minute`, `hour`, `day`, `week`, `month`, `quarter`, or `year`. `RangeAggregation`/`RangeFilter`-style ranges use `from` (>=) and `to` (<).

## Essential identifiers

`AvgAggregation`, `CountAggregation`, `MaxAggregation`, `MinAggregation`, `SumAggregation`, `StatsAggregation`, `TermsAggregation`, `FilterAggregation`, `EntityAggregation`, `DateHistogramAggregation` (`DateHistogramAggregation::PER_MONTH`), `RangeAggregation`; API `type` values: `avg`, `count`, `max`, `min`, `sum`, `stats`, `terms`, `filter`, `entity`, `histogram`, `range`.

## Gotchas

`filter` aggregation does not itself produce a result and can't be used alone — it only restricts the result of a nested aggregation, without affecting other aggregations or the overall search result.
