---
id: platform/func/update-guides/update-guide-shopware-67.md
title: "Update Guide Shopware 67"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/update-guides/update-guide-shopware-67"
sourceHash: "f1509e2340817d25877205d0d59d5ee4f4e06dc8451b7ca5b50d5ee83f68f2c2"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["Shopware 6.7", "Node.js 20", "PHP 8.2", "PHP 8.3", "PHP 8.4", "Redis 7.0", "MySQL 8.0.17", "MariaDB 10.11", "Webpack to Vite", "Vue 3", "Pinia", "Vuex", "cache rework", "Store API caching", "DBAL"]
summary: "Shopware 6.7 changes: Webpack-to-Vite migration, full Vue 3 compatibility, Vuex-to-Pinia, cache rework, and updated PHP/Node/DB requirements."
lastBuilt: "2026-09-15"
---
## What it is
Overview of notable requirement and technical changes in Shopware 6.7.

## When to use
Use when checking what changed for the 6.7 release before upgrading, or explaining new 6.7 technical requirements.

## Key steps / config
- Requirements for 6.7: Node.js 20 or higher; PHP 8.2, 8.3 or 8.4; Redis 7.0 or higher (optional); MySQL 8.0.17 or higher (avoid 8.0.20/8.0.21) or MariaDB 10.11 or higher (avoid 10.11.5/11.0.3).
- **Webpack to Vite migration**: the frontend toolchain moves from Webpack to Vite; plugins including admin components need separate versions for 6.6 and 6.7 because of this.
- **Vue.js enhancements**: full compatibility with Vue 3 is achieved by moving out of compatibility mode; state management migrates from Vuex to Pinia.
- **Cache rework**: enhanced caching with delayed cache invalidation and elimination of the Store API caching layer, aiming to reduce cache storage requirements and increase cache hit rates by focusing on frequently accessed data and minimizing invalidations.
- **Major library updates**: PHPUnit (v11), League OAuth2 Server, and DomPDF updated; DBAL upgraded to version 4.0 for long-term support.

## Essential identifiers
- Node.js 20, PHP 8.2/8.3/8.4, Redis 7.0, MySQL 8.0.17, MariaDB 10.11
- Webpack, Vite, Vuex, Pinia, DBAL 4.0

## Gotchas
Problematic database versions to avoid: MySQL 8.0.20/8.0.21, MariaDB 10.11.5/11.0.3. Plugins with admin components need separate 6.6 and 6.7 builds because of the Webpack-to-Vite migration.

## Version notes
The Store API caching layer is removed as part of the 6.7 cache rework.
