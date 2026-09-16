---
id: platform/dev/6.7/products/digital-sales-rooms/configuration/config-with-cli.md
title: Configuration with CLI
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/configuration/config-with-cli.html
sourceHash: 9f01724c13af921c9c0d6acf7f9f5a2e3851202b
codeCheckedAgainst: "6.7.13.0"
keywords: ["composer dsr:config", "composer dsr:domain-setup", "composer dsr:daily-setup", "composer dsr:mercure-setup", "digital sales rooms", "dsr", "cli configuration", "composer script", "daily.co", "mercure hub", "domain setup", "setup automation"]
summary: "Digital Sales Rooms CLI setup: composer dsr:config runs dsr:domain-setup, dsr:daily-setup and dsr:mercure-setup from the plugin root."
lastBuilt: 2026-09-15
---
## What it is

Describes the Composer scripts shipped with the *Digital Sales Rooms* (DSR) plugin that apply its configuration from the command line instead of performing each setup step manually. One umbrella command runs three individual setup commands.

## When to use

- Configuring a DSR installation quickly and in one go (domains, Daily.co video, Mercure realtime hub).
- Re-running only one part of the configuration, e.g. just the Mercure hub, by calling the individual setup command.

## Key steps / config

1. Change into the root folder of the DSR plugin.
2. Run the umbrella command:

```bash
composer dsr:config
```

It executes the following setup commands:

| Step | Command | Purpose |
|---|---|---|
| 1. Domain Setup | `composer dsr:domain-setup` | Sets up the domain configuration for Digital Sales Rooms |
| 2. Daily.co Setup | `composer dsr:daily-setup` | Sets up Daily.co for real-time video/audio calling |
| 3. Mercure Setup | `composer dsr:mercure-setup` | Sets up the Mercure hub for real-time updates and notifications |

Each of the three commands can also be run separately to configure only that part.

## Essential identifiers

- `composer dsr:config`
- `composer dsr:domain-setup`
- `composer dsr:daily-setup`
- `composer dsr:mercure-setup`

## Gotchas

- Run the commands from the plugin's root folder, not the shop root: they are Composer scripts of the DSR plugin, not Shopware core console commands.

## Code check (6.7.13.0)
- unverified `composer dsr:config` — Composer script of the licensed DSR plugin; no DSR code in vendor/shopware core, storefront or administration
- unverified `composer dsr:domain-setup` — DSR plugin Composer script, outside vendor/shopware scope
- unverified `composer dsr:daily-setup` — DSR plugin Composer script, outside vendor/shopware scope
- unverified `composer dsr:mercure-setup` — DSR plugin Composer script, outside vendor/shopware scope
