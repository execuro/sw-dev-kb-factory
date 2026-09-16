---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/storefront/company.md
title: Company
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/storefront/company.html
sourceHash: a9f050c53bfe45e2cae9600fb44b77ff987d9ad1
keywords: ["Company component", "AclGrantContext", "CompanyFilterStruct", "CompanyFilterHelper", "SearchStruct", "grantContext", "companyFilterType", "aclGrantContext", "acl filter", "assignment filter", "inheritance filter", "b2b-suite", "role entities"]
summary: Company component entities share context via AclGrantContext; CompanyFilterStruct/CompanyFilterHelper filter by acl, assignment, or inheritance.
lastBuilt: 2026-09-15
---
## What it is

Documents the Company component of the B2B Suite storefront, which acts as a container for role-related entities and provides a minimalistic interface shared across the different components managed within it.

## When to use

Use this when creating, updating, or filtering entities that are scoped to a company role — anything that needs to know which grant context (role) it belongs to, or needs to search entities visible or assigned to a particular role.

## Key steps / config

Entity creation and update share a context via the `AclGrantContext` concept, so components depend on the company context rather than on roles directly.

To create a new entity managed by the company component, pass the parameter `grantContext` with an identifier of an `AclGrantContext`; the newly created entity is automatically assigned to the passed role.

Filtering and searching entities within the company module is done through `CompanyFilterStruct`, which extends `SearchStruct` with two extra properties: `companyFilterType` and `aclGrantContext`. The correct filter type is applied via `CompanyFilterHelper`. Possible filter types:

| Filter name | What it applies |
|---|---|
| `acl` | Shows only entities which are visible to this `grantContext` |
| `assignment` | Shows only entities assigned to this `grantContext` |
| `inheritance` | Shows only entities which are visible to this or inherited `grantContext`s |

## Essential identifiers

- `AclGrantContext`
- `CompanyFilterStruct`
- `CompanyFilterHelper`
- `SearchStruct`
- Parameter: `grantContext`
- Properties: `companyFilterType`, `aclGrantContext`
- Filter type values: `acl`, `assignment`, `inheritance`

## Gotchas

Choosing the wrong `companyFilterType` changes which entities a search returns: `acl` is about visibility, `assignment` is about direct ownership by the grant context, and `inheritance` additionally includes entities visible through inherited grant contexts — these are not interchangeable.
