---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/company.md
title: Company
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/company.html
sourceHash: 1cc64eed411fb66c9ecdc9c90cbc1a2dc1a48f2c
codeCheckedAgainst: "6.7.13.0"
keywords: ["AclGrantContext", "grantContext", "CompanyFilterStruct", "CompanyFilterHelper", "SearchStruct", "companyFilterType", "aclGrantContext", "company component", "b2b suite company", "acl filter", "role assignment", "inheritance filter"]
summary: B2B Suite company component - AclGrantContext as shared context, grantContext on entity create, CompanyFilterStruct filter types acl/assignment/inheritance.
lastBuilt: 2026-09-15
---
## What it is

The B2B Suite company component is a container for role-related entities. It gives the managed child components a minimal shared interface, so they depend on a company context rather than on roles directly.

## When to use

When creating, assigning or listing entities managed inside the B2B Suite company module (storefront), and you need to scope them to a role/grant context or filter them by visibility.

## Key steps / config

1. Context: entity creation and update share a context via the `AclGrantContext` concept; components depend on this company context, not on roles.
2. Create an entity: pass the parameter `grantContext` with the identifier of an `AclGrantContext`. The new entity is automatically assigned to the passed role.
3. Filter/search: use `CompanyFilterStruct`, which extends `SearchStruct` with `companyFilterType` and `aclGrantContext`. Apply the correct filter type with `CompanyFilterHelper`.

| Filter type | Applies |
|---|---|
| `acl` | only entities visible to this `grantContext` |
| `assignment` | only entities assigned to this `grantContext` |
| `inheritance` | entities visible to this or inherited `grantContext`s |

## Essential identifiers

- `AclGrantContext`
- `grantContext` (request parameter)
- `CompanyFilterStruct` (extends `SearchStruct`; fields `companyFilterType`, `aclGrantContext`)
- `CompanyFilterHelper`
- Filter types: `acl`, `assignment`, `inheritance`

## Code check (6.7.13.0)
- unverified `AclGrantContext` — B2B Suite class; the B2B Suite plugin is not part of the installed core/storefront/administration packages
- unverified `CompanyFilterStruct` — B2B Suite class, not installed
- unverified `CompanyFilterHelper` — B2B Suite class, not installed
- unverified `SearchStruct` — B2B Suite base struct, not installed
- unverified `grantContext` — B2B Suite request parameter, not installed
