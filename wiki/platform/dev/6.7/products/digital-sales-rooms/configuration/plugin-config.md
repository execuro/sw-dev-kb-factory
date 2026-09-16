---
id: platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md
title: Plugin Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/configuration/plugin-config.html
sourceHash: f5a4730cc23da5fd257672f381e87e38e2b3cdb1
codeCheckedAgainst: "6.7.13.0"
keywords: ["digital sales rooms", "dsr", "plugin configuration", "available domains", "api base url", "daily.co api key", "hub url", "hub public url", "hub subscriber secret", "hub publisher secret", "mercure", "marketing menu", "appointments"]
summary: "Digital Sales Rooms plugin settings to fill: Available domains, Daily.co API base url and key, Mercure hub URLs and subscriber/publisher secrets."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md", "platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md", "platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md"]
---
## What it is

The Administration configuration page of the *Digital Sales Rooms* (DSR) plugin. Most settings come prefilled with defaults; this page lists the ones that must be set manually.

## When to use

- After installing DSR, setting up its domains and the Daily.co and Mercure third-party services.
- When appointments, video/audio or realtime updates do not work because a setting is empty.

## Key steps / config

Open the Administration and go to **Marketing** > **Digital Sales Rooms** > **Configuration**, then fill:

### Appointments

- *Available domains* — select box listing the domains of all sales channels; choose the DSR domains created in [Domain Configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md).

### Video and Audio

- *API base url* — `https://api.daily.co/v1/`
- *API key* — the Daily.co API key, see [Daily.co setup](platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md).

### Realtime service

- *Hub url*
- *Hub public url*
- *Hub subscriber secret*
- *Hub publisher secret*

Values for all four come from the Mercure hub, see [Mercure setup](platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md) (the docs recommend the Stackhero setup).

## Essential identifiers

- Menu path: **Marketing** > **Digital Sales Rooms** > **Configuration**
- Settings: *Available domains*, *API base url*, *API key*, *Hub url*, *Hub public url*, *Hub subscriber secret*, *Hub publisher secret*
- Daily.co API base URL: `https://api.daily.co/v1/`

## Gotchas

- Only a few fields need manual input; the rest keep their defaults.
- *Available domains* shows domains of every sales channel — selecting a non-DSR domain is a likely misconfiguration.

## Code check (6.7.13.0)
- unverified `Available domains` — DSR plugin config field; licensed plugin code not in vendor/shopware core, storefront or administration
- unverified `API base url` — DSR plugin config field for Daily.co, outside vendor/shopware scope
- unverified `API key` — DSR plugin config field for Daily.co, outside vendor/shopware scope
- unverified `Hub url` — DSR Mercure setting, outside vendor/shopware scope
- unverified `Hub public url` — DSR Mercure setting, outside vendor/shopware scope
- unverified `Hub subscriber secret` — DSR Mercure setting, outside vendor/shopware scope
- unverified `Hub publisher secret` — DSR Mercure setting, outside vendor/shopware scope
- unverified `https://api.daily.co/v1/` — third-party Daily.co endpoint, outside vendor/shopware scope
