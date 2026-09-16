---
id: platform/dev/6.6/products/digital-sales-rooms/installation/admin-side-installation.md
title: Admin side installation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/installation/admin-side-installation.html
sourceHash: f67c042ac7e5f28ddb559e60d7738019af4c4d5e
keywords: ["digital sales rooms", "DSR", "admin side installation", "SwagDigitalSalesRooms", "licensed plugin", "Shopware Beyond", "wildcard environment", "plugin:refresh", "plugin:install", "cache:clear", "custom/plugins", "composer install"]
summary: "How to get and install the Digital Sales Rooms plugin (SwagDigitalSalesRooms) into a Shopware instance via download or composer."
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to get and install the Digital Sales Rooms (DSR) plugin into a local Shopware instance. DSR is a licensed plugin available as part of the Shopware Beyond plan, and it can be obtained and installed the same way as any other licensed plugin — via composer, direct download, or through the Shopware Account.

## When to use

Follow this procedure after you have access to Shopware Beyond and need to add the DSR plugin's admin-side part to an existing Shopware instance, before installing and connecting the separate frontend template.

## Key steps / config

1. Get the plugin: as a Shopware Beyond merchant, access your Shopware account and create a wildcard environment with the DSR plugin attached to it.
2. **Via download**: on the wildcard environment detail page, click the plugin, then click "Download"; save the zip file; in your Shopware source code go to the `custom/plugins` directory and extract the zip there under the name `SwagDigitalSalesRooms`.
3. **Via composer**: on the wildcard environment detail page, click the plugin, then click "Install via composer"; a modal appears with the command lines to run.
4. Install and activate the plugin using the Symfony console commands:

```bash
bin/console plugin:refresh
bin/console plugin:install SwagDigitalSalesRooms --activate
bin/console cache:clear
```

## Essential identifiers

- `SwagDigitalSalesRooms` — the plugin's technical name, used both as the target directory name and the `plugin:install` argument.
- `custom/plugins` — the directory the downloaded plugin zip is extracted into.
- `bin/console plugin:refresh` / `bin/console plugin:install SwagDigitalSalesRooms --activate` / `bin/console cache:clear` — the console commands to refresh, install/activate, then clear the cache.

## Gotchas

DSR is a licensed plugin tied to the Shopware Beyond plan; access to the wildcard environment and the plugin download/composer option requires that plan.
