---
id: platform/func/tutorials-and-faq/security-measures.md
title: "Security Measures"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/security-measures"
sourceHash: "cb648bc9d33cbbab553b4b467b6fe2324637a66c6320ac6aa0d3545e3c8b3769"
revision:
  current: true
  range: "current"
  swMin: null
  swMax: null
keywords: ["rate limiter", "IP whitelisting", "HTML sanitizer", "SQL injection", "prepared statements", "API aware fields", "SameSite cookies", "sw_csrf", "GDPR", "Security Plugin", "captcha", "trusted proxy", "framework.yaml"]
summary: "Overview of Shopware's security measures: rate limiting, IP whitelisting, HTML sanitizer, SQL injection prevention, SameSite cookies, GDPR, captcha."
lastBuilt: "2026-09-15"
---
## What it is

This article summarizes the security measures currently implemented in Shopware: rate limiting, storefront IP whitelisting, HTML sanitization, SQL injection prevention, API field write-protection, SameSite cookies, GDPR-related documentation, an optional security plugin, and captcha support.

## When to use

Reference this when evaluating or hardening a Shopware store's security posture, or when investigating why a particular protection (rate limiting, sanitizer, cookie policy, etc.) behaves a certain way.

## Key steps / config

- Rate limiter: Shopware 6 ships default rate limits on pages like login and password reset to reduce brute-force risk, configured via the Shopware bundle configuration in `shopware.yaml`, where different limiters can be defined per action. As with other overrides, if `config/packages/` only contains `lock.yaml`, create `shopware.yaml` there first.
- Storefront IP whitelisting: sales channels can be temporarily disabled, and maintenance mode can show a maintenance-only page; when running behind a proxy, set the proxy IP as a trusted proxy (in `.env` or PHP settings) for IP whitelisting to work correctly.
- HTML Sanitizer (since Shopware 6.5): removes unsafe HTML code from editor content and sanitizes styles/attributes for consistent rendering across platforms and browsers.
- SQL injection prevention: Doctrine DBAL/ORM do not prevent SQL injection by themselves if used carelessly — use prepared statements for user input in SQL/DQL queries instead of string concatenation or manual escaping.
- API-aware fields / entity write protection: field visibility per API is controlled by flags — by default all fields are enabled for the `/admin` API, while `/store-api` and `/sales-channel-api` must explicitly enable each field via its flags.
- SameSite cookies: the Symfony FrameworkBundle's SameSite configuration replaces the `sw_csrf` Twig function and controls cookie security by default in modern browsers; it can be customized, including disabling SameSite protection, in `framework.yaml`.
- GDPR: Shopware provides documentation summarizing personal-data processing to help merchants prepare their own documentation and privacy statements.
- Shopware 6 Security Plugin: an alternative way to receive security-related improvements without upgrading to the latest platform version.
- Captcha: multiple captcha solutions can be enabled for registration and storefront forms, either a single one or several combined.

## Essential identifiers

- Rate limiter config (`shopware.yaml`)
- API field flags (`/admin`, `/store-api`, `/sales-channel-api`)
- SameSite cookie config (`framework.yaml`, replaces `sw_csrf` Twig function)
- HTML Sanitizer (since 6.5)
- Shopware 6 Security Plugin

## Gotchas

Trusted proxy configuration must be set correctly (`.env`/PHP settings) for the storefront IP whitelist to work behind a proxy. Doctrine DBAL/ORM do not protect against SQL injection automatically — careless string concatenation of user input is still exploitable.

## Version notes

The HTML Sanitizer was introduced with Shopware 6.5.
