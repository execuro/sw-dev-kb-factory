---
id: platform/dev/6.7/guides/hosting/configurations/framework/samesite-protection.md
title: SameSite protection
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/framework/samesite-protection.html
sourceHash: 5937478f19556a0926642c2135d3b90e4e68fde4
codeCheckedAgainst: "6.7.15.1"
keywords: ["cookie_samesite", "cookie_secure", "framework.session", "framework.yaml", "samesite", "csrf protection", "session cookie", "lax", "sw_csrf", "cookie security", "FrameworkBundle"]
summary: Shopware session cookie SameSite protection via framework.session.cookie_samesite (default lax) and cookie_secure 'auto' in framework.yaml.
lastBuilt: 2026-10-21
---
## What it is

Shopware relies on the SameSite cookie attribute from the Symfony FrameworkBundle session configuration as its CSRF protection; it replaced the removed `sw_csrf` Twig function. The default value is `lax`, supported by modern browsers.

## When to use

When you need to change or (against the security advice) disable the SameSite attribute of the session cookie, or control whether the session cookie is marked secure.

## Key steps / config

Set the values in `framework.yaml` under `framework.session`:

```yaml
framework:
  session:
    cookie_secure: 'auto'
    cookie_samesite: lax
```

- `cookie_samesite` — `lax` by default. To deactivate SameSite protection, change it from `lax` to `null`.
- `cookie_secure: 'auto'` — the cookie's secure flag follows the request's origin (sent via HTTP or HTTPS depending on how the request came in).
- Further allowed values are described in the Symfony FrameworkBundle reference for `cookie_samesite`.

## Essential identifiers

- `framework.session.cookie_samesite`
- `framework.session.cookie_secure`
- `framework.yaml`

## Gotchas

- Setting `cookie_samesite` to `null` removes the protection and is a security risk.

## Version notes

- Introduced with Shopware 6.4.3.1; superseded the `sw_csrf` Twig function, which is removed.

## Code check (6.7.15.1)
- confirmed `framework.session.cookie_samesite` — core default `lax` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:22
- confirmed `framework.session.cookie_secure` — core default `'auto'` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:21
- confirmed `cookie_samesite` — installer kernel uses the same `lax` default — vendor/shopware/core/Framework/Resources/config/packages/installer.yaml:6
- absent `sw_csrf` — no occurrence in the installed code; the Twig function is removed as the docs state
