---
id: platform/func/extensions/myextensions.md
docType: functional
title: Myextensions
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/myextensions
sourceHash: b8a6330a7a4c6fee7dbbc71d2e51ef8182244a9632b8ffb1c86da9b2b1122688
revision:
  current: true
  range: "6.0.0 - 6.3.5.2"
  swMax: "6.3.5.2"
  swMin: "6.0.0"
keywords: ["My Extensions", "Extensions > My Extensions", "Apps section", "Theme section", "Recommendations", "Shopware Account", "install app", "uninstall extension", "extension management", "self-hosted", "extension status", "update extensions", "Remove all app data permanently"]
summary: "Extensions > My Extensions manages a self-hosted shop's apps, themes, recommendations, Shopware Account link and extension install/update/uninstall."
lastBuilt: "2026-09-15"
---
## What it is

**Extensions > My Extensions** is the admin area where self-hosted Shopware 6 shops manage installed extensions: apps, themes, recommendations, the Shopware Account connection and manual extension uploads. It is not relevant for Shopware 6 SaaS shops.

## When to use

Use it to install, activate/deactivate, configure, update or uninstall apps and themes, or to connect a shop's Shopware Account to access purchased extensions.

## Key steps / config

- Sections: **Apps** (installed apps overview), **Theme** (installed themes overview), **Recommendations** (region/category-based suggestions), **Shopware Account** (link shop to account), **Upload extension** (manual zip upload).
- Apps overview columns: overview of apps, "Hide inactive extensions", sorting, **Active** toggle, **Install app**, and the **"..."** context menu (Uninstall, Remove, Configuration).
- Active-state indicators: active (white button, light blue background), inactive (white button, gray background), uninstalled (dark gray button, light gray background — license is retained and the app can be reinstalled).
- Installing: connect the Shopware Account to list purchased extensions under Apps/Themes, or upload the zip manually; then use the **"..."** menu's **Install**, then activate via the Status column.
- Configuring: some active extensions add their own menu item under **Settings > Extensions**.
- Updating: click **Update** next to the extension/app in the overview; the system checks authorization before applying the update.
- Uninstalling: **Extensions > My extensions**, **"..."** button, **Uninstall**; optionally use **Remove all app data permanently** to delete all extension data (settings, etc.) — this action is irreversible.

## Essential identifiers

- Admin path: **Extensions > My Extensions**
- Subsections: Apps, Theme, Recommendations, Shopware Account, Upload extension
- Setting: **Remove all app data permanently**

## Gotchas

After installation, an app is initially deactivated and must be activated separately to use it right away. **Remove all app data permanently** cannot be undone. Themes are not automatically assigned to a sales channel merely by being active — assignment happens in the sales channel.
