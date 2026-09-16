---
id: platform/dev/6.6/resources/guidelines/code/session-and-state.md
title: Session and State
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/session-and-state.html
sourceHash: 7feb7d4fe2a5a76fc9bbfdd9fba9dd55288368ec
keywords: ["session and state", "php session", "core domain", "storefront domain", "session data", "state management", "core guidelines", "session handling", "storefront request"]
summary: "Core domain code must not access the PHP session; session and state handling belongs in the Storefront domain."
lastBuilt: 2026-09-15
---
## What it is

This core coding guideline states that code within the `Core` domain is not allowed to access the PHP session, and that session/state handling belongs in the `Storefront` domain.

## Key steps / config

- Within the `Core` domain, it is not allowed to access the PHP session.
- There is only one PHP session, and it exists only if the request is a Storefront request.
- The appropriate implementation and consideration of session data must be handled in the `Storefront` domain.

## Essential identifiers

`Core` domain, `Storefront` domain, PHP session
