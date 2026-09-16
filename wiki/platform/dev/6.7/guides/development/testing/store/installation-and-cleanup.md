---
id: platform/dev/6.7/guides/development/testing/store/installation-and-cleanup.md
title: Uninstallation and data cleanup
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/installation-and-cleanup.html
sourceHash: 356e02526638cfffbfb656f63bf5b67a64142afc
codeCheckedAgainst: "6.7.13.0"
keywords: ["uninstall", "data cleanup", "keep user data", "UninstallContext::keepUserData()", "Plugin::uninstall()", "extension manager", "completely delete", "custom tables", "custom fields", "cms elements", "deactivate payment method", "store review", "reinstall"]
summary: Store review rules for install/uninstall - error-free lifecycle, keep vs. completely delete data, deactivate payment/shipping methods, remove CMS elements.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md"]
---
## What it is

Shopware Store requirements for installing, uninstalling, reinstalling and deleting an extension, and for which data must be removed when the merchant chooses to delete all extension data.

## When to use

When implementing a plugin's uninstall logic or testing the install/uninstall/reinstall cycle before Store submission.

## Key steps / config

**Lifecycle (driven by the Extension Manager, including the debug console)**
- Install, uninstall and reinstall must complete without exceptions.
- No 400/500 errors during install or uninstall unless clearly tied to an API.
- Do not modify or overwrite the Extension Manager.
- Validate special PHP requirements during installation; on failure show a growl message in the Administration.

**Uninstall options** — the merchant must be able to choose:
- **Keep extension data** (snippets, media, tables): data may remain.
- **Completely delete extension data**: restore the shop as if the extension was never installed; remove custom tables and data the extension created.

In a plugin, the choice arrives as `UninstallContext::keepUserData()` in `Plugin::uninstall()`:

```php
public function uninstall(UninstallContext $uninstallContext): void
{
    parent::uninstall($uninstallContext);
    if ($uninstallContext->keepUserData()) {
        return;
    }
    // drop own tables, deactivate own payment/shipping methods, remove CMS elements ...
}
```

**For "completely delete"**
- Business-critical configuration is an exception: **deactivate** payment or shipping methods (set their `active` field to false) instead of deleting them.
- Data in core tables, data shared with other extensions (e.g. sales channels), or tables Shopware cleans up automatically may not need manual removal.
- Remove all CMS elements the extension added.
- For custom fields, remove the association; values may remain in core storage.
- After uninstall, [Shopping Experiences](platform/dev/6.7/concepts/commerce/content/shopping-experiences-cms.md) must still work in the Storefront.
- The free "Adminer for Admin" Store extension helps verify database state in the test environment.

## Essential identifiers

- `Plugin::uninstall()`
- `UninstallContext::keepUserData()`
- `active` field on `payment_method` / `shipping_method`

## Gotchas

- When `keepUserData()` is `false`, core itself removes the plugin's migrations (before calling `uninstall()`), deletes the plugin's system configuration, and removes the plugin's custom entities and custom fields. Your `uninstall()` still has to drop your own tables and other data.

## Code check (6.7.13.0)
- confirmed `Plugin::uninstall()` — lifecycle hook receiving UninstallContext — vendor/shopware/core/Framework/Plugin.php:63
- confirmed `UninstallContext::keepUserData()` — carries the keep/delete choice — vendor/shopware/core/Framework/Plugin/Context/UninstallContext.php:27
- confirmed `Plugin::removeMigrations()` — core calls it only when keepUserData() is false — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:229
- confirmed `SystemConfigService::deletePluginConfiguration()` — plugin config removed when data is not kept — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:407
- confirmed `removePluginCustomFields` — core removes plugin custom fields when data is not kept — vendor/shopware/core/Framework/Plugin/PluginLifecycleService.php:252
- confirmed `active` — payment method BoolField, allows deactivating instead of deleting — vendor/shopware/core/Checkout/Payment/PaymentMethodDefinition.php:73
- confirmed `active` — shipping method BoolField, allows deactivating instead of deleting — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:78
- unverified `growl message` — Administration notification on failed PHP requirement check not verified
