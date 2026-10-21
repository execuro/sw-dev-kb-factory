---
id: platform/dev/6.7/resources/references/security.md
title: Security
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/security.html
sourceHash: 165367ef4a6d8ab839d4dfbff0754aefd48cd70c
codeCheckedAgainst: "6.7.15.1"
keywords: ["security", "shopware.security.csp_templates", "content security policy", "csp", "xss", "shopware.media.enable_url_validation", "shopware.media.enable_url_upload_feature", "ApiAware", "acl", "sql injection", "rate limiter", "html sanitizer", "samesite"]
summary: Shopware 6 security measures and their config - ACL, ApiAware, CSP templates, stored-asset CSP header, media URL upload validation.
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/concepts/framework/architecture/administration-concept.md
  - platform/dev/6.7/resources/references/config-reference/server/nginx.md
  - platform/dev/6.7/guides/hosting/infrastructure/rate-limiter.md
  - platform/dev/6.7/guides/hosting/configurations/shopware/html-sanitizer.md
---
## What it is

A compilation of the security measures built into Shopware 6 and where each one is configured. Vulnerabilities are reported through Shopware's GitHub security advisory form.

## When to use

When hardening a shop, reviewing which data is exposed through the APIs, configuring CSP or media URL uploads, or judging whether an issue (e.g. an ACL gap) counts as a security vulnerability.

## Key steps / config

- **ACL in the Administration**: CRUD on a module needs the matching privilege ([ACL in the Administration](platform/dev/6.7/concepts/framework/architecture/administration-concept.md)). Missing/incorrect ACL checks are treated as bugs, not vulnerabilities, unless they lead to privilege escalation or unauthorized access to sensitive data, because the attacker must already be authenticated in the Administration or Admin API.
- **API-aware field**: the `ApiAware` DAL flag controls which entity fields are exposed to the Store API ([Flags Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md)).
- **CSP**: default policies come from the `shopware.security.csp_templates` container parameter (keys `default`, `administration`, `storefront`, `installer`) and are adjusted via container configuration.
- **XSS on stored assets**: stored HTML/SVG files served directly by the web server or CDN bypass the application CSP. Serve them with:

```http
Content-Security-Policy: script-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'
```

  The header must be on the asset response, including cached ones. The shipped [Apache](platform/dev/6.7/resources/references/config-reference/server/apache.md), [Nginx](platform/dev/6.7/resources/references/config-reference/server/nginx.md) and [Caddy](platform/dev/6.7/resources/references/config-reference/server/caddy.md) configs include it — redeploy updated configs. A [reverse proxy](platform/dev/6.7/guides/hosting/infrastructure/reverse-http-cache.md) must preserve the header (default Fastly and Varnish configs do). A separate CDN URL must set the header itself.
- **Media upload by URL**: `shopware.media.enable_url_validation` (default `true`) ensures the URL points to a public resource, preventing internal network leaks. `shopware.media.enable_url_upload_feature: false` disables URL uploads entirely (the server still discloses IP/user agent to the remote host when enabled).

```yaml
shopware:
    media:
        enable_url_upload_feature: true
        enable_url_validation: true
```

- **Other measures** (see linked guides): Captcha, [Cookie Consent Management](platform/dev/6.7/concepts/commerce/content/cookie-consent-management.md) for GDPR, [HTML sanitizer](platform/dev/6.7/guides/hosting/configurations/shopware/html-sanitizer.md), [rate limiter](platform/dev/6.7/guides/hosting/infrastructure/rate-limiter.md) for login/password reset, session reset on password change for users and customers, [SameSite cookies](platform/dev/6.7/guides/hosting/configurations/framework/samesite-protection.md), the [Security plugin](platform/dev/6.7/guides/hosting/installation-updates/cluster-setup.md) for fixes without upgrades, and Storefront IP whitelisting during maintenance mode.
- **SQL injection**: the [Data Abstraction Layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md) does not expose SQL directly; direct SQL follows Doctrine DBAL escaping best practices.

## Essential identifiers

- `shopware.security.csp_templates`
- `shopware.media.enable_url_validation`
- `shopware.media.enable_url_upload_feature`
- `ApiAware`
- `Content-Security-Policy` response header

## Gotchas

- Granting ACL permissions for mail templates, SEO URL templates or product export templates exposes Twig; theme configuration exposes direct CSS. Grant these only to trusted users.
- The application CSP does not cover files the web server or CDN serves without passing through Shopware.

## Code check (6.7.15.1)
- confirmed `shopware.security.csp_templates` — container parameter with `default`/`administration`/`storefront`/`installer` keys — vendor/shopware/core/Framework/DependencyInjection/services.php:181
- confirmed `shopware.media.enable_url_upload_feature` — default `true` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:448
- confirmed `shopware.media.enable_url_validation` — default `true` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:449
- confirmed `shopware.media.enable_url_validation` — set to `false` in the dev environment config — vendor/shopware/core/Framework/Resources/config/packages/dev/shopware.yaml:13
- confirmed `ApiAware` — DAL field flag class — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:11
- unverified `Content-Security-Policy` — stored-asset header is set in web server/CDN configs, outside the checked package roots
