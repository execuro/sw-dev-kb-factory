---
id: platform/func/shopware-gmv-reporting.md
title: Shopware Gmv Reporting
docType: functional
version: "6.7"
versions: ["6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-gmv-reporting
sourceHash: 805942d07d646ef4b3f9d12816f5ff8674122b6c53092f7828f51f8173d943b1
revision:
  current: true
  range: "6.7.8.0 - 6.7.12.2"
  swMax: "6.7.12.2"
  swMin: "6.7.8.0"
keywords: ["GMV reporting", "GMV", "Fair Usage Policy", "Gross Merchandise Value", "APP_URL", "license host", "Shopware Account", "Store", "Reporting Status", "Report History", "Activity log", "aggregated data", "data protection"]
summary: "GMV reporting is a mandatory, automated Fair Usage Policy feature collecting aggregated revenue/order-count data; not manually deactivatable as of 6.7.13.0."
lastBuilt: "2026-09-15"
---
## What it is

GMV (Gross Merchandise Value) reporting is a mandatory part of using Shopware that implements the Fair Usage Policy (FUP). It applies to both Community Edition users (who must upgrade to a paid plan once GMV reaches €1 million and Shopware Account and Store is used) and paid-plan users, where GMV forms the basis for price calculation and plan classification.

## When to use

Relevant whenever a shop must comply with the Fair Usage Policy or needs to review its GMV data collection status and history.

## Key steps / config

Technical requirements:
- Correct license host stored under **Settings > System > Shopware Account**.
- Correctly configured `APP_URL` in the environment (usually `.env`, and as of Shopware 6.5.0.0 also `.env.local`); the shop's Admin API must be reachable via this URL.

Admin location: **Settings > System > GMV Reporting**, showing:
- Reporting Status (1): whether collection is active, last synchronization, next scheduled collection, and collection time window; Configure (2) to adjust the window.
- Shop Information (3): shop ID, configured app URL, license host.
- Report History (4): daily overview of collected GMV data (currency, net GMV, number of orders) with processing status.
- Activity log (4): individual processing steps.

## Essential identifiers

- `Settings > System > GMV Reporting`
- `Settings > System > Shopware Account`
- Environment variable: `APP_URL` (in `.env`, and `.env.local` as of 6.5.0.0)

## Gotchas

- As of version **6.7.13.0**, the GMV Reporting Service can no longer be manually deactivated or uninstalled (Admin or CLI) if the technical requirements for GMV reporting are met; related admin actions may be disabled.
- Only aggregated GMV data (total revenue and order count over a period) is processed and transmitted in encrypted form; no individual transactions or personal customer data are collected.

## Version notes

As of Shopware 6.7.13.0, manual deactivation/uninstallation of the GMV Reporting Service via Admin or CLI is blocked when the FUP technical requirements are met.
