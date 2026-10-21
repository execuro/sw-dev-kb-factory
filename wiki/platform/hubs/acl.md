---
id: platform/hubs/acl.md
title: "ACL"
summary: "Navigation hub for ACL in Shopware 6.6 and 6.7: Administration privileges, app permissions, B2B Suite entity ACL, and related ADRs."
keywords: ["acl", "privileges", "permissions", "addPrivilegeMappingEntry", "acl.can", "admin roles", "routeMiddleware", "entity acl", "b2b suite", "security", "adr", "app permissions"]
members: ["platform/dev/6.6/concepts/framework/architecture/administration-concept.md", "platform/dev/6.6/guides/plugins/apps/app-base-guide.md", "platform/dev/6.6/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.md", "platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md", "platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/overriding-routes.md", "platform/dev/6.6/products/extensions/b2b-suite/concept/system-architecture.md", "platform/dev/6.6/products/extensions/b2b-suite/guides/example-plugins/_index.md", "platform/dev/6.6/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md", "platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/dev/6.6/resources/references/security.md", "platform/dev/6.7/concepts/framework/architecture/administration-concept.md", "platform/dev/6.7/guides/plugins/plugins/administration/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/_index.md", "platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md", "platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/overriding-routes.md", "platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/extending-services.md", "platform/dev/6.7/products/extensions/b2b-suite-migration/references/role-permission-mapping.md", "platform/dev/6.7/products/extensions/b2b-suite/concept/system-architecture.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/_index.md", "platform/dev/6.7/products/extensions/b2b-suite/guides/core/entity-acl.md", "platform/dev/6.7/products/extensions/subscriptions/guides/b2b-employee-integration.md", "platform/dev/6.7/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md", "platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md", "platform/dev/6.7/resources/references/adr/2026-06-23-dal-write-events-system-scope.md", "platform/dev/6.7/resources/references/security.md"]
lastBuilt: 2026-10-21
---

# ACL

This hub covers access control in Shopware: how Administration ACL privileges are registered and checked (`addPrivilegeMappingEntry`, `acl.can`, `getPrivileges`, `enrichPrivileges`), how routes, menu entries and shortcuts are protected, how apps declare permissions, how the B2B Suite implements entity based ACL, and the ADRs and security references that touch ACL. Come here when a question is about permissions or privileges and you do not yet know which layer (Administration, app, B2B Suite, DAL) is involved. Most pages are per-version copies of the same topic; the 6.6 and 6.7 pairs below are near-duplicates, so pick the version that matches the target installation.

## Dev 6.7

Administration

- [Administration](platform/dev/6.7/concepts/framework/architecture/administration-concept.md) — Vue.js SPA concept, module/page/view/component structure, inheritance, ACL roles.
- [Administration](platform/dev/6.7/guides/plugins/plugins/administration/_index.md) — entry page for extending the Administration from a plugin, including ACL in the workflow.
- [Permissions and Error Handling](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/_index.md) — section overview for custom privileges and API validation error handling.
- [Adding Permissions](platform/dev/6.7/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md) — register privileges, protect routes, menus and shortcuts, extend roles via `enrichPrivileges()`.
- [Override Existing Routes](platform/dev/6.7/guides/plugins/plugins/administration/routing-navigation/overriding-routes.md) — change an existing route, such as its required privilege, via a `routeMiddleware`.
- [Extending Services](platform/dev/6.7/guides/plugins/plugins/administration/services-utilities/extending-services.md) — decorate or add middleware to Administration services with BottleJS.

B2B Suite and extensions

- [System architecture](platform/dev/6.7/products/extensions/b2b-suite/concept/system-architecture.md) — B2B Suite component layers and dependencies, including ACL.
- [Core](platform/dev/6.7/products/extensions/b2b-suite/guides/core/_index.md) — index of B2B Suite Core guides, including entity ACL.
- [Entity based ACL](platform/dev/6.7/products/extensions/b2b-suite/guides/core/entity-acl.md) — `b2b_acl_*` tables, `AclRepository`, query filtering, adding subjects or contexts.
- [Role and Permission Mapping](platform/dev/6.7/products/extensions/b2b-suite-migration/references/role-permission-mapping.md) — B2B Suite to B2B Commercial permission mapping and `B2BMigrationPermissionEvent`.
- [B2B Employee Integration](platform/dev/6.7/products/extensions/subscriptions/guides/b2b-employee-integration.md) — permission-based subscription visibility with Employee Management.

ADRs and security

- [Import ACL privileges from other roles](platform/dev/6.7/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md) — import another role's privileges via `getPrivileges()`.
- [When to use plain SQL or the DAL](platform/dev/6.7/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md) — DAL for API, loaders and writes; plain SQL for indexers and core.
- [Dispatch DAL Write Events in System Scope](platform/dev/6.7/resources/references/adr/2026-06-23-dal-write-events-system-scope.md) — write events dispatch in system scope so listener writes skip API ACL.
- [Security](platform/dev/6.7/resources/references/security.md) — security measures and config: ACL, `ApiAware`, CSP templates, media URL validation.

## Dev 6.6

- [Administration](platform/dev/6.6/concepts/framework/architecture/administration-concept.md) — Administration SPA concept with Admin API access, inheritance and ACL.
- [App Base Guide](platform/dev/6.6/guides/plugins/apps/app-base-guide.md) — app `manifest.xml`, install commands, registration and permissions.
- [Add shortcuts](platform/dev/6.6/guides/plugins/plugins/administration/advanced-configuration/add-shortcuts.md) — keyboard shortcuts on components, optionally gated by ACL.
- [Adding permissions](platform/dev/6.6/guides/plugins/plugins/administration/permissions-error-handling/add-acl-rules.md) — register privileges and check them with the acl service.
- [Override existing routes](platform/dev/6.6/guides/plugins/plugins/administration/routing-navigation/overriding-routes.md) — change a route's required privilege with a `routeMiddleware`.
- [System architecture](platform/dev/6.6/products/extensions/b2b-suite/concept/system-architecture.md) — B2B Suite layered architecture.
- [Example Plugins](platform/dev/6.6/products/extensions/b2b-suite/guides/example-plugins/_index.md) — B2B Suite example plugins, including `B2bAcl`.
- [Import ACL privileges from other roles](platform/dev/6.6/resources/references/adr/2020-08-28-import-acl-privileges-from-other-roles.md) — ADR, same decision as the 6.7 page.
- [When to use plain SQL or the DAL](platform/dev/6.6/resources/references/adr/2021-05-14-when-to-use-plain-sql-or-dal.md) — ADR, same decision as the 6.7 page.
- [Security](platform/dev/6.6/resources/references/security.md) — 6.6 security measures: CSP, XSS, rate limiter, HTML sanitizer, SameSite, ACL.

Only 6.6 lists the App Base Guide and the shortcuts guide here; only 6.7 lists the entity ACL, migration mapping, subscriptions and system-scope ADR pages.
