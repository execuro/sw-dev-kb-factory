---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/_index.md
title: Services and Utilities
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/
sourceHash: 291cea886b229f3d6a39535fcbac4ad226252ba9
codeCheckedAgainst: "6.7.15.1"
keywords: ["Shopware.Service", "Shopware.Filter", "Shopware.Utils", "SanitizerHelper", "administration services", "service container", "inject service", "decorate service", "api requests", "filters", "utils", "user feedback"]
summary: Overview of Administration guides on services and utilities - registering, injecting, extending services, API requests, filters, utils, sanitizer.
lastBuilt: 2026-10-21
---
## What it is

Section overview for the Administration guides on creating, extending and using services and utility helpers. The guides cover how to:

- structure reusable logic and integrate with the Administration service container;
- register and inject custom services;
- extend or decorate existing services;
- make API requests from the Administration;
- create and use filters;
- work with utility helpers and data validation.

Pages in this section: Add Custom Service, Injecting Services, Extending Services, Displaying User Feedback, Making API Requests, Add Filter, Using Filter, Using Utils, The Sanitizer Helper.

## Essential identifiers

- `Shopware.Service` — service container accessor
- `Shopware.Filter` — filter registry
- `Shopware.Utils` — utility helpers
- `Shopware.Helper.SanitizerHelper` — sanitizer helper

## Code check (6.7.15.1)
- confirmed `Shopware.Service` — global accessor bound to ServiceFactory — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:221
- confirmed `Shopware.Filter` — exposes register/getByName/getRegistry — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:191
- confirmed `Shopware.Utils` — global utils object — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:223
- confirmed `SanitizerHelper` — exposed under Shopware.Helper — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:313
- confirmed `Shopware.ApiService` — API service registry for API requests — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:233
