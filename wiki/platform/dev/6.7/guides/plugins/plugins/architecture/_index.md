---
id: platform/dev/6.7/guides/plugins/plugins/architecture/_index.md
title: Plugin Architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/
sourceHash: 45c536da382e4d320e9321d41a7085a9706bacc0
codeCheckedAgainst: "6.7.13.0"
keywords: ["plugin architecture", "extension contracts", "architectural rules", "cart extension", "rule system", "page loader", "events", "dependency injection", "domain boundaries", "determinism", "performance", "mandatory guidelines"]
summary: "Index of mandatory plugin architecture rules for core subsystems: cart, rule system, page loaders, events, dependency injection and domain boundaries."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/architecture/cart-process.md", "platform/dev/6.7/guides/plugins/plugins/architecture/context-rules-rule-systems.md", "platform/dev/6.7/guides/plugins/plugins/architecture/pageloader.md", "platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md"]
---
## What it is

Section index for the architectural rules and extension contracts that apply when a plugin extends core Shopware subsystems. The documents describe how to extend Shopware without breaking determinism, performance, or system boundaries, and the section states that these guidelines are mandatory for plugin developers extending core functionality.

## When to use

Before building or reviewing a plugin that hooks into the cart, the rule system, page loaders, events, or core services — to find the subsystem page that defines what an extension may and may not do.

## Key steps / config

Pick the subsystem page matching the extension point:

- [Cart Extension Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/cart-process.md) — multi-pass cart calculation; load data once in collectors (`CartDataCollectorInterface`), no database queries in processors (`CartProcessorInterface::process()`), line item factories, core price calculators, Store API routes.
- [Rule System Extension Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/context-rules-rule-systems.md) — rules evaluated synchronously per request; no queries, no side effects, data only via the rule scope (`CartRuleScope`, `LineItemScope`).
- [Page Loader Extension Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/pageloader.md)
- [Event Extension Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/events.md)
- [Dependency Injection and Dependency Handling](platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md) — Core stays stateless and free of session/request access; constructor injection; Storefront or Store API bridges HTTP state.

## Essential identifiers

- `CartDataCollectorInterface`, `CartProcessorInterface`
- `CartRuleScope`, `LineItemScope`

## Code check (6.7.13.0)
- confirmed `CartDataCollectorInterface` — cart collector contract — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:10
- confirmed `CartProcessorInterface::process()` — cart processor contract — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `CartRuleScope` — cart rule scope class — vendor/shopware/core/Checkout/Cart/Rule/CartRuleScope.php:11
- confirmed `LineItemScope` — line item rule scope class — vendor/shopware/core/Checkout/Cart/Rule/LineItemScope.php:11
