---
id: platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md
title: Realtime Service - Mercure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.html
sourceHash: 180fc8dabc2e556adfd407de2a0c37ed4156602b
codeCheckedAgainst: "6.7.15.1"
keywords: ["mercure", "mercure hub", "realtime service", "digital sales rooms", "stackhero", "local-mercure-sample", "hub url", "hub public url", "publisher secret", "subscriber secret", "jwt key", "cors allowed origins", "publish allowed origins"]
summary: Set up a Mercure hub for Digital Sales Rooms via Stackhero or Docker (local-mercure-sample), then configure CORS/publish origins and JWT keys.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md"]
---
## What it is

Setup guide for the Mercure hub that Digital Sales Rooms uses as its realtime service. Mercure is an open protocol for pushing updates from server to client, an alternative to timer-based polling and WebSocket; Symfony provides a component built on it.

## When to use

When installing Digital Sales Rooms and you need a Mercure hub whose settings go into the plugin's realtime service configuration.

## Key steps / config

Set up the hub with one of these options:

- **Stackhero (recommended, tested by Shopware)**: create a Stackhero account, open the dashboard, and in **Stacks** choose **create a new stack** with the **Mercure Hub** service. Open **Configure** on the new stack to find:
  - *Hub url*: the hub URL
  - *Hub public url*: usually the same as the hub URL
  - *Hub subscriber secret*: JWT key for authenticating subscribers
  - *Hub publisher secret*: JWT key for authenticating publishers

  Copy these values into the realtime service inputs of the [plugin configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md). For a small demo with a few people, the "Hobby" plan is enough.
- **Docker**: clone `https://github.com/shopware/local-mercure-sample` and run it with docker-compose.

Then secure the hub:

- **CORS allowed origins**: the domain hosting the Shopware Frontends app, e.g. `https://dsr.shopware.io`.
- **Publish allowed origins**: every domain that sends requests to Mercure, otherwise those requests are rejected. Example: `https://dsr.shopware.io` (frontend) and `https://shopware.store` (backend API).
- **Publisher (JWT) key** and **subscriber (JWT) key**: any values you choose.

## Gotchas

- Use different publisher and subscriber keys in production.
- Leaving a domain out of publish allowed origins gets its requests rejected.

## Code check (6.7.15.1)
- unverified `Mercure` — no Mercure integration in the Shopware core, storefront or administration packages; provided by the DSR plugin and external hub
- unverified `Hub publisher secret` — Stackhero/Mercure hub setting, outside the Shopware packages
- unverified `Hub subscriber secret` — Stackhero/Mercure hub setting, outside the Shopware packages
- unverified `local-mercure-sample` — separate Shopware GitHub repository, out of scope
