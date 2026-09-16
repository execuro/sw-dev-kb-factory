---
id: platform/hubs/dependency-injection.md
title: dependency injection
summary: "Symfony DI container usage across Shopware plugins, Administration, B2B Suite, and the XML-to-PHP config migration."
keywords: ["dependency injection", "symfony container", "services.xml", "services.php", "plugin services", "administration services", "bottlejs", "service decoration", "b2b suite", "autowiring", "constructor injection", "domain boundaries"]
members: ["platform/dev/6.6/concepts/extensions/plugins-concept.md", "platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-custom-service.md", "platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-custom-service.md", "platform/dev/6.6/guides/plugins/plugins/storefront/add-translations.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/dependency-injection.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/overload-classes.md", "platform/dev/6.6/resources/guidelines/code/dependency-injection-dependency-handling.md", "platform/dev/6.6/resources/references/adr/2023-05-16-symfony-dependency-management.md", "platform/dev/6.7/concepts/extensions/plugins-concept.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/injecting-services.md", "platform/dev/6.7/guides/plugins/plugins/architecture/_index.md", "platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md", "platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md", "platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/_index.md", "platform/dev/6.7/guides/plugins/plugins/services/_index.md", "platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md", "platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/dependency-injection.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/overload-classes.md", "platform/dev/6.7/resources/references/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.md"]
lastBuilt: 2026-09-15
---

This hub covers how Shopware wires dependencies: plugins as Symfony bundles registering
services into the platform's DI container, Administration services registered via BottleJS,
PHP-service (and legacy XML-service) registration in plugins, B2B Suite's own DIC layer, and
the core-vs-storefront domain boundary rule for what may be injected. Come here instead of
grepping `services.xml`/`services.php` directly when you need to decide *where* and *how* to
register or override a service, or when to add a custom Administration service.

Cross-version/lifecycle note: plugin service registration moved from XML (`services.xml`) to
PHP (`services.php`) between 6.6 and 6.7. The 6.7 ADR below documents that plugin XML config
is deprecated in 6.7 and removed in 6.8; the installed 6.7.13.0 codebase still mixes XML and
PHP. Use the 6.7 `services/add-custom-service.md`/`services/dependency-injection.md` pages
for new plugin work; the 6.6 `plugin-fundamentals/add-custom-service.md` page documents the
older XML-based approach still valid for 6.6.

## Plugin & container concepts

- [Plugins](platform/dev/6.6/concepts/extensions/plugins-concept.md) — 6.6: plugins are Symfony bundles extending the Plugin base class, packaged as Composer packages, not usable on Shopware cloud.
- [Plugins](platform/dev/6.7/concepts/extensions/plugins-concept.md) — 6.7 version of the same plugin concept page; near-duplicate of the 6.6 entry above with no substantive DI differences noted.
- [Migrate container configuration from XML to PHP](platform/dev/6.7/resources/references/adr/2026-07-30-migrate-container-configuration-from-xml-to-php.md) — ADR: platform DI/route config moves from XML to PHP; plugin XML config deprecated in 6.7, removed in 6.8.
- [Symfony Dependency Management](platform/dev/6.6/resources/references/adr/2023-05-16-symfony-dependency-management.md) — ADR: Shopware enables Symfony autowiring and PHP-based service configuration, attributes reserved for framework glue code.

## Registering plugin services (6.6, XML)

- [Add custom service](platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-custom-service.md) — register a custom PHP service class via a `services.xml` file in the Symfony DI container.

## Registering plugin services (6.7, PHP)

- [Services](platform/dev/6.7/guides/plugins/plugins/services/_index.md) — index of plugin service guides: registering a custom service, dependency injection, and service decoration.
- [Add Custom Service](platform/dev/6.7/guides/plugins/plugins/services/add-custom-service.md) — register a plugin service in `src/Resources/config/services.php` via `ContainerConfigurator`, autowire/autoconfigure or an explicit `set()` declaration.
- [Dependency Injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) — inject a service (e.g. `SystemConfigService`) into a plugin service via constructor, using autowiring or explicit `args([service(...)])` in `services.php`.
- [Plugin Fundamentals](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/_index.md) — router for plugin basics including services, events, and migrations.
- [Plugin Base Guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md) — roadmap of 6.7 plugin development steps with links to focused guides, scaffolding via `plugin:create`.

## Domain boundaries (Core vs. Storefront)

- [Dependency Injection & Dependency Handling](platform/dev/6.6/resources/guidelines/code/dependency-injection-dependency-handling.md) — 6.6 guideline: Core domain code must not access the PHP session; session data handling belongs in the Storefront domain.
- [Dependency Injection & Dependency Handling](platform/dev/6.7/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md) — 6.7 architecture rule: Core services are stateless and constructor-injected, never use PHP session or request; sessions stay in Storefront.
- [Plugin Architecture](platform/dev/6.7/guides/plugins/plugins/architecture/_index.md) — index of mandatory 6.7 plugin architecture rules covering cart, rule system, page loaders, events and dependency injection.
- [Add translations](platform/dev/6.6/guides/plugins/plugins/storefront/add-translations.md) — Storefront snippet structure and using the injected translator service (`trans` filter/method, `TranslatorInterface`) in Twig, controllers and PHP.

## Administration services (BottleJS)

- [Adding Services](platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-custom-service.md) — register, inject, and decorate a custom Administration service via BottleJS in 6.6.
- [Services and Utilities](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/_index.md) — index of 6.7 Administration guides: registering, injecting, extending services, filters, sanitizer, user feedback.
- [Adding Services](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/add-custom-service.md) — 6.7 version: register with `Shopware.Service().register`, inject via `Shopware.Application.getContainer`, add BottleJS middleware/decorators.
- [Injecting Services](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/injecting-services.md) — how Administration services (BottleJS DI container) are injected into Vue components via the `inject` property, e.g. `repositoryFactory`.

## B2B Suite DI layer

- [Core](platform/dev/6.6/products/extensions/b2b-suite/guides/core/_index.md) — index of B2B Suite Core component features including DI, REST API, CRUD, audit log.
- [Dependency injection](platform/dev/6.6/products/extensions/b2b-suite/guides/core/dependency-injection.md) — B2B Suite initializes its Symfony DIC per component via `DependencyInjectionConfiguration` and `B2BContainerBuilder`.
- [Overloading classes](platform/dev/6.6/products/extensions/b2b-suite/guides/core/overload-classes.md) — override a service id with a parent abstract service instead of using events/hooks (e.g. `b2b_role.repository`).
- [Core](platform/dev/6.7/products/extensions/b2b-suite/guides/core/_index.md) — 6.7 version of the same B2B Suite Core index; near-duplicate of the 6.6 entry.
- [Dependency injection](platform/dev/6.7/products/extensions/b2b-suite/guides/core/dependency-injection.md) — 6.7 version, adds `ContactFrameworkConfiguration`/`registerConfigurations` details to the same DIC mechanism.
- [Overloading classes](platform/dev/6.7/products/extensions/b2b-suite/guides/core/overload-classes.md) — 6.7 version: same override mechanism, documents `*_abstract` and `*_class` parameter forms.
