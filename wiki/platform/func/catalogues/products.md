---
id: platform/func/catalogues/products.md
title: Products
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/catalogues/products
sourceHash: 79b3d5c5f39269e99a08c9d0708115526cb7f23198c8f08da1ed476c34c321f7
revision:
  current: true
  range: "6.7.14.0 - 6.7.14.2"
  swMax: "6.7.14.2"
  swMin: "6.7.14.0"
keywords: ["products", "add product", "variant generator", "advanced pricing", "cross-selling", "digital products", "product number", "stock", "clearance sale", "SEO urls", "bundles", "properties", "3D models", "glb", "warehouse groups"]
summary: "Creating products in the Administration: required fields, prices, stock, media, variants, SEO, cross-selling, bundles and digital products."
lastBuilt: 2026-10-20
---
## What it is

The product detail mask in the Administration (Products > Add product). It covers general data, prices, deliverability, visibility, media, specifications, advanced pricing, variants, layout, SEO, cross-selling, bundles, reviews and digital products.

## When to use

When creating or editing a product, configuring prices and stock, generating variants, assigning a shopping experience layout, or setting up cross-selling.

## Key steps / config

Required before the first save: Name, Product number, Tax rate, Price (gross and net), Stock. After saving, the tabs Specifications, Extended Prices, Variants, Layout, SEO and Cross Selling become available.

- **General**: name, manufacturer, product number (normally from number ranges), description with WYSIWYG editor. Internal SEO links use a magic placeholder plus the entity UUID. The AI description assistant needs a Rise plan; generated text must be checked for legal conformity.
- **Prices**: tax rate, price gross/net (lock symbol links them), purchase price, list price (shown only if higher than the price), cheapest price in the last 30 days (needed to advertise price reductions in the EU, Art. 6a of Directive 98/6/EC). Currency-dependent prices are linked to the default price by a factor; the chain symbol unlinks them.
- **Deliverability**: stock (real-time, reduced on order), available stock (mirrors stock), clearance sale, delivery time (overrides the shipping method's), restock time in days, free shipping, min. order quantity, purchase steps, max. order quantity. Warehouse groups (6.4.19.0, Beyond plan) move stock entry to a per-warehouse screen with priority and delivery time per group.
- **Visibility and structure**: sales channels, active flag, categories, extended visibility (visible, hide in listing, hide in listing and search), tags, search keywords.
- **Media**: recommended 600x600 square images (1920x1920 for zoom). Video formats: webm, mkv, flv, ogv, ogg, avi, mov, wmv, mp4 (MP4 most reliable). 3D models: only `glb`, cannot be a cover or used in shopping experiences, AR via QR code on iOS12+ and Android 8.0+ with ARCore 1.9.
- **Labelling**: release date (informational only), GTIN/EAN, manufacturer product number. **Guarantee (GARAN Label)**: duration in months; label shows only with valid period, manufacturer and manufacturer product number.
- **Specifications**: measurements, selling unit, product unit, basic unit, packing unit (plural), properties (AI Copilot suggestions on commercial plans), essential characteristics, custom fields. Base price needs selling unit, product unit and basic unit and shows separately only if the basic unit differs from the sales unit.
- **Advanced pricing**: Rule Builder based prices and scaled prices per quantity.
- **Variants**: open the Variant Generator, select property options, optionally set price surcharges and value exclusions (combined with "and"), then **Generate variants**. Display options: Main product vs Single variant in listings, and Fan out properties in product list. Variants inherit from the main product until the chain symbol is removed. Variant bulk edit follows the same rules as product bulk edit (max 1000).
- **Layout**: assign, edit in Designer or remove a shopping experience layout.
- **SEO**: meta title (about 70 characters), meta description (130-160), SEO keywords, single canonical URL for all variants, Open Graph title, description and image, SEO URLs per sales channel with main category.
- **Cross-selling**: type Dynamic product group (position, sorting, max products, preview) or Manual assignment.
- **Bundles**: assign the product to existing bundles; changes sync both ways with the bundle.
- **Digital products**: upload a file bound to the product; an extra legal checkbox appears at order, and the file is mailed after payment and downloadable under "Orders".

## Gotchas

- Some features appear only after the first save.
- Stock management changed in 6.6.0.0; older versions use a different article.
- Updating the gross price does not change the net price in bulk edit; the cover image cannot be set in bulk.
- 3D files are not optimized automatically for the storefront; upload optimized files.
- Simple editing mode hides non-essential fields and sections.

## Version notes

Warehouses and warehouse groups: 6.4.19.0 with the Beyond plan. Stock logic described applies from 6.6.0.0.
