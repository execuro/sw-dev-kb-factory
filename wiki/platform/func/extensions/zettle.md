---
id: platform/func/extensions/zettle.md
docType: functional
title: Zettle
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/zettle
sourceHash: caedd530ada9f7d3d6f887cce8992d1558ef36feec3184c9a1a4104e8ec2f2e6
revision:
  current: true
  range: current
  swMax: null
  swMin: null
keywords: ["Zettle", "Zettle by PayPal", "PayPal extension", "point of sale", "Zettle sales channel", "product synchronisation", "API key", "price synchronisation with VAT", "stock synchronization", "Zettle setup wizard", "sales channel integration", "POS"]
summary: "Zettle by PayPal is a card-payment/POS sales channel bundled with the PayPal extension, syncing Shopware products, prices and stock to Zettle."
lastBuilt: "2026-09-15"
---
## What it is

Zettle by PayPal lets merchants accept card payments via a smartphone/tablet chip card reader and app. The Zettle integration, part of the PayPal extension, adds a Zettle sales channel to sell products locally (e.g. in-store) alongside the online shop.

## When to use

Use it to synchronise Shopware products, prices and stock with a physical/POS Zettle setup for in-person sales.

## Key steps / config

- Zettle is not a standalone extension; it is bundled with PayPal, so no separate installation is required — only PayPal must be installed.
- Create a new **Zettle** sales channel; a setup wizard guides configuration:
  - **Account Setup**: connect an existing Zettle account via an **API key**, created in the Zettle admin under **Integrations > Create API Keys**.
  - **Connection**: confirms the linked Zettle account.
  - **Customisation**: set a sales channel **name** and the shop **domain** (used by Zettle to fetch media).
  - **Product selection**: choose which Shopware sales channel's products to transfer.
  - **Product synchronisation**: choose "Use only Shopware products", "Replace Zettle library", or "Add Shopware products". Variant groups must number between 1 and 3, or synchronization is cancelled; description text is limited to 1024 characters.
  - **Price synchronisation**: "synchronise prices with VAT" (gross prices incl. VAT transferred) or "don't synchronise prices" (adjust prices directly in Zettle afterward).
- Post-setup **Configuration** tabs: Account (account link, status, **Edit connection**), Overview (last sync info, **Synchronise Now**, partial sync via arrow for stock/images/details), Synchronised Products (per-product sync status/time, context menu to product config), Settings (all setup options revisited), Logs (status/date per run, error detail via context menu, **Clean up log**).
- **Reset synchronisation** marks all products unsynchronised for a full re-sync (can take longer); **Delete sales channel** removes the channel irrevocably (existing orders remain; already-synced Zettle catalogues are unaffected).

## Essential identifiers

- Sales channel type: **Zettle**
- Setup steps: Account Setup, Connection, Customisation, Product selection, Product synchronisation, Price synchronisation
- Sync modes: Use only Shopware products, Replace Zettle library, Add Shopware products

## Gotchas

Custom products are treated as simple products in Zettle POS — individual options/configurations are not available there. Stock synchronization is always bidirectional. Only products assigned to the Zettle sales channel and marked active are synchronized.
