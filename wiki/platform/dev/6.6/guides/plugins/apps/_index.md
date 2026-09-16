---
id: platform/dev/6.6/guides/plugins/apps/_index.md
title: Apps
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/
sourceHash: d82ed006a92e63faad56915a095b05db14525b50
keywords: ["apps", "App SDK", "plugin system", "App scripts", "extensions", "customization", "Storefront", "Administration", "payment gateway", "shipping method", "checkout process", "pricing rules"]
summary: "Apps are Shopware extensions built via the App SDK, plugin system, or App scripts to add, modify, or integrate storefront and admin functionality."
lastBuilt: "2026-09-15"
---
## What it is

Apps are custom-developed extensions that add functionality and customization options to Shopware. They can be built using the Shopware App SDK, the plugin system, or App scripts.

## When to use

The source describes four typical purposes for an app:

- **Extending functionality**: adding new features such as custom payment gateways, advanced shipping methods, or enhanced product catalog management.
- **Modifying existing functionality**: altering the checkout process, implementing custom pricing rules, or customizing the customer management system or search functionality.
- **Customizing the user interface**: creating custom Storefront themes, adding custom blocks or elements to the Storefront, or modifying the appearance and layout of the Administration panel.
- **Integrating with external systems**: enabling seamless data synchronization, order management, and cross-platform interactions.

## Key steps / config

Apps can be built with one of three approaches:

- The **App SDK** — for apps that need to communicate with an external backend server.
- The **plugin system** — reusing Shopware's plugin mechanism.
- **App scripts** — Twig-based logic executed inside Shopware without needing an external server.

While plugins and themes are also extension mechanisms, apps differ from them: an app is driven by a manifest and webhook interface rather than PHP code installed directly inside the Shopware instance, giving a flexible and modular way to extend and customize the platform for specific business requirements.

## Essential identifiers

- App SDK
- plugin system
- App scripts
- Storefront
- Administration
