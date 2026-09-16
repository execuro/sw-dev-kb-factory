---
id: platform/dev/6.6/guides/integrations-api/_index.md
title: Integrations / API
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/integrations-api/
sourceHash: 784a91bc0f1d0759e4ef731517baf86cf81982f0
keywords: ["Store API", "Admin API", "integrations", "API concepts", "customer-facing API", "backend-facing API", "anonymous user", "authenticated user", "endpoint reference", "API integration", "HTTP API"]
summary: Index page introducing Shopware's Store API and Admin API and the general concepts shared between them.
lastBuilt: "2026-09-15"
---
## What it is

This is the index page for the "Integrations / API" section. It introduces the two HTTP APIs Shopware provides for integrating with the platform: the Store API and the Admin API. Both are HTTP-based and, despite serving different use cases, share underlying concepts covered in a separate "General Concepts" sub-page.

## When to use

Use this page to decide which API to integrate against: the Store API for customer-facing frontend applications, or the Admin API for backend-facing data exchange and automation.

## Key steps / config

The Store API serves customer-facing interactions. Frontend applications built on it usually provide interfaces for anonymous (unregistered) and authenticated (registered) customers, typically don't expose sensitive data, use small payloads, and prioritize performance and availability. An endpoint reference for the Store API is published at Shopware's Stoplight documentation site (`shopware.stoplight.io/docs/store-api`).

The Admin API serves backend-facing integrations, characterized by exchange of structured data: synchronizations, imports, exports, and notifications. Performance matters more in terms of handling high data loads than fast response times; consistency, error handling, and transaction-safety are critical. Its endpoint reference is likewise published on Stoplight (`shopware.stoplight.io/docs/admin-api`).

Before working with either API, the source recommends reading the "General Concepts" sub-page, which covers ideas shared by both APIs.

## Essential identifiers

- Store API — customer-facing, anonymous/authenticated users
- Admin API — backend-facing, structured data exchange
- General Concepts sub-page (shared API concepts)
