---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/hosting/configurations/framework/samesite-protection.md
sourceHash: 5937478f19556a0926642c2135d3b90e4e68fde4
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/framework/samesite-protection.html
title: SameSite protection
version: "6.7"
versions:
  - "6.7"
keywords: ["cookie_samesite", "cookie_secure", "framework.session", "framework.yaml", "sw_csrf", "samesite", "session cookie", "csrf protection", "lax", "cookie security", "symfony frameworkbundle"]
summary: SameSite cookie protection via Symfony framework.session.cookie_samesite (default lax) and cookie_secure 'auto'; replaces the removed sw_csrf Twig function.
lastBuilt: 2026-09-15
---
## What it is

Shopware relies on the Symfony FrameworkBundle `SameSite` session cookie setting for CSRF-style protection. It supersedes the removed `sw_csrf` Twig function and is set to `lax` by default.

## When to use

When hosting a shop and you need to change how the session cookie is sent cross-site (stricter or looser SameSite policy), or control whether the cookie is flagged secure.

## Key steps / config

Override the session cookie settings in your project's `framework.yaml` (e.g. `config/packages/framework.yaml`). Shopware core ships these values as its defaults:

```yaml
framework:
  session:
    cookie_secure: 'auto'
    cookie_samesite: lax
```

- `cookie_samesite`: `lax` by default. Setting it to `null` deactivates SameSite protection (the docs note this is a security risk).
- `cookie_secure: 'auto'`: the cookie is marked secure depending on whether the request came in via HTTP or HTTPS.
- Further values are defined by the Symfony FrameworkBundle `framework.session` configuration reference.

## Essential identifiers

- `framework.session.cookie_samesite`
- `framework.session.cookie_secure`
- `framework.yaml`

## Gotchas

- Changing `lax` to `null` disables the protection entirely; only do this knowingly.
- The installer uses its own `installer.yaml` package config with the same two values, so a project override in `framework.yaml` does not necessarily affect the installer context.

## Version notes

- Introduced with Shopware 6.4.3.1, replacing the `sw_csrf` Twig function, which is no longer present in the installed code.

## Code check (6.7.13.0)
- confirmed `framework.session.cookie_samesite` — core default is `lax` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:22
- confirmed `framework.session.cookie_secure` — core default is `'auto'` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:21
- confirmed `cookie_samesite` — installer package config also sets `lax` — vendor/shopware/core/Framework/Resources/config/packages/installer.yaml:6
- absent `sw_csrf` — removed Twig function, no occurrence in the installed code index
