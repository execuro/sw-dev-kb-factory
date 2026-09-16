---
id: platform/func/migration-en/magento-keywords.md
title: Magento Keywords
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/migration-en/magento-keywords"
sourceHash: "ee1d8d733150f79c99eb06b843727c75c81678786a508ca3e6164cb3846d965b"
revision:
  current: true
  range: "6.1.0 - 6.6.10.14"
  swMin: "6.1.0"
  swMax: "6.6.10.14"
keywords: ["Magento dictionary", "Magento to Shopware terms", "Shopping Experiences", "Rule Builder", "sales channel", "variants", "custom fields", "properties", "advanced prices", "SEO URL templates", "categories", "layout assignment", "extensions", "plugin"]
summary: "Magento-to-Shopware terminology dictionary and admin UI mapping for merchants migrating from Magento."
lastBuilt: "2026-09-15"
---
## What it is

A Magento-Shopware dictionary and UI-navigation guide that translates Magento admin locations and concepts into their Shopware 6 equivalents, to help merchants find their way around after a Magento migration.

## When to use

When looking for the Shopware 6 equivalent of a familiar Magento admin menu item or concept after migrating from Magento.

## Key steps / config

UI navigation differences: Magento's top/left admin menu maps to Shopware's left-hand menu. Key area mappings:
- **Sales** (orders, invoices, credit memos, shipments) -> **Orders**; Magento's Sales > Taxes -> **Settings > Region > Taxes**.
- **Catalogs** (products, categories, attributes, reviews) -> **Catalogues**; Magento attribute sets and "hard" product-type separation do not exist in Shopware — advanced prices, properties and cross-selling live in their own product tabs.
- **Customers** -> **Customers**; newsletter subscription state is not shown there, instead under **Marketing > Newsletter recipients**.
- **Promotions** -> **Marketing > Discounts & Promotions**, driven by the Rule Builder.
- **CMS** (pages, static pages, widgets, polls) -> **Content > Shopping Experiences**.
- **System** -> **Settings**; My Account -> **Profile settings**; import/export -> **Settings > Automation**; Manage Stores -> sales channels, configured in the left bar.
- New sales channels have three types: **Storefront** (URL-accessible shop), **Product comparison** (exports to price portals/marketplaces), **Headless** (API-only, e.g. for ERP connections).

Representative dictionary entries (Magento term -> Shopware equivalent):
- Configurable products -> Variants (via Products > Generate variants; produces a non-orderable container product)
- Attributes -> Properties / Custom fields (custom fields extend the product; properties drive variants and filtering)
- Attribute Sets -> Custom field sets
- Product > Tier pricing / Group Price -> Advanced prices (via Rule Builder)
- Product > URL key -> SEO URL templates
- Product > Websites -> Sales channel
- CMS Block / Static Block / CMS Pages / Page Builder / Layered navigation -> Shopping Experiences
- Extension -> Plugin; Local Code Pool -> Extensions (installed under Settings > My extensions)
- System > Index Management -> Settings > System > Caches & Indices

## Essential identifiers

- Menu paths: `Marketing > Discounts & Promotions`, `Marketing > Newsletter recipients`, `Content > Shopping Experiences`, `Settings > Automation`, `Settings > System > Caches & Indices`, `Products > Generate variants`
- Sales channel types: `Storefront`, `Product comparison`, `Headless`

## Gotchas

- Variants in Shopware are not independent products (unlike Magento configurable-product children) — they inherit configuration from a main product.
- Properties in Shopware do not carry exactly the same meaning as Magento attributes; they specifically provide filterable product information and drive variant generation.
