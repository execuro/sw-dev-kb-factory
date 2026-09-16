---
id: platform/func/update-guides/update-guide-64-to-65.md
title: "Update Guide 64 To 65"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/update-guides/update-guide-64-to-65"
sourceHash: "de3438e673d4778f754a167c42651edab58ee2288789cc3118473b6cb77e4420"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["update guide", "Shopware 6.5", "PHP 8.1", "node-js 18", "Git", "extension deactivation", "theme default", "system requirements", "6.4 to 6.5", "update per administration"]
summary: "Requirements and steps to update Shopware 6.4 to 6.5: PHP 8.1+, Node 18, Git, and deactivating all extensions/theme before updating."
lastBuilt: "2026-09-15"
---
## What it is
Update guide for moving a Shopware installation from version 6.4 to 6.5.

## When to use
Use when planning or performing the 6.4-to-6.5 major update.

## Key steps / config
- System requirements for 6.5: PHP 8.1 or higher, node-js version 18, Git.
- Before updating, deactivate all extensions; also set the theme to default and deactivate it under extensions — the update to 6.5 is only possible with all extensions deactivated.
- Once on 6.5, extensions can be updated and reactivated.
- Perform the update in the administration as described in the update-per-administration steps.

## Essential identifiers
- PHP 8.1, node-js 18

## Version notes
Applies specifically to the 6.4 → 6.5 upgrade path.
