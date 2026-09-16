---
id: platform/dev/6.7/products/extensions/advanced-search/How-to-configure-searchable-fields.md
title: Configure Searchable Fields
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/advanced-search/How-to-configure-searchable-fields.html
sourceHash: 98cdb9596fac0f1ba4f1ccca6d90a01c756dcd68
codeCheckedAgainst: "6.7.13.0"
keywords: ["advanced_search_config", "advanced_search_config_field", "AdvancedSearchConfigDefinition", "AdvancedSearchConfigFieldDefinition", "SalesChannelCreatedSubscriber", "product_search_config", "product_search_config_field", "searchable fields", "search configuration per sales channel", "advanced search", "search migration"]
summary: "Advanced Search stores searchable fields per sales channel in advanced_search_config/_field tables; add them via migration, mirroring product_search_config."
lastBuilt: 2026-09-15
---
## What it is

In the commercial Advanced Search extension, search entities and their searchable fields are stored in the `advanced_search_config` and `advanced_search_config_field` tables. These fields build the search query for search/suggest requests from the client.

## When to use

You want to change which entity fields are searchable in Advanced Search, or provide a default search configuration for product, manufacturer and category, including for newly created sales channels.

## Key steps / config

1. Understand the model: it mirrors core's `product_search_config` / `product_search_config_field`, but the configuration is **per sales channel** instead of per language.
2. Add a migration that inserts your configuration rows. Reference implementation for the defaults (product, manufacturer, category): `\Shopware\Commercial\Migration\Migration1680751315SWAGAdvancedSearch_AddAdvancedSearchConfigurationDefaults`.
3. Also cover sales channels created later. Reference: `\Shopware\Commercial\AdvancedSearch\Subscriber\SalesChannelCreatedSubscriber`.

## Essential identifiers

- `\Shopware\Commercial\AdvancedSearch\Entity\AdvancedSearchConfig\AdvancedSearchConfigDefinition`
- `\Shopware\Commercial\AdvancedSearch\Entity\AdvancedSearchConfig\Aggregate\AdvancedSearchConfigFieldDefinition`
- `\Shopware\Commercial\Migration\Migration1680751315SWAGAdvancedSearch_AddAdvancedSearchConfigurationDefaults`
- `\Shopware\Commercial\AdvancedSearch\Subscriber\SalesChannelCreatedSubscriber`
- Tables `advanced_search_config`, `advanced_search_config_field`

## Gotchas

- A config inserted only for existing sales channels does not apply to sales channels created afterwards; handle creation events as `SalesChannelCreatedSubscriber` does.

## Code check (6.7.13.0)
- confirmed `product_search_config` — core per-language counterpart entity — vendor/shopware/core/Content/Product/Aggregate/ProductSearchConfig/ProductSearchConfigDefinition.php:25
- confirmed `product_search_config_field` — core per-language field entity — vendor/shopware/core/Content/Product/Aggregate/ProductSearchConfigField/ProductSearchConfigFieldDefinition.php:22
- unverified `AdvancedSearchConfigDefinition` — commercial extension, not in vendor/shopware core/storefront/administration
- unverified `AdvancedSearchConfigFieldDefinition` — commercial extension, out of scope
- unverified `Migration1680751315SWAGAdvancedSearch_AddAdvancedSearchConfigurationDefaults` — commercial extension, out of scope
- unverified `SalesChannelCreatedSubscriber` — commercial extension, out of scope
- unverified `advanced_search_config` — table created by the commercial extension, no match in vendor/shopware/core
