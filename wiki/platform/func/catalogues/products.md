---
id: platform/func/catalogues/products.md
title: Products
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/catalogues/products
sourceHash: 77b35e187b799e70afedf68eb05a0face2307a839324f8cd5201707bed68e8f4
revision:
  current: true
  range: "6.7.9.0 - 6.7.13.1"
  swMax: "6.7.13.1"
  swMin: "6.7.9.0"
keywords: ["products", "product creation", "product number", "tax rate", "advanced pricing", "Rule Builder", "variants", "variant generator", "cross-selling", "bundles", "digital products", "SEO", "cheapest price", "warehouse groups"]
summary: "The product create/edit mask: required save fields plus General, Prices, Deliverability, Variants, Layout, SEO, Cross-Selling and Bundles tabs."
lastBuilt: 2026-09-15
---
## What it is
This page documents the product creation/edit mask in Shopware 6: the fields required to save a new product, and the tabbed areas (General, Specifications, Advanced pricing, Variants, Layout, SEO, Cross-Selling, Bundles, Reviews) available afterward.

## When to use
Use when creating or editing a product, configuring pricing, variants, media, cross-selling, bundles, or digital product delivery.

## Key steps / config
- Required fields before first save: Name, Product number, Tax rate, Price (gross and net), Stock. After saving, Specifications, Extended Prices, Variants, Layout, SEO and Cross Selling tabs become available.
- General tab: Name, Manufacturer, Product number, Description (WYSIWYG editor); internal SEO links use the placeholder `124c71d524604ccbad6042edce3ac799` plus the target's UUID.
- AI description assistant (requires a booked Rise plan) generates a description text suggestion from entered key information; generated text must still be checked for legal compliance.
- Prices: Tax rate, Price (gross/net), Purchase price (gross/net), List price (gross/net, must exceed the product price to display), Cheapest price (last 30 days, gross/net) — required in the EU under Art. 6a of Directive 98/6/EC when advertising price reductions; gross/net can be locked to auto-calculate via the stored tax rate; currency-dependent pricing can be unlinked per currency.
- Deliverability: Stock, Available stock, Clearance sale, Delivery time, Restock time in days, Free shipping, Min./Max. order quantity, Purchase steps (e.g. a scale of 2 allows purchases of 2, 4, 6...). Stock management changed as of Shopware 6.6.0.0.
- Warehouses and warehouse groups (from 6.4.19.0, Beyond Plan): select a Warehouse group, then configure per-warehouse Stock, Priority and Delivery time.
- Visibility & structure: Sales channel, Active for all selected sales channels, Categories, extended visibility (Visible / hide in listing / hide in listing and search), Tags, Search keywords.
- Media: assign images/videos (supported video formats `webm, mkv, flv, ogv, ogg, avi, mov, wmv, mp4`; MP4 recommended) and 3D models (`glb` format only, rendered via the ThreeJs library) with AR viewing on supported devices.
- Advanced pricing: define rule-based prices using Rule Builder rules, including scaled prices via quantity/price allocation.
- Variants: generated from Properties via the Variant Generator (Select values, price surcharges, Value exclusion for combinations); bulk edit supports Overwrite/Clear/Add/Remove per field block, up to 1000 variants selected at once.
- Cross-Selling: Dynamic product group or Manual selection, with Title, Active, Position and (for dynamic) Sorting and maximum number of products.
- Bundles tab: "Add product to bundles" / "Manage bundles"; the assignment between products and bundles is synchronized in both directions.
- Digital products: uploaded as a file bound to the product; customers receive the file by email and can re-download it from Orders in their account.

## Essential identifiers
- Required fields: `Name`, `Product number`, `Tax rate`, `Price (gross)`, `Price (net)`, `Stock`
- Supported video formats: `webm, mkv, flv, ogv, ogg, avi, mov, wmv, mp4`
- 3D model format: `glb`
- SEO link placeholder: `124c71d524604ccbad6042edce3ac799`

## Gotchas
- The MOV video format may not play correctly in some browsers (e.g. Chrome) since it is a proprietary Apple format; MP4 is recommended for best compatibility.
- 3D files are not automatically optimized for storefront rendering; upload already-optimized files.
- Bulk edit cannot set the cover image across multiple variants, and updating the gross price does not update the net price.

## Version notes
- Stock management logic changed before Shopware 6.6.0.0; older versions use a different stock management approach.
