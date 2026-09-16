---
id: platform/dev/6.6/resources/references/security.md
sourceHash: 3f3b64b60ffacb454d99650c6ada9bb05f5fc427
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/security.html
title: Security
version: "6.6"
versions: ["6.6"]
docType: developer
keywords: ["security reference", "ACL", "access control list", "ApiAware", "captcha", "CSP", "content security policy", "csp_templates", "GDPR", "HTML sanitizer", "rate limiter", "SameSite cookie", "SQL injection", "Data Abstraction Layer"]
summary: "Compiles Shopware 6's security measures — ACL, ApiAware, CSP, captcha, GDPR, HTML sanitizer, rate limiter, SameSite, SQL injection prevention."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.6/guides/hosting/configurations/shopware/html-sanitizer.md", "platform/dev/6.6/guides/hosting/infrastructure/rate-limiter.md", "platform/dev/6.6/guides/hosting/configurations/framework/samesite-protection.md", "platform/dev/6.6/guides/hosting/installation-updates/cluster-setup.md"]
---
## What it is

A compilation of the security measures implemented in Shopware 6 and how to configure them: ACL, the `ApiAware` flag, captcha, Content Security Policy, file access, GDPR compliance, HTML sanitizer, rate limiter, session reset on password change, SameSite cookies, the Security plugin, storefront IP whitelisting, and SQL injection prevention.

## Key steps / config

- ACL in the Administration restricts create/read/update/delete access per module by user privilege.
- The `ApiAware` flag on an entity field controls whether that field is exposed to the Store API.
- Default CSP policies are configured through the `shopware.security.csp_templates` Symfony container parameter and can be adjusted via container configuration.
- Rate limits are applied by default to pages such as login or password reset to reduce brute-force risk.
- A password change invalidates the user's or customer's session, requiring re-login.
- SameSite cookie handling prevents the browser from sending cookies with cross-site requests.
- Security fixes can be obtained without a full version upgrade via the Security plugin.
- The Data Abstraction Layer avoids exposing raw SQL, and any direct SQL use should follow Doctrine DBAL's escaping best practices, to prevent SQL injection.

## Essential identifiers

`shopware.security.csp_templates` (container parameter), `ApiAware` (field flag).

## Gotchas

Report security vulnerabilities via the Security Advisory Form rather than a public issue.
