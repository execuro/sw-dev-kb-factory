---
id: platform/dev/6.6/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.md
title: Implement sales channel context token requirement for store-api and sales-channel-api
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-07-02-implement-sales-channel-context-token-requirement.html
sourceHash: 94d5f00b521580f5eb03a34b3e678bed08ff94eb
keywords: ["adr", "ContextTokenRequired", "Shopware\\Core\\Framework\\Routing\\Annotation\\ContextTokenRequired", "sales-channel-context-token", "context token", "store-api", "sales-channel-api", "route annotation", "sales channel context", "token requirement"]
summary: "ADR 2020-07-02: store-api and sales-channel-api routes that depend on a context token must be marked with the ContextTokenRequired annotation."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2020-07-02, area: core) mirrored from the Shopware 6 repository. It decides that routes of the `store-api` and the `sales-channel-api` which depend on a sales-channel-context-token are only callable when such a token is provided, and that this is declared per route.

## When to use

When adding or reviewing a Store API (or legacy sales-channel-api) route and deciding whether it must reject calls without a context token, or when investigating why a route requires a token.

## Key steps / config

Background: some routes rely on the sales-channel-context-token to identify the correct context. A route-level marker is needed to distinguish open routes from routes that need a token, so they cannot be called without one accidentally or intentionally.

Decision: every route that depends on a sales-channel-token is only callable with a token. Answer these questions to decide whether a route depends on a token:

1. Would automatic generation of the token be a security issue?
2. Would automatic generation of the token lead to an abandoned entity (e.g. the cart)?
3. Can every possible caller create or know the needed token beforehand? (e.g. an asynchronous payment provider cannot)

Consequence: every `sales-channel-api` and `store-api` route has to be checked against these questions and, where it depends on a token, set the `ContextTokenRequired` annotation (`Shopware\Core\Framework\Routing\Annotation\ContextTokenRequired`).

## Essential identifiers

- `Shopware\Core\Framework\Routing\Annotation\ContextTokenRequired`
- sales-channel-context-token
- `store-api`, `sales-channel-api`

## Gotchas

- Rejected alternative: leave all routes open. Without a token, a call gets a newly generated token with the default sales-channel-context. There was no known security issue with that, but an entity such as a cart or a customer could accidentally end up in the default sales-channel-context instead of the intended custom one.
- A route whose legitimate callers cannot know the token beforehand (such as an asynchronous payment provider returning to the shop) should not be marked as token-required.
