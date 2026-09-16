---
id: platform/dev/6.6/products/extensions/advanced-search/How-to-modify-completion.md
title: Completion
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/advanced-search/How-to-modify-completion.html"
sourceHash: eb362bd1c0403dc68ebfe8ffcc4ef2b030757a65
keywords: ["CompletionDefinitionEnrichment", "enrichMapping", "enrichData", "advanced_search.completion", "completion keywords", "advanced_search.yaml", "aggregations", "StringField", "search suggest"]
summary: "How Advanced Search builds completion suggestions via aggregations, and how to add/modify completion keywords per definition."
lastBuilt: "2026-09-15"
---
## What it is

This page documents Advanced Search's completion feature, which uses aggregations instead of the default Elasticsearch completion (which only supports a fixed order and has high storage cost) to find important word combinations for search input.

## When to use

Use when adding completion/autosuggest keywords to a custom Elasticsearch definition, or changing which fields are used for completion.

## Key steps / config

Inject `Shopware\Commercial\AdvancedSearch\Domain\Completion\CompletionDefinitionEnrichment` into your ES definition and call its enrich methods:

```php
class YourCustomElasticsearchDefinition extends AbstractElasticsearchDefinition
{
    public function __construct(
        private readonly CompletionDefinitionEnrichment $completionDefinitionEnrichment,
        // ...
    ) {}

    public function getMapping(Context $context): array
    {
        return [
            'properties' => array_merge($properties, $this->completionDefinitionEnrichment->enrichMapping()),
        ];
    }

    public function fetch(array $ids, Context $context): array
    {
        return $this->completionDefinitionEnrichment->enrichData($this->getEntityDefinition(), $documents);
    }
}
```

By default, each ES definition uses a set of `string` fields as completion keywords, controlled by the `%advanced_search.completion%` parameter; if a definition's fields aren't set there, all `StringField`s of the definition are used. Configure in `config/packages/advanced_search.yaml`:

```yaml
advanced_search:
    completion:
        your_custom_entity:
            - email
            - company
```

For more control (static texts from files, other data sources), decorate `\Shopware\Commercial\AdvancedSearch\Domain\Completion\CompletionDefinitionEnrichment::enrichData`.

## Essential identifiers

- `Shopware\Commercial\AdvancedSearch\Domain\Completion\CompletionDefinitionEnrichment`
- `enrichMapping()`, `enrichData()`
- `advanced_search.completion` config key
