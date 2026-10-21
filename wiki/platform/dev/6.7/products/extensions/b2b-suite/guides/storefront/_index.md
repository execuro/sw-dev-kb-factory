---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/_index.md
title: Storefront
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/
sourceHash: c87d2dfb9dc38939d99dea355f1c9bfeb01836c9
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "storefront", "ajax panel", "product search", "complex views", "modal component", "company management", "acl routing", "frontend extensibility", "b2b frontend", "SwagB2bPlatform"]
summary: Overview of the B2B Suite Storefront component - ajax panel, product search, complex views, modal, company management, ACL routing, extensibility.
lastBuilt: 2026-10-21
---
## What it is

Section overview for the B2B Suite Storefront component. It covers the ajax panel, product search, complex views, the modal component, company management, ACL routing, and the extensibility options for customising the B2B frontend interface.

## When to use

As an entry point when you need to find which B2B Suite Storefront guide covers a frontend feature (ajax panels, ACL-based route blocking, modals, company management) or how to customise it.

## Gotchas

- These features ship with the B2B Suite plugin (`SwagB2bPlatform`), not with the `shopware/storefront` package; the installed platform code contains no B2B Suite storefront code, only the generic Storefront JavaScript plugin system (`PluginManager`, base class `Plugin`).

## Code check (6.7.15.1)
- confirmed `SwagB2bPlatform` — referenced only as an external plugin name in core's translation plugin list — vendor/shopware/core/System/Resources/translation.yaml:9
- confirmed `PluginManager` — generic Storefront JS plugin manager — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:823
- confirmed `Plugin` — base class for Storefront JS plugins — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.class.js:9
