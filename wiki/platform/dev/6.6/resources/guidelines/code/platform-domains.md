---
id: platform/dev/6.6/resources/guidelines/code/platform-domains.md
title: Platform Domains
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/platform-domains.html
sourceHash: d06bb2dc663e0bfd444c587036039ce4bc57cdf3
keywords: ["platform domains", "core domain", "administration domain", "elasticsearch domain", "storefront domain", "domain dependencies", "architecture guideline", "core guidelines", "dependency rules"]
summary: "Defines allowed cross-domain dependencies between Shopware's Core, Administration, Elasticsearch, and Storefront domains."
lastBuilt: 2026-09-15
---
## What it is

This core coding guideline defines which of Shopware's platform domains — `Core`, `Administration`, `Elasticsearch`, and `Storefront` — are allowed to depend on which others.

## Key steps / config

- The `Core` domain must not have any dependency on any of the other domains: neither classes nor assets from `Storefront`, `Administration`, or `Elasticsearch` may be used within `Core`.
- The `Administration` domain may depend on `Core`, but not on `Storefront` or `Elasticsearch`.
- The `Elasticsearch` domain may depend on `Core`, but not on `Storefront` or `Administration`.
- The `Storefront` domain may depend on `Core`, but not on `Administration` or `Elasticsearch`.

## Essential identifiers

`Core`, `Administration`, `Elasticsearch`, `Storefront`
