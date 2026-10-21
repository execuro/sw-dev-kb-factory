---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/overload-classes.md
title: Overloading classes
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/overload-classes.html
sourceHash: bcac67b40c4450d6cef0303a7fe122b639549934
codeCheckedAgainst: "6.7.15.1"
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md"]
keywords: ["b2b_role.repository", "b2b_role.repository_abstract", "b2b_role.repository_class", "RoleRepository", "services.php", "ContainerConfigurator", "parent service", "abstract service", "service override", "dependency injection", "b2b suite", "decoration", "overload class"]
summary: "B2B Suite extension via DI: override a service id or its class parameter and set the abstract parent service to replace B2B classes."
lastBuilt: 2026-10-21
---
## What it is

How the B2B Suite is extended: instead of events and hooks, it uses [Dependency Injection](platform/dev/6.7/guides/plugins/plugins/services/dependency-injection.md) and Symfony parent services. Each B2B service has an abstract parent holding its arguments, and the concrete service's class is a container parameter, so plugins can swap the class or redefine the service id. The source links a downloadable `B2bServiceExtension` example plugin.

## When to use

When you need to add functionality to or change behaviour of an existing B2B Suite class (e.g. the role repository).

## Key steps / config

In the release package, `<plugin root>/src/Resources/config/services.php` defines an abstract service, a class parameter and a concrete service with that parent:

```php
$parameters->set('b2b_role.repository_class', RoleRepository::class);

$services->set('b2b_role.repository_abstract')
    ->abstract(true)
    ->args([service('dbal_connection'), service('b2b_common.repository_dbal_helper')]);

$services->set('b2b_role.repository', '%b2b_role.repository_class%')
    ->parent('b2b_role.repository_abstract');
```

The development (GitHub) version defines services directly with their classes (e.g. `b2b_role.grid_helper`, `b2b_role.crud_service`, `b2b_role.validation_service`, `b2b_role.acl_route_table` tagged `b2b_acl.table`); the release `services.php` files are generated automatically.

To overload, either change the parameter or overload the service id:

1. In your plugin's `services.php`, define a service with the same id and the B2B abstract service as parent, then add or override arguments:

```php
$services->set('b2b_role.repository', YourClass::class)
    ->parent('b2b_role.repository_abstract')
    ->args([service(YourClass::class)]);
```

2. Extend the B2B class and change the actions you need. The source example pops its own extra argument and forwards the rest:

```php
class YourRoleRepository extends RoleRepository
{
    public array $myService;

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
- `b2b_role.repository`, `b2b_role.repository_abstract`, `b2b_role.repository_class`
- `b2b_common.repository_dbal_helper`
- `Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator`

## Gotchas

- Plugin load order is not defined, so it cannot be said which overload wins; overload each class only once to avoid random errors.
- Because arguments come from the abstract parent and are forwarded with `func_get_args()`, the B2B Suite can add or remove constructor arguments without breaking your plugin, and needs fewer interfaces.

## Code check (6.7.15.1)
- unverified `RoleRepository` — B2B Suite plugin class (`Shopware\B2B`), not in the installed core/storefront/administration code
- unverified `b2b_role.repository_abstract` — B2B Suite service id, out of scope of the installed code
- unverified `b2b_common.repository_dbal_helper` — B2B Suite service id, out of scope of the installed code
- unverified `dbal_connection` — service id not defined in installed core/storefront/administration code
- unverified `ContainerConfigurator` — vendor/symfony, out of scope
