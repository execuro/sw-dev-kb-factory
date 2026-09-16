---
id: platform/dev/6.6/guides/integrations-api/general-concepts/_index.md
title: General Concepts
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/integrations-api/general-concepts/
sourceHash: de3ffd8b6d0a6608d3a4e48c7bc477b7a105d14d
keywords: ["search criteria", "request headers", "generated reference", "API versioning", "Admin API", "Store API", "search endpoint", "/search endpoint", "API concepts", "API documentation"]
summary: Index page for concepts shared by the Admin API and Store API: search criteria, request headers, generated reference docs, and API versioning.
lastBuilt: "2026-09-15"
---
## What it is

This is the index page for the "General Concepts" section, covering ideas common to both the Admin API and the Store API even though the two APIs serve very different purposes.

## When to use

Read this page before diving into either API to understand how querying, request headers, generated documentation, and API versioning work consistently across both.

## Key steps / config

Querying data: for the Admin API this applies to the `/search` endpoint; for the Store API it applies to almost every endpoint that returns a list of records. Both start from a single generic object encapsulating the entire search description, referred to as the "search criteria" — covered on its own sub-page.

Additional instructions can be specified using request headers, covered on a separate sub-page.

Documentation: a "Generated Reference" sub-page explains the common approach Shopware uses to provide endpoint references for its APIs.

API Versioning: starting with Shopware version 6.4.0.0, the API versioning strategy changed; a dedicated sub-page covers what changed, how it used to work, and how the current strategy works.

## Essential identifiers

- Search criteria (generic search-description object)
- `/search` endpoint (Admin API)
- Request headers
- Generated Reference (endpoint documentation approach)
- API Versioning (strategy since Shopware 6.4.0.0)

## Version notes

The API versioning strategy changed starting with Shopware version 6.4.0.0, as detailed on the linked "API Versioning" sub-page.
