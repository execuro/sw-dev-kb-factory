---
id: platform/dev/6.7/concepts/commerce/content/_index.md
title: Content
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/commerce/content/
sourceHash: c9910cbae167bf28d246f92ed08a60ab85131176
codeCheckedAgainst: "6.7.13.0"
keywords: ["content", "shopping experiences", "page builder", "cms", "cms_page", "sw-cms", "layouts", "cookie consent", "CookieGroupCollectEvent", "gdpr"]
summary: "Content concepts overview: Shopping Experiences CMS layouts built in the admin Page Builder, and cookie consent management for GDPR support."
lastBuilt: 2026-09-15
---
## What it is

Overview of Shopware's content concepts. Shopware 6 has an integrated, layout-based content management system called *Shopping Experiences*; layouts are composed and managed in the Administration with the *Page Builder*. Shopware also provides Cookie Consent Management to help with GDPR compliance by handling customer privacy preferences and cookies transparently.

## When to use

As an entry point when you work on CMS layouts (Shopping Experiences) or on cookie consent handling and need to know which content concepts exist.

## Essential identifiers

- `cms_page` — entity behind Shopping Experiences layouts
- `sw-cms` — Administration module of the Page Builder
- `CookieGroupCollectEvent` — current way to introduce cookies into the consent manager

## Gotchas

- `CookieProviderInterface` (Storefront) is deprecated for removal in 6.8.0; use `CookieGroupCollectEvent` instead.

## Code check (6.7.13.0)
- confirmed `cms_page` — CmsPageDefinition entity name — vendor/shopware/core/Content/Cms/CmsPageDefinition.php:34
- confirmed `sw-cms` — Page Builder admin module registration — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/index.ts:39
- confirmed `CookieGroupCollectEvent` — event for collecting cookie groups — vendor/shopware/core/Content/Cookie/Event/CookieGroupCollectEvent.php:15
- deprecated `CookieProviderInterface` — deprecated tag:v6.8.0 — vendor/shopware/storefront/Framework/Cookie/CookieProviderInterface.php:15
