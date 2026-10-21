---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-configure-searchable-fields.md
title: Configure Searchable Fields
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-configure-searchable-fields.html
sourceHash: 98cdb9596fac0f1ba4f1ccca6d90a01c756dcd68
codeCheckedAgainst: "6.7.15.1"
keywords: ["searchable fields", "advanced_search_config", "advanced_search_config_field", "AdvancedSearchConfigDefinition", "AdvancedSearchConfigFieldDefinition", "SalesChannelCreatedSubscriber", "product_search_config", "product_search_config_field", "search configuration", "per sales channel search", "advanced search migration", "suggest"]
summary: "Advanced Search keeps searchable entities/fields per sales channel in advanced_search_config(_field); seed them with a migration and subscriber."
lastBuilt: 2026-10-21
---
## What it is

Describes where the commercial Advanced Search extension stores its search configuration: search entities in the `advanced_search_config` table and their searchable fields in `advanced_search_config_field`. These fields are used to build the search query for search and suggest requests from the client.

## When to use

When you need a custom search configuration (which entities and fields are searchable) for Advanced Search, or need new sales channels to receive such a configuration.

## Key steps / config

1. Model: the approach mirrors core's `product_search_config` / `product_search_config_field`, but configuration is per **sales channel** instead of per language — each sales channel has its own search config.
2. Entity definitions to refer to:
   - `\Shopware\Commercial\AdvancedSearch\Entity\AdvancedSearchConfig\AdvancedSearchConfigDefinition`
   - `\Shopware\Commercial\AdvancedSearch\Entity\AdvancedSearchConfig\Aggregate\AdvancedSearchConfigFieldDefinition`
3. Add a migration that inserts the configuration rows. The reference implementation for default config of product, manufacturer and category entities is `\Shopware\Commercial\Migration\Migration1680751315SWAGAdvancedSearch_AddAdvancedSearchConfigurationDefaults`.
4. To add the configuration for newly created sales channels as well, follow `\Shopware\Commercial\AdvancedSearch\Subscriber\SalesChannelCreatedSubscriber`.

## Essential identifiers

- Tables `advanced_search_config`, `advanced_search_config_field`
- `\Shopware\Commercial\AdvancedSearch\Entity\AdvancedSearchConfig\AdvancedSearchConfigDefinition`
- `\Shopware\Commercial\AdvancedSearch\Entity\AdvancedSearchConfig\Aggregate\AdvancedSearchConfigFieldDefinition`
- `\Shopware\Commercial\Migration\Migration1680751315SWAGAdvancedSearch_AddAdvancedSearchConfigurationDefaults`
- `\Shopware\Commercial\AdvancedSearch\Subscriber\SalesChannelCreatedSubscriber`

## Gotchas

- Unlike core's product search config, the configuration is keyed by sales channel, not language; a configuration seeded by migration does not cover sales channels created later unless you also handle sales channel creation (see the subscriber reference).

## Code check (6.7.15.1)
- confirmed `product_search_config` — core per-language counterpart entity — vendor/shopware/core/Content/Product/Aggregate/ProductSearchConfig/ProductSearchConfigDefinition.php:28
- confirmed `product_search_config_field` — core per-language field entity — vendor/shopware/core/Content/Product/Aggregate/ProductSearchConfigField/ProductSearchConfigFieldDefinition.php:25
- unverified `AdvancedSearchConfigDefinition` — SwagCommercial plugin, outside core/storefront/administration roots
- unverified `AdvancedSearchConfigFieldDefinition` — SwagCommercial plugin, out of scope
- unverified `Migration1680751315SWAGAdvancedSearch_AddAdvancedSearchConfigurationDefaults` — SwagCommercial plugin, out of scope
- unverified `SalesChannelCreatedSubscriber` — SwagCommercial plugin, out of scope
