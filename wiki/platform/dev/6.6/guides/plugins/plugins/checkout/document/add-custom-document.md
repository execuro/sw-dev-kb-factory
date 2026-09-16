---
id: platform/dev/6.6/guides/plugins/plugins/checkout/document/add-custom-document.md
title: Add custom document
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/checkout/document/add-custom-document.html"
sourceHash: "568bf3d14a71bca37e09a5a0e9079fe06e98bb43"
keywords: ["document_base_config", "document_base_config_sales_channel", "add custom document", "document configuration", "filename_prefix", "MigrationStep", "document_type", "delivery_note", "custom document"]
summary: "Shows how to add a new document configuration (using an existing document type) via a plugin migration into document_base_config."
lastBuilt: "2026-09-15"
---
## What it is
Explains adding a new document configuration to a plugin using an existing document type, by inserting into the database tables that hold document configuration rather than the generated documents themselves.

## When to use
Use this when the plugin should ship a preconfigured document (e.g. a "custom" delivery-note-type document) reusing an existing document type, without creating a new document type or renderer.

## Key steps / config
1. Distinguish `document_base_config` (the document's configuration and name) from `document` (the actually generated documents for an order) — do not confuse them.
2. Add a plugin migration that inserts:
   - one row into `document_base_config` with `id`, `name`, `filename_prefix`, `global`, `document_type_id`, `config` (JSON-encoded), `created_at`;
   - one or more rows into `document_base_config_sales_channel` per sales channel the document should be available for.
3. Example migration looks up the `document_type_id` for the existing `delivery_note` type via `SELECT id FROM document_type WHERE technical_name = "delivery_note"`, and the Storefront sales channel id via `Defaults::SALES_CHANNEL_TYPE_STOREFRONT`.
4. Config example encoded as JSON:
```json
{
  "displayPrices": false,
  "displayFooter": true,
  "displayHeader": true,
  "displayLineItems": true,
  "pageOrientation": "portrait",
  "pageSize": "a4",
  "companyName": "...",
  "companyAddress": "...",
  "companyEmail": "..."
}
```

## Essential identifiers
- Table `document_base_config` (fields `name`, `filename_prefix`, `global`, `document_type_id`, `config`)
- Table `document_base_config_sales_channel`
- Table `document_type` (`technical_name`)
- `Shopware\Core\Framework\Migration\MigrationStep`
- `Shopware\Core\Defaults::SALES_CHANNEL_TYPE_STOREFRONT`

## Gotchas
Setting `global` to `1` makes the document act as a fallback when creating a document for a completely new document type. There may be no Storefront sales channel present, so the migration must check the lookup result before inserting the sales-channel row.
