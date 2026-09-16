---
id: platform/func/shopware-en/settings/importexport.md
title: Importexport
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-en/settings/importexport
sourceHash: 403fecae2d9be216575be32444a440850f720ed8a7ed3a0be304e5d7234fc844
revision:
  current: true
  range: "6.5.1.0"
  swMax: null
  swMin: null
keywords: ["Import/Export", "CSV import", "CSV export", "import profile", "export profile", "dry run", "second unique identifier", "AI Copilot export assistant", "object type", "database mapping", "product import", "newsletter recipient import", "variant import", "advanced prices"]
summary: "Import/Export module: CSV-based import/export via profiles per object type, with dry run, mapping, and a second-identifier feature."
lastBuilt: "2026-09-15"
---
## What it is

The **Settings > Automation > Import/Export** module imports and exports Shopware 6 data (products, customers, categories, media, newsletter recipients, properties, variant configuration, cross-selling, promotions, advanced prices) using CSV files and configurable profiles.

## When to use

Use it to bulk-load or bulk-update store data from CSV files, or to export existing data for review or transfer to other systems.

## Key steps / config

**Preparation**: files must be UTF-8, semicolon field separator, quotation-mark string separator; decimal prices always use a point (e.g. `5.00`, not `5,00`).

**Import tab**: Upload CSV file (1) → Select profile (2) → Start import (3, validates and imports error-free records; erroneous ones are collected into a downloadable CSV) → Start dry run (4, tests without writing data) → Import activity (5, last 30 days, re-download source/profile, or error-only CSV) → Abort process (6).

**Export tab**: Export (1, selects data via profile) → Select profile (2) → Start export (3) → Export activity (4, last 30 days).

**Export assistant - AI Copilot**: part of the Shopware Rise plan and requires the Commercial extension; currently supports customer, product, order, category, newsletter, promotion code, promotion discount, properties, cross-selling and product price data.

**Profiles tab**: Profile overview (1); Menu (2, open/delete/duplicate); Create new profile (3); Search (4). A new profile needs: Profile name (1), Usage (2, import/export/both), Object type (3, e.g. Product, Customer), Separator character (4, default semicolon), Enclosure character (5), Import settings (6, Create new records / Update existing data). Mapping rows use **Add new mapping (1)**; each row has Database mapping (2), Required (3), Default Value (4), Position (5), Delete (6).

**Second Unique Identifier** (Advanced Settings tab of a profile): lets you map import rows by a chosen field (e.g. `productNumber`) instead of the row's UUID.

Object types each require specific mandatory fields, e.g.:
- Product: `id`, `taxId`, `productNumber`, `stock`, `name`
- Customer: `id`, `defaultBillingAddressId`, `defaultShippingAddressId`, `customerNumber`, `firstName`, `lastName`, `email`
- Categories: `id`, `type`, `name`
- Newsletter recipients: `id`, `email`, `status`, `hash`, `salesChannelId`
- Advanced prices: `id`, `productId`, `ruleId`, `quantityStart`

Default product CSV columns include `id`, `parent_id`, `product_number`, `active`, `stock`, `name`, `description`, `price_net`, `price_gross`, `tax_id`, `tax_rate`, `tax_name`, `cover_media_id`, `cover_media_url`, `manufacturer_id`, `categories`, `sales_channels` (multi-value fields separated with `|`).

Importing variants requires 4 steps: import products, import properties, import variant configuration (mapping `option_id`/`product_id`), then either import variants (via the default product profile with **Import product variants** checked; mandatory fields `parent_id`, `product_number`, `active`, `stock`, `optionIds`) or generate them via the product's **generate variants** tab.

## Essential identifiers

- `Settings > Automation > Import/Export`
- Profile fields: Object type, Separator character, Enclosure character, Create new records, Update existing data
- CSV requirements: UTF-8 encoding, semicolon separator, quotation-mark string separator
- Additional-images mapping example uses the `media` database entry with multiple pipe-separated image URLs

## Gotchas

- Import can only add information, not remove it (e.g. an existing sales channel assignment on a product cannot be removed by import).
- Before importing customers as of version **6.4.9.0**, disable emailing (**Settings > System > Mailer**) to prevent registration emails being sent to every imported customer.
- Not every mapping to a new identifier is sensible: if multiple products share the same `translation.DEFAULT.name` and it is used as identifier, only the first matching record is identified.
- Failed import records are downloadable as CSV with an extra `_error` column explaining the failure.
