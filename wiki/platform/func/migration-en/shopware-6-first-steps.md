---
id: platform/func/migration-en/shopware-6-first-steps.md
title: Shopware 6 First Steps
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/migration-en/shopware-6-first-steps"
sourceHash: "c931e67097c20ff06bf01e21ee2295546a45acca4b1d600e632382f79fcbfc56"
revision:
  current: true
  range: "6.4.0.0"
  swMin: null
  swMax: null
keywords: ["migration overview", "Shopware 6 to Shopware 6", "what will be migrated", "payment methods migration", "Dynamic Product Groups", "Product Streams", "Rule Builder", "Flows migration", "SEO URLs migration", "themes migration", "manual check"]
summary: "Overview of what data transfers in a Shopware 6 to Shopware 6 migration, what does not, and what needs manual review afterwards."
lastBuilt: "2026-09-15"
---
## What it is

An overview of the data and content transferred in a Shopware 6 to Shopware 6 migration, and the requirements that must be met, including translations of the migrated points.

## When to use

When planning or reviewing a migration between two Shopware 6 instances (same system), to know in advance what transfers automatically and what needs manual setup.

## Key steps / config

Migrated basic/catalogue data includes: media, categories, sales channels, a range of settings (address settings, basic information, cart settings, countries, currencies, customer groups, delivery times, documents, email templates, languages, login/registration, number ranges, products, rules, salutations, scale units, shipping, sitemap, snippets, custom fields, mailer settings), properties, manufacturers, dynamic product groups with filters, cross-selling, reviews, tax incl. rules, customers, orders with order documents, layout data, SEO URL data/templates, newsletter recipients, wishlist, and promotions.

Not migrated:
- **Payment methods** — created in the target shop first, then assigned during the migration process.
- **Third-party extensions** — data stored in standard Shopware tables migrates; extension-created databases do not.
- **Themes** — simply reinstalled on the target rather than migrated.
- **Flows** — special flow settings must be recreated manually in the target shop.

## Essential identifiers

- Menu context: migration extension data selection
- Concept: Dynamic Product Groups (built on the Rule Builder)

## Gotchas

- Import/Export profiles and log entries are not migrated and must be recreated in the target shop.
- Dynamic Product Groups / Product Streams cannot be transferred technically because they are based on the Rule Builder and must be recreated manually.
- SEO URLs are generally carried over but should still be checked for correct configuration before going live.
- Extension data only migrates if stored in standard Shopware tables; extensions with their own tables require reinstallation.
