---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-add-more-fields-to-product-search.md
title: Add more fields to product search
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-add-more-fields-to-product-search.html
sourceHash: 522cbb8bd349a4fc95263e235f85f289d9012adc
codeCheckedAgainst: "6.7.15.1"
keywords: ["searchable field", "ElasticsearchProductDefinition", "AbstractElasticsearchDefinition", "advanced_search_config_field", "AdvancedSearchConfigFieldDefinition", "es:mapping:update", "es:index", "database:create-migration", "MigrationStep", "decorate elasticsearch definition", "product search", "custom search field", "opensearch mapping"]
summary: "Add a searchable product field in Advanced Search: decorate the ES product definition, update mapping, insert advanced_search_config_field rows."
lastBuilt: 2026-10-21
---
## What it is

A three-step recipe for making an additional field searchable in the commercial Advanced Search extension, on the product or any other Elasticsearch definition. The example adds a field `prefixProductNumber` holding the first 5 characters of `productNumber`.

## When to use

When a value that is not part of the default product index (a derived or custom field) must be matched by storefront search/suggest.

## Key steps / config

**1. Decorate the Elasticsearch definition** to extend the mapping and the indexed documents:

```php
$services->set(YourPluginNameSpace\ElasticsearchProductDefinitionDecorator::class)
    ->decorate(Shopware\Elasticsearch\Product\ElasticsearchProductDefinition::class)
    ->args([service('.inner'), service(Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic::class)]);
```

The decorator extends `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition` and delegates `getEntityDefinition()` and `buildTermQuery(Context, Criteria): BoolQuery` to the inner service. In `getMapping()` it merges `'prefixProductNumber' => self::KEYWORD_FIELD` into `$mappings['properties']`; in `fetch(array $ids, Context $context)` it adds `'prefixProductNumber' => substr($document['productNumber'], 0, 5)` to every document.

**2. Push the mapping and reindex:**

- `bin/console es:mapping:update` (available since 6.5.4.0)
- `bin/console es:index --no-queue` (only needed if products already carry data for the new field)

**3. Register the field in the search config** with a plugin migration:

- `bin/console database:create-migration --name AddNewPrefixProductNumberFieldIntoProductAdvancedSearch --plugin YourPlugin`

```php
class Migration1692954529AddNewPrefixProductNumberFieldIntoProductAdvancedSearch extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1692954529; }

    public function update(Connection $connection): void
    {
        // for each id in advanced_search_config: insert into
        // AdvancedSearchConfigFieldDefinition::ENTITY_NAME
        // ['id' => Uuid::randomBytes(), 'field' => 'prefixProductNumber', 'config_id' => ...,
        //  'entity' => ProductDefinition::ENTITY_NAME, 'tokenize' => 1, 'searchable' => 1,
        //  'ranking' => 500, 'created_at' => (new \DateTime())->format(Defaults::STORAGE_DATE_TIME_FORMAT)]
    }
}
```

Run the migration by reinstalling or updating the plugin.

## Essential identifiers

- `Shopware\Elasticsearch\Product\ElasticsearchProductDefinition`, `Shopware\Elasticsearch\Framework\AbstractElasticsearchDefinition`
- `Shopware\Commercial\AdvancedSearch\Domain\Search\SearchLogic`
- `Shopware\Commercial\AdvancedSearch\Entity\AdvancedSearchConfig\Aggregate\AdvancedSearchConfigFieldDefinition`
- `Shopware\Core\Framework\Migration\MigrationStep` (`getCreationTimestamp()`, `update()`)
- Tables `advanced_search_config`, `advanced_search_config_field`
- `es:mapping:update`, `es:index --no-queue`, `database:create-migration`

## Gotchas

- The source prose names the field `productNumberPrefix`, but every code sample uses `prefixProductNumber`; the mapping key, document key and `field` column must match.
- One `advanced_search_config_field` row is needed per `advanced_search_config` row (each sales channel has its own config).
- The sample service definition passes `SearchLogic` as a second argument, while the sample decorator constructor only accepts the decorated definition.

## Code check (6.7.15.1)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be implemented — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, takes `Connection` — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `database:create-migration` — command name — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:19
- confirmed `plugin` — option of database:create-migration — vendor/shopware/core/Framework/Migration/Command/CreateMigrationCommand.php:40
- confirmed `Defaults::STORAGE_DATE_TIME_FORMAT` — value `Y-m-d H:i:s.v` — vendor/shopware/core/Defaults.php:35
- confirmed `ProductDefinition::ENTITY_NAME` — `product` — vendor/shopware/core/Content/Product/ProductDefinition.php:85
- confirmed `Uuid::randomBytes()` — static helper — vendor/shopware/core/Framework/Uuid/Uuid.php:37
- unverified `ElasticsearchProductDefinition` — shopware/elasticsearch package, outside the checked roots
- unverified `es:mapping:update` — shopware/elasticsearch package, outside the checked roots
- unverified `AdvancedSearchConfigFieldDefinition` — SwagCommercial plugin, out of scope
