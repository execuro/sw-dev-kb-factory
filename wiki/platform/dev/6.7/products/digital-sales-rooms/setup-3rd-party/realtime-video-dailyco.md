---
id: platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md
title: Realtime Video Call - Daily.co
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.html
sourceHash: d74f990dff51d5e6ca81c47942923d905df62587
codeCheckedAgainst: "6.7.13.0"
keywords: ["daily.co", "dailyco", "video call", "realtime video", "api key", "digital sales rooms", "dsr", "video and audio", "streaming"]
summary: Get the Daily.co API key that Digital Sales Rooms uses for realtime video calls and enter it in the plugin's video and audio configuration.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md"]
---
## What it is

Daily.co is the service that streams video between the attendees of a Digital Sales Room. This page covers getting its API key.

## When to use

When configuring video and audio for Digital Sales Rooms.

## Key steps / config

1. Open the Daily.co dashboard (dashboard.daily.co) and log in, or register a Daily.co account.
2. Go to the "developers" section in the left navigation.
3. Copy the **API KEY** and paste it into the video and audio section of the [plugin configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md).

## Code check (6.7.13.0)
- unverified `Daily.co` — external video service; no reference in vendor/shopware core, storefront or administration
- unverified `API KEY` — video and audio configuration field of the licensed DSR plugin, not installed
