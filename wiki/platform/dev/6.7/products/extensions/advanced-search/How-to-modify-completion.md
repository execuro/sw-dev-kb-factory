---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-modify-completion.md
title: Completion
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-modify-completion.html
sourceHash: eb362bd1c0403dc68ebfe8ffcc4ef2b030757a65
codeCheckedAgainst: "6.7.13.0"
keywords: ["CompletionDefinitionEnrichment", "enrichMapping", "enrichData", "advanced_search.completion", "config/packages/advanced_search.yaml", "AbstractElasticsearchDefinition", "StringField", "completion", "autocomplete", "search suggestions", "advanced search", "elasticsearch aggregations"]
summary: "Advanced Search completion: inject CompletionDefinitionEnrichment into an ES definition and configure completion fields via advanced_search.completion"
lastBuilt: 2026-09-15
---
## What it is

Advanced Search (SwagCommercial) does not use Elasticsearch's built-in completion suggester, which only supports a fixed order and needs a lot of storage. Instead it uses aggregations to find the most important word combinations for the search input. This page shows how to add completion keywords to your own Elasticsearch definition and how to configure which fields feed them.

## When to use

- A custom Elasticsearch definition should contribute completion keywords to the suggest dropdown.
- You want to change which fields of an entity serve as completion keywords.
- You need completion keywords from another source (static texts, external data).

## Key steps / config

1. Inject `Shopware\Commercial\AdvancedSearch\Domain\Completion\CompletionDefinitionEnrichment` into your ES definition, alongside the constructor arguments from the custom definition guide. The source's constructor also declares `private readonly array $languageAnalyzerMapping`.
2. In `getMapping()`, merge the completion mapping into the properties:
   ```php
   return [
       '_source' => ['includes' => ['id']],
       'properties' => array_merge($properties, $this->completionDefinitionEnrichment->enrichMapping()),
   ];
   ```
3. In `fetch()`, enrich the documents before returning them:
   `return $this->completionDefinitionEnrichment->enrichData($this->getEntityDefinition(), $documents);`
4. Configure the completion fields per entity through the container parameter `%advanced_search.completion%`, e.g. in `config/packages/advanced_search.yaml`:
   ```yaml
   advanced_search:
       completion:
           your_custom_entity:
               - email
               - company
   ```
5. For full control, decorate the `CompletionDefinitionEnrichment` service and override `enrichData`.

## Essential identifiers

- `Shopware\Commercial\AdvancedSearch\Domain\Completion\CompletionDefinitionEnrichment`
- `CompletionDefinitionEnrichment::enrichMapping()`, `CompletionDefinitionEnrichment::enrichData()`
- Parameter `%advanced_search.completion%`, config file `config/packages/advanced_search.yaml`

## Gotchas

- If no completion fields are configured for a definition, every `StringField` of that entity definition is used as a completion keyword.
- Each of Shopware's own ES definitions already ships a default set of string fields. Adding config for those entities changes the defaults.

## Code check (6.7.13.0)
- confirmed `Shopware\Core\Framework\DataAbstractionLayer\Field\StringField` — DAL string field class used as default completion source — vendor/shopware/core/Framework/DataAbstractionLayer/Field/StringField.php:9
- confirmed `Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition` — type returned by getEntityDefinition() — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:33
- unverified `CompletionDefinitionEnrichment` — SwagCommercial plugin, not in installed vendor roots
- unverified `CompletionDefinitionEnrichment::enrichData()` — SwagCommercial plugin, not in installed vendor roots
- unverified `advanced_search.completion` — SwagCommercial container parameter, not in installed vendor roots
- unverified `AbstractElasticsearchDefinition` — vendor/shopware/elasticsearch, out of scope
