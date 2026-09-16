---
id: platform/func/settings/system/integrationen.md
title: Integrationen
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/system/integrationen
sourceHash: 912695667374b8462606b80ada33953f1b1411df51f37a9cf306fa062b78a8ae
revision:
  current: true
  range: "6.0.0"
  swMin: null
  swMax: null
keywords: ["integrations", "API access", "access ID", "security key", "Settings > System > Integrations", "create integration", "regenerate API access key", "administrator permissions", "roles", "API connection"]
summary: "Creates and manages named API integrations with access ID/security key under Settings > System > Integrations."
lastBuilt: "2026-09-15"
---

## What it is

Integrations let a merchant create a dedicated API access (access ID + security key) for each external application connecting to the Shopware API, under **Settings > System > Integrations**.

## When to use

Use it whenever an external application or system needs its own scoped API credentials to connect to Shopware.

## Key steps / config

- Click **Create integration**, assign a name, and decide whether the integration gets administrator permissions or a specific previously-defined role instead.
- On creation, an access ID and a security key are issued; the security key is shown only once and must be saved immediately.
- Manage: the overview lists integrations by name and permissions; click a name to edit, or use the context menu to edit/delete.
- Edit: the security key is no longer displayed after creation, but can be regenerated via **Regenerate API access key** — this regenerates both the security key and the access ID.

## Essential identifiers

- Menu path: **Settings > System > Integrations**
- Fields: access ID, security key
- Action: Regenerate API access key

## Gotchas

Regenerating the API access key changes both the access ID and the security key, so any client using the old credentials must be updated.
