---
id: platform/dev/6.7/guides/development/troubleshooting/dal-reference/_index.md
title: DAL Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/dal-reference/
sourceHash: ee57262312cf0b5341144a56f5458464a257c2cb
codeCheckedAgainst: "6.7.15.1"
keywords: ["dal reference", "data abstraction layer", "dal", "fields", "field flags", "filters", "aggregations", "Required", "ApiAware", "Runtime", "WriteProtected", "criteria", "entity definition"]
summary: Index of the DAL reference section - field types, field flags, Criteria filters and aggregations - with the core namespaces each lives in.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/concepts/framework/data-abstraction-layer.md
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/_index.md
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md
---
## What it is

The entry page of the Data Abstraction Layer (DAL) reference: a lookup section for the building blocks of Shopware's entity model and query system - fields, field flags, filters and aggregations. Architectural background lives in the [DAL concepts guide](platform/dev/6.7/concepts/framework/data-abstraction-layer.md).

## When to use

Open it when writing an `EntityDefinition` or a `Criteria` query and you need the exact name of a field type, a flag, a filter type or an aggregation type, rather than the conceptual overview.

## Key steps / config

Pick the sub-reference for the building block you need:

- [Fields Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/_index.md) - available DAL field types and their storage characteristics. Classes live in `Shopware\Core\Framework\DataAbstractionLayer\Field`.
- [Flags Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md) - field flags such as `Required`, `ApiAware`, `Runtime`, `WriteProtected`. Classes live in `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag`.
- [Filters Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/filters-reference.md) - DAL filters such as `equals`, `range`, `multi`, `not`. Classes live in `Shopware\Core\Framework\DataAbstractionLayer\Search\Filter`; the API `type` strings are parsed by `QueryStringParser`.
- [Aggregations Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/aggregations-reference.md) - metric and bucket aggregations such as `avg`, `terms`, `filter`, `histogram`. Classes live in `Shopware\Core\Framework\DataAbstractionLayer\Search\Aggregation\Metric` and `...\Aggregation\Bucket`; API `type` strings are parsed by `AggregationParser`.

## Essential identifiers

- `Required`, `ApiAware`, `Runtime`, `WriteProtected` (field flags)
- Filter types `equals`, `range`, `multi`, `not`
- Aggregation types `avg`, `terms`, `filter`, `histogram`

## Gotchas

- Two classes are named `Required` in core: the field flag `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required` (for classic `EntityDefinition::defineFields()`) and the attribute `Shopware\Core\Framework\DataAbstractionLayer\Attribute\Required` (for attribute-based entities). Import the one matching your entity style.

## Code check (6.7.15.1)
- confirmed `Required` — field flag class extends `Flag` — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Required.php:8
- confirmed `Required` — separate attribute class for attribute entities — vendor/shopware/core/Framework/DataAbstractionLayer/Attribute/Required.php:9
- confirmed `ApiAware` — field flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:11
- confirmed `Runtime` — field flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/Runtime.php:12
- confirmed `WriteProtected` — field flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/WriteProtected.php:8
- confirmed `equals` — filter type parsed by QueryStringParser — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:68
- confirmed `multi` — filter type parsed by QueryStringParser — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/QueryStringParser.php:104
- confirmed `avg` — aggregation type parsed by AggregationParser — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:228
- confirmed `histogram` — aggregation type parsed by AggregationParser — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:298
- confirmed `terms` — aggregation type parsed by AggregationParser — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Parser/AggregationParser.php:331
