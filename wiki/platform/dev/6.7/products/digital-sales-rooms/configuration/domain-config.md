---
id: platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md
title: Domain Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/configuration/domain-config.html
sourceHash: 5b2324969ce5402d7ca4e16eb043e52dff37b7f8
codeCheckedAgainst: "6.7.15.1"
keywords: ["digital sales rooms", "dsr", "domain configuration", "sales channel domain", "sales_channel_domain", "SalesChannelDomainDefinition", "frontend app domain", "language path", "available domains", "appointments", "multi-language domains"]
summary: Adding the Digital Sales Rooms frontend app domains (one per language path) to a sales channel and selecting them as Available domains.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md"]
---
## What it is

How to register the domains of the *Digital Sales Rooms* frontend app on a sales channel so the app can resolve the sales channel and switch languages by URL path.

## When to use

After deciding whether Digital Sales Rooms runs on an existing or a new sales channel, and once the frontend app server has its own domain (for example `https://dsr.shopware.io`).

## Key steps / config

1. Choose the sales channel (existing or new, depending on the business case).
2. In the sales channel's *Domains* section, add one domain per language. DSR switches language by path, so the path can represent the language. Recommended:

```text
https://dsr.shopware.io        - English
https://dsr.shopware.io/de-DE  - Deutsch
https://dsr.shopware.io/en-US  - English (US)
```

Each domain is a `sales_channel_domain` record; the installed entity requires `url` (max 255 chars), `salesChannelId`, `languageId`, `currencyId` and `snippetSetId`, so every DSR domain needs a language, currency and snippet set.
3. Select these DSR domains as *Available domains* in the plugin configuration's Appointments block (see platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md).
4. Redeploy or rerun the frontend app so it picks up the domain changes.

## Essential identifiers

- `sales_channel_domain` / `SalesChannelDomainDefinition` — entity behind each domain
- *Domains* section of the sales channel; *Available domains* (plugin config, Appointments)

## Gotchas

- Domain changes are not applied to a running frontend app; it must be redeployed or restarted.
- Domains not added to the sales channel do not show up in the *Available domains* select box.

## Code check (6.7.15.1)
- confirmed `SalesChannelDomainDefinition` — entity definition for sales channel domains — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:32
- confirmed `sales_channel_domain` — entity name — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:34
- confirmed `url` — required StringField, length 255 — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:66
- confirmed `languageId` — required FK to language — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:68
- confirmed `currencyId` — required FK to currency — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:69
- confirmed `snippetSetId` — required FK to snippet set — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:70
- unverified `Available domains` — setting of the separate Digital Sales Rooms plugin; not in vendor/shopware core
