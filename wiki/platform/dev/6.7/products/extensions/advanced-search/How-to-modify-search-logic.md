---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-modify-search-logic.md
title: Modify search logic
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-modify-search-logic.html
sourceHash: f38acef68ed3c688bba0f14bb7c9851c8eaf37d6
codeCheckedAgainst: "6.7.13.0"
keywords: ["SearchLogic", "AbstractSearchLogic", "TokenQueryBuilder", "ConfigurationLoader", "ElasticsearchEntitySearcher", "advanced_search_config", "strictness", "and_logic", "SwagCommercial.config.enableAdvancedSearchStrictnessPresets", "search behavior", "decorate search query", "advanced search"]
summary: "Advanced Search: decorate SearchLogic (AbstractSearchLogic::build) to change the ES bool query; strictness 0.0-1.0 per sales channel replaces and_logic"
lastBuilt: 2026-09-15
---
## What it is

`Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic` (SwagCommercial) builds the Elasticsearch query for Advanced Search:

1. It loads the searchable fields of the requested entity for the context's sales channel.
2. It tokenizes the search term. For example, `The 2 QUICK Brown-Foxes jumped over the lazy dog's bone` becomes `[ The, 2, QUICK, Brown, Foxes, jumped, over, the, lazy, dog's, bone ]`.
3. For each token, `\Shopware\Commercial\AdvancedSearch\Domain\Search\TokenQueryBuilder::build` builds a bool "token query" across those fields.
4. It combines the token queries with `AND`/`OR` according to the configured search behavior.
5. `\Shopware\Elasticsearch\Framework\DataAbstractionLayer\ElasticsearchEntitySearcher` runs the resulting query.

## When to use

- You want to change or extend how Advanced Search builds its query, e.g. add boosts or filters.
- You want to tune how many search terms must match (strictness).

## Key steps / config

1. Register a decorator:
   ```php
   $services->set(YourPluginNameSpace\Domain\Search\SearchLogicDecorator::class)
       ->decorate(Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic::class)
       ->args([
           service('.inner'),
           service(Shopware\Commercial\AdvancedSearch\Domain\Configuration\ConfigurationLoader::class),
       ]);
   ```
2. Extend `AbstractSearchLogic` and implement both methods:
   ```php
   class SearchLogicDecorator extends AbstractSearchLogic
   {
       public function build(EntityDefinition $definition, Criteria $criteria, Context $context): BoolQuery { /* ... */ }
       public function getDecorated(): AbstractSearchLogic { return $this->decorated; }
   }
   ```
   In `build()`, return an empty `BoolQuery` when `$context->getSource()` is not a `SalesChannelApiSource`. Optionally load the sales channel's search config with `$this->configurationLoader->load($salesChannelId)`. Call `$this->getDecorated()->build(...)` and add your own logic to the returned bool query.
3. Strictness (since Commercial 7.11.0): set the `strictness` field (decimal `0.0`–`1.0`, default `1.0`) on the per-sales-channel `advanced_search_config` entity. `0.0` means any term matches (like `OR`), `1.0` means all terms (like `AND`). Values in between require `ceil(numberOfTerms × strictness)` matching terms. The field takes effect without a feature flag. Set it through the Admin API:
   ```
   PATCH /api/advanced-search-config/{id}
   { "strictness": 0.5 }
   ```
4. To show strictness presets (`0`, `0.33`, `0.5`, `0.66`, `1`) in the Administration's **Search behavior** section, enable the system config `SwagCommercial.config.enableAdvancedSearchStrictnessPresets`. Otherwise the legacy `AND`/`OR` toggle is shown, which maps to `1.0`/`0.0`.

## Essential identifiers

- `Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic`, `AbstractSearchLogic::build()`, `AbstractSearchLogic::getDecorated()`
- `Shopware\Commercial\AdvancedSearch\Domain\Search\TokenQueryBuilder`
- `Shopware\Commercial\AdvancedSearch\Domain\Configuration\ConfigurationLoader`
- `Shopware\Core\Framework\Api\Context\SalesChannelApiSource`
- Entity `advanced_search_config`, field `strictness`; system config `SwagCommercial.config.enableAdvancedSearchStrictnessPresets`

## Gotchas

- The legacy `and_logic` flag on `advanced_search_config` is deprecated in favor of `strictness`.
- Example: `blue running shoes` (3 terms) with strictness `0.5` requires 2 matching terms.

## Version notes

- `strictness` exists since Commercial 7.11.0.

## Code check (6.7.13.0)
- confirmed `Shopware\Core\Framework\Api\Context\SalesChannelApiSource` — class exists — vendor/shopware/core/Framework/Api/Context/SalesChannelApiSource.php:9
- confirmed `SalesChannelApiSource::getSalesChannelId()` — used by the decorator — vendor/shopware/core/Framework/Api/Context/SalesChannelApiSource.php:19
- confirmed `Context::getSource()` — returns ContextSource — vendor/shopware/core/Framework/Context.php:131
- confirmed `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria` — build() parameter type — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:25
- unverified `AbstractSearchLogic` — SwagCommercial plugin, not in installed vendor roots
- unverified `ConfigurationLoader` — SwagCommercial plugin, not in installed vendor roots
- unverified `ElasticsearchEntitySearcher` — vendor/shopware/elasticsearch, out of scope
- unverified `SwagCommercial.config.enableAdvancedSearchStrictnessPresets` — not found in installed vendor roots (commercial config)
- unverified `advanced_search_config` — commercial entity, not in installed vendor roots
