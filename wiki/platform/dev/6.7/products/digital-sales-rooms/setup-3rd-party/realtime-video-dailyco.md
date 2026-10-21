---
id: platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md
title: Realtime Video Call - Daily.co
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.html
sourceHash: d74f990dff51d5e6ca81c47942923d905df62587
codeCheckedAgainst: "6.7.15.1"
keywords: ["daily.co", "dailyco", "video call", "realtime video", "video streaming", "digital sales rooms", "api key", "daily dashboard", "video and audio config"]
summary: Get a Daily.co API key from the Daily dashboard developers section for Digital Sales Rooms video calls and enter it in the plugin config.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md"]
---
## What it is

Setup for Daily.co, the service that streams video between attendees in Digital Sales Rooms.

## Key steps / config

1. Open the Daily.co dashboard at `https://dashboard.daily.co/` and log in or register.
2. Go to the "developers" section in the left navigation.
3. Copy the *API KEY* and paste it into the video and audio settings of the [plugin configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md).

## Code check (6.7.15.1)
- unverified `Daily.co` — no Daily.co integration in the Shopware core, storefront or administration packages; used by the DSR plugin
- unverified `API KEY` — Daily.co dashboard credential, outside the Shopware packages
