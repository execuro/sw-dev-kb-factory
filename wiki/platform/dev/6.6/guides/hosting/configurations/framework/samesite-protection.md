---
id: platform/dev/6.6/guides/hosting/configurations/framework/samesite-protection.md
title: SameSite protection
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/hosting/configurations/framework/samesite-protection.html
sourceHash: 5937478f19556a0926642c2135d3b90e4e68fde4
keywords: ["samesite protection", "cookie_samesite", "cookie_secure", "sw_csrf", "framework.yaml", "csrf", "cookie security", "session cookies"]
summary: "SameSite cookie protection via framework.yaml's cookie_samesite/cookie_secure, replacing the removed sw_csrf Twig function."
lastBuilt: "2026-09-15"
---
## What it is

Documents Shopware's use of the Symfony FrameworkBundle's SameSite cookie configuration, which supersedes the removed `sw_csrf` Twig function. It is available in modern browsers and defaults to `lax`.

## When to use

Relevant when configuring or relaxing cookie SameSite behavior for the storefront/session cookies, e.g. when embedding the shop in contexts that need a different SameSite policy.

## Key steps / config

Changes to `cookie_samesite` are applied in `framework.yaml`. `cookie_secure` controls whether cookies are sent over HTTP or HTTPS depending on the request's origin:

```yaml
framework:
  session:
    cookie_secure: 'auto'
    cookie_samesite: lax
```

To deactivate SameSite protection (despite the security risk), change the value from `lax` to `null`.

## Essential identifiers

- `framework.yaml`
- `cookie_samesite`
- `cookie_secure`
- `sw_csrf` (removed Twig function, superseded by this feature)

## Gotchas

Disabling SameSite protection (setting `cookie_samesite` to `null`) is a security risk and is only meant for cases where it is explicitly required.

## Version notes

This feature was introduced in Shopware 6.4.3.1.
