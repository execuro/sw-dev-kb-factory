---
id: platform/func/saas/google-shopping-export.md
title: Google Shopping Export
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/saas/google-shopping-export"
sourceHash: "bd530f2b484c102538d4f85d3926e56c9a60e41fd95ad1f1d36efb112906bb59"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["product comparison", "Google Shopping", "product feed", "XML export", "CSV export", "dynamic product group", "access key", "export URL", "maintenance mode", "Social Shopping", "Shopping Ads with Google", "product row", "header row", "footer row"]
summary: "Setting up a Google Shopping (XML) product feed via the product comparison sales channel, its template rows, API access, and export options."
lastBuilt: "2026-09-15"
---
## What it is
This page documents creating a Google Shopping export feed via the **product comparison** sales channel, its templates, general/export settings, and API access.

## When to use
Use this when exporting product data to Google Shopping via the product comparison feature, or when replacing the deprecated Shopping Ads with Google integration.

## Key steps / config
- Add a sales channel via the **+** next to sales channels, then **Add sales channel** next to **product comparison**.
- **General settings**: choose the **Google Shopping (XML)** template (changing a template later overwrites individual adjustments), set a **Name**, and choose **Tax Calculation** (row-by-row or column-by-column).
- **Storefront Sales Channels**: set the storefront sales channel, storefront domain, currency, language, and customer group (auto-selected from the storefront sales channel).
- **Product export**: set **Filename**, **Encoding** (UTF-8 or ISO-8859-1), **File format** (XML for Google Shopping, or CSV), **Export variants as discrete products** (each variant individually vs. only main products), **Interval**/**Generate via scheduler** (or "Live" generation on link call), and **Dynamic product group** (created/edited under **Catalogues > Dynamic Product Groups**).
- **API access and Status**: **Access key** for API access, **Export URL** to retrieve the file, **Active** toggle, **Maintenance** toggle, and an **IP addresses whitelist** restricting access during maintenance.
- **Template**: the **header row** carries general sales-channel info (domain, language); the **footer row** formally closes the feed; the **product row** defines the schema used to generate each product's data.
- **Shopping Ads with Google** (no longer supported since end of October 2022) is being replaced: create the feed file, process it via Google Merchant Center, verify it is error-free and complete, then set up a scheduled fetch there; the old Shopping Ads sales channel must then be fully deleted (deactivating alone is not enough).
- An alternative export path is the Google Shopping Feed provided by the **Social Shopping** extension.

## Essential identifiers
- Admin path: **Catalogues > Dynamic Product Groups**.
- Template: Google Shopping (XML).
- Template sections: header row, footer row, product row.

## Gotchas
Once the Shopping Ads with Google integration is replaced by the product-comparison feed, the old Shopping Ads sales channel must be completely deleted, not just deactivated.
