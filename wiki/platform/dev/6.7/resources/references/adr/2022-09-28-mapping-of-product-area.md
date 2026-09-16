---
id: platform/dev/6.7/resources/references/adr/2022-09-28-mapping-of-product-area.md
title: Mapping of product area
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-09-28-mapping-of-product-area.html
sourceHash: ebbdb3fdabb93488c3c27a78fc2a80cb228d39b1
codeCheckedAgainst: "6.7.13.0"
keywords: ["@package", "@sw-package", "Package", "Shopware\\Core\\Framework\\Log\\Package", "Package::getPackageName()", "product area", "team ownership", "area annotation", "code ownership mapping", "adr", "error routing", "package attribute"]
summary: "ADR 2022: tag each Shopware source file with its product area for ticket/error routing; 6.7 code uses the Package attribute and @sw-package."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022-09-28, area product-operations) that maps every source file of the Shopware platform to a product area (team), so tickets can be assigned to the right area and errors reported from the SaaS application can be routed automatically.

## When to use

When adding or moving a file in Shopware core, storefront, administration or an extension that follows core conventions, and you need to know how the owning area is declared — or when you need to resolve a class to its owning area at runtime.

## Key steps / config

The ADR decided on a `@package <area>` PHP-doc/JavaScript comment on every file in `src` and `tests` of the `platform`, `rufus` and `commercial` repositories. The installed 6.7 code expresses this differently:

1. PHP classes carry the class attribute `Shopware\Core\Framework\Log\Package`:
   ```php
   #[Package('framework')]
   class MyService
   {
   }
   ```
2. Administration JS/TS files carry a docblock tag `@sw-package <area>` (e.g. `@sw-package discovery`).
3. Valid area strings in 6.7 (the `PackageString` type): `inventory`, `checkout`, `after-sales`, `framework`, `data-services`, `innovation`, `discovery`, `b2b`, `fundamentals@framework`, `fundamentals@discovery`, `fundamentals@checkout`, `fundamentals@after-sales`, `saas-infrastructure`.
4. At runtime `Package::getPackageName($class, $tryParentClass)` reads the attribute via reflection and optionally falls back to the parent class.

## Essential identifiers

- `Shopware\Core\Framework\Log\Package` (attribute, `@internal`)
- `Package::getPackageName()`
- `@sw-package` (administration file tag)

## Gotchas

- The area list in the ADR (`admin`, `storefront`, `core`, `inventory`, `checkout`, `content`, `customer-order`, `services-settings`, `buyers-experience`) is outdated; only `inventory` and `checkout` survive in the 6.7 list.
- The `Package` attribute class is marked `@internal`, so it is not a public extension API.
- The plain `@package` docblock tag still appears in a few places, e.g. the stub emitted by the entity generator.

## Version notes

The ADR (2022) specifies a `@package` comment; in 6.7 PHP uses the `#[Package('<area>')]` attribute and administration files use `@sw-package`.

## Code check (6.7.13.0)
- corrected `Package` — docs: `@package <area>` PHP-doc comment; PHP classes use this attribute class — vendor/shopware/core/Framework/Log/Package.php:16
- corrected `PackageString` — docs: areas admin, storefront, core, content, customer-order, services-settings, buyers-experience — vendor/shopware/core/Framework/Log/Package.php:8
- confirmed `Package::getPackageName()` — resolves the area from the attribute, optional parent-class fallback — vendor/shopware/core/Framework/Log/Package.php:27
- confirmed `@sw-package` — administration files declare their area with this tag — vendor/shopware/administration/Resources/app/administration/src/module/sw-cms/component/sw-cms-visibility-config/index.ts:7
- confirmed `@package` — legacy docblock tag still emitted by the entity generator stub — vendor/shopware/core/Framework/DataAbstractionLayer/EntityGenerator.php:96
