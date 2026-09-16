---
id: platform/dev/6.7/resources/references/adr/2022-11-16-deprecate-csrf.md
title: Deprecate the storefront CSRF implementation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-11-16-deprecate-csrf.html
sourceHash: b0b2641f16f0cce122edb06e9d20ca8710b32c71
codeCheckedAgainst: "6.7.13.0"
keywords: ["csrf", "csrf token", "cross-site request forgery", "samesite", "samesite cookies", "cookie_samesite", "storefront security", "storefront forms", "ajax calls", "adr"]
summary: "ADR 2022-11-16: storefront CSRF protection removed in favor of SameSite cookies; no CSRF tokens needed in storefront forms or ajax calls."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2022-11-16, area storefront) that removes the Storefront's own CSRF (cross-site request forgery) token implementation and relies on SameSite cookies instead.

## When to use

When a plugin or theme still tries to add or validate CSRF tokens in Storefront forms or ajax calls, or when you need to know why the Storefront has no CSRF token handling.

## Key steps / config

- Context given by the ADR: with the browsers supported since 6.5, SameSite cookies are widely available; the CSRF implementation added complexity to every Storefront form and ajax call; it gave little extra security on top of the SameSite strategy.
- Decision: remove the Storefront CSRF protection; SameSite cookies prevent CSRF attacks.
- Consequence: all CSRF implementations in the Storefront are removed, so custom forms and ajax requests do not need to send a CSRF token.
- In the installed core, the Symfony session cookie is configured with `cookie_samesite: lax` in the framework package config.

## Essential identifiers

- `cookie_samesite` (session config, value `lax`)

## Gotchas

- Protection now depends on the SameSite attribute of the session cookie; changing `cookie_samesite` away from `lax`/`strict` in a project config removes that protection.

## Code check (6.7.13.0)
- confirmed `cookie_samesite` — core framework session config sets `lax` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:22
- confirmed `csrf_token` — only remaining storefront occurrence is a Twig lint-config entry; no CSRF token handling in storefront PHP/Twig — vendor/shopware/storefront/Resources/views/ludtwig-config.toml:266
