---
id: platform/func/saas/company.md
title: Company
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/company"
sourceHash: "752ea8c6bc90d5350689c2e74a4008e8195ac5492d4f7c3339a03268ecc337fc"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["company settings", "Settings > Account > Company", "VAT identification number", "billing information", "contact details", "small tradesman", "SaaS invoicing", "Shopware AG", "Settings > Shop > Documents"]
summary: "Where to maintain a SaaS shop's contact, VAT and billing information used by Shopware AG for invoicing, under Settings > Account > Company."
lastBuilt: "2026-09-15"
---
## What it is
This page documents the **Settings > Account > Company** screen, where a SaaS shop operator maintains general contact information and billing details used by Shopware AG for the SaaS instance.

## When to use
Use this when setting or updating the shop operator's VAT ID, contact details, or billing information for invoicing purposes — not for information sent to the shop's own customers.

## Key steps / config
- **VAT identification number**: enter your existing VAT ID here; small tradesmen should also enter their status here.
- **Contact details**: used by Shopware AG, as operator of the SaaS environment, to contact the shop operator.
- **Billing information**: used by Shopware AG when invoicing the applicable SaaS costs.
- If the SaaS environment is linked to a Shopware account, some data (e.g. the company name) is retrieved directly from that account and cannot be changed here.
- Details for documents sent to the shop's own customers (e.g. invoices) are maintained separately, per template, under **Settings > Shop > Documents**.

## Essential identifiers
- Admin path: **Settings > Account > Company**.
- Related admin path: **Settings > Shop > Documents**.

## Gotchas
This page's data is not used to contact the shop's customers; it is solely for Shopware AG's contact/billing purposes with the shop operator. Data pulled from a linked Shopware account cannot be edited here directly.
