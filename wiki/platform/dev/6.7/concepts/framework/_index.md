---
id: platform/dev/6.7/concepts/framework/_index.md
title: Framework
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/concepts/framework/
sourceHash: d3c77c11286649ed4acdc312ee91a0bd8a9dbd8d
codeCheckedAgainst: "6.7.13.0"
keywords: ["framework", "shopware framework", "core concepts", "Shopware\\Core\\Framework", "Framework bundle", "platform concepts", "shop infrastructure", "customization", "extensibility", "concepts overview"]
summary: Entry page of the Shopware 6 framework concepts section - Shopware as a framework for building customized shop infrastructures.
lastBuilt: 2026-09-15
---
## What it is

The landing page of the "Framework" concepts section. It states that Shopware 6 is not only an ecommerce platform but also a framework for developing highly customized shop infrastructures, and that the pages below it introduce the core concepts needed to understand and use its capabilities (architecture, Data Abstraction Layer, translations and related topics).

In the installed code the framework layer lives in the Core package under the namespace `Shopware\Core\Framework`, whose Symfony bundle class is `Shopware\Core\Framework\Framework`.

## When to use

Use as an orientation entry point before reading the individual framework concept pages; it contains no how-to steps or configuration itself.

## Essential identifiers

- `Shopware\Core\Framework\Framework` (Symfony bundle of the framework layer)

## Code check (6.7.13.0)
- confirmed `Framework` — the framework layer is a Symfony bundle class in core — vendor/shopware/core/Framework/Framework.php:57
