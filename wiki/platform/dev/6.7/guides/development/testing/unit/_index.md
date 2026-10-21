---
id: platform/dev/6.7/guides/development/testing/unit/_index.md
title: Unit Testing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/unit/
sourceHash: c8dee6b313843c08ca1a7531197bfd1f0466708d
codeCheckedAgainst: "6.7.15.1"
keywords: ["unit testing", "unit tests", "jest", "phpunit", "javascript testing", "php testing", "administration tests", "storefront tests", "TestBootstrapper", "spec files", "test overview"]
summary: Index of Shopware unit testing guides - Jest for Administration and Storefront JavaScript, PHPUnit for PHP plugin code.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/testing/unit/jest-admin.md", "platform/dev/6.7/guides/development/testing/unit/jest-storefront.md", "platform/dev/6.7/guides/development/testing/unit/php-unit.md"]
---
## What it is

Overview section for writing and executing unit tests in Shopware, split by language and test framework.

## When to use

Entry point when you need to pick the right unit-testing guide for the code you are changing.

## Key steps / config

- JavaScript testing with Jest:
  - Administration components and services: [Jest unit tests in Shopware's Administration](platform/dev/6.7/guides/development/testing/unit/jest-admin.md)
  - Storefront helpers and JavaScript plugins: [Jest unit tests in Shopware's Storefront](platform/dev/6.7/guides/development/testing/unit/jest-storefront.md)
- PHP testing with PHPUnit: [PHP unit testing](platform/dev/6.7/guides/development/testing/unit/php-unit.md)

## Code check (6.7.15.1)
- confirmed `src/core/helper/sanitizer.helper` — Administration Jest specs sit next to the file under test and import it directly — vendor/shopware/administration/Resources/app/administration/src/core/helper/sanitizer.helper.spec.js:7
- confirmed `testMatch` — Storefront Jest config picks up `**/test/**/*.test.js` — vendor/shopware/storefront/Resources/app/storefront/jest.config.js:88
- confirmed `TestBootstrapper` — PHPUnit bootstrap helper used by plugin tests — vendor/shopware/core/TestBootstrapper.php:48
