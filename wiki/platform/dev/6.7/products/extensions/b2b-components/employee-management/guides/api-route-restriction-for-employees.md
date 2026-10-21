---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/api-route-restriction-for-employees.md
title: API Route Restriction for Employees
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/api-route-restriction-for-employees.html
sourceHash: a95deaf1ab3239d33f5c5af09e5ac9f2e5cf423e
codeCheckedAgainst: "6.7.15.1"
keywords: ["employee_route_access.xml", "EmployeeRouteAccessLoader", "AbstractEmployeeRouteAccessLoader", "B2bRouteBlocker", "denylist", "route restriction", "b2b employee", "store-api.account.change-profile", "store-api.account.change-email", "decoration", "denied routes", "blocked account routes"]
summary: B2B employees are blocked from customer account routes via a denylist in employee_route_access.xml; extend it by decorating EmployeeRouteAccessLoader.
lastBuilt: 2026-10-21
---
## What it is

B2B employees and the business partner share one customer account. To stop employees changing account data/settings outside the B2B permission system (via Storefront and Store API), the B2B Employee Management component blocks most customer account routes with a denylist. Non-account routes remain available to employees.

## When to use

When an employee request to an account route throws an access exception, or when you need to deny additional routes for employees.

## Key steps / config

1. The denylist lives in the employee management config at `Resources\config\employee_route_access.xml`. Routes in `<denied>` are blocked; `<allowed>` entries are only used by internal integration tests (reminder to extend the list when new Store API account routes appear) and do not matter to third-party developers. The root `<routes>` element points `xsi:noNamespaceSchemaLocation` at `../Schema/Xml/employee-route-access-1.0.xsd` (plus the standard XMLSchema-instance `xmlns:xsi` declaration):

```xml
<routes xsi:noNamespaceSchemaLocation="../Schema/Xml/employee-route-access-1.0.xsd">
    <denied>store-api.account.change-profile</denied>
    <denied>store-api.account.change-email</denied>
    <allowed>store-api.account.login</allowed>
    <allowed>store-api.account.logout</allowed>
</routes>
```

2. `Shopware\Commercial\B2b\Domain\RouteAccess\EmployeeRouteAccessLoader::load()` returns an associative array with arrays of all `allowed` and `denied` routes.
3. `Shopware\Commercial\B2b\Subscriber\B2bRouteBlocker` listens to every controller event and validates route access before the request reaches the controller; illegal attempts throw an exception.
4. To add denied routes: create your own `employee_route_access.xml`, then decorate the loader (standard Shopware decoration pattern) and return your config from `load()`:

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

Return only `$customConfig` to replace the original list entirely instead of merging.

## Essential identifiers

- `Resources\config\employee_route_access.xml`, schema `employee-route-access-1.0.xsd`
- `Shopware\Commercial\B2b\Domain\RouteAccess\EmployeeRouteAccessLoader`, `AbstractEmployeeRouteAccessLoader`
- `Shopware\Commercial\B2b\Subscriber\B2bRouteBlocker`
- Route names such as `store-api.account.change-profile`, `store-api.account.change-email`

## Gotchas

- The denylist matches route names (e.g. `store-api.account.change-profile`), not URL paths.
- The source example declares namespace `Shopware\Commercial\B2B\...` (uppercase `B2B`) while the class FQCNs use `B2b`; use the casing of the installed Commercial extension.

## Code check (6.7.15.1)
- unverified `EmployeeRouteAccessLoader::load()` — Shopware Commercial B2B extension, not in core/storefront/administration; out of scope
- unverified `AbstractEmployeeRouteAccessLoader` — Commercial B2B extension; out of scope
- unverified `B2bRouteBlocker` — Commercial B2B extension; out of scope
- unverified `employee_route_access.xml` — Commercial B2B extension config; out of scope
- confirmed `store-api.account.change-profile` — route name of ChangeCustomerProfileRoute — vendor/shopware/core/Checkout/Customer/SalesChannel/ChangeCustomerProfileRoute.php:71
- confirmed `store-api.account.change-email` — route name of ChangeEmailRoute — vendor/shopware/core/Checkout/Customer/SalesChannel/ChangeEmailRoute.php:65
- confirmed `store-api.account.login` — route name of LoginRoute — vendor/shopware/core/Checkout/Customer/SalesChannel/LoginRoute.php:38
- confirmed `store-api.account.logout` — route name of LogoutRoute — vendor/shopware/core/Checkout/Customer/SalesChannel/LogoutRoute.php:47
