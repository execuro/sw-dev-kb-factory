---
id: platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md
title: Plugin Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/configuration/plugin-config.html
sourceHash: f5a4730cc23da5fd257672f381e87e38e2b3cdb1
codeCheckedAgainst: "6.7.15.1"
keywords: ["digital sales rooms", "dsr", "plugin configuration", "available domains", "api base url", "api key", "daily.co", "hub url", "hub public url", "hub subscriber secret", "hub publisher secret", "mercure", "sw-marketing"]
summary: Required Digital Sales Rooms plugin settings - available domains, Daily.co API base URL and key, Mercure hub URLs and secrets.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md", "platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md", "platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md"]
---
## What it is

The settings on the *Digital Sales Rooms* plugin configuration page that are not prefilled and must be set manually. Most other settings on the page already have defaults.

## When to use

After installing the plugin and adding the DSR domains to a sales channel, to connect appointments to those domains and to wire up Daily.co (video/audio) and Mercure (realtime service).

## Key steps / config

Open the Administration and go to **Marketing** > **Digital Sales Rooms** > **Configuration**, then fill:

### Appointments

- *Available domains* — select box listing the domains of all sales channels; pick the DSR domains created in platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md.

### Video and Audio

- *API base url* — `https://api.daily.co/v1/`
- *API key* — the Daily.co API key (see platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md)

### Realtime service

- *Hub url*
- *Hub public url*
- *Hub subscriber secret*
- *Hub publisher secret*

All four come from the Mercure hub setup (Stackhero is the recommended route; see platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md).

## Essential identifiers

- Menu path: **Marketing** > **Digital Sales Rooms** > **Configuration**
- *Available domains*, *API base url*, *API key*, *Hub url*, *Hub public url*, *Hub subscriber secret*, *Hub publisher secret*

## Gotchas

- *Available domains* only lists domains already assigned to a sales channel; add the DSR domains first.
- The source calls the Administration "Shopware CMS"; the menu entry sits under the core **Marketing** main menu.

## Code check (6.7.15.1)
- confirmed `sw-marketing` — core Administration Marketing main-menu entry the plugin entry sits under — vendor/shopware/administration/Resources/app/administration/src/module/sw-promotion-v2/index.js:160
- unverified `Available domains` — setting of the separate Digital Sales Rooms plugin; not in vendor/shopware core
- unverified `API base url` — plugin setting; no Daily.co code in vendor/shopware core
- unverified `API key` — plugin setting; not in vendor/shopware core
- unverified `Hub url` — plugin setting; no Mercure code in vendor/shopware core
- unverified `Hub subscriber secret` — plugin setting; not in vendor/shopware core
- unverified `Hub publisher secret` — plugin setting; not in vendor/shopware core
