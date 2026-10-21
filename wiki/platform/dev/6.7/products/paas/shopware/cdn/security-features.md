---
id: platform/dev/6.7/products/paas/shopware/cdn/security-features.md
title: Security Features
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware/cdn/security-features.html
sourceHash: a7ef7d8d2aae12fba3ff4b0d80b353add3d776e1
codeCheckedAgainst: "6.7.15.1"
keywords: ["web application firewall", "waf", "fastly", "ngwaf", "next-gen waf", "core feature set", "owasp top 10", "security", "paas native", "cdn"]
summary: Shopware PaaS Native includes Fastly NGWAF (Core feature set) by default, protecting every application against OWASP Top 10 categories.
lastBuilt: 2026-10-21
---
## What it is

Describes the Web Application Firewall (WAF) of Shopware PaaS Native. Every application is protected by default by Fastly's Next-Gen WAF (NGWAF), with the NGWAF `Core` feature set enabled. This gives default protection against the OWASP Top 10 categories.

## When to use

When you need to know what edge-level security protection a PaaS Native shop has, for example for a security review or compliance question.

## Key steps / config

- No customer action is required: the WAF is enabled and configured automatically for every application.
- The enabled feature set is the NGWAF `Core` feature set; there is no documented option to change it.

## Essential identifiers

- Fastly NGWAF, feature set `Core`

## Version notes

- Additional add-ons from other Fastly feature sets are on the roadmap, with no timeline at this stage.

## Code check (6.7.15.1)
- unverified `NGWAF` — Fastly edge firewall operated by the PaaS platform, not part of Shopware code
- unverified `Core` feature set — Fastly NGWAF configuration, out of scope
