---
id: platform/func/migration-en/SystemRequirements.md
title: SystemRequirements
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://docs.shopware.com/en/migration-en/SystemRequirements"
sourceHash: "e9a343eeaeb7721dddfcac505bef43f3cb80918252898dc6f8ffb344ba27c9aa"
revision:
  current: true
  range: "6.6.0.0 - 6.6.10.6"
  swMin: "6.6.0.0"
  swMax: "6.6.10.6"
keywords: ["system requirements", "Shopware Migration Wizard", "Shopware 6 Update Check", "Requirements tab", "Plugins tab", "Shopware Plugin Store", "server requirements", "migration readiness"]
summary: "Points to the developer docs for Shopware 6 system requirements and describes the Shopware 5 Migration Wizard readiness check."
lastBuilt: "2026-09-15"
---
## What it is

Explains where to find the Shopware 6 system requirements and, for Shopware 5 shops, how the **Shopware Migration Wizard** plugin checks migration readiness.

## When to use

Before installing Shopware 6, or before migrating an existing Shopware 5 shop, to confirm the server and installed plugins meet the requirements.

## Key steps / config

- The complete technical system requirements for Shopware 6 are described in the developer documentation.
- For Shopware 5 shops, install the **Shopware Migration Wizard** plugin from the Shopware Plugin Store, then reload the backend. Open it from the question-mark menu icon under **Shopware 6 Update Check**.
- The **Requirements** tab shows which Shopware 6 server requirements are already met, and where the server still needs configuration.
- The **Plugins** tab shows, for each installed Shopware 5 plugin, whether a Shopware 6 version is available and whether its configuration can be adopted.

## Essential identifiers

- Plugin: `Shopware Migration Wizard`
- Admin menu item: `Shopware 6 Update Check`
- Tabs: `Requirements`, `Plugins`
