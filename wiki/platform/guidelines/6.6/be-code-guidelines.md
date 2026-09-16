---
id: platform/guidelines/6.6/be-code-guidelines.md
title: Backend code guidelines
docType: guideline
version: "6.6"
summary: Shopware 6.6 backend rules for decoration via abstract classes, entity definitions, migrations, route naming and scope, ACL and bounded Criteria.
keywords: ["decorator pattern", "getdecorated", "abstract class", "dependency injection", "entity definition", "field flags", "migration", "routing", "route scope", "acl", "criteria", "store-api", "phpstan"]
sources: [{url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/decorator-pattern.html", hash: "331b8608cb07e3905257afb0e836a27850dd8033dbf7d1784a964504b90920fd"}, {url: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/routing.html", hash: "78d2a6e2522bb6d2db02289c08e9cbe7ff9e5d067eb7f95cec82c2b465244310"}]
codeVersion: "6.6.10.24+87965325"
lastBuilt: 2026-09-15
---

## decoration pattern

- Define a service that others may decorate as an **abstract class**, not an interface: new methods can then be added without breaking existing implementations.
- Give the abstract class `abstract public function getDecorated(): AbstractX;`.
- In the core (base) implementation, make `getDecorated()` throw `new DecorationPatternException(self::class)` as its first statement (see `ProductDetailRoute::getDecorated()`).
- Never mark a decoratable abstract class `@internal` or `@final`.
- Never add public methods to an implementation that the abstract parent does not define (constructor excepted).
- Never let an implementation of a decoratable abstract class implement `EventSubscriberInterface`; extract the subscriber into its own class.
- When adding a method to an existing abstract class later, add it as a **concrete** method that delegates: `return $this->getDecorated()->create($context);` — never as a new abstract method.
- In a plugin decorator, extend the abstract class, inject the inner `AbstractX` via the constructor, return it from `getDecorated()` and call it from each method.

Enforced by: PHPStan (`Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\DecorationPatternRule`, error identifier `shopware.decorationPattern`)

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/decorator-pattern.html
Read more: platform/dev/6.6/resources/references/adr/2020-11-25-decoration-pattern.md
Read more: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/adjusting-service.md

## non-extensible wrappers

- To add a cache or logging layer that others must not decorate, do not add `getDecorated()`; inject the inner service and delegate to it.
- Mark such classes `@internal` when they are private API, or `@final` when others may call but not extend them.

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/core/decorator-pattern.html

## entity definitions

- Extend `EntityDefinition`; implement `getEntityName()` and `defineFields(): FieldCollection`, and override `getEntityClass()`/`getCollectionClass()` when you ship typed entity and collection classes.
- Flag fields explicitly: `PrimaryKey` and `Required` on the id, `Required` on mandatory columns, `ApiAware` only on fields that must be exposed through the API.
- Keep the definition, the database schema (migration) and the entity class in sync; the DAL does not create tables.

Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md
Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/entities-via-attributes.md

## migrations

- Extend `MigrationStep`; implement `getCreationTimestamp(): int` and `update(Connection $connection): void`.
- Return a creation timestamp between 1 and 2147483647 from `getCreationTimestamp()`; `getPlausibleCreationTimestamp()` triggers a deprecation (an exception with `v6.7.0.0` active) otherwise.
- Put only non-destructive, backward-compatible changes in `update()`; put column/table drops in `updateDestructive()`.
- Use the helpers `dropTableIfExists()`, `dropColumnIfExists()`, `dropForeignKeyIfExists()`, `dropIndexIfExists()`, `indexExists()` to keep steps re-runnable.
- Use `addAdditionalPrivileges()` to extend existing `acl_role` privileges when a new permission is introduced.

Read more: platform/dev/6.6/concepts/framework/migrations.md
Read more: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/database-migrations.md

## routing

- Prefix every Storefront route name with `frontend` (e.g. `frontend.account.profile.page`); Store API routes use `store-api.` names and `/store-api/` paths.
- Declare the route scope on the controller class via `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StoreApiRouteScope::ID]])]` (`_routeScope`); scope ids are `api` (`ApiRouteScope::ID`), `store-api` (`StoreApiRouteScope::ID`) and `storefront` (`StorefrontRouteScope::ID`).
- Use `PlatformRequest` constants for route defaults instead of string keys where possible: `ATTRIBUTE_LOGIN_REQUIRED` (`_loginRequired`), `ATTRIBUTE_ENTITY` (`_entity`), `ATTRIBUTE_HTTP_CACHE` (`_httpCache`).
- Define an OpenAPI schema for every core route under `src/Core/Framework/Api/ApiDefinition/Generator/Schema` (`AdminApi`/`StoreApi`); bundles ship theirs under `Resources/Schema/AdminApi` or `Resources/Schema/StoreApi`, which `BundleSchemaPathCollection` picks up.
- Do not add a `Since` route annotation: the docs require one, but no such class exists in 6.6 (the DAL field flag `Since` is unrelated).

Enforced by: review

Read more: https://developer.shopware.com/docs/v6.6/resources/guidelines/code/routing.html
Read more: platform/dev/6.6/resources/references/adr/2022-02-09-controller-configuration-route-defaults.md
Read more: platform/dev/6.6/guides/plugins/plugins/framework/store-api/add-store-api-route.md

## acl

- Protect Admin API routes with `_acl` privileges in the route defaults (`PlatformRequest::ATTRIBUTE_ACL`), e.g. `defaults: ['_acl' => ['api_service_toggle']]`.
- `AclAnnotationValidator` checks each listed privilege with `$context->isAllowed()` on controller dispatch; do not re-implement that check in the action.

Read more: platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md

## bounded criteria

- Always call `Criteria::setLimit()` when a result set can grow; never load an unbounded entity list.
- Keep `setTotalCountMode()` at `Criteria::TOTAL_COUNT_MODE_NONE` (default) unless the total is displayed; use `TOTAL_COUNT_MODE_EXACT` or `TOTAL_COUNT_MODE_NEXT_PAGES` only for pagination.
- Add only the associations you read (`addAssociation()`).
- Request limits from API clients are capped by `shopware.api.max_limit` (500) and `shopware.api.store.max_limit` (100).

Read more: platform/dev/6.6/guides/plugins/plugins/framework/data-handling/reading-data.md
Read more: platform/dev/6.6/guides/integrations-api/general-concepts/search-criteria.md

## Code check (6.6.10.24+87965325)

- absent `Shopware\Core\Framework\Routing\Annotation\Since` — not present in this codeVersion
- confirmed `DecorationPatternRule` — PHPStan rule enforcing the decoration rules — core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:32
- confirmed `DecorationPatternException` — thrown by base getDecorated() — core/Framework/Plugin/Exception/DecorationPatternException.php:10
- confirmed `getDecorated` — base implementation throws — core/Content/Product/SalesChannel/Detail/ProductDetailRoute.php:74
- confirmed `MigrationStep` — abstract migration base — core/Framework/Migration/MigrationStep.php:15
- confirmed `updateDestructive` — optional destructive step — core/Framework/Migration/MigrationStep.php:36
- confirmed `EntityDefinition` — abstract entity definition base — core/Framework/DataAbstractionLayer/EntityDefinition.php:32
- confirmed `ApiAware` — field flag — core/Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:11
- confirmed `ATTRIBUTE_ROUTE_SCOPE` — `_routeScope` — core/PlatformRequest.php:47
- confirmed `ATTRIBUTE_ACL` — `_acl` — core/PlatformRequest.php:45
- confirmed `AclAnnotationValidator` — validates `_acl` privileges — core/Framework/Api/Acl/AclAnnotationValidator.php:21
- confirmed `StorefrontRouteScope::ID` — `storefront` — storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `setLimit` — Criteria limit — core/Framework/DataAbstractionLayer/Search/Criteria.php:445
- confirmed `max_limit` — Admin API cap 500 — core/Framework/Resources/config/packages/shopware.yaml:182
