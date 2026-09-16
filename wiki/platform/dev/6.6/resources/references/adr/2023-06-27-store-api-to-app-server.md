---
id: platform/dev/6.6/resources/references/adr/2023-06-27-store-api-to-app-server.md
title: Client side communication to App Server
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-06-27-store-api-to-app-server.html"
sourceHash: "7e0896656f93ec8868f38f6fd3ee35d2816c6ac0"
keywords: ["app system", "app server", "JWT token", "generate-token", "store-api", "shop to app server secret", "session storage", "rate limiting", "app permissions", "client side communication"]
summary: "ADR: new generate-token endpoint issues a short-lived JWT so app clients can talk to the App Server without exposing customer data insecurely."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record introducing a way for app clients (Storefront/Store API) to communicate securely and directly with an app's App Server using a signed JWT.

## When to use
Relevant when an app needs the client (browser) to call its App Server directly while still trusting the logged-in customer's identity and permissions.

## Key steps / config
- New endpoint `/store-api/app-system/{appName}/generate-token` (`/app-system/{appName}/generate-token` in Storefront) generates a JWT for the given app; requires a logged-in customer and an installed, active app.
- JWT claims include `iat`, `exp`, `shopId`, `salesChannelId`, `customerId`, `cartToken`; claims are bound to app permissions (e.g. no `customerId` claim if the app cannot read customers).
- The token is signed with the existing shop-to-app-server secret key; the App Server must verify it and still validate the (untrusted) request body.
- Request flow: client requests the token from the Shopware Backend, then sends it in a header to the App Server.
- Token is valid for 15 minutes, reusable until expiry; clients should cache it in session storage and only re-request on expiry.
- The token-generation route should be rate limited.

## Essential identifiers
- `/store-api/app-system/{appName}/generate-token`
- `/app-system/{appName}/generate-token` (Storefront)
- JWT claims: `iat`, `exp`, `shopId`, `salesChannelId`, `customerId`, `cartToken`

## Gotchas
The App Server cannot otherwise verify the origin of a direct client request and must trust the client, which is unsafe for data tied to the logged-in customer — this is the problem the JWT endpoint solves. Session storage (not local storage) is recommended for caching the token.
