---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-add-more-fields-to-product-search.md
title: Add more fields to product search
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-add-more-fields-to-product-search.html
sourceHash: 522cbb8bd349a4fc95263e235f85f289d9012adc
codeCheckedAgainst: "6.7.13.0"
keywords: ["ElasticsearchProductDefinition", "AbstractElasticsearchDefinition", "advanced_search_config_field", "AdvancedSearchConfigFieldDefinition", "MigrationStep", "es:mapping:update", "es:index", "database:create-migration", "searchable field", "custom search field", "decorate elasticsearch definition", "advanced search", "opensearch mapping"]
summary: "Advanced Search: add a searchable field by decorating ElasticsearchProductDefinition, updating ES mapping, and inserting advanced_search_config_field rows."
lastBuilt: 2026-09-15
---
## What it is

Three-step recipe for making an additional field searchable in the product (or any) Elasticsearch definition with the commercial Advanced Search extension. The example adds `prefixProductNumber` (first 5 characters of `productNumber`).

## When to use

You need to search on data not in the default product index mapping, e.g. a derived keyword field.

## Key steps / config

**1. Decorate the Elasticsearch definition**

```php
$services->set(YourPluginNameSpace\ElasticsearchProductDefinitionDecorator::class)
    ->decorate(Shopware\Elasticsearch\Product\ElasticsearchProductDefinition::class)
    ->args([
        service('.inner'),
        service(Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic::class),
    ]);
```

The decorator extends `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition` and delegates `getEntityDefinition()` and `buildTermQuery(Context, Criteria): BoolQuery` (`OpenSearchDSL\Query\Compound\BoolQuery`) to the inner service; it overrides:
- `getMapping(Context $context): array` — merges `'prefixProductNumber' => self::KEYWORD_FIELD` into `$mappings['properties']`.
- `fetch(array $ids, Context $context): array` — adds `'prefixProductNumber' => substr($document['productNumber'], 0, 5)` to each document.

**2. Push mapping and reindex**

- `bin/console es:mapping:update` — update index mappings (since 6.5.4.0).
- `bin/console es:index --no-queue` — only needed when products already carry data for the new field.

**3. Register the field in the search config via a migration**

`bin/console database:create-migration --name AddNewPrefixProductNumberFieldIntoProductAdvancedSearch --plugin YourPlugin`

```php
class Migration1692954529AddNewPrefixProductNumberFieldIntoProductAdvancedSearch extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1692954529; }

    public function update(Connection $connection): void
    {
        // for each id in advanced_search_config insert into
        // AdvancedSearchConfigFieldDefinition::ENTITY_NAME: id (Uuid::randomBytes()),
        // field 'prefixProductNumber', config_id, entity ProductDefinition::ENTITY_NAME,
        // tokenize 1, searchable 1, ranking 500, created_at (Defaults::STORAGE_DATE_TIME_FORMAT)
    }
}
```

Run the migration by reinstalling or updating the plugin.

## Essential identifiers

- `Shopware\Elasticsearch\Product\ElasticsearchProductDefinition`
- `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition`
- `Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic`
- `Shopware\Commercial\AdvancedSearch\Entity\AdvancedSearchConfig\Aggregate\AdvancedSearchConfigFieldDefinition`
- `Shopware\Core\Framework\Migration\MigrationStep`
- `advanced_search_config`, `advanced_search_config_field`
- `es:mapping:update`, `es:index --no-queue`, `database:create-migration`

## Gotchas

- Mapping change alone does not make the field searchable; a row per `advanced_search_config` entry in `advanced_search_config_field` is required.
- The field name must match across mapping, fetched document and config row (`prefixProductNumber`); the source's intro text calls it `productNumberPrefix`, but its code uses `prefixProductNumber`.

## Code check (6.7.13.0)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be declared — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, takes `Connection` — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `database:create-migration` — core command name — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:18
- confirmed `plugin` — option of database:create-migration (value required) — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:40
- confirmed `Defaults::STORAGE_DATE_TIME_FORMAT` — `Y-m-d H:i:s.v` — vendor/shopware/core/Defaults.php:35
- confirmed `ProductDefinition::ENTITY_NAME` — value `product` — vendor/shopware/core/Content/Product/ProductDefinition.php:85
- confirmed `Uuid::randomBytes()` — static binary id generator — vendor/shopware/core/Framework/Uuid/Uuid.php:37
- unverified `AbstractElasticsearchDefinition` — shopware/elasticsearch package, outside the checked roots
- unverified `es:mapping:update` — shopware/elasticsearch package, outside the checked roots
- unverified `AdvancedSearchConfigFieldDefinition` — commercial extension, out of scope
