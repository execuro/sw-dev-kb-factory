---
id: platform/dev/6.7/products/extensions/commercial/_index.md
title: Commercial
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/commercial/
sourceHash: 71a03bcd932cee9f3af71ac35ec14ee392fc48e6
codeCheckedAgainst: "6.7.15.1"
keywords: ["SwagCommercial", "commercial plugin", "commercial:license:update", "commercial:license:info", "SHOPWARE_COMMERCIAL_ENABLED_BUNDLES", "license key", "shopware account", "sub-bundles", "disable commercial features", "kernel.bundles", "debug:container", "CustomPricing", "Subscription"]
summary: Shopware commercial plugin overview - nested sub-bundles, license fetch via Shopware Account, license CLI commands, SHOPWARE_COMMERCIAL_ENABLED_BUNDLES.
lastBuilt: 2026-10-21
---
## What it is

The Shopware 6 commercial feature set is shipped as one commercial plugin that bundles extended business functionality. The plugin is structured as a group of nested sub-bundles; each feature lives in its own bundle. This page covers its structure, installation, licensing and how to enable only a subset of its bundles.

## When to use

- You install the commercial plugin and need to know why features show as inactive.
- The license key was not fetched at install time and you need to refresh or inspect it.
- You only need some commercial features (for example custom pricing and subscriptions) and want the other bundles disabled.

## Key steps / config

1. Install the plugin like any other plugin (standard plugin install flow; no special steps).
2. On installation the plugin tries to fetch the license key via the logged-in Shopware Account. If that fails, the plugin still installs but all features are deactivated.
3. After logging into the Shopware Account, re-fetch the license:
   `bin/console commercial:license:update`
4. Inspect the current license key, whether it is set, and its expiry date:
   `bin/console commercial:license:info`
5. Restrict which commercial bundles are enabled (since 6.6.10.0) with a comma-separated environment variable:

```text
SHOPWARE_COMMERCIAL_ENABLED_BUNDLES=CustomPricing,Subscription
```

6. List all bundle names to pick valid values:
   `./bin/console debug:container --parameter kernel.bundles --format=json`

## Essential identifiers

- `SHOPWARE_COMMERCIAL_ENABLED_BUNDLES` — env var listing enabled commercial bundles
- `bin/console commercial:license:update` — re-fetch license key
- `bin/console commercial:license:info` — show license key, status and expiry
- `kernel.bundles` — container parameter holding all registered bundle names

## Gotchas

- Depending on the merchant's active account configuration, individual features are *active* or *inactive* while the code is still installed in the codebase. Check each feature's own install information or special conditions.
- A failed license fetch does not block installation; it silently leaves every feature deactivated until the license is updated.
- Bundle names in `SHOPWARE_COMMERCIAL_ENABLED_BUNDLES` must match the names reported by `kernel.bundles`.

## Version notes

- Disabling features via `SHOPWARE_COMMERCIAL_ENABLED_BUNDLES` is available since 6.6.10.0.

## Code check (6.7.15.1)
- confirmed `SwagCommercial` — core test bootstrapper activates the plugin by this name when present — vendor/shopware/core/TestBootstrapper.php:497
- confirmed `SwagCommercial` — listed as a plugin in core translation config — vendor/shopware/core/System/Resources/translation.yaml:11
- confirmed `CommercialLicenseProvidedEvent` — core event dispatched with a commercial license key and host — vendor/shopware/core/Service/Event/CommercialLicenseProvidedEvent.php:15
- unverified `commercial:license:update` — command lives in the separate SwagCommercial plugin, not in core/storefront/administration
- unverified `commercial:license:info` — command lives in the separate SwagCommercial plugin, out of scope
- unverified `SHOPWARE_COMMERCIAL_ENABLED_BUNDLES` — not read by core; handled inside the SwagCommercial plugin
- unverified `kernel.bundles` — Symfony kernel container parameter, out of scope (core also registers a `kernel.bundles` service id)
