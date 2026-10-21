---
id: platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md
title: Dependency Injection & Dependency Handling
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.html
sourceHash: 35c549e51d479f596b2b7bc6ba56e5213e29c570
codeCheckedAgainst: "6.7.15.1"
keywords: ["dependency injection", "service container", "constructor injection", "domain separation", "Core", "Storefront", "Administration", "php session", "request state", "Store API", "StorefrontController", "stateless services"]
summary: Plugin rules for Core vs Storefront boundaries - inject via the service container, no session or request access in Core services.
lastBuilt: 2026-10-21
---
## What it is

Guidelines for how plugins inject dependencies and respect Shopware's domain split between Core, Storefront and Administration. Core is framework-level logic that must stay independent of HTTP state and presentation; Storefront handles HTTP requests, sessions and customer interaction.

## When to use

When writing or extending a Core service in a plugin and deciding where request, session or HTTP-specific logic belongs, or when a service behaves differently in CLI, background jobs or tests than in a storefront request.

## Key steps / config

Core domain rules:

- Core code never accesses the PHP session.
- Core services do not rely on request state.
- Business logic stays stateless and deterministic.
- Dependencies are injected via the service container.

There is only one PHP session per storefront request. Session handling belongs in the Storefront domain, never inside Core services.

When extending Core functionality:

1. Inject dependencies via the constructor.
2. Do not read request data directly in Core classes.
3. Do not access the session in services registered in Core.
4. Keep domain logic independent from HTTP concerns.
5. Bridge between HTTP/session state and Core services with Store API routes or Storefront controllers (classes extending `StorefrontController`).

## Essential identifiers

- Core, Storefront, Administration domains
- Service container (constructor injection)
- Store API routes (responses extend `StoreApiResponse`)
- `StorefrontController`

## Gotchas

Violating the domain boundaries can lead to:

- unpredictable behavior in background jobs,
- broken CLI execution,
- inconsistent cart or rule evaluation,
- reduced testability.

Respecting these boundaries keeps extensions stable and maintainable. The installed core's own static analysis additionally warns that `Request::getSession()` initializes a lazy session and can take the PHP session lock, and asks passive code (listeners, logging, background paths) to call `Request::hasSession(true)` instead.

## Code check (6.7.15.1)
- confirmed `StorefrontController` — abstract base for Storefront controllers, in the Storefront package — vendor/shopware/storefront/Controller/StorefrontController.php:41
- confirmed `StoreApiResponse` — base response class of Store API routes, in core — vendor/shopware/core/System/SalesChannel/StoreApiResponse.php:14
- confirmed `NoUnsafeRequestHasSessionRule` — internal PHPStan rule: `getSession()` initializes the lazy session and can take the session lock; use `hasSession(true)` — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/NoUnsafeRequestHasSessionRule.php:22
- unverified `PHP session in Core` — architectural guideline with no single enforcing code location; no session access found in the core cart package
