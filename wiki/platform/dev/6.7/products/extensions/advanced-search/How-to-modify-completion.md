---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-modify-completion.md
title: Completion
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-modify-completion.html
sourceHash: eb362bd1c0403dc68ebfe8ffcc4ef2b030757a65
codeCheckedAgainst: "6.7.15.1"
keywords: ["advanced search", "completion", "autocomplete", "CompletionDefinitionEnrichment", "enrichMapping", "enrichData", "advanced_search.completion", "advanced_search.yaml", "AbstractElasticsearchDefinition", "elasticsearch", "search suggestions", "StringField"]
summary: Add Advanced Search completion keywords to a custom Elasticsearch definition via CompletionDefinitionEnrichment and the advanced_search.completion config.
lastBuilt: 2026-10-21
---
## What it is

How the Commercial Advanced Search builds search completions and how to add or change the completion keywords for your own Elasticsearch definition. Advanced Search does not use the native Elasticsearch completion (fixed order only, high storage size); it uses aggregations to find the most important word combinations for the search input.

## When to use

You have a custom Elasticsearch definition for Advanced Search and want its documents to contribute completion suggestions, or you want to change which fields of an entity feed the completion.

## Key steps / config

1. **Inject the enrichment service** `Shopware\Commercial\AdvancedSearch\Domain\Completion\CompletionDefinitionEnrichment` into your ES definition (a subclass of `AbstractElasticsearchDefinition`) and call it in `getMapping` and `fetch`:

```php
public function getMapping(Context $context): array
{
    return [
        '_source' => ['includes' => ['id']],
        'properties' => array_merge($properties, $this->completionDefinitionEnrichment->enrichMapping()),
    ];
}

public function fetch(array $ids, Context $context): array
{
    return $this->completionDefinitionEnrichment->enrichData($this->getEntityDefinition(), $documents);
}
```

The source's constructor takes `EntityDefinition $definition`, `Connection $connection`, `AbstractSearchLogic $searchLogic`, `CompletionDefinitionEnrichment $completionDefinitionEnrichment` and `array $languageAnalyzerMapping`.

2. **Choose the completion fields** with the container parameter `%advanced_search.completion%`, e.g. in `config/packages/advanced_search.yaml`:

```yaml
advanced_search:
    completion:
        your_custom_entity:
            - email
            - company
```

By default each of Shopware's ES definitions has a set of string fields configured as completion keywords. If no fields are configured for your definition, all `StringField`s of the entity definition are used.

3. **Full control** (static texts from files, a field from another data source): decorate `\Shopware\Commercial\AdvancedSearch\Domain\Completion\CompletionDefinitionEnrichment::enrichData` instead.

## Essential identifiers

- `Shopware\Commercial\AdvancedSearch\Domain\Completion\CompletionDefinitionEnrichment`
- `CompletionDefinitionEnrichment::enrichMapping()` / `CompletionDefinitionEnrichment::enrichData()`
- `%advanced_search.completion%` / `advanced_search.completion.<entity>` in `config/packages/advanced_search.yaml`
- `AbstractElasticsearchDefinition::getMapping()` / `::fetch()`

## Gotchas

- Without an `advanced_search.completion` entry for your entity, every `StringField` becomes a completion source.

## Code check (6.7.15.1)
- confirmed `StringField` — DAL string field type used as default completion source — vendor/shopware/core/Framework/DataAbstractionLayer/Field/StringField.php:12
- confirmed `EntityDefinition` — base class of the injected entity definition — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:33
- confirmed `Context` — passed to `getMapping`/`fetch` — vendor/shopware/core/Framework/Context.php:18
- unverified `AbstractElasticsearchDefinition` — lives in shopware/elasticsearch, outside the checked roots
- unverified `CompletionDefinitionEnrichment` — Commercial plugin class, not in core/storefront
- unverified `advanced_search.completion` — Commercial plugin parameter, not in core/storefront
