---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/api-route-restriction-for-employees.md
title: API Route Restriction for Employees
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/api-route-restriction-for-employees.html
sourceHash: a95deaf1ab3239d33f5c5af09e5ac9f2e5cf423e
codeCheckedAgainst: "6.7.13.0"
keywords: ["employee_route_access.xml", "EmployeeRouteAccessLoader", "AbstractEmployeeRouteAccessLoader", "B2bRouteBlocker", "store-api.account.change-profile", "store-api.account.change-email", "denylist", "route restriction", "b2b employee", "decoration", "store api account routes", "blocked routes"]
summary: B2B employees are blocked from customer account routes via a denylist in employee_route_access.xml; extend it by decorating EmployeeRouteAccessLoader.
lastBuilt: 2026-09-15
---
## What it is

B2B employees and their business partner share one customer account. To keep that account consistent, the Employee Management component blocks most customer account routes (Storefront and Store API) for employees using a denylist; all non-account routes stay available.

## When to use

When an employee gets an exception on an account route, when you add new account routes that employees must not use, or when you need to change which routes are denied.

## Key steps / config

1. The denylist lives in the employee management config `Resources\config\employee_route_access.xml` (schema `../Schema/Xml/employee-route-access-1.0.xsd`). Denied route names go in `<denied>` tags; `<allowed>` entries only serve internal integration tests and are irrelevant for third-party developers.

```xml
<routes xsi:noNamespaceSchemaLocation="../Schema/Xml/employee-route-access-1.0.xsd">
    <denied>store-api.account.change-profile</denied>
    <denied>store-api.account.change-email</denied>
    <allowed>store-api.account.login</allowed>
    <allowed>store-api.account.logout</allowed>
</routes>
```

2. `Shopware\Commercial\B2b\Domain\RouteAccess\EmployeeRouteAccessLoader::load()` reads the file and returns an associative array with the `allowed` and `denied` route arrays.
3. `Shopware\Commercial\B2b\Subscriber\B2bRouteBlocker` listens to each controller event, validates route access before the controller runs, and throws an exception on illegal access.
4. To extend: create your own `employee_route_access.xml` with extra `<denied>` routes, then decorate the loader (standard Shopware decoration pattern) and return merged or replacement config:

```php
class DecoratedEmployeeRouteAccessLoader extends AbstractEmployeeRouteAccessLoader
{
    public function __construct(private readonly AbstractEmployeeRouteAccessLoader $decorated) {}
    public function getDecorated(): AbstractEmployeeRouteAccessLoader { return $this->decorated; }
    public function load(): array
    {
        $customConfig = (array) @simplexml_load_file(self::CONFIG);
        return array_merge_recursive($this->decorated->load(), $customConfig);
    }
}
```

Return only `$customConfig` to replace the original list entirely.

## Essential identifiers

- `Resources\config\employee_route_access.xml`
- `Shopware\Commercial\B2b\Domain\RouteAccess\EmployeeRouteAccessLoader` (`load()`)
- `AbstractEmployeeRouteAccessLoader` (`getDecorated()`, `load()`)
- `Shopware\Commercial\B2b\Subscriber\B2bRouteBlocker`
- Route names: `store-api.account.change-profile`, `store-api.account.change-email`, `store-api.account.login`, `store-api.account.logout`

## Gotchas

- The source writes the namespace as `Shopware\Commercial\B2b\...` in prose but `Shopware\Commercial\B2B\Domain\RouteAccess` in the example; PHP namespaces are case-insensitive, but match the actual package for autoloading of your own classes.
- The design is a denylist, not a replication of customer features for employees - new account routes are not blocked until added to `<denied>`.

## Code check (6.7.13.0)
- confirmed `store-api.account.change-profile` — core Store API route name exists — vendor/shopware/core/Checkout/Customer/SalesChannel/ChangeCustomerProfileRoute.php:69
- confirmed `store-api.account.change-email` — core Store API route name exists — vendor/shopware/core/Checkout/Customer/SalesChannel/ChangeEmailRoute.php:65
- confirmed `store-api.account.login` — core Store API route name exists — vendor/shopware/core/Checkout/Customer/SalesChannel/LoginRoute.php:38
- confirmed `store-api.account.logout` — core Store API route name exists — vendor/shopware/core/Checkout/Customer/SalesChannel/LogoutRoute.php:47
- unverified `EmployeeRouteAccessLoader` — Shopware Commercial B2B class, not in the installed vendor/shopware roots
- unverified `AbstractEmployeeRouteAccessLoader` — Shopware Commercial B2B class, out of scope; required members taken from the docs
- unverified `B2bRouteBlocker` — Shopware Commercial B2B subscriber, out of scope
- unverified `employee_route_access.xml` — Shopware Commercial B2B config file, out of scope
