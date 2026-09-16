---
id: platform/dev/6.6/resources/references/adr/2023-05-16-symfony-dependency-management.md
title: Symfony Dependency Management
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2023-05-16-symfony-dependency-management.html"
sourceHash: "a73ac8e1b794c99e0e44eb5704c413efeeac3c35"
keywords: ["symfony", "autowiring", "dependency injection", "service container", "php configuration", "autowiring attributes", "xml service definitions", "dependency management"]
summary: "ADR: Shopware enables Symfony autowiring and PHP-based service configuration, using attributes only for framework glue code."
lastBuilt: "2026-09-15"
---
## What it is
Architecture decision record on adopting newer Symfony dependency-configuration features: autowiring, PHP-based service configuration, and autowiring attributes.

## When to use
Relevant when registering or reviewing Symfony service definitions in Shopware core, deciding between XML, PHP config, or attributes.

## Key steps / config
Decision:
1. Autowiring is enabled.
2. Service configuration can be loaded from PHP files as well as XML (kept for backwards compatibility).
3. Attributes are used only where a specific non-default service or scalar value is needed.

Migration steps:
1. Add support for loading service definitions from PHP files alongside XML.
2. Enable autowiring; Symfony prefers registered configuration and only autowires classes without one.
3. Delete definitions that are no longer required because they can be autowired.
4. Migrate remaining definitions to PHP configuration or attributes.

## Essential identifiers
- Symfony autowiring
- PHP service configuration files
- Attributes for autowiring

## Gotchas
Attributes should be used only in framework glue code (e.g. controllers and commands) to avoid coupling domain code too closely to Symfony. There are no runtime performance implications from autowiring since the container is compiled.
