---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-define-your-custom-Elasticsearch-definition.md
title: Define a Custom Elasticsearch Definition
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-define-your-custom-Elasticsearch-definition.html
sourceHash: a02e04ee969bb501a641f14a8335704d1218f06a
codeCheckedAgainst: "6.7.15.1"
keywords: ["custom elasticsearch definition", "AbstractElasticsearchDefinition", "shopware.es.definition", "advanced_search.supported_definition", "AbstractSearchLogic", "SearchLogic", "multilingual index", "language fields", "mapTranslatedField", "getTextFieldConfig", "buildTermQuery", "opensearch mapping", "custom entity search"]
summary: "Custom AbstractElasticsearchDefinition for the Advanced Search multilingual index, tagged shopware.es.definition and advanced_search.supported_definition."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md"]
---
## What it is

How to write an Elasticsearch definition for your own entity that works with the commercial Advanced Search multilingual index. Previously each system language had its own index; now one index holds language-based sub-fields per translated field (see the [ADR on the language inheritance mechanism](platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md)), so custom definitions must adapt their mapping.

## When to use

When a custom entity should be indexed and searched through Advanced Search, or an existing custom definition must be migrated to the multilingual mapping structure.

## Key steps / config

1. Extend `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition`; constructor takes the `EntityDefinition`, the DBAL `Connection` and `Shopware\Commercial\AdvancedSearch\Domain\Search\AbstractSearchLogic`.
2. `getMapping(Context $context): array` — load language ids and locale codes, build one `self::getTextFieldConfig()` entry per language id, and set `fields.search.analyzer` from the language analyzer mapping for the locale prefix. Shape:

```php
return [
    '_source' => ['includes' => ['id']],
    'properties' => [
        'name'        => ['properties' => $languageFields], // keyed by language id
        'description' => ['properties' => $languageFields],
    ],
];
```

3. `buildTermQuery(Context $context, Criteria $criteria): BoolQuery` — delegate to `$this->searchLogic->build($this->definition, $criteria, $context)` (default logic: `Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic`).
4. `fetch(array $ids, Context $context): array` — load rows plus a JSON array of translations (`name`, `description`, `languageId`), and build documents with `'name' => $this->mapTranslatedField('name', true, ...$translations)` (same for `description`).
5. `getEntityDefinition(): EntityDefinition` — return the injected definition.
6. Register the service with both tags:

```php
$services->set(YourPluginNameSpace\YourCustomElasticsearchDefinition::class)
    ->args([service(YourPluginNameSpace\YourCustomDefinition::class), service('Doctrine\DBAL\Connection'),
        service(Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic::class)])
    ->tag('shopware.es.definition')
    ->tag('advanced_search.supported_definition');
```

## Essential identifiers

- `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition`
- `Shopware\Commercial\AdvancedSearch\Domain\Search\AbstractSearchLogic`, `Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic`
- Tags `shopware.es.definition`, `advanced_search.supported_definition`
- Members `getMapping()`, `buildTermQuery()`, `fetch()`, `getEntityDefinition()`; helpers `getTextFieldConfig()`, `mapTranslatedField()`

## Gotchas

- The source sample reads `$this->languageAnalyzerMapping` without declaring or injecting it; your class must provide that mapping itself.
- Core tags `shopware.es.definition` services against `AbstractElasticsearchDefinition`, so the class must extend that base.

## Code check (6.7.15.1)
- confirmed `shopware.es.definition` — tag contract requires `AbstractElasticsearchDefinition` — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:105
- confirmed `AbstractElasticsearchDefinition` — FQCN `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition` — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:66
- unverified `AbstractElasticsearchDefinition::getTextFieldConfig()` — defined in shopware/elasticsearch package, outside the checked roots
- unverified `AbstractElasticsearchDefinition::mapTranslatedField()` — shopware/elasticsearch package, outside the checked roots
- unverified `advanced_search.supported_definition` — SwagCommercial tag, out of scope
- unverified `AbstractSearchLogic` — SwagCommercial plugin, out of scope
- unverified `SearchLogic` — SwagCommercial plugin, out of scope
