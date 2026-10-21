---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-modify-search-logic.md
title: Modify search logic
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-modify-search-logic.html
sourceHash: f38acef68ed3c688bba0f14bb7c9851c8eaf37d6
codeCheckedAgainst: "6.7.15.1"
keywords: ["advanced search", "SearchLogic", "AbstractSearchLogic", "TokenQueryBuilder", "ConfigurationLoader", "BoolQuery", "strictness", "advanced_search_config", "enableAdvancedSearchStrictnessPresets", "search decorator", "and/or search", "elasticsearch query"]
summary: Decorate Advanced Search SearchLogic to change the Elasticsearch query, and configure strictness-based term matching per sales channel.
lastBuilt: 2026-10-21
---
## What it is

`\Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic` (Commercial plugin) is the central place that builds the Elasticsearch query for Advanced Search. This page describes its steps, how to decorate it, and the strictness setting that controls how many search terms must match.

## When to use

You need to change how the Advanced Search query is built (extra conditions, different matching), or tune how strictly multi-word searches match.

## Key steps / config

How `SearchLogic` builds the query:

1. Loads all searchable fields of the search entity for the context's sales channel.
2. Tokenizes and filters the term, e.g. `The 2 QUICK Brown-Foxes jumped over the lazy dog's bone` becomes `[ The, 2, QUICK, Brown, Foxes, jumped, over, the, lazy, dog's, bone ]`.
3. Per token, `\Shopware\Commercial\AdvancedSearch\Domain\Search\TokenQueryBuilder::build` builds a bool "token query" against the searchable fields.
4. Combines the token queries by `AND`/`OR` depending on the configured search behavior.
5. The query is executed by `\Shopware\Elasticsearch\Framework\DataAbstractionLayer\ElasticsearchEntitySearcher`.

**Decorate** the search logic:

```php
$services->set(YourPluginNameSpace\Domain\Search\SearchLogicDecorator::class)
    ->decorate(Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic::class)
    ->args([
        service('.inner'),
        service(Shopware\Commercial\AdvancedSearch\Domain\Configuration\ConfigurationLoader::class),
    ]);
```

The decorator extends `Shopware\Commercial\AdvancedSearch\Domain\Search\AbstractSearchLogic` and implements:

- `build(EntityDefinition $definition, Criteria $criteria, Context $context): BoolQuery` (`OpenSearchDSL\Query\Compound\BoolQuery`) — the source example returns an empty `BoolQuery` unless `$context->getSource()` is a `SalesChannelApiSource`, optionally loads `$this->configurationLoader->load($salesChannelId)`, calls `$this->getDecorated()->build(...)` and adds its own logic.
- `getDecorated(): AbstractSearchLogic`

**Strictness** (since Commercial 7.11.0): a decimal `0.0`–`1.0` stored per sales channel in the `strictness` field of the `advanced_search_config` entity (default `1.0`).

- `0.0` — at least one term must match (`OR`); `1.0` — all terms (`AND`).
- In between: `ceil(numberOfTerms × strictness)` terms must match (`blue running shoes` with `0.5` → 2 terms).
- No feature flag is needed for `strictness` to take effect.
- Admin presets (`0`, `0.33`, `0.5`, `0.66`, `1`) in the **Search behavior** section appear when the system config `SwagCommercial.config.enableAdvancedSearchStrictnessPresets` is enabled; otherwise the legacy `AND`/`OR` toggle (maps to `1.0`/`0.0`) is shown.
- Any value can be set via the Admin API:

```
PATCH /api/advanced-search-config/{id}
{ "strictness": 0.5 }
```

## Essential identifiers

- `\Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic` / `AbstractSearchLogic`
- `\Shopware\Commercial\AdvancedSearch\Domain\Search\TokenQueryBuilder::build`
- `Shopware\Commercial\AdvancedSearch\Domain\Configuration\ConfigurationLoader`
- `advanced_search_config.strictness`, `/api/advanced-search-config/{id}`
- `SwagCommercial.config.enableAdvancedSearchStrictnessPresets`

## Gotchas

- The legacy `and_logic` flag of `advanced_search_config` is deprecated in favor of `strictness`.

## Version notes

- Strictness-based matching exists since Commercial 7.11.0.

## Code check (6.7.15.1)
- confirmed `SalesChannelApiSource::getSalesChannelId()` — used to load the sales-channel search config — vendor/shopware/core/Framework/Api/Context/SalesChannelApiSource.php:19
- confirmed `Context::getSource()` — returns the `ContextSource` checked in the decorator — vendor/shopware/core/Framework/Context.php:132
- confirmed `Criteria` — DAL criteria passed to `build()` — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- confirmed `EntityDefinition` — abstract DAL definition passed to `build()` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityDefinition.php:33
- unverified `ElasticsearchEntitySearcher` — lives in shopware/elasticsearch, outside the checked roots
- unverified `BoolQuery` — OpenSearchDSL library, out of scope
- unverified `SearchLogic` — Commercial plugin class, not in core/storefront
- unverified `TokenQueryBuilder::build` — Commercial plugin class, not in core/storefront
- unverified `advanced_search_config` — Commercial plugin entity, not in core/storefront
- unverified `SwagCommercial.config.enableAdvancedSearchStrictnessPresets` — Commercial plugin config, not in core/storefront
