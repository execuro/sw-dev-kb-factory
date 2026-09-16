---
id: platform/func/tutorials-and-faqs/disable-functions.md
title: "Disable Functions"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faqs/disable-functions"
sourceHash: "8a8eeb5ff6db82289a5f999fa448eb06406250cf3dec6c4326679249ea3dc767"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["disable extension", "uninstall extension", "remove plugin", "plugin table", "custom/plugins", "My Extensions", "theme deactivation", "database backup", "payment method", "shipping method", "plugin data", "manual removal"]
summary: "Steps to manually disable, deactivate and remove a broken app/theme and its plugin database entry and files."
lastBuilt: "2026-09-15"
---
## What it is
Describes how to manually disable and remove a Shopware extension (app or theme) that can no longer be deactivated or uninstalled normally through **My Extensions**.

## When to use
Use when an app or theme malfunctions and prevents normal deactivation/uninstallation via the admin, and you need to manually stop its functions and remove its data.

## Key steps / config
1. Disable functions: for example, disable the affected payment or shipping method, or switch the sales channel to a different theme first, so the extension's functions stop being used.
2. Remove database entry: to deactivate only, set the `active` column to `0` for the extension's row in the `plugin` database table; to remove it entirely, delete the record from the `plugin` table.
3. Remove extension data: physically delete the extension's directory, usually found under `custom/plugins/` in the Shopware main directory. If it is not there, ask the extension manufacturer where the physical data is stored.

## Essential identifiers
- `plugin` database table, `active` column
- `custom/plugins/` directory

## Gotchas
Removing data deletes files from the server and records from the database — back up the database and files first, since this cannot be undone through the admin.
