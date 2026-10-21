---
id: platform/dev/6.7/resources/guidelines/code/document-code.md
title: Document Code
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/document-code.html
sourceHash: c44456b64c9c8ed4d531514d5d4847a7bd896c59
codeCheckedAgainst: "6.7.15.1"
keywords: ["doc block", "docblock", "phpdoc", "@throws", "@param", "@return", "interfaces", "abstract classes", "code documentation", "exceptions", "type hints"]
summary: "Shopware guideline for doc blocks: document interface/abstract methods, skip @param/@return covered by type hints, list directly thrown exceptions via @throws."
lastBuilt: 2026-10-21
---
## What it is

A short Shopware coding guideline defining when PHP doc blocks are written and what they contain.

## When to use

When writing or reviewing PHP doc blocks in Shopware core or extension code, especially on interfaces and abstract classes.

## Key steps / config

- Methods of interfaces or abstract classes always get a doc block describing what the function is used for and what must be observed in it, so implementers know what to take into account.
- Avoid unnecessary doc block lines — including `@param` and `@return` annotations when the type hints already define the types.
- Document every exception thrown directly by the function with a `@throws` annotation.
- Do not document exceptions that could be thrown by a library.

Shape of a conforming doc block on a method that throws directly:

```php
/**
 * @throws CartException
 */
```

## Essential identifiers

- `@throws`
- `@param`, `@return` (only when type hints cannot express the type)

## Code check (6.7.15.1)
- confirmed `EntityExtension::extendFields()` — abstract-class method carrying a descriptive doc block and no redundant `@param` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityExtension.php:18
- confirmed `@throws` — directly thrown `CartException` documented in core — vendor/shopware/core/Checkout/Cart/Cart.php:136
