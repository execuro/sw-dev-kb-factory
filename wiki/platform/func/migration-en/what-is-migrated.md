---
id: platform/func/migration-en/what-is-migrated.md
title: What Is Migrated
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/migration-en/what-is-migrated"
sourceHash: "b1f7c8bd002b08f5f8a0e5b3545282b8fe3b7245249e737680ef99c543f334e1"
revision:
  current: true
  range: "6.4.0.0 - 6.6.10.14"
  swMin: "6.4.0.0"
  swMax: "6.6.10.14"
keywords: ["Shopware 5 to Shopware 6", "automatically migrated data", "manual mapping", "Standard Payment Method", "Salutation", "Delivery time", "sales channel", "Rule Builder", "Shopping Experiences", "B2B Suite", "payment methods mapping", "shipping methods mapping"]
summary: "What data migrates automatically from Shopware 5 to Shopware 6, what needs manual mapping, and what to check after migration."
lastBuilt: "2026-09-15"
---
## What it is

Lists what is migrated automatically when moving from Shopware 5 to Shopware 6, what must be manually mapped before migrating, and what needs manual review afterwards.

## When to use

When planning a Shopware 5 to Shopware 6 migration and deciding what preparation (mapping payment/shipping methods, etc.) is required beforehand.

## Key steps / config

Automatically migrated groups: **Basic data** (categories, customer groups, currencies, sales channels, number ranges — mandatory), **Products** (products, properties, product options/properties, translations, cross-selling, main variant relations), **Customers & orders** (customers, shipping methods, orders, order documents), **Promotions** (customers, promotions), **SEO URLs**, and **Product reviews** (plus media).

Manual mapping is required for **payment methods**, a **Standard Payment Method**, **Salutation**, **Delivery time**, and a **Standard delivery time** — these entries must already exist in Shopware 6 before starting the migration, and once mapped they cannot be remapped without deleting and recreating the migration.

## Essential identifiers

- Menu paths: `Settings > Commerce > Shipping`, `Settings > Commerce > Payment methods`, `Settings > Localisation > Countries`, `Settings > Commerce > Documents`, `Settings > Content > Email templates`, `Content > Shopping Experiences`

## Gotchas

- Shipping costs, payment methods, document templates and email templates cannot be transferred automatically and must be recreated (email templates use Twig).
- Shopping worlds/shop pages must be recreated under Shopping Experiences due to a different technical structure.
- Old Shopware 5 templates cannot be reused or migrated; Shopware 6 ships its own default template as a starting basis.
- A transfer of B2B Suite data from Shopware 5 to Shopware 6 is not possible.
- Two default sales channels already exist on a fresh Shopware 6 install alongside the migrated Shopware 5 shops/subshops; domain settings of newly created sales channels must be adjusted to see migrated data in the frontend.
