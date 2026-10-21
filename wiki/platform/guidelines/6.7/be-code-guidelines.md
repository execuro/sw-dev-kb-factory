---
id: platform/guidelines/6.7/be-code-guidelines.md
title: Backend code guidelines
docType: guideline
version: "6.7"
summary: Rules for decoratable services, Store API extension events, route naming, scope and ACL, entity flags, migrations, bounded Criteria and admin modules in 6.7.
keywords: ["decorator pattern", "getdecorated", "decorationpatternexception", "extension dispatcher", "route scope", "acl", "routing", "entity definition", "field flags", "migration", "criteria", "administration module", "pinia store"]
sources: [{url: "https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html", hash: "607e29339593bddc0352398d1727973b75d007f580dbd9b9f5f128fd9c60afd5"}, {url: "https://developer.shopware.com/docs/resources/guidelines/code/routing.html", hash: "78d2a6e2522bb6d2db02289c08e9cbe7ff9e5d067eb7f95cec82c2b465244310"}, {url: "code:administration/Resources/app/administration/technical-docs/02-architecture/**", hash: "72ab710b9cfe380f6d87c4a85091c47cda0ff79d0e94235d590c1720806b2a86"}]
codeVersion: "6.7.15.1+7d4303db"
lastBuilt: 2026-10-21
---

## decoration and dependency injection

- Define an extensible service as an `abstract class AbstractX`, not an interface, so methods can be added without breaking implementers.
- The abstract class declares `abstract public function getDecorated(): AbstractX;`.
- The core implementation's `getDecorated()` must start with `throw new DecorationPatternException(self::class);` — the PHPStan rule identifies the base implementation by that leading `throw`.
- Never mark a decoratable abstract class `@internal` or `@final`; never mark its base implementation `@internal`.
- An implementation must not expose public methods the abstract parent does not define (constructor excepted).
- Never let a decoratable implementation implement `EventSubscriberInterface` — move the subscriber to its own class.
- To decorate: extend `AbstractX`, inject the inner `AbstractX`, return it from `getDecorated()`, delegate to it in each method.
- Add new methods to an existing abstract class as concrete methods delegating to `$this->getDecorated()->method(...)`.
- For a private cache/logging wrapper that third parties should not decorate, omit `getDecorated()`, inject the inner service and mark classes `@internal` (private API) or `@final` (callable, not extendable).

Enforced by: PHPStan (`Shopware\Core\DevOps\StaticAnalyze\PHPStan\Rules\DecorationPatternRule`, identifier `shopware.decorationPattern`)

Read more: https://developer.shopware.com/docs/resources/guidelines/code/core/decorator-pattern.html
Read more: platform/dev/6.7/resources/references/adr/2020-11-25-decoration-pattern.md

## store api route extension

- Do not add an abstract route class with `getDecorated()` for a new Store API route; use the extension event system.
- Inject `Shopware\Core\Framework\Extensions\ExtensionDispatcher`, move the body to a private method and call it through `ExtensionDispatcher::publish()` with a `final` subclass of `Shopware\Core\Framework\Extensions\Extension` holding the inputs as `public readonly` properties and a stable `NAME` constant.
- Name those properties exactly like the private method's parameters — `publish()` passes them as named arguments.
- To customize such a route, subscribe to `onPre()` (mutate inputs, or set `$extension->result` and call `stopPropagation()` to skip the body), `onPost()` (change the result) or `onError()` (set a fallback result, else the exception is rethrown).
- Keep decorating abstract routes that publish no extension event (e.g. `ProductSearchRoute::load()` in 6.7); abstract route classes stay supported.
- Never copy a `#[Route]` attribute into a decorator.

Enforced by: PHPStan (`NoRouteOverrideInDecoratorsRule`)

Read more: platform/dev/6.7/resources/references/adr/2026-09-24-replace-abstract-route-classes-with-extension-events.md

## routes scope and acl

- Declare the scope on every controller via route defaults keyed by `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` (`_routeScope`), e.g. `#[Route(defaults: [PlatformRequest::ATTRIBUTE_ROUTE_SCOPE => [StorefrontRouteScope::ID]])]`.
- Use the constants, not literals: `ApiRouteScope::ID` (`api`), `StoreApiRouteScope::ID` (`store-api`), `StorefrontRouteScope::ID` (`storefront`).
- Prefix every Storefront route name with `frontend.` (e.g. `frontend.account.profile.page`).
- Guard Admin API routes with `PlatformRequest::ATTRIBUTE_ACL` (`_acl`) in route defaults, e.g. `defaults: [PlatformRequest::ATTRIBUTE_ACL => ['media:read']]`; `AclAnnotationValidator` checks them per request.
- Give every core route an OpenAPI schema under `core/Framework/Api/ApiDefinition/Generator/Schema` (`AdminApi/` or `StoreApi/`); a bundle ships its own under `Resources/Schema/AdminApi` or `Resources/Schema/StoreApi` (read by `BundleSchemaPathCollection`).
- Do not add a `Since` annotation to routes — the class the routing guideline names does not exist in 6.7.

Read more: https://developer.shopware.com/docs/resources/guidelines/code/routing.html
Read more: platform/dev/6.7/guides/plugins/plugins/storefront/controllers/add-custom-controller.md

## entity definitions and flags

- Extend `EntityDefinition`; implement `getEntityName()` and `defineFields(): FieldCollection`; override `getEntityClass()`/`getCollectionClass()` when shipping typed entity and collection classes.
- Flag the id field with `PrimaryKey` and `Required`.
- `ApiAware` without arguments exposes a field to Admin API and Store API; pass sources (e.g. `AdminApiSource::class`) to restrict it.
- Use `WriteProtected` with allowed scopes (e.g. `Context::SYSTEM_SCOPE`) for system-written fields and `Runtime` for computed, non-persisted fields.

Read more: platform/dev/6.7/guides/plugins/plugins/framework/data-handling/add-custom-complex-data.md

## migrations

- Extend `MigrationStep`; implement `getCreationTimestamp(): int` and `update(Connection $connection): void`.
- Keep `update()` non-destructive; put drops of columns or tables in `updateDestructive(Connection $connection)`.

Read more: platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md
Read more: platform/dev/6.7/resources/guidelines/code/core/database-migations.md

## bounded criteria

- Bound every repository list read with `Criteria::setLimit()`, and load only what you need with `addAssociation()` / `addFields()` instead of full entity graphs.

Read more: platform/dev/6.7/guides/development/integrations-api/search-criteria.md

## administration module boundaries

- Keep admin code in `core/` (Vue-independent framework), `app/` (Vue layer, init, stores) and `module/` (business domains); dependencies flow `module` to `app` to `core`, never back.
- Register a module with `Shopware.Module.register('<vendor>-<plugin>-<domain>', { type: 'plugin', ... })`; name routes in dot notation and set `meta.privilege` where needed.
- Never import another module directly; use `Shopware.Service(...)` and `Shopware.Service('repositoryFactory').create('<entity>')`.
- Declare privileges with `Shopware.Service('privileges').addPrivilegeMappingEntry({ category, parent, key, roles })` using `viewer`/`editor`/`creator`/`deleter` roles.
- Use Pinia stores via `Shopware.Store.register({ id, state, getters, actions })` and `Shopware.Store.get(id)`; mutate state only in actions; never store components or non-serializable data.
- Extend components with `Shopware.Component.override` / `Shopware.Component.extend` and a lazy `() => import(...)`.

Read more: platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-module.md
Read more: platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md
Read more: platform/dev/6.7/guides/upgrades-migrations/administration/pinia.md

## Code check (6.7.15.1+7d4303db)

- absent `Shopware\Core\Framework\Routing\Annotation\Since` — not present in this codeVersion
- confirmed `DecorationPatternRule` — PHPStan rule enforcing the decoration pattern — core/DevOps/StaticAnalyze/PHPStan/Rules/DecorationPatternRule.php:35
- confirmed `DecorationPatternException` — thrown by base getDecorated() — core/Framework/Plugin/Exception/DecorationPatternException.php:13
- confirmed `ExtensionDispatcher::publish` — wraps a route body in pre/post/error events — core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `NoRouteOverrideInDecoratorsRule` — PHPStan rule class — core/DevOps/StaticAnalyze/PHPStan/Rules/NoRouteOverrideInDecoratorsRule.php:22
- confirmed `PlatformRequest::ATTRIBUTE_ROUTE_SCOPE` — value `_routeScope` — core/PlatformRequest.php:78
- confirmed `PlatformRequest::ATTRIBUTE_ACL` — value `_acl` — core/PlatformRequest.php:76
- confirmed `StorefrontRouteScope::ID` — value `storefront` — storefront/Framework/Routing/StorefrontRouteScope.php:14
- confirmed `AclAnnotationValidator` — reads `_acl` route attribute per request — core/Framework/Api/Acl/AclAnnotationValidator.php:21
- confirmed `ApiAware` — no-arg constructor allows both API base URLs — core/Framework/DataAbstractionLayer/Field/Flag/ApiAware.php:11
- confirmed `MigrationStep::updateDestructive` — destructive step — core/Framework/Migration/MigrationStep.php:38
- confirmed `Criteria::setLimit` — bounds result size — core/Framework/DataAbstractionLayer/Search/Criteria.php:427
- confirmed `addPrivilegeMappingEntry` — admin privilege registration — administration/app/service/privileges.service.ts:236
- confirmed `Store.register` — Pinia store registration — administration/app/store/index.ts:63
