---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/overload-classes.md
title: Overloading classes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/overload-classes.html
sourceHash: bcac67b40c4450d6cef0303a7fe122b639549934
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "overload classes", "dependency injection", "parent services", "services.php", "b2b_role.repository", "b2b_role.repository_abstract", "b2b_role.repository_class", "RoleRepository", "service override", "b2b_acl.table", "extend service"]
summary: "Overriding B2B Suite services via DI: redefine a service id such as b2b_role.repository with the *_abstract parent, or change the *_class parameter."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
---
## What it is

The B2B Suite uses [dependency injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) instead of events and hooks as its extension system. Existing classes are overloaded by redefining their service id or changing a class parameter, based on Symfony parent (abstract) services.

## When to use

When you need to change or add behaviour to a B2B Suite class (e.g. a repository) from your own plugin.

## Key steps / config

In the release package, each service has a class parameter, an abstract parent holding the arguments, and the concrete service using the parent (file `<plugin root>/src/Resources/config/services.php`):

```php
$parameters->set('b2b_role.repository_class', RoleRepository::class);
$services->set('b2b_role.repository_abstract')
    ->abstract(true)
    ->args([service('dbal_connection'), service('b2b_common.repository_dbal_helper')]);
$services->set('b2b_role.repository', '%b2b_role.repository_class%')
    ->parent('b2b_role.repository_abstract');
```

The development (GitHub) variant wires services directly without parents (e.g. `b2b_role.grid_helper`, `b2b_role.crud_service`, `b2b_role.validation_service`, `b2b_role.acl_route_table` tagged `b2b_acl.table`); release files are generated automatically.

To overload, either change the `*_class` parameter or redefine the service id with the abstract parent and append your own arguments:

```php
$services->set('b2b_role.repository', YourClass::class)
    ->parent('b2b_role.repository_abstract')
    ->args([service(YourClass::class)]);
```

Your class extends the B2B class, pops its extra arguments from `func_get_args()` and forwards the rest to the parent constructor, then overrides the methods it needs:

```php
class YourRoleRepository extends RoleRepository
{
    public function __construct()
    {
        $args = func_get_args();
        $this->myService = array_pop($args);
        parent::__construct(... $args);
    }
    public function updateRole(RoleEntity $role): RoleEntity { /* ... */ }
}
```

## Essential identifiers

- `Shopware\B2B\Role\Framework\RoleRepository`
- Service ids `b2b_role.repository`, `b2b_role.repository_abstract`
- Parameter `b2b_role.repository_class`
- `Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator`

## Gotchas

- Plugin load order is unknown, so it cannot be determined which overload wins; overload each class only once.
- The approach lets the B2B Suite add or remove constructor arguments without breaking plugins, which is why arguments are forwarded via `func_get_args()`.

## Code check (6.7.13.0)
- unverified `Shopware\B2B\Role\Framework\RoleRepository` — B2B Suite package not installed; not in vendor/shopware core/storefront/administration
- unverified `b2b_role.repository_abstract` — service defined by the B2B Suite, not installed
- unverified `b2b_role.repository_class` — parameter defined by the B2B Suite, not installed
- unverified `dbal_connection` — service id not found in vendor/shopware/core
- unverified `ContainerConfigurator` — vendor/symfony, out of scope
