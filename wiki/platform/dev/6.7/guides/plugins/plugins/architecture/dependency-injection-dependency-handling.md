---
id: platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md
title: Dependency Injection & Dependency Handling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.html
sourceHash: 35c549e51d479f596b2b7bc6ba56e5213e29c570
codeCheckedAgainst: "6.7.13.0"
keywords: ["dependency injection", "constructor injection", "service container", "domain separation", "core domain", "storefront domain", "php session", "request state", "StorefrontController", "StoreApiRouteScope", "SalesChannelContext", "stateless services"]
summary: "Plugin domain boundaries: Core services are stateless and constructor-injected, never use PHP session or request; sessions stay in Storefront."
lastBuilt: 2026-09-15
---
## What it is

The architectural contract for how plugins inject dependencies and respect the domain boundaries between Core, Storefront and Administration. The `Core` domain is framework-level logic independent of HTTP state and presentation; the `Storefront` domain handles HTTP requests, sessions and customer interaction.

## When to use

Designing or reviewing a plugin service that extends Core functionality, and deciding where request, session or customer state may be read.

## Key steps / config

Core domain rules:

- The Core domain must never access the PHP session.
- Core services must not rely on request state.
- Business logic stays stateless and deterministic.
- Dependencies are injected via the service container.

There is only one PHP session per storefront request; session handling belongs in the Storefront domain, never inside Core services.

When extending Core functionality:

1. Inject dependencies via the constructor.
2. Do not read request data directly in Core classes.
3. Do not access the session inside services registered in Core.
4. Keep domain logic independent from HTTP concerns.
5. Bridge between HTTP/session state and Core services with Store API routes (route scope `StoreApiRouteScope`) or Storefront controllers (extending `Shopware\Storefront\Controller\StorefrontController`, route scope `StorefrontRouteScope`). Core contracts receive the resolved state as arguments instead — e.g. cart collectors and processors get a `Shopware\Core\System\SalesChannel\SalesChannelContext` parameter.

## Essential identifiers

- `Shopware\Storefront\Controller\StorefrontController`
- `Shopware\Core\Framework\Routing\StoreApiRouteScope`
- `Shopware\Storefront\Framework\Routing\StorefrontRouteScope`
- `Shopware\Core\System\SalesChannel\SalesChannelContext`
- `Shopware\Core\Framework\Context`

## Gotchas

Violating domain boundaries can lead to:

- unpredictable behavior in background jobs;
- broken CLI execution;
- inconsistent cart or rule evaluation;
- reduced testability.

## Code check (6.7.13.0)
- confirmed `StorefrontController` — abstract base for Storefront controllers — vendor/shopware/storefront/Controller/StorefrontController.php:40
- confirmed `StoreApiRouteScope` — Store API route scope in Core — vendor/shopware/core/Framework/Routing/StoreApiRouteScope.php:13
- confirmed `StorefrontRouteScope` — Storefront route scope lives in the storefront package — vendor/shopware/storefront/Framework/Routing/StorefrontRouteScope.php:12
- confirmed `SalesChannelContext` — context struct passed into Core services — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:28
- confirmed `CartProcessorInterface::process()` — receives SalesChannelContext as argument, no request access — vendor/shopware/core/Checkout/Cart/CartProcessorInterface.php:12
- confirmed `Context` — Core context struct — vendor/shopware/core/Framework/Context.php:17
- unverified `PHP session` — "no session access in Core" is a policy rule, not enforced by a single code location
