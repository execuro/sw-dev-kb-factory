---
id: platform/dev/6.7/resources/guidelines/code/document-code.md
title: Document Code
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/code/document-code.html
sourceHash: c44456b64c9c8ed4d531514d5d4847a7bd896c59
codeCheckedAgainst: "6.7.13.0"
keywords: ["docblock", "phpdoc", "@throws", "@param", "@return", "code documentation", "interface", "abstract class", "coding guidelines", "exceptions", "type hints"]
summary: "Shopware docblock guideline: document interface/abstract methods, skip @param/@return covered by type hints, list directly thrown exceptions with @throws."
lastBuilt: 2026-09-15
---
## What it is

A Shopware coding guideline on when PHP doc blocks are required and which annotations belong in them.

## When to use

When writing or reviewing PHP code for Shopware core or a plugin, especially interfaces, abstract classes and methods that throw exceptions.

## Key steps / config

- Methods of interfaces or abstract classes always get a doc block describing what the method is used for and what an implementation has to take into account.
- Avoid unnecessary doc block lines — including `@param` and `@return` when the native type hints already define them.
- Document every exception the method throws **directly** with a `@throws` annotation.
- Do not document exceptions that could be thrown by a library the method calls.

## Essential identifiers

- `@throws`
- `@param`, `@return`

## Code check (6.7.13.0)
- confirmed `@throws` — core documents a directly thrown exception on a method docblock — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:115
- confirmed `KernelPluginLoader::loadPluginInfos()` — abstract method in the same class the guideline scope covers — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/KernelPluginLoader.php:180
