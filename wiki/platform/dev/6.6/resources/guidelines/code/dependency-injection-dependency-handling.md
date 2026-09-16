---
id: platform/dev/6.6/resources/guidelines/code/dependency-injection-dependency-handling.md
title: Dependency Injection & Dependency Handling
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/dependency-injection-dependency-handling.html
sourceHash: 4795ff357307470e933e4b66effaa9a726903642
keywords: ["dependency injection", "dependency handling", "php session", "core domain", "storefront domain", "session data", "service dependencies", "core guidelines", "session access"]
summary: "Core domain code must not access the PHP session; session data handling belongs in the Storefront domain."
lastBuilt: 2026-09-15
---
## What it is

This core coding guideline states the dependency-handling rule that code within the `Core` domain must not access the PHP session.

## Key steps / config

- Within the `Core` domain, accessing the PHP session is not allowed.
- There is only one PHP session, and it exists only for a Storefront request.
- Any implementation and consideration of session data must be handled in the `Storefront` domain instead of `Core`.

## Essential identifiers

`Core` domain, `Storefront` domain, PHP session
