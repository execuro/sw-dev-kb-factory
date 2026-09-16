---
id: platform/dev/6.6/resources/references/adr/2022-11-16-deprecate-csrf.md
title: Deprecate the storefront CSRF implementation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-11-16-deprecate-csrf.html"
sourceHash: b0b2641f16f0cce122edb06e9d20ca8710b32c71
keywords: ["csrf", "security", "storefront", "samesite cookies", "same-site", "csrf protection", "csrf token", "forms", "ajax calls", "browser support", "shopware 6.5", "cross-site request forgery"]
summary: "Documents removing Storefront CSRF protection in favor of SameSite cookies, effective from the Shopware 6.5 browser baseline."
lastBuilt: "2026-09-15"
---
## What it is

ADR documenting the removal of Shopware 6's Storefront CSRF protection in favor of relying on SameSite cookies.

## When to use

Relevant when investigating why the Storefront no longer includes CSRF tokens in forms/ajax calls, or when a plugin previously depended on the CSRF token mechanism.

## Key steps / config

- Context: as browsers evolved and older browsers lost support starting with Shopware 6.5, wide support for SameSite cookies became available. The existing CSRF implementation added complexity to every form and ajax call in the Storefront, without providing much additional security benefit given the SameSite strategy already in place.
- Decision: remove CSRF protection from the Storefront in favor of SameSite cookies, which already prevent CSRF attacks.
- Consequence: all CSRF implementations in the Storefront are removed.

## Essential identifiers

- CSRF protection (Storefront)
- SameSite cookies

## Gotchas

This removal relies on SameSite cookie support being available in the browsers a store's customers use; the ADR notes this support became wide only as of Shopware 6.5's minimum supported browser baseline.
