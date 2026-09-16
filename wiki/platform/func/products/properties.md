---
id: platform/func/products/properties.md
title: Properties
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/products/properties"
sourceHash: "2d13b52a34268e032ad187664e6a975428bfaf220a12c21f880ca6073ca6f9c6"
revision: { current: true, range: "6.2.0 - 6.3.5.4", swMax: "6.3.5.4", swMin: "6.2.0" }
keywords: ["properties", "property values", "product filter", "variants", "Catalogues > Properties", "property options", "sorting alphanumeric", "individual sorting", "position field", "colour view", "image view", "text view", "dropdown view", "add value"]
summary: "Creating filterable product properties and their option values, including display views and sorting, under Catalogues > Properties."
lastBuilt: "2026-09-15"
---
## What it is
This page documents product properties: filterable attributes used both in the storefront product filter and as the basis for generating product variants.

## When to use
Use this when defining a filterable attribute (e.g. size, colour) and its option values for products, or when configuring how a property is displayed and sorted in the storefront.

## Key steps / config
- Overview at **Catalogues > Properties** lists existing properties with their values and optional description, and whether each is shown in the product filter. The **"..."** context menu opens, edits, or deletes a property; **Add** opens the creation mask.
- Deleting a property removes it, with all its options, from every product it is assigned to.
- Creating a property: enter a **name**, an optional **description**, and whether it appears in the product filter. Choose a display **view**:
  - Image — an image per option, shown in filters.
  - Text — options shown as text in filters.
  - Dropdown — a variant's selected value shown in a dropdown on the product detail page; options shown as text in filters.
  - Colour — a highlighted colour per option, shown in filters.
- Choose a **sorting** option: Alphanumeric (letters a,b,c…, numbers by numeric order) or Individual (order set via the position field on each option).
- **Position** sets the property's own order on product detail pages.
- After saving the property, use **Add value** to add an option: set its **name** (shown in text view), **position** (lower value = higher in list), a **colour** (HEX or from a palette, used with the Colour view), or a **Default image** (used with the Image view). Images can be uploaded from existing media, as a new file via **Upload files**, or via URL. Click **Apply** to save the option.

## Essential identifiers
- Admin path: **Catalogues > Properties**.
- Views: Image, Text, Dropdown, Colour.
- Sorting modes: Alphanumeric, Individual.

## Gotchas
Deleting a property removes it and all its options from every assigned product, not just from the list.
