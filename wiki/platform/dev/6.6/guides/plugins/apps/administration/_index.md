---
id: platform/dev/6.6/guides/plugins/apps/administration/_index.md
title: Administration
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/administration/
sourceHash: 9cf5151dbc248b14a8c23fc081218daff43154e9
keywords: ["administration extension", "manifest file", "custom modules", "custom fields", "action buttons", "cms blocks", "Resources/administration", "app manifest", "admin sdk"]
summary: "Apps cannot freely override Administration JS files; they extend via manifest-defined modules, custom fields, action buttons, and CMS blocks."
lastBuilt: "2026-09-15"
---
## What it is

Explains that apps cannot extend the Shopware Administration by freely overriding or extending Administration components: any JS files placed under the `Resources/administration` namespace are ignored.

## Key steps / config

Instead, apps use defined extension points via the manifest file: add custom modules, custom fields, or action buttons. Starting with version 6.4.2.0, apps can also extend the CMS module by adding custom CMS blocks.

## Essential identifiers

- `Resources/administration` (ignored namespace for apps)

## Version notes

Custom CMS block extension for apps was added starting with Shopware 6.4.2.0.
