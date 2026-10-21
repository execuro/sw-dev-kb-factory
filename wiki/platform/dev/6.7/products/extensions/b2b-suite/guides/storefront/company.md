---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/company.md
title: Company
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/company.html
sourceHash: 1cc64eed411fb66c9ecdc9c90cbc1a2dc1a48f2c
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "company component", "AclGrantContext", "grantContext", "CompanyFilterStruct", "CompanyFilterHelper", "SearchStruct", "companyFilterType", "aclGrantContext", "company filter", "role assignment", "acl inheritance"]
summary: B2B Suite company component - AclGrantContext shared context, grantContext on entity creation, CompanyFilterStruct filter types acl/assignment/inheritance.
lastBuilt: 2026-10-21
---
## What it is

The company component of the B2B Suite storefront is a container for role-related entities. It gives the managed components (the role-bound child components shown in the source's component graph) a minimal shared interface so they share functionality, and it supplies the context objects that carry each component's specific information.

## When to use

Use this page when you build or extend a B2B Suite storefront component whose entities are created, assigned or filtered per company role — for example, when you need to know which parameter assigns a new entity to a role, or which filter type restricts a company listing.

## Key steps / config

1. **Context instead of roles.** Entity creation and update share one context via the `AclGrantContext` concept. Components depend on this company context, not on roles directly.
2. **Create an entity.** When creating an entity managed in the company component, pass the request parameter `grantContext` with the identifier of an `AclGrantContext`. The new entity is automatically assigned to that role.
3. **Filter and search.** The company module filters and searches entities with `CompanyFilterStruct`, which extends `SearchStruct` with two properties: `companyFilterType` and `aclGrantContext`. Apply the correct filter type through `CompanyFilterHelper`.

Filter types:

| Filter name | What it applies |
|---|---|
| `acl` | Only entities visible to this `grantContext` |
| `assignment` | Only entities assigned to this `grantContext` |
| `inheritance` | Only entities visible to this or an inherited `grantContext` |

## Essential identifiers

- `AclGrantContext` — shared company/role context for entity creation and update
- `grantContext` — request parameter carrying the `AclGrantContext` identifier on create
- `CompanyFilterStruct` — extends `SearchStruct`; adds `companyFilterType`, `aclGrantContext`
- `CompanyFilterHelper` — applies the filter type
- Filter types: `acl`, `assignment`, `inheritance`

## Gotchas

- The difference between `acl` and `assignment` matters: `acl` returns everything the grant context can see, `assignment` only what is directly assigned to it; `inheritance` additionally includes entities visible through inherited grant contexts.
- All identifiers here belong to the B2B Suite plugin (`SwagB2bPlatform`), not to Shopware core; they cannot be checked against the core checkout.

## Code check (6.7.15.1)
- unverified `AclGrantContext` — B2B Suite plugin class, not part of the core/storefront/administration checkout
- unverified `CompanyFilterStruct` — B2B Suite plugin class, not in the checked roots
- unverified `CompanyFilterHelper` — B2B Suite plugin class, not in the checked roots
- unverified `SearchStruct` — the B2B Suite struct it extends is plugin code, not in the checked roots
- unverified `grantContext` — B2B Suite request parameter, out of scope
- confirmed `SwagB2bPlatform` — the B2B Suite is a separate plugin listed among translatable plugins — vendor/shopware/core/System/Resources/translation.yaml:9
