---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/checkout/documents/legacy/add-custom-document.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
sourceHash: f1ef7bddb8b5c97f004eb21837cc53d413803ed7
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/checkout/documents/legacy/add-custom-document.html
title: Add Custom Document
version: "6.7"
versions:
  - "6.7"
keywords: ["document_base_config", "document_base_config_sales_channel", "custom document", "document configuration", "MigrationStep", "delivery_note", "filename_prefix", "SALES_CHANNEL_TYPE_STOREFRONT", "legacy documents", "document type", "plugin migration", "type_name"]
summary: "Legacy documents: add a document configuration via migration rows in document_base_config and document_base_config_sales_channel."
lastBuilt: 2026-10-21
---
## What it is

Guide for the legacy document system (deprecated, removed in Shopware 6.9; successor is the experimental Document System v2 since 6.7). It shows how a plugin adds a new document configuration — a named, configured variant of an existing document type — through a database migration.

## When to use

When a plugin needs an additional document (e.g. a second delivery-note layout named `custom`) available in the Administration for one or more sales channels. Custom templates require a new document **type** instead (see the Add Custom Document Type guide).

## Key steps / config

Document configurations live in `document_base_config`; the `document` table holds generated documents for orders, not configuration. Add them in a `MigrationStep` (see [database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md)):

1. Look up the target document type id: `SELECT id FROM document_type WHERE technical_name = "delivery_note"`.
2. Insert one `document_base_config` row: `id`, `name` (required, e.g. `custom`), `filename_prefix` (e.g. `custom_`), `global` (required; `0`, or `1` to act as fallback for a new type), the document type reference and default settings (column names: see Gotchas), `created_at`.
3. Look up the Storefront sales channel (`type_id = Uuid::fromHexToBytes(Defaults::SALES_CHANNEL_TYPE_STOREFRONT)`); if one exists, insert a `document_base_config_sales_channel` row per sales channel: `id`, `document_base_config_id`, `sales_channel_id`, `created_at`.

```php
class Migration1616668698AddDocument extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1616668698; }
    public function update(Connection $connection): void { /* steps 1-3 */ }
}
```

Default settings used in the source (JSON-encoded): `displayPrices`, `displayFooter`, `displayHeader`, `displayLineItems`, `displayLineItemPosition`, `displayPageCount`, `displayCompanyAddress`, `pageOrientation` (`portrait`), `pageSize` (`a4`), `itemsPerPage`, `companyName`, `companyAddress`, `companyEmail`.

## Essential identifiers

- Tables `document_base_config`, `document_base_config_sales_channel`, `document_type`, `document`
- Columns `name`, `filename_prefix`, `global`, `document_base_config_id`, `sales_channel_id`
- `Shopware\Core\Framework\Migration\MigrationStep`, `Shopware\Core\Defaults::SALES_CHANNEL_TYPE_STOREFRONT`
- Document type technical name `delivery_note`

## Gotchas

- Guard the sales-channel insert: a system may have no Storefront sales channel.
- The source writes the type reference as `document_type_id` and the settings as the JSON `config` column. In 6.7.15.1, `document_base_config.document_type_id` (still required) and `document_base_config_sales_channel.document_type_id` are deprecated since v6.7.14.0 in favour of `type_name`; `document_base_config.config` is deprecated since v6.7.11.0. All are removed in v6.9.0.0.
- `global` defaults to `false` in the entity definition.

## Code check (6.7.15.1)
- confirmed `DocumentBaseConfigDefinition::ENTITY_NAME` — table document_base_config — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:34
- confirmed `name` — required StringField — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:76
- confirmed `filename_prefix` — StringField filenamePrefix — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:77
- confirmed `global` — required BoolField, default false — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:80
- confirmed `type_name` — replacement for the document type FK — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:73
- deprecated `config` — JSON field, deprecated v6.7.11.0, removal v6.9.0.0 — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:97
- deprecated `document_type_id` — on document_base_config, deprecated v6.7.14.0 for typeName — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfig/DocumentBaseConfigDefinition.php:98
- deprecated `document_type_id` — on document_base_config_sales_channel, v6.7.14.0 — vendor/shopware/core/Checkout/Document/Aggregate/DocumentBaseConfigSalesChannel/DocumentBaseConfigSalesChannelDefinition.php:63
- confirmed `delivery_note` — DeliveryNoteRenderer::TYPE — vendor/shopware/core/Checkout/Document/Renderer/DeliveryNoteRenderer.php:35
- confirmed `SALES_CHANNEL_TYPE_STOREFRONT` — Storefront sales channel type id — vendor/shopware/core/Defaults.php:29
