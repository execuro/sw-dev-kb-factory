---
id: platform/dev/6.7/products/extensions/commercial/_index.md
title: Commercial
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/commercial/
sourceHash: 71a03bcd932cee9f3af71ac35ec14ee392fc48e6
codeCheckedAgainst: "6.7.13.0"
keywords: ["commercial plugin", "SwagCommercial", "commercial:license:update", "commercial:license:info", "SHOPWARE_COMMERCIAL_ENABLED_BUNDLES", "kernel.bundles", "license key", "shopware account", "sub-bundles", "disable features", "CustomPricing", "Subscription"]
summary: "Commercial plugin: sub-bundles, license via commercial:license:update/info, SHOPWARE_COMMERCIAL_ENABLED_BUNDLES to enable selected bundles."
lastBuilt: 2026-09-15
---
## What it is

The Commercial plugin bundles Shopware 6's commercial feature set. It is a group of nested sub-bundles installed like any other plugin; which features are active depends on the merchant's Shopware Account license.

## When to use

When installing or debugging the Commercial plugin, checking why its features are inactive (licensing), or limiting which commercial bundles are enabled.

## Key steps / config

1. Install the plugin with the standard plugin installation steps (no special guidance needed).
2. Licensing: on installation the plugin tries to fetch the license key through the logged-in Shopware Account. If that fails, the plugin still installs but all features are deactivated. After logging into the Shopware Account, re-fetch the key:
   ```bash
   bin/console commercial:license:update
   bin/console commercial:license:info   # shows key, whether set, expiry
   ```
3. Disable features (since 6.6.10.0): list only the bundles to enable in an environment variable:
   ```text
   SHOPWARE_COMMERCIAL_ENABLED_BUNDLES=CustomPricing,Subscription
   ```
4. Find all bundle names:
   ```bash
   ./bin/console debug:container --parameter kernel.bundles --format=json
   ```

## Essential identifiers

- `SwagCommercial` (plugin name)
- `bin/console commercial:license:update`
- `bin/console commercial:license:info`
- `SHOPWARE_COMMERCIAL_ENABLED_BUNDLES`
- `kernel.bundles` (container parameter)

## Gotchas

- Features can be installed yet inactive, depending on the merchant's account/license configuration; check each feature's install notes and special conditions.
- A failed license fetch at install time leaves all features deactivated until `commercial:license:update` succeeds.

## Version notes

- `SHOPWARE_COMMERCIAL_ENABLED_BUNDLES` is available since 6.6.10.0.

## Code check (6.7.13.0)
- confirmed `SwagCommercial` — Administration injects the SwagCommercial plugin first because other plugins depend on its license handling — vendor/shopware/administration/Resources/app/administration/src/core/application.ts:633
- confirmed `SwagCommercial` — test bootstrapper activates the plugin when commercial is enabled — vendor/shopware/core/TestBootstrapper.php:493
- confirmed `kernel.bundles` — core registers a `kernel.bundles` service from the kernel's bundles — vendor/shopware/core/System/DependencyInjection/configuration.xml:19
- unverified `SHOPWARE_COMMERCIAL_ENABLED_BUNDLES` — read by the SwagCommercial plugin, which is not installed; out of scope
- unverified `commercial:license:update` — command lives in the SwagCommercial plugin, not installed; out of scope
- unverified `commercial:license:info` — command lives in the SwagCommercial plugin, not installed; out of scope
