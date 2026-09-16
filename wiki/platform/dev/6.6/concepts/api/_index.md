---
id: platform/dev/6.6/concepts/api/_index.md
title: API
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/concepts/api/
sourceHash: c963ca36aab6a127ddd0f038671c0a0cb4456e59
keywords: ["API", "Shopware API", "Store API", "Admin API", "OAuth 2.0", "token-based authentication", "authentication", "endpoints", "request/response formats", "data structures", "integration", "storefront"]
summary: "Overview of Shopware's two functional APIs: Store API for storefront integrations and Admin API for back-end management, plus supported auth methods."
lastBuilt: 2026-09-15
---
## What it is
The API concepts section describes how the Shopware API lets developers interact with and integrate Shopware with other systems and applications. It exposes a set of services covering products, customers, orders, and shopping carts, and supports both read and write operations, so data can be retrieved from Shopware or modified within it. By leveraging the API, developers can extend Shopware's functionality, integrate it with external systems, and build custom experiences for managing and operating online stores.

## When to use
Use this page as the entry point when deciding whether to build against Shopware's front-end-facing API or its back-end management API, or when you need to know which authentication mechanism an API client should use.

## Key steps / config
Shopware supports two major functional APIs, which serve different purposes:
- The **Store API** — designed to interact with the front-end or storefront of a Shopware online store.
- The **Admin API** — intended for administrative operations related to managing the back-end of the Shopware platform.

The documentation for each API covers the available endpoints, request/response formats, authentication mechanisms, and data structures. Supported authentication methods include token-based authentication and OAuth 2.0, both used to secure communication between the API client and the Shopware platform.

## Essential identifiers
- `Store API`
- `Admin API`
- token-based authentication
- OAuth 2.0
