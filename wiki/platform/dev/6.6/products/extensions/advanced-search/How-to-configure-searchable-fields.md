---
id: platform/dev/6.6/products/extensions/advanced-search/How-to-configure-searchable-fields.md
title: Configure Searchable Fields
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/advanced-search/How-to-configure-searchable-fields.html"
sourceHash: 98cdb9596fac0f1ba4f1ccca6d90a01c756dcd68
keywords: ["advanced_search_config", "advanced_search_config_field", "AdvancedSearchConfigDefinition", "AdvancedSearchConfigFieldDefinition", "product_search_config", "product_search_config_field", "SalesChannelCreatedSubscriber", "sales channel search config", "searchable fields"]
summary: "How search entities and their searchable fields are stored per sales channel in advanced_search_config and advanced_search_config_field tables."
lastBuilt: "2026-09-15"
---
## What it is

This page documents how Advanced Search stores search entities and their searchable fields — in the `advanced_search_config` and `advanced_search_config_field` tables — which are used to build search/suggest queries.

## When to use

Use when you need to add or understand custom search configuration per sales channel, similar to how `product_search_config`/`product_search_config_field` work in the platform, but configured by sales channel instead of by language.

## Key steps / config

- Add a migration to insert configuration into the database, referencing `\Shopware\Commercial\Migration\Migration1680751315SWAGAdvancedSearch_AddAdvancedSearchConfigurationDefaults` as an example that adds default search config for product, manufacturer, and category entities.
- Also add configuration for newly created sales channels, as handled by `\Shopware\Commercial\AdvancedSearch\Subscriber\SalesChannelCreatedSubscriber`.

## Essential identifiers

- `advanced_search_config` table
- `advanced_search_config_field` table
- `\Shopware\Commercial\AdvancedSearch\Entity\AdvancedSearchConfig\AdvancedSearchConfigDefinition`
- `\Shopware\Commercial\AdvancedSearch\Entity\AdvancedSearchConfig\Aggregate\AdvancedSearchConfigFieldDefinition`
- `\Shopware\Commercial\Migration\Migration1680751315SWAGAdvancedSearch_AddAdvancedSearchConfigurationDefaults`
- `\Shopware\Commercial\AdvancedSearch\Subscriber\SalesChannelCreatedSubscriber`
