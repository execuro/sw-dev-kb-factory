---
id: platform/dev/6.7/products/digital-sales-rooms/customization/component.md
title: Component Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/customization/component.html
sourceHash: df4c68ee5ed34224f9ea6e9e087af0bbd15bd5fb
codeCheckedAgainst: "6.7.13.0"
keywords: ["digital sales rooms", "dsr", "SwWishlistButton", "SwWishlistButton.vue", "dsr/components", "component override", "vue component", "nuxt layer", "custom layer", "wishlist button"]
summary: Override a DSR frontend Vue component (e.g. SwWishlistButton.vue) by copying it from dsr/components into the same path of your custom Nuxt layer.
lastBuilt: 2026-09-15
---
## What it is

How to customize a component of the Digital Sales Rooms (DSR) Nuxt frontend — shown with the "Wishlist" button — via the Nuxt layer concept, without altering the default layer's files. All changes happen inside your customization layer folder.

## When to use

You need to change the template, style, or behavior of a shipped DSR component.

## Key steps / config

1. Inspect the default layer's components in `dsr/components`.
2. Locate the component to change — here `SwWishlistButton.vue` in `dsr/components/shared/molecules/`.
3. Copy the file into your custom layer (mirroring its location) so the same component exists there.
4. Modify the copy: styling, new functionality, or template changes.
5. The app now ignores `SwWishlistButton` from the default layer and uses only the one from your custom layer.

## Essential identifiers

- `dsr/components` — default layer component directory
- `dsr/components/shared/molecules/SwWishlistButton.vue`
- `SwWishlistButton` — example component name

## Gotchas

- The override replaces the whole component; the default version is no longer used, so the copy must contain everything you still need.

## Code check (6.7.13.0)
- unverified `SwWishlistButton` — DSR Nuxt frontend component; no match in vendor/shopware core, storefront or administration
- unverified `dsr/components` — directory of the separate DSR frontend template, out of scope of the installed Shopware code
