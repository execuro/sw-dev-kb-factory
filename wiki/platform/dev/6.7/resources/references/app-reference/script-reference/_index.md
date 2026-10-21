---
id: platform/dev/6.7/resources/references/app-reference/script-reference/_index.md
title: Script Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/
sourceHash: 1cf48109f2537c41b04a5dacdd3f62c260e18eb7
codeCheckedAgainst: "6.7.15.1"
keywords: ["script reference", "app scripts", "script services", "ServiceStubs", "services.cart", "services.repository", "services.writer", "services.response", "services.cache", "twig scripts", "facade"]
summary: Entry page of the app script reference - functions, methods, arguments, return values and samples of the services available to app scripts.
lastBuilt: 2026-10-21
---
## What it is

Entry page of the app script reference section. The script references explain the functions, methods, arguments, responses and samples of the services available to app scripts, giving an overview of service capabilities, code structure and functionality.

## When to use

When writing an app script and you need the exact methods and arguments of a script service (for example `services.cart`, `services.writer` or `services.response`), go to the relevant sub-reference.

## Essential identifiers

- `Shopware\Core\Framework\Script\ServiceStubs` — type hint for the `services` variable in script Twig files (`{# @var services \Shopware\Core\Framework\Script\ServiceStubs #}`), listing the installed services: `cart`, `price`, `repository`, `config`, `store`, `writer`, `request`, `response`, `cache`, `acl`.

## Gotchas

- A service is only available in the hooks that provide it; calling an unavailable one throws a "service not available in hook" script exception.

## Code check (6.7.15.1)
- confirmed `ServiceStubs` — auto-completion stub for the `services` variable — vendor/shopware/core/Framework/Script/ServiceStubs.php:26
- confirmed `ServiceStubs::get()` — throws when service not available in the current hook — vendor/shopware/core/Framework/Script/ServiceStubs.php:82
