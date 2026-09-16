---
id: platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md
title: Add Cookie to Manager
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.html
sourceHash: 25a9f5ed9a736afaa84193817aa54c640e754879
codeCheckedAgainst: "6.7.13.0"
keywords: ["CookieGroupCollectEvent", "CookieEntry", "CookieGroup", "CookieEntryCollection", "cookie consent manager", "gdpr", "cookie banner", "kernel.event_listener", "cookie.groupComfortFeatures", "cookie-config-hash", "re-consent", "store-api.cookie.groups", "custom cookie"]
summary: Add custom cookies to the Storefront cookie consent manager by listening to CookieGroupCollectEvent and adding CookieEntry objects to a group (6.7.3+).
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How a plugin registers its own cookies with Shopware's built-in cookie consent manager: listen to `Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent` and add structured `CookieEntry` objects to a `CookieGroup` in the event's collection.

## When to use

Your plugin sets a cookie that must be listed in the consent manager (GDPR), e.g. in the "Comfort Features" group. Prerequisites: a running plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)), a service ([Add custom service](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md)) and event listening ([Listening to events](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md)).

## Key steps / config

1. Register an invokable listener in `<plugin root>/src/Resources/config/services.php`:

```php
$services->set(CookieListener::class)
    ->tag('kernel.event_listener', ['event' => 'Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent']);
```

2. Implement `__invoke(CookieGroupCollectEvent $event)`. `$event->cookieGroupCollection` is keyed by each group's technical name (a snippet key); the default comfort group is `'cookie.groupComfortFeatures'`:

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

## Essential identifiers

- `Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent` (public `$cookieGroupCollection`)
- `Shopware\Core\Content\Cookie\Struct\CookieEntry` — `new CookieEntry(string $cookie)`; public `$name`, `$description`, `$value`, `$expiration` (int), `$hidden`
- `Shopware\Core\Content\Cookie\Struct\CookieEntryCollection`
- `Shopware\Core\Content\Cookie\Struct\CookieGroup` — `getEntries()`, `setEntries()`, `getTechnicalName()`
- Group keys: `cookie.groupRequired`, `cookie.groupStatistical`, `cookie.groupComfortFeatures`, `cookie.groupMarketing`
- Store API route `store-api.cookie.groups` (`/store-api/cookie-groups`), browser cookie `cookie-config-hash`

## Gotchas

- A `CookieGroup` is either a standalone cookie or a container of `entries`; setting both throws. `cookie`, `value`, `expiration`, `isRequired` belong on entries, not on groups with entries.
- The docs snippet uses `Shopware\Core\Content\Cookie\Service\CookieProvider::SNIPPET_NAME_COOKIE_GROUP_COMFORT_FEATURES`; that class is flagged deprecated and is `@internal`, so use the literal key instead.
- Re-consent: a hash of the cookie configuration is stored in the `cookie-config-hash` browser cookie as JSON keyed by language ID (`{"<languageId>":"<hash>"}`); a changed hash for the current language re-shows the banner. The docs give the Store API path as `/store-api/cookie/groups`; the installed route is `/store-api/cookie-groups`.
- YouTube and Vimeo cookies are handled separately; register or reuse the matching video platform cookie.

## Version notes

- Since 6.7.3.0 cookies use `CookieEntry`/`CookieGroup` objects (array format deprecated) and configuration changes trigger hash-based re-consent. `Shopware\Storefront\Framework\Cookie\CookieProviderInterface` (6.7.2 and earlier) is `@deprecated tag:v6.8.0`; legacy array groups are converted until 6.8.0.

## Code check (6.7.13.0)
- deprecated `Shopware\Core\Content\Cookie\Service\CookieProvider` — `@internal` class, not for plugin use; wraps the v6.8.0-deprecated legacy provider — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:26
- confirmed `CookieGroupCollectEvent::$cookieGroupCollection` — public CookieGroupCollection — vendor/shopware/core/Content/Cookie/Event/CookieGroupCollectEvent.php:18
- confirmed `CookieEntry::$cookie` — constructor arg; `$value`, `$expiration`, `$name` public — vendor/shopware/core/Content/Cookie/Struct/CookieEntry.php:27
- confirmed `CookieGroup::getEntries()` — returns ?CookieEntryCollection — vendor/shopware/core/Content/Cookie/Struct/CookieGroup.php:63
- confirmed `CookieGroup::setEntries()` — throws if group cookie already set — vendor/shopware/core/Content/Cookie/Struct/CookieGroup.php:68
- confirmed `CookieGroupCollection` — keyed by group technicalName — vendor/shopware/core/Content/Cookie/Struct/CookieGroupCollection.php:14
- confirmed `cookie.groupComfortFeatures` — default comfort group key — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:30
- confirmed `cookie-config-hash` — config hash cookie name — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:32
- corrected `/store-api/cookie-groups` — docs: /store-api/cookie/groups — vendor/shopware/core/Content/Cookie/SalesChannel/CookieRoute.php:40
- deprecated `CookieProviderInterface` — tag:v6.8.0, use CookieGroupCollectEvent — vendor/shopware/storefront/Framework/Cookie/CookieProviderInterface.php:15
