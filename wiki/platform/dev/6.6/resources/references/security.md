---
id: platform/dev/6.6/resources/references/security.md
title: Security
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/security.html
sourceHash: 0eda9adbf2d19d836cc214baaa58bcfb466e1e37
keywords: ["security", "shopware.security.csp_templates", "ApiAware", "CSP", "Content-Security-Policy", "XSS", "ACL", "HTML sanitizer", "rate limiter", "SameSite", "CDN", "SQL injection", "security plugin", "captcha"]
summary: "Overview of Shopware 6.6 security measures and where to configure them: CSP, XSS on stored HTML/SVG, rate limiter, HTML sanitizer, SameSite, ACL."
lastBuilt: 2026-10-20
relatedPages: ["platform/dev/6.6/resources/references/config-reference/server/apache.md", "platform/dev/6.6/resources/references/config-reference/server/nginx.md", "platform/dev/6.6/resources/references/config-reference/server/caddy.md", "platform/dev/6.6/guides/hosting/infrastructure/reverse-http-cache.md"]
---
## What it is

A reference index of the security measures built into Shopware 6.6, each with a short description and a pointer to where it is configured. Vulnerabilities are to be reported through the GitHub security advisory form of the `shopware/shopware` repository.

## When to use

When reviewing a shop's hardening, looking for the setting behind a security feature, or making sure stored HTML and SVG assets are served safely.

## Key steps / config

Measures listed:

- **ACL in the Administration**: CRUD on data requires specific privileges for a module.
- **API aware field**: the `ApiAware` flag controls which entity fields are exposed to the Store API.
- **Captcha**: verifies users are human; configured in the basic information settings.
- **CSP**: default policies come from the `shopware.security.csp_templates` Symfony container parameter and can be adjusted in container configuration.
- **HTML sanitizer**: removes unsafe HTML from the text editor; see `platform/dev/6.6/guides/hosting/configurations/shopware/html-sanitizer.md`.
- **Rate limiter**: default limits against brute force on login and password reset; see `platform/dev/6.6/guides/hosting/infrastructure/rate-limiter.md`.
- **Reset sessions when changing password**: a password change invalidates the session of the user or customer.
- **SameSite cookie**: see `platform/dev/6.6/guides/hosting/configurations/framework/samesite-protection.md`.
- **Security plugin**: security fixes without version upgrades; see `platform/dev/6.6/guides/hosting/installation-updates/cluster-setup.md`.
- **Storefront IP whitelisting**: allows access during maintenance mode.
- **SQL injection**: the Data Abstraction Layer does not expose SQL directly; direct SQL follows Doctrine DBAL escaping practices.
- **File access**: product media and generated documents should be stored securely and backed up.

### XSS on stored assets

Stored HTML and SVG files can run scripts when opened directly and are often served without passing through Shopware, so the application CSP does not apply. Serve them with this response header, also on cached responses:

```http
Content-Security-Policy: script-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'
```

- The provided Apache (`platform/dev/6.6/resources/references/config-reference/server/apache.md`), Nginx (`platform/dev/6.6/resources/references/config-reference/server/nginx.md`) and Caddy (`platform/dev/6.6/resources/references/config-reference/server/caddy.md`) configurations include this header; existing deployments must update and deploy them.
- A reverse proxy must preserve `Content-Security-Policy` from the origin, including on cached responses (see `platform/dev/6.6/guides/hosting/infrastructure/reverse-http-cache.md`). The default Fastly and Varnish configurations do.
- A dedicated CDN under a different CDN URL needs the header configured manually in the CDN; a separate URL is not a substitute for CSP.

## Essential identifiers

- `shopware.security.csp_templates`
- `ApiAware`
- `Content-Security-Policy`

## Gotchas

- The application CSP does not cover assets served directly by the web server or CDN.
- Header must be present on cached responses too.
