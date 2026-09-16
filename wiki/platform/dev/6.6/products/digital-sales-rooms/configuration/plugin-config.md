---
id: platform/dev/6.6/products/digital-sales-rooms/configuration/plugin-config.md
title: Plugin Configuration
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/configuration/plugin-config.html
sourceHash: 5f3c43392423ba835470ab775fd52f3730850139
keywords: ["Digital Sales Rooms", "DSR", "plugin configuration", "Marketing menu", "Appointments", "Video and Audio", "Realtime service", "Daily.co", "Mercure", "Available domains", "API base url", "Hub url"]
summary: "Fields on the Digital Sales Rooms configuration page: Appointments, Video and Audio (Daily.co), and Realtime service (Mercure)."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md", "platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md", "platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md"]
---
## What it is
The Digital Sales Rooms plugin configuration page, reached in Shopware CMS via Marketing > Digital Sales Rooms > Configuration; most settings are already filled by default, but some must be set manually.

## When to use
Use this after installation, once domains are configured and third-party services (Daily.co, Mercure) are set up, to wire those values into the plugin.

## Key steps / config
Navigate to Marketing > Digital Sales Rooms > Configuration in Shopware CMS, then fill:

- **Appointments**
  - *Available domains* — select the Digital Sales Rooms domains from [Domain Configuration](platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md).
- **Video and Audio**
  - *API base url* — use `https://api.daily.co/v1/`
  - *API key* — from the [Daily.co setup section](platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md).
- **Realtime service**
  - *Hub url*, *Hub public url*, *Hub subscriber secret*, *Hub publisher secret* — all from the [Mercure setup section](platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md).

## Essential identifiers
- `https://api.daily.co/v1/` (API base url)
- Appointments / Video and Audio / Realtime service (configuration tabs)
