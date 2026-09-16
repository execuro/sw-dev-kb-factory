---
id: platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md
title: Realtime Video Call - Daily.co
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.html
sourceHash: 3d227dc1a3df112fc09d56c333972e07fb5ef006
keywords: ["digital sales rooms", "DSR", "Daily.co", "realtime video call", "video call setup", "Daily.co dashboard", "API key", "video and audio config", "plugin-config", "third-party integration", "video streaming", "DSR video call"]
summary: "How to get a Daily.co API key and configure it in the Digital Sales Rooms plugin for realtime video calls."
relatedPages: ["platform/dev/6.6/products/digital-sales-rooms/configuration/plugin-config.md"]
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to set up Daily.co, the third-party service the Digital Sales Rooms (DSR) plugin uses for streaming realtime video between attendees in a sales room.

## When to use

Follow this procedure while completing DSR's third-party setup, before realtime video calls in the DSR frontend can work, since the plugin needs a valid Daily.co API key configured.

## Key steps / config

1. Go to the Daily.co dashboard (`https://dashboard.daily.co/`) and log in or register a Daily.co account.
2. Open the "developers" section in the left navigation.
3. Copy the API key shown there.
4. Paste the API key into the DSR plugin's configuration, under the video and audio settings, described on `platform/dev/6.6/products/digital-sales-rooms/configuration/plugin-config.md`.

## Essential identifiers

- Daily.co dashboard — where the API key is generated, under the "developers" section.
- API key — the credential copied from Daily.co and pasted into the DSR plugin's video/audio configuration.
