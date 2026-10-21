---
id: platform/dev/6.7/resources/references/adr/2022-09-28-mapping-of-product-area.md
title: Mapping of product area
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-09-28-mapping-of-product-area.html
sourceHash: ebbdb3fdabb93488c3c27a78fc2a80cb228d39b1
codeCheckedAgainst: "6.7.15.1"
keywords: ["@package", "Package", "Shopware\\Core\\Framework\\Log\\Package", "@sw-package", "product area", "team ownership", "code ownership", "area annotation", "getPackageName", "PACKAGE_TRACE_ATTRIBUTE_KEY", "adr", "error mapping"]
summary: "ADR: every platform file is tagged with its owning product area; 6.7 uses the PHP #[Package('area')] attribute and a @sw-package JS comment."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-09-28, area product-operations) that maps every source file of the Shopware platform to an owning product area (team), so tickets can be assigned to the right area and errors reported from the SaaS application can be routed automatically.

## When to use

When you add or move a file in the platform (`src`/`tests`) and need to know which ownership marker it must carry, or when you read a stack trace and want to find the responsible area.

## Key steps / config

The ADR decided on a `@package <area>` doc comment for all files in `src` and `tests` of the `platform`, `rufus` and `commercial` repositories. The installed 6.7 code implements the marker differently per language:

- PHP classes carry the attribute `Shopware\Core\Framework\Log\Package`:

```php
use Shopware\Core\Framework\Log\Package;

#[Package('checkout')]
class MyService { /* ... */ }
```

- JavaScript/TypeScript files carry a doc comment:

```js
/**
 * @sw-package framework
 */
```

- `Package::getPackageName($class, $tryParentClass)` reads the attribute via reflection (optionally falling back to the parent class); `Package::PACKAGE_TRACE_ATTRIBUTE_KEY` is `'pTrace'`.

Valid areas in 6.7 (`PackageString` type): `inventory`, `checkout`, `after-sales`, `framework`, `data-services`, `innovation`, `discovery`, `b2b`, `fundamentals@framework`, `fundamentals@discovery`, `fundamentals@checkout`, `fundamentals@after-sales`, `saas-infrastructure`.

## Essential identifiers

- `#[Package('<area>')]` — `Shopware\Core\Framework\Log\Package`
- `@sw-package <area>` — JS/TS comment
- `Package::getPackageName()`

## Gotchas

- The area list in the ADR (`admin`, `storefront`, `core`, `inventory`, `checkout`, `content`, `customer-order`, `services-settings`, `buyers-experience`) is outdated; only `inventory` and `checkout` remain valid in 6.7.
- The `Package` class is marked `@internal`. Its docblock notes that changes to the valid areas must also be mirrored in the Administration ESLint rule `require-package-annotation.js`.

## Version notes

- The plain `@package <area>` doc comment of the ADR has been replaced in core PHP by the `#[Package]` attribute; a residual `@package framework` docblock remains only in a few places such as `EntityGenerator.php`.

## Code check (6.7.15.1)
- corrected `Package` — docs: `@package <area>` doc comment; code uses a PHP class attribute — vendor/shopware/core/Framework/Log/Package.php:16
- corrected `PackageString` — docs: admin, storefront, core, content, customer-order, services-settings, buyers-experience areas — vendor/shopware/core/Framework/Log/Package.php:8
- confirmed `#[Package('checkout')]` — attribute applied to core classes — vendor/shopware/core/Checkout/Cart/Hook/CartHook.php:22
- confirmed `Package::getPackageName()` — resolves area via reflection — vendor/shopware/core/Framework/Log/Package.php:27
- confirmed `Package::PACKAGE_TRACE_ATTRIBUTE_KEY` — value pTrace — vendor/shopware/core/Framework/Log/Package.php:18
- corrected `@sw-package` — docs: `@package` JS comment — vendor/shopware/storefront/Resources/app/storefront/src/utility/bootstrap/bootstrap.util.js:5
- confirmed `@package` — residual docblock usage — vendor/shopware/core/Framework/DataAbstractionLayer/EntityGenerator.php:96
