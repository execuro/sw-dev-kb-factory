---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md
sourceHash: 640b91462e2065c4ba41352e4b676bfb952d378b
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.html
title: Create permissions via plugin
version: "6.7"
versions:
  - "6.7"
keywords: ["PermissionCollectorSubscriber", "PermissionCollectorEvent", "PermissionCollector", "addPermission", "isB2bAllowed", "PermissionDeniedException", "EventSubscriberInterface", "b2b permissions", "employee role", "custom permission", "employee management", "role can"]
summary: Register custom B2B employee permissions via a PermissionCollectorEvent subscriber, then check them with isB2bAllowed in Twig or the role in controllers.
lastBuilt: 2026-10-21
---
## What it is

Guide for adding custom permissions to the B2B Components Employee Management module from a plugin. Permissions are registered by a Symfony event subscriber listening to `PermissionCollectorEvent`; the `PermissionCollector` gathers the permissions of all subscribers and passes them to the storefront, where a user can attach them to an employee role.

## When to use

A plugin adds its own B2B feature or entity and needs employee roles to be able to grant or deny read/edit/create/delete access to it, checked in Storefront templates and controllers.

## Key steps / config

1. Create a subscriber class (the guide names it `PermissionCollectorSubscriber`) implementing `Symfony\Component\EventDispatcher\EventSubscriberInterface`. Define a group constant and one constant per permission:

```php
public const OWN_ENTITY_GROUP  = 'own_entity';
public const OWN_ENTITY_READ   = 'own_entity.read';
public const OWN_ENTITY_EDIT   = 'own_entity.edit';
public const OWN_ENTITY_CREATE = 'own_entity.create';
public const OWN_ENTITY_DELETE = 'own_entity.delete';

public static function getSubscribedEvents(): array
{
    return [PermissionCollectorEvent::NAME => ['onAddOwnPermissions', 1000]];
}
```

2. In the listener, get the collection and add each permission with `addPermission(<permission>, <group>, <dependencies[]>)`:

```php
public function onAddOwnPermissions(PermissionCollectorEvent $event): void
{
    $collection = $event->getCollection();
    $collection->addPermission(self::OWN_ENTITY_READ, self::OWN_ENTITY_GROUP, []);
    $collection->addPermission(self::OWN_ENTITY_EDIT, self::OWN_ENTITY_GROUP, [self::OWN_ENTITY_READ]);
    // create/delete depend on read + edit
}
```

3. Check a permission in Twig with the `isB2bAllowed` function:

```twig
{% sw_extends '@Storefront/storefront/page/checkout/checkout-item.html.twig' %}
{% if isB2bAllowed(constant('PermissionCollectorSubscriber::OWN_ENTITY_READ')) %}...{% endif %}
```

4. In controllers, check via the employee's role and throw `PermissionDeniedException` when not allowed:
`$context->getCustomer()->getEmployee()->getRole()->can(PermissionCollectorSubscriber::OWN_ENTITY_READ)`.

## Essential identifiers

- `PermissionCollectorEvent`, `PermissionCollectorEvent::NAME`, `$event->getCollection()`, `addPermission()`
- `PermissionCollector`
- `isB2bAllowed` (Twig function)
- `getEmployee()->getRole()->can()`
- `PermissionDeniedException`
- `Symfony\Component\EventDispatcher\EventSubscriberInterface`

## Gotchas

- The source's listener body calls `addPermission()` with `self::EMPLOYEE_READ`/`EMPLOYEE_EDIT`/`EMPLOYEE_CREATE`/`EMPLOYEE_DELETE`, which the class never defines (it defines `OWN_ENTITY_*`); use your own constants as shown above. The Twig and controller samples likewise reference `PermissionCollectorSubscriber::EMPLOYEE_READ`.
- The source snippet has no `use` statement for `PermissionCollectorEvent`; its namespace is not given in the doc and is not part of Shopware core.
- All B2B identifiers on this page (`PermissionCollectorEvent`, `isB2bAllowed`, `getEmployee()`) come from the commercial B2B Components extension, not from Shopware core.

## Code check (6.7.15.1)
- unverified `PermissionCollectorEvent` — B2B Components (commercial extension), not in the installed core/storefront/administration code
- unverified `PermissionCollector` — B2B Components class, out of scope of installed core code
- unverified `isB2bAllowed` — Twig function provided by B2B Components, not registered in core/storefront
- unverified `CustomerEntity::getEmployee()` — B2B extension accessor; no `getEmployee()` in core
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
- unverified `@Storefront/storefront/page/checkout/checkout-item.html.twig` — no such template under storefront Resources/views in 6.7.15.1
- confirmed `sw_extends` — Shopware Twig tag registered by ExtendsTokenParser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- confirmed `SalesChannelContext::getCustomer()` — returns nullable CustomerEntity — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:132
- confirmed `PermissionDeniedException` — core API exception class — vendor/shopware/core/Framework/Api/Controller/Exception/PermissionDeniedException.php:13
