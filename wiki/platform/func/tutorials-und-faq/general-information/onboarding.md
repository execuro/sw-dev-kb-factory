---
id: platform/func/tutorials-und-faq/general-information/onboarding.md
title: "Onboarding"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-und-faq/general-information/onboarding"
sourceHash: "0ad017cf960fbfe224e73b78e088955b4900c6a78667c8f6d93df7140c61c9fa"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["onboarding", "initial setup wizard", "category administration", "product creation", "manufacturer overview", "properties", "variants", "Shopping Experiences", "shipping methods", "payment methods", "Users & Rights", "SaaS", "PaaS", "self-hosted", "import/export"]
summary: "Shopware onboarding doc companion covering installation, setup wizard, catalog, products, payments, accounting, and SaaS/PaaS/self-hosted options."
lastBuilt: "2026-09-15"
---
## What it is
This page is the written companion to Shopware's Onboarding videos, giving a roughly one-hour walkthrough of the first steps for building a store: installation, initial setup, catalog structures, and account/hosting concepts.

## When to use
Reference when starting a new Shopware 6 store and orienting through the admin's core areas, or when explaining the difference between the SaaS, PaaS and self-hosted deployment models.

## Key steps / config
- **Installation**: covers what to know before installing Shopware 6 and the installer flow.
- **Initial Setup Wizard**: launches automatically after the first admin login following installation; walks through the basic store setup steps.
- **Categories**: managed under Catalogs > Categories; categories are also used to organize store pages, the service menu, and landing pages.
- **Create products**: the product creation mask is divided into thematic areas.
- **Manufacturer**: an overview of manufacturers already created, in a table sortable by column.
- **Properties**: filterable product attributes (e.g. property "Size" with options XS, S, M, L, XL, XXL) that also form the basis for variant generation.
- **Themes**: lists installed themes; manage and edit them here.
- **Shopping Experiences**: under Content; used to build landing pages, store pages and category layouts, made of sections, blocks and elements.
- **Shipping**: shipping methods are configured under Settings > Shop.
- **Payment methods**: configured under Settings > Shop > Payment methods.
- **Users & Rights**: under Settings > System > Users & Rights; manage admin users and grant or revoke rights.
- **Import/Export**: import content, or export existing content for interfaces/evaluation tools.
- **Documents**: the documents module creates receipts/documents for orders; templates are managed in its settings.
- **Accounting**: a default payment type (PayPal, credit card, direct debit) is set under Account > Accounting > Add payment type; invoices/credit notes appear under Account > Accounting, issued monthly as a collective invoice; single transactions are under Shop management > Shops > Shop details > Account details.
- **Hosting models**: self-hosted runs on your own or a third-party server with full infrastructure control and full code access but no automatic updates; SaaS is fully hosted by Shopware with automatic updates but no code access; PaaS has infrastructure/hosting managed by Shopware while the store owner handles software updates and retains code access.

## Essential identifiers
- Menu paths: `Catalogs > Categories`, `Settings > Shop`, `Settings > Shop > Payment methods`, `Settings > System > Users & Rights`, `Account > Accounting > Add payment type`

## Gotchas
- If the admin menu is not fully displayed after first login, it is because the minimum master data (company/contact/tax data, customer number, Shopware ID) has not yet been entered.
- Purchase on account is not supported; only PayPal, credit card and direct debit payment methods are available for the account.
