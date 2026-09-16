---
id: platform/dev/6.7/resources/references/app-reference/script-reference/_index.md
title: Script Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/app-reference/script-reference/
sourceHash: 1cf48109f2537c41b04a5dacdd3f62c260e18eb7
codeCheckedAgainst: "6.7.13.0"
keywords: ["script reference", "app scripts", "script services", "twig scripts", "ServiceStubs", "HookServiceFactory", "@script-service", "facade", "app system"]
summary: Entry page of the app script reference covering the services, methods, arguments, return values and samples available to app scripts.
lastBuilt: 2026-09-15
---
## What it is

Landing page of the Script Reference section: detailed explanations of the functions, methods, arguments, responses and samples available to app scripts, giving an overview of service capabilities and code structure.

## When to use

When looking for which `services.*` objects and methods an app script can call; the concrete service pages below this section document each group.

## Essential identifiers

- `Shopware\Core\Framework\Script\ServiceStubs` — the type hint used in script samples (`services`)
- `@script-service` — docblock tag grouping facades into `cart_manipulation`, `data_loading`, `custom_endpoint`, `miscellaneous` in the installed code

## Code check (6.7.13.0)
- confirmed `ServiceStubs` — final class backing the `services` variable in scripts — vendor/shopware/core/Framework/Script/ServiceStubs.php:26
- confirmed `HookServiceFactory::getName()` — each script service factory declares its `services.<name>` — vendor/shopware/core/Framework/Script/Execution/Awareness/HookServiceFactory.php:27
- confirmed `@script-service` — tag value `data_loading` on RepositoryFacade — vendor/shopware/core/Framework/DataAbstractionLayer/Facade/RepositoryFacade.php:22
