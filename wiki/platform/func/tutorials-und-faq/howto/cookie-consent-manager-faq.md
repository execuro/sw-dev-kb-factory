---
id: platform/func/tutorials-und-faq/howto/cookie-consent-manager-faq.md
title: "Cookie Consent Manager Faq"
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-und-faq/howto/cookie-consent-manager-faq"
sourceHash: "f91a5095dbfc83a480ade20f664179d3c41a2a765050b7832b4e94096f2cfdd2"
revision:
  current: true
  range: "6.0.0.0 - 6.6.10.9"
  swMax: "6.6.10.9"
  swMin: "6.0.0.0"
keywords: ["Cookie Consent Manager", "GDPR", "cookie settings", "Accept all button", "footer link", "snippets", "off-canvas cookie", "/cookie/offcanvas", "category link type", "cookie banner", "Localisation Snippets", "Catalogues"]
summary: "FAQ on Shopware's Cookie Consent Manager: enabling the Accept all button, adding a footer link to adjust cookie settings, and editing its snippet texts."
lastBuilt: "2026-09-15"
---
## What it is
FAQ covering the Cookie Consent Manager, which Shopware or third-party extensions provide programmatically to meet the cookie consent requirements mandatory for online stores in many countries.

## When to use
Use when configuring the "Accept all" button, giving customers a way to revisit their cookie settings later, or customizing the consent manager's texts.

## Key steps / config
- Cookie entries are provided programmatically by Shopware or extensions — no further admin configuration is needed for the entries themselves.
- Enable the "Accept all" button under **Settings > General > Basic information**.
- To let customers adjust cookie settings later, create a footer category entry under **Catalogues > Categories** with:

```
Name: Cookie settings
Category type: Link
Link type: External
Link target: /cookie/offcanvas
```

  Deactivate the "Use protocol" option to apply the `/cookie/offcanvas` link target, then activate the new category.
- Customize the consent manager's texts under **Settings > Localisation > Snippets**, searching "Cookie" to list them; copy and save the original text before making changes.

## Essential identifiers
- `/cookie/offcanvas` link target
- `Settings > General > Basic information`
- `Settings > Localisation > Snippets`

## Version notes
This FAQ's revision metadata scopes it to the 6.0.0.0–6.6.10.9 range.
