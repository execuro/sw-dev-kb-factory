---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-cookie-to-manager.md
title: Add cookie to manager
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-cookie-to-manager.html
sourceHash: 762d677cd4516da92dba605771151497a89d38d0
keywords: ["cookie consent manager", "CookieProvider", "CookieProviderInterface", "getCookieGroups", "decorates", "cookie group", "GDPR", "snippet_name", "cookie array keys", "decorate service"]
summary: "How to add custom cookies to Shopware's cookie consent manager by decorating CookieProviderInterface and its getCookieGroups method."
lastBuilt: "2026-09-15"
---
## What it is

Explains how to add custom cookies to Shopware 6's built-in cookie consent manager by decorating the `CookieProvider` service.

## When to use

When a plugin sets cookies of its own and needs them to appear (and be governable) in the storefront's cookie consent manager.

## Key steps / config

1. Register a decoration of `Shopware\Storefront\Framework\Cookie\CookieProviderInterface`:

```xml
<service id="PluginName\Framework\Cookie\CustomCookieProvider"
         decorates="Shopware\Storefront\Framework\Cookie\CookieProviderInterface">
    <argument type="service"
              id="PluginName\Framework\Cookie\CustomCookieProvider.inner" />
</service>
```

2. Implement `CookieProviderInterface` and override `getCookieGroups(): array`, calling the original service and merging in custom groups/cookies:

```php
class CustomCookieProvider implements CookieProviderInterface {
    public function __construct(CookieProviderInterface $service) { ... }

    public function getCookieGroups(): array
    {
        return array_merge(
            $this->originalService->getCookieGroups(),
            [self::cookieGroup, self::singleCookie]
        );
    }
}
```

Cookie array attributes:

| Attribute | Required | Notes |
|---|---|---|
| `snippet_name` | Yes | Display-name snippet key |
| `snippet_description` | No | Description snippet key |
| `cookie` | Yes | Internal cookie name |
| `value` | No | If unset, Shopware won't set/unset the cookie itself, only passes it to the update event |
| `expiration` | No | Lifetime in days; if unset, cookie expires with the session |
| `entries` | No | Array of cookie objects for a group; nested groups unsupported; a group with `entries` should not itself have `cookie`, `value`, or `expiration` |

## Essential identifiers

- `Shopware\Storefront\Framework\Cookie\CookieProviderInterface`
- `CookieProviderInterface::getCookieGroups()`
- `decorates` service attribute

## Gotchas

`entries`-based groups must not also set `cookie`, `value`, or `expiration` on the group itself; nested groups are not supported.
