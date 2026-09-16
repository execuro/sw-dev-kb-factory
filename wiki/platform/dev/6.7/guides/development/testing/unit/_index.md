---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/development/testing/unit/_index.md
sourceHash: c8dee6b313843c08ca1a7531197bfd1f0466708d
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/unit/
title: Unit Testing
version: "6.7"
versions:
  - "6.7"
keywords: ["unit testing", "unit tests", "jest", "phpunit", "administration tests", "storefront tests", "javascript testing", "php testing", "test overview"]
summary: "Entry page for Shopware unit testing: Jest for Administration and Storefront JavaScript, PHPUnit for PHP code."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/testing/unit/jest-admin.md", "platform/dev/6.7/guides/development/testing/unit/jest-storefront.md", "platform/dev/6.7/guides/development/testing/unit/php-unit.md"]
---
## What it is

Overview page for writing and running unit tests in Shopware, split by language: Jest for JavaScript, PHPUnit for PHP.

## When to use

When choosing which unit-testing guide applies to the code you changed.

## Key steps / config

- JavaScript (Jest), Administration: [Jest unit tests in Shopware's Administration](platform/dev/6.7/guides/development/testing/unit/jest-admin.md)
- JavaScript (Jest), Storefront: [Jest unit tests in Shopware's Storefront](platform/dev/6.7/guides/development/testing/unit/jest-storefront.md) — the Storefront package runs them with `jest --config jest.config.js`.
- PHP (PHPUnit): [PHP unit testing](platform/dev/6.7/guides/development/testing/unit/php-unit.md)

## Code check (6.7.13.0)
- confirmed `jest --config jest.config.js` — Storefront `unit` npm script — vendor/shopware/storefront/Resources/app/storefront/package.json:27
- confirmed `KernelTestBehaviour` — core PHPUnit test trait — vendor/shopware/core/Framework/Test/TestCaseBase/KernelTestBehaviour.php:8
- unverified `jest` (Administration) — Admin Jest config lives outside the scanned `src` root
