---
id: platform/dev/6.7/resources/references/security.md
title: Security
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/security.html
sourceHash: 75a90b608c5d89cb821a0fbbec31960d7e051a4a
codeCheckedAgainst: "6.7.13.0"
keywords: ["security", "shopware.security.csp_templates", "shopware.media.enable_url_validation", "shopware.media.enable_url_upload_feature", "ApiAware", "acl", "content security policy", "xss", "rate limiter", "html sanitizer", "samesite cookie", "sql injection", "gdpr", "maintenance ip whitelist"]
summary: "Shopware 6 security measures: ACL, ApiAware, CSP via shopware.security.csp_templates, media URL upload validation, rate limiter, sanitizer, SQL injection."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/concepts/framework/architecture/administration-concept.md", "platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md", "platform/dev/6.7/guides/hosting/configurations/shopware/html-sanitizer.md", "platform/dev/6.7/guides/hosting/infrastructure/rate-limiter.md"]
---
## What it is

A reference list of the security measures built into Shopware 6 and where each one is configured: ACL, API field exposure, captcha, CSP, file access, media upload by URL, GDPR/cookie consent, HTML sanitizer, rate limiter, session reset on password change, SameSite cookies, the Security plugin, maintenance IP whitelisting, SQL injection protection, and features that intentionally expose Twig/CSS.

## When to use

When hardening a shop, reviewing which security-relevant container parameters exist, or deciding whether a finding is a vulnerability or a bug. Vulnerabilities are reported through the GitHub security advisory form of `shopware/shopware`.

## Key steps / config

- **ACL (Administration):** CRUD on a module requires the matching privileges. See [ACL in the Administration](platform/dev/6.7/concepts/framework/architecture/administration-concept.md). Faulty ACL checks count as bugs, not vulnerabilities, unless they lead to privilege escalation or unauthorized access to sensitive data (the attacker already needs Administration / Admin API access).
- **API exposure:** the DAL `ApiAware` field flag decides which entity fields are exposed through the APIs. See [Flags Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/flags-reference.md).
- **CSP:** default policies live in the container parameter `shopware.security.csp_templates` (collection keyed `default`, `administration`, `storefront`, `installer`); override it via container configuration.
- **Media upload by URL:** configured under `shopware.media`:

```yaml
shopware:
    media:
        enable_url_upload_feature: true   # false disables URL upload entirely
        enable_url_validation: true       # false skips the public-URL check
```

  Validation blocks URLs that would leak internal network information. Even with validation, the server fetching the URL discloses its IP address and user agent — disable the whole feature if that matters.
- **HTML sanitizer:** strips unsafe HTML from text editor input. See [HTML Sanitizer](platform/dev/6.7/guides/hosting/configurations/shopware/html-sanitizer.md).
- **Rate limiter:** default limits for login and password reset against brute force. See [Rate Limiter](platform/dev/6.7/guides/hosting/infrastructure/rate-limiter.md).
- **Password change:** changing a user's or customer's password invalidates the session; re-login is required.
- **SameSite cookie:** see [SameSite Protection](platform/dev/6.7/guides/hosting/configurations/framework/samesite-protection.md).
- **Security plugin:** delivers security fixes without a version upgrade. See [cluster setup](platform/dev/6.7/guides/hosting/installation-updates/cluster-setup.md).
- **Maintenance mode:** IP addresses can be whitelisted per sales channel to access the Storefront.
- **SQL injection:** the [Data Abstraction Layer](platform/dev/6.7/concepts/framework/data-abstraction-layer.md) does not expose SQL; direct SQL follows Doctrine DBAL escaping practices.
- **Captcha, GDPR, file access:** covered in the merchant documentation and the filesystem hosting guide.

## Essential identifiers

- `shopware.security.csp_templates`
- `shopware.media.enable_url_validation`
- `shopware.media.enable_url_upload_feature`
- `ApiAware` (`Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware`)

## Gotchas

- Mail templates, SEO URL templates and product export templates expose Twig; theme configuration exposes raw CSS. Anyone with those ACL permissions gets that power — grant them only to trusted users.
- In the installed code, the `dev`, `test` and `e2e` package configs set `enable_url_validation: false`; only the base `shopware.yaml` enables it.
- The shipped `storefront` and `installer` CSP templates are empty; only `default` and `administration` carry policies.
- `ApiAware` without arguments allows both the Admin API (`/api/`) and the Store API (`/store-api/`), not only the Store API.

## Code check (6.7.13.0)
- confirmed `shopware.security.csp_templates` — collection parameter with default/administration/storefront/installer keys — vendor/shopware/core/Framework/DependencyInjection/services.xml:20
- confirmed `shopware.media.enable_url_upload_feature` — defaults to true — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:412
- confirmed `shopware.media.enable_url_validation` — defaults to true — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:413
- confirmed `enable_url_validation` — set to false in dev environment — vendor/shopware/core/Framework/Resources/config/packages/dev/shopware.yaml:13
- confirmed `enable_url_upload_feature` — declared as booleanNode in bundle configuration — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:355
- corrected `ApiAware` — docs: controls Store API exposure; code allowlists AdminApiSource and SalesChannelApiSource by default — vendor/shopware/core/Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:11
