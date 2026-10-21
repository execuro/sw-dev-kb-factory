---
id: platform/dev/6.7/concepts/framework/_index.md
title: Framework
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/
sourceHash: d3c77c11286649ed4acdc312ee91a0bd8a9dbd8d
codeCheckedAgainst: "6.7.15.1"
keywords: ["framework", "core concepts", "shopware 6 framework", "Kernel", "Shopware\\Core\\Kernel", "Bundle", "custom shop infrastructure", "concepts overview"]
summary: "Entry page of the Framework concepts section: Shopware 6 as a framework for building highly customized shop infrastructures, beyond an ecommerce platform."
lastBuilt: 2026-10-20
---
## What it is

Section entry page for Shopware 6's framework concepts. Shopware 6 is described not only as an ecommerce platform but as a framework for developing highly customized shop infrastructures; the section introduces the core concepts needed to understand and use its capabilities. The page itself carries no further technical content.

## When to use

As the starting point when looking for the framework-level core concepts of Shopware 6 (the section's sub-pages hold the details).

## Code check (6.7.15.1)
- confirmed `Kernel` — Shopware's application kernel, extends Symfony `HttpKernel` — vendor/shopware/core/Kernel.php:37
- confirmed `Bundle` — framework bundle base for core and extensions — vendor/shopware/core/Framework/Bundle.php:33
