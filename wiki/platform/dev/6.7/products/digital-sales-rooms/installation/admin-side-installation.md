---
id: platform/dev/6.7/products/digital-sales-rooms/installation/admin-side-installation.md
title: Admin side installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/installation/admin-side-installation.html
sourceHash: 6bcae8f1392d246a3af99030cd02697a2a6ce467
codeCheckedAgainst: "6.7.13.0"
keywords: ["SwagDigitalSalesRooms", "digital sales rooms", "dsr", "plugin:refresh", "plugin:install", "cache:clear", "custom/plugins", "wildcard environment", "shopware beyond", "licensed plugin", "install plugin", "composer"]
summary: Install the licensed Digital Sales Rooms plugin (SwagDigitalSalesRooms) via wildcard environment, composer or zip, then plugin:install --activate.
lastBuilt: 2026-09-15
---
## What it is

How to obtain and install the licensed **Digital Sales Rooms** plugin (`SwagDigitalSalesRooms`) into a local Shopware 6 instance on the administration/backend side. The plugin is part of the Shopware Beyond plan and is delivered as an extension.

## When to use

Before running the Digital Sales Rooms frontend app: the Shopware backend needs the plugin installed and activated first. Skip it if you already know how to install a licensed plugin.

## Key steps / config

1. **Get the plugin** — as a Shopware Beyond merchant, log in to the Shopware Account (account.shopware.com) and create a wildcard environment with the plugin attached.
2. **Fetch it**, one of:
   - *Via composer*: on the wildcard environment detail page, click the plugin, then "Install via composer"; a modal shows the command lines to run.
   - *Via download*: click the plugin, then "Download", save the zip, and extract it into the project's `custom/plugins` directory with the folder name `SwagDigitalSalesRooms`.
   - Or through your Shopware Account.
3. **Install and activate** with the Shopware console:

```bash
bin/console plugin:refresh
bin/console plugin:install SwagDigitalSalesRooms --activate
bin/console cache:clear
```

`plugin:refresh` updates the plugin list; the plugin name is the first column of that list.

## Essential identifiers

- `SwagDigitalSalesRooms` — plugin name / directory name
- `custom/plugins` — plugin directory
- `bin/console plugin:refresh`
- `bin/console plugin:install SwagDigitalSalesRooms --activate`
- `bin/console cache:clear`

## Gotchas

- The extracted zip folder must be named exactly `SwagDigitalSalesRooms`, otherwise the plugin name will not match.
- The plugin is licensed; it is not included in the installed Shopware core packages, so its code could not be checked here.
- `plugin:install` notes that refresh and activate cannot happen in the same request for a plugin that was only just discovered; run `plugin:refresh` first as shown.

## Code check (6.7.13.0)
- confirmed `plugin:refresh` — core console command — vendor/shopware/core/Framework/Plugin/Command/PluginRefreshCommand.php:21
- confirmed `plugin:install` — core console command — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:25
- confirmed `--activate` — option of plugin:install, activates after install — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:50
- confirmed `Can not refresh and activate in same request.` — note emitted by plugin:install — vendor/shopware/core/Framework/Plugin/Command/Lifecycle/PluginInstallCommand.php:99
- confirmed `custom/plugins` — default plugin directory of the kernel plugin loader — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:50
- confirmed `cache:clear` — invoked by Shopware after lifecycle actions (Symfony command) — vendor/shopware/core/Maintenance/System/Command/SystemInstallCommand.php:162
- unverified `SwagDigitalSalesRooms` — licensed plugin, not part of the installed vendor/shopware packages
