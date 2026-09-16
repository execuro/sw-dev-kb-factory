---
id: platform/func/migration-en/Golive.md
title: Golive
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/migration-en/Golive"
sourceHash: "fdc7287c34e688cf2e30faf5ef6e7681d8d0551ed46454b7097057062d6cb943"
revision:
  current: true
  range: "6.2.0 - 6.6.10.14"
  swMin: "6.2.0"
  swMax: "6.6.10.14"
keywords: ["go-live", "target shop", "migration environment", "licensing host", "sales channel domain", "Plugin Migration Assistant", "Truncate migration", "Complete migration", "Apache DocumentRoot", "finalise migration", "source shop", "hosting environment"]
summary: "Steps to go live with a Shopware 6 target shop after migration: domain/licence changes, hosting routing, and finalising the migration."
lastBuilt: "2026-09-15"
---
## What it is

Describes how to turn a Shopware 6 migration target shop into the live environment and finalise the migration once go-live is complete.

## When to use

After migrating to Shopware 6, when it is time to switch the production domain over to the new shop and remove the temporary migration data.

## Key steps / config

Changes in the **target shop**:
- Transfer the licensing host to the main domain under **Settings > System > Shopware Account**.
- Update the domain of each sales channel individually (per sub-shop) in its **URL** field.

Changes in the **source shop**: move it to a subdirectory (Shopware 5) or update its sales channel domain directly (Shopware 6 source), or reconfigure a Magento shop so it is no longer reachable under the main domain.

Changes in the **hosting environment**: the shop domain must route to the `/public/` subdirectory of the Shopware 6 installation. Example Apache virtual host fragment:

```
ServerName "_HOST_NAME_"
DocumentRoot _SHOPWARE_DIR_/public
Options Indexes FollowSymLinks MultiViews
AllowOverride All
ErrorLog ${APACHE_LOG_DIR}/shopware-platform.error.log
CustomLog ${APACHE_LOG_DIR}/shopware-platform.access.log combined
```

`_SHOPWARE_DIR_` and `_HOST_NAME_` must be replaced with the real installation directory and server name; `DocumentRoot` must point at `/public/` because storefront and administration are served from there.

**Finalising the migration**: navigate to **Settings > Extensions > Migration Assistant**, open the context menu and select **Truncate migration**. This removes the migration data records from the database; afterwards the migration can no longer update data. If migrating from Shopware 5 using the Plugin Migration Assistant for test licences, finalise it there before clicking **Complete migration**.

## Essential identifiers

- `Settings > System > Shopware Account`
- `Settings > Extensions > Migration Assistant` context menu action `Truncate migration` / button `Complete migration`
- Apache directives: `DocumentRoot`, `ErrorLog`, `CustomLog`

## Gotchas

- Each sub-shop's sales channel domain must be updated individually.
- For a Magento migration, do not uninstall the migration extension after go-live — Magento's password algorithms are otherwise no longer available and migrated customers cannot log in.
