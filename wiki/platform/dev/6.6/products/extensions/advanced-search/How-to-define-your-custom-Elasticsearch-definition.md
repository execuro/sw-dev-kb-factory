---
id: platform/dev/6.6/products/extensions/advanced-search/How-to-define-your-custom-Elasticsearch-definition.md
title: Define a custom Elasticsearch Definition
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/advanced-search/How-to-define-your-custom-Elasticsearch-definition.html"
sourceHash: b67c62647cd7ef579cf4ec891543eb1e7b4a242f
keywords: ["AbstractElasticsearchDefinition", "getMapping", "buildTermQuery", "fetch", "getEntityDefinition", "shopware.es.definition", "advanced_search.supported_definition", "multilingual index", "AbstractSearchLogic", "custom entity definition", "language fields"]
summary: "How to write a custom Elasticsearch definition class for the multilingual index and register it with shopware.es.definition tags."
lastBuilt: "2026-09-15"
---
## What it is

This page documents defining a custom Elasticsearch definition class for Advanced Search, adapted for the multilingual index (each index holds multiple language-based fields instead of one index per language).

## When to use

Use when a custom entity needs its own Elasticsearch mapping and search behavior integrated with Advanced Search.

## Key steps / config

Extend `AbstractElasticsearchDefinition` and implement:

```php
class YourCustomElasticsearchDefinition extends AbstractElasticsearchDefinition
{
    public function getMapping(Context $context): array { /* language-aware properties */ }
    public function buildTermQuery(Context $context, Criteria $criteria): BoolQuery { /* uses SearchLogic */ }
    public function fetch(array $ids, Context $context): array { /* fetch + translate */ }
    public function getEntityDefinition(): EntityDefinition { /* return $this->definition */ }
}
```

`getMapping()` builds per-language fields from the `language`/`locale` tables and applies `languageAnalyzerMapping` where configured. `buildTermQuery()` delegates to `Shopware\Commercial\AdvancedSearch\Domain\Search\AbstractSearchLogic`. `fetch()` reads raw data and maps translated fields.

Register the service with both tags:

```xml
<service id="YourPluginNameSpace\YourCustomElasticsearchDefinition">
    <argument type="service" id="YourPluginNameSpace\YourCustomDefinition"/>
    <argument type="service" id="Doctrine\DBAL\Connection"/>
    <argument type="service" id="Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic"/>
    <tag name="shopware.es.definition"/>
    <tag name="advanced_search.supported_definition"/>
</service>
```

## Essential identifiers

- `AbstractElasticsearchDefinition`
- `Shopware\Commercial\AdvancedSearch\Domain\Search\AbstractSearchLogic`
- Tags: `shopware.es.definition`, `advanced_search.supported_definition`
- Methods: `getMapping()`, `buildTermQuery()`, `fetch()`, `getEntityDefinition()`
