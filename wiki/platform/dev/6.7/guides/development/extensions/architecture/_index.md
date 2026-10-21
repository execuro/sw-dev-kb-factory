---
id: platform/dev/6.7/guides/development/extensions/architecture/_index.md
title: Extension Architecture
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/extensions/architecture/
sourceHash: 2d7d04ba53fcead3932654190f1e492e24cbba6c
codeCheckedAgainst: "6.7.15.1"
keywords: ["extension architecture", "public api", "@internal", "@final", "decoration", "getDecorated", "events", "plugins", "apps", "themes", "bundles", "backward compatibility"]
summary: "Overview of Shopware extension architecture rules: domain separation, public API boundaries and allowed patterns for plugins, apps, bundles, themes."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/extensions/architecture/internal.md", "platform/dev/6.7/guides/development/extensions/architecture/final-and-internal.md", "platform/dev/6.7/guides/development/extensions/architecture/extendability.md"]
---
## What it is

The entry page of the extension architecture section. It defines the principles that govern how Shopware may be extended: extension contracts, subsystem boundaries and public API guarantees. These rules apply to every extension type — plugins, apps, project-level bundles and, where relevant, themes.

## When to use

Read it before designing an extension, to know which parts of Shopware you may rely on, which extension patterns are supported, and where to find the detailed rules on public versus internal API. Following these rules keeps an extension stable, performant and compatible with future updates.

## Key steps / config

The extension model rests on four foundations:

1. Clear domain separation between Core, Storefront and Administration.
2. Deterministic subsystem behaviour.
3. Strict public API boundaries.
4. Controlled extension patterns: decoration, events, factories and adapters. In the installed code, decoratable services expose an abstract base whose subclasses must return the inner service, e.g. `AbstractCartLoadRoute::getDecorated()`.

Extensions that ignore these principles risk:

- non-deterministic behaviour,
- broken background jobs or CLI commands,
- performance regressions,
- upgrade incompatibilities.

For what counts as stable public API, read:

- platform/dev/6.7/guides/development/extensions/architecture/internal.md — Public API and the `@internal` annotation.
- platform/dev/6.7/guides/development/extensions/architecture/final-and-internal.md — the `@final` and `@internal` annotations and which changes each permits.

For the broader design philosophy behind the extension model, see platform/dev/6.7/guides/development/extensions/architecture/extendability.md.

## Essential identifiers

- `@internal`, `@final` — docblock annotations that mark private API and non-extendable classes.
- Decoration, events, factories, adapters — the supported extension patterns.
- Core, Storefront, Administration — the separated domains.

## Gotchas

The linked guides define what extension developers can rely on and what may change without notice or without backward compatibility guarantees; anything outside the public API is not covered by deprecation rules.

## Code check (6.7.15.1)
- confirmed `@internal` — docblock marker on private-API classes, e.g. CartCalculator — vendor/shopware/core/Checkout/Cart/CartCalculator.php:10
- confirmed `@final` — docblock marker on use-but-do-not-extend classes, e.g. CartHook — vendor/shopware/core/Checkout/Cart/Hook/CartHook.php:20
- confirmed `AbstractCartLoadRoute::getDecorated()` — abstract member every route decorator must implement — vendor/shopware/core/Checkout/Cart/SalesChannel/AbstractCartLoadRoute.php:17
- confirmed `Storefront` — Storefront domain is its own bundle — vendor/shopware/storefront/Storefront.php:21
- confirmed `Framework` — Core framework bundle — vendor/shopware/core/Framework/Framework.php:57
