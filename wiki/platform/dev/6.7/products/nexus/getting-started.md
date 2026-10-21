---
id: platform/dev/6.7/products/nexus/getting-started.md
title: Getting Started
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/getting-started.html
sourceHash: 4bcdd443a0131c158b0f244507aa83cf8d2a62ae
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware nexus", "nexus getting started", "early access", "shopware services", "shopware sso", "ory", "oidc", "business platform", "shop connection", "known limitations", "idempotent workflows", "staging shop"]
summary: "Nexus prerequisites (Shopware 6.7+, Early Access, active Shopware services), SSO login, shop connection via the Business Platform, Early Access limits."
lastBuilt: 2026-10-21
---
## What it is

This page covers how to start with Shopware Nexus: what you need, how you log in, how shops get connected, and the known Early Access limitations.

## When to use

Use it when you set up Nexus for a shop for the first time, or when a workflow does nothing because the shop is not connected yet.

## Key steps / config

Prerequisites:

- Shopware 6.7 or newer
- Early Access granted by Shopware
- Nexus service activated
- Active Shopware services: accept the Shopware Services T&Cs, activate the Nexus service, and register the shop in your Shopware Account if not already done

Access and connection:

1. Log in through Shopware SSO (Ory / OIDC).
2. After you log in, Nexus redirects you to a demo workflow. It starts working once your shop is connected.
3. Shops are pulled from the Shopware Business Platform. You do not add them in Nexus.
4. To create a workflow, follow the Shopware Nexus user documentation on docs.shopware.com (Shopware Services, insider previews).

## Gotchas

- Early Access uses only the first company linked to your user account. Only shops linked to that company appear in Nexus.
- Known limitations and workarounds:

| Limitation | Workaround |
|---|---|
| No test mode | Use staging shops |
| Limited error details | Add Log nodes |
| No undo / redo | Save frequently |
| At-least-once delivery | Design idempotent workflows |

## Code check (6.7.15.1)
- confirmed `api.service.activate` — core Admin API route that activates a Shopware service by name — vendor/shopware/core/Service/Api/ServiceController.php:64
- confirmed `services:install` — CLI command that installs all Shopware services; fails if services are disabled — vendor/shopware/core/Service/Command/Install.php:16
- unverified `Shopware SSO (Ory / OIDC)` — Nexus-side login, not in Shopware code
- unverified `Shopware Business Platform` — external account system that supplies the shop list
