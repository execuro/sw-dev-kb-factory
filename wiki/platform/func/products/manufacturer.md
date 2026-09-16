---
id: platform/func/products/manufacturer.md
title: Manufacturer
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/products/manufacturer"
sourceHash: "eeef4ec132afb9b2da77b29552df89d506b16c9d5a3d33ce462b6d8790691f46"
revision: { current: true, range: "current", swMax: null, swMin: null }
keywords: ["manufacturer", "vendor", "product manufacturer", "manufacturer logo", "manufacturer description", "context menu", "duplicate", "delete manufacturer", "product detail page", "experience worlds", "landing page", "SEO URL", "Catalogues > Manufacturers", "Twig variables"]
summary: "Managing manufacturers in the admin, their storefront display, and building a manufacturer landing page via experience worlds."
lastBuilt: "2026-09-15"
---
## What it is
This page documents the manufacturer overview and edit screens in the admin, how manufacturer data appears in the storefront, and how to build a manufacturer landing page.

## When to use
Use this when adding, editing, or deleting manufacturers, or when you want to expose a dedicated manufacturer landing page since Shopware 6 has no built-in manufacturer page like Shopware 5.

## Key steps / config
- The manufacturer overview table can be sorted ascending/descending by clicking a column heading.
- Each row has a **"..."** context menu with **Edit**, **Duplicate**, and **Delete** (a manufacturer can only be deleted if not assigned to any product).
- **Add manufacturer** opens the creation mask. Only **name** is mandatory; a website link, company logo, and description text can also be stored. The description can be output via Twig variables in the storefront.
- Manufacturer name/logo is shown on the product detail page (top right) for products with a manufacturer set; if a website is stored, the name/logo becomes clickable.
- To build a manufacturer landing page: create a landing page in the experience worlds, then create a corresponding landing page entry under **Catalogues > Categories**. Fill the mandatory fields, especially the SEO URL (this becomes the reachable URL, e.g. entering `shopwareag` yields a page reachable at a URL ending in `/shopwareag`). Assign the experience world in the Layout tab. Finally, save that SEO URL as the manufacturer's website under **Catalogues > Manufacturers**, prefixed with a slash (e.g. `/shopwareag`).

## Essential identifiers
- Admin path: **Catalogues > Manufacturers**.
- Landing page path: **Catalogues > Categories**.
- Context menu actions: **Edit**, **Duplicate**, **Delete**.

## Gotchas
A manufacturer cannot be deleted while it is still assigned to a product. The SEO URL entered on the landing page becomes the public URL of the manufacturer page, and the same value (with a leading slash) must then be stored as the manufacturer's website field.
