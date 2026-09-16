---
id: platform/func/settings/system/ShopwareUpdates.md
title: ShopwareUpdates
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/system/ShopwareUpdates
sourceHash: 7f45bbd1e5e944802bb34257e7f6daaa6b76f3e2de19cef2c7af05b9cfe1871c
revision:
  current: true
  range: "6.0.0 - 6.4.20.2"
  swMin: "6.0.0"
  swMax: "6.4.20.2"
keywords: ["Shopware update", "system requirements check", "extension compatibility", "self-hosted store", "update process", "Settings > System", "backup before update", "already compatible", "not compatible"]
summary: "Self-hosted-only Settings > System update screen: checks system requirements and extension compatibility before starting an update."
lastBuilt: "2026-09-15"
---

## What it is

The Shopware update section, under **Settings > System**, starts and pre-checks the update process for self-hosted stores. It does not apply to Shopware 6 SaaS environments.

## When to use

Use it before upgrading a self-hosted Shopware installation to a new version, to verify system requirements and extension compatibility first.

## Key steps / config

1. The system requirements are checked again before the update starts; anything not in the green zone should be fixed beforehand.
2. Extension compatibility is checked per activated extension, with one of three statuses shown:
   - "Already compatible" — the installed extension version already works with the new Shopware version.
   - "With the new Shopware version" — an update to the extension is available after updating the store.
   - "Not compatible" — no successor version exists; the extension will be incompatible after the update.
3. Follow the general update guide for the available update options.
4. Back up the shop database and server files before installing an update.

## Essential identifiers

- Menu path: **Settings > System > Shopware Update**
- Statuses: "Already compatible", "With the new Shopware version", "Not compatible"

## Gotchas

This article and feature apply only to self-hosted stores — not relevant for Shopware 6 SaaS.
