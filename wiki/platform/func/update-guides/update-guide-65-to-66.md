---
id: platform/func/update-guides/update-guide-65-to-66.md
title: "Update Guide 65 To 66"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/update-guides/update-guide-65-to-66"
sourceHash: "0469f4684546ed08cd471de69b5f07bb67f67f3064b2397286b896e2de12ec94"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["update guide", "Shopware 6.6", "PHP 8.2", "node-js 20", "MySQL 8", "MariaDB 10.11", "Git repository", "extension deactivation", "6.5 to 6.6", "system requirements"]
summary: "Requirements and steps to update Shopware 6.5 to 6.6: PHP 8.2, Node 20, MySQL 8/MariaDB 10.11+, Git, deactivating all extensions first."
lastBuilt: "2026-09-15"
---
## What it is
Update guide for moving a Shopware installation from version 6.5 to 6.6.

## When to use
Use when planning or performing the 6.5-to-6.6 update; if currently on 6.4, first update to 6.5.

## Key steps / config
- If currently on 6.4, update to 6.5 first before updating to 6.6.
- System requirements for 6.6: PHP 8.2, node-js version 20, MySQL >=8 or MariaDB >=10.11, Git with access to the Git repository.
- Before updating, deactivate **all** extensions and set the theme to default (also deactivated) — the 6.5-to-6.6 update only proceeds with extensions deactivated.
- Once on 6.6, extensions can be updated and reactivated.
- Perform the update in the administration as described in the update-per-administration steps.

## Essential identifiers
- PHP 8.2, node-js 20, MySQL 8, MariaDB 10.11

## Version notes
Applies specifically to the 6.5 → 6.6 upgrade path; a prior 6.4 → 6.5 update is a prerequisite if starting from 6.4.
