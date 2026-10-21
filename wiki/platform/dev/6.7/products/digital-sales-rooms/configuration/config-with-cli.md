---
id: platform/dev/6.7/products/digital-sales-rooms/configuration/config-with-cli.md
title: Configuration with CLI
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/configuration/config-with-cli.html
sourceHash: 9f01724c13af921c9c0d6acf7f9f5a2e3851202b
codeCheckedAgainst: "6.7.15.1"
keywords: ["composer dsr:config", "composer dsr:domain-setup", "composer dsr:daily-setup", "composer dsr:mercure-setup", "digital sales rooms", "dsr", "cli setup", "composer script", "daily.co", "mercure hub", "domain setup", "video calling"]
summary: "composer dsr:config runs the Digital Sales Rooms domain, Daily.co and Mercure setup scripts in one go; each can also run on its own."
lastBuilt: 2026-10-21
---
## What it is

A Composer-script shortcut shipped with the *Digital Sales Rooms* plugin that applies all required configuration in one run instead of configuring each part manually.

## When to use

When configuring a fresh Digital Sales Rooms installation and you want domains, Daily.co (real-time video/audio) and the Mercure hub (real-time updates and notifications) set up in one step, or when re-running only one of those parts.

## Key steps / config

1. Change into the root folder of the plugin.
2. Run the combined command:

```bash
composer dsr:config
```

It runs these setup commands in order; each can also be executed separately to configure only that part:

| Step | Command | Sets up |
|---|---|---|
| 1. Domain setup | `composer dsr:domain-setup` | Domain configuration for Digital Sales Rooms |
| 2. Daily.co setup | `composer dsr:daily-setup` | Daily.co for real-time video/audio calls |
| 3. Mercure setup | `composer dsr:mercure-setup` | Mercure hub for real-time updates and notifications |

## Essential identifiers

- `composer dsr:config`
- `composer dsr:domain-setup`
- `composer dsr:daily-setup`
- `composer dsr:mercure-setup`

## Gotchas

- The commands are Composer scripts of the plugin, so they must be run from the plugin's root folder, not the Shopware project root.
- They are not `bin/console` commands; none of them exist in the installed core, storefront or administration code.

## Code check (6.7.15.1)
- unverified `composer dsr:config` — Composer script of the separate Digital Sales Rooms plugin; not in vendor/shopware core
- unverified `composer dsr:domain-setup` — plugin Composer script; not in vendor/shopware core
- unverified `composer dsr:daily-setup` — plugin Composer script; no Daily.co code in vendor/shopware core
- unverified `composer dsr:mercure-setup` — plugin Composer script; no Mercure code in vendor/shopware core
