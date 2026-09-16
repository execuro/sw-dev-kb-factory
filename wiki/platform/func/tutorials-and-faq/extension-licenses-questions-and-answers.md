---
id: platform/func/tutorials-and-faq/extension-licenses-questions-and-answers.md
title: Extension Licenses Questions And Answers
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/extension-licenses-questions-and-answers
sourceHash: 5dd34cdda00982d89179e53cb70eb93971694223ca6fd3ae79ff8dc42963b6af
revision: {current: true, range: "6.3.3.0 - 6.4.0.0", swMax: "6.4.0.0", swMin: "6.3.3.0"}
keywords: ["extension warning", "license violation", "extension subscription", "plugin manager", "uninstall extension", "remove plugin", "shopware account", "extension manager", "rental license", "buy plugin", "community store"]
summary: "FAQ on extension license warnings, how to fully delete unlicensed extensions, and how subscriptions/rental licenses work and are renewed."
lastBuilt: "2026-09-15"
---
## What it is
An FAQ covering the "Extension Warning" message, how to completely delete an unlicensed extension, and how extension subscriptions/rental licenses work.

## When to use
When the admin shows an extension license warning, or you need to fully remove an unlicensed extension or understand subscription renewal/rental options.

## Key steps / config
- The "Extension Warning" appears when an extension's license has expired, regardless of whether the extension is activated, deactivated, or uninstalled in the plugin manager; unlicensed plugins must be fully deleted, not just deactivated.
- To delete an extension completely:
  1. Open **Extensions > My extensions**.
  2. Open the extension's context menu and select **Uninstall**.
  3. After uninstalling, use the context menu again to fully delete the extension.
  4. Log in to the **Shopware Account** tab and update data so the deletion syncs to the system.
  5. (Optional) If not removable via the menu, delete it via database and filesystem.
  6. Go to `https://account.shopware.com` and cancel the rental there — without cancellation the rental contract continues to be charged.
- An extension subscription provides manufacturer updates (features, fixes, compatibility); not all extensions require one (e.g. the free Shopware PayPal plugin does not).
- Subscriptions are time-limited (typically one year from purchase) and must be renewed via the Shopware account; without renewal, updates stop and a warning appears in the Admin, though existing functionality is unaffected.
- Subscription purchases can no longer be renewed directly; the purchase option has been replaced by two discounted rental models, accessible through the account.
- After a license violation is charged, no free remedy exists; the extension may then be used under a rental license or a 6-month extension subscription for that domain, with no additional penalty for the prior period. Rentals can be moved to a different domain via the account.

## Essential identifiers
Admin path **Extensions > My extensions**; account URL `https://account.shopware.com`; contact `store@shopware.com`.

## Gotchas
Uninstalling an extension is not enough to clear a license violation — it must be completely deleted via the context menu, or it can be reactivated at any time.
