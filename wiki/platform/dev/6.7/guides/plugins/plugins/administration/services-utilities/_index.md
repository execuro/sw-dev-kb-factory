---
id: platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/_index.md
title: Services and Utilities
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/administration/services-utilities/
sourceHash: 291cea886b229f3d6a39535fcbac4ad226252ba9
codeCheckedAgainst: "6.7.13.0"
keywords: ["administration services", "utilities", "Shopware.Service", "Shopware.Application", "Shopware.Filter", "service container", "dependency injection", "decorate service", "filters", "api requests", "sanitizer", "user feedback", "utils"]
summary: "Index of Administration guides on services and utilities: registering, injecting, extending services, API requests, filters, utils, sanitizer, user feedback."
lastBuilt: 2026-09-15
---
## What it is

The overview page for the Shopware 6.7 Administration "Services and Utilities" guide group. It lists the guides covering how to create, extend and use services and utility helpers in the Administration JavaScript application.

## When to use

Start here when plugin code in the Administration needs reusable logic outside a component: a custom service in the Administration's service container, a change to an existing service, an HTTP call to the Admin API, a text-formatting filter, a utility helper or data validation, or feedback shown to the user after an action.

## Key steps / config

The group contains these guides (in navigation order):

- Add Custom Service — register a service in the container and inject it into components.
- Injecting Services — use registered services inside components.
- Extending Services — decorate existing services or add middleware to them.
- Displaying User Feedback — notifications and snackbars.
- Making API Requests — call the API from the Administration.
- Add Filter — register a formatting filter.
- Using Filter — use a registered filter in code.
- Using Utils — the utility helpers.
- The Sanitizer Helper — sanitizing data.

The guides share the global `Shopware` object as entry point: `Shopware.Service()` for the service container and `Shopware.Application` for container access, service decorators and middleware, and `Shopware.Filter` for filters.

## Essential identifiers

- `Shopware.Service`
- `Shopware.Application`
- `Shopware.Filter`

## Code check (6.7.13.0)
- confirmed `Shopware.Service` — global object exposes the service factory — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:208
- confirmed `Shopware.Application` — global object exposes the application bootstrapper — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:212
- confirmed `Shopware.Filter` — global object exposes the filter factory (register, getByName, getRegistry) — vendor/shopware/administration/Resources/app/administration/src/core/shopware.ts:178
