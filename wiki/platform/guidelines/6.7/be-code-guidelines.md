---
id: platform/guidelines/6.7/be-code-guidelines.md
title: Backend code guidelines
docType: guideline
version: "6.7"
summary: Rules for decoratable services, route naming and scope, ACL, entity definitions, migrations, bounded Criteria, and admin module boundaries in 6.7.
keywords: ["decorator pattern", "getdecorated", "decorationpatternexception", "route scope", "acl", "routing", "entity definition", "field flags", "migration", "criteria", "administration module", "pinia store"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html", hash: "331b8608cb07e3905257afb0e836a27850dd8033dbf7d1784a964504b90920fd"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/routing.html", hash: "78d2a6e2522bb6d2db02289c08e9cbe7ff9e5d067eb7f95cec82c2b465244310"}, {url: "code:administration/Resources/app/administration/technical-docs/02-architecture/**", hash: "72ab710b9cfe380f6d87c4a85091c47cda0ff79d0e94235d590c1720806b2a86"}]
codeVersion: "6.7.13.0+8da531fe"
lastBuilt: 2026-09-15
---

## decoration and dependency injection

- Define an extensible service as an `abstract class AbstractX`, not an interface — new methods can then be added without breaking implementers.
- The abstract class declares `abstract public function getDecorated(): AbstractX;`.
- The core implementation's `getDecorated()` must throw `DecorationPatternException` as its first statement (`throw new DecorationPatternException(self::class);`).
- Never mark a decoratable abstract class `@internal` or `@final`; never mark the concrete base implementation `@internal`.
- A concrete implementation must not expose any public method that the abstract parent does not define (constructor excepted).
- Never let a decoratable implementation implement `EventSubscriberInterface` — extract the subscriber into its own class.
- To decorate: extend `AbstractX`, inject the inner `AbstractX` via the constructor, return it from `getDecorated()`, and delegate to it inside each method.
- When adding a method to an existing abstract class, add it as a concrete (non-abstract) method that delegates to `$this->getDecorated()->method(...)`.
- If a service must wrap its own inner service (cache or logging layer) but third parties should not decorate it, do not add `getDecorated()`; inject the inner service and mark classes `@internal` (private API) or `@final` (callable, not extendable).

Enforced by: PHPStan (`Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\DecorationPatternRule`, identifier `shopware.decorationPattern`)

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html
Read more: platform/dev/6.7/resources/references/adr/2020-11-25-decoration-pattern.md

## routes scope and acl

- Declare the route scope on every controller through route defaults keyed by `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` (`_routeScope`), e.g. `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]`.
- Use the scope ID constants, not string literals: `ApiRouteScope::ID` (`api`), `StoreApiRouteScope::ID` (`store-api`), `StorefrontRouteScope::ID` (`storefront`), `AdministrationRouteScope::ID` (`administration`).
- Prefix every Storefront route name with `frontend.` (e.g. `frontend.account.profile.page`).
- Guard Admin API routes with privileges via `PlatformRequest::ATTRIBUTE_ACL` (`_acl`) in route defaults, e.g. `defaults: [PlatformRequest::ATTRIBUTE_ACL => ['media:read']]`; `AclAnnotationValidator` checks them on request.
- Give every core route an OpenAPI schema under `core/Framework/Api/ApiDefinition/Generator/Schema` (`AdminApi/` or `StoreApi/`).
- Do not add a `Since` annotation to routes — the class the docs name does not exist in 6.7.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/routing.html
Read more: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md

## entity definitions and flags

- Extend `EntityDefinition`; implement `getEntityName()` and `defineFields(): FieldCollection`; override `getEntityClass()`/`getCollectionClass()` when you ship typed entity and collection classes.
- Flag the id field with `PrimaryKey` and `Required`; add `ApiAware` only to fields that must be exposed through Store API; use `WriteProtected` for fields only system code may write and `Runtime` for computed, non-persisted fields.

Read more: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md

## migrations

- Extend `MigrationStep`; implement `getCreationTimestamp(): int` and `update(Connection $connection): void`.
- Keep `update()` to non-destructive changes; put destructive changes (dropping columns or tables) in `updateDestructive(Connection $connection)`.

Read more: platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
Read more: platform/dev/6.7/resources/guidelines/code/core/database-migations.md

## bounded criteria

- Always bound repository reads: call `Criteria::setLimit()` on list reads, and load only what you need with `addAssociation()` / `addFields()` instead of loading full entity graphs.

Read more: platform/dev/6.7/guides/development/integrations-api/search-criteria.md

## administration module boundaries

- Keep admin code in the layers `core/` (framework, Vue-independent), `app/` (Vue layer, init, stores) and `module/` (business domains); dependencies flow `module` to `app` to `core`, never the reverse.
- Register a module with `Shopware.Module.register('<vendor>-<plugin>-<domain>', { type: 'plugin', ... })`; name routes `<module>.<action>` in dot notation and put a `meta.privilege` on routes that need one.
- Never import another module directly; communicate through `Shopware.Service(...)` and `Shopware.Service('repositoryFactory').create('<entity>')`.
- Declare module privileges with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })` using `viewer`/`editor`/`creator`/`deleter` roles.
- Use Pinia stores via `Shopware.Store.register({ id, state, getters, actions })` and `Shopware.Store.get(id)`; mutate state only inside actions; do not store components or non-serializable data.
- Extend components with `Shopware.Component.override` / `Shopware.Component.extend`, registered with a lazy `() => import(...)`.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
Read more: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
Read more: platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md

## Code check (6.7.13.0+8da531fe)

- absent `Shopware\Core\Framework\Routing\Annotation\Since` — not present in this codeVersion
- confirmed `DecorationPatternRule` — PHPStan rule enforcing the decoration rules — core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:31
- confirmed `DecorationPatternException` — thrown by base getDecorated() — core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — core/PlatformRequest.php:77
- confirmed `PlatformRequest::ATTRIBUTE_ACL` — value `_acl` — core/PlatformRequest.php:75
- confirmed `StorefrontRouteScope::ID` — value `storefront` — storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `StoreApiRouteScope::ID` — value `store-api` — core/Framework/Routing/StoreApiRouteScope.php:15
- confirmed `ApiRouteScope::ID` — value `api` — core/Framework/Routing/ApiRouteScope.php:15
- confirmed `AclAnnotationValidator` — reads `_acl` route attribute — core/Framework/Api/Acl/AclAnnotationValidator.php:21
- confirmed `MigrationStep::updateDestructive` — destructive step — core/Framework/Migration/MigrationStep.php:38
- confirmed `Criteria::setLimit` — bounds result size — core/Framework/DataAbstractionLayer/Search/Criteria.php:415
- confirmed `EntityDefinition::defineFields` — abstract field definition — core/Framework/DataAbstractionLayer/EntityDefinition.php:458
- confirmed `addPrivilegeMappingEntry` — admin privilege registration — administration/app/service/privileges.service.ts:257
- confirmed `Store.register` — Pinia store registration — administration/app/store/index.ts:63
