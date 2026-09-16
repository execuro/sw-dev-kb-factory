---
id: platform/func/shopware-en/settings/basic-information.md
title: Basic Information
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-en/settings/basic-information
sourceHash: 0ec606b8d97e5d6d1a17693ef776b42e9c532273e7cb8398779355ceda0a0296
revision:
  current: true
  range: "6.6.10.14 - 6.6.10.14"
  swMax: "6.6.10.14"
  swMin: "6.6.10.14"
keywords: ["basic information", "shop pages", "legal and compliance", "robots.txt", "CAPTCHA", "reCAPTCHA", "Friendly Captcha", "Honeypot", "meta author", "GTC pages", "imprint", "cookie notification", "robots meta tag", "meta title"]
summary: "Settings > General > Basic Information: shop identity, static page layouts, legal/compliance toggles, robots.txt rules and CAPTCHA options."
lastBuilt: "2026-09-15"
---
## What it is

The **Settings > General > Basic Information** section stores global (or per sales channel) data for a Shopware shop: identity fields, static page layout assignments, legal/compliance options, robots.txt rules, CAPTCHA choice, and the default robots meta tag.

## When to use

Use this page to configure shop identity, assign layouts for legally required pages, manage cookie/consent and contact-form requirements, control search-engine crawling, and choose bot-protection for registration/forms.

## Key steps / config

**Basic information**: Sales Channel (1) scope selector; Shop name (2); Shop owner's email address (3); Meta Author (4, SEO meta tag); Family friendly shop (5); Shop owner's address (6); Shop owner's banking information (7, e.g. IBAN/BIC).

**Shop pages** (layout assignments): GTC pages (1), revocation notices (2), payment and shipping information (3), privacy pages (4, GDPR), imprint (5), 404 pages (6), maintenance pages (7), contact pages (8), revocation request (9, requires "Display 'Cancel contract' button in footer"), newsletter pages (10).

**Legal and compliance**: Use default cookie notification (1); Show "Accept all cookies" button (2); First/Last name required in contact forms (3, 4); Phone number required in contact form (5); Show "Revoke a contract" button in footer (6).

**Rules for robots.txt**: domain-specific `Allow`/`Disallow` directives read by crawlers (e.g. Googlebot). `Disallow` blocks crawling of pages/directories; `Allow` overrides a block for specific paths. Robots.txt only controls crawling, not access.

**CAPTCHA** options: Honeypot (invisible field bots fill in); Basic CAPTCHA (distorted character image); Google reCAPTCHA v2 (checkbox + optional picture puzzle; needs Website key and Secret key; also an "Invisible" mode); Google reCAPTCHA v3 (score 0-1 threshold, Website key + Secret key); Friendly Captcha (paid, requires a commercial Shopware plan; used by default for registration on Shopware Cloud).

**Meta**: sets the default value of the **robots meta tag**, embedded in HTML and supplementing robots.txt; CMS pages can override it per page; some system pages (e.g. cart, checkout) always use `noindex, follow` regardless of this setting.

## Essential identifiers

- `Settings > General > Basic Information`
- robots.txt directives: `Allow`, `Disallow`
- CAPTCHA solutions: Honeypot, Basic CAPTCHA, Google reCAPTCHA v2, Google reCAPTCHA v3, Friendly Captcha
- reCAPTCHA fields: Website key, Secret key, Invisible Google reCAPTCHA v2, Threshold score (reCAPTCHA v3)
- robots meta tag default: `noindex, follow` for system pages such as cart/checkout

## Gotchas

- System pages like the shopping cart or checkout always use `noindex, follow` for the robots meta tag, regardless of the Meta setting, for security and privacy reasons.
- Friendly Captcha requires booking a paid plan with Friendly Captcha; on Shopware Cloud it is used by default for registration and other captchas are currently not available there.
- Google reCAPTCHA v2/v3 both require a Google reCAPTCHA account (Website key and Secret key); v3 additionally needs a configured threshold score between 0 and 1.
