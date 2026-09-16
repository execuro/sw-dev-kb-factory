---
id: platform/dev/6.7/products/extensions/subscriptions/guides/template-scoping.md
title: Template scoping
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/subscriptions/guides/template-scoping.html
sourceHash: cb7369975f8f8c2adf0a5546057c96e6f00cdf39
codeCheckedAgainst: "6.7.13.0"
keywords: ["template scoping", "template scopes", "sw_extends", "scopes", "subscription", "mixed-subscription", "default scope", "_templateScopes", "twig", "subscription checkout", "storefront template extension", "paypal express hiding"]
summary: "Subscription template scopes: sw_extends with scopes ['default', 'subscription'] keeps storefront extensions out of subscription checkout."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/subscriptions/concept.md"]
---
## What it is

Template scoping lets Twig template extensions declare in which checkout context they apply, so that Storefront adjustments made for the regular checkout are not automatically applied inside the subscription checkout. The Subscriptions feature adds two scopes: `subscription` and `mixed-subscription`. See the [subscription concept](platform/dev/6.7/products/extensions/subscriptions/concept.md) for the two checkout processes.

## When to use

When a theme or extension overrides Storefront templates and must decide whether the change is visible during subscription checkout — e.g. hiding immediate-purchase buttons or third-party express payment options such as PayPal Express there, or making a template also apply in the subscription context.

## Key steps / config

Declare the scopes in the `sw_extends` tag of the overriding template:

```twig
{% sw_extends {
    template: '@Storefront/storefront/base.html.twig',
    scopes: ['default', 'subscription']
} %}
```

- `default` is the regular Storefront scope; list `subscription` and/or `mixed-subscription` to have the extension applied in those checkouts too.
- Omitting `scopes` means the extension applies only in `default` (installed core defaults `scopes` to `['default']`).
- The current request's scopes come from the route attribute `_templateScopes` (string or array); if unset, the scope is `default`.

## Essential identifiers

- `sw_extends` with option `scopes`
- scopes `default`, `subscription`, `mixed-subscription`
- `_templateScopes`

## Gotchas

- In the `subscription` scope the global Twig `context` is replaced by the subscription context, so the `subscription` extension is available on it.
- Installed core behaviour: when none of the request scopes match the template's `scopes`, the extending file is cut off — except when the extended source starts with `@Storefront`, in which case it is still applied (`ExtendsTokenParser::shouldEndFile()`).

## Version notes

- `TemplateScopeDetector` (reads `_templateScopes`) is marked to become final in v6.8.0; do not extend it.

## Code check (6.7.13.0)
- confirmed `sw_extends` — tag name of the extends token parser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `scopes` — defaults to the default scope when omitted — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:91
- confirmed `DEFAULT_SCOPE` — value `'default'` — vendor/shopware/core/Framework/Adapter/Twig/TemplateScopeDetector.php:16
- confirmed `_templateScopes` — request attribute holding active scopes — vendor/shopware/core/Framework/Adapter/Twig/TemplateScopeDetector.php:15
- confirmed `ExtendsTokenParser::shouldEndFile()` — skips non-matching scopes unless source starts with @Storefront — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:104
- deprecated `TemplateScopeDetector` — becomes final in v6.8.0 — vendor/shopware/core/Framework/Adapter/Twig/TemplateScopeDetector.php:13
- unverified `subscription` — scope registered by Commercial Subscription code, not installed in vendor/shopware
- unverified `mixed-subscription` — scope registered by Commercial Subscription code, not installed in vendor/shopware
