---
id: platform/dev/6.7/products/digital-sales-rooms/customization/component.md
title: Component Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/customization/component.html
sourceHash: df4c68ee5ed34224f9ea6e9e087af0bbd15bd5fb
codeCheckedAgainst: "6.7.15.1"
keywords: ["digital sales rooms", "dsr", "component override", "SwWishlistButton", "SwWishlistButton.vue", "dsr/components", "wishlist button", "nuxt layer", "customization layer", "vue component", "frontend template"]
summary: "Override a Digital Sales Rooms frontend component (e.g. SwWishlistButton.vue) by copying it from dsr/components into your Nuxt customization layer."
lastBuilt: 2026-10-21
---
## What it is

How to customize a component of the Digital Sales Rooms (DSR) frontend template using the Nuxt layer concept, shown with the "Wishlist" button (`SwWishlistButton.vue`). A component of the same name in your customization layer replaces the default-layer one without touching core files.

## When to use

You need to change the template, style or behaviour of a shipped DSR frontend component and want the change to live in your own layer.

## Key steps / config

1. Inspect the default layer: all available components are under `dsr/components`. The wishlist button is `dsr/components/shared/molecules/SwWishlistButton.vue`.
2. Copy `SwWishlistButton.vue` into your custom layer, so the custom layer holds the same default component.
3. Modify the copy — style, template or added functionality.
4. The frontend app now ignores `SwWishlistButton` from the default layer and uses only the one from the custom layer.

## Essential identifiers

- `dsr/components` — default-layer component directory
- `dsr/components/shared/molecules/SwWishlistButton.vue`
- `SwWishlistButton` — component name that the custom-layer copy takes over

## Gotchas

- The override is by component name: the custom-layer file must keep the name `SwWishlistButton.vue` to replace the default one.
- All paths in the guide are relative to your customization layer folder.

## Code check (6.7.15.1)
- unverified `SwWishlistButton` — DSR frontend template component, not part of vendor/shopware core, storefront or administration
- unverified `dsr/components` — directory of the DSR frontend Nuxt layer, outside the checked vendor roots
