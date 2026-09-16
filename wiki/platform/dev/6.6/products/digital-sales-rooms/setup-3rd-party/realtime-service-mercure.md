---
id: platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md
title: Realtime Service - Mercure
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.html"
sourceHash: 45c4b39078e0173b3ff0dc853cf9853dfb9337d3
keywords: ["Mercure", "Mercure hub", "Stackhero", "local-mercure-sample", "docker-compose", "CORS allowed origins", "publish allowed origins", "publisher key", "subscriber key", "JWT key", "hub url", "plugin-config"]
summary: "How to set up a Mercure hub for Digital Sales Rooms via Stackhero or Docker, configure CORS/JWT keys, and attach hub info to the plugin."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/products/digital-sales-rooms/configuration/plugin-config.md"]
---
## What it is

This page documents setting up a Mercure hub (a protocol for publishing server-to-client updates) for Digital Sales Rooms, and configuring it for the plugin.

## When to use

Use when enabling the realtime service for Digital Sales Rooms, needed to power realtime updates between attendees.

## Key steps / config

Two setup options:

- **Via Stackhero (recommended)**: create a Stackhero account, access the dashboard, create a new stack with the Mercure Hub service, then open Configure and copy the general settings into the plugin's configuration page (`../configuration/plugin-config.md#realtime-service`).
- **Via Docker**: clone the `local-mercure-sample` repository (github.com/shopware/local-mercure-sample) and run it with `docker-compose`. For security, use different publisher and subscriber keys in production.

Config Mercure hub:
- Set up CORS allowed origins — the domain hosting the Shopware Frontends app.
- Set up publish allowed origins — the frontend domain and the backend API domain (HTTPS, no protocol prefix expected).
- Set up the publisher (JWT) key.
- Set up the subscriber (JWT) key.

Attach hub information to Digital Sales Rooms in the plugin configuration page (Realtime service section):
- Hub url
- Hub public url (usually same as hub url)
- Hub subscriber secret (JWT key for subscribers)
- Hub publisher secret (JWT key for publishers)

## Essential identifiers

- Mercure hub
- `local-mercure-sample` repo
- `docker-compose`
- Plugin config section: Configuration Page - Realtime service

## Gotchas

Use different publisher and subscriber JWT keys in production mode for security reasons.
