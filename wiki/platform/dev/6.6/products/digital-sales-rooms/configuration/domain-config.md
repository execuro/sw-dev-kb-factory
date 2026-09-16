---
id: platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md
title: Domain Configuration
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/digital-sales-rooms/configuration/domain-config.html
sourceHash: 6c5ef591d9956bccc0783bcbeabac61bd30484ba
keywords: ["Digital Sales Rooms", "DSR", "domain configuration", "sales channel", "Domains section", "Available domains", "Appointments", "frontend app domain"]
summary: "How to add the Digital Sales Rooms frontend app domain(s) to a sales channel's Domains section."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.6/products/digital-sales-rooms/configuration/plugin-config.md"]
---
## What it is
How to add the Digital Sales Rooms frontend app's domain(s) to a Shopware sales channel, either an existing one or a new one, depending on the business use case.

## When to use
Use this after the frontend app is deployed and reachable at its own domain (e.g. `https://dsr.shopware.io`), and it needs to be attached to a sales channel and made available to the plugin configuration.

## Key steps / config
1. In the sales channel, go to the *Domains section* and add the Digital Sales Rooms domain(s) with the appropriate languages. DSR can switch languages by path, e.g.:

```text
https://dsr.shopware.io - English
https://dsr.shopware.io/de-DE - Deutsch
https://dsr.shopware.io/en-US - English (US)
```

2. Select these domains as *Available domains* on the [Configuration Page - Appointments](platform/dev/6.6/products/digital-sales-rooms/configuration/plugin-config.md) tab.

## Gotchas
- Redeploy or rerun the frontend app after changing domains so the changes take effect in the app itself.
