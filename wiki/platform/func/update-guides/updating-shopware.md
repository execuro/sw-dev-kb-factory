---
id: platform/func/update-guides/updating-shopware.md
title: "Updating Shopware"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/update-guides/updating-shopware"
sourceHash: "ff70d6deca031c5b76070d0981ab44a11f15f5506498eec929b9fcead16d481b"
revision:
  current: true
  range: "6.4.20.1 - 6.4.20.2"
  swMax: "6.4.20.2"
  swMin: "6.4.20.1"
keywords: ["Composer update", "system:update:prepare", "system:update:finish", "composer recipes:update", "Shopware Installer", "shopware-installer.phar.php", "extension compatibility", "test environment", "backup", "APP_ENV=dev", "web_profiler", "framework:demo-data", "faker-provider-collection"]
summary: "How to update Shopware via Composer or the browser/admin installer, covering backups, extension compatibility checks, and common Composer update commands."
lastBuilt: "2026-09-15"
---
## What it is
Guide describing how to update a Shopware installation, covering preparation (test environment, backups, extension compatibility), the browser Installer-based update, the admin-based update, and updating via Composer.

## When to use
Use when performing a Shopware version update, choosing between the browser Installer, the in-admin "Shopware Update" flow, or Composer, and when troubleshooting extension deactivation during an update.

## Key steps / config
- Recommended: use **Composer** to update, since it is more stable and avoids potential timeouts; otherwise set up a test environment first.
- Always create a backup before updating the live system — Shopware itself does not create backups; a hosting partner usually handles backups for hosted installations.
- Check extension compatibility beforehand in the Store, the admin Auto-Updater, or the Shopware Account under *Licenses*.
- **Update by browser (Shopware Installer)**: download the installer PHP file from the Changelog download area, move it to the public folder of the installation (use binary transfer mode in FTP tools such as Filezilla), then open `shopware-installer.phar.php` in a browser to start the install/update.
- **Update per administration**: under **Settings > System > Shopware Update**, the update checks system requirements and per-extension compatibility status (`Already compatible`, `With the new Shopware version`, `Not compatible`), then offers extension-deactivation options (`Deactivate all extensions`, `Deactivate incompatible extensions`, or proceeding without deactivating any), followed by confirming a backup before installing.
- **Update with Composer** (applies from Shopware 6.3.0):

```
bin/console system:update:prepare
composer update
bin/console system:update:finish
composer recipes:update
```

  Update the `shopware/core` version (and `shopware/administration`, `-storefront`, `elasticsearch`, etc.) in `composer.json` to the desired Shopware version first.

## Essential identifiers
- `bin/console system:update:prepare`, `bin/console system:update:finish`
- `composer update`, `composer recipes:update`
- `shopware-installer.phar.php`

## Gotchas
- A major update (e.g. 6.4 to 6.5) requires deactivating all extensions; the manual SQL deactivation instructions can be reused but must omit the `WHERE` part to affect all rows.
- Prior to Shopware 6.4.17.0: running with `APP_ENV=dev` needs the Profiler bundle installed via `composer require --dev profiler`; the `framework:demo-data` command needs faker classes installed via `composer require --dev mbezhanov/faker-provider-collection maltyxx/images-generator`.

## Version notes
Composer-based updates apply from Shopware 6.3.0 onward; the two `composer require --dev` workarounds are only needed prior to 6.4.17.0. This page's revision metadata scopes it to the 6.4.20.1–6.4.20.2 range.
