---
id: platform/dev/6.6/products/extensions/commercial/_index.md
title: Commercial
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/commercial/
sourceHash: 71a03bcd932cee9f3af71ac35ec14ee392fc48e6
keywords: ["Commercial plugin", "commercial:license:update", "commercial:license:info", "SHOPWARE_COMMERCIAL_ENABLED_BUNDLES", "license key", "Shopware Account", "sub-bundles", "debug:container", "kernel.bundles", "extended functionality", "feature bundles"]
summary: The Commercial plugin bundles extended Shopware 6 features, licensed per Shopware Account and toggled per bundle via SHOPWARE_COMMERCIAL_ENABLED_BUNDLES.
lastBuilt: 2026-09-15
---
## What it is

Introduces the Commercial plugin, a group of nested sub-bundles adding extended functionality to the Shopware 6 ecosystem, comprising a large set of features for businesses that need more than the base platform.

## When to use

Use this when installing, licensing, or selectively enabling/disabling the Commercial plugin's feature bundles, or when a Commercial feature appears installed but inactive.

## Key steps / config

Installation requires no special guidance beyond the standard plugin installation steps. On installation, the plugin tries to fetch a license key using the logged-in Shopware Account; if it cannot be fetched, the plugin still installs but all its features are deactivated. Logging into the Shopware Account and refetching the license key is done with:

```bash
bin/console commercial:license:update
```

To debug the current license state — the key, whether it is set, and its expiry — run:

```bash
bin/console commercial:license:info
```

Since 6.6.10.0, individual bundles can be selectively enabled with the `SHOPWARE_COMMERCIAL_ENABLED_BUNDLES` environment variable:

```text
SHOPWARE_COMMERCIAL_ENABLED_BUNDLES=CustomPricing,Subscription
```

All available bundle names can be listed with:

```bash
./bin/console debug:container --parameter kernel.bundles --format=json
```

## Essential identifiers

- `bin/console commercial:license:update`
- `bin/console commercial:license:info`
- Env var: `SHOPWARE_COMMERCIAL_ENABLED_BUNDLES`
- `./bin/console debug:container --parameter kernel.bundles --format=json`

## Gotchas

A feature's active/inactive state depends on the merchant's active account configuration, even though the feature remains installed in the codebase — pay attention to install information or special conditions per feature. Without a fetchable license key, installation still succeeds but every Commercial feature is deactivated until the account is logged in and the license is refreshed.

## Version notes

The `SHOPWARE_COMMERCIAL_ENABLED_BUNDLES` env var for disabling individual feature bundles is available since 6.6.10.0.
