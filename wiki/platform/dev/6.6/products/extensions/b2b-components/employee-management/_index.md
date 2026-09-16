---
id: platform/dev/6.6/products/extensions/b2b-components/employee-management/_index.md
title: Employee Management
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/employee-management/
sourceHash: aba632515de631176f6e9b32f42ea7d11c649cda
keywords: ["employee management", "B2B components", "company customer", "role management", "permissions", "business partner", "employee role", "Storefront API", "Administration API", "B2B employee", "customer management extension", "order approval permission"]
summary: "Introduces Employee Management: company-customer-scoped employee, role and permission management for B2B."
relatedPages: ["platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md", "platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md"]
lastBuilt: "2026-09-15"
---
## What it is

Employee Management is one of the B2B Components. It manages employees, their roles, and their permissions as an extension to Shopware's regular account and customer management, but set into a company context — implemented for both Storefront and Administration and exposed through their respective APIs.

## When to use

Use this page when you need to understand how B2B employees relate to Shopware's core customer model, or when planning custom permissions that restrict or allow specific employee actions such as ordering without approval, or managing roles and employees.

## Key steps / config

- **Basic idea**: employees are associated with a **company customer** and act on behalf of that company, e.g. placing orders. Employees can use addresses defined by administrators of their company. The company customer model lets Shopware inject company-managed data into core processes without building new, parallel employee processes from scratch.
- **Company customer**: a regular storefront customer with a few additional properties. Its customer ID is used to associate employees with a company, so most core order/address implementations are reused as-is, and only a few B2B-specific features (like referencing an employee's actions) are added on top.
- **Role management**: employees are assigned roles that define their permissions and settings, restricting or allowing actions like ordering without approval, or managing roles and employees.

## Essential identifiers

- Company customer — the regular storefront customer entity that employees are associated with via its customer ID.
- Role — the per-employee assignment bundling permissions and settings.

## Version notes

Permissions for Employee Management can be extended either via an app or via a plugin; see the guides on `platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md` and `platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md`.
