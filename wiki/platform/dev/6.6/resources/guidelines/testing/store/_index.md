---
id: platform/dev/6.6/resources/guidelines/testing/store/_index.md
title: Testing guidelines for extensions
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/testing/store/
sourceHash: 4e4737d7e990e4583fce3b2d92170b7a7874d5e9
keywords: ["extension testing", "Store review criteria", "Lighthouse audit", "rich snippets", "cookie consent", "store description", "translations fallback", "API validation", "uninstallation process", "manual code review", "test statuses"]
summary: "Criteria and pass/fail statuses Shopware uses to test an app or plugin before Store release."
lastBuilt: "2026-09-15"
---
## What it is
Overview of the criteria Shopware uses to test an extension (app or plugin) before it can be released to the Store, and the three statuses assigned to each test point.

## When to use
Before submitting an extension for Store review, to check which criteria apply and what "OK", "Failed", and "Not necessary" mean for each.

## Key steps / config
Test criteria checked during Store review:
- Function availability: complete functionality, buttons/export/rules working, no console errors.
- Lighthouse audit (home/listing/detail): Storefront impact, correctly named buttons/labels, all five Lighthouse audits, with attention to mobile-first.
- Rich snippet checks (home/listing/detail): page indexability and correct price information; rich snippets don't affect ranking but improve SEO visibility.
- Storefront errors / 503/404: extension active in Storefront, no display errors, and clear customer-facing error messages regardless of who caused the error.
- Cookie check (storefront/checkout): cookies classified as technically required, comfort functions, or statistics/tracking, per GDPR/DSGVO.
- Store description (German/English): country restrictions noted, English description mandatory, German only if offered in the German market, at least two English images (Storefront and Admin).
- Translations managed in the admin: extension available in all account-specified languages, with English as the fallback.
- API validation: a test button must let customers validate required API credentials, if technically possible.
- Uninstallation process: clean install/uninstall, and dependent-app checks before uninstall.
- Data removal: selecting "delete all data" on uninstall must remove all extension-created database data.
- Manual code review: a Shopware developer reviews the code for quality and security gaps.

## Essential identifiers
- Test statuses: OK, Failed, Not necessary
