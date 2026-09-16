---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/legacy/add-custom-document.md
sourceHash: f1ef7bddb8b5c97f004eb21837cc53d413803ed7
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/legacy/add-custom-document.html
title: Add Custom Document
version: "6.7"
versions:
  - "6.7"
keywords: ["document_base_config", "document_base_config_sales_channel", "MigrationStep", "document_type", "filename_prefix", "global", "Defaults::SALES_CHANNEL_TYPE_STOREFRONT", "custom document", "document settings", "legacy document system", "plugin migration", "delivery_note"]
summary: Legacy (pre-v2) way to add a custom document via a plugin migration inserting document_base_config and document_base_config_sales_channel rows.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md"]
---
## What it is

How a plugin adds a new document in the legacy document system: a migration inserts one row into `document_base_config` (name, filename prefix, document type, settings) and one or more rows into `document_base_config_sales_channel` (availability per sales channel). The legacy system is deprecated and slated for removal with Shopware 6.9; its successor is the Document System (v2).

## When to use

You need an extra document (e.g. a variant of the delivery note with its own name, filename prefix and settings) that shows up in the Administration, while still using the legacy document generation (feature flag `DOCUMENT_GENERATION_REWORK` off). See [database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md) for migration basics.

## Key steps / config

1. Do not confuse `document_base_config` (settings per document) with `document` (the documents actually generated for an order).
2. Create a migration `<plugin root>/src/Migration/Migration1616668698AddDocument.php` extending `Shopware\Core\Framework\Migration\MigrationStep`:

```php
class Migration1616668698AddDocument extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1616668698; }

    public function update(Connection $connection): void
    {
        // 1. SELECT id FROM document_type WHERE technical_name = "delivery_note"
        // 2. $connection->insert('document_base_config', [...])
        // 3. SELECT id FROM sales_channel WHERE type_id = Defaults::SALES_CHANNEL_TYPE_STOREFRONT
        // 4. $connection->insert('document_base_config_sales_channel', [...])
    }
}
```

3. Insert into `document_base_config`: `id` (`Uuid::randomBytes()`), `name` (`'custom'`), `filename_prefix` (`'custom_'`), `global` (`0`), `document_type_id`, `created_at` formatted with `Defaults::STORAGE_DATE_TIME_FORMAT`. `name`, `global` and `document_type_id` are required fields; `global` = `1` makes the document act as a fallback across all sales channels (useful for a completely new document type).
4. Insert into `document_base_config_sales_channel`: `id`, `document_base_config_id`, `sales_channel_id`, `document_type_id`, `created_at`. The example skips this when no Storefront sales channel exists.
5. Document settings from the source example: `displayPrices`, `displayFooter`, `displayHeader`, `displayLineItems`, `displayLineItemPosition`, `displayPageCount`, `displayCompanyAddress`, `pageOrientation` (`portrait`), `pageSize` (`a4`), `itemsPerPage`, `companyName`, `companyAddress`, `companyEmail`. In 6.7.13 the table also has typed columns `page_size`, `page_orientation`, `items_per_page`, `display_header`, `display_footer`, `display_page_count`, `display_company_address`, `display_return_address`, `display_customer_vat_id` — fill them alongside the JSON blob (see Gotchas).
6. For custom templates, add a new document type instead (legacy "Add Custom Document Type" guide).

## Essential identifiers

- Tables: `document_base_config`, `document_base_config_sales_channel`, `document_type`, `sales_channel`
- `Shopware\Core\Framework\Migration\MigrationStep` (`getCreationTimestamp()`, `update()`)
- `Shopware\Core\Defaults::SALES_CHANNEL_TYPE_STOREFRONT`, `Defaults::STORAGE_DATE_TIME_FORMAT`
- `Shopware\Core\Framework\Uuid\Uuid`

## Gotchas

- The source writes all settings into the `config` JSON column via `json_encode()`. In the installed definition that field is marked `Deprecated('v6.7.11.0', 'v6.8.0.0')` and typed columns were added. `DocumentBaseConfigSyncSubscriber` mirrors JSON and typed columns so v1 readers (JSON-only) and v2 readers (column-first) agree, but only on DAL writes (`EntityWriteEvent`); a raw `$connection->insert()` in a migration bypasses it, so write both yourself.
- `global` defaults to `false` in the entity definition.

## Version notes

- Legacy document system: deprecated, removed with Shopware 6.9. Document System (v2) is experimental since 6.7 behind `DOCUMENT_GENERATION_REWORK` and becomes default with 6.8.

## Code check (6.7.13.0)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be declared — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, must be declared — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `document_base_config` — entity name — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:31
- confirmed `document_base_config_sales_channel` — entity name — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfigSalesChannel/DocumentBaseConfigSalesChannelDefinition.php:21
- confirmed `filename_prefix` — optional string column — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:74
- confirmed `global` — required bool, default false — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:76
- deprecated `document_base_config.config` — JSON field deprecated since v6.7.11.0, removal v6.8.0.0 — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:94
- confirmed `page_size` — typed column added next to the JSON blob — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:78
- confirmed `Defaults::SALES_CHANNEL_TYPE_STOREFRONT` — Storefront type id constant — vendor/shopware/core/Defaults.php:29
- confirmed `Defaults::STORAGE_DATE_TIME_FORMAT` — date format constant — vendor/shopware/core/Defaults.php:35
