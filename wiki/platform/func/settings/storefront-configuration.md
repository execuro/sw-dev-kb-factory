---
id: platform/func/settings/storefront-configuration.md
title: Storefront Configuration
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/storefront-configuration
sourceHash: 1dfb43a8bb90032a8f408282346950bd39d6926ae3641bae2138b118754bcfa6
revision:
  current: true
  range: "current"
  swMin: null
  swMax: null
keywords: ["storefront configuration", "icon cache", "compile theme in the background", "speculation rules API", "message queue", "theme compilation", "performance settings", "Settings > System > Storefront"]
summary: "Performance/UX toggles under Settings > System > Storefront: icon cache, background theme compilation, and the experimental Speculation Rules API."
lastBuilt: "2026-09-15"
---

## What it is

Storefront Configuration, under **Settings > System > Storefront**, groups a few options to improve storefront performance and user experience.

## When to use

Use it to reduce duplicate SVG markup, avoid blocking theme saves on synchronous compilation, or opt into experimental navigation-speed improvements.

## Key steps / config

- **Activate icon cache**: prevents duplicate SVG code in the HTML when the same icon renders multiple times on a page, reusing the first found icon's SVG code.
- **Compile theme in the background**: compiles the theme asynchronously via the message queue, reducing wait time when saving theme configuration; a notification appears once compilation completes.
- **Speculation rules API (Experimental)**: improves performance for future navigations, e.g. when moving from a listing to a detail page.

## Essential identifiers

- Menu path: **Settings > System > Storefront**
- Options: Activate icon cache, Compile theme in the background, Speculation rules API (Experimental)
