---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/architecture/_index.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/architecture/cart-process.md
  - platform/dev/6.7/guides/plugins/plugins/architecture/context-rules-rule-systems.md
  - platform/dev/6.7/guides/plugins/plugins/architecture/pageloader.md
  - platform/dev/6.7/guides/plugins/plugins/architecture/events.md
sourceHash: 45c536da382e4d320e9321d41a7085a9706bacc0
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/
title: Plugin Architecture
version: "6.7"
versions:
  - "6.7"
keywords: ["plugin architecture", "extension contracts", "architecture rules", "cart extension", "rule system", "page loader", "events", "dependency injection", "CartProcessorInterface", "CartDataCollectorInterface", "ShopwareEvent", "RuleScope"]
summary: Index of mandatory plugin architecture rules for core subsystems - cart, rule system, page loaders, events, dependency injection and domain boundaries.
lastBuilt: 2026-10-21
---
## What it is

The entry page for Shopware's plugin architecture section: architectural rules and extension contracts for core subsystems, describing how to extend Shopware without breaking determinism, performance or system boundaries. The source states these guidelines are mandatory for plugin developers extending core functionality.

## When to use

Before extending a core subsystem in a plugin, to find the contract page for that subsystem.

## Key steps / config

Subsystem contract pages:

- [Cart Extension Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/cart-process.md) — collectors (`CartDataCollectorInterface`) load data once, processors (`CartProcessorInterface`) never query.
- [Rule System Extension Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/context-rules-rule-systems.md) — rules read only from their `RuleScope`, no queries or side effects.
- [Page Loader Extension Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/pageloader.md)
- [Event Extension Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/events.md) — events implement `ShopwareEvent` and are for enrichment, not control flow.
- [Dependency Injection and Dependency Handling](platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md) — Core stays independent of session and request state.

## Code check (6.7.15.1)
- confirmed `CartDataCollectorInterface` — cart collector contract — vendor/shopware/core/Checkout/Cart/CartDataCollectorInterface.php:10
- confirmed `CartProcessorInterface` — cart processor contract — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:10
- confirmed `RuleScope` — abstract rule evaluation scope — vendor/shopware/core/Framework/Rule/RuleScope.php:11
- confirmed `ShopwareEvent` — base event interface — vendor/shopware/core/Framework/Event/ShopwareEvent.php:9
