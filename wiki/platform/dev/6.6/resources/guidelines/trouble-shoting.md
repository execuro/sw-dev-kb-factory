---
id: platform/dev/6.6/resources/guidelines/trouble-shoting.md
title: Troubleshooting
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/trouble-shoting.html
sourceHash: 2a0fca4d45a2122a8a0874ca3a0bf6e61c8014d8
keywords: ["troubleshooting", "dynamic product groups", "contains filter", "cache invalidation", "OpenSearch", "custom fields", "delayed cache invalidation", "performance tuning"]
summary: "Fixes for slow dynamic product groups and overly frequent cache invalidation in Shopware."
lastBuilt: "2026-09-15"
relatedPages: ["platform/dev/6.6/guides/hosting/performance/performance-tweaks.md"]
---
## What it is
Troubleshooting notes for common Shopware performance problems: slow dynamic product groups and caches invalidated too frequently.

## When to use
When diagnosing slow dynamic product group loading or unexpectedly frequent cache invalidation.

## Key steps / config
- Dynamic product groups slow to load: a `contains` filter (especially on a custom field) can't be optimized by the underlying SQL query and slows loading. Fixes: use OpenSearch instead of the database for searching; for custom fields, prefer individual boolean custom fields per value instead of `contains`; for normal fields, add a custom field and manage it manually, or use tags.
- Cache invalidated too often: identify the background process causing it (e.g. cron jobs clearing the cache, or an ERP system syncing products frequently and invalidating all pages referencing them). Consider delayed rather than immediate cache invalidation — this becomes the default starting with Shopware 6.7.0.0, and can be [activated on older versions](platform/dev/6.6/guides/hosting/performance/performance-tweaks.md).

## Essential identifiers
- `contains` filter (dynamic product groups)
- delayed cache invalidation

## Version notes
Delayed (non-immediate) cache invalidation becomes the new default starting with Shopware 6.7.0.0; on earlier versions it must be activated manually.
