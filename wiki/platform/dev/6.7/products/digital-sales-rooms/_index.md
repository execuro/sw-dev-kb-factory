---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/digital-sales-rooms/_index.md
relatedPages:
  - platform/dev/6.7/guides/installation/_index.md
  - platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md
  - platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md
sourceHash: 7d0ca1c8b3a2109854a47b2e44eedef1374c3718
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/
title: Digital Sales Rooms
version: "6.7"
versions:
  - "6.7"
keywords: ["digital sales rooms", "dsr", "live video events", "video shopping", "shopware frontends", "nuxt 3", "daily.co", "mercure", "realtime", "pnpm", "node", "license extension"]
summary: "Digital Sales Rooms overview: licensed live video selling app on Nuxt 3; needs node 18+, pnpm 8+, Shopware 6, Daily.co and Mercure."
lastBuilt: 2026-10-21
---
## What it is

Overview page of *Digital Sales Rooms*, a licensed (not open source) Shopware extension that works alongside an existing Shopware system landscape and e-commerce infrastructure. It lets merchants run interactive live video events for their customers directly from the Shopware website, so presenting products, video conferencing and the store itself do not require switching between a separate presentation tool, a video conferencing system and the store system. The stated purpose is to highlight products, engage customers and reinforce brand loyalty.

## When to use

- You are planning a Digital Sales Rooms setup and need to know which infrastructure and services are required before installation.
- You need the entry point to the setup sequence: installation, third-party service setup, and plugin configuration.

## Key steps / config

Using the Digital Sales Rooms plugin requires three parts:

1. **Installation** of the plugin and the frontend application.
2. **Third-party setup** of the realtime services.
3. **Plugin configuration**.

Minimum operating requirements before installing:

- `node` >= v18
- `pnpm` >= 8
- Shopware Frontends framework based on Nuxt 3
- A Shopware 6 instance (see [installation](platform/dev/6.7/guides/installation/_index.md))
- Third-party services:
  - Daily.co, for the realtime video call — [realtime video call setup](platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md)
  - Mercure, as the realtime service — [realtime Mercure service setup](platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md)

## Essential identifiers

- Digital Sales Rooms (license extension)
- Shopware Frontends, Nuxt 3
- Daily.co (video), Mercure (realtime)
- `node`, `pnpm`

## Gotchas

- Digital Sales Rooms is a license extension and is not available as open source.
- The Digital Sales Rooms application does not belong to the default Storefront: it is a standalone frontend app running on a Nuxt instance. This template is hosted in a separate instance under its own domain, which differs from the Storefront domain, so plan a second deployment and domain.
- Both third-party services (Daily.co and Mercure) are listed as prerequisites; each has its own setup guide.

## Code check (6.7.15.1)
- unverified `Digital Sales Rooms` — licensed extension; no code for it in vendor/shopware core, storefront or administration
- unverified `Nuxt 3` — standalone frontend app requirement, outside vendor/shopware scope
- unverified `node` — frontend toolchain requirement (>= v18), outside vendor/shopware scope
- unverified `pnpm` — frontend toolchain requirement (>= 8), outside vendor/shopware scope
- unverified `Daily.co` — third-party video service, outside vendor/shopware scope
- unverified `Mercure` — third-party realtime service, outside vendor/shopware scope
