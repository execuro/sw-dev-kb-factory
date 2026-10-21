---
id: platform/hubs/dependency-injection.md
title: "dependency injection"
summary: "Navigation hub for dependency injection in Shopware plugins, the Administration (BottleJS) and the B2B Suite, across 6.6 and 6.7."
keywords: ["dependency injection", "service container", "services.xml", "services.php", "autowiring", "service decoration", "constructor injection", "bottlejs", "b2b suite", "plugin services", "xml to php", "symfony"]
members: ["platform/dev/6.6/concepts/extensions/plugins-concept.md", "platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-custom-service.md", "platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-custom-service.md", "platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-translations.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/dependency-injection.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/overload-classes.md", "platform/dev/6.6/resources/guidelines/code/dependency-injection-dependency-handling.md", "platform/dev/6.6/resources/references/adr/2023-05-16-symfony-dependency-management.md", "platform/dev/6.7/concepts/extensions/plugins-concept.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/extending-services.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/injecting-services.md", "platform/dev/6.7/guides/plugins/plugins/architecture/_index.md", "platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/services/_index.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/dependency-injection.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/overload-classes.md", "platform/dev/6.7/resources/references/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.md"]
lastBuilt: 2026-10-21
---

# Dependency injection

This hub covers how services are registered, injected, decorated and overridden: PHP services in plugins (Symfony service container), Administration services (BottleJS container), and the B2B Suite's own container setup. Come here to pick the right page for the version and layer you work in. Note the lifecycle change: in 6.7 plugin service registration is documented via `services.php`, and the ADR on migrating container configuration from XML to PHP states that plugin XML service/route/package config is deprecated in 6.7 and removed in 6.8. The 6.6 pages use `services.xml`.

## 6.6

Plugin PHP services (`services.xml`):
- [Plugins](platform/dev/6.6/concepts/extensions/plugins-concept.md) — plugins extend Symfony bundles, run inside the Core process, ship as Composer packages.
- [Add custom service](platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-custom-service.md) — register a PHP service class via `services.xml` in the Symfony DI container.
- [Dependency injection](platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/dependency-injection.md) — inject a service with an argument `type=service` and constructor injection, e.g. `SystemConfigService`.
- [Add translations](platform/dev/6.6/guides/plugins/plugins/storefront/add-translations.md) — snippet files and using the translator service in Twig, controllers and PHP.

Administration services:
- [Adding Services](platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-custom-service.md) — register, inject and decorate a custom Administration service via BottleJS.

Guidelines and ADR:
- [Dependency Injection & Dependency Handling](platform/dev/6.6/resources/guidelines/code/dependency-injection-dependency-handling.md) — Core code must not access the PHP session; that belongs in Storefront.
- [Symfony Dependency Management](platform/dev/6.6/resources/references/adr/2023-05-16-symfony-dependency-management.md) — ADR enabling autowiring and PHP-based service configuration.

B2B Suite:
- [Core](platform/dev/6.6/products/extensions/b2b-suite/guides/core/_index.md) — index of B2B Suite Core features.
- [Dependency injection](platform/dev/6.6/products/extensions/b2b-suite/guides/core/dependency-injection.md) — per-component `DependencyInjectionConfiguration` and `B2BContainerBuilder`.
- [Overloading classes](platform/dev/6.6/products/extensions/b2b-suite/guides/core/overload-classes.md) — override a service id with a parent abstract service.

## 6.7

Plugin PHP services (`services.php`):
- [Plugins](platform/dev/6.7/concepts/extensions/plugins-concept.md) — plugin concept; Symfony bundles extending `Shopware\Core\Framework\Plugin`.
- [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md) — ordered plugin development flow including services.
- [Services](platform/dev/6.7/guides/plugins/plugins/services/_index.md) — index: custom services, injection, decoration.
- [Add Custom Service](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md) — register via `src/Resources/config/services.php`, autowire/autoconfigure or `set()`.
- [Dependency Injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) — constructor injection, autowired or `->args([service(...)])`.

Architecture rules:
- [Plugin Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/_index.md) — index of mandatory plugin architecture rules.
- [Dependency Injection & Dependency Handling](platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md) — Core vs Storefront boundaries; no session or request access in Core services.

Administration services:
- [Adding Services](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md) — register a service in the BottleJS container, add middleware or decorators.
- [Extending Services](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/extending-services.md) — decorate or add middleware to existing services via `Shopware.Application`.
- [Injecting Services](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/injecting-services.md) — use a service in a Vue component through `inject`.

ADR:
- [Migrate container configuration from XML to PHP](platform/dev/6.7/resources/references/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.md) — XML service/route config deprecated in 6.7, removed in 6.8.

B2B Suite:
- [Core](platform/dev/6.7/products/extensions/b2b-suite/guides/core/_index.md) — index of B2B Suite Core guides.
- [Dependency injection](platform/dev/6.7/products/extensions/b2b-suite/guides/core/dependency-injection.md) — registration in a plugin's `build()` method; service tags.
- [Overloading classes](platform/dev/6.7/products/extensions/b2b-suite/guides/core/overload-classes.md) — override a service id or its class parameter and set the abstract parent.

The 6.6 and 6.7 pages with the same titles (Plugins, Adding Services, Dependency injection, Core, Overloading classes) cover the same topics for their respective versions; the 6.7 plugin pages use `services.php` instead of `services.xml`.
