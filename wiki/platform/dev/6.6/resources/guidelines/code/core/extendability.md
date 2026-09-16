---
id: "platform/dev/6.6/resources/guidelines/code/core/extendability.md"
title: "Extendability"
docType: "developer"
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/extendability.html"
sourceHash: "d2c1ae6a0fea1d2f72acab33ab90b730525d4257"
keywords: ["extendability", "decoration pattern", "factory pattern", "visitor pattern", "mediator pattern", "adapter pattern", "apps", "plugins", "project templates", "hooks", "app scripts", "checkout.order.placed", "CategoryRoute", "LineItemFactoryRegistry"]
summary: "Shopware's software extendability model: technical/business requirements realized via decoration, factory, visitor, mediator, and adapter patterns."
lastBuilt: "2026-09-15"
---
## What it is

Describes why and how Shopware's architecture is built to be extendable by third parties and Shopware itself, covering technical requirements, business requirements, extension approaches, and the design patterns used to realize them.

## When to use

Reference this when designing a new feature or API surface to decide which extension approach (project template, app, plugin) and design pattern (decoration, factory, visitor, mediator, adapter) fits the intended extensibility use case.

## Key steps / config

Technical requirements: functional extensibility (add new features), functional modifiability (rewrite parts of a feature), functional differentiation (gate parts behind a paid tier), functional exchange market (replace the feature entirely).

Business cases: marketplace extensions (build so plugins can add features easily), adaptive technologies (support swapping technology per area, e.g. Elasticsearch for listings), environment specifications (support different load setups, e.g. CDN-served assets).

Three approaches: project templates (large customers fork the production template; local customizations are bundles, not plugins), Apps (minor extensions, designed for cloud products), Plugins (larger extensions, designed to replace any Shopware area).

Patterns used:
- Decoration — replace/extend an area completely; used heavily for Store API routes (e.g. `AbstractCategoryRoute` behind `CategoryRoute` and `CachedCategoryRoute`).
- Factory — interpret/validate/enrich user input before use, e.g. `LineItemFactoryRegistry` with handlers such as `ProductLineItemFactory`.
- Visitor — process a set of objects, running third-party visitors after/before core ones, e.g. the cart `Processor` running line item processors like `ProductCartProcessor`.
- Mediator — realized via Events, giving developers entry points into a process; the `checkout.order.placed` event is dispatched when an order is created. Best practice is to pass only a primary key (e.g. `orderId`), not the full entity, for easier async processing. Hooks are the App-script equivalent of events, e.g. the product page loaded hook, since apps cannot execute server-side code directly.
- Adapter — swap an implementation via configuration, e.g. selecting a captcha type that resolves to a corresponding adapter class such as the honeypot captcha.

## Essential identifiers

- `checkout.order.placed` event
- `LineItemFactoryRegistry`, `ProductLineItemFactory`
- `AbstractCategoryRoute`, `CategoryRoute`, `CachedCategoryRoute`
- Cart `Processor`, `ProductCartProcessor`
- Product page loaded hook

## Gotchas

- Passing full entities (e.g. `OrderEntity`) in events instead of just a primary key makes async processing harder and is discouraged in favor of passing only the id.
