---
id: platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/api-route-restriction-for-employees.md
title: API Route Restriction for Employees
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/employee-management/guides/api-route-restriction-for-employees.html
sourceHash: a95deaf1ab3239d33f5c5af09e5ac9f2e5cf423e
keywords: ["employee_route_access.xml", "EmployeeRouteAccessLoader", "B2bRouteBlocker", "denylist", "route restriction", "B2B employee", "store-api.account", "decoration pattern", "AbstractEmployeeRouteAccessLoader", "customer account routes", "API route restriction", "Commercial B2B"]
summary: "Explains the denylist pattern (employee_route_access.xml) restricting customer account routes for B2B employees."
lastBuilt: "2026-09-15"
---
## What it is

B2B employees and business partners share the same underlying customer account, which could otherwise let employees change account settings and data unrelated to the B2B permission system, through both Storefront and Store API. To prevent that, Employee Management restricts most customer-account routes with a denylist pattern instead of replicating all customer features for employee accounts; all non-account-related routes remain available to B2B employees.

## When to use

Read this page when you need to know which Store API/Storefront customer-account routes are blocked for B2B employees by default, or when you need to add further denied routes or replace the denylist entirely from your own plugin.

## Key steps / config

- The denylist lives in the employee management config at `Resources\config\employee_route_access.xml`. Denied routes are listed inside `<denied>` tags; routes inside `<allowed>` tags are only used for internal integration tests reminding developers to extend the list when new Store API account routes are added — they are not meaningful for third-party developers.

```xml
<?xml version="1.0" encoding="utf-8"?>
<routes xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../Schema/Xml/employee-route-access-1.0.xsd">
    <denied>store-api.account.change-profile</denied>
    <denied>store-api.account.change-email</denied>
    <allowed>store-api.account.login</allowed>
    <allowed>store-api.account.logout</allowed>
</routes>
```

- The denylist is loaded by the `load` function of the `Shopware\Commercial\B2b\Domain\RouteAccess\EmployeeRouteAccessLoader` class, returning an associative array of `allowed` and `denied` route arrays.
- It is applied in `Shopware\Commercial\B2b\Subscriber\B2bRouteBlocker`, which listens to each controller event and validates route access before the request reaches the controller; illegal attempts throw an exception.
- To override it: add a new `employee_route_access.xml` with extra denied routes, then decorate `Shopware\Commercial\B2b\Domain\RouteAccess\EmployeeRouteAccessLoader` (it extends `AbstractEmployeeRouteAccessLoader`, following the standard Shopware decoration pattern) and merge or replace the decorated loader's result in your own `load()` override.

## Essential identifiers

- `Resources\config\employee_route_access.xml` — the denylist config file.
- `Shopware\Commercial\B2b\Domain\RouteAccess\EmployeeRouteAccessLoader` / `AbstractEmployeeRouteAccessLoader` — the loader class and its abstract base, decorated to override the denylist.
- `Shopware\Commercial\B2b\Subscriber\B2bRouteBlocker` — the subscriber enforcing the denylist on controller events.
- `<denied>` / `<allowed>` — the XML tags naming blocked and (internally test-only) permitted routes.
