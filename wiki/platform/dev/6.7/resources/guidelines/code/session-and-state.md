---
id: platform/dev/6.7/resources/guidelines/code/session-and-state.md
title: Session and State
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/session-and-state.html
sourceHash: 7feb7d4fe2a5a76fc9bbfdd9fba9dd55288368ec
codeCheckedAgainst: "6.7.13.0"
keywords: ["session", "php session", "state", "Core", "Storefront", "StorefrontSubscriber", "session handling", "coding guideline", "domain boundary", "storefront request"]
summary: "Guideline: Core domain code must not access the PHP session; session data exists only for Storefront requests and is handled in the Storefront domain."
lastBuilt: 2026-09-15
---
## What it is

A Shopware core coding guideline on where PHP session access is allowed: never inside the `Core` domain, only in the `Storefront` domain.

## When to use

When writing platform or plugin code that needs per-visitor state (e.g. remembering something between requests) and deciding which layer may read or write the session.

## Key steps / config

- Do not access the PHP session from code in the `Core` domain (Store API routes, services, DAL, cart logic).
- A PHP session only exists for a Storefront request; Store API and Admin API requests have none.
- Implement and handle session data in the `Storefront` domain.
- In the installed code, the Storefront itself starts the session: `StorefrontSubscriber::startSession()` returns early unless the main request is a sales-channel request and has a session, then starts it and stores the context token in it. `StorefrontSubscriber::updateSession()` only migrates the session when the route scope contains `StorefrontRouteScope::ID`.

## Essential identifiers

- `Core` domain — no session access
- `Storefront` domain — owns session handling
- `Shopware\Storefront\Framework\Routing\StorefrontSubscriber`

## Gotchas

- Code in `Core` that reads the session breaks for headless (Store API) consumers, because only Storefront requests carry a PHP session.

## Code check (6.7.13.0)
- confirmed `StorefrontSubscriber::startSession()` — session start lives in the Storefront package — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:76
- confirmed `SalesChannelRequest::ATTRIBUTE_IS_SALES_CHANNEL_REQUEST` — session is only started for sales-channel requests — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:82
- confirmed `StorefrontSubscriber::updateSession()` — session migration after login/logout is Storefront-side — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:146
- confirmed `StorefrontRouteScope::ID` — updateSession skips requests without the storefront route scope — vendor/shopware/storefront/Framework/Routing/StorefrontSubscriber.php:155
