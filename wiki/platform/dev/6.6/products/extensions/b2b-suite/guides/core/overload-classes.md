---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/overload-classes.md
title: Overloading classes
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/overload-classes.html"
sourceHash: 4a8106ccecefde043176de501ae194dc2e0f0e70
keywords: ["overloading classes", "services.xml", "dependency injection", "b2b suite", "service container", "parent service", "abstract service", "b2b_role.repository", "RoleRepository", "DIC", "symfony service container"]
summary: "B2B Suite extension via Symfony DI: override a service id with a parent abstract service instead of using events/hooks."
lastBuilt: "2026-09-15"
---
## What it is
Explains how the B2B Suite uses Symfony's Dependency Injection service container, instead of events and hooks, to let plugins add or overload functionality.

## Key steps / config
The release `services.xml` defines an abstract parent service plus a concrete one bound via a parameter:

```xml
<container xmlns="http://symfony.com/schema/dic/services"
           xsi:schemaLocation="http://symfony.com/schema/dic/services http://symfony.com/schema/dic/services/services-1.0.xsd">
  <parameters>
    <parameter key="b2b_role.repository_class">Shopware\B2B\Role\Framework\RoleRepository</parameter>
  </parameters>
  <services>
    <service id="b2b_role.repository_abstract" abstract="true">
      <argument type="service" id="dbal_connection"/>
      <argument type="service" id="b2b_common.repository_dbal_helper"/>
    </service>
    <service id="b2b_role.repository" class="%b2b_role.repository_class%" parent="b2b_role.repository_abstract"/>
  </services>
</container>
```

To overload a service, define your own class with the **same service id** and set the shipped abstract service as its `parent`:

```xml
<service id="b2b_role.repository" class="Your/Class" parent="b2b_role.repository_abstract">
    <argument id="Your/own/class" type="service"/>
</service>
```

Your class extends the original and forwards remaining constructor args via `func_get_args()`/`array_pop()`/`parent::__construct(...$args)`:

```php
class YourRoleRepository extends RoleRepository
{
    public function __construct()
    {
        $args = func_get_args();
        $this->myService = array_pop($args);
        parent::__construct(...$args);
    }
}
```

This lets the suite add/remove constructor arguments without breaking plugins, and avoids adding many interfaces.

## Essential identifiers
- `services.xml`
- `b2b_role.repository_abstract`, `b2b_role.repository`
- `Shopware\B2B\Role\Framework\RoleRepository`

## Gotchas
Since load order between plugins is undefined, it is not guaranteed which plugin's overload of a class wins. Only overload each class once to avoid random errors.
