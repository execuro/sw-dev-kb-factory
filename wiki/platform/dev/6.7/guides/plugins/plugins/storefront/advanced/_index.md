---
id: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/_index.md
title: Advanced Storefront Customization
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/
sourceHash: 2bacd1c08bea4a42cf4dce5b533c124a76f29f8d
codeCheckedAgainst: "6.7.13.0"
keywords: ["advanced storefront", "http cache", "_httpCache", "caching", "cookie consent", "cookie manager", "CookieGroupCollectEvent", "javascript plugin", "remove js plugin", "performance", "storefront plugin"]
summary: Index of advanced Storefront plugin guides - HTTP caching for custom controllers, cookie consent manager integration and removing JavaScript plugins.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md"]
---
## What it is

Index of advanced topics for extending and customizing the Storefront in plugins: performance optimization, caching behavior, cookie consent integration, and control over Storefront JavaScript plugins.

## When to use

A Storefront plugin already works (controllers, templates, JS) and you now need to make a custom route HTTP-cacheable, register cookies with the consent manager, react to consent decisions, or drop a JavaScript plugin you do not need.

## Key steps / config

Pick the guide for the task:

- [Add caching to custom controller](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-caching-to-custom-controller.md) — mark a Storefront controller route cacheable for the HTTP cache by setting the route default `_httpCache` to `true`; invalidation follows the Store API cache tags collected during the request.
- [Add cookie to manager](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md) — listen to `Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent` and add `CookieEntry` objects to a cookie group (structured objects since 6.7.3.0).
- [Reacting to cookie consent changes](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md) — run custom logic once a cookie is accepted or declined.
- [Remove JavaScript plugin](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/remove-unnecessary-js-plugin.md) — remove an unnecessary Storefront JavaScript plugin.

## Essential identifiers

- Route default `_httpCache` (`PlatformRequest::ATTRIBUTE_HTTP_CACHE`)
- `Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent`
- `Shopware\Core\Content\Cookie\Struct\CookieEntry`

## Code check (6.7.13.0)
- confirmed `PlatformRequest::ATTRIBUTE_HTTP_CACHE` — value `_httpCache` — vendor/shopware/core/PlatformRequest.php:80
- confirmed `CookieGroupCollectEvent` — dispatched by the cookie provider — vendor/shopware/core/Content/Cookie/Event/CookieGroupCollectEvent.php:15
- confirmed `CookieEntry` — struct with public `$cookie`, `$value`, `$expiration`, `$name` — vendor/shopware/core/Content/Cookie/Struct/CookieEntry.php:14
