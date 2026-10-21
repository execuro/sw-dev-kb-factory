---
id: platform/dev/6.7/products/digital-sales-rooms/installation/admin-side-installation.md
title: Admin side installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/installation/admin-side-installation.html
sourceHash: 6bcae8f1392d246a3af99030cd02697a2a6ce467
codeCheckedAgainst: "6.7.15.1"
keywords: ["digital sales rooms", "dsr", "SwagDigitalSalesRooms", "plugin:refresh", "plugin:install", "--activate", "cache:clear", "custom/plugins", "wildcard environment", "shopware beyond", "licensed plugin", "composer install"]
summary: "Get the licensed SwagDigitalSalesRooms plugin via a Shopware Beyond wildcard environment (composer or zip) and activate it with plugin:install --activate."
lastBuilt: 2026-10-21
---
## What it is

How to obtain and install the licensed **Digital Sales Rooms** plugin (`SwagDigitalSalesRooms`) into a local Shopware instance. It is available as an extension in the Shopware Beyond plan and, like other plugins, can be installed via composer, direct download or the Shopware Account.

## When to use

You are a Shopware Beyond merchant (or developer for one) and need the DSR plugin installed and active before setting up the DSR frontend.

## Key steps / config

**Get the plugin**

1. In the Shopware Account (`https://account.shopware.com`), create a wildcard environment with the plugin attached.
2. Then either:
   - **Composer**: on the wildcard environment detail page, click the plugin, then "Install via composer"; a modal lists the command lines to run.
   - **Download**: click the plugin, then "Download", save the zip, and extract it into the instance's `custom/plugins` directory as `SwagDigitalSalesRooms`.

**Install and activate**

```bash
bin/console plugin:refresh
bin/console plugin:install SwagDigitalSalesRooms --activate
bin/console cache:clear
```

`plugin:refresh` updates the plugin list; the plugin name to pass is the first column of that list (`SwagDigitalSalesRooms`). `--activate` (short `-a`) activates the plugin right after installation.

## Essential identifiers

- `SwagDigitalSalesRooms` — plugin name / directory name
- `custom/plugins` — plugin directory for zip installs
- `bin/console plugin:refresh`
- `bin/console plugin:install SwagDigitalSalesRooms --activate`
- `bin/console cache:clear`

## Gotchas

- The extracted folder must be named `SwagDigitalSalesRooms`, otherwise the plugin name used in `plugin:install` will not match.
- The plugin is licensed; without a Shopware Beyond plan / wildcard environment it cannot be fetched this way.

## Code check (6.7.15.1)
- confirmed `plugin:refresh` — console command name of PluginRefreshCommand — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:22
- confirmed `plugin:install` — console command name of PluginInstallCommand — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:28
- confirmed `--activate` — option `activate` (short `a`) activates plugins after installation — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:52
- confirmed `custom/plugins` — default plugin directory of KernelPluginLoader — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
- unverified `cache:clear` — Symfony framework command, vendor/symfony out of scope
- unverified `SwagDigitalSalesRooms` — licensed extension, not shipped in vendor/shopware core, storefront or administration
