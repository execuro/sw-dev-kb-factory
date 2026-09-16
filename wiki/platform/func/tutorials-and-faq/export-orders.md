---
id: platform/func/tutorials-and-faq/export-orders.md
title: Export Orders
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/export-orders
sourceHash: 259c4397004947e90fe3be357569bf40ff8aa5c1f8d7529c3a085ad4257e078b
revision: {current: true, range: "current", swMax: null, swMin: null}
keywords: ["export orders", "import/export profile", "profiles", "mandatory fields", "salesChannelId", "orderDateTime", "stateId", "CSV export", "database entry", "export selection"]
summary: "How to create an Import/Export profile with mandatory fields and use it to export orders to a downloadable CSV file."
lastBuilt: "2026-09-15"
---
## What it is
A step-by-step guide to exporting orders from a Shopware shop using a custom Import/Export profile.

## When to use
When you need to export order data (e.g. for external reporting) and must first define which order fields to include.

## Key steps / config
1. Navigate to **Settings > Import/Export > Profiles** and add a new profile.
2. The profile must contain these mandatory fields to export orders: `id`, `salesChannelId`, `orderDateTime`, `stateId`. Orders cannot be exported without them. Select fields from the **Database entry** column dropdown; the **Name** column sets the field's label, which also becomes the export file's column header.
3. Once saved, the profile appears in the export selection; select it (e.g. "Orders") and start the export.
4. Download the resulting file and open it locally in a spreadsheet program. Use a program that does not auto-insert formatting (e.g. Open Office) when opening/editing the CSV.

## Essential identifiers
Mandatory profile fields: `id`, `salesChannelId`, `orderDateTime`, `stateId`. Admin path: **Settings > Import/Export > Profiles**.

## Gotchas
Without all four mandatory fields (`id`, `salesChannelId`, `orderDateTime`, `stateId`) in the profile, the order export cannot be performed.
