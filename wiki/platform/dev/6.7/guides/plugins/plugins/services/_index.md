---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/services/_index.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md
  - platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md
  - platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md
sourceHash: 95dcf36ce258514ee3bcf124a755680038601dc1
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/services/
title: Services
version: "6.7"
versions:
  - "6.7"
keywords: ["services", "service layer", "services.php", "dependency injection", "DI container", "service decoration", "decorator", "custom service", "plugin services", "symfony container", "adjust service", "inject service"]
summary: "Index of the plugin service-layer guides: registering a custom service, injecting services via DI, and decorating existing Shopware services."
lastBuilt: 2026-10-21
---
## What it is

Overview of the service layer in plugin development. Services hold reusable plugin logic, dependency injection wires services together, and service decoration lets a plugin change the behavior of an existing Shopware service.

## When to use

Pick the sub-guide matching the task:

- Register reusable plugin logic as a service: [Add Custom Service](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md)
- Inject Shopware or plugin services into another service: [Dependency Injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md)
- Change the behavior of an existing Shopware service: [Adjusting a Service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md)

## Key steps / config

All three guides work from the plugin's `src/Resources/config/services.php`, which the plugin bundle loads automatically into the Symfony container.

## Code check (6.7.15.1)
- confirmed `Resources/config/services.*` — bundles load every `services.*` file from `Resources/config` into the container — vendor/shopware/core/Framework/Bundle.php:238
- confirmed `PhpFileLoader` — PHP service definitions are one of the supported loaders — vendor/shopware/core/Framework/Bundle.php:234
