---
id: platform/dev/6.7/resources/guidelines/code/session-and-state.md
title: Session and State
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/session-and-state.html
sourceHash: 7feb7d4fe2a5a76fc9bbfdd9fba9dd55288368ec
codeCheckedAgainst: "6.7.15.1"
keywords: ["session", "php session", "state", "stateless", "Core", "Storefront", "store api", "hasSession", "getSession", "StorefrontSubscriber", "NoUnsafeRequestHasSessionRule", "coding guidelines"]
summary: Guideline - Core must not access the PHP session; only Storefront requests have one, so session handling belongs in the Storefront domain.
lastBuilt: 2026-10-21
---
## What it is

A coding guideline stating that code in the `Core` domain must not access the PHP session. A PHP session exists only for Storefront requests, so reading and writing session data is the Storefront domain's job.

## When to use

When writing Core services, routes or subscribers that might be tempted to store or read per-visitor state, or when deciding where session-dependent logic belongs (Core vs. Storefront).

## Key steps / config

1. Keep `Core` code (including Store API routes) stateless: pass state through the `SalesChannelContext`/request instead of the PHP session.
2. Put session handling in the Storefront domain. In the installed code the Storefront starts and fills the session itself, e.g. `Shopware\Storefront\Framework\Routing\StorefrontSubscriber::startSession()`.
3. Where code must check for a session without starting one, call `Request::hasSession(true)`, not `Request::hasSession()`. The latter returns true for a lazy session factory, and a following `getSession()` then initializes the session and can take the PHP session lock. The PHPStan rule `NoUnsafeRequestHasSessionRule` (identifier `shopware.unsafeRequestHasSession`) reports the unsafe form.

## Essential identifiers

- `Shopware\Storefront\Framework\Routing\StorefrontSubscriber::startSession()`
- `Request::hasSession(true)`
- `Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\NoUnsafeRequestHasSessionRule`
- `shopware.unsafeRequestHasSession`

## Gotchas

- The installed Core code is not literally session-free: `SalesChannelRequestContextResolver` reads the session only via `$request->hasSession(true) ? $request->getSession() : null`, so it uses a session the Storefront already started and leaves Store API requests (lazy session factory only) stateless.
- Session-owning code that really must initialize the session may use plain `hasSession()` only with a targeted `@phpstan-ignore shopware.unsafeRequestHasSession` comment explaining why.

## Code check (6.7.15.1)
- confirmed `StorefrontSubscriber::startSession()` — Storefront domain starts the session — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:76
- confirmed `NoUnsafeRequestHasSessionRule` — PHPStan rule requiring `hasSession(true)` — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/NoUnsafeRequestHasSessionRule.php:22
- confirmed `shopware.unsafeRequestHasSession` — rule error identifier — vendor/shopware/core/DevOps/StaticAnalyze/PHPStan/Rules/NoUnsafeRequestHasSessionRule.php:53
- corrected `getSession()` — docs: Core never accesses the PHP session; Core reads it only when already started (Store API stays stateless) — vendor/shopware/core/Framework/Routing/SalesChannelRequestContextResolver.php:54
