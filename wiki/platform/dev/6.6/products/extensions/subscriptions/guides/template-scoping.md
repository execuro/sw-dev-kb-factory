---
id: platform/dev/6.6/products/extensions/subscriptions/guides/template-scoping.md
title: Template scoping
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/subscriptions/guides/template-scoping.html
sourceHash: 87fd89ced293487436c6668a6ad22ae3b5a72df0
keywords: ["template scoping", "sw_extends", "scopes", "subscription template", "subscription checkout", "twig scope", "PayPal Express", "storefront base template"]
summary: "How to scope a Twig template extension so it only applies inside the subscription checkout, not the regular checkout."
lastBuilt: "2026-09-15"
---
## What it is

Explains that template adjustments meant for the standard storefront checkout (e.g. buttons for immediate purchase or third-party express payment options like PayPal Express) must not automatically leak into the subscription checkout, and shows how to scope a template extension to avoid that.

## Key steps / config

Declare the `scopes` a template extension applies to when using `sw_extends`:

```twig
{% sw_extends {
    template: '@Storefront/storefront/base.html.twig',
    scopes: ['default', 'subscription']
} %}
```

## Essential identifiers

- `sw_extends` (with a `scopes` option)
- Scope values: `default`, `subscription`

## Gotchas

Without explicit scoping, elements meant only for the regular checkout (e.g. immediate-purchase buttons, PayPal Express) can incorrectly appear during subscription checkout, causing confusion for the customer.
