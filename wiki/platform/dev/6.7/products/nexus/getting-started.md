---
id: platform/dev/6.7/products/nexus/getting-started.md
title: Getting Started
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/getting-started.html
sourceHash: 4bcdd443a0131c158b0f244507aa83cf8d2a62ae
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware nexus", "nexus getting started", "early access", "prerequisites", "shopware services", "shopware sso", "ory", "oidc", "shopware business platform", "shopware account", "known limitations", "idempotent workflows"]
summary: "Nexus Early Access prerequisites (Shopware 6.7+, services T&C, shop registration), SSO login, shop connection limits and known workarounds."
lastBuilt: 2026-09-15
---
## What it is

Onboarding steps for Shopware Nexus in Early Access: what must be in place before use, how login and shop connection work, and the known limitations with workarounds.

## When to use

When setting up Nexus access for a merchant shop for the first time, or when a shop does not show up in Nexus.

## Key steps / config

1. Prerequisites:
   - Shopware 6.7 or newer
   - Early Access granted by Shopware and the Nexus service activated
   - Active Shopware services: accept the Shopware Service T&C's, activate the Nexus service, register the shop in your Shopware Account if not already done
2. Log in via Shopware SSO (Ory / OIDC). After authentication Nexus redirects to a demo workflow, which becomes functional once your shop is connected.
3. Shops are pulled from the Shopware Business Platform; no manual connection data is entered.
4. Create workflows following the [user documentation](https://docs.shopware.com/en/shopware-6-en/shopware-services/shopware-nexus?category=shopware-6-en/insider-previews).

## Gotchas

- Early Access: only the first company linked to your user account is used, so only shops linked to that company are available.
- Known limitations and workarounds:

| Limitation | Workaround |
|---|---|
| No test mode | Use staging shops |
| Limited error details | Add Log nodes |
| No undo / redo | Save frequently |
| At-least-once delivery | Design idempotent workflows |

## Code check (6.7.13.0)
- unverified `Shopware 6.7 or newer` — prerequisite of the external Nexus service; not expressed in vendor/shopware code
- unverified `Ory / OIDC` — Nexus login runs on Shopware SSO outside the installed code, out of scope
