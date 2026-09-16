---
id: platform/dev/6.7/resources/references/testing-reference/_index.md
title: Testing Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/testing-reference/
sourceHash: 547041bd749e5b97e00ea83c0ad7100f12f28bdb
codeCheckedAgainst: "6.7.13.0"
keywords: ["testing reference", "e2e", "end-to-end tests", "cypress", "e2e-testsuite-platform", "e2e commands", "custom commands", "shopware platform", "test commands"]
summary: "Index of the Shopware testing reference: E2E commands provided by e2e-testsuite-platform and the Shopware platform repository."
lastBuilt: 2026-09-15
---
## What it is

Entry page of the testing reference. It lists the Shopware commands provided by the E2E test suite package (`https://github.com/shopware/e2e-testsuite-platform`) and by the Shopware platform repository (`https://github.com/shopware/shopware`): the E2E console/composer commands and the custom Cypress commands.

## Code check (6.7.13.0)
- unverified `e2e-testsuite-platform` — separate npm package, not part of vendor/shopware core/storefront/administration src
- confirmed `e2e:dump-db` — platform E2E console command registered in core DevOps — vendor/shopware/core/DevOps/DependencyInjection/services_e2e.xml:13
