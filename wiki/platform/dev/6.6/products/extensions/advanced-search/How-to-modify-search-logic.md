---
id: platform/dev/6.6/products/extensions/advanced-search/How-to-modify-search-logic.md
title: Modify search logic
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/advanced-search/How-to-modify-search-logic.html"
sourceHash: 366eab766cd9608eb16699cbab70ea6d7da5c0b7
keywords: ["SearchLogic", "AbstractSearchLogic", "TokenQueryBuilder", "ElasticsearchEntitySearcher", "SearchLogicDecorator", "ConfigurationLoader", "tokenized search term", "bool query", "decorator pattern"]
summary: "How Shopware\\Commercial\\AdvancedSearch\\Domain\\Search\\SearchLogic builds Elasticsearch queries and how to decorate it to add custom logic."
lastBuilt: "2026-09-15"
---
## What it is

This page documents `\Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic`, the central class that builds the Elasticsearch query for Advanced Search.

## When to use

Use when custom search behavior needs to be injected into how search terms are converted into Elasticsearch queries.

## Key steps / config

`SearchLogic` process:
1. Loads all searchable fields for the search entity and the current sales channel.
2. Tokenizes and filters the search term into tokens (e.g. `The 2 QUICK Brown-Foxes jumped over the lazy dog's bone` becomes `[The, 2, QUICK, Brown, Foxes, jumped, over, the, lazy, dog's, bone]`).
3. Each token forms a bool query against the loaded searchable fields, via `\Shopware\Commercial\AdvancedSearch\Domain\Search\TokenQueryBuilder::build`.
4. Token queries are combined with `AND`/`OR` per configured search behavior.
5. The final query is used by `\Shopware\Elasticsearch\Framework\DataAbstractionLayer\ElasticsearchEntitySearcher`.

To modify, decorate the class:

```xml
<service id="YourPluginNameSpace\Domain\Search\SearchLogicDecorator" decorates="Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic">
    <argument type="service" id=".inner"/>
    <argument type="service" id="Shopware\Commercial\AdvancedSearch\Domain\Configuration\ConfigurationLoader"/>
</service>
```

```php
class SearchLogicDecorator extends AbstractSearchLogic
{
    public function build(EntityDefinition $definition, Criteria $criteria, Context $context): BoolQuery
    {
        // load sales channel config via ConfigurationLoader, call getDecorated()->build(...)
    }

    public function getDecorated(): AbstractSearchLogic { /* ... */ }
}
```

## Essential identifiers

- `\Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic`
- `AbstractSearchLogic`
- `\Shopware\Commercial\AdvancedSearch\Domain\Search\TokenQueryBuilder::build`
- `\Shopware\Elasticsearch\Framework\DataAbstractionLayer\ElasticsearchEntitySearcher`
- `\Shopware\Commercial\AdvancedSearch\Domain\Configuration\ConfigurationLoader`
