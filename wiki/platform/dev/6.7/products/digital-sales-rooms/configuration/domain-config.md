---
id: platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md
title: Domain Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/configuration/domain-config.html
sourceHash: 5b2324969ce5402d7ca4e16eb043e52dff37b7f8
codeCheckedAgainst: "6.7.13.0"
keywords: ["digital sales rooms", "dsr", "domain configuration", "sales channel domain", "sales_channel_domain", "available domains", "language path", "frontend app domain", "de-DE", "en-US", "appointments", "redeploy"]
summary: "Digital Sales Rooms domains: add the frontend app URL per language path to a sales channel, then select them as Available domains."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md"]
---
## What it is

How to register the domain(s) of the standalone *Digital Sales Rooms* (DSR) frontend app as sales channel domains, so the DSR plugin can use them. The frontend app always runs under its own specific domain (example from the docs: `https://dsr.shopware.io`).

## When to use

- After deploying or starting the DSR frontend app server and before configuring appointments.
- When adding a new language to DSR (languages are switched by URL path).

## Key steps / config

1. Decide on the sales channel: the merchant can add DSR to an existing sales channel or to a new one, depending on the business use case.
2. In that sales channel, open the *Domains* section and add the DSR domains, each with its language. DSR switches language by path, so use a path per language. Recommended layout:

```text
https://dsr.shopware.io - English
https://dsr.shopware.io/de-DE - Deutsch
https://dsr.shopware.io/en-US - English (US)
```

3. In the DSR plugin configuration, section *Appointments*, select these domains under *Available domains* — see [Plugin Configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md).
4. Redeploy or rerun the frontend app so the domain changes are applied.

## Essential identifiers

- Sales channel *Domains* section (stored as `sales_channel_domain` entities, each requiring `url` and `languageId`)
- DSR plugin config *Appointments* > *Available domains*

## Gotchas

- Domain changes are not picked up by a running frontend app — redeploy or restart it.
- The *Available domains* select box lists domains of all sales channels; pick only the DSR domains.

## Code check (6.7.13.0)
- confirmed `sales_channel_domain` — entity behind the sales channel Domains section — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:31
- confirmed `url` — required URL field of a sales channel domain — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:63
- confirmed `languageId` — every sales channel domain requires a language — vendor/shopware/core/System/SalesChannel/Aggregate/SalesChannelDomain/SalesChannelDomainDefinition.php:65
- unverified `Available domains` — DSR plugin config field; licensed plugin code not in vendor/shopware
