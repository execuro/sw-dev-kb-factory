---
id: "platform/func/first-steps/search-administration.md"
title: "Search Administration"
docType: "functional"
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/first-steps/search-administration"
sourceHash: "e8d55f611709cfd5db68a2d1c6bda7b1da800b9a7d56d49231cb0ea2a3812fcb"
revision:
  current: true
  range: "6.4.15.0"
  swMax: null
  swMin: null
keywords: ["search administration", "admin search", "search preferences", "document number", "EAN/GTIN", "AND/OR search", "ADMIN_OPENSEARCH_URL", "SHOPWARE_ADMIN_ES_ENABLED", "es:admin:index", "search index", "module filter"]
summary: "Admin search: configure searchable modules in Search preferences; enable AND/OR search via env vars and `es:admin:index`."
lastBuilt: "2026-09-15"
---
## What it is
This page explains the Administration's global search: how to configure searchable modules and enable combined AND/OR search.

## When to use
Use it to tune which entities are searchable in the admin search, or to enable advanced AND/OR search queries.

## Key steps / config
- The search box sits at the top of the Administration; a dropdown lists searchable modules. Typing `#` toggles search for these modules, then opens the search setting.
- Configure search in more detail under **Your profile > Search preferences**: choose per-entity searchability, with **Select All**, **Deselect All**, or **Restore Defaults**.
- To find an order by invoice number, ensure **Document number** is a searchable element and filter the module to orders.
- To find a product by EAN, ensure **EAN/GTIN** is a searchable element.
- To enable AND/OR search, edit the env file in the Shopware directory:
```
ADMIN_OPENSEARCH_URL=YOUR OPEN SEARCH URL
SHOPWARE_ADMIN_ES_ENABLED=1
SHOPWARE_ADMIN_ES_REFRESH_INDICES=1
SHOPWARE_ADMIN_ES_INDEX_PREFIX=sw-admin
```
then regenerate the search index with `bin/console es:admin:index` (a cron job for this command is recommended).

## Essential identifiers
- `ADMIN_OPENSEARCH_URL`
- `SHOPWARE_ADMIN_ES_ENABLED`
- `SHOPWARE_ADMIN_ES_REFRESH_INDICES`
- `SHOPWARE_ADMIN_ES_INDEX_PREFIX`
- `bin/console es:admin:index`
