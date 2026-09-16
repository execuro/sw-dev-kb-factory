---
id: platform/func/saas/getting-started-with-saas.md
title: Getting Started With Saas
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/getting-started-with-saas"
sourceHash: "3236e9b4cecb29a6d9a0c603befa6142e65b10e07afdc101b2202768c013c03d"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["SaaS checklist", "dashboard checklist", "categories", "products", "theme duplicate", "shopping experiences", "shipping methods", "payment methods", "company information", "import export", "languages", "document creation", "custom domain", "construction mode cookie", "Settings > System > Domains"]
summary: "The dashboard onboarding checklist for a new SaaS shop: categories, products, theme, legal pages, shipping/payment, company data, and domains."
lastBuilt: "2026-09-15"
---
## What it is
This page documents the dashboard checklist shown after a SaaS shop is created, guiding the first setup steps before GoLive, with links to each detailed topic.

## When to use
Use this right after a SaaS shop is created to work through the required first-steps checklist: categories/products, branding, legal pages, shipping/payment, company data, imports, languages, documents, and domains.

## Key steps / config
- Access the admin at the shop domain with `/admin` appended, e.g. `https://my.shopware.store/admin`.
- **Categories/products**: create categories via a category's context menu (*New category before*, *New category after*, *New subcategory*), nesting product categories under **home** and legal/informational pages under **footer menu**; then create products under **Catalogues > Products** via **Add new products**.
- **Own branding**: duplicate the default theme (its "..." button > **Create duplicate**) so it survives updates, then edit it under **theme**; content pages are managed under **Content > Shopping experience**.
- **Legal requirements**: edit the imprint and other predefined layouts nested under legal/information in the category tree, under **Content > Shopping experiences**, and save each.
- **Shipping and payment**: create shipping methods under **Settings > Shop > Shipping**; set up payment methods via **Set up payment method** in the checklist (defaults: cash on delivery, prepayment, invoice).
- **Company information**: add/edit VAT number and contact info; data may be locked if linked to a Shopware account.
- **Importing products**: import content (e.g. articles) under **Settings > Shop > Import/Export**.
- **Languages**: create/edit languages under **Settings > Shop > Languages**; additional countries/currencies require a higher plan (Shopware Rise, Shopware Evolve, Shopware Beyond).
- **Document creation**: configure templates (delivery note, invoice, credit note, cancellation invoice) under **Settings > Shop > Documents**; generate documents from an order's context menu (**Show**, then **Create new** > **Invoice**).
- **Own domain**: configure under **Settings > System > Domains** via **Connect domain**; only domains using HTTPS are used, non-secure domains are auto-forwarded; the auto-generated shop URL always remains; number of domains depends on the booked plan.
- **Maintenance mode**: activate per sales channel under **Status**, with an IP whitelist for exceptions; requires a booked plan.
- **Migration**: an existing Shopware 6 installation can be migrated to a second Shopware 6 SaaS instance.
- **Construction mode cookie**: while the store is not yet live, visitors see a "still in progress" page; a cookie set on admin login lets the logged-in admin view the finished storefront directly (does not work in private/incognito mode).

## Essential identifiers
- Admin URL pattern: `https://<shop-domain>/admin`.
- Admin paths: **Catalogues > Products**, **Content > Shopping experience(s)**, **Settings > Shop > Shipping**, **Settings > Shop > Payment methods**, **Settings > Shop > Import/Export**, **Settings > Shop > Languages**, **Settings > Shop > Documents**, **Settings > System > Domains**.
