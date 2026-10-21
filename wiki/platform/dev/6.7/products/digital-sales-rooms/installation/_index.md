---
id: platform/dev/6.7/products/digital-sales-rooms/installation/_index.md
title: Installation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/digital-sales-rooms/installation/
sourceHash: e0ac785e8a1fac64fc6cafa2d2c9268ce5610f00
codeCheckedAgainst: "6.7.15.1"
keywords: ["digital sales rooms", "dsr", "installation", "SwagDigitalSalesRooms", "dsr plugin", "admin side installation", "template installation", "frontend app", "setup", "shopware beyond"]
summary: "Overview of installing the Digital Sales Rooms plugin into an existing Shopware instance: an admin-side part and a frontend template part."
lastBuilt: 2026-10-21
---
## What it is

Entry page for installing the **Digital Sales Rooms** (DSR) plugin into an existing Shopware platform. Installation has two parts: at the admin (the Shopware plugin) and at the template (the separate frontend app). It does not cover installing Shopware itself.

## When to use

You already have a running Shopware instance and want to add Digital Sales Rooms.

## Key steps / config

The guide's examples assume:

- Shopware platform runs at `https://shopware.store`
- the DSR frontend app runs at `https://dsr.shopware.io`

Substitute your own hosts. Then do the admin-side installation (fetch and activate the plugin) followed by the template installation.

## Code check (6.7.15.1)
- unverified `SwagDigitalSalesRooms` — licensed extension, not shipped in vendor/shopware core, storefront or administration
