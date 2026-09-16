---
id: platform/dev/6.6/products/digital-sales-rooms/customization/component.md
title: Component Customization
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/customization/component.html
sourceHash: df4c68ee5ed34224f9ea6e9e087af0bbd15bd5fb
keywords: ["digital sales rooms", "DSR", "component customization", "Nuxt layer", "SwWishlistButton.vue", "dsr/components", "wishlist button", "customization layer", "Vue component override", "frontend template", "molecules", "DSR frontend"]
summary: "Walks through overriding a component (the Wishlist button) in the DSR frontend using the Nuxt layer concept."
lastBuilt: "2026-09-15"
---
## What it is

This page demonstrates how to customize a single component — specifically the "Wishlist" button — in the Digital Sales Rooms (DSR) frontend template, using the Nuxt layer concept to extend or modify default components without altering the core files. All customization instructions on this page refer to changes made inside your own customization layer folder, not the default `dsr` layer.

## When to use

Follow this procedure whenever you need to change the style, functionality, or template of an existing DSR frontend component — for example restyling or extending the Wishlist button — while keeping the default layer's component untouched so future template updates can still be applied cleanly.

## Key steps / config

1. Understand the structure of the default layer first: components live under the `dsr/components` directory.
2. Locate the target component. In this example it is `SwWishlistButton.vue`, found inside `dsr/components/shared/molecules/`.
3. Copy `SwWishlistButton.vue` into the equivalent path inside your own customization layer.
4. Edit the copied component in your custom layer — change the style, add new functionality, or update the template as needed.
5. Once the component exists in your custom layer, the frontend app ignores the `SwWishlistButton` from the default layer and uses only the one from your custom layer.

## Essential identifiers

- `SwWishlistButton.vue` — the example component being customized.
- `dsr/components/shared/molecules/` — the default layer path where the component originally lives.
- `dsr/components` — the root directory of the default layer's components.
