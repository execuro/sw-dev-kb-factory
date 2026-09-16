---
id: platform/func/update-guides/update-guide-shopware-66.md
title: "Update Guide Shopware 66"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/update-guides/update-guide-shopware-66"
sourceHash: "ba220f364c7a34f92beb54471a9f072c32381c197aa23b143b1dc1c0f80c6021"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["Shopware 6.6", "Vue 3", "Webpack 5", "SWC", "Node 20", "PHP 8.2", "Redis 7.0", "MariaDB 10.11", "automatic logout", "stock handling", "media path", "ElasticSearch", "OpenSearch", "multilingual indexing"]
summary: "Overview of Shopware 6.6 changes: Vue 3, Webpack 5/SWC, faster storefront, automatic logout, new stock handling, and fixed media paths."
lastBuilt: "2026-09-15"
---
## What it is
Overview of the system requirement and feature changes introduced in Shopware 6.6.

## When to use
Use when checking what changed for the 6.6 release before upgrading, or when explaining new 6.6 capabilities.

## Key steps / config
- Requirements for 6.6 and above: Node 20, PHP 8.2, Redis 7.0 (optional), MariaDB 10.11.
- **Vue 3 support**: established and used within the admin; some third-party extensions may interfere with Vue 3 and need a vendor update.
- **Webpack 5**: administration build tooling upgraded to Webpack 5 and switched from Babel to SWC, making admin builds roughly three times faster; plugin-system extensions with a custom webpack configuration must migrate to the Webpack 5 API.
- **Faster storefront**: improved loading times, framed as both a UX and SEO (ranking factor) improvement, with up to 6x better indexing performance for multilingual stores.
- **Automatic logout**: the admin session timeout can be extended via an additional checkbox on the login page, from several minutes up to 14 days.
- **New stock handling**: available stock is now recalculated when an order is placed (previously it was recalculated when the order was completed); stock handling can be deactivated in the settings.
- **Fixed path for media**: each media file's path is now stored in the database instead of being rendered on each load, fixing a performance issue that caused loading errors in the latest 6.5 versions.
- **Multilingual ES indexes**: when Elastic- or OpenSearch is used, product/category indexes are stored per language, with ElasticSearch mapping data adapted to support multiple languages in a single index for better multilingual reindexing performance.

## Essential identifiers
- Node 20, PHP 8.2, Redis 7.0, MariaDB 10.11
- Webpack 5, Vue 3, SWC

## Gotchas
Third-party extensions may interfere with Vue 3 and need an update from their manufacturer; plugins with a custom webpack configuration must be migrated to the webpack 5 API.

## Version notes
Fixes a media-path loading-error issue present "in the latest versions of 6.5".
