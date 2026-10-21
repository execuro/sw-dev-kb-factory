---
id: platform/hubs/getdecorated.md
title: getdecorated
summary: Service decoration in Shopware: abstract classes with getDecorated(), decorator guides, public API rules and ADRs for 6.6 and 6.7.
keywords: ["getDecorated", "service decoration", "decorator pattern", "DecorationPatternException", "decorates", ".inner", "abstract class", "public api", "@internal", "store-api route", "backward compatibility", "extension events"]
members: ["platform/dev/6.6/guides/plugins/plugins/checkout/cart/customize-price-calculation.md", "platform/dev/6.6/guides/plugins/plugins/checkout/payment/customize-payment-provider.md", "platform/dev/6.6/guides/plugins/plugins/content/mail/add-data-to-mails.md", "platform/dev/6.6/guides/plugins/plugins/content/sitemap/add-custom-sitemap-entries.md", "platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/adjusting-service.md", "platform/dev/6.6/resources/guidelines/code/backward-compatibility.md", "platform/dev/6.6/resources/guidelines/code/core/decorator-pattern.md", "platform/dev/6.6/resources/guidelines/code/core/internal.md", "platform/dev/6.6/resources/references/adr/2020-11-25-decoration-pattern.md", "platform/dev/6.6/resources/references/adr/2021-11-09-increment-pattern.md", "platform/dev/6.7/guides/development/extensions/architecture/_index.md", "platform/dev/6.7/guides/development/extensions/architecture/internal.md", "platform/dev/6.7/guides/plugins/plugins/checkout/cart/customize-price-calculation.md", "platform/dev/6.7/guides/plugins/plugins/checkout/payment/customize-payment-provider.md", "platform/dev/6.7/guides/plugins/plugins/content/mail/add-data-to-mails.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md", "platform/dev/6.7/guides/plugins/plugins/framework/store-api/override-existing-route.md", "platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md", "platform/dev/6.7/resources/guidelines/code/core/decorator-pattern.md", "platform/dev/6.7/resources/guidelines/code/core/internal.md", "platform/dev/6.7/resources/guidelines/code/store-api.md", "platform/dev/6.7/resources/references/adr/2020-11-25-decoration-pattern.md", "platform/dev/6.7/resources/references/adr/2026-09-24-replace-abstract-route-classes-with-extension-events.md"]
lastBuilt: 2026-10-21
---

# getdecorated

Shopware services that are meant to be extended by plugins are written as abstract classes with a `getDecorated()` method, not as interfaces. A plugin registers a decorator with `decorates` (or `->decorate()` with `service('.inner')`), delegates to the inner service, and overrides only what it needs. The core implementation of `getDecorated()` throws `DecorationPatternException`. Come to this hub when you need to change the behavior of an existing service, payment handler, mail service or Store API route, or when you need the rules on what counts as public API versus `@internal`. The hub also covers the ADRs behind the pattern.

## Lifecycle note (6.7)

The 6.7 ADR on extension events says Store API routes now expose `ExtensionDispatcher` pre/post/error events as the preferred extension point, instead of decorating abstract route classes. For routes, check that ADR before following the older decoration guides.

## Shopware 6.6

Plugin guides:
- [Adjusting a service](platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/adjusting-service.md) — decorate a service with `decorates` and an abstract `getDecorated()`.
- [Customize price calculation](platform/dev/6.6/guides/plugins/plugins/checkout/cart/customize-price-calculation.md) — decorate `ProductPriceCalculator` to change product prices globally.
- [Customize payment provider](platform/dev/6.6/guides/plugins/plugins/checkout/payment/customize-payment-provider.md) — decorate an existing payment provider such as `DebitPayment` to change `pay()`.
- [Add data to mails](platform/dev/6.6/guides/plugins/plugins/content/mail/add-data-to-mails.md) — decorate `MailService` `send` to add template data.
- [Add custom sitemap entries](platform/dev/6.6/guides/plugins/plugins/content/sitemap/add-custom-sitemap-entries.md) — sitemap URLs through config or a custom `AbstractUrlProvider`.

Guidelines:
- [Decorator pattern](platform/dev/6.6/resources/guidelines/code/core/decorator-pattern.md) — abstract classes, `DecorationPatternException`, and when to use plain injection.
- [Internal](platform/dev/6.6/resources/guidelines/code/core/internal.md) — public versus `@internal` API, `final` classes, decoration.
- [Backward Compatibility](platform/dev/6.6/resources/guidelines/code/backward-compatibility.md) — `@deprecated`, `@feature-deprecated`, `@major-deprecated` and `@internal` rules.

ADRs:
- [Decoration pattern](platform/dev/6.6/resources/references/adr/2020-11-25-decoration-pattern.md) — abstract classes with `getDecorated()` replace service interfaces.
- [Introduce increment pattern](platform/dev/6.6/resources/references/adr/2021-11-09-increment-pattern.md) — increment gateway replacing `message_queue_stats`; mentions `getDecorated` only in passing.

## Shopware 6.7

Plugin guides:
- [Adjusting a Service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md) — `->decorate()`, `service('.inner')`, decorator chain pitfalls.
- [Customize Price Calculation](platform/dev/6.7/guides/plugins/plugins/checkout/cart/customize-price-calculation.md) — decorate `ProductPriceCalculator` with an `AbstractProductPriceCalculator` subclass.
- [Customize Payment Provider](platform/dev/6.7/guides/plugins/plugins/checkout/payment/customize-payment-provider.md) — wrap an `AbstractPaymentHandler` and override `pay()`.
- [Add Data to Mails](platform/dev/6.7/guides/plugins/plugins/content/mail/add-data-to-mails.md) — decorate `AbstractMailService::send()` or subscribe to `MailBeforeValidateEvent`.
- [Add Store API Route](platform/dev/6.7/guides/plugins/plugins/framework/store-api/add-store-api-route.md) — abstract route, route class, `StoreApiResponse`, `routes.php`.
- [Override Existing Route](platform/dev/6.7/guides/plugins/plugins/framework/store-api/override-existing-route.md) — decorate a Store API abstract route via `getDecorated()`.

Architecture and guidelines:
- [Extension Architecture](platform/dev/6.7/guides/development/extensions/architecture/_index.md) — domain separation and allowed patterns for plugins, apps, bundles, themes.
- [Public API and Internal Annotation](platform/dev/6.7/guides/development/extensions/architecture/internal.md) — what is stable in minors; `final`, decoration classes, `@internal`.
- [Decorator pattern](platform/dev/6.7/resources/guidelines/code/core/decorator-pattern.md) — core rules: abstract base, `getDecorated()`, no extra public methods.
- [Internal](platform/dev/6.7/resources/guidelines/code/core/internal.md) — core guideline on `@internal`, `@final`, native `final` and compiler passes.
- [Store API](platform/dev/6.7/resources/guidelines/code/store-api.md) — route services, `StoreApiResponse`, page loaders and controllers only call routes.

ADRs:
- [Decoration pattern](platform/dev/6.7/resources/references/adr/2020-11-25-decoration-pattern.md) — same ADR as the 6.6 copy, near-duplicate across versions.
- [Replace abstract route classes with the extension event system](platform/dev/6.7/resources/references/adr/2026-09-24-replace-abstract-route-classes-with-extension-events.md) — `ExtensionDispatcher` events preferred over decorating routes.
