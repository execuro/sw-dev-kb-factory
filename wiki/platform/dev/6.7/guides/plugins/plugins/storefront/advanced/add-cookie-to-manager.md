---
id: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md
title: Add Cookie to Manager
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.html
sourceHash: 25a9f5ed9a736afaa84193817aa54c640e754879
codeCheckedAgainst: "6.7.15.1"
keywords: ["CookieGroupCollectEvent", "CookieEntry", "CookieEntryCollection", "CookieGroup", "CookieGroupCollection", "CookieProviderInterface", "cookie-config-hash", "store-api.cookie.groups", "cookie consent manager", "gdpr", "cookie banner", "re-consent", "kernel.event_listener"]
summary: Register custom cookies in the Storefront consent manager by listening to CookieGroupCollectEvent and adding CookieEntry objects (6.7.3+).
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/concepts/commerce/content/cookie-consent-management.md", "platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md", "platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md"]
---
## What it is

How a plugin adds its own cookies to Shopware's built-in cookie consent manager. Since 6.7.3.0 cookies are structured objects (`CookieEntry`, `CookieGroup`) collected through the `Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent`; the old array format is deprecated. Background: [Cookie consent management concept](platform/dev/6.7/concepts/commerce/content/cookie-consent-management.md).

## When to use

Your plugin sets a cookie (tracking, comfort feature, video embed, etc.) that must be listed in the consent manager so users can accept or decline it. To act on the user's choice, continue with [Reacting to cookie consent changes](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/reacting-to-cookie-consent-changes.md).

## Key steps / config

1. Register a listener (an event listener is recommended for a single event) in `<plugin root>/src/Resources/config/services.php`:

```php
$services->set(CookieListener::class)
    ->tag('kernel.event_listener', ['event' => 'Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent']);
```

2. Implement `__invoke(CookieGroupCollectEvent $event)`. `$event->cookieGroupCollection` is a `CookieGroupCollection` keyed by the group's technical name; the comfort-features group is `cookie.groupComfortFeatures`:

```php
$group = $event->cookieGroupCollection->get('cookie.groupComfortFeatures');
if (!$group) { return; }
$entries = $group->getEntries();
if ($entries === null) {
    $entries = new CookieEntryCollection();
    $group->setEntries($entries);
}
$cookieEntry = new CookieEntry('my-cookie-key');
$cookieEntry->name = 'cookie.myCookieName';
$cookieEntry->value = '1';
$cookieEntry->expiration = 30;
$entries->add($cookieEntry);
```

Classes: `Shopware\Core\Content\Cookie\Struct\CookieEntry`, `Shopware\Core\Content\Cookie\Struct\CookieEntryCollection`, `Shopware\Core\Content\Cookie\Struct\CookieGroup`. `CookieEntry` takes the cookie key in its constructor and has public `name`, `description`, `value`, `expiration` and `hidden` properties; `name`/`description` may be snippet keys or translated text.

Re-consent: since 6.7.3.0 a hash over the whole cookie configuration is calculated. Adding, removing or changing cookies changes the hash; on the next visit the banner reappears when the stored hash for the current language differs. The hash is stored in the `cookie-config-hash` cookie as a JSON object `{"<languageId>":"<hash>"}`, and is returned by the Store API route `store-api.cookie.groups` (`GET /store-api/cookie-groups`).

## Essential identifiers

- `CookieGroupCollectEvent` (`$cookieGroupCollection`, `getSalesChannelContext()`)
- `CookieGroup::getEntries()` / `CookieGroup::setEntries()`
- `CookieEntry`, `CookieEntryCollection`, `CookieGroupCollection`
- group technical names `cookie.groupRequired`, `cookie.groupStatistical`, `cookie.groupComfortFeatures`, `cookie.groupMarketing`
- `cookie-config-hash`, `store-api.cookie.groups`

## Gotchas

- The docs' sample references the group name via `Shopware\Core\Content\Cookie\Service\CookieProvider::SNIPPET_NAME_COOKIE_GROUP_COMFORT_FEATURES`. That class is `@internal` in 6.7.15.1 and its legacy branch is deprecated; use the string value `cookie.groupComfortFeatures` instead.
- A group must not carry `cookie`, `value`, `expiration` or `isRequired` when it has `entries`: `CookieGroup::setCookie()` and `setEntries()` throw if the other one is already set.
- The docs give the Store API path as `/store-api/cookie/groups`; the installed route is `/store-api/cookie-groups`.
- YouTube and Vimeo cookies are handled separately; register the right cookie for your video platform or reuse an existing one.

## Version notes

- 6.7.2 and earlier: cookies were added via `Shopware\Storefront\Framework\Cookie\CookieProviderInterface` (array syntax). It still works for backward compatibility but is `@deprecated tag:v6.8.0`; migrate to `CookieGroupCollectEvent`.
- 6.7.3.0: structured `CookieEntry`/`CookieGroup` objects and the configuration hash with re-consent.

## Code check (6.7.15.1)
- deprecated `Shopware\Core\Content\Cookie\Service\CookieProvider` — class is `@internal`; its legacy-provider conversion is `@deprecated tag:v6.8.0` — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:28
- confirmed `CookieGroupCollectEvent::$cookieGroupCollection` — public `CookieGroupCollection` property — vendor/shopware/core/Content/Cookie/Event/CookieGroupCollectEvent.php:21
- confirmed `CookieEntry` — constructor takes `$cookie`; public `name`/`value`/`expiration` — vendor/shopware/core/Content/Cookie/Struct/CookieEntry.php:14
- confirmed `CookieGroup::getEntries()` — returns `?CookieEntryCollection` — vendor/shopware/core/Content/Cookie/Struct/CookieGroup.php:63
- confirmed `CookieGroup::setCookie()` — throws when entries are already set — vendor/shopware/core/Content/Cookie/Struct/CookieGroup.php:55
- confirmed `CookieGroupCollection::add()` — keyed by technical name — vendor/shopware/core/Content/Cookie/Struct/CookieGroupCollection.php:21
- confirmed `SNIPPET_NAME_COOKIE_GROUP_COMFORT_FEATURES` — value `cookie.groupComfortFeatures` — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:32
- confirmed `COOKIE_ENTRY_CONFIG_HASH_COOKIE` — value `cookie-config-hash` — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:34
- corrected `store-api.cookie.groups` — docs: `/store-api/cookie/groups`; route path is `/store-api/cookie-groups` — vendor/shopware/core/Content/Cookie/SalesChannel/CookieRoute.php:40
- deprecated `CookieProviderInterface` — `@deprecated tag:v6.8.0`, use `CookieGroupCollectEvent` — vendor/shopware/storefront/Framework/Cookie/CookieProviderInterface.php:12
