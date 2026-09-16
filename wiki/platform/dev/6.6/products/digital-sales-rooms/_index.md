---
id: platform/dev/6.6/products/digital-sales-rooms/_index.md
title: Digital Sales Rooms
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/
sourceHash: 2f138f70bd05750953fe798dd66d6c19d9346ee3
keywords: ["Digital Sales Rooms", "DSR", "Nuxt", "Nuxt 3", "Daily.co", "Mercure", "live video", "devenv", "Shopware Frontends", "license extension", "Storefront domain", "frontend app", "pnpm", "node"]
summary: "Digital Sales Rooms is a licensed Shopware extension for live video sales events, run as a standalone Nuxt frontend app."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md", "platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md"]
---
## What it is
Digital Sales Rooms is a licensed Shopware extension for running interactive live video events (e.g. product demos, sales calls) integrated with a Shopware store, without switching between separate presentation, video-conferencing, and store systems.

## When to use
Use this page as the entry point before installing Digital Sales Rooms: it lists the prerequisites and points to installation, third-party setup, and plugin configuration, which must all be performed to use the plugin.

## Key steps / config
Minimum requirements before installing:
- `node` >= v18
- `pnpm` >= 8
- Shopware Frontends framework (Nuxt 3 based)
- A Shopware 6 instance, version 6.6.0 or above (installing via `devenv` is recommended)
- Third-party services: Daily.co for [realtime video call](platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md), and Mercure for the [realtime service](platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md)

To use the plugin you must perform installation, 3rd-party setup, and plugin configuration.

## Essential identifiers
- Daily.co — realtime video provider
- Mercure — realtime pub/sub service used for live updates

## Gotchas
- Digital Sales Rooms is a license extension and is not available as open source.
- The Digital Sales Rooms application does not belong to the default Storefront: it is a standalone Nuxt-based frontend app hosted on a separate instance and domain from the Storefront.
