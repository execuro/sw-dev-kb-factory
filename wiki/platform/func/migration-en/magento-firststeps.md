---
id: platform/func/migration-en/magento-firststeps.md
title: Magento Firststeps
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/migration-en/magento-firststeps"
sourceHash: "a9c36ca6fea661b626b14a135e2af10d2495bb17a1a275309aea04254a92c679"
revision:
  current: true
  range: "6.1.0 - 6.6.10.14"
  swMin: "6.1.0"
  swMax: "6.6.10.14"
keywords: ["Magento migration", "pre-mapping", "Magento attributes", "properties", "custom fields", "configurable product", "product container", "variants", "cross-selling", "sales channel", "shipping costs", "Rule Builder", "email templates", "Shopping Experiences"]
summary: "First-steps guide for migrating a Magento shop to Shopware 6: migrated data, attribute mapping, and points needing manual review."
lastBuilt: "2026-09-15"
---
## What it is

Describes what is migrated automatically from Magento to Shopware 6, how Magento attributes and product types map to Shopware concepts, and which areas need a manual check afterwards.

## When to use

When planning or reviewing a Magento-to-Shopware-6 migration.

## Key steps / config

- Migrated automatically: shop features, category structure, reviews, manufacturer, customer/address/customer-number data, orders, products/product numbers/master data, variants (one- and multi-dimensional), properties, article pictures, stock.
- Requires manual mapping via pre-mapping: order status, payment methods, tax rates (and, for Magento 2, country/currency/language assignments from sales channels).
- Magento attributes migrate to Shopware **properties** if user-created and either filterable-with-results or usable to create a configurable product; the same attributes become **variant properties** if used to create configurable products. All other user-created attributes migrate as **custom fields**.
- Product types migrated: simple products, configurable products (become a Shopware "product container" with attached simple products as variants), downloadable products.
- Magento **Stores** migrate to sales channels, assigned languages via shop views (falling back to the Magento default language if no shop view exists).
- Cross-selling, up-selling and related products are all migrated as a single cross-selling group.
- Orders migrate with status "Delivered" if a Magento delivery exists, otherwise "Open" (or the pre-mapped equivalent).

## Essential identifiers

- Menu paths: `Settings > Commerce > Shipping`, `Settings > Commerce > Payment methods`, `Settings > Localisation > Countries`, `Settings > Commerce > Documents`, `Settings > Content > Email templates`, `Content > Shopping Experiences`
- Concepts: Rule Builder, product container, Shopping Experiences

## Gotchas

- CMS data is not migrated because it is not stored in the Magento database — only product/category media can be migrated.
- Shipping costs, payment methods, document templates and email templates are not automatically transferable and must be recreated in Shopware 6 (email templates use Twig, unlike Magento).
- Shopping Experiences pages (imprint, about us, category layouts) must be rebuilt since they use a different technical framework than Magento CMS.
- Magento templates cannot be migrated; Shopware 6 ships its own default template as a starting point for a custom theme.
- Two default sales channels already exist in a fresh Shopware 6 install, in addition to the migrated Magento stores — domain settings of the newly created sales channels must be adjusted to see migrated data in the frontend.
