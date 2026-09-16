---
docType: developer
id: platform/dev/6.6/guides/hosting/installation-updates/extension-managment.md
sourceHash: 64e27cbe31305bd6eba3deff45498bf57dd811da
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/installation-updates/extension-managment.html
title: Extension Management
version: "6.6"
versions: ["6.6"]
keywords: ["Extension Management", "custom/plugins", "custom/apps", "composer require store.shopware.com", "plugin:install", "plugin:refresh", "classmap-authoritative", "runtime_extension_management", "auth.json", "packages.shopware.com", "First Run Wizard"]
summary: "Managing Shopware extensions via Composer instead of the Administration, including migration and disabling runtime installs."
lastBuilt: "2026-09-15"
---
## What it is

This page explains why and how to manage Shopware extensions (plugins/apps) via Composer rather than uploading them through the Administration's Extension manager.

## When to use

Use it when you want version-controlled, reproducible extension management, or when you need to prevent extension installs directly in the Administration (e.g. cluster environments).

## Key steps / config

Authorize the project with the Shopware Composer Registry (generate a token via "Install via Composer" on account.shopware.com), then:

```bash
composer config repositories.shopware-packages '{"type": "composer", "url": "https://packages.shopware.com"}'
composer config bearer.packages.shopware.com <your-token>
```

This creates `auth.json` (should not be committed; add to `.gitignore`). Install and activate an extension:

```bash
composer require store.shopware.com/{extension-name}
bin/console plugin:install --activate <extension-name>
```

Migrating an already-installed extension: `composer require store.shopware.com/{extension-name}`, delete the source under `custom/plugins/{extension-name}` or `custom/apps/{extension-name}`, then run `bin/console plugin:refresh`.

Enable Composer classmap authoritative for performance:

```diff
{
    "require": { "shopware/core": "...." },
    "config": {
        "optimize-autoloader": true,
+       "classmap-authoritative": true
    }
}
```

then `composer dump-autoload`.

Since Shopware 6.6.4.0, disable runtime extension installs via `config/packages/z-shopware.yaml`:

```yaml
shopware:
    deployment:
        runtime_extension_management: false
```

Clear the cache afterward; the Extension Manager becomes read-only (configuration only), and the First Run Wizard no longer auto-downloads extensions like PayPal or the Shopware Store connector.

## Essential identifiers

- `custom/plugins`, `custom/apps`
- `composer require store.shopware.com/{extension-name}`
- `bin/console plugin:install --activate`
- `bin/console plugin:refresh`
- `classmap-authoritative`
- `shopware.deployment.runtime_extension_management`
- `auth.json`

## Gotchas

Composer's class loader cannot be optimized while extensions still live in `custom/plugins` because it must dynamically look them up. Manual Administration-based extension management makes updates hard to track and version-control and can't be coordinated with Shopware core updates.

## Version notes

`runtime_extension_management: false` is available since Shopware 6.6.4.0.
