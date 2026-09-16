---
id: platform/dev/6.6/guides/plugins/plugins/_index.md
title: Plugins
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/
sourceHash: c58860938b2291d15fc3dc137a27ef7a22027968
keywords: ["plugins", "static plugins", "Shopware Bundle", "Symfony Bundle", "custom/plugins", "custom/static-plugins", "composer req", "plugin lifecycle", "Administration management"]
summary: "Compares Plugin, Static Plugin, Shopware Bundle, and Symfony Bundle installation, lifecycle, and Administration management differences."
lastBuilt: "2026-09-15"
---
## What it is
Describes the different plugin types in Shopware 6: regular Plugins, Static Plugins, Shopware Bundles, and Symfony Bundles, and how they differ.

## When to use
Reference when deciding how to package a customization: use bundles for project customizations needing full control without an Administration-managed lifecycle; use a Plugin when Store distribution or Administration installation/uninstallation is required.

## Key steps / config
Feature comparison:

| Feature | Plugin | Static Plugin | Shopware Bundle | Symfony Bundle |
| --- | --- | --- | --- | --- |
| Installation | Via Shopware Admin | Via Composer | Via Composer | Via Composer |
| Repository location | `custom/plugins` | `custom/static-plugins` | `vendor` or `src` folder | `vendor` or `src` folder |
| Lifecycle events (install, update, uninstall) | Yes | Yes | No | No |
| Managed in Administration | Yes | No | No | No |
| Can be a Theme | Yes | Yes | Yes | No |
| Can modify Admin/Storefront with JS/CSS | Yes | Yes | Yes | No |

Install a static plugin:
```bash
# You can find the vendor/package name in the plugin's composer.json file under "name"
composer req <vendor>/<plugin-name>
```

## Essential identifiers
- `custom/plugins`
- `custom/static-plugins`
- `composer req <vendor>/<plugin-name>`

## Gotchas
- Static plugin detection is not done via the Administration; the plugin must be required by the project through Composer to be installable.
- For customizing projects, bundles are recommended over plugins since they are not managed via Administration and offer full project control.
