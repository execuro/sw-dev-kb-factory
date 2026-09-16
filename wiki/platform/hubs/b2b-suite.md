---
id: platform/hubs/b2b-suite.md
title: "B2B Suite"
summary: "Legacy Shopware 6 B2B Suite: concepts, Core/Storefront/Administration guides, migration to B2B Components, and merchant usage."
keywords: ["b2b suite", "b2b components", "business to business", "line item list", "audit log", "entity acl", "crud service", "assignment service", "storefront authentication", "rest api", "b2b suite migration", "installation", "acl routing", "ajax panel"]
members: ["platform/dev/6.6/products/extensions/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/concept/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/concept/basic-conventions.md", "platform/dev/6.6/products/extensions/b2b-suite/concept/line-item-list.md", "platform/dev/6.6/products/extensions/b2b-suite/concept/method-structure.md", "platform/dev/6.6/products/extensions/b2b-suite/concept/system-architecture.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/administration/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/assignment-service.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/audit-log.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/authentication.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/crud-service.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/currency.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/dependency-injection.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/entity-acl.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/exception.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/listing-service.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/overload-classes.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/rest-api.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/core/store-api.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/example-plugins/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/installation/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/_index.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/acl-routing.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/ajax-panel.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/company.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/complex-views.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/how-to-extend-the-storefront.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/modal-component.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/product-search.md", "platform/dev/6.7/products/extensions/_index.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/_index.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/references/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/concept/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/concept/basic-conventions.md", "platform/dev/6.7/products/extensions/b2b-suite/concept/line-item-list.md", "platform/dev/6.7/products/extensions/b2b-suite/concept/method-structure.md", "platform/dev/6.7/products/extensions/b2b-suite/concept/system-architecture.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/administration/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/assignment-service.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/audit-log.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/authentication.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/crud-service.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/currency.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/dependency-injection.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/entity-acl.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/exception.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/listing-service.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/overload-classes.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/rest-api.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/store-api.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/example-plugins/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/installation/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/acl-routing.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/product-search.md", "platform/func/extensions/b2b-suite-administration.md", "platform/func/extensions/b2b-suite-customer-account.md", "platform/func/migration-en/what-is-migrated.md", "platform/func/settings/Business-Events.md"]
lastBuilt: "2026-09-15"
---

The legacy Shopware 6 B2B Suite is a plugin-based toolset for business-to-business
transactions (companies, debtors, contacts, roles, budgets, order lists, offers) sitting on
top of Core/Administration/Storefront. It is unsupported from Shopware 6.8 onward and is
being replaced by the commercial B2B Components extension; a dedicated migration extension
moves data across. Come here instead of grepping `vendor/` directly when you need the
Suite's own naming conventions, its Symfony DIC/service-override pattern, or one of its
repeated framework patterns (CRUD service, assignment service, listing service, audit log,
entity ACL, storefront authentication, currency) before touching or extending a B2B Suite
plugin, or when you need to know what replaces it and what merchant-facing functionality it
exposed.

## Developer docs — Shopware 6.6

- [Extensions](platform/dev/6.6/products/extensions/_index.md) — index of Shopware's own extensions, including the B2B Suite.
- [B2B Suite](platform/dev/6.6/products/extensions/b2b-suite/_index.md) — entry page: installation, architecture, conventions, example plugins, Core/Administration/Storefront components.

### Concepts
- [Concepts](platform/dev/6.6/products/extensions/b2b-suite/concept/_index.md) — introduces the B2B Suite as a transaction toolset and lists this section's topics.
- [Basic conventions](platform/dev/6.6/products/extensions/b2b-suite/concept/basic-conventions.md) — naming/coding conventions for DI ids, tables, attributes, Twig blocks and TypeScript.
- [Line Item List](platform/dev/6.6/products/extensions/b2b-suite/concept/line-item-list.md) — LineItemList/LineItemReference as the central persistable, audit-logged product list abstraction.
- [Method structure](platform/dev/6.6/products/extensions/b2b-suite/concept/method-structure.md) — which methods (framework domain, @internal, public, TypeScript) are compatibility-guaranteed.
- [System architecture](platform/dev/6.6/products/extensions/b2b-suite/concept/system-architecture.md) — layered architecture: Shop-Bridge, Framework, REST-API, Frontend, B2B plugin layers, and component dependency groups.

### Guides
- [Guides](platform/dev/6.6/products/extensions/b2b-suite/guides/_index.md) — entry point covering installation and the Core/Storefront/Administration components.
- [Administration](platform/dev/6.6/products/extensions/b2b-suite/guides/administration/_index.md) — admin modules follow Shopware's plugin Administration guidelines; merchant usage is separate.
- [Installation](platform/dev/6.6/products/extensions/b2b-suite/guides/installation/_index.md) — Docker (`psh.phar`) on Linux or `mac:*` psh commands on OS X, per-version requirements.
- [Example Plugins](platform/dev/6.6/products/extensions/b2b-suite/guides/example-plugins/_index.md) — sample plugins for ACL, ajax panel, audit log, login, REST API, service/template extension.

Core:
- [Core](platform/dev/6.6/products/extensions/b2b-suite/guides/core/_index.md) — index of Core features: DI, REST API, CRUD, audit log, exceptions, currency, ACL, authentication.
- [Assignment service](platform/dev/6.6/products/extensions/b2b-suite/guides/core/assignment-service.md) — M:N assignment pattern via a repository plus thin service layer.
- [Audit Log](platform/dev/6.6/products/extensions/b2b-suite/guides/core/audit-log.md) — general audit log recording entries with author info, linked to affected entities.
- [Storefront Authentication](platform/dev/6.6/products/extensions/b2b-suite/guides/core/authentication.md) — unified Identity/OwnershipContext for login, ownership and multi-source auth.
- [CRUD service](platform/dev/6.6/products/extensions/b2b-suite/guides/core/crud-service.md) — CrudEntity + repository + ValidationService + AbstractCrudService pattern.
- [Currency](platform/dev/6.6/products/extensions/b2b-suite/guides/core/currency.md) — CurrencyContext/CurrencyService/CurrencyCalculator recalculation in PHP or SQL.
- [Dependency injection](platform/dev/6.6/products/extensions/b2b-suite/guides/core/dependency-injection.md) — per-component Symfony DIC setup via DependencyInjectionConfiguration/B2BContainerBuilder.
- [Entity based ACL](platform/dev/6.6/products/extensions/b2b-suite/guides/core/entity-acl.md) — entity-level M:N ACL tables queried/extended via AclRepository/AclTable/AclContextResolver.
- [Exception](platform/dev/6.6/products/extensions/b2b-suite/guides/core/exception.md) — B2BTranslatableException gives a translated error-controller message.
- [Listing service](platform/dev/6.6/products/extensions/b2b-suite/guides/core/listing-service.md) — SearchStruct + GridRepository + GridHelper listing pattern.
- [Overloading classes](platform/dev/6.6/products/extensions/b2b-suite/guides/core/overload-classes.md) — extend via Symfony DI by overriding a service id with a parent abstract service.
- [REST API](platform/dev/6.6/products/extensions/b2b-suite/guides/core/rest-api.md) — plain PHP controllers with Action-suffixed methods, routes via a tagged RouteProvider.
- [Store API](platform/dev/6.6/products/extensions/b2b-suite/guides/core/store-api.md) — Store API auth headers and how routes drop the Admin API identity segment.

Storefront:
- [Storefront](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/_index.md) — index of Storefront guides: ajax panel, product search, complex views, modal component, company, ACL routing.
- [ACL and Routing](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/acl-routing.md) — maps controller/action to resource+privilege; `b2b_acl` template helper hides blocked links.
- [Ajax Panel](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/ajax-panel.md) — mimics iframes by integrating controller responses via XHR; modal/form-disable/reload/tree-select plugins.
- [Company](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/company.md) — shared context via AclGrantContext; filtering via CompanyFilterStruct/CompanyFilterHelper.
- [Complex views](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/complex-views.md) — root-controller/sub-controller naming scheme with a fixed set of CRUD actions.
- [Extending the Storefront](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/how-to-extend-the-storefront.md) — extend templates from another plugin via a tagged TemplateNamespaceHierarchyBuilder.
- [Modal component](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/modal-component.md) — extend `_modal.html.twig`/`_modal-content.html.twig` via `sw_extends` and `modalSettings` blocks.
- [Product Search](platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/product-search.md) — autocompleting product-search fields; Elasticsearch needs the variants filter enabled.

## Developer docs — Shopware 6.7

The 6.7 concept/guides/core pages are the same architecture and API as 6.6 (near-duplicate
content, kept per-version); 6.7 additionally introduces the migration path and drops the
6.6 Storefront pages for ajax panel, company, complex views and the modal component.

- [Extensions](platform/dev/6.7/products/extensions/_index.md) — overview of Shopware's own extensions, including B2B Suite and B2B Components.
- [B2B Suite Migration](platform/dev/6.7/products/extensions/b2b-suite-migration/_index.md) — moves data from the legacy B2B Suite to B2B Components (Commercial); B2B Suite is unsupported from Shopware 6.8.
- [References](platform/dev/6.7/products/extensions/b2b-suite-migration/references/_index.md) — related documentation and command references for migration tasks.
- [B2B Suite](platform/dev/6.7/products/extensions/b2b-suite/_index.md) — entry page: installation, architecture, conventions, example plugins, Core/Administration/Storefront.
- [Concepts](platform/dev/6.7/products/extensions/b2b-suite/concept/_index.md) — overview of architecture, conventions, method structure and line item list concept pages.
- [Basic conventions](platform/dev/6.7/products/extensions/b2b-suite/concept/basic-conventions.md) — naming conventions for services, tables, attributes, Twig, TypeScript.
- [Line Item List](platform/dev/6.7/products/extensions/b2b-suite/concept/line-item-list.md) — LineItemList/LineItemReference over cart, order and product data.
- [Method structure](platform/dev/6.7/products/extensions/b2b-suite/concept/method-structure.md) — replaceable functions, @internal methods, public API stability, typed TypeScript methods.
- [System architecture](platform/dev/6.7/products/extensions/b2b-suite/concept/system-architecture.md) — component layers and dependency complexes (users, ACL, orders).
- [Guides](platform/dev/6.7/products/extensions/b2b-suite/guides/_index.md) — index of installation plus Core/Storefront/Administration guides.
- [Administration](platform/dev/6.7/products/extensions/b2b-suite/guides/administration/_index.md) — follows standard Shopware Administration plugin guides; usage is in the merchant docs.
- [Installation](platform/dev/6.7/products/extensions/b2b-suite/guides/installation/_index.md) — dev environment via `psh.phar`/`mac:*` commands, `.psh.yaml` DB constants, version requirements.
- [Example Plugins](platform/dev/6.7/products/extensions/b2b-suite/guides/example-plugins/_index.md) — downloadable example plugins (ACL, ajax panel, audit log, login, REST API, service/template extension).

Core:
- [Core](platform/dev/6.7/products/extensions/b2b-suite/guides/core/_index.md) — index of DI, REST API, CRUD, audit log, exceptions, currency, entity ACL, authentication guides.
- [Assignment service](platform/dev/6.7/products/extensions/b2b-suite/guides/core/assignment-service.md) — M:N pattern, e.g. RoleContactRepository/RoleContactAssignmentService.
- [Audit Log](platform/dev/6.7/products/extensions/b2b-suite/guides/core/audit-log.md) — `b2b_audit_log*` tables and `auditLogService` `createAuditLog`/`fetchList`.
- [Storefront Authentication](platform/dev/6.7/products/extensions/b2b-suite/guides/core/authentication.md) — Identity/OwnershipContext, `context_owner_id`/`auth_id` columns, tagged login providers.
- [CRUD service](platform/dev/6.7/products/extensions/b2b-suite/guides/core/crud-service.md) — CrudEntity, DBAL repositories, ValidationService, AbstractCrudService/CrudServiceRequest.
- [Currency](platform/dev/6.7/products/extensions/b2b-suite/guides/core/currency.md) — CurrencyContext via CurrencyService, CurrencyAware entities, CurrencyCalculator in PHP or SQL.
- [Dependency injection](platform/dev/6.7/products/extensions/b2b-suite/guides/core/dependency-injection.md) — abstract DependencyInjectionConfiguration per component, B2BContainerBuilder, service tags.
- [Entity based ACL](platform/dev/6.7/products/extensions/b2b-suite/guides/core/entity-acl.md) — M:N `b2b_acl_*` tables, AclRepository allow/deny/isAllowed, tagged AclTable subjects.
- [Exception](platform/dev/6.7/products/extensions/b2b-suite/guides/core/exception.md) — B2BTranslatableException translated messages via `getTranslationMessage()`.
- [Listing service](platform/dev/6.7/products/extensions/b2b-suite/guides/core/listing-service.md) — SearchStruct, GridRepository (`fetchList`/`fetchTotalCount`), GridHelper grid state.
- [Overloading classes](platform/dev/6.7/products/extensions/b2b-suite/guides/core/overload-classes.md) — override a service id via its `*_abstract` parent or `*_class` parameter.
- [REST API](platform/dev/6.7/products/extensions/b2b-suite/guides/core/rest-api.md) — `*Action` controller methods, routes under `/api/b2b` from tagged RouteProvider services.
- [Store API](platform/dev/6.7/products/extensions/b2b-suite/guides/core/store-api.md) — `sw-context-token`/`sw-access-key` headers, `/api/b2b/...` mapped to `/store-api/b2b/...`.

Storefront:
- [Storefront](platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/_index.md) — overview of the Storefront component (ajax panel, product search, complex views, modal, company, ACL routing, extensibility).
- [ACL and Routing](platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/acl-routing.md) — AclRoutingUpdateService/RoutingIndexer mapping, `b2b_acl` Twig CSS classes.
- [Product Search](platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/product-search.md) — autocompleting product input fields; enable the variants filter with Elasticsearch.

## Merchant docs

- [B2b Suite Administration](platform/func/extensions/b2b-suite-administration.md) — installing the deprecated B2B Suite extension and assigning Debtor/Sales representative roles.
- [B2b Suite Customer Account](platform/func/extensions/b2b-suite-customer-account.md) — storefront-facing debtor account functions: roles, budgets, quotas, order lists, fast orders, offers, order numbers.
- [What Is Migrated](platform/func/migration-en/what-is-migrated.md) — what migrates automatically from Shopware 5 to 6 versus needing manual mapping, including B2B Suite data.
- [Business Events](platform/func/settings/Business-Events.md) — assigns events to email templates with Rule Builder conditions; superseded by Flow Builder, referenced by the B2B-Suite.
</content>
