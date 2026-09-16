---
id: platform/dev/6.7/products/paas/shopware/cdn/security-features.md
title: Security Features
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/cdn/security-features.html
sourceHash: a7ef7d8d2aae12fba3ff4b0d80b353add3d776e1
codeCheckedAgainst: "6.7.13.0"
keywords: ["web application firewall", "waf", "ngwaf", "fastly next-gen waf", "core feature set", "owasp top 10", "security features", "shopware paas native", "fastly"]
summary: "Shopware PaaS Native enables Fastly Next-Gen WAF (NGWAF) Core feature set by default for every application; OWASP Top 10 protection, no setup needed."
lastBuilt: 2026-09-15
---
## What it is

Shopware PaaS Native includes a Web Application Firewall (WAF) by default, powered by Fastly NGWAF. The enabled default feature set is the NGWAF `Core` feature set, which protects against the OWASP Top 10 categories.

## When to use

When assessing the security posture of a shop hosted on PaaS Native, or checking whether a WAF must be set up separately (it does not).

## Key steps / config

- No action is required: the WAF is enabled and configured automatically for every application.
- Enabled feature set: NGWAF `Core`.

## Gotchas

- Only the `Core` feature set is available. Additional Fastly add-ons from other feature sets are on the roadmap with no timeline, so they cannot be enabled today.

## Code check (6.7.13.0)
- unverified `NGWAF` — Fastly edge WAF managed by the PaaS platform, outside vendor/shopware scope
- unverified `Core` — NGWAF feature set name, Fastly/PaaS configuration outside vendor/shopware scope
