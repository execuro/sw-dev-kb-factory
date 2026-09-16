---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-define-your-custom-Elasticsearch-definition.md
title: Define a Custom Elasticsearch Definition
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-define-your-custom-Elasticsearch-definition.html
sourceHash: a02e04ee969bb501a641f14a8335704d1218f06a
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractElasticsearchDefinition", "AbstractSearchLogic", "SearchLogic", "shopware.es.definition", "advanced_search.supported_definition", "getMapping", "buildTermQuery", "fetch", "mapTranslatedField", "advanced search", "elasticsearch", "opensearch", "multilingual index", "custom entity search"]
summary: "Advanced Search: custom AbstractElasticsearchDefinition with multilingual mapping, tagged shopware.es.definition and advanced_search.supported_definition"
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md"]
---
## What it is

How to make a custom entity searchable through Advanced Search (part of the commercial `SwagCommercial` plugin) by writing your own Elasticsearch/OpenSearch definition. Since the multilingual index was introduced, one index holds all languages: each translatable field is an object with one sub-field per language ID, instead of a separate index per language (see the ADR [new language inheritance mechanism for OpenSearch](platform/dev/6.7/resources/references/adr/2023-04-11-new-language-inheritance-mechanism-for-opensearch.md)).

## When to use

- You want a custom entity to show up in Advanced Search results next to products, manufacturers and categories.
- You have a custom ES definition built for the old per-language indices and need to adapt its mapping to the multilingual structure.

## Key steps / config

1. Create a class extending `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition`. The source's constructor takes the entity's `EntityDefinition`, `Doctrine\DBAL\Connection` and `Shopware\Commercial\AdvancedSearch\Domain\Search\AbstractSearchLogic`.
2. `getMapping(Context $context): array`: load all languages (language ID to locale code). For each language, add a text-field config (`self::getTextFieldConfig()`). If the locale prefix appears in `languageAnalyzerMapping`, set that analyzer on the `search` sub-field. Map each translated field as an object whose `properties` are these per-language fields:
   ```php
   return [
       '_source' => ['includes' => ['id']],
       'properties' => [
           'name' => ['properties' => $languageFields],
           'description' => ['properties' => $languageFields],
       ],
   ];
   ```
3. `buildTermQuery(Context $context, Criteria $criteria): BoolQuery`: delegate to `$this->searchLogic->build($this->definition, $criteria, $context)`. By default this is `Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic`.
4. `fetch(array $ids, Context $context): array`: read rows with SQL. The source groups translations into a JSON array (`name`, `description`, `languageId`) with `GROUP_CONCAT(JSON_OBJECT(...))`. Build one document per ID: `'id' => $id, 'name' => $this->mapTranslatedField('name', true, ...$translations)`, and so on.
5. `getEntityDefinition(): EntityDefinition` returns the injected definition.
6. Register the service with both tags:
   ```php
   $services->set(YourPluginNameSpace\YourCustomElasticsearchDefinition::class)
       ->args([
           service(YourPluginNameSpace\YourCustomDefinition::class),
           service('Doctrine\DBAL\Connection'),
           service(Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic::class),
       ])
       ->tag('shopware.es.definition')
       ->tag('advanced_search.supported_definition');
   ```

## Essential identifiers

- `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition`
- `Shopware\Commercial\AdvancedSearch\Domain\Search\AbstractSearchLogic`, `Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic`
- `OpenSearchDSL\Query\Compound\BoolQuery`
- `Shopware\Core\Framework\Context`, `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition`, `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`
- Tags `shopware.es.definition`, `advanced_search.supported_definition`
- Methods `getMapping`, `buildTermQuery`, `fetch`, `getEntityDefinition`, `mapTranslatedField`, `getTextFieldConfig`

## Gotchas

- The source's snippet reads `$this->languageAnalyzerMapping` but never declares it in the constructor. The follow-up completion guide adds it as `private readonly array $languageAnalyzerMapping`.
- Both tags are needed. `shopware.es.definition` registers the definition for indexing. Advanced Search's search and suggest routes only query definitions tagged `advanced_search.supported_definition`.
- The Elasticsearch bundle (`vendor/shopware/elasticsearch`) and SwagCommercial are outside the verified code roots. Their class and method signatures come from the docs, not from a code check.

## Code check (6.7.13.0)
- confirmed `shopware.es.definition` — core's tagged-service contract map binds this tag to AbstractElasticsearchDefinition — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:97
- confirmed `Shopware\Core\Framework\Context` — core class exists — vendor/shopware/core/Framework/Context.php:17
- confirmed `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition` — abstract base class exists — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:33
- confirmed `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria` — class exists — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- unverified `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition` — lives in vendor/shopware/elasticsearch, out of scope
- unverified `AbstractSearchLogic` — SwagCommercial plugin, not in installed vendor roots
- unverified `advanced_search.supported_definition` — SwagCommercial tag, not in installed vendor roots
- unverified `OpenSearchDSL\Query\Compound\BoolQuery` — third-party library, out of scope
