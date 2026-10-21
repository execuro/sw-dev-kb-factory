---
id: platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md
title: Template scoping
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/guides/template-scoping.html
sourceHash: cb7369975f8f8c2adf0a5546057c96e6f00cdf39
codeCheckedAgainst: "6.7.15.1"
keywords: ["sw_extends", "scopes", "subscription", "mixed-subscription", "default", "template scope", "TemplateScopeDetector", "_templateScopes", "twig extension", "subscription checkout", "storefront template", "ExtendsTokenParser"]
summary: Restrict Storefront twig extensions to template scopes (default, subscription, mixed-subscription) via the scopes option of sw_extends.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/concept.md"]
---
## What it is

The Subscriptions feature uses template scopes so that twig template changes made for the normal Storefront are not applied automatically during the subscription checkout. A template that extends another declares the scopes it applies to in `sw_extends`. Read the [subscription concept](platform/dev/6.7/products/extensions/subscriptions/concept.md) first.

## When to use

Use it when you write a Storefront template extension and need to decide whether it should also render in the subscription checkout. Elements meant for immediate purchases, or third-party payment buttons such as PayPal Express, should stay out of the subscription checkout so customers are not confused. A template meant for the subscription flow must opt in to that scope explicitly.

## Key steps / config

1. Use the object form of `sw_extends` with `template` and `scopes`:

```twig
{% sw_extends {
    template: '@Storefront/storefront/base.html.twig',
    scopes: ['default', 'subscription']
} %}
```

2. Pick the scopes. The Subscriptions feature adds `subscription` and `mixed-subscription`, which match its two checkout processes (see the concept page). The core default scope is `default`.
3. If you leave out `scopes`, or use the plain string form `{% sw_extends '@Storefront/...' %}`, the core treats the extension as `['default']` only. It is then skipped in a subscription-scoped request.
4. `scopes` may be a single string. The core wraps it in a one-element array.

The core reads the active scopes from the request attribute `_templateScopes`. If none of the active scopes match the template's `scopes`, the core keeps the `extends` and adds an end-of-file token, so the extending template's own blocks are dropped.

## Essential identifiers

- `sw_extends` with options `template`, `scopes`
- Scopes: `default`, `subscription`, `mixed-subscription`
- `Shopware\Core\Framework\Adapter\Twig\TemplateScopeDetector` (`DEFAULT_SCOPE = 'default'`, `SCOPES_ATTRIBUTE = '_templateScopes'`)

## Gotchas

- In the `subscription` scope the global `context` is replaced by the subscription context, so the `subscription` extension is available there.
- Templates whose source name starts with `@Storefront` are never cut off by the scope check. Only extensions from plugins, apps and themes are filtered.
- An object-form `sw_extends` without a string `template` key throws an adapter exception (`missingExtendsTemplate`).

## Code check (6.7.15.1)
- confirmed `sw_extends` — tag name of the core extends token parser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `scopes` — missing scopes default to `[DEFAULT_SCOPE]`, a string becomes an array — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:91
- confirmed `TemplateScopeDetector::DEFAULT_SCOPE` — value `default` — vendor/shopware/core/Framework/Adapter/Twig/TemplateScopeDetector.php:15
- confirmed `TemplateScopeDetector::SCOPES_ATTRIBUTE` — request attribute `_templateScopes` holds the active scopes — vendor/shopware/core/Framework/Adapter/Twig/TemplateScopeDetector.php:14
- confirmed `ExtendsTokenParser::shouldEndFile()` — no scope overlap ends the file, except for `@Storefront` sources — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:106
- unverified `subscription` — scope set by the commercial Subscriptions extension, not in core/storefront
- unverified `mixed-subscription` — scope set by the commercial Subscriptions extension, not in core/storefront
