---
id: platform/dev/6.7/resources/references/adr/2022-11-16-deprecate-csrf.md
title: Deprecate the storefront CSRF implementation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-11-16-deprecate-csrf.html
sourceHash: b0b2641f16f0cce122edb06e9d20ca8710b32c71
codeCheckedAgainst: "6.7.15.1"
keywords: ["csrf", "csrf token", "cross-site request forgery", "samesite", "cookie_samesite", "samesite cookies", "storefront security", "storefront forms", "ajax", "adr", "session cookie"]
summary: "ADR 2022-11-16: the Storefront CSRF token implementation is removed in favour of SameSite session cookies, which already prevent CSRF attacks."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (area: storefront, 2022-11-16) that removes the Storefront's own CSRF protection and relies on SameSite cookies instead.

## When to use

When building Storefront forms or ajax calls and wondering whether a CSRF token must be rendered or sent, or when porting a pre-6.5 theme or plugin that still uses the old CSRF handling.

## Key steps / config

- Do not add CSRF tokens to Storefront forms or ajax requests; all CSRF implementations in the Storefront are removed.
- Protection comes from the session cookie's SameSite attribute. In 6.7 core sets `framework.session.cookie_samesite: lax` (with `cookie_secure: 'auto'`) in its framework package config.

## Essential identifiers

- `framework.session.cookie_samesite` — `lax` by default in Shopware's framework config

## Gotchas

The reasoning given: after dropping support for older browsers in 6.5, SameSite cookies are widely supported; the CSRF implementation added complexity to every Storefront form and ajax call; and on top of the SameSite strategy it added little security.

## Version notes

Decided for the 6.5 major, where older browser support was dropped. The installed 6.7 Storefront PHP code has no CSRF service or config node left.

## Code check (6.7.15.1)
- confirmed `framework.session.cookie_samesite` — set to `lax` for the session cookie — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:22
- confirmed `framework.session.cookie_secure` — set to `'auto'` next to the SameSite setting — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:21
- unverified `csrf` — no CSRF class or config key found in the Storefront PHP sources; absence has no line to cite
