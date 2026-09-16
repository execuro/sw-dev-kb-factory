---
id: platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md
title: Realtime Service - Mercure
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.html
sourceHash: 180fc8dabc2e556adfd407de2a0c37ed4156602b
codeCheckedAgainst: "6.7.13.0"
keywords: ["mercure", "mercure hub", "realtime service", "digital sales rooms", "stackhero", "local-mercure-sample", "hub url", "publisher secret", "subscriber secret", "jwt", "cors allowed origins", "publish allowed origins"]
summary: Set up a Mercure hub (Stackhero or local Docker sample) for Digital Sales Rooms realtime updates - hub URLs, JWT publisher/subscriber keys, CORS origins.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md"]
---
## What it is

How to provide the Mercure hub that Digital Sales Rooms uses for realtime updates. Mercure is an open protocol for pushing updates from server to client, an alternative to timer-based polling and WebSocket. Symfony ships a component built on it.

## When to use

When setting up Digital Sales Rooms and you need the realtime service values for the plugin configuration's realtime section.

## Key steps / config

**Option A — Stackhero (recommended by the docs)**

1. Create a Stackhero account and open the dashboard.
2. Under **Stacks**, create a new stack with the **Mercure Hub** service. The "Hobby" plan is enough for a small demo with a few people.
3. Open **Configure** on the created stack and collect:
   - *Hub url* — the hub URL
   - *Hub public url* — usually the same as the hub URL
   - *Hub subscriber secret* — JWT key for authenticating subscribers
   - *Hub publisher secret* — JWT key for authenticating publishers
4. Paste them into the realtime service inputs of the [plugin configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md).

**Option B — Docker**

Clone `https://github.com/shopware/local-mercure-sample` and run it with docker-compose.

**Harden the hub**

- *CORS allowed origins*: the domain hosting the Shopware Frontends app, e.g. `https://dsr.shopware.io`.
- *Publish allowed origins*: every domain that calls the Mercure service, e.g. the frontend `https://dsr.shopware.io` and the backend API `https://shopware.store`. Requests from other domains are rejected.
- Set a publisher (JWT) key and a subscriber (JWT) key of your choice.

## Essential identifiers

- Hub url, Hub public url, Hub subscriber secret, Hub publisher secret
- `local-mercure-sample` (github.com/shopware)
- CORS allowed origins, publish allowed origins

## Gotchas

- Use different publisher and subscriber keys in production.
- Domains missing from publish allowed origins get their requests rejected.
- Per the source, publish allowed origins should be entered without the HTTP protocol, but its own examples include `https://`. Check which format your hub accepts.

## Code check (6.7.13.0)
- unverified `Mercure` — no reference in vendor/shopware core, storefront or administration; used by the licensed DSR plugin
- unverified `Hub publisher secret` — plugin configuration field of the licensed DSR plugin, not installed
- unverified `Hub subscriber secret` — plugin configuration field of the licensed DSR plugin, not installed
- unverified `local-mercure-sample` — external repository, outside vendor/shopware
