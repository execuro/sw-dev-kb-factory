---
id: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/_index.md
title: Advanced Storefront Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/
sourceHash: 2bacd1c08bea4a42cf4dce5b533c124a76f29f8d
codeCheckedAgainst: "6.7.15.1"
keywords: ["advanced storefront", "http cache", "_httpCache", "cookie consent", "cookie manager", "CookieGroupCollectEvent", "COOKIE_CONFIGURATION_UPDATE", "PluginManager", "remove javascript plugin", "performance", "gdpr"]
summary: Index of advanced Storefront plugin guides - HTTP caching for custom controllers, cookie consent manager integration, and removing JavaScript plugins.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md"]
---
## What it is

Index of the advanced Storefront customization guides for plugins: performance optimization, caching behaviour, cookie consent integration, and JavaScript plugin control.

## When to use

When a Storefront plugin needs HTTP caching on its own routes, has to register cookies with the consent manager or react to consent, or should drop a default JavaScript plugin it does not need.

## Key steps / config

- [Add caching to custom controller](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md) - mark a route cacheable via the `_httpCache` route default.
- [Add cookie to manager](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md) - listen to `CookieGroupCollectEvent` and add `CookieEntry` objects.
- [Reacting to cookie consent changes](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md) - subscribe to `COOKIE_CONFIGURATION_UPDATE` in JavaScript.
- [Remove JavaScript plugin](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md) - unregister a default Storefront JS plugin.

## Code check (6.7.15.1)
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — value `_httpCache` — vendor/shopware/core/PlatformRequest.php:82
- confirmed `CookieGroupCollectEvent` — event class exists — vendor/shopware/core/Content/Cookie/Event/CookieGroupCollectEvent.php:18
- confirmed `COOKIE_CONFIGURATION_UPDATE` — exported JS event constant — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:45
- confirmed `PluginManager.deregister()` — static JS plugin removal — vendor/shopware/storefront/Resources/app/storefront/src/plugin-system/plugin.manager.js:851
