---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/_index.md
relatedPages:
  - platform/dev/6.7/concepts/framework/data-abstraction-layer.md
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/_index.md
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md
sourceHash: ee57262312cf0b5341144a56f5458464a257c2cb
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/
title: DAL Reference
version: "6.7"
versions:
  - "6.7"
keywords: ["dal", "data abstraction layer", "dal reference", "fields", "field flags", "Required", "ApiAware", "Runtime", "WriteProtected", "filters", "equals", "range", "aggregations", "terms", "histogram"]
summary: "Index of the DAL reference: field types, field flags (Required, ApiAware, Runtime, WriteProtected), filters and aggregations lookup pages."
lastBuilt: 2026-09-15
---
## What it is

Landing page of the Data Abstraction Layer (DAL) reference: lookup pages for the building blocks of Shopware's entity model and query system — fields, flags, filters and aggregations. Architectural background lives in the [DAL concepts guide](platform/dev/6.7/concepts/framework/data-abstraction-layer.md).

## When to use

When defining entity fields or querying via `Criteria`/the API and you need the exact name of a field type, flag, filter type or aggregation type.

## Key steps / config

Section resources:

- [Fields Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/_index.md) — available DAL field types and their storage characteristics.
- [Flags Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md) — field flags such as `Required`, `ApiAware`, `Runtime`, `WriteProtected`.
- [Filters Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md) — DAL filters such as `equals`, `range`, `multi`, `not`.
- [Aggregations Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md) — metric and bucket aggregations such as `avg`, `terms`, `filter`, `histogram`.

## Essential identifiers

- Flags: `Required`, `ApiAware`, `Runtime`, `WriteProtected` (namespace `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag`)
- Filter types: `equals`, `range`, `multi`, `not`
- Aggregation types: `avg`, `terms`, `filter`, `histogram`

## Code check (6.7.13.0)
- confirmed `Required` — field flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Required.php:8
- confirmed `ApiAware` — field flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:11
- confirmed `Runtime` — field flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Runtime.php:12
- confirmed `WriteProtected` — field flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/WriteProtected.php:8
- confirmed `equals` — API filter type parsed by QueryStringParser — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:55
- confirmed `not` — API filter type — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:77
- confirmed `multi` — API filter type — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:90
- confirmed `range` — API filter type — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:131
- confirmed `histogram` — API aggregation type — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:284
- confirmed `terms` — API aggregation type — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:317
