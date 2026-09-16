---
id: platform/dev/6.6/guides/plugins/overview.md
title: Overview
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/overview.html
sourceHash: 0f3cb1aac39c0c56b37d3b01e8b2fe46e8d9b280
keywords: ["Plugins", "Themes", "Apps", "extension interfaces", "Storefront appearance", "admin modules", "webhooks", "custom entities", "database structure", "payment providers", "Shopware Store", "self-hosted"]
summary: "Compares Shopware's three extension mechanisms — Plugins, Themes and Apps — by capability and use case."
lastBuilt: "2026-09-15"
---
## What it is

This page compares Shopware's three extension mechanisms — Plugins, Themes and Apps — to help decide which one fits a given customization.

## When to use

Consult this comparison before starting an extension: Plugins can change almost anything (Storefront appearance, admin modules, webhooks, custom entities, database structure, payment providers) but are the most invasive; Themes cover Storefront appearance, template overrides, custom styles and style/template load order; Apps cover most of the same capabilities as Plugins except database structure changes, and are required for Shopware 6 Cloud shops since only Apps can be installed there. Apps can be installed in self-hosted shops since Shopware 6.4.0.0.

## Key steps / config

- Plugins are the most powerful and most harmful extension mechanism, suited for profound changes such as custom price calculation, product imports, custom content/products, connecting third-party identity providers, dynamic validations, and customer tracking. Their styles and templates apply immediately once installed and activated. A plugin guide describes how to develop one.
- Themes handle template overrides, custom styles, configuration interfaces, and control style/template load order. A theme must first be selected in the theme manager before it takes effect, unlike a plugin.
- Apps enable event-based integrations that communicate with an external service over a synchronous API, because operation in cloud environments does not allow the same direct code changes as a plugin. Most of an app's logic lives in that third-party service, so the developer must handle API details and secure it appropriately, while being free to choose the operating environment, framework or language, as long as Shopware's guidelines for apps are followed. Apps also provide theme support and payment provider forwarding.

## Essential identifiers

- Plugin, Theme, App — the three extension mechanisms compared on this page.
- Theme manager — where an installed theme must be selected before use.

## Gotchas

- Apps cannot modify the database structure, unlike Plugins.
- Only Apps can be installed in Shopware 6 Cloud shops; Plugins and Themes require a self-hosted shop.
