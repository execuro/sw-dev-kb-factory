---
id: platform/dev/6.7/guides/development/extensions/architecture/_index.md
title: Extension Architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/architecture/
sourceHash: 2d7d04ba53fcead3932654190f1e492e24cbba6c
codeCheckedAgainst: "6.7.13.0"
keywords: ["extension architecture", "public api", "@internal", "@final", "backward compatibility", "decoration", "events", "factories", "adapters", "plugins", "apps", "bundles"]
summary: Entry page for Shopware extension architecture - public API boundaries, @internal and @final annotations, and sanctioned extension patterns.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/extensions/architecture/internal.md", "platform/dev/6.7/guides/development/extensions/architecture/final-and-internal.md", "platform/dev/6.7/guides/development/extensions/architecture/extendability.md"]
---
## What it is

Index of the architectural rules for extending Shopware: extension contracts, subsystem boundaries and public API guarantees that apply to plugins, apps, project-level bundles and (where relevant) themes.

The model rests on clear domain separation (Core, Storefront, Administration), deterministic subsystem behaviour, strict public API boundaries, and controlled extension patterns — decoration, events, factories, adapters.

## When to use

- Before relying on a core class or service from an extension, to know whether it belongs to the stable Public API or may change without backward-compatibility guarantees.
- To understand why extensions must respect these principles: ignoring them risks non-deterministic behaviour, broken background jobs or CLI commands, performance regressions and upgrade incompatibilities.

## Key steps / config

1. Check the stability contract of what you extend:
   - [Public API and internal annotation](platform/dev/6.7/guides/development/extensions/architecture/internal.md) (`@internal`)
   - [Final and internal annotation](platform/dev/6.7/guides/development/extensions/architecture/final-and-internal.md) (`@final`)
2. Read [Extendability](platform/dev/6.7/guides/development/extensions/architecture/extendability.md) for the architectural philosophy and design patterns behind the extension model.
3. Extend through the controlled patterns (decoration, events, factories, adapters). In core, decoratable services are abstract classes declaring `getDecorated()`, e.g. `AbstractCategoryRoute`.

## Essential identifiers

- `@internal`, `@final` (docblock annotations marking the Public API boundary)
- `getDecorated()` (decoration contract on abstract services such as `AbstractCategoryRoute`)
- `Shopware\Core\Framework\Plugin`, `Shopware\Core\Framework\Bundle`

## Code check (6.7.13.0)
- confirmed `@internal` — used on core constructors, e.g. cart Processor — vendor/shopware/core/Checkout/Cart/Processor.php:17
- confirmed `@final` — class-level annotation, e.g. CartHook — vendor/shopware/core/Checkout/Cart/Hook/CartHook.php:20
- confirmed `AbstractCategoryRoute::getDecorated()` — abstract decoration method — vendor/shopware/core/Content/Category/SalesChannel/AbstractCategoryRoute.php:16
- confirmed `Plugin` — abstract plugin base extends Bundle — vendor/shopware/core/Framework/Plugin.php:17
- confirmed `Bundle` — abstract Shopware bundle extends Symfony bundle — vendor/shopware/core/Framework/Bundle.php:32
