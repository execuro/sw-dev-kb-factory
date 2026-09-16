---
id: platform/dev/6.6/guides/plugins/apps/custom-data/_index.md
title: Custom Data
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/custom-data/
sourceHash: 34be3877c31141a1e06bdf725948560af2e1ab89
keywords: ["custom data", "custom fields", "custom entities", "core tables", "apps", "data types", "associations", "lifecycle"]
summary: "Apps can store custom data in Shopware either via custom fields on core tables or as fully custom entities with their own associations."
lastBuilt: "2026-09-15"
---
## What it is

Shopware lets you store custom data for your apps in two ways: adding custom fields to existing core tables, or defining entirely new entities with their own associations and lifecycle.

## When to use

Use custom fields when you need simple data types (strings, numbers, booleans, arrays, objects) attached directly to existing records. Use custom entities when your app needs new data structures with their own relationships and lifecycle, independent of core tables.

## Key steps / config

- Custom fields: store simple values directly in core tables; registered as field sets in the app manifest.
- Custom entities: define complete new entities with their own associations and lifecycle, separate from core tables.

## Essential identifiers

- custom fields
- custom entities
